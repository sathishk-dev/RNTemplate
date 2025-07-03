// screens/HomeScreen.js
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Alert, BackHandler } from 'react-native';
import theme from '../constants/theme';
import useExitAppHandler from '../hooks/useExitAppHandler';
import StyledBtn from '../components/StyledBtn';
import Toast from 'react-native-toast-message';

const HomeScreen = ({ navigation }) => {

    // Confirm Exit Code
    useExitAppHandler();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Home!</Text>
            <StyledBtn title='Setting' onPress={() => navigation.navigate('Settings')} />
            <StyledBtn title='Toast Test' onPress={() => {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Hello Developer!',
                    position: 'top',
                    visibilityTime: 1300,
                    topOffset: 5,
                });

            }} 

            backgroundColor={'#FCD8CD'}
            textColor="black"
            
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontFamily: theme.fonts.poppinsBold,
        fontSize: 20,
        color: theme.colors.primary
    },
});

export default HomeScreen;
