import { AstNode, EmptyFileSystem } from "langium";
import { createLanguageServices } from "./editql-module.js";
import * as uriAPI from 'vscode-uri';

export const pathToQuery = uriAPI.URI.parse("memory://currentQuery.eql");

/**
 * Creates a document from the given content.
 * 
 * @param content - string
 * @returns Promise<LangiumDocument>
 */
export async function createQueryFromInput<T extends AstNode>(content: string) {
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