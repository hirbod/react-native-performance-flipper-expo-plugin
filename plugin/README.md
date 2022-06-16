### NOTICE
We included this plugin directly into the main package!\
https://github.com/bamlab/react-native-performance
---

This is a plugin for [react-native-performance-flipper](https://github.com/bamlab/react-native-performance)
To install react-native-performance for Expo, a few things need to be done in advance.

## Usage (Quick Guide)

1. This plugin does not work with Expo Go, but only with a custom dev client of Expo.

2. Install the **Expo Flipper plugin**. Documentation can be found here:
   [Expo Community Flipper](https://github.com/jakobo/expo-community-flipper).
   Install the module along with [react-native-flipper](https://www.npmjs.com/package/react-native-flipper):

   _TL;DR_: `yarn add --save-dev expo-community-flipper react-native-flipper`

3. Install `react-native-performance` with `yarn add --dev react-native-flipper-performance-plugin`. You can also check out [React Native Performance](https://github.com/bamlab/react-native-performance). Please do not make the changes manual as described in the README, because thats what this plugin is for. You might need to run `npx pod-install` though. Before the final version is released you need to use `yarn add --dev 'https://gitpkg.now.sh/bamlab/react-native-performance/flipper-native?android-expo-compatibility'`

4. Install this plugin with `yarn add --save-dev react-native-performance-flipper-expo-plugin`

5. Add `expo-community-flipper` configuration to the `plugins` section of your `app.json`, as per the examples below. Please check [Expo Community Flipper](https://github.com/jakobo/expo-community-flipper) for further settings.

6. Add this plugin to the plugins section of your `app.json` after `expo-community-flipper`

# Configuration

```json
{
  "expo": {
    "..."
    "plugins": [
      ["expo-community-flipper"],
      ["react-native-performance-flipper-expo-plugin"]
    ]
  }
}
```

If you want to pick a specific flipper version or edit the configs, check https://github.com/jakobo/expo-community-flipper

# Best practice

React Native Performance helps you to calculate a LightHouse Score similar to PageSpeed Insights. However, the tool is of no use to you if you cannot draw any optimizations from it. That is why it is recommended to use the plugin together with React DevTools.

The easiest way to use React DevTools is to install it as follows:

`yarn add --save-dev react-devtools-core`

Then open your App.tsx/App.js and import:

```tsx
import { connectToDevTools } from "react-devtools-core";

if (__DEV__) {
  connectToDevTools({
    host: "localhost",
    port: 8097,
  });
}
```

# Testing

An `/example` directory is built with `expo init example` for each major SDK release with a default `eas.json` file. The plugin is directly linked using expo's filepath support for config plugins. You can run `expo prebuild` in the directory to verify the plugin is modifying build files appropriately.

# References

- This code is based on the [Flipper Getting Started Guide](https://fbflipper.com/docs/getting-started/react-native/)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
- [Expo Community Flipper](
