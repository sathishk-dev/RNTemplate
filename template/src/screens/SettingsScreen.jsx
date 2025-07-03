// screens/SettingScreen.js
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import theme from '../constants/theme';
import Table from '../components/Table';
import CustomDropdown from '../components/CustomDropdown';

const SettingsScreen = () => {

    const columns = [
        { label: 'S.No', key: 'serial' },
        { label: 'Name', key: 'name' },
        { label: 'Role', key: 'role' },
    ];

    const [tableData, setTableData] = useState([]);
    const [name, setName] = useState("All Parts");
    const [role, setRoles] = useState([
        { label: 'Developer', value: 'Developer' },
        { label: 'Designer', value: 'Designer' },
        { label: 'Manager', value: 'Manager' }
    ]);

    useEffect(() => {
        const sample = [
            { serial: 1, name: 'Name 1', role: 'Developer' },
            { serial: 2, name: 'Name 2', role: 'Designer' },
            { serial: 3, name: 'Name 3', role: 'Manager' },
        ];

        setTableData(sample);
    }, []);


    return (
        <View style={styles.container}>

            <Text style={{fontFamily: theme.fonts.interMedium}}>Custom Dropdown</Text>
            <CustomDropdown
                items={role}
                placeholder="Select Role"
                selectedValue={name}
                onSelect={setName}
            />

            <Text style={{fontFamily: theme.fonts.interMedium}}>Custom Table</Text>
            <Table data={tableData} columns={columns} />

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    text: {
        fontFamily: theme.fonts.poppinsBold,
        fontSize: 20,
        color: theme.colors.primary
    },
});

export default SettingsScreen;
