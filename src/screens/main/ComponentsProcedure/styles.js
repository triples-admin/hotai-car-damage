import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewBody: {
    flex: 1,
    paddingHorizontal: 55,
    flexDirection: 'column'
  },
  viewButtonBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  viewIconNext: {
    backgroundColor: colors.borderBackground,
    height: 48,
    width: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIconNext: { height: 24, width: 16, tintColor: colors.white },
  textTitle: { fontSize: 18, color: colors.black, marginBottom: 8, fontWeight: 'bold' },
  viewButtonDropDown: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonDropDown: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderColor: colors.borderBackground,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 45,
    borderRadius: 4,
  },
  textDropDown: { fontSize: 16, color: colors.black },
  viewCheckBoxItem: {
  },
  viewCheckBoxFormItem: {
    backgroundColor: colors.white,
    borderColor: colors.borderBackground,
    borderRadius: 50,
    borderWidth: 2,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  viewImageSelectItem: {
    height: 16,
    width: 16,
  },
  imageSelectItem: {
    height: 16,
    width: 16,
  },
  viewTextSelect: {
    backgroundColor: colors.backgroundStatusBar,
  },
  textSelect: {
    fontSize: 18,
    color: colors.black,
    paddingHorizontal: 8,
  },
  textComponents: {
    fontSize: 24,
    color: colors.black,
    marginBottom: 10,
  },
  viewItemHeaderComponents: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexDirection: 'row',
  },
  textItemHeaderComponents: { fontSize: 18, color: colors.white },
  viewItemBodyComponents: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  textItemBodyComponents: { fontSize: 17, color: colors.black, fontWeight: 'bold' },
  viewButtonFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 16,
  },
  buttonDelete: {
    backgroundColor: colors.colorTextInput,
    height: 48,
    width: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  imageDeleteButton: { height: 32, width: 32 },

  safeView: {
    flex: 1
  },

});
