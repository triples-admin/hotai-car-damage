import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {colors} from '../../theme';
import ARButton from '../Button';
import Toggle from '../Toggle';
import i18n from '../../utils/i18n';

const TopScreen = ({
  onPressDocument,
  onPressPhotos,
  onPressAssessment,
  disableDocument,
  disablePhotos,
  disableAssessment,
  toggleStatus,
  onPressToggle,
}) => {
  const main_procedure_document = i18n.t('main_procedure_document');
  const main_procedure_damage_photos = i18n.t('main_procedure_damage_photos');
  const main_procedure_assessment = i18n.t('main_procedure_assessment');
  const main_procedure_toggle_gallery = i18n.t('main_procedure_toggle_gallery');
  const main_procedure_toggle_camera = i18n.t('main_procedure_toggle_camera');

  const bgDocument = disableDocument
    ? colors.darkGray
    : onPressDocument
    ? colors.third
    : colors.primary;
  const bgPhotos = disablePhotos
    ? colors.darkGray
    : onPressPhotos
    ? colors.third
    : colors.primary;
  const bgAssessment = disableAssessment
    ? colors.darkGray
    : onPressAssessment
    ? colors.third
    : colors.primary;
  return (
    <View style={styles.viewBody}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{position: 'absolute', left:25}}>
          {toggleStatus !== undefined && (
            <Toggle
              titleEnable={main_procedure_toggle_camera}
              titleDisable={main_procedure_toggle_gallery}
              status={toggleStatus}
              onPressToggle={onPressToggle}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ARButton
            disable={onPressDocument ? false : disableDocument}
            onPress={onPressDocument}
            title={main_procedure_document}
            style={{backgroundColor: bgDocument}}
          />
          <ARButton
            disable={onPressPhotos ? false : disablePhotos}
            onPress={onPressPhotos}
            title={main_procedure_damage_photos}
            style={{backgroundColor: bgPhotos}}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.darkGray,
            }}>
            <Image
              style={{width: 16, height: 24}}
              source={require('../../assets/icons/progress_complete_icon.webp')}
            />
          </View>
          <ARButton
            disable={onPressAssessment ? false : disableAssessment}
            onPress={onPressAssessment}
            title={main_procedure_assessment}
            style={{backgroundColor: bgAssessment}}
          />
        </View>
      </View>
    </View>
  );
};

export default TopScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewBody: {
    paddingHorizontal: 32,
    marginVertical: 20,
    flexDirection: 'column',
  },
});
