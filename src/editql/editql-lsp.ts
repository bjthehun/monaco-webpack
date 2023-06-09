/**
 * LSP main file for EditQL.
 */

import {BrowserMessageReader, BrowserMessageWriter, Connection, createConnection} from "vscode-languageserver/browser";
import { createLanguageServices } from "./editql-module.js";
import { EmptyFileSystem, startLanguageServer } from "langium";

// TODO Get WebWorkers running. This will be fun.
declare const self: DedicatedWorkerGlobalScope;

// Browser Specific Setup Code
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection: Connection = createConnection(messageReader, messageWriter);

// Inject EditQL services
const { sharedServices } = createLanguageServices({connection, ...EmptyFileSystem});

// Start Server
startLanguageServer(sharedServices);