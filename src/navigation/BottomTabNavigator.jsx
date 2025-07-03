// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import theme from '../constants/theme';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                const icons = {
                    Home: 'home-outline',
                    Settings: 'settings-outline',
                };
                return <Icon name={icons[route.name]} size={size} color={color} />;
            },
            tabBarLabelStyle:{
                fontFamily: theme.fonts.interSemiBold
            },
            tabBarActiveTintColor: '#1e2b5a',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
                backgroundColor: theme.colors.primary,
                fontFamily: theme.fonts.interMedium
            },
            headerTitleStyle: {
                fontFamily: theme.fonts.interBold,
                fontSize: 16,
            },
            headerTintColor: 'white',
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
);

export default BottomTabNavigator;
