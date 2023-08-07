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
import React, {useState, useRef, useEffect} from 'react';
import {icons} from '../../../assets';
import Header from '../../../components/Header';
import {colors} from '../../../theme';
import {routes} from '../../../navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import caseListPageStorage from '../../../api/storage/caseListPage';
import procedureAPI from '../../../api/axios/procedure';
import i18n from '../../../utils/i18n';
import LoadingView from '../../../components/Loading';
import TopScreen from '../../../components/TopScreen';
import ARButton from '../../../components/Button';
import {ScrollView} from 'react-native-gesture-handler';

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
    caseData.current?.drivingLicense?.photo9,
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
      routes: [{name: routes.HOMESCREEN}],
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
      if(!onlyFullBodyPaint){
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
    return (
      <ScrollView style={{flex: 1, flexDirection: 'column'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            flexWrap: 'wrap',
          }}>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_1, 'photo1')}>
              {photo1?.length > 0 && photo1[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo1[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_1}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo1?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_2, 'photo2')}>
              {photo2?.length > 0 && photo2[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo2[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_2}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo2?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_3, 'photo3')}>
              {photo3?.length > 0 && photo3[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo3[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_3}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo3?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_4, 'photo4')}>
              {photo4?.length > 0 && photo4[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo4[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_4}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo4?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_5, 'photo5')}>
              {photo5?.length > 0 && photo5[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo5[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_5}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo5?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_6, 'photo6')}>
              {photo6?.length > 0 && photo6[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo6[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_6}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo6?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_7, 'photo7')}>
              {photo7?.length > 0 && photo7[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo7[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_7}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo7?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_8, 'photo8')}>
              {photo8?.length > 0 && photo8[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo8[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_8}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo8?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_9, 'photo9')}>
              {photo9?.length > 0 && photo9[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo9[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_9}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo9?.length}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'column', marginLeft: 37, marginTop: 30}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 150,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressPhoto(driving_license_photo_10, 'photo10')}>
              {photo10?.length > 0 && photo10[0]?.path ? (
                <Image
                  style={{width: 200, height: 150, borderRadius: 8}}
                  source={{uri: photo10[0]?.path}}
                />
              ) : (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {driving_license_photo_10}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {photo10?.length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

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
        disablePhotos={true}
        onPressPhotos={(caseData.current.progress >= 4 && onlyFullBodyPaint ) ? null : onPressNextStep}
        disableAssessment={true}
        toggleStatus={toggleStatus}
        onPressToggle={onPressToggle}
        onPressAssessment={
          caseData.current.progress >= 4 ? onPressAssessment : null
        }
      />
      {renderMain()}
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
});
