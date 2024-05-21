import * as vscode from 'vscode';
import { getConfig } from '../config';
import type { TFnDef } from '../initialize';
import { Regex_ahk_word } from '../tools/regex';
import type { TVscDll } from '../VscMainMap';
import { VscMainMap } from '../VscMainMap';

function ahkMakeHoverMd(dllDef: TVscDll, fnDef: TFnDef, range: vscode.Range): vscode.Hover {
    const fnMd = new vscode.MarkdownString(`${dllDef.dllRawName}\\${fnDef.name}`, true);
    fnMd.appendCodeblock(fnDef.fullSign, 'c');
    return new vscode.Hover(fnMd, range);
}

function ahkTryAutoAddSuffixAW(dllDef: TVscDll, fnNameUp: string): TFnDef | null {
    if (getConfig()['[ahk]'].tryAutoAddSuffixAW) {
        const fnDefAW: TFnDef | undefined = dllDef.dllMap.get(`${fnNameUp}A`)
            ?? dllDef.dllMap.get(`${fnNameUp}W`);
        if (fnDefAW !== undefined) return fnDefAW;
    }
    return null;
}

function ahkNotHeapCase(fnName: string, range: vscode.Range): vscode.Hover | null {
    const fnNameUp: string = fnName.toUpperCase();
    const config: string[] = getConfig()?.['[ahk]']?.tryGetWith
        ?? ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll'];

    const configDllList: string[] = config.map(
        (s: string): string => s.replace(/\.dll/iu, '').toUpperCase(),
    );

    for (const dllUpName of configDllList) {
        const dllDef: TVscDll | undefined = VscMainMap.get(dllUpName);
        if (dllDef === undefined) continue;

        const fnDef: TFnDef | null = dllDef.dllMap.get(fnNameUp) ?? ahkTryAutoAddSuffixAW(dllDef, fnNameUp);
        if (fnDef !== null) return ahkMakeHoverMd(dllDef, fnDef, range);
    }
    return null;
}

export function HoverProvider_ahk(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Hover | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, Regex_ahk_word);
    if (range === undefined) return null;

    const word: string = document.getText(range);

    const dllRawNameInDoc: string = word
        .replace(/[\\/].*/u, '')
        .replace(/\.dll/iu, '');

    const dllDef: TVscDll | undefined = VscMainMap.get(dllRawNameInDoc.toUpperCase());
    if (dllDef === undefined) return ahkNotHeapCase(dllRawNameInDoc, range);

    const { md, dllMap } = dllDef;

    if (word.includes('/') || word.includes('\\')) {
        const fnRawName: string = word.replace(/.*[\\/]/u, '');
        const fnNameUp: string = fnRawName.toUpperCase();
        const fnDef: TFnDef | null = dllMap.get(fnRawName.toUpperCase())
            ?? ahkTryAutoAddSuffixAW(dllDef, fnNameUp);
        if (fnDef !== null) return ahkMakeHoverMd(dllDef, fnDef, range);
    }

    return new vscode.Hover(md);
}
