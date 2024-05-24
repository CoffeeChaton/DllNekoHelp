import * as vscode from 'vscode';
import { Regex_ahk_word } from '../tools/regex';
import type { TVscDll } from '../VscMainMap';
import { VscMainMap } from '../VscMainMap';

const fullDllCompletions_ahk: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const completions: vscode.CompletionItem[] = [];
    for (const [_k, v] of VscMainMap) {
        const completion = new vscode.CompletionItem({
            label: v.dllRawName.replace(/\.dll/iu, ''),
            description: 'dll',
        });
        completion.insertText = v.dllRawName;
        completion.detail = '(dll-help)'; // description
        completion.documentation = v.md;
        completion.kind = vscode.CompletionItemKind.File;
        completions.push(completion);
    }
    return completions;
})();

//
function Completion_func_ahk(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, Regex_ahk_word);
    if (range === undefined) return [];

    const word: string = document.getText(range);

    const dllRawNameInDoc: string = word
        .replace(/[\\/].*/u, '')
        .replace(/\.dll/iu, '');

    const dllDef: TVscDll | undefined = VscMainMap.get(dllRawNameInDoc.toUpperCase());
    if (dllDef === undefined) return [];

    const { dllRawName, dllMap } = dllDef;

    const completions: vscode.CompletionItem[] = [];
    for (const [_k, v] of dllMap) {
        const completion = new vscode.CompletionItem({
            label: v.name,
            description: 'dll-func',
        });

        completion.detail = '(dll-help)'; // description
        const md = new vscode.MarkdownString(
            `${dllRawName}\\${v.name}\n\n`,
            true,
        );
        md.appendCodeblock(v.fullSign, 'c');
        completion.documentation = md;
        completion.kind = vscode.CompletionItemKind.Function;
        completions.push(completion);
    }
    return completions;
}
//
export function CompletionItemProvider_ahk(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.CompletionContext,
): vscode.CompletionItem[] {
    if (context.triggerCharacter === '\\') {
        return Completion_func_ahk(document, position);
    }

    const leftText: string = document.getText(
        new vscode.Range(
            new vscode.Position(position.line, 0),
            position,
        ),
    );

    if ((/\bDllCall\(\s*"?/iu).test(leftText.trim())) {
        return [...fullDllCompletions_ahk];
    }

    return [];
}
