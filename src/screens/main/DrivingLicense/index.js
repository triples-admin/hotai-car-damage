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
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../../../assets';
import Header from '../../../components/Header';
import { colors } from '../../../theme';
import { routes } from '../../../navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import caseListPageStorage from '../../../api/storage/caseListPage';
import procedureAPI from '../../../api/axios/procedure';
import i18n from '../../../utils/i18n';
import LoadingView from '../../../components/Loading';
import TopScreen from '../../../components/TopScreen';
import Toggle from '../../../components/Toggle';
import ARButton from '../../../components/Button';
import { ScrollView } from 'react-native-gesture-handler';

const screen = Dimensions.get('window');

const ar_next_step = i18n.t('ar_next_step');
const ar_api_message_error = i18n.t('ar_api_message_error');
const driving_license_photo_1 = i18n.t('driving_license_photo_1');
const driving_license_photo_2 = i18n.t('driving_license_photo_2');
const driving_license_photo_3 = i18n.t('driving_license_photo_3');
const driving_license_photo_4 = i18n.t('driving_license_photo_4');
const driving_license_photo_5 = i18n.t('driving_license_photo_5');
const driving_license_photo_6 = i18n.t('driving_license_photo_6');
const driving_license_photo_7 = i18n.t('driving_license_photo_7');
const driving_license_photo_8 = i18n.t('driving_license_photo_8');
const driving_license_photo_9 = i18n.t('driving_license_photo_9');
const driving_license_photo_10 = i18n.t('driving_license_photo_10');

const ar_ok = i18n.t('ar_ok');
const ar_delete = i18n.t('ar_delete');
const ar_cancel = i18n.t('ar_cancel');
const _main_procedure_title_delete = i18n.t('main_procedure_title_delete');
const _main_procedure_content_delete = i18n.t('main_procedure_content_delete');
const main_procedure_toggle_camera = i18n.t('main_procedure_toggle_camera');
const main_procedure_toggle_gallery = i18n.t('main_procedure_toggle_gallery');

const { width } = Dimensions.get('screen');
const itemWidth = (width - 110 - (30 * 3)) / 4;
const itemHeight = itemWidth * 0.7;

