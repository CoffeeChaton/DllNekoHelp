import * as vscode from 'vscode';

type TConfigsValue = {
    // ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll']
    tryGetWith: string[],
    tryAutoAddSuffixAW: boolean, // an A (ANSI) or W (Unicode) suffix ... https://www.autohotkey.com/docs/v1/lib/DllCall.htm
};

type TConfigs = {
    // ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll']
    [key: `[${string}]`]: TConfigsValue,
};

function upConfig(Configs: vscode.WorkspaceConfiguration): TConfigs {
    const ed: TConfigs = {
        '[ahk]': {
            tryGetWith: ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll'],
            tryAutoAddSuffixAW: true, // only of ahk
        },
        '[cpp]': {
            tryGetWith: ['User32.dll', 'Kernel32.dll'],
            tryAutoAddSuffixAW: false,
        },
    } as const;

    return ed;
}

let config: TConfigs = upConfig(vscode.workspace.getConfiguration('DllNekoHelp'));

export function configChangEvent(): void {
    config = upConfig(vscode.workspace.getConfiguration('DllNekoHelp'));
}

export function getConfig(): TConfigs {
    return config;
}
