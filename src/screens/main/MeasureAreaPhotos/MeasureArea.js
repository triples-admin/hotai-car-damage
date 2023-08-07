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
  ScrollView,
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

const screen = Dimensions.get('window');
const _width = screen.width;
const _height = screen.height;

const ar_save = i18n.t('ar_save');
const ar_api_message_error = i18n.t('ar_api_message_error');

const car_damage_photos_right_front_45 = i18n.t(
  'car_damage_photos_right_front_45',
);
const car_damage_photos_right_rear_45 = i18n.t(
  'car_damage_photos_right_rear_45',
);
const car_damage_photos_left_rear_45 = i18n.t('car_damage_photos_left_rear_45');
const car_damage_photos_left_front_45 = i18n.t(
  'car_damage_photos_left_front_45',
);

const driving_license_camera_next_step = i18n.t(
  'driving_license_camera_next_step',
);

const ar_valuation = i18n.t('ar_valuation');
const ar_ok = i18n.t('ar_ok');
const ar_sure = i18n.t('ar_sure');
const ar_delete = i18n.t('ar_delete');
const ar_cancel = i18n.t('ar_cancel');
const _main_procedure_title_delete = i18n.t('main_procedure_title_delete');
const _main_procedure_content_delete = i18n.t('main_procedure_content_delete');

const measure_area_damage_angle = i18n.t('measure_area_damage_angle');
const measure_area_damage_area = i18n.t('measure_area_damage_area');
const measure_area_confirm_title = i18n.t('measure_area_confirm_title');
const measure_area_confirm_content = i18n.t('measure_area_confirm_content');

const RIGHT_FRONT = 'rightFront';
const RIGHT_REAR = 'rightRear';
const LEFT_REAR = 'leftRear';
const LEFT_FRONT = 'leftFront';

