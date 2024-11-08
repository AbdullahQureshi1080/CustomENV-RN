
**Note:** Make sure you have completed the React Native environment setup  before testing this project.

---

# **Multiple Environment Setup in React Native**

This guide explains how to configure multiple environments (**Staging** and **Production**) in a React Native project. It supports environment-specific builds and configurations for both **Android** (using flavors) and **iOS** (using targets). Additionally, it demonstrates how to use environment variables natively in both platforms.

---

## **Table of Contents**

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment-Specific Configuration Using `react-native-config`](#environment-specific-configuration-using-react-native-config)
4. [Android Setup (Flavors)](#android-setup-flavors)
5. [iOS Setup (Targets)](#ios-setup-targets)
6. [Helpful Scripts for Building and Running Apps](#helpful-scripts-for-building-and-running-apps)
7. [Using Environment Variables in Native Code](#using-environment-variables-in-native-code)
8. [Switching Between Environments](#switching-between-environments)
9. [References](#references)

---

## **Overview**

### Why Set Up Multiple Environments?

- Test and build distinct app versions for **staging** and **production**.
- Use environment-specific configurations (e.g., API endpoints, Firebase configurations, feature flags).
- Streamline debugging and deployment workflows.

---

## **Prerequisites**

1. React Native project initialized:
   ```bash
   npx react-native init MyProject
   ```
2. Install `react-native-config` for managing environment variables:
   ```bash
   npm install react-native-config
   ```

---

## **Environment-Specific Configuration Using `react-native-config`**

1. Create separate `.env` files for each environment:

   - `.env.staging`
   - `.env.production`

   Example content for `.env.staging`:

   ```env
   API_URL=https://staging.api.myapp.com
   APP_NAME=MyApp Staging
   BUNDLE_IDENTIFIER=com.myapp.staging
   ```

2. Add `.env` files to `.gitignore`:

   ```gitignore
   .env*
   ```

3. Verify `react-native-config` integration:

   ```javascript
   import Config from 'react-native-config';

   console.log(Config.API_URL); // Logs API URL from selected .env file
   ```

---

## **Android Setup (Flavors)**

1. **Define Flavors in `android/app/build.gradle`:**
   Use the following configuration:

   ```gradle
   flavorDimensions "environment"
   productFlavors {
       staging {
           applicationId project.env.BUNDLE_IDENTIFIER
           dimension "environment"
           applicationIdSuffix ".staging"
           versionNameSuffix "-staging"
           resValue "string", "build_config_package", project.env.BUNDLE_IDENTIFIER
           resValue "string", "app_name", project.env.APP_NAME
       }
       production {
           applicationId project.env.BUNDLE_IDENTIFIER
           dimension "environment"
           versionNameSuffix "-production"
           resValue "string", "build_config_package", project.env.BUNDLE_IDENTIFIER
           resValue "string", "app_name", project.env.APP_NAME
       }
   }
   ```

2. **Build and Run with Flavors:**
   Use the `--mode` flag:

   ```bash
   # Staging
   npx react-native run-android --mode stagingDebug

   # Production
   npx react-native run-android --mode productionDebug
   ```

---

## **iOS Setup (Targets)**

### **1. Duplicate Targets in Xcode:**

- Duplicate your main app target for each environment:
  - `MyApp-Staging`
  - `MyApp-Production`.

To do this, in Xcode:

- Open your project.
- Right-click your main target under the **Targets** section and select **Duplicate**.
- Rename the duplicated target appropriately (e.g., `MyApp-Staging` and `MyApp-Production`).

### **2. Set Up Schemes:**

- Go to **Product > Scheme > Manage Schemes**.
- Create schemes for `MyApp-Staging` and `MyApp-Production`.
- Assign the correct target to each scheme (e.g., `MyApp-Staging` for the Staging scheme).

### **3. Each Target Will Have Its Own `Info.plist` File:**

- For each target (e.g., `MyApp-Staging`, `MyApp-Production`), you will need a separate `Info.plist` file.
- Duplicate your main `Info.plist` file and rename them according to the environment:

  - `Info-Staging.plist`
  - `Info-Production.plist`

- Assign the correct `Info.plist` to each target in Xcode:
  - Select the target (e.g., `MyApp-Staging`).
  - Go to the **Build Settings** tab.
  - Search for **Info.plist File**.
  - Set the **Info.plist File** path to the correct file for each target:
    - `MyApp-Staging/Info-Staging.plist`
    - `MyApp-Production/Info-Production.plist`

This way, each environment will use its respective configuration, such as app name, bundle identifier, and Firebase configuration.

### **4. Set Up Environment-Specific Configuration:**

In each `Info.plist` file, you can configure environment-specific settings like `API_URL`, Firebase keys, app version, etc., specific to the target.

For example:

- **Info-Staging.plist:**

  ```xml
  <key>API_URL</key>
  <string>https://staging.api.myapp.com</string>
  <key>FIREBASE_CONFIG</key>
  <string>google-services-staging.json</string>
  ```

- **Info-Production.plist:**
  ```xml
  <key>API_URL</key>
  <string>https://api.myapp.com</string>
  <key>FIREBASE_CONFIG</key>
  <string>google-services-production.json</string>
  ```

### **5. Build and Run with the Correct Scheme:**

To run the app with the desired environment, specify the scheme for the correct target:

```bash
# Staging
ENVFILE=.env.staging react-native run-ios --scheme MyApp-Staging

# Production
ENVFILE=.env.production react-native run-ios --scheme MyApp-Production
```

When building with a specific target, the corresponding `Info.plist` file (e.g., `Info-Staging.plist` or `Info-Production.plist`) will be used, ensuring that each environment has its own configuration.

---

## **Helpful Scripts for Building and Running Apps**

Add the following scripts to your project's `package.json` under the `scripts` section for easy environment-specific builds:

```json
"scripts": {
    "ios:stag:run": "npm run clean && ENVFILE=.env.staging XCODE_BUILD_CONFIGURATION=Debug react-native run-ios --scheme CustomENVRN-Staging",
    "ios:prod:run": "npm run clean && ENVFILE=.env.production XCODE_BUILD_CONFIGURATION=Debug react-native run-ios --scheme CustomENVRN-Production",
    "ios:stag:build": "ENVFILE=.env.staging xcodebuild -workspace CustomENVRN.xcworkspace -scheme CustomENVRN-Staging -configuration Debug -sdk iphoneos -derivedDataPath ios/build",
    "ios:prod:build": "ENVFILE=.env.production xcodebuild -workspace CustomENVRN.xcworkspace -scheme CustomENVRN-Production -configuration Debug -sdk iphoneos -derivedDataPath ios/build",
    "android:stag:run:release": "ENVFILE=.env.staging react-native run-android --mode=stagingRelease --appIdSuffix=staging",
    "android:prod:run:release": "ENVFILE=.env.production react-native run-android --mode=productionRelease",
    "android:stag:build": "ENVFILE=.env.staging cd android && ./gradlew assembleStagingRelease",
    "android:prod:build": "ENVFILE=.env.production cd android && ./gradlew assembleProductionRelease",
    "clean": "cd android && ./gradlew clean && cd ../ios && rm -rf build && rm -rf ~/Library/Developer/Xcode/DerivedData && xcodebuild clean && pod install --repo-update && cd ..",
    "install": "npm install && cd ios && pod install && cd ..",
    "reset": "rm -rf node_modules && rm -rf ios/build && npm run clean && npm install"
}
```

These scripts streamline building and running your app for specific environments.

---

## **Using Environment Variables in Native Code**

### **Android:**

1. Access variables in native Java/Kotlin code:

   ```java
   import com.myapp.BuildConfig;

   String apiUrl = BuildConfig.API_URL;
   ```

2. Ensure variables are added in `android/app/build.gradle` under `resValue`:
   ```gradle
   resValue "string", "API_URL", project.env.API_URL
   ```

### **iOS:**

1. Access variables in native Objective-C/Swift code:

   ```swift
   if let apiUrl = Bundle.main.infoDictionary?["API_URL"] as? String {
       print("API URL: \(apiUrl)")
   }
   ```

2. Add variables to the `.xcconfig` files for each target:

   We can follow the steps of react-native config [here](https://www.npmjs.com/package/react-native-config#:~:text=Availability%20in%20Build%20settings%20and%20Info.plist). And using the scripting to automatically write the tmp env file. Add the script in the build phase (pre-script)

   ```bash
      # Type a script or drag a script file from your workspace to insert its path.

      cp "${PROJECT_DIR}/../.env.staging" "${PROJECT_DIR}/../.env"  # replace .env.staging for your file

      "${SRCROOT}/../node_modules/react-native-config/ios/ReactNativeConfig/BuildXCConfig.rb" "${SRCROOT}/.." "${SRCROOT}/tmp.xcconfig"

      # Print the contents of the tmp.xcconfig file to verify the environment variables
      echo "=== Contents of tmp.xcconfig ==="
      cat "${SRCROOT}/tmp.xcconfig"
      echo "=== End of tmp.xcconfig ==="
   ```

## **References**

- [React Native Config Medium Guide](https://medium.com/@svbala99/react-native-set-up-environment-flavours-dev-staging-prod-using-react-native-config-update-c09b0081e424)
- [Sample Gradle Configuration](https://github.com/svbala99/RN2023-redux-detox/blob/master/android/app/build.gradle)
- [Firebase Configuration for Multiple Schemes](https://dev.to/tungcao_dev/firebase-googleservice-info-plist-with-different-build-schemes-environment-14oj)
- [Environment Setup for React Native](https://dasuja.medium.com/multiple-environments-setup-in-react-native-for-android-and-ios-app-29ef5cb4656a)

---

This is the core process for running and modifying your React Native app with custom ENV setup and apps.
