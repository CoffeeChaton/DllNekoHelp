import * as vscode from 'vscode';

type TConfigsValue = {
    // ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll']
    tryGetWith: string[],
};

type TConfigs = {
    // ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll']
    [key: `[${string}]`]: TConfigsValue,
};

function upConfig(Configs: vscode.WorkspaceConfiguration): TConfigs {
    const ed: TConfigs = {
        '[ahk]': {
            tryGetWith: ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll'],
        },
        '[cpp]': {
            tryGetWith: ['User32.dll', 'Kernel32.dll'],
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
