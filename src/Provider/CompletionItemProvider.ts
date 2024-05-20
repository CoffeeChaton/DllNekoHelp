import type * as vscode from 'vscode';
import { CompletionItemProvider_ahk } from './CompletionItemProvider_ahk';

export const CompletionItemProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext,
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const { languageId } = document;

        if (languageId === 'ahk') return CompletionItemProvider_ahk(document, position, context);
        // if
        //
        return null;
    },
};
