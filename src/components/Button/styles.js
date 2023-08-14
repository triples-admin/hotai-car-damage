import { StyleSheet, Dimensions } from 'react-native';
import react, { useState, useEffect } from 'react';
import { colors } from '../../theme';
import { getSize } from '../../../utils/responsive';
const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
});
