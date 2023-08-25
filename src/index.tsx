import { BrowserMessageReader, BrowserMessageWriter } from "vscode-languageserver/browser.js";
import { EditorClassic, UserConfig} from "monaco-editor-wrapper";
import { initServices, MonacoLanguageClient } from "monaco-languageclient";
import { MessageTransports, ErrorAction, CloseAction } from "vscode-languageclient/lib/common/client.js";
import { buildWorkerDefinition } from "monaco-editor-workers";
import { Component, createRef, render } from "preact";

/**
 * Shared Properties:
 * Contains the Language Server 
 */
interface QuerySidebarProps {
    queryLSP?: Worker;
}

/**
 * QuerySidebar defines a sidebar where a user can type queries and get results.
 */
export class QuerySidebar extends Component<QuerySidebarProps>{
    constructor() {
        super();
    }

    render() {
        return <div id="sidebar">
            Enter your Query here:
            <QueryEditorInput
                queryLSP={this.props.queryLSP}
            />
            <input value="Run Query" type="submit"/>
        </div>;
    }
}

interface QuerySidebarProps {}

/**
 * QueryEditorInput has a divider to place the actual editor in.
 */
export class QueryEditorInput extends Component<QuerySidebarProps> {
    /**
     * Variable that tells us if VSCode API for Monaco was already initialized.
     */
    static wasVSCodeAPIInitialized: boolean = false;

    /**
     * Editor to use.
     */
    monacoEditor?: EditorClassic;
    /**
     * Language Client the editor uses.
     */
    languageClient?: MonacoLanguageClient;
    /**
     * Reference to add the editor to.
     */
    ref = createRef<HTMLDivElement>();

    constructor() {
        super();
    }

    /**
     * Do not create the editor twice.
     */
    shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean {
        return true;
    }

    /**
     * Upon rendering, install the editor component.
     */
    componentDidMount(): void {
        if (this.monacoEditor || !this.ref.current) {
            return;
        }
        console.log("Starting Editor...");

        // buildWorkerDefinition('node_modules/monaco-editor-workers/dist/workers', "http://localhost:8080", false);

        // Create a new Monaco Editor: Provide Configuration.
        const exampleQuery = 'QUERY EDITS WITH AUTO = "bjthehun';
        const userConfig : UserConfig = {
            wrapperConfig: {
                useVscodeConfig: true,
                // Required services
                serviceConfig: {
                    debugLogging: true,
                    enableLanguagesService: true,
                    enableModelService: true,
                    configureEditorOrViewsServiceConfig: {
                        enableViewsService: false,
                        useDefaultOpenEditorFunction: true
                    },
                    configureConfigurationServiceConfig: {
                        defaultWorkspaceUri: '/tmp/'
                    }
                }
            },
            // Dummy Language Client Config.
            languageClientConfig: {
                enabled: false
            },
            // Editor Config: Use Light Theme, disable minimap.
            editorConfig: {
                languageId: "edit-ql",
                useDiffEditor: false,
                code: exampleQuery,
                theme: "vs-light",
            },
            htmlElement: this.ref.current as HTMLElement,
        };
    
        // Prepare Editor itself
        this.monacoEditor = new EditorClassic("1", userConfig);
        this.loadEditor(userConfig).then(() => console.log("Editor ready"));
    }

    loadEditor = async (userConfig: UserConfig) => {
        if (!QueryEditorInput.wasVSCodeAPIInitialized) {
            await initServices(userConfig.wrapperConfig.serviceConfig);
            QueryEditorInput.wasVSCodeAPIInitialized = true;
        }
        await this.monacoEditor?.init();
        await this.monacoEditor?.createEditors(this.ref.current as HTMLElement);
        await this.connectToWorker();
    }

    connectToWorker = async() => {
        if (!this.props.queryLSP) {
            Promise.reject("Language Server is not ready.")
        }
        else {
            // Create a Connection to the worker.
            const connection: MessageTransports = {
                reader: new BrowserMessageReader(this.props.queryLSP),
                writer: new BrowserMessageWriter(this.props.queryLSP)
            }

            // Create the language client.
            this.languageClient = new MonacoLanguageClient({
                name: "Monaco Language Client for EditQL LSP",
                // Use for Queries
                clientOptions: {
                    documentSelector: [{language: "edit-ql"}],
                    // Disable default error handlers
                    errorHandler: {
                        error: () => ({
                            action: ErrorAction.Continue
                        }),
                        closed: () => ({
                            action: CloseAction.DoNotRestart
                        })
                    }
                },
                connectionProvider: {
                    get: () => {return Promise.resolve(connection)}
                }
            });
            // Close connection as required.
            connection.reader.onClose(() => this.languageClient?.stop());
            // Attempt to start the client.
            this.languageClient.start().then(
                () => console.log("Connection is ready.")
            );
            Promise.resolve();
        }
    }

    /**
     * Upon unmounting, uninstall the editor.
     */
    componentWillUnmount(): void {
        // Dispose connection.
        this.languageClient?.dispose();
        this.languageClient = undefined;
        // Dispose editor
        this.monacoEditor?.disposeEditor();
        this.monacoEditor = undefined;

        console.log("Editor disposed");
    }

    /**
     * Renders the input element.
     * @returns Element
     */
    render() {
        return <div>
            <div id="editql-editor" ref={this.ref} style="height: 300px"></div>
        </div>;
    }
}

// Create LSP worker
const newWorker: QuerySidebarProps = {
    queryLSP: new Worker(
        new URL('./editql/editql-lsp.js', import.meta.url), {
            name: "Language Server for Queries",
            type: "classic"
        }
    )
}

const component = <QuerySidebar queryLSP={newWorker.queryLSP}/>;
render(component, document.body);