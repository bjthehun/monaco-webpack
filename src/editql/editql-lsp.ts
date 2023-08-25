/**
 * LSP main file for EditQL.
 */

import {BrowserMessageReader, BrowserMessageWriter, Connection, createConnection} from "vscode-languageserver/browser.js";
import { createLanguageServices } from "./editql-module.js";
import { EmptyFileSystem, startLanguageServer } from "langium";

declare const self: DedicatedWorkerGlobalScope;

// Browser Specific Setup Code
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection: Connection = createConnection(messageReader, messageWriter);

// Inject EditQL services
const { sharedServices } = createLanguageServices({connection, ...EmptyFileSystem});

// Start Server
startLanguageServer(sharedServices);