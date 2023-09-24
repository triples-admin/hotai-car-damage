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
import ARButton from '../../../components/Button';
import Toggle from '../../../components/Toggle';

const screen = Dimensions.get('window');
const _width = screen.width;
const _height = screen.height;

const itemWidth = (_width - 110 - (30 * 3)) / 4;
const itemHeight = itemWidth * 0.7;

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
const main_procedure_toggle_camera = i18n.t('main_procedure_toggle_camera');
const main_procedure_toggle_gallery = i18n.t('main_procedure_toggle_gallery');
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

  const [isProgressOverSize, setIsProgressOverSize] = useState(false);

  useEffect(() => {
    checkProgress();
  });

  const checkProgress = async () => {
    const result = await caseListPageStorage.get();
    console.log('result', result)
    const item = result?.find(element => element.id == caseData?.id);
    if (item?.progress >= 6) {
      setIsProgressOverSize(true);
    }    
  }

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
      routes: [{ name: routes.HOMESCREEN }],
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
    return (
      <View style={{ flexDirection: 'row' }}>
        {damagedAngle?.map((element, index) => {
          const marginLeft = index % 4 == 0 ? 0 : 30;
          return (
            <View key={index} style={[styles.itemView, { marginLeft: marginLeft }]}>
              <TouchableOpacity style={styles.itemBtn} onPress={() => onPressPhoto(element)}>
                <Image style={styles.itemImg}
                  source={{ uri: element?.photo?.path }}
                />
              </TouchableOpacity>
              <Text style={styles.itemText} numberOfLines={1}>
                {element?.name}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderPart = () => {

    let view = [];
    damagedPart.forEach((element, index) => {
      const marginLeft = index % 4 == 0 ? 0 : 30;

      // 取得封面圖
      const photos = element?.PHOTOS;
      let coverImg = photos?.length > 0 ? element.PHOTOS[0] : '';
      photos.forEach(element => {
        if (element?.isMeasure) {
          coverImg = element;
        }
      });

      if (element?.id !== 13) {
        view.push(
          <View key={index} style={[styles.itemView, { marginLeft: marginLeft }]}>
            <TouchableOpacity style={styles.itemBtn}
              onPress={() => onPressAreaItem(element)}>
              {coverImg?.path ? (
                <Image style={styles.itemImg} source={{ uri: coverImg?.path }} />
              ) : (
                <Image style={{ width: 50, height: 50 }}
                  source={require('../../../assets/icons/ic_add.png')}
                />
              )}
            </TouchableOpacity>
            <View style={styles.partTextView}>
              <Text style={styles.partText}>
                {element?.REGIONM}
              </Text>
              <Text style={styles.partTextNum}>
                {photos?.length ?? '0'}
              </Text>
            </View>
          </View>,
        );
      }
    });

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {view}
      </View>
    );
  };

  const renderMain = () => {
    return (
      <View style={styles.mainView}>
        <Text style={styles.titleText}>
          {measure_area_damage_angle}
        </Text>
        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
          {renderAngle()}
        </View>
        <View style={styles.dividingLine} />
        <Text style={styles.titleText}>
          {measure_area_damage_area}
        </Text>
        <View style={{ flexDirection: 'column', paddingTop: 5 }}>
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
          marginTop: 25,
          marginBottom: 16,
        }}>
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
            <View style={{ position: 'absolute', top: 30, left: 0 }}>
              <Image
                style={{ width: _width, height: _height }}
                source={{ uri: damageSelected?.photo?.path }}
              />
            </View>
            <View
              style={{ position: 'absolute', top: 0, left: 0, width: _width }}>
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
        iconBack={isProgressOverSize ? false : true}
        onPressBack={() => onPressGoBack()}
        iconHome
        onPressHome={() => onPressGoHome()}
        title={caseData?.licensePlate}
      />
      <TopScreen
        topID={2}
        onPressAssessment={onPressValuation}
        toggleStatus={toggleStatus}
        onPressDocument={onPressDocument}
      />
      <ScrollView style={{ flex: 1 }}>{renderMain()}</ScrollView>
      <View style={{ position: 'absolute', right: 50, bottom: 30 }}>
        <Toggle
          titleEnable={main_procedure_toggle_camera}
          titleDisable={main_procedure_toggle_gallery}
          status={toggleStatus}
          onPressToggle={onPressToggle}
        />
      </View>
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
  mainView: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 55,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dividingLine: {
    marginVertical: 20,
    height: 2,
    backgroundColor: colors.darkGray,
  },
  itemView: {
    flexDirection: 'column',
  },
  itemImg: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 8,
  },
  itemText: {
    marginTop: 5,
    fontSize: 20,
    color: colors.primary,
    width: itemWidth,
  },
  partTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  partText: {
    fontSize: 20,
    color: colors.primary
  },
  partTextNum: {
    marginLeft: 10,
    fontSize: 20,
    color: colors.darkGray
  },
  itemBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: itemWidth,
    height: itemHeight,
    backgroundColor: colors.gray,
    borderRadius: 8,
  }
});
