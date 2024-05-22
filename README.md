# vscode-dll-neko-help

- [vscode-dll-neko-help](#vscode-dll-neko-help)
  - [Extensions for Visual Studio Code](#extensions-for-visual-studio-code)
    - [hover provide](#hover-provide)
    - [gotoDef provide](#gotodef-provide)
  - [config](#config)
  - [data source](#data-source)

## Extensions for Visual Studio Code

`DllNekoHelp` at github <https://github.com/CoffeeChaton/DllNekoHelp>

not provided to Visual Studio Marketplace now.

### hover provide

![img](https://raw.githubusercontent.com/CoffeeChaton/DllNekoHelp/main/img/Changelog/v0-0-0.gif)

### gotoDef provide

![alt text](https://raw.githubusercontent.com/CoffeeChaton/DllNekoHelp/main/img/Changelog/v0-0-0-hover-1.jpg)
![alt text](https://raw.githubusercontent.com/CoffeeChaton/DllNekoHelp/main/img/Changelog/v0-0-0-hover-2.jpg)

## config

```ts
const ed: TConfigs = {
    '[ahk]': {
        tryGetWith: ['User32.dll', 'Kernel32.dll', 'ComCtl32.dll', 'Gdi32.dll'],
    },
    '[markdown]': {
        tryGetWith: ['User32.dll', 'Kernel32.dll'],
    },
} as const;
```

## data source

about [data/baseline](./data/baseline/)

is from <https://github.com/microsoft/windows-rs/tree/master/crates/targets/baseline>
