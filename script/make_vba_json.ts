/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
import * as fs from 'node:fs';
import * as path from 'node:path';
//

type TBase = {
    api_name: string,
    main: string,
};

type TMdDataBase = TBase & {
    // normal
    kind: 'collection',
};
type TEnum = TBase & {
    kind: 'enumeration',
    // also can let ^title:.*enumeration \(
};

type TObject = TBase & {
    kind: 'object',
    //
    Events: string[],
    Methods: string[],
    Properties: string[],
};

type TOther = TBase & {
    kind: 'method' | 'property' | 'event',
    //
    Parameters: string[],
    Return_value: string,
};

type TApiMeta = TMdDataBase | TObject | TEnum | TOther;
// object
// - Events
// - Methods
// - Properties

// method/property/event
// - Parameters
// - Return_value

type TObjCh = {
    need: string[],
    line: number,
};

function getObjCh(dataList: string[], startLine: number, regCase: 1 | 2): TObjCh {
    const { length } = dataList;
    const need: string[] = [];
    let line = startLine;
    for (line = startLine + 1; line < length; line++) {
        const s2: string = dataList[line];
        if (s2 === '') continue;
        if (s2.startsWith('##')) break;

        const ma: RegExpMatchArray | null = regCase === 1
            ? s2.match(/^-\s*\[([^\]]+)\]|^\|\s*\[([^\]]+)\]/u)
            : s2.match(/^\|\s*_(\w+)_\s*\|/u);
        if (ma === null) continue;
        const maa: string = ma[1] ?? ma[2] ?? '';
        if (maa !== '') need.push(maa);
    }

    line -= 1;
    return {
        need,
        line,
    };
}

/**
 * @param source_path https://github.com/MicrosoftDocs/VBA-Docs/tree/main/api
 * @param export_path pleas check `Excel.json` ...etc exist
 */
export function make_vba_json(source_path: string, export_path: string): void {
    const bigObj: Record<string, TApiMeta[]> = {
        Excel: [],
        Office: [],
        Outlook: [],
        Publisher: [],
        Visio: [],
        Word: [],
        unknown: [],
    };
    const fsPath: string = source_path;

    const files: string[] = fs.readdirSync(fsPath);
    for (const file of files) {
        if (!file.endsWith('.md')) continue;
        // const fullPath = `${fsPath}/${file}`;
        const fullPath = `${fsPath}${path.sep}${file}`;

        const dataList: string[] = fs.readFileSync(fullPath)
            .toString()
            .split('\n');
        const { length } = dataList;

        // ----
        let inHead = false;
        let title = '';
        let kind = '';
        let api_name = '';

        let inMain = false;
        let main = '';
        const Events: string[] = [];
        const Methods: string[] = [];
        const Properties: string[] = [];
        const Parameters: string[] = [];
        let Return_value = '';
        for (let line = 0; line < length; line++) {
            const s: string = dataList[line];
            if (s === '---') {
                inHead = !inHead;
            }
            if (inHead) {
                if (s.startsWith('title: ')) {
                    title = s.replace('title: ', '');
                    kind = title.match(/ (\w+) /iu)?.[1] ?? '';
                    continue;
                }
                if (s.startsWith('api_name:')) {
                    api_name = dataList[line + 1].replace('- ', '');
                    continue;
                }

                continue;
            }

            if (s.startsWith('# ')) {
                inMain = true;
                continue;
            }

            if (s.startsWith('## ')) {
                inMain = false;
                if (s.startsWith('## Events')) {
                    const ch: TObjCh = getObjCh(dataList, line, 1);
                    line = ch.line;
                    Events.push(...ch.need);
                } else if (s.startsWith('## Methods')) {
                    const ch: TObjCh = getObjCh(dataList, line, 1);
                    line = ch.line;
                    Methods.push(...ch.need);
                } else if (s.startsWith('## Properties')) {
                    const ch: TObjCh = getObjCh(dataList, line, 1);
                    line = ch.line;
                    Properties.push(...ch.need);
                } else if (s.startsWith('## Parameters')) {
                    const ch: TObjCh = getObjCh(dataList, line, 2);
                    line = ch.line;
                    Parameters.push(...ch.need);
                } else if (s.startsWith('## Return value')) {
                    for (line += 1; line < length; line++) {
                        const s2: string = dataList[line].trim();
                        if (s2 === '') continue;
                        if (s2.startsWith('##')) break;
                        Return_value += `${s2}\n`;
                    }
                    line -= 1;
                }
            }

            if (inMain && s !== '') main += `${s}\n`;
        }

        if (api_name === '') continue;
        const need: TApiMeta[] = bigObj[api_name.replace(/\..*/u, '')]
            // eslint-disable-next-line dot-notation
            ?? bigObj['unknown'];

        switch (kind) {
            case 'collection':
            case 'enumeration':
                need.push({
                    kind,
                    api_name,
                    main,
                });
                break;

            case 'object':
                need.push({
                    kind,
                    api_name,
                    main,
                    Events,
                    Methods,
                    Properties,
                });
                break;

            case 'method':
            case 'property':
            case 'event':
                need.push({
                    kind,
                    api_name,
                    main,
                    Parameters,
                    Return_value,
                });
                break;
            default:
                break;
        }
    }

    const space4 = 4;
    for (const [k, v] of Object.entries(bigObj)) {
        fs.writeFileSync(`${export_path}${k}.json`, JSON.stringify(v, null, space4));
    }
}