const MeasureArea = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const authen = route?.params?.authen;
  const caseData = route?.params?.caseData;
  const dataConfig = route?.params?.dataConfig ?? null;
  const caseListPage = useRef([]);

  const damagedPart = caseData?.damagedPart ?? [];
  const damagedAngle = caseData?.damagedAngle ?? [];

  const [isLoading, setIsLoading] = useState(false);

  const [damageSelected, setDamageSelected] = useState();
  const [modalImage, setModalImage] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(caseData?.toggleStatus);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getCaseList = async () => {
        const result = await caseListPageStorage.get();
        if (result) {
          caseListPage.current = result;
          // console.log('-- MeasureArea - getCaseList : ' + JSON.stringify(result));
        }
      };
      getCaseList();
    });
  }, [navigation]);

  const reloadData = newPart => {
    for (let i = 0; i < damagedPart.length; i++) {
      if (damagedPart[i].id === newPart.id) {
        damagedPart[i] = newPart;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    saveToStorage();
  };

  const onPressPhoto = element => {
    setDamageSelected(element);
    setModalImage(true);
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

  const saveToStorage = async () => {
    let caseUpdate = caseData;
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData?.id) {
        element.damagedPart = damagedPart;
        element.damagedAngle = damagedAngle;
        caseUpdate = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    return caseUpdate;
  };

  const onPressValuation = () => {
    gotoNextStep();
    // Alert.alert(measure_area_confirm_title, measure_area_confirm_content, [
    //   {
    //     text: ar_cancel,
    //     onPress: () => console.log('Cancel Pressed'),
    //     style: 'cancel',
    //   },
    //   {
    //     text: ar_sure,
    //     onPress: () => gotoNextStep(),
    //   },
    // ]);
  };

  const onPressGoHome = async () => {
    await saveToStorage();
    navigation.reset({
      routes: [{name: routes.HOMESCREEN}],
    });
  };

  const onPressGoBack = async () => {
    const newCase = await saveToStorage();
    navigation.navigate(routes.DAMAGEPARTSCREEN, {
      caseData: newCase,
      dataConfig: dataConfig,
      authen: authen,
    });
  };

  const gotoNextStep = async () => {
    let newCase = caseData;
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData?.id) {
        element.damagedPart = damagedPart;
        element.damagedAngle = damagedAngle;
        newCase = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    // console.log('------------ case progress:', newCase.progress);
    if (newCase.progress == 7) {
      navigation.navigate(routes.ASSESSMENTPROCEDURESCREEN, {
        caseData: newCase,
        dataConfig: dataConfig,
        authen: authen,
        fromHome: false,
      });
    } else {
      navigation.navigate(routes.MAINPROCEDURESCREEN, {
        caseData: newCase,
        dataConfig: dataConfig,
        authen: authen,
      });
    }
  };

  const onPressDocument = () => {
    navigation.navigate(routes.DRIVING_LICENSE, {
      caseData: caseData,
      dataConfig: dataConfig,
      authen: authen,
    });
  };

  const onPressModalLeft = () => {
    setModalImage(false);
  };

  const onPressModalRight = () => {
    setModalImage(false);
    // console.log('-------- damageSelected: ' + JSON.stringify(damageSelected));
    // console.log('-------- damagedPart: ' + JSON.stringify(damagedPart));
    let nextItem = null;
    for (let i = 0; i < damagedPart.length; i++) {
      const element = damagedPart[i];
      const group = element.group ?? [];
      let result = false;
      group.forEach(itemGroup => {
        if (itemGroup === damageSelected.value) {
          result = true;
        }
      });
      if (result) {
        nextItem = element;
        break;
      }
    }
    onPressAreaItem(nextItem);
  };

  const onPressAreaItem = item => {
    navigation.navigate(routes.MEASURE_AREA_DETAIL, {
      caseData: caseData,
      dataConfig: dataConfig,
      authen: authen,
      dataDetail: item,
      callbackMeasureArea: reloadData,
      toggleStatus: toggleStatus,
    });
  };

  const renderAngle = () => {
    const widthBox = _width / 4 - 30;
    const heightBox = (widthBox * 2) / 3;

    // console.log('-- caseData : ' + JSON.stringify(caseData));
    // console.log('-- damagedAngle : ' + JSON.stringify(damagedAngle));

    let view = [];
    damagedAngle?.forEach((element, index) => {
      view.push(
        <View key={index} style={{flexDirection: 'column', marginRight: 20}}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: widthBox,
              height: heightBox,
              backgroundColor: colors.gray,
              borderRadius: 8,
            }}
            onPress={() => onPressPhoto(element)}>
            <Image
              style={{width: widthBox, height: heightBox, borderRadius: 8}}
              source={{uri: element?.photo?.path}}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 15,
              fontSize: 20,
              color: colors.blackGray,
              width: widthBox,
            }}
            numberOfLines={1}>
            {element?.name}
          </Text>
        </View>,
      );
    });
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>{view}</View>
    );
  };

  const renderPart = () => {
    const widthBox = _width / 4 - 30;
    const heightBox = (widthBox * 2) / 3;
    let view = [];
    damagedPart.forEach((element, index) => {
      const arrPhotos = element?.PHOTOS;
      let photo0 = element?.PHOTOS?.length > 0 ? element.PHOTOS[0] : '';
      arrPhotos.forEach(itemPhoto => {
        if (itemPhoto?.isMeasure) {
          photo0 = itemPhoto;
        }
      });
      if(element?.id !== 13) { 
        view.push(
          <View key={index} style={{flexDirection: 'column', marginRight: 20}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: widthBox,
                height: heightBox,
                backgroundColor: colors.gray,
                borderRadius: 8,
              }}
              onPress={() => onPressAreaItem(element)}>
              {photo0?.path ? (
                <Image
                  style={{width: widthBox, height: heightBox, borderRadius: 8}}
                  source={{uri: photo0?.path}}
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
                marginTop: 10,
                marginBottom: 20,
              }}>
              <Text style={{fontSize: 20, color: colors.blackGray}}>
                {element?.REGIONM}
              </Text>
              <Text
                style={{marginLeft: 10, fontSize: 20, color: colors.darkGray}}>
                {arrPhotos?.length ?? '0'}
              </Text>
            </View>
          </View>,
        );
      }
    });
    return (
      <View
        style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
        {view}
      </View>
    );
  };

  const renderMain = () => {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{marginLeft: 20, fontSize: 25, color: colors.black}}>
          {measure_area_damage_angle}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 10,
          }}>
          {renderAngle()}
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginVertical: 20,
            height: 1,
            backgroundColor: colors.darkGray,
          }}
        />
        <Text style={{marginLeft: 20, fontSize: 25, color: colors.black}}>
          {measure_area_damage_area}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            paddingHorizontal: 20,
            paddingTop: 10,
          }}>
          {renderPart()}
        </View>
      </View>
    );
  };

  const renderBottom = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 16,
        }}>
        {/* <TouchableOpacity
          style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24, backgroundColor: colors.blackGray, }}
          onPress={() => onPressDelete()}>
          <Image style={{ width: 30, height: 30 }} source={require('../../../assets/icons/trash_icon.webp')} />
        </TouchableOpacity> */}
        {/* <ARButton
          title={ar_save}
          style={{ backgroundColor: colors.primary, minWidth: 200 }}
          onPress={() => onPressSave()}
        /> */}
        {/* <ARButton
          title={ar_valuation}
          style={{ backgroundColor: colors.primary, minWidth: 200, marginHorizontal: 20 }}
          onPress={() => onPressValuation()}
        /> */}
      </View>
    );
  };

  const renderModalImage = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalImage}
        onRequestClose={() => {
          setModalImage(!modalImage);
        }}>
        <SafeAreaView style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}>
            <View style={{position: 'absolute', top: 30, left: 0}}>
              <Image
                style={{width: _width, height: _height}}
                source={{uri: damageSelected?.photo?.path}}
              />
            </View>
            <View
              style={{position: 'absolute', top: 0, left: 0, width: _width}}>
              <Header
                leftButton={true}
                onPressLeft={() => onPressModalLeft()}
                buttonRight={driving_license_camera_next_step}
                onPressRight={() => onPressModalRight()}
                title={damageSelected?.name}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
        iconBack={caseData.progress >= 6 ? false : true}
        onPressBack={() => onPressGoBack()}
        iconHome
        onPressHome={() => onPressGoHome()}
        title={caseData?.licensePlate}
      />
      <TopScreen
        disableDocument={true}
        disableAssessment={true}
        onPressAssessment={onPressValuation}
        toggleStatus={toggleStatus}
        onPressToggle={onPressToggle}
        onPressDocument={onPressDocument}
      />
      <ScrollView style={{flex: 1}}>{renderMain()}</ScrollView>
      {renderBottom()}
      {renderModalImage()}
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default MeasureArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
