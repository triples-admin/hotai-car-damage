import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
  Image,
  Linking
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../../../assets';
import Header from '../../../components/Header';
import AlertModal from '../../../components/AlertModal';
import styles from './styles';
import { colors } from '../../../theme';
import { routes } from '../../../navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import caseListPageStorage from '../../../api/storage/caseListPage';
import caseListPageAPI from '../../../api/axios/caseListPage';
import { createNewCase, apiDataConfig } from '../../../utils/CaseModel';
import i18n from '../../../utils/i18n';
import LoadingView from '../../../components/Loading';
import { NativeService, EventEmitter } from '../../../bridge/NativeService';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const screen = Dimensions.get('window');

const LicensePlate = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const authen = route?.params?.authen;
  const caseData = useRef(route?.params?.caseData);
  const dataConfig = useRef(route?.params?.dataConfig);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const caseListPage = useRef([]);
  const textInputPrefix = useRef();
  const textInputSuffix = useRef();
  const textInputSuffix2 = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const isShowCamera = useRef(false);
  const [isManual, setIsManual] = useState(false);

  const [isShowAlert, setIsShowAlert] = useState(false);

  const [lengthPlateNumbber, setLengthPlateNumber] = useState(0);

  const newCaseID = useRef(-1);

  const firstType = useRef(true);
  const preRef = useRef('');
  const sufRef = useRef('');

  const ar_cancel = i18n.t('ar_cancel');
  const ar_sure = i18n.t('ar_sure');

  const _logout = i18n.t('logout');
  const _failed = i18n.t('smart_pricing_title_failed');
  const _licensePlateEmpty = i18n.t('smart_pricing_license_plate_empty');
  const _ok = i18n.t('smart_pricing_ok');
  const _title = i18n.t('smart_pricing_title');
  const _smart_pricing_license_plate = i18n.t('smart_pricing_license_plate');
  const _smart_pricing_submit = i18n.t('smart_pricing_submit');
  const _smart_pricing_duplicated = i18n.t('smart_pricing_duplicated');
  const _home_ok = i18n.t('home_ok');
  const ar_api_message_error = i18n.t('ar_api_message_error');

  const smart_pricing_manual_input = i18n.t('smart_pricing_manual_input');
  const smart_pricing_confirm_to_send = i18n.t('smart_pricing_confirm_to_send');
  const smart_pricing_waiting_scan = i18n.t('smart_pricing_waiting_scan');
  const smart_pricing_re_scan = i18n.t('smart_pricing_re_scan');

  const smart_pricing_next_confirm_title = i18n.t(
    'smart_pricing_next_confirm_title',
  );
  const smart_pricing_next_confirm_content = i18n.t(
    'smart_pricing_next_confirm_content',
  );

  const license_plate_message_error = i18n.t('license_plate_message_error');
  const license_plate_permission_camera = i18n.t(
    'license_plate_permission_camera',
  );

  useEffect(() => {
    const getCaseList = async () => {
      const result = await caseListPageStorage.get();
      if (result) {
        caseListPage.current = result;
      }
    };
    getCaseList();
  }, []);

  useEffect(() => {
    // load default
    if (caseData.current?.licensePlate) {
      const temp = caseData.current.licensePlate.split('-');
      if (temp.length === 2) {
        setPrefix(temp[0]);
        setSuffix(temp[1]);
        preRef.current = temp[0];
        sufRef.current = temp[1];
      }
    }
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      checkCamera();
    });
  }, [navigation]);

  const checkCamera = () => {
    check(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            requestCamera();
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            requestCamera();
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            requestCamera();
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            isShowCamera.current = true;
            openVisionScan();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            openSettingCamera();
            break;
        }
      })
      .catch(error => {
        // …
      });
  };

  const requestCamera = () => {
    request(PERMISSIONS.IOS.CAMERA).then(result => {
      console.log('----- requestCamera: ' + result);
      if (result === 'granted') {
        isShowCamera.current = true;
      }
    });
  };

  const openSettingCamera = () => {
    Alert.alert('', license_plate_permission_camera, [
      {
        text: ar_cancel,
        onPress: () => {
          console.log('Cancel Pressed');
        },
      },
      {
        text: _home_ok,
        onPress: () => {
          openSettings().catch(() => console.warn('cannot open settings'));
        },
      },
    ]);
  };

  useEffect(() => {
    const subscriptionDone = EventEmitter.addListener(
      'onResultVisionScan',
      async result => {
        // console.log('--------- JS onResultVisionScan -----------', result);
        // console.log('--------- JS onResultVisionScan 1 -----------', JSON.stringify(result));

        if (result?.VisionScanLogout) {
          // console.log('--------- JS VisionScanLogout : ', JSON.stringify(result.VisionScanLogout));
          onPressLogout();
        } else if (result?.VisionScanBack) {
          // console.log('--------- JS VisionScanBack : ', JSON.stringify(result.VisionScanBack));
          onPressGoBack();
        } else if (result?.VisionScanManual) {
          // console.log('--------- JS VisionScanManual : ', JSON.stringify(result.VisionScanManual));
          setPrefix('');
          setSuffix('');
          preRef.current = '';
          sufRef.current = '';
          setIsManual(true);
          onPressOpenManualInput();
        } else if (result?.VisionScanDone) {
          console.log(
            '--------- JS VisionScanDone : ',
            JSON.stringify(result.VisionScanDone),
          );
          const plate = result.VisionScanDone;
          setPrefix(plate?.prefix);
          setSuffix(plate?.suffix);
          preRef.current = plate?.prefix;
          sufRef.current = plate?.suffix;
          // console.log('--------- JS preRef.current : ', preRef.current);
          // console.log('--------- JS sufRef.current : ', sufRef.current);
          onPressNextStep();
        }
      },
    );

    const unsubscribe = () => {
      subscriptionDone.remove();
    };
    return () => unsubscribe();
  }, []);

  const openVisionScan = async () => {
    if (NativeService && isShowCamera.current) {
      let resData = await NativeService.startScanPlateNumber(
        preRef.current,
        sufRef.current,
      );
      console.log(
        '----------- JS send -- startScanPlateNumber : ' +
        JSON.stringify(resData),
      );
    } else if (isShowCamera.current === false) {
      checkCamera();
    }
  };

  const getConfigData = async () => {
    setIsLoading(true);
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const pre = prefix || preRef.current;
    const suf = suffix || sufRef.current;
    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      USERID: authen?.USERID,
      LICSNO: pre + '-' + suf,
    };
    // console.log('--- getConfig Data params -- ' + JSON.stringify(_body));
    const result = await caseListPageAPI.getConfig(_body, _config);
    // console.log('------ getConfig Data : ' ,result.data);
    setIsLoading(false);
    if (result && result?.data?.length > 0) {
      dataConfig.current = result.data;
      await saveData();
      return true;
      // console.log('------ getConfig Data : ' + JSON.stringify(result.data));
    } else {
      apiCallFailed();
    }
    return false;
  };

  const onPressLogout = async () => {
    await logoutFromSDK();
    navigation.navigate(routes.LOGINSCREEN);
  };

  const logoutFromSDK = async () => {
    if (NativeService) {
      let resData = await NativeService.logout();
      // console.log("----------- JS send -- Logout SDK : " + JSON.stringify(resData));
    }
  };

  const apiCallFailed = () => {
    Alert.alert(license_plate_message_error, '', [
      { text: i18n.t('license_plate_message_option1'), onPress: () => alertOption1()},
      { text: i18n.t('license_plate_message_option2'), onPress: () => alertOption2()},
    ]);
    // setIsShowAlert(true);
  };

  const onPressNextStep = async () => {
    const pre = prefix || preRef.current;
    const suf = suffix || sufRef.current;
    if (pre === '' || suf === '') {
      showAlertEmpty();
    } else {
      const checkValid = await getConfigData(); // if false => show alert: wrong license plate
      if (checkValid === true) {
        if (checkValidlicensePlate() === true) {
          // if false => show alert: existed license plate
          let resData = await NativeService.stopVisionScan();
          setIsManual(false);
          gotoNextPage();
        } else {
          // existed license plate
          let oldList = await caseListPageStorage.get();
          // console.log('-------- old list 1: ' + JSON.stringify(oldList));
          for (let i = oldList.length - 1; i >= 0; i--) {
            if (oldList[i].id === newCaseID.current) {
              oldList.splice(i, 1);
            }
          }
          // console.log('-------- old list 2: ' + JSON.stringify(oldList));
          await caseListPageStorage.set(oldList);
        }
      }
    }
  };

  const saveData = async () => {
    const licenPlate =
      (prefix || preRef.current) + '-' + (suffix || sufRef.current);
    console.log('---- saveData license plate : ' + licenPlate);
    const _info = dataConfig.current[0] ?? [];
    if (!caseData.current) {
      // new case
      let arrList = caseListPage.current;
      let newCase = await createNewCase();
      newCaseID.current = newCase.id;
      newCase.contactName = _info[0]?.CONTANM ?? '';
      newCase.contactPhone = _info[0]?.CONTATEL ?? '';
      newCase.name = _info[0]?.CARNM ?? '';
      newCase.progress = 2;
      newCase.licensePlate = licenPlate;
      caseData.current = newCase;
      arrList.push(newCase);
      await caseListPageStorage.set(arrList);
    } else {
      // update case
      const newList = caseListPage.current;
      newList.forEach(element => {
        if (element.id === caseData.current?.id) {
          element.contactName = _info[0]?.CONTANM ?? '';
          element.contactPhone = _info[0]?.CONTATEL ?? '';
          element.name = _info[0]?.CARNM ?? '';
          element.progress = element.progress == 7 ? 7 : 2;
          element.licensePlate = licenPlate;
          caseData.current = element;
        }
      });
      await caseListPageStorage.set(newList);
    }
  };

  const autoSave = async () => {
    const licenPlate = prefix + '-' + suffix;
    if (!caseData.current) {
      // new case
      let arrList = caseListPage.current;
      let newCase = await createNewCase();
      newCase.licensePlate = licenPlate;
      newCase.progress = 1;
      caseData.current = newCase;
      arrList.push(newCase);
      await caseListPageStorage.set(arrList);
    } else {
      // update case
      const newList = caseListPage.current;
      newList.forEach(element => {
        if (element.id === caseData.current?.id) {
          element.progress = element.progress == 7 ? 7 : 1;
          element.licensePlate = licenPlate;
          caseData.current = element;
        }
      });
      await caseListPageStorage.set(newList);
    }
  };

  const gotoNextPage = () => {
    // console.log('------- gotoNextPage : ' + JSON.stringify(caseData.current));

    // navigation.navigate(routes.DRIVING_LICENSE, {
    //   caseData: caseData.current,
    //   dataConfig: dataConfig.current,
    //   authen: authen,
    // });

    console.log('caseData', caseData);
    console.log('dataConfig', dataConfig);
    console.log('authen', authen);

    navigation.navigate(routes.INSURANCE, {
      caseData: caseData.current,
      dataConfig: dataConfig.current,
      authen: authen,
    });
  };

  const checkValidlicensePlate = () => {
    const licenPlate =
      (prefix || preRef.current) + '-' + (suffix || sufRef.current);
    let arrList = caseListPage.current;
    let filter = arrList.filter(lp => lp.licensePlate == licenPlate);
    if (filter && filter.length > 1) {
      Alert.alert(_failed, _smart_pricing_duplicated, [
        { text: _ok, onPress: () => console.log('OK') },
      ]);
      return false;
    }
    return true;
  };

  const showAlertEmpty = () => {
    Alert.alert(_failed, _licensePlateEmpty, [
      { text: _ok, onPress: () => console.log('OK') },
    ]);
  };

  const onChangeTextPrefix = text => {
    let newText = '';
    if (text) {
      newText = text.trim().toUpperCase();
    }
    setPrefix(newText);
    preRef.current = newText;

    if (
      (firstType.current === true && newText.length === 3) ||
      newText.length === 3
    ) {
      if (textInputSuffix?.current) {
        textInputSuffix.current.focus();
        firstType.current = false;
      } else if (textInputSuffix2?.current) {
        textInputSuffix2.current.focus();
        firstType.current = false;
      }
    }
  };

  const onChangeTextSuffix = text => {
    let newText = '';
    if (text) {
      newText = text.trim().toUpperCase();
    }
    setSuffix(newText);
    sufRef.current = newText;
  };

  const onPressOpenManualInput = () => {
    firstType.current = true;
    // console.log('------- onPressOpenManualInput ');
    setTimeout(() => {
      if (textInputPrefix?.current) {
        textInputPrefix.current.focus();
      }
    }, 500);
  };

  const onManualInputDone = () => { };

  const validateInput = text => {
    if (/^[0-9a-zA-Z]+$/.test(text)) {
      onChangeTextSuffix(text);
    } else {
      if (text.length === 0) {
        onChangeTextSuffix(text);
      }
    }
  };

  //Body
  const renderBody = () => {
    const hideButton = prefix.length > 0 && suffix.length > 0 ? false : true;
    return (
      <View style={styles.viewBody}>
        <View style={styles.viewTextInput}>
          <Text style={styles.text}>{_smart_pricing_license_plate}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <TextInput
              ref={ref => (textInputPrefix.current = ref)}
              placeholder={''}
              placeholderTextColor={colors.backgroundStatusBar}
              onChangeText={text => onChangeTextPrefix(text)}
              value={prefix}
              style={[styles.textInput, { width: 150 }]}
              maxLength={3}
              returnKeyType={'go'}
              onSubmitEditing={event => onManualInputDone()}
            />
            <Image
              style={{ marginHorizontal: 10, width: 40, height: 5 }}
              source={require('../../../assets/icons/ic_line.png')}
            />
            <TextInput
              ref={ref => (textInputSuffix.current = ref)}
              placeholder={''}
              placeholderTextColor={colors.backgroundStatusBar}
              onChangeText={validateInput}
              value={suffix}
              style={[styles.textInput, { width: 150 }]}
              maxLength={4}
              keyboardType='number-pad'
              returnKeyType={'go'}
              onSubmitEditing={event => onManualInputDone()}
            />
          </View>
          <TouchableOpacity
            disabled={hideButton}
            onPress={() => onPressNextStep()}
            style={[
              styles.buttonSubmit,
              {
                width: 360,
                marginTop: 20,
                backgroundColor: !hideButton ? colors.primary : colors.gray,
              },
            ]}>
            <Text style={styles.textButton}>
              {smart_pricing_confirm_to_send}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onPressBackVisionScan = () => {
    setPrefix('');
    setSuffix('');
    preRef.current = '';
    sufRef.current = '';
    openVisionScan();
    setIsManual(false);
  };

  const onPressGoBack = async () => {
    navigation.navigate(routes.HOMESCREEN, {});
  };

  const alertOption1 = () => {
    //TODO 連結  
    Linking.openURL('https://drive.google.com/drive/folders/1yFdEMgNsqGN9iGcLfDAqPWbfu1YEJPKj?usp=drive_link');
  }

  const alertOption2 = () => {
    //TODO 連結
    Linking.openURL('https://drive.google.com/drive/folders/1yFdEMgNsqGN9iGcLfDAqPWbfu1YEJPKj?usp=drive_link');
  }

  const renderAlertModal = () => {
    return (
      <>
        {/* 未支援此車型 */}
        <AlertModal
          visible={isShowAlert}
          title={license_plate_message_error}
          actionButton={[
            {
              'title': i18n.t('license_plate_message_option1'),
              'onPress': () => alertOption1()
            },
            {
              'title': i18n.t('license_plate_message_option2'),
              'onPress': () => alertOption2()
            },
            {
              'title': i18n.t('home_cancel'),
              'onPress': () => setIsShowAlert(false)
            }
          ]}
        />
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {isManual ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
            }}>
            <Header
              iconBack
              onPressBack={() => onPressBackVisionScan()}
              title={_title} logout hideVersion
            />
            {renderBody()}
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Header onPressReloadHome={() => { }} title={''} logout />
          <View style={{ flex: 1 }}></View>
        </View>
      )}
      {isLoading && <LoadingView />}
      {renderAlertModal()}
    </SafeAreaView>
  );
};

export default LicensePlate;
