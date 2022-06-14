"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withReactNativePerformanceFlipperPlugin = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function modifyAppDelegateImport(src) {
    const newSrc = `#ifdef FB_SONARKIT_ENABLED
  #import <FlipperKit/FlipperClient.h>
  #import <FlipperPerformancePlugin.h>
#endif`;
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-performance-plugin-expo-import",
        src,
        newSrc,
        anchor: /@implementation AppDelegate/,
        offset: -1,
        comment: "//",
    });
}
function modifyAppDelegateLaunchingCode(src) {
    const newSrc = `  #ifdef FB_SONARKIT_ENABLED
    FlipperClient * client = [FlipperClient sharedClient];
    [client addPlugin: [FlipperPerformancePlugin new]];
  #endif`;
    return (0, generateCode_1.mergeContents)({
        tag: "react-native-performance-plugin-expo-launchingcode",
        src,
        newSrc,
        anchor: /didFinishLaunchingWithOptions:/,
        offset: 2,
        comment: "//",
    });
}
function withIosPlugin(config) {
    return (0, config_plugins_1.withAppDelegate)(config, (config) => {
        if (["objc", "objcpp"].includes(config.modResults.language)) {
            config.modResults.contents = modifyAppDelegateImport(config.modResults.contents).contents;
            config.modResults.contents = modifyAppDelegateLaunchingCode(config.modResults.contents).contents;
        }
        else {
            config_plugins_1.WarningAggregator.addWarningIOS("withReactNativePerformanceFlipperPlugin", `Cannot setup react-native-performance for Expo, the project AppDelegate is not a supported language: ${config.modResults.language}`);
        }
        return config;
    });
}
async function readFileAsync(path) {
    return fs_1.default.promises.readFile(path, "utf8");
}
async function saveFileAsync(path, content) {
    return fs_1.default.promises.writeFile(path, content, "utf8");
}
function getDebugRoot(projectRoot) {
    return path_1.default.join(projectRoot, "android", "app", "src", "debug", "java");
}
async function addReactNativePerformancePluginForExpoAndroid(config) {
    if (config.android) {
        const projectRoot = config.modRequest.projectRoot;
        const packageDebugRoot = getDebugRoot(projectRoot);
        const packageName = config.android.package || "";
        const reactNativeFlipperFilePath = path_1.default.join(packageDebugRoot, `${packageName.split(".").join("/")}/ReactNativeFlipper.java`);
        try {
            // since there is no mod to get the contents of the file, we need to read it first
            const reactNativeFlipperContents = await readFileAsync(reactNativeFlipperFilePath);
            // store it for later use
            let patchedContents = reactNativeFlipperContents;
            // modify the contents of the file
            patchedContents = (0, generateCode_1.mergeContents)({
                tag: "react-native-performance-plugin-expo-import",
                src: patchedContents,
                newSrc: "import tech.bam.rnperformance.flipper.RNPerfMonitorPlugin;",
                anchor: "import okhttp3.OkHttpClient;",
                offset: 1,
                comment: "//",
            }).contents;
            // modify the contents of the file
            patchedContents = (0, generateCode_1.mergeContents)({
                tag: "react-native-performance-plugin-expo-addplugin",
                src: patchedContents,
                newSrc: `      client.addPlugin(new RNPerfMonitorPlugin());`,
                anchor: /client.start()/g,
                offset: -1,
                comment: "//",
            }).contents;
            // save the file
            return await saveFileAsync(reactNativeFlipperFilePath, patchedContents);
        }
        catch (e) {
            // TODO: should we throw instead?
            config_plugins_1.WarningAggregator.addWarningAndroid("react-native-performance Expo Plugin", `Couldn't modify ReactNativeFlipper.java - ${e}.`);
        }
    }
}
const withAndroidPlugin = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            await addReactNativePerformancePluginForExpoAndroid(config);
            return config;
        },
    ]);
};
const withReactNativePerformanceFlipperPlugin = (config) => {
    config = withIosPlugin(config);
    config = withAndroidPlugin(config);
    return config;
};
exports.withReactNativePerformanceFlipperPlugin = withReactNativePerformanceFlipperPlugin;
exports.default = exports.withReactNativePerformanceFlipperPlugin;
