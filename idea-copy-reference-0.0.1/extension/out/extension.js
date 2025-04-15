"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
// 创建输出通道
let outputChannel;
function getOutputChannel() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('ZZ Remoter JVM Debug');
    }
    return outputChannel;
}
function log(message) {
    const channel = getOutputChannel();
    channel.appendLine(`[${new Date().toISOString()}] ${message}`);
    channel.show(true); // 确保输出面板可见
}
async function updateLaunchConfig(debugConfig) {
    try {
        // Get service name and tag from debug configuration
        const serviceName = debugConfig.serviceName;
        const tag = debugConfig.tag;
        if (!serviceName || !tag) {
            const errorMsg = 'Invalid debug configuration: missing serviceName or tag';
            log(errorMsg);
            vscode.window.showErrorMessage(errorMsg);
            await vscode.debug.stopDebugging();
            return undefined;
        }
        log(`Fetching debug info for service: ${serviceName}, tag: ${tag}`);
        // Step 1: Fetch IP and port from HTTP endpoint
        const response = await axios_1.default.get('http://qa.zhuaninc.com/api/docker/getIPAndDebugPort', {
            params: {
                clusterName: serviceName,
                tag: tag
            }
        });
        const { code, message } = response.data;
        if (0 !== code) {
            log(`API Error: ${message}`);
            vscode.window.showErrorMessage(message);
            // 终止当前的调试会话
            await vscode.debug.stopDebugging();
            throw new Error(message);
        }
        if (!response.data.result || !response.data.result.ip || !response.data.result.debugPort) {
            const errorMsg = 'Invalid response: missing IP or debug port';
            log(errorMsg);
            vscode.window.showErrorMessage(errorMsg);
            await vscode.debug.stopDebugging();
            throw new Error(errorMsg);
        }
        const { ip, debugPort } = response.data.result;
        log(`Received debug info - IP: ${ip}, Port: ${debugPort}`);
        // 验证 IP 和端口的有效性
        if (!ip || !debugPort) {
            const errorMsg = 'Invalid IP or debug port received';
            log(errorMsg);
            vscode.window.showErrorMessage(errorMsg);
            await vscode.debug.stopDebugging();
            throw new Error(errorMsg);
        }
        // Step 2: Use VS Code API to read and update launch.json
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            const errorMsg = 'No workspace folder open';
            log(errorMsg);
            vscode.window.showErrorMessage(errorMsg);
            await vscode.debug.stopDebugging();
            return undefined;
        }
        const wsFolder = workspaceFolders[0];
        const launchConfig = vscode.workspace.getConfiguration('launch', wsFolder.uri);
        const configurations = launchConfig.get('configurations');
        if (!configurations) {
            const errorMsg = 'Invalid launch.json: missing configurations array';
            log(errorMsg);
            vscode.window.showErrorMessage(errorMsg);
            await vscode.debug.stopDebugging();
            return undefined;
        }
        // Update the hostName and port in both the debug configuration and launch.json
        let found = false;
        configurations.forEach((config) => {
            if (config.name === debugConfig.name) {
                config.hostName = ip;
                config.port = debugPort;
                // 更新当前的调试配置
                debugConfig.hostName = ip;
                debugConfig.port = debugPort;
                found = true;
                log(`Updated configuration for ${config.name} with IP: ${ip}, Port: ${debugPort}`);
            }
        });
        if (!found) {
            const errorMsg = 'No Remote Debug configuration found in launch.json';
            log(errorMsg);
            vscode.window.showErrorMessage(errorMsg);
            await vscode.debug.stopDebugging();
            return undefined;
        }
        // Write the updated configuration back to launch.json
        await launchConfig.update('configurations', configurations, vscode.ConfigurationTarget.WorkspaceFolder);
        log('Successfully updated launch.json');
        // 显示成功信息
        const successMsg = `Debug configuration updated - IP: ${ip}, Port: ${debugPort}`;
        log(successMsg);
        vscode.window.showInformationMessage(successMsg);
        // 返回更新后的配置
        return debugConfig;
    }
    catch (error) {
        const errorMsg = `Failed to update launch configuration: ${error.message}`;
        log(errorMsg);
        vscode.window.showErrorMessage(errorMsg);
        await vscode.debug.stopDebugging();
        throw error; // 重新抛出错误以确保调试不会继续
    }
}
function activate(context) {
    // 初始化输出通道
    outputChannel = getOutputChannel();
    outputChannel.show(true); // 确保在激活时显示输出面板
    log('ZZ Remoter JVM Debug Extension is now active!');
    // Register debug configuration provider
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('java', {
        async resolveDebugConfiguration(folder, config) {
            if (config.serviceName && config.tag) {
                log(`Resolving debug configuration: ${config.name}`);
                try {
                    // 等待配置更新完成并获取更新后的配置
                    const updatedConfig = await updateLaunchConfig(config);
                    if (!updatedConfig) {
                        log('Failed to update configuration');
                        return undefined;
                    }
                    log('Successfully resolved debug configuration');
                    return updatedConfig;
                }
                catch (error) {
                    log(`Error during configuration resolution: ${error}`);
                    // 返回 undefined 来阻止调试会话启动
                    return undefined;
                }
            }
            return config;
        }
    }));
    // 将输出通道添加到订阅中，以便在扩展停用时正确处理
    context.subscriptions.push(outputChannel);
}
function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}
//# sourceMappingURL=extension.js.map