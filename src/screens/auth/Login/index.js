import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { icons } from '../../../assets';
import { colors } from '../../../theme';
import Input from '../../../components/TextInput';
import { useNavigation } from '@react-navigation/core';
import { routes } from '../../../navigation/routes';
import authenStorage from '../../../api/storage/authen';
import i18n from '../../../utils/i18n';

import { NativeService, EventEmitter } from '../../../bridge/NativeService';

const LoginScreen = () => {
  const navigation = useNavigation();

  const seconds = useRef(0);
  // const _wellcome = i18n.t('login_wellcome');

  useEffect(() => {
    const interval = setInterval(() => {
      const temp = seconds.current + 1;
      seconds.current = temp;
      if (temp % 2 == 0) {
        checkLoginFromSDK();
        // console.log('---- interval count ---- ' + temp);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkLoginFromSDK = async () => {
    if (NativeService) {
      let resUserInfo = await NativeService.getUserInfo();
      // console.log("----------- JS send -- GetUserInfo SDK : " + JSON.stringify(resUserInfo));
      if (resUserInfo) {
        // console.log("----------- UserInfo --------------- ");
        await authenStorage.set(resUserInfo);
        navigation.reset({ routes: [{ name: routes.HOMESCREEN }] });
        // navigation.navigate(routes.HOMESCREEN);
      } else {
        let resLogin = await NativeService.login();
        // console.log("----------- JS send -- Login SDK : " + JSON.stringify(resLogin));
      }
    }
  }

  const loginFromSDK = async () => {
    if (NativeService) {
      let resData = await NativeService.login();
      // console.log("----------- JS send -- Login SDK : " + JSON.stringify(resData));
    }
  };

  const logoutFromSDK = async () => {
    if (NativeService) {
      let resData = await NativeService.logout();
      // console.log("----------- JS send -- Logout SDK : " + JSON.stringify(resData));
    }
  };

  const getUserInfoFromSDK = async () => {
    if (NativeService) {
      let resData = await NativeService.getUserInfo();
      // console.log("----------- JS send -- GetUserInfo SDK : " + JSON.stringify(resData));
    }
  };

  //Custom Switch
  const SwitchCustom = ({ titleSwitch, style }) => {
    const [isEnableSwitch, setEnableSwitch] = useState(true);
    return (
      <View style={{ ...styles.viewSwitch, ...style }}>
        <Switch
          trackColor={{ true: colors.white, false: colors.backgroundLogin }}
          thumbColor={!isEnableSwitch ? colors.white : colors.colorSwitchOff}
          onValueChange={() => setEnableSwitch(!isEnableSwitch)}
          value={isEnableSwitch}
          ios_backgroundColor={colors.backgroundStatusBar}
        />
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>{titleSwitch}</Text>
        </View>
      </View>
    );
  };

  //Header view
  const Header = () => {
    return (
      <View style={styles.viewHeader}>
        <View style={styles.viewInHeader}>
          <View style={styles.viewLogo}>
            <Image
              resizeMode="contain"
              source={icons.app_logo}
              style={styles.imageLogo}
            />
          </View>
          <Text style={styles.textAppPortal}>App Portal</Text>
        </View>
      </View>
    );
  };

  //Body view
  const Body = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const CheckLogin = () => {
      if (username === '' && password === '') {
        AccountEmpty();
        console.log('Log in failure, not entering the account password');
      } else if (username === '') {
        UsernameEmpty();
        console.log('Login fails, account error');
      } else if (password === '') {
        PasswordEmpty();
        console.log('Log in failure, enter the password error');
      } else {
        navigation.navigate(routes.HOMESCREEN);
      }
    };

    return (
      <View style={styles.viewBody}>
        <View style={styles.viewTitleLogin}>
          <Text style={styles.textTitleLogin}>使用者登入</Text>
        </View>
        <View style={styles.viewFormLogin}>
          <Input
            title={'帳號'}
            placeholder={'请输入您的帐户'}
            onChangeText={text => setUsername(text)}
            value={username}
            style={{ marginBottom: 16 }}
          />
          <Input
            title={'密碼'}
            placeholder={'请输入密码'}
            onChangeText={text => setPassword(text)}
            value={password}
            issecure
          />
          <View style={styles.viewSwitchRow}>
            <SwitchCustom titleSwitch={'Domain'} />
            <SwitchCustom titleSwitch={'記住帳號密碼'} />
            <SwitchCustom titleSwitch={'使用生物辨識'} />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => loginFromSDK()}
          style={styles.buttonLogin}>
          <Text style={styles.textLogin}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => logoutFromSDK()}
          style={styles.buttonLogin}>
          <Text style={styles.textLogin}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => getUserInfoFromSDK()}
          style={styles.buttonLogin}>
          <Text style={styles.textLogin}>GetUserInfo</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const AccountEmpty = () => {
    Alert.alert('登入失敗', '請輸入使用者帳號', [
      { text: '好', onPress: () => console.log('OK') },
    ]);
  };

  const UsernameEmpty = () => {
    Alert.alert('登入失敗', '您輸入的使用者帳號無效', [
      { text: '好', onPress: () => console.log('OK') },
    ]);
  };

  const PasswordEmpty = () => {
    Alert.alert('登入失敗', '您輸入的密碼不正確', [
      { text: '好', onPress: () => console.log('OK') },
    ]);
  };

  const renderMain = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <Text>{_wellcome}</Text> */}
        <ActivityIndicator size="large" color={colors.secondary} />

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {renderMain()}
    </SafeAreaView>
  );
};

export default LoginScreen;
