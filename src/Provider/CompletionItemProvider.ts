import * as vscode from 'vscode';
import { VscMainMap } from '../initializeVsc';

const fullDllCompletions: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const completions: vscode.CompletionItem[] = [];
    for (const [_k, v] of VscMainMap) {
        const completion = new vscode.CompletionItem({
            label: v.dllRawName,
            description: 'dll',
        });

        completion.detail = '(dll-help)'; // description
        completion.documentation = v.md;
        completion.kind = vscode.CompletionItemKind.File;
        completions.push(completion);
    }
    return completions;
})();

function CompletionItemCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.CompletionContext,
): vscode.CompletionItem[] {
    if (context.triggerCharacter === '\\') {
        console.log('🚀 ~ triggerCharacter is', '\\');
        return [];
    }

    return [...fullDllCompletions];
}

export const CompletionItemProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext,
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        return CompletionItemCore(document, position, context);
    },
};
