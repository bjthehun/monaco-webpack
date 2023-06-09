import { AstNode, EmptyFileSystem, LangiumDocument} from "langium";
import { createLanguageServices } from "./editql-module.js";
import pkg from 'vscode-uri';
const { URI } = pkg;

const pathToQuery = URI.parse("memory://editql-query.document");

/**
 * Creates a document from the given content.
 * 
 * @param content - string
 * @returns Promise<LangiumDocument>
 */
export async function createQueryFromInput<T extends AstNode>(content: string): 
    Promise<T> {
    // Access services, set roadmap as required.
    const memoryServices = createLanguageServices(EmptyFileSystem).customServices;
    const ws = memoryServices.shared.workspace;

    // Create document from content, parse and validate.
    const document = ws.LangiumDocumentFactory.fromString(content, pathToQuery);
    await ws.DocumentBuilder.build(
        [document],
         {validationChecks: 'all'}
    );
    return document.parseResult?.value as T;
}