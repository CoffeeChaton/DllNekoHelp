import * as vscode from 'vscode';
import type { TDllMeta, TFnDef } from './initializeC';
import { initializeC } from './initializeC';

type TVscDll = TDllMeta & {
    md: vscode.MarkdownString,
};

export const VscMainMap: ReadonlyMap<string, TVscDll> = ((): ReadonlyMap<string, TVscDll> => {
    const map = new Map<string, TVscDll>();
    for (const [k, v] of initializeC()) {
        const md = new vscode.MarkdownString(`${v.dllRawName} has`, true);
        md.appendCodeblock(
            [...v.dllMap.values()]
                .map((fnDef: TFnDef): string => fnDef.fullFunc)
                .sort()
                .join('\n'),
        );

        map.set(k, { ...v, md });
    }
    return map;
})();
