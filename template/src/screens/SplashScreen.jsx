import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import theme from "../constants/theme";

export default function SplashScreen({ navigation }) {
    useEffect(() => {

        const timer = setTimeout(() => {
            navigation.replace("Main");
        }, 2000);

        return () => clearTimeout(timer);

    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* <Image
                source={require('../assets/images/visteon-logo.png')}
                style={styles.imgLogo}
            /> */}

            <Text style={styles.txtLogo}>Splash Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFA500",
    },
    imgLogo: {
        width: 150,
        height: 150,
        resizeMode: "contain",
    },
    txtLogo:{
        fontFamily: theme.fonts.poppinsBold,
        color:'white',
        fontSize:20
    }
});
