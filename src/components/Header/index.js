import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import _ from 'lodash';
import styles from './styles';
import { icons } from '../../assets';
import { colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { routes } from '../../navigation/routes';
import i18n from '../../utils/i18n';
import { NativeService, EventEmitter } from '../../bridge/NativeService';
import deviceInfoModule from 'react-native-device-info';

const Header = ({ iconBack, onPressBack, onPressReloadHome, iconHome, onPressHome, title, style, logout, leftButton, onPressLeft, buttonRight, onPressRight }) => {
  const navigation = useNavigation();
  const _logout = i18n.t('logout');
  const _version = deviceInfoModule.getVersion();
  const onPressLogout = async () => {
    await logoutFromSDK();
    navigation.navigate(routes.LOGINSCREEN);
  };

  const onPressGoBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  };

  const onPressGotoHome = () => {
    if (onPressHome) {
      onPressHome();
    } else {
      navigation.reset({ routes: [{ name: routes.HOMESCREEN }] });
    }
  };

  const logoutFromSDK = async () => {
    if (NativeService) {
      let resData = await NativeService.logout();
      // console.log("----------- JS send -- Logout SDK : " + JSON.stringify(resData));
    }
  };

  return (
    <View style={{ ...styles.viewHeader, ...style }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 200 }}>
        {iconBack && (
          <TouchableOpacity
            onPress={() => onPressGoBack()}
            style={styles.viewImageBack}>
            <Image
              resizeMode="contain"
              source={icons.arrow_left_icon}
              style={styles.imageBack}
            />
          </TouchableOpacity>
        )}
        {onPressReloadHome && (
          <TouchableOpacity
            onPress={onPressReloadHome}
            style={[styles.viewImageHome, { paddingLeft: 20 }]}>
            <Image
              resizeMode="contain"
              source={icons.ic_home}
              style={styles.imageHome}
            />
          </TouchableOpacity>
        )}
        {logout && (
          <Text style={styles.textVersion} numberOfLines={1}>v{_version}</Text>
        )}
        {leftButton && (
          <TouchableOpacity
            onPress={onPressLeft}
            style={_.isString(leftButton) ? styles.buttonLogout : styles.viewImageBack }>
            {_.isString(leftButton) ? (
              <Text style={styles.textLogout}>{leftButton}</Text>
            ) : (
              <Image
                resizeMode="contain"
                source={icons.arrow_left_icon}
                style={styles.imageBack}
              />
            ) }
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.viewTextHeader}>
        <Text style={styles.textHeader} numberOfLines={1}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', minWidth: 200}}>
        {logout && (
          <TouchableOpacity
            onPress={() => onPressLogout()}
            style={styles.buttonLogout}>
            <Text style={styles.textLogout}>{_logout}</Text>
          </TouchableOpacity>
        )}
        {iconHome && (
          <TouchableOpacity
            onPress={() => onPressGotoHome()}
            style={styles.viewImageHome}>
            <Image
              resizeMode="contain"
              source={icons.ic_home}
              style={styles.imageHome}
            />
          </TouchableOpacity>
        )}
        {buttonRight && (
          <TouchableOpacity
            onPress={onPressRight}
            style={styles.buttonLogout}>
            <Text style={styles.textLogout}>{buttonRight}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