const DrivingLicense = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const authen = route?.params?.authen;
  let caseData = useRef(route?.params?.caseData);
  const dataConfig = route?.params?.dataConfig ?? null;
  const onlyFullBodyPaint = route?.params?.onlyFullBodyPaint ?? false;

  const caseListPage = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [photo1, setPhoto1] = useState(
    caseData.current?.drivingLicense?.photo1,
  );
  const [photo2, setPhoto2] = useState(
    caseData.current?.drivingLicense?.photo2,
  );
  const [photo3, setPhoto3] = useState(
    caseData.current?.drivingLicense?.photo3,
  );
  const [photo4, setPhoto4] = useState(
    caseData.current?.drivingLicense?.photo4,
  );
  const [photo5, setPhoto5] = useState(
    caseData.current?.drivingLicense?.photo5,
  );
  const [photo6, setPhoto6] = useState(
    caseData.current?.drivingLicense?.photo6,
  );
  const [photo7, setPhoto7] = useState(
    caseData.current?.drivingLicense?.photo7,
  );
  const [photo8, setPhoto8] = useState(
    caseData.current?.drivingLicense?.photo8,
  );
  const [photo9, setPhoto9] = useState(
    caseData.current?.drivingLicense?.photo9,
  );
  const [photo10, setPhoto10] = useState(
    caseData.current?.drivingLicense?.photo10,
  );

  const [toggleStatus, setToggleStatus] = useState(
    caseData.current?.toggleStatus,
  );

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getCaseList = async () => {
        const result = await caseListPageStorage.get();
        if (result) {
          caseListPage.current = result;
          // console.log('-- getCaseList : ' + JSON.stringify(result));
          for (let i = 0; i < result.length; i++) {
            if (caseData.current && caseData.current.id === result[i].id) {
              caseData.current = result[i];
            }
          }
        }

        // reload new data
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      };
      getCaseList();
    });
  }, [navigation]);

  const saveToStorage = async () => {
    let caseUpdate = caseData.current;
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData.current?.id) {
        const newDrivingLicense = {
          photo1: photo1,
          photo2: photo2,
          photo3: photo3,
          photo4: photo4,
          photo5: photo5,
          photo6: photo6,
          photo7: photo7,
          photo8: photo8,
          photo9: photo9,
          photo10: photo10,
        };
        element.drivingLicense = newDrivingLicense;
        caseData.current.drivingLicense = newDrivingLicense;
        // console.log('--- element : ' + JSON.stringify(element));

        caseUpdate = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    return caseUpdate;
  };

  const autoSave = async (
    list1,
    list2,
    list3,
    list4,
    list5,
    list6,
    list7,
    list8,
    list9,
    list10,
  ) => {
    // console.log('--- autoSave : ' + JSON.stringify(list2));
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData.current?.id) {
        const newDrivingLicense = {
          photo1: list1,
          photo2: list2,
          photo3: list3,
          photo4: list4,
          photo5: list5,
          photo6: list6,
          photo7: list7,
          photo8: list8,
          photo9: list9,
          photo10: list10,
        };
        element.drivingLicense = newDrivingLicense;
        caseData.current.drivingLicense = newDrivingLicense;
        // console.log('--- element : ' + JSON.stringify(element));
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
  };

  const callbackDocument = async (ptType, ptData) => {
    // console.log('----- callbackDocument driving - photoType : ' + ptType + '----' + JSON.stringify(ptData));
    if (ptType && ptData) {
      // console.log('----- callbackDocument : ' + JSON.stringify(ptData));
      if (ptType === 'photo1') {
        let newData = [...ptData];
        setPhoto1(newData);
        await autoSave(
          newData,
          photo2,
          photo3,
          photo4,
          photo5,
          photo6,
          photo7,
          photo8,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo2') {
        let newData = [...ptData];
        setPhoto2(newData);
        await autoSave(
          photo1,
          newData,
          photo3,
          photo4,
          photo5,
          photo6,
          photo7,
          photo8,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo3') {
        let newData = [...ptData];
        setPhoto3(newData);
        await autoSave(
          photo1,
          photo2,
          newData,
          photo4,
          photo5,
          photo6,
          photo7,
          photo8,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo4') {
        let newData = [...ptData];
        setPhoto4(newData);
        await autoSave(
          photo1,
          photo2,
          photo3,
          newData,
          photo5,
          photo6,
          photo7,
          photo8,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo5') {
        let newData = [...ptData];
        setPhoto5(newData);
        await autoSave(
          photo1,
          photo2,
          photo3,
          photo4,
          newData,
          photo6,
          photo7,
          photo8,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo6') {
        let newData = [...ptData];
        setPhoto6(newData);
        await autoSave(
          photo1,
          photo2,
          photo3,
          photo4,
          photo5,
          newData,
          photo7,
          photo8,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo7') {
        let newData = [...ptData];
        setPhoto7(newData);
        await autoSave(
          photo1,
          photo2,
          photo3,
          photo4,
          photo5,
          photo6,
          newData,
          photo8,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo8') {
        let newData = [...ptData];
        setPhoto8(newData);
        await autoSave(
          photo1,
          photo2,
          photo3,
          photo4,
          photo5,
          photo6,
          photo7,
          newData,
          photo9,
          photo10,
        );
      } else if (ptType === 'photo9') {
        let newData = [...ptData];
        setPhoto9(newData);
        await autoSave(
          photo1,
          photo2,
          photo3,
          photo4,
          photo5,
          photo6,
          photo7,
          photo8,
          newData,
          photo10,
        );
      } else if (ptType === 'photo10') {
        let newData = [...ptData];
        setPhoto10(newData);
        await autoSave(
          photo1,
          photo2,
          photo3,
          photo4,
          photo5,
          photo6,
          photo7,
          photo8,
          photo9,
          newData,
        );
      }
    }
  };

  const onPressPhoto = (title, ptType) => {
    // console.log('----- next page : ' + JSON.stringify(caseData.drivingLicense));
    // console.log('----- next title : ',title, ptType);
    navigation.navigate(routes.DRIVING_LICENSE_DETAIL, {
      caseData: caseData.current,
      dataConfig: dataConfig,
      authen: authen,
      photoType: ptType,
      callbackDocument: callbackDocument,
      title: title,
      toggleStatus: toggleStatus,
    });
  };

  const apiCallFailed = () => {
    Alert.alert('', ar_api_message_error, [
      {
        text: ar_ok,
        onPress: () => {
          console.log('OK Pressed');
        },
      },
    ]);
  };

  const onPressGoHome = async () => {
    await saveToStorage();
    navigation.reset({
      routes: [{ name: routes.HOMESCREEN }],
    });
  };

  const onPressGoBack = async () => {
    const newCase = await saveToStorage();
    // navigation.goBack();
    navigation.navigate(routes.LICENSEPLATESCREEN, {
      caseData: newCase,
      dataConfig: dataConfig,
      authen: authen,
    });
  };

  const onPressNextStep = async () => {
    await saveToStorage();
    if (caseData.current.progress >= 4) {
      if (!onlyFullBodyPaint) {
        navigation.navigate(routes.MEASURE_AREA, {
          caseData: caseData.current,
          dataConfig: dataConfig,
          authen: authen,
        });
      }
    } else {
      navigation.navigate(routes.DAMAGEPARTSCREEN, {
        caseData: caseData.current,
        dataConfig: dataConfig,
        authen: authen,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    }
  };

  const onPressAssessment = async () => {
    await saveToStorage();
    // console.log('------------ case progress:', caseData.current.progress);
    if (caseData?.current?.progress == 7) {
      navigation.navigate(routes.ASSESSMENTPROCEDURESCREEN, {
        caseData: caseData.current,
        dataConfig: dataConfig,
        authen: authen,
        fromHome: false,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    } else {
      navigation.navigate(routes.MAINPROCEDURESCREEN, {
        caseData: caseData.current,
        dataConfig: dataConfig,
        authen: authen,
        fromHome: false,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    }
  };

  const renderMain = () => {
    const array = [
      { text: driving_license_photo_1, item: photo1, type: 'photo1' },
      { text: driving_license_photo_2, item: photo2, type: 'photo2' },
      { text: driving_license_photo_3, item: photo3, type: 'photo3' },
      { text: driving_license_photo_4, item: photo4, type: 'photo4' },
      { text: driving_license_photo_5, item: photo5, type: 'photo5' },
      { text: driving_license_photo_6, item: photo6, type: 'photo6' },
      { text: driving_license_photo_7, item: photo7, type: 'photo7' },
      { text: driving_license_photo_8, item: photo8, type: 'photo8' },
      { text: driving_license_photo_9, item: photo9, type: 'photo9' },
      { text: driving_license_photo_10, item: photo10, type: 'photo10' },
    ];

    return (
      <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.bodyView}>
          {array.map((element, index) => {
            const marginTop = index > 3 ? 35 : 0;
            const marginLeft = index % 4 == 0 ? 0 : 30;
            return (
              <View style={{ flexDirection: 'column', marginTop: marginTop, marginLeft: marginLeft }}>
                <TouchableOpacity style={styles.buttonView}
                  onPress={() => onPressPhoto(element.text, element.type)}
                >
                  {element.item?.length > 0 && element.item[0]?.path ? (
                    <Image style={styles.image}
                      source={{ uri: element.item[0]?.path }}
                    />
                  ) : (
                    <Image style={styles.imageIcon}
                      source={require('../../../assets/icons/ic_add.png')}
                    />
                  )}
                </TouchableOpacity>
                <View style={styles.textView}>
                  <Text style={styles.text}>
                    {element.text}
                  </Text>
                  <Text style={styles.textCount}>
                    {element.item?.length}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    );
  }

  const onPressToggle = async status => {
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData.current?.id) {
        caseData.current.toggleStatus = status;
      }
    });
    await caseListPageStorage.set(newList);
    setToggleStatus(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        iconBack={false}
        onPressBack={() => onPressGoBack()}
        iconHome
        onPressHome={() => onPressGoHome()}
        title={caseData.current?.licensePlate}
      />
      <TopScreen
        topID={1}
        onPressPhotos={(caseData.current.progress >= 4 && onlyFullBodyPaint) ? null : onPressNextStep}
        onPressToggle={onPressToggle}
        onPressAssessment={
          caseData.current.progress >= 4 ? onPressAssessment : null
        }
      />
      {renderMain()}
      <View style={{ position: 'absolute', right: 50, bottom: 30 }}>
        <Toggle
          titleEnable={main_procedure_toggle_camera}
          titleDisable={main_procedure_toggle_gallery}
          status={toggleStatus}
          onPressToggle={onPressToggle}
        />
      </View>
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default DrivingLicense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bodyView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 55,
    paddingBottom: 55,
    flexWrap: 'wrap',
  },
  buttonView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: itemWidth,
    height: itemHeight,
    backgroundColor: colors.gray,
    borderRadius: 8,
  },
  textView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontSize: 20,
    color: colors.blackGray
  },
  textCount: {
    marginLeft: 10,
    fontSize: 20,
    color: colors.darkGray,
  },
  image: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 8
  },
  imageIcon: {
    width: 50,
    height: 50
  }
});
