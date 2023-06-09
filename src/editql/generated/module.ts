/******************************************************************************
 * This file was generated by langium-cli 1.2.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import { LangiumGeneratedServices, LangiumGeneratedSharedServices, LangiumSharedServices, LangiumServices, LanguageMetaData, Module } from 'langium';
import { EditQlAstReflection } from './ast.js';
import { EditQLGrammar } from './grammar.js';

export const EditQLLanguageMetaData: LanguageMetaData = {
    languageId: 'edit-ql',
    fileExtensions: ['.eql'],
    caseInsensitive: false
};

export const EditQlGeneratedSharedModule: Module<LangiumSharedServices, LangiumGeneratedSharedServices> = {
    AstReflection: () => new EditQlAstReflection()
};

export const EditQLGeneratedModule: Module<LangiumServices, LangiumGeneratedServices> = {
    Grammar: () => EditQLGrammar(),
    LanguageMetaData: () => EditQLLanguageMetaData,
    parser: {}
};
