import * as vscode from 'vscode';
import { getConfig } from './config';
import { CompletionItemProvider } from './Provider/CompletionItemProvider';
import { DefinitionProvider } from './Provider/DefinitionProvider';
import { HoverProvider } from './Provider/HoverProvider';

// main
export function activate(context: vscode.ExtensionContext): void {
    // const selector: vscode.DocumentSelector = [{ language: 'ahk' }]; // TODO from config

    const selector: vscode.DocumentSelector = Object.keys(getConfig())
        .map((s: string): { language: string } => ({
            language: s
                .replace('[', '')
                .replace(']', ''),
        }));

    // getConfig()
    const triggerCharacters: readonly string[] = [
        '\\',
        '.',
        '"',
        '\'',
    ];

    // TODO User32.dll, Kernel32.dll, ComCtl32.dll, or Gdi32.dll
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(selector, HoverProvider),
        vscode.languages.registerDefinitionProvider(selector, DefinitionProvider),
        vscode.languages.registerCompletionItemProvider(selector, CompletionItemProvider, ...triggerCharacters),
    );
}

export function deactive(): void {
    //
}

// about com help
// com
//     Visio.
// Publisher.

// api_type:
// - DllExport

// api_type:
// - COM
//
