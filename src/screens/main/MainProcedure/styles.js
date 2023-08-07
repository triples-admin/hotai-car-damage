import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeView: {
    flex: 1
  },
  viewBody: {
    paddingHorizontal: 32,
    marginVertical: 20,
    flexDirection: 'column'
  }
});
