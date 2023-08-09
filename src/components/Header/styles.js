import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewHeader: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
  },
  viewTextHeader: {
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textVersion: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
    marginLeft: 30
  },
  textHeader: {
    fontSize: 36,
    color: colors.lightBlue,
    fontWeight: 'bold',
  },
  buttonLogout: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 30,
    borderRadius: 50,
  },
  textLogout: {
    fontSize: 20,
    color: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 4,
    lineHeight: 30,
  },
  viewImageBack: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  imageBack: { height: 28, width: 28 },
  viewImageHome: {
    paddingLeft: 15,
    paddingRight: 15
  },
  imageHome: { height: 36, width: 36, tintColor: 'white' },
});
