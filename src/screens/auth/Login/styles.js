import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../theme';
import { getSize } from '../../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewHeader: {
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewInHeader: {
    flexDirection: 'row',
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLogo: {
    height: 24,
    width: 26,
    backgroundColor: colors.backgroundLogin,
    marginRight: 4,
    borderRadius: 50,
  },
  imageLogo: {
    height: 24,
    width: 24,
  },
  textAppPortal: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
  },
  viewBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTitleLogin: {
    marginBottom: '8%',
  },
  textTitleLogin: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.black,
  },
  viewFormLogin: {
    width: '60%',
    marginBottom: '6%',
  },
  buttonLogin: {
    backgroundColor: colors.backgroundLogin,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  textLogin: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  viewSwitchRow: {flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16},
  viewSwitch: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  viewTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginLeft: 4,
  },
  textTitle: {
    fontSize: 20,
    color: colors.black,
    alignSelf: 'center',
  },
});
