import assert from 'assert';
import { createQueryFromInput } from '../../src/editql/editql-commands.js';
import * as fs from "fs";

/**
 * Test that the given query is parsed without errors.
 * 
 * @param queryName 
 */
async function parseQueryCorrectly(queryName: string) {
    const queryToParse = fs.readFileSync(
        'test/editql/examples' + queryName, "utf-8"
    );
    const parseResult = await createQueryFromInput(queryToParse);
    assert(!parseResult.$document?.diagnostics || parseResult.$document?.diagnostics.length == 0, "Parse Error Occurred somehow");
}

/**
 * Test that the given query does contain errors.
 * 
 * @param queryName 
 */
async function parseQueryExpectError(queryName: string) {
    const queryToParse = fs.readFileSync(
        'test/editql/examples' + queryName, "utf-8"
    );
    const parseResult = await createQueryFromInput(queryToParse);
    assert(parseResult.$document?.diagnostics && parseResult.$document?.diagnostics.length > 0, "No Parse Error detected when expected");
    console.log(parseResult.$document?.diagnostics);
}

// Part of a Test Suite
describe('EditQL', () => {
    describe('Syntax Tests', () => {
        // it describes test case. 
        // Define async function to test async code.
        it('Parse Single-Line Query without Errors', () => {
            parseQueryCorrectly('query0');
        }),
        it('Parse Multi-Line Query without Errors', () => {
            parseQueryCorrectly('query1');
        })
        it('Parse Query With Error', () => {
            parseQueryExpectError('query2');
        })
    })
})