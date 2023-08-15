import { StyleSheet, Dimensions } from 'react-native';
import react, { useState, useEffect } from 'react';
import { colors } from '../../../theme';
import { getSize } from '../../../utils/responsive';
const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewBody: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  viewCar: {
    height: 460,
    width: 235,
    position: 'relative',
  },
  imageCar: {
    height: '100%',
    width: '100%',
  },
  viewCheckBoxItem: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    top: -10,
    marginLeft: 16,
    height: '100%',
  },
  viewCheckBoxFormItem: {
    backgroundColor: colors.white,
    borderColor: colors.borderBackground,
    borderRadius: 50,
    borderWidth: 2,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  viewImageSelectItem: {
    height: 15,
    width: 15,
  },
  imageSelectItem: {
    height: 15,
    width: 15,
  },
  viewTextSelect: {
    backgroundColor: colors.backgroundStatusBar,
  },
  textSelect: {
    fontSize: 18,
    color: colors.black,
    paddingHorizontal: 5,
    width: 120,
  },
  viewDamagedPart: {
    position: 'absolute',
    top: 0,
    left: -10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    height: 48,
    backgroundColor: colors.colorTextInput,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    marginHorizontal: 8,
  },
  viewText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { fontSize: 24, color: colors.white },
  textSelectDamagedPart: {
    color: colors.colorSwitchOff,
    marginBottom: 4,
    fontSize: 24,
    marginTop: 24,
  },
  viewButton: {
    marginHorizontal: 16,
    flexDirection: 'row',
    paddingTop: 24,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyPaintBoxBtn: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  viewCheckBoxFullBodyPaint: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    marginLeft: 40,
  },
  textSelectFullBodyPaint: {
    fontSize: 18,
    color: colors.black,
    paddingHorizontal: 5,
    width: 120,
  },
  viewSwitch: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderColor: colors.borderBackground,
    height: 40,
    borderWidth: 1.3,
    paddingHorizontal: 5,
  },
  viewInSwitch: {
    backgroundColor: '#829ED4',
    borderWidth: 1,
    borderColor: colors.borderBackground,
    borderRadius: 10,
    width: 70,
    height: '85%',
  },
  titleViewSwitch: {
    color: colors.red,
  },
});
