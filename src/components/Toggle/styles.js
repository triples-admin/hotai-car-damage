import {StyleSheet, Dimensions} from 'react-native';
import { colors } from '../../theme';
import { getSize } from '../../utils/responsive';


export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSwitch: {
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 50,
    borderColor: colors.colorSwitchOff,
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
    flexDirection: 'row',
    paddingHorizontal: 1
  },
  viewInSwitch: {
    height: 24,
    width: 24,
    backgroundColor: colors.backgroundStatusBar,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  viewTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  textTitleEnable: {
    fontSize: 20,
    color: colors.white,
    alignSelf: 'center',
    marginLeft: 5
  },
  textTitleDisable: {
    fontSize: 20,
    color: colors.white,
    alignSelf: 'center',
    marginRight: 5
  },
});
