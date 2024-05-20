import * as vscode from 'vscode';
import type { TFnDef } from '../initializeC';
import { VscMainMap } from '../initializeVsc';

export const HoverProvider: vscode.HoverProvider = {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        //
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
        if (v === undefined) return null;

        const { md, dllMap, dllRawName } = v;

        if (word.includes('/') || word.includes('\\')) {
            const fnRawName: string = word.replace(/.*[\\/]/u, '');
            const fnDef: TFnDef | undefined = dllMap.get(fnRawName.toUpperCase());
            if (fnDef !== undefined) {
                //
                const fnMd = new vscode.MarkdownString(`${dllRawName}/${fnRawName}`, true);
                // eslint-disable-next-line no-magic-numbers
                fnMd.appendCodeblock(JSON.stringify(fnDef, null, 4), 'jsonc');
                return new vscode.Hover(fnMd, range);
            }
        }

        return new vscode.Hover(md);
    },
};
