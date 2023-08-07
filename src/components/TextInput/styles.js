import {StyleSheet, Dimensions} from 'react-native';
import { colors } from '../../theme';


export default StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexDirection: 'row',
  },
  viewTextInput: {
    paddingVertical: 0,
    flexDirection: 'row',
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textTitle: {
    width: '15%',
    fontSize: 16, 
    color: colors.black,
    fontWeight: 'bold',
  },
  textInput: {
    width: '75%',
    color: colors.black,
    fontSize: 16,
    paddingVertical: 8,
  },
  buttonSecure: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSecure: {width: 32, height: 32, tintColor: colors.black},
});
