import * as vscode from 'vscode';
import type { TFnDef } from '../initialize';
import { VscMainMap } from '../VscMainMap';

function fnDef2Loc(fnDefList: TFnDef, originSelectionRange: vscode.Range): vscode.DefinitionLink[] {
    const { fullPath, pos: { line, col }, name } = fnDefList;
    return [{
        originSelectionRange,
        targetUri: vscode.Uri.file(fullPath),
        targetRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
    }];
}

export const DefinitionProvider: vscode.DefinitionProvider = {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        const range: vscode.Range | undefined = document.getWordRangeAtPosition(
            position,
            /(?<=["' \t,]|^)[\w.\-+\\]+/u,
        );
        if (range === undefined) return null;

        const word: string = document.getText(range);

        const dllRawNameInDoc: string = word
            .replace(/[\\/].*/u, '')
            .replace(/\.dll/iu, '');

        const v = VscMainMap.get(dllRawNameInDoc.toUpperCase());
        if (v === undefined) return null; // TODO

        const { dllMap, dllPath } = v;

        if (word.includes('/') || word.includes('\\')) {
            const fnRawName: string = word.replace(/.*[\\/]/u, '');
            const fnDefList: TFnDef | undefined = dllMap.get(fnRawName.toUpperCase());
            return fnDefList === undefined
                ? []
                : fnDef2Loc(fnDefList, range);
        }

        return [{
            originSelectionRange: range,
            targetUri: vscode.Uri.file(dllPath),
            targetRange: new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(0, 0),
            ),
        }];
    },
};
