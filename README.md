# 🚀 React Native Starter Template

A modern, scalable, and reusable React Native template that includes all the essentials to kickstart your app development quickly and cleanly.

---

## 📦 Features

✅ **Custom Components**
- `StyledButton` – Reusable button with customizable colors, padding, radius
- `CustomToast` – Custom styled toast (success & error) using `react-native-toast-message`
- `Table` – Lightweight table view for array/object data, with pagination
- `Dropdown` – Custom designed popup dropdown with search feature

✅ **Global Styling**
- Centralized `theme.js` for colors, fonts, and spacing
- Preloaded custom fonts (e.g., Axiforma, Inter)

✅ **Navigation**
- Stack and Bottom Tab Navigation preconfigured (`@react-navigation`)
- Gesture handler and safe area context integrated

✅ **Utility Hooks**
- `useExitAppHandler` – Android back button exit confirmation hook
- `storage.js` – Reusable AsyncStorage utility for strings, numbers, objects, arrays

✅ **Extras**
- Splash + Home + Settings screen examples
- Toast styling per theme
- Easy to extend and scale

---

## ⚙️ How to Use This Template

You can use this template directly via the React Native CLI.

### 📥 Install via `npx`:

```bash
npx @react-native-community/cli@latest init MyApp --template https://github.com/sathishk-dev/RNTemplate.git
```

Replace `MyApp` with your desired project name.

---

## 🛠️ After Installation

### 1. Install Dependencies

```bash
cd MyApp
npm install
npx react-native-asset
```

For iOS:
```bash
cd ios && pod install && cd ..
```

### 2. Run the App

```bash
npm run android
# or
npx react-native run-ios
```

---

## 📁 Project Structure

```
MyApp/
├── App.js
├── components/
│   ├── StyledButton.js
│   ├── Table.js
├── constants/
│   └── theme.js
├── hooks/
│   └── useExitAppHandler.js
├── navigation/
│   ├── AppNavigator.js
│   └── BottomTabNavigator.js
├── screens/
│   ├── SplashScreen.js
│   ├── HomeScreen.js
│   └── SettingsScreen.js
├── utils/
│   └── storage.js
│   └── toastConfig.js
├── assets/
│   └── fonts/
│       └── Inter-Medium.ttf
```

---

## 🙌 Credits

Built with ❤️ by Sathish Kumar.  
This template is ready to plug and play for your next big app idea.

---