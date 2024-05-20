import type * as vscode from 'vscode';
import { HoverProvider_ahk } from './HoverProvider_ahk';

export const HoverProvider: vscode.HoverProvider = {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        const { languageId } = document;

        if (languageId === 'ahk') return HoverProvider_ahk(document, position);
        // if

        return null;
    },
};
