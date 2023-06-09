/**
 * Validation Checks for EditQL queries/statements.
 */
import { ValidationAcceptor, ValidationChecks} from "langium"
import { EditQLServices } from "./editql-module.js";
import {EditQlAstType, Query} from "./generated/ast.js"

/**
 * Configures Validation services.
 */
export function configureValidations(languageServices: EditQLServices) {
    // Get Validator, Registry, Define Checks
    const registry = languageServices.validation.ValidationRegistry;
    const validator = languageServices.StatementValidator;
    const checks: ValidationChecks<EditQlAstType> = {
    }
    registry.register(checks, validator);
}

export const UnknownUserError = 1;

export class EditQLValidator {

    /**
     * Tests whether in the given statement, the user referenced by their name actually exists.
     * 
     * @param query - Query
     * @param report - ValidationAcceptor
     */
    checkForExistenceOfName(query: Query, report: ValidationAcceptor): void {
        const userName = query.userName;
    }
}