import AsyncStorage from '@react-native-async-storage/async-storage';

const caseListPageStorage = {
  set: async (data) => {
    try {
      await AsyncStorage.setItem('CASE_LIST_PAGE', JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },
  get: async () => {
    try {
      const _get = await AsyncStorage.getItem('CASE_LIST_PAGE');
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
      await AsyncStorage.removeItem('CASE_LIST_PAGE');
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default caseListPageStorage;
