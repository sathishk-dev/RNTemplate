import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores any serializable data in AsyncStorage.
 * Automatically stringifies objects/arrays.
 */
export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(`Error storing data for key "${key}":`, e);
    }
};

/**
 * Retrieves data and automatically parses JSON.
 */
export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? JSON.parse(value) : null;
    } catch (e) {
        console.error(`Error retrieving data for key "${key}":`, e);
        return null;
    }
};

/**
 * Removes a key from storage.
 */
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error(`Error removing data for key "${key}":`, e);
    }
};

/**
 * Clears all AsyncStorage data — use with caution.
 */
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.error('Error clearing AsyncStorage:', e);
    }
};


// Example

// await storeData('username', 'yourname');             // string
// await storeData('age', 25);                         // number
// await storeData('hobbies', ['code', 'music']);      // array
// await storeData('profile', { name: 'yourname', age: 25 }); // object

// const username = await getData('username');
// const age = await getData('age');
// const hobbies = await getData('hobbies');
// const profile = await getData('profile');

// await removeData('username');
// await clearAllData(); // clears everything
