import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { colors } from '../../theme';
import ARButton from '../Button';
import Toggle from '../Toggle';
import i18n from '../../utils/i18n';

const TopScreen = ({
  topID,
  onPressDocument,
  onPressPhotos,
  onPressAssessment,
}) => {
  const main_procedure_document = i18n.t('main_procedure_document');
  const main_procedure_damage_photos = i18n.t('main_procedure_damage_photos');
  const main_procedure_assessment = i18n.t('main_procedure_assessment');

  return (
    <View style={styles.container}>
      <View style={styles.backgroundView}>
        <ARButton
          onPress={onPressDocument}
          title={main_procedure_document}
          style={
            topID == 1 ? { ...styles.button, ...styles.buttonBgActive }
              : { ...styles.button, ...styles.buttonBgInActive }
          }
          textStyle={
            topID == 1 ? styles.buttonTextActive
              : styles.buttonTextInActive
          }
        />
        <View style={
          topID == 3 ?
            { ...styles.separator, backgroundColor: colors.white }
            : styles.separator
        } />
        <ARButton
          onPress={onPressPhotos}
          title={main_procedure_damage_photos}
          style={
            topID == 2 ? { ...styles.button, ...styles.buttonBgActive }
              : { ...styles.button, ...styles.buttonBgInActive }
          }
          textStyle={
            topID == 2 ? styles.buttonTextActive
              : styles.buttonTextInActive
          }
        />
        <View style={
          topID == 1 ?
            { ...styles.separator, backgroundColor: colors.white }
            : styles.separator
        } />
        <ARButton
          onPress={onPressAssessment}
          title={main_procedure_assessment}
          style={
            topID == 3 ? { ...styles.button, ...styles.buttonBgActive }
              : { ...styles.button, ...styles.buttonBgInActive }
          }
          textStyle={
            topID == 3 ? styles.buttonTextActive
              : styles.buttonTextInActive
          }
        />
      </View>
    </View>

  );
};

export default TopScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 55,
    marginVertical: 20,

  },
  backgroundView: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 8,
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 0,
    flex: 1,
    height: 40,
  },
  buttonBgActive: {
    backgroundColor: colors.white,
  },
  buttonBgInActive: {
    backgroundColor: colors.primary,
  },
  buttonTextActive: {
    color: colors.primary,
  },
  buttonTextInActive: {
    color: colors.lightBlue
  },
  separator: {
    width: 2,
    height: '100%',
  },
});
