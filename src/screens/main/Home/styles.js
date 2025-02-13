import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewHeader: {
    backgroundColor: colors.primary,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  viewTextHeader: {
    paddingVertical: 8,
  },
  textHeader: {
    fontSize: 32,
    color: colors.white,
    fontWeight: 'bold',
  },
  buttonLogout: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 12,
    right: 4,
    borderRadius: 50,
  },
  textLogout: {
    fontSize: 20,
    color: colors.secondary,
    paddingHorizontal: 32,
    paddingVertical: 4,
  },
  viewBody: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  viewFormBody: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    paddingVertical: 8,
    marginBottom: 8,
  },
  viewSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
  },
  viewSearchFunc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textVC: {
    fontSize: 24,
    color: colors.black,
  },
  textNumberVC: {
    fontSize: 18,
    color: colors.primary,
  },
  viewImageSearch: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    padding: 12,
    marginLeft: 15,
  },
  imageSearch: { height: 24, width: 24 },
  viewFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 32,
    marginTop: 20,
  },
  viewItemForm: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  viewCheckBox: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },
  viewCheckBoxItem: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },
  textTitleForm: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
    paddingRight: 8,
    maxWidth: 120,
  },
  viewCheckBoxForm: {
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: 2,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCheckBoxFormItem: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 4,
    borderWidth: 2,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewImageDelete: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIconForm: { height: 14, width: 12 },
  imageDelete: { height: 25, width: 25 },
  viewImageSelect: {
    height: 20,
    width: 20,
  },
  viewImageSelectItem: {
    height: 20,
    width: 20,
  },
  imageSelect: { height: 20, width: 20, tintColor: colors.primary },
  imageSelectItem: { height: 20, width: 20, tintColor: colors.white },
  viewInFormBody: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewItemInFormBody: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'white'
  },
  viewItemInForm: { flex: 1.3, justifyContent: 'center', paddingHorizontal: 10 },
  textItemInForm: { fontSize: 16, color: colors.black, paddingRight: 4 },
  viewImageProgress: { height: 24, width: 16 },
  imageProgress: { height: 24, width: 16 },
  imageProgressCompleted: { tintColor: colors.lightBlue },
  buttonDelete: {
    backgroundColor: colors.backgroundStatusBar,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  imageDeleteButton: { height: 32, width: 32 },
  buttonNew: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  imageNew: { height: 20, width: 20, tintColor: colors.lightBlue },
  viewTextNew: {
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNew: { fontSize: 20, color: colors.lightBlue, fontWeight: 'bold' },
  viewPopupContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPopup: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 60,
    width: '50%',
  },
  buttonClose: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCloseButton: { height: 24, width: 24, tintColor: colors.primary },
  buttonSearchPopup: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  viewImageSearchPopup: {
    paddingVertical: 4,
    borderRadius: 50,
  },
  imageSearchPopup: { height: 28, width: 28, tintColor: colors.lightBlue },
  viewTextSearchPopup: {
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSearchPopup: {
    fontSize: 28, color: colors.white, fontWeight: 'bold', color: colors.lightBlue
  },
  textTitlePopup: {
    fontSize: 35,
    color: colors.black,
    textAlign: 'center',
  },
  textLicensePlatePopup: {
    fontSize: 18,
    color: colors.black,
    textAlign: 'left',
    marginBottom: 4,
  },
  viewTextInputPopup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  textInputPopup: {
    width: '46%',
    backgroundColor: colors.white,
    borderRadius: 4,
    padding: 16,
    fontSize: 18,
    borderColor: colors.borderBackground,
    borderWidth: 1,
  },
  lineWidthPopup: {
    height: 2,
    width: 8,
    backgroundColor: colors.borderBackground,
    marginHorizontal: 8,
  },
  buttonDeleteHide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  viewImageDeleteHide: {
    padding: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
