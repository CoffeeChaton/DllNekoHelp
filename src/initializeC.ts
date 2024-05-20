/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
/* eslint-disable dot-notation */
import * as fs from 'node:fs';
import * as path from 'node:path';

export type TFnDef = {
    // fullFunc: string,
    fullFunc: string,
    name: string,
    file: string,
    fullPath: string,
    pos: {
        line: number,
        col: number,
    },
};

export type TDllCMap = Map<string, TFnDef>;

export type TDllMeta = {
    dllRawName: string,
    dllMap: TDllCMap,
    dllPath: string,
};
/**
 *  xxx.dll
 *  has Map<fnName, TFnDef[] >
 */
export type TMainMap = ReadonlyMap<string, TDllMeta>;

export function initializeC(): TMainMap {
    const absolutePath: string = path.join(__dirname, '../data/baseline');
    const files: string[] = fs.readdirSync(absolutePath);

    const mainMap = new Map<string, TDllMeta>();

    for (const file of files) {
        // const fullPath = `${absolutePath}/${file}`;
        const dllRawName: string = file.replace(/\.c$/iu, '');
        const dllUpName: string = dllRawName.toUpperCase();
        const fullPath = `${absolutePath}${path.sep}${file}`;

        let dataFromJson: string = fs.readFileSync(fullPath).toString();
        const dataLineStr: string[] = dataFromJson.split('\n');
        dataFromJson = '';
        const { length } = dataLineStr;
        //
        const dllMap: TDllCMap = new Map();
        for (let line = 0; line < length; line++) {
            const s: string = dataLineStr[line];
            for (const ma of s.matchAll(/(\w+)\(.*\)/giu)) {
                const v: TFnDef = {
                    fullFunc: ma[0],
                    name: ma[1],
                    file,
                    fullPath,
                    pos: {
                        line,
                        col: ma.index,
                    },
                };
                const fnUpName: string = ma[1].toUpperCase();
                dllMap.set(fnUpName, v);
            }
        }
        //
        mainMap.set(
            dllUpName.replace(/\.dll$/iu, ''),
            { dllRawName, dllMap, dllPath: fullPath },
        );
    }

    return mainMap;
}