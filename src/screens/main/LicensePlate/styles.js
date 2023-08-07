import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../theme';
import {getSize} from '../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTextInput: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: 200,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderBackground,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.colorTextInput,
    borderRadius: 8,
    paddingVertical: 12,
  },
  text: {
    fontSize: 40,
    color: colors.black,
    marginBottom: 16,
  },
  buttonSubmit: {
      width: 230,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      height: 60,
      borderWidth: 2,
      borderColor: 'white'
  },
  textButton: {
      fontSize: 24,
      color: colors.white,
      paddingVertical: 12,
  }
});
