import {StyleSheet, Dimensions} from 'react-native';
import { colors } from '../../theme';
import { getSize } from '../../utils/responsive';


export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  viewSwitch: {
    height: 24,
    width: 56,
    backgroundColor: colors.white,
    borderRadius: 50,
    borderColor: colors.colorSwitchOff,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  viewInSwitch: {
    height: 18,
    width: 18,
    backgroundColor: colors.backgroundStatusBar,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  viewTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  textTitle: {
    fontSize: 20,
    color: colors.black,
    alignSelf: 'center',
  },
});
