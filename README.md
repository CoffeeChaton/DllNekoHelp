# vscode-dll-neko-help

- [vscode-dll-neko-help](#vscode-dll-neko-help)
  - [Extensions for Visual Studio Code](#extensions-for-visual-studio-code)
    - [hover provide](#hover-provide)
    - [gotoDef provide](#gotodef-provide)
  - [config](#config)
  - [data source](#data-source)

## Extensions for Visual Studio Code

this pack at github <https://github.com/CoffeeChaton/DllNekoHelp>

`DllNekoHelp`

not provided to Visual Studio Marketplace now.

### hover provide

### gotoDef provide

## config

```ts
const ed: TConfigs = {
    '[ahk]': {
        tryGetWith: ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll'],
    },
    '[cpp]': {
        tryGetWith: ['User32.dll', 'Kernel32.dll'],
    },
} as const;
```

## data source

about [data/baseline](./data/baseline/)

is from <https://github.com/microsoft/windows-rs/tree/master/crates/targets/baseline>
