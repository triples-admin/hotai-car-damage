import AsyncStorage from '@react-native-async-storage/async-storage';

const authenStorage = {
  set: async (data) => {
    try {
      await AsyncStorage.setItem('AUTHEN', JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },
  get: async () => {
    try {
      const _get = await AsyncStorage.getItem('AUTHEN');
      if (_get) {
        return JSON.parse(_get);
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  remove: async () => {
    try {
      await AsyncStorage.removeItem('AUTHEN');
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default authenStorage;
