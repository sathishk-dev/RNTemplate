import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '../constants/theme';

const StyledBtn = ({
    title = 'Click Me',
    onPress = () => { },
    backgroundColor = '#1e2b5a',
    textColor = '#ffffff',
    style = {},
    textStyle = {},
    borderRadius = 8,
    padding = 12,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor,
                    borderRadius,
                    padding,
                },
                style, // custom style overrides
            ]}
        >
            <Text style={[styles.text, { color: textColor }, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontFamily: theme.fonts.interMedium
    },
});

export default StyledBtn;
