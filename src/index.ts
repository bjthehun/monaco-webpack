import { MonacoEditorLanguageClientWrapper, UserConfig } from 'monaco-editor-wrapper';


import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';

// helper function for loading monaco-editor's own workers
// import { buildWorkerDefinition } from 'monaco-editor-workers';
// buildWorkerDefinition('./node_modules/monaco-editor-workers/dist/workers', import.meta.url, false);

// no top-level await
const run = async () => {
  const wrapper = new MonacoEditorLanguageClientWrapper();

  // UserConfig is defined here: ./src/wrapper.ts#L45
  const userConfig: UserConfig = {
      htmlElement: document.getElementsByClassName('monaco-workbench')[0] as HTMLElement,
      // rely on regular monaco-editor configuration
      wrapperConfig: {
          useVscodeConfig: false
      },
      languageClientConfig: {
          enabled: false
      },
      editorConfig: {
          languageId: 'typescript',
          code: `function sayHello(): string {
    return "Hello";
};`,
          useDiffEditor: false,
          theme: "default"
      }
  };

  await wrapper.start(userConfig);
}


let paragraph = document.createElement("p");
paragraph.textContent = "Read this Paragraph:"
run();