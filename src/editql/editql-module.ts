/**
 * This module collects all language services we want to provide. LSP services, validation,
 * typing, runnings queries, etc. all go here.
 * 
 * @author Benedikt Jutz
 */
import { 
    AbstractExecuteCommandHandler,
    DefaultSharedModuleContext, 
    ExecuteCommandAcceptor, 
    LangiumServices, 
    LangiumSharedServices, 
    Module,
    PartialLangiumServices,
    createDefaultModule, createDefaultSharedModule, inject 
} 
from "langium";
import { EditQLGeneratedModule, EditQLGeneratedSharedModule } from "./generated/module.js";
import { EditQLValidator, configureValidations } from "./editql-validation.js";
import { createQueryFromInput } from "./editql-commands.js";

/**
 * This Command Provider contains all commands the LSP server should handle.
 */
class EditQLCommandProvider extends AbstractExecuteCommandHandler {
    registerCommands(acceptor: ExecuteCommandAcceptor): void {
        acceptor('parseQuery', args => {
            console.log("Parsing Query...");
            return createQueryFromInput(args[0]);
        });
    }
}

/**
 * Custom Language Services. Add additional services to include here.
 */
export type EditQLCustomServices = {
    // Statement Validation.
    StatementValidator: EditQLValidator;
};
/**
 * All services required for the language module.
 */
export type EditQLServices = LangiumServices & EditQLCustomServices;

/**
 * The actual language module. Add all services defined in EditQLCustomServices.
 * Do so by defining functions that construct them.
 */
export const EditQLModule: Module<EditQLServices, PartialLangiumServices & EditQLCustomServices> = {
    StatementValidator: () => new EditQLValidator(),
};

/**
 * Creates the required language services.
 * @param context - DefaultSharedModuleContext
 * @return 
 */
export function createLanguageServices(context: DefaultSharedModuleContext): {
    sharedServices: LangiumSharedServices,
    customServices: EditQLServices
} {
    // Injection of Defaults
    const sharedServices = inject(
        createDefaultSharedModule(context),
        EditQLGeneratedSharedModule
    );
    const customServices = inject(
        createDefaultModule({shared: sharedServices}),
        EditQLGeneratedModule,
        EditQLModule
    );
    // Add LSP commands
    sharedServices.lsp.ExecuteCommandHandler = new EditQLCommandProvider();
    // Service Registry -> Add own services.
    sharedServices.ServiceRegistry.register(customServices);
    configureValidations(customServices);
    return {sharedServices, customServices};
}