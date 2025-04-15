# ZZ Remoter JVM Debug

这是一个用于转转docker远程调试 Java 应用程序的 VS Code 扩展。它简化了在 Docker 环境中调试 Java 应用的过程。

## 功能

- 自动获取远程调试的 IP 和端口
- 简化的配置过程，只需要提供 `serviceName` 和 `tag`
- 支持动态配置更新

## 使用方法

1. 在 VS Code 中安装此扩展
2. 在 `.vscode/launch.json` 中添加以下配置：

```json
{
    "type": "java",
    "name": "ZZ Remote Debug",
    "request": "attach",
    "serviceName": "your-service-name",
    "tag": "your-service-tag"
}
```

3. 使用 F5 或调试面板启动调试会话

## 配置说明

- `serviceName`: 要调试的服务名称
- `tag`: 服务标签，用于标识特定的服务实例

## 要求

- VS Code 1.96.0 或更高版本
- Java 运行时环境

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
