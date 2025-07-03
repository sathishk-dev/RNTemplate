// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';
import theme from './constants/theme';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
            <NavigationContainer>
                <AppNavigator />
                <Toast config={toastConfig} />
            </NavigationContainer>
        </GestureHandlerRootView>
    )
};

export default App;
