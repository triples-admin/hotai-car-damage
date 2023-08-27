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
  PanResponder,
  Animated,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Header from '../../../components/Header';
import { colors } from '../../../theme';
import { routes } from '../../../navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../../../utils/i18n';
import LoadingView from '../../../components/Loading';
import caseListPageStorage from '../../../api/storage/caseListPage';
import { NativeService, EventEmitter } from '../../../bridge/NativeService';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { TapGestureHandler } from 'react-native-gesture-handler';
import _ from 'lodash';
import VerticalSlider from '../../../components/Slider';

const screen = Dimensions.get('window');
const _width = screen.width;
const _height = screen.height;

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

const measure_camera_confirm_title = i18n.t('measure_camera_confirm_title');
const measure_camera_confirm_option_1 = i18n.t(
  'measure_camera_confirm_option_1',
);
const measure_camera_confirm_option_2 = i18n.t(
  'measure_camera_confirm_option_2',
);
const measure_camera_confirm_option_3 = i18n.t(
  'measure_camera_confirm_option_3',
);

const takePhotoOptions = {
  photoCodec: 'jpeg',
  qualityPrioritization: 'speed',
  quality: 20,
  skipMetadata: true,
};

const RIGHT_FRONT = 'rightFront';
const RIGHT_REAR = 'rightRear';
const LEFT_REAR = 'leftRear';
const LEFT_FRONT = 'leftFront';

// 1.
const ALTIS = {
  rightFront: require('../../../assets/wireframe/ALTIS/ALTIS-01.png'),
  leftFront: require('../../../assets/wireframe/ALTIS/ALTIS-02.png'),
  rightRear: require('../../../assets/wireframe/ALTIS/ALTIS-03.png'),
  leftRear: require('../../../assets/wireframe/ALTIS/ALTIS-04.png'),
};

// 2.
const C_HR = {
  rightFront: require('../../../assets/wireframe/C-HR/C-HR-01.png'),
  leftFront: require('../../../assets/wireframe/C-HR/C-HR-02.png'),
  rightRear: require('../../../assets/wireframe/C-HR/C-HR-03.png'),
  leftRear: require('../../../assets/wireframe/C-HR/C-HR-04.png'),
};

// 3.
const CAMRY = {
  rightFront: require('../../../assets/wireframe/CAMRY/CAMRY-01.png'),
  leftFront: require('../../../assets/wireframe/CAMRY/CAMRY-02.png'),
  rightRear: require('../../../assets/wireframe/CAMRY/CAMRY-03.png'),
  leftRear: require('../../../assets/wireframe/CAMRY/CAMRY-04.png'),
};

// 4.
const COROLLA_CROSS = {
  rightFront: require('../../../assets/wireframe/COROLLA_CROSS/COROLLA_CROSS-01.png'),
  leftFront: require('../../../assets/wireframe/COROLLA_CROSS/COROLLA_CROSS-02.png'),
  rightRear: require('../../../assets/wireframe/COROLLA_CROSS/COROLLA_CROSS-03.png'),
  leftRear: require('../../../assets/wireframe/COROLLA_CROSS/COROLLA_CROSS-04.png'),
};

// 5.
const RAV4 = {
  rightFront: require('../../../assets/wireframe/RAV4/RAV4-01.png'),
  leftFront: require('../../../assets/wireframe/RAV4/RAV4-02.png'),
  rightRear: require('../../../assets/wireframe/RAV4/RAV4-03.png'),
  leftRear: require('../../../assets/wireframe/RAV4/RAV4-04.png'),
};

// 6.
const SIENTA = {
  rightFront: require('../../../assets/wireframe/SIENTA/SIENTA-01.png'),
  leftFront: require('../../../assets/wireframe/SIENTA/SIENTA-02.png'),
  rightRear: require('../../../assets/wireframe/SIENTA/SIENTA-03.png'),
  leftRear: require('../../../assets/wireframe/SIENTA/SIENTA-04.png'),
};

// 7.
const VIOS = {
  rightFront: require('../../../assets/wireframe/VIOS/VIOS-01.png'),
  leftFront: require('../../../assets/wireframe/VIOS/VIOS-02.png'),
  rightRear: require('../../../assets/wireframe/VIOS/VIOS-03.png'),
  leftRear: require('../../../assets/wireframe/VIOS/VIOS-04.png'),
};

// 8.
const YARIS = {
  rightFront: require('../../../assets/wireframe/YARIS/YARIS-01.png'),
  leftFront: require('../../../assets/wireframe/YARIS/YARIS-02.png'),
  rightRear: require('../../../assets/wireframe/YARIS/YARIS-03.png'),
  leftRear: require('../../../assets/wireframe/YARIS/YARIS-04.png'),
};

// 9.
const ES = {
  rightFront: require('../../../assets/wireframe/ES/ES-01.png'),
  leftFront: require('../../../assets/wireframe/ES/ES-02.png'),
  rightRear: require('../../../assets/wireframe/ES/ES-03.png'),
  leftRear: require('../../../assets/wireframe/ES/ES-04.png'),
};

// 10.
const NX = {
  rightFront: require('../../../assets/wireframe/NX/NX-01.png'),
  leftFront: require('../../../assets/wireframe/NX/NX-02.png'),
  rightRear: require('../../../assets/wireframe/NX/NX-03.png'),
  leftRear: require('../../../assets/wireframe/NX/NX-04.png'),
};

// 11.
const UX = {
  rightFront: require('../../../assets/wireframe/UX/UX-01.png'),
  leftFront: require('../../../assets/wireframe/UX/UX-02.png'),
  rightRear: require('../../../assets/wireframe/UX/UX-03.png'),
  leftRear: require('../../../assets/wireframe/UX/UX-04.png'),
};

// METHOD
const DATAMethod = [
  {
    REFCD: '1',
    REFCDNM: '修理', // fix
  },
  {
    REFCD: '2',
    REFCDNM: '更換', // replace
  },
];

// 1. Right Front 45 - front bumper, engine lid, right front fender, right front door
// 2. Right rear 45 - right rear door, right rear fender,  trunk, rear bumper
// 3. Left Rear 45 - trunk, rear bumper, left rear fender, left rear door
// 4. Left front 45 - left front door, left front fender, engine lid, front bumper

const MeasureAreaCamera = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;

  const authen = route?.params?.authen;
  const caseData = route?.params?.caseData;
  const dataConfig = route?.params?.dataConfig ?? null;
  const caseListPage = useRef();
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [sliderValue, setSliderValue] = useState(133);
  const [maskCar, setMaskCar] = useState({
    width: _width,
    height: _width / 1.333,
  });
  const damagedPart = caseData?.damagedPart;
  const damagedAngle = caseData?.damagedAngle;

  const currentDamage = useRef(null);
  const allowMeasure = useRef(true);
  const indexAngle = useRef(0);

  const [dataMethod, setDataMethod] = useState(DATAMethod);
  const [dataArea, setDataArea] = useState(dataConfig[4]);
  const isFirstJoin = useRef(true);
  const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
  const [showFlashOptions, setShowFlashOptions] = useState(false);
  const [flashItemStatus, setFlashItemStatus] = useState('off');
  const [foucusCameraVisible, setFoucusCameraVisible] = useState({
    x: null,
    y: null,
    visible: false,
  });
  const [isFullPaint, setIsFullPaint] = useState(false);

  const dataMappedMethod = dataMethod.map(item => {
    return {
      value: item.REFCD,
      label: item.REFCDNM,
    };
  });

  useEffect(() => {
    let newSlideValue = sliderValue * (100 / 190) + 90;
    setMaskCar({
      width: (_width * newSlideValue) / 190,
      height: ((_width / 1.333) * newSlideValue) / 190,
    });
  }, [sliderValue]);

  useEffect(() => {
    // console.log('--- MeasureAreaCamera - caseData : ' + JSON.stringify(caseData.damagedPart));
    if (!_.isEmpty(caseData?.damagedPart)) {
      caseData.damagedPart.forEach(element => {
        if (element.id === 13) {
          setIsFullPaint(true);
        }
      })
    }
    const getCaseList = async () => {
      const result = await caseListPageStorage.get();
      if (result) {
        caseListPage.current = result;
      }
    };
    getCaseList();
  }, []);

  useEffect(() => {
    // console.log('--- damagedPart : ' + JSON.stringify(damagedPart));
    // console.log('--- damagedAngle : ' + JSON.stringify(damagedAngle));
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    setNextAngle();
  }, []);

  useEffect(() => {
    const subscriptionDone = EventEmitter.addListener(
      'onResultImageAR',
      async result => {
        // console.log('--------- JS onResultImageAR -----------', result);
        // console.log('--------- JS onResultImageAR 1 -----------', JSON.stringify(result));
        const imgBase64 = result?.base64;
        const level = result?.level;
        // console.log('level: ' + JSON.stringify(level));

        const tempArea = result?.area;
        const arrArea = tempArea.split('dm');
        let area = '';
        if (arrArea.length > 1) {
          area = Math.ceil(parseFloat(arrArea[0]));
        }
        const newImage = {
          path: `data:image/jpeg;base64,${imgBase64}`,
          isMeasure: true,
        };
        try {
          const dataCompress = await compressPhoto(newImage.path, 1920);
          const newImageComporess = {
            path: `data:image/jpeg;base64,${dataCompress?.path ? dataCompress?.path : imgBase64
              }`,
            isMeasure: true,
          };

          for (let i = 0; i < damagedPart.length; i++) {
            const element = damagedPart[i];
            if (element.id === currentDamage.current?.part?.id) {
              damagedPart[i].PHOTOS.push(newImageComporess);
              if (checkBumper(element.REGION) === true) {
                // bumper
                if (result?.level === 'E') {
                  // replace
                  damagedPart[i].method = dataMappedMethod[1];
                } else {
                  // Fixing
                  damagedPart[i].method = dataMappedMethod[0];
                  const objLevel = { label: level, value: level };
                  const objArea = { label: area, value: area };
                  damagedPart[i].level = objLevel;
                  damagedPart[i].area = objArea;
                }
              } else {
                // no bumper
                if (result?.level === 'E') {
                  // replace
                  damagedPart[i].method = dataMappedMethod[1];
                } else {
                  // A, B, C, UPS
                  const objLevel = { label: level, value: level };
                  const objArea = { label: area, value: area };
                  damagedPart[i].level = objLevel;
                  damagedPart[i].area = objArea;
                }
                // }
              }
            }
          }
        } catch (error) { }
        autoSave(level == 'UPS');
        alertConfirm();
      },
    );

    const subscriptionBack = EventEmitter.addListener(
      'onBackImageAR',
      result => {
        // console.log('--------- JS onBackImageAR -----------', result);
        setShowCamera(true);
      },
    );

    const subscriptionSkip = EventEmitter.addListener(
      'onSkipImageAR',
      result => {
        // console.log('--------- JS onSkipImageAR -----------', result);
        alertConfirm();
      },
    );
    const unsubscribe = () => {
      subscriptionDone.remove();
      subscriptionBack.remove();
      subscriptionSkip.remove();
    };
    return () => unsubscribe();
  }, []);

  const compressPhoto = async (imageBase64, maxWidth) => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        imageBase64,
        (width, height) => {
          let imageWidth = width;
          let imageHeight = height;
          if (width > maxWidth) {
            imageWidth = maxWidth;
            imageHeight = maxWidth * (height / width);
          }
          ImageResizer.createResizedImage(
            imageBase64,
            imageWidth,
            imageHeight,
            'JPEG',
            80,
            0,
          ).then(
            response => {
              RNFS.readFile(response?.path, 'base64')
                .then(data => {
                  resolve({ path: data });
                })
                .catch(error => reject({ error: error }));
            },
            error => reject({ error: error }),
          );
        },
        error => {
          reject({ error: error });
        },
      );
    });
  };

  const checkBumper = value => {
    const region = value.trim();
    if (region === '14' || region === '17') {
      return true;
    } else {
      return false;
    }
  };

  const alertConfirm = () => {
    Alert.alert(measure_camera_confirm_title, '', [
      {
        text: measure_camera_confirm_option_1,
        onPress: () => onPressConfirm('1'),
      },
      {
        text: measure_camera_confirm_option_2,
        onPress: () => onPressConfirm('2'),
      },
      {
        text: measure_camera_confirm_option_3,
        onPress: () => onPressConfirm('3'),
      },
    ]);
  };

  const onPressConfirm = async option => {
    if (option === '1') {
      // measure photos again
      if (NativeService) {
        let issetFullPaint = false;
        if (!_.isEmpty(caseData?.damagedPart)) {
          caseData.damagedPart.forEach(element => {
            if (element.id === 13) {
              issetFullPaint = true;
            }
          })
        }
        let resData = await NativeService.startMeasure(
          caseData?.licensePlate,
          currentDamage.current?.name,
          issetFullPaint,
        );
        // console.log("----------- JS send -- start measure : " + JSON.stringify(resData));
      }
    } else if (option === '2') {
      // references photos
      allowMeasure.current = false;
      setShowCamera(true);
    } else if (option === '3') {
      // no
      allowMeasure.current = true;
      setNextDamagedPart();
    }
  };

  const getImageSkeleton = angle => {
    let result = '';
    const _info = dataConfig[0];
    const _config = _info[0];
    const _name = _config?.EPCID ?? '';
    if (_name.toUpperCase().includes('ALTIS')) {
      result = ALTIS[angle];
    } else if (_name.toUpperCase().includes('C-HR')) {
      result = C_HR[angle];
    } else if (_name.toUpperCase().includes('CAMRY')) {
      result = CAMRY[angle];
    } else if (_name.toUpperCase().includes('COROLLA CROSS')) {
      result = COROLLA_CROSS[angle];
    } else if (_name.toUpperCase().includes('RAV4')) {
      result = RAV4[angle];
    } else if (_name.toUpperCase().includes('SIENTA')) {
      result = SIENTA[angle];
    } else if (_name.toUpperCase().includes('VIOS')) {
      result = VIOS[angle];
    } else if (_name.toUpperCase().includes('YARIS')) {
      result = YARIS[angle];
    } else if (_name.toUpperCase().includes('ES')) {
      result = ES[angle];
    } else if (_name.toUpperCase().includes('NX')) {
      result = NX[angle];
    } else if (_name.toUpperCase().includes('UX')) {
      result = UX[angle];
    }
    return result;
  };

  const setNextAngle = () => {
    if (indexAngle.current < damagedAngle.length) {
      // take picture Angles
      const angle = damagedAngle[indexAngle.current];
      const imageCar = getImageSkeleton(angle.value);
      if (isFirstJoin.current && angle.photo !== null) {
        indexAngle.current = indexAngle.current + 1;
        isFirstJoin.current = false;
        currentDamage.current = {
          type: 'part',
          key: angle.value,
          skeleton: imageCar,
          name: angle.name,
        };
        setNextDamagedPart();
      } else if (angle.photo !== null) {
        currentDamage.current = {
          type: 'part',
          key: angle.value,
          skeleton: imageCar,
          name: angle.name,
        };
        indexAngle.current = indexAngle.current + 1;
        setNextDamagedPart();
      } else {
        currentDamage.current = {
          type: 'angle',
          key: angle.value,
          skeleton: imageCar,
          name: angle.name,
        };
        setShowCamera(true);
      }
    } else {
      // next page
      // console.log('----- next page ---- ');
      saveToStorage();
    }
  };

  const createDataPart = ANGLE => {
    let newPart = null;
    for (let i = 0; i < damagedPart.length; i++) {
      const element = damagedPart[i];
      if (element.PHOTOS.length === 0) {
        const group = element.group;
        if (group.indexOf(ANGLE) > -1) {
          //In the array!
          newPart = element;
          break;
        } else {
          //Not in the array
        }
      }
    }
    if (newPart) {
      // take new part
      currentDamage.current = {
        type: 'part',
        key: ANGLE,
        skeleton: '',
        name: newPart?.REGIONM,
        part: newPart,
      };
      setShowCamera(true);
    } else {
      // next angle
      setNextAngle();
    }
  };

  const setNextDamagedPart = () => {
    // console.log('------ setNextDamagedPart - currentDamage: ' + JSON.stringify(currentDamage.current));
    setShowCamera(false);
    if (currentDamage.current?.key === RIGHT_FRONT) {
      createDataPart(RIGHT_FRONT);
    } else if (currentDamage.current?.key === RIGHT_REAR) {
      createDataPart(RIGHT_REAR);
    } else if (currentDamage.current?.key === LEFT_REAR) {
      createDataPart(LEFT_REAR);
    } else if (currentDamage.current?.key === LEFT_FRONT) {
      createDataPart(LEFT_FRONT);
    }
  };

  const saveToStorage = async () => {
    let updateCase = caseData;
    const newList = caseListPage.current;
    newList?.forEach(element => {
      if (element.id === caseData?.id) {
        element.damagedPart = damagedPart;
        element.damagedAngle = damagedAngle;
        element.progress = element.progress == 7 ? 7 : 4;
        updateCase = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);

    // ----- goto next page ---
    navigation.navigate(routes.MEASURE_AREA, {
      caseData: updateCase,
      dataConfig: dataConfig,
      authen: authen,
    });
  };

  const autoSave = async ups => {
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData?.id) {
        element.damagedPart = damagedPart;
        element.damagedAngle = damagedAngle;
        if (ups) {
          element.ups = ups;
        }
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
  };

  const onPressCapture = async () => {
    try {
      if (cameraRef.current == null) throw new Error('Camera ref is null!');
      // console.log('Taking photo...');
      const result = await cameraRef.current.takePhoto({
        ...takePhotoOptions,
        flash: flashItemStatus,
      });
      // console.log(' photo : ' + JSON.stringify(result));

      // --- not save & goto next page
      RNFS.readFile(result?.path, 'base64').then(async res => {
        // console.log("----------- image res : " + res);
        const newImage = { path: `data:image/jpeg;base64,${res}` };
        if (currentDamage.current?.type === 'angle') {
          // save photo angle
          let angle = damagedAngle[indexAngle.current];
          // console.log('----- angle: ' + JSON.stringify(angle));
          const dataCompress = await compressPhoto(newImage.path, 1920);
          const newImageComporess = {
            path: `data:image/jpeg;base64,${dataCompress?.path ? dataCompress?.path : res
              }`,
          };
          angle.photo = newImageComporess;
          damagedAngle[indexAngle.current] = angle;
          indexAngle.current = indexAngle.current + 1;

          await autoSave();
          setNextDamagedPart();
        } else if (currentDamage.current?.type === 'part') {
          // save photo part
          const dataCompress = await compressPhoto(newImage.path, 1920);
          const newImageComporess = {
            path: `data:image/jpeg;base64,${dataCompress?.path ? dataCompress?.path : res
              }`,
          };
          for (let i = 0; i < damagedPart.length; i++) {
            const element = damagedPart[i];
            if (element.id === currentDamage.current?.part?.id) {
              damagedPart[i].PHOTOS.push(newImageComporess);
              // go to measure
              if (!caseData.selectedBodyPaint || element.id !== 13) {
                if (allowMeasure.current === true) {
                  setShowCamera(false);
                  if (NativeService) {
                    let resData = await NativeService.startMeasure(
                      caseData?.licensePlate,
                      currentDamage.current?.name,
                      isFullPaint,
                    );
                    // console.log("----------- JS send -- start measure : " + JSON.stringify(resData));
                  }
                } else {
                  alertConfirm();
                }
              } else {
                onPressConfirm('3');
              }

              // --------------
              return;
            }
          }
        }
      });
    } catch (e) {
      // console.error('Failed to take photo!', e);
    }
  };

  const handleShowFlashOptions = () => {
    setShowFlashOptions(!showFlashOptions);
  };

  const handleSetFlashStatus = status => {
    setShowFlashOptions(false);
    setFlashItemStatus(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      {device && showCamera ? (
        <>
          {currentDamage.current?.skeleton &&
            currentDamage.current?.type === 'angle' ? (
            <Camera
              ref={cameraRef}
              photo={true}
              style={{
                position: 'absolute',
                left: 0,
                top: 50,
                right: 0,
                bottom: 0,
              }}
              quality={100}
              device={device}
              isActive={true}
              enableZoomGesture={true}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={currentDamage.current?.skeleton}
                  style={{
                    width: maskCar.width,
                    height: maskCar.height,
                  }}
                />
              </View>
            </Camera>
          ) : (
            <TapGestureHandler
              onHandlerStateChange={({ nativeEvent }) => {
                setFoucusCameraVisible({
                  x: nativeEvent.x,
                  y: nativeEvent.y,
                  visible: true,
                });
                cameraRef.current?.focus({ x: nativeEvent.x, y: nativeEvent.y });
                setTimeout(() => {
                  setFoucusCameraVisible({
                    x: null,
                    y: null,
                    visible: false,
                  });
                }, 1200);
              }}>
              <Camera
                ref={cameraRef}
                photo={true}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 50,
                  right: 0,
                  bottom: 0,
                }}
                quality={100}
                device={device}
                isActive={true}
                enableZoomGesture={true}>
                {foucusCameraVisible.visible && (
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      position: 'absolute',
                      top: foucusCameraVisible.y - 35,
                      left: foucusCameraVisible.x - 40,
                      backgroundColor: 'transparent',
                    }}
                    source={require('../../../assets/icons/focus.png')}
                  />
                )}
              </Camera>
            </TapGestureHandler>
          )}
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              alignItems: 'center',
              width: 90,
              top: _height / 2 + 40,
              right: 10,
            }}>
            <TouchableOpacity
              style={{ padding: 20 }}
              onPress={handleShowFlashOptions}>
              <Image
                source={
                  flashItemStatus === 'off'
                    ? require('../../../assets/icons/thunder_off.png')
                    : require('../../../assets/icons/thunder.png')
                }
                style={{
                  tintColor:
                    flashItemStatus === 'on' ? colors.yellow : colors.white,
                  width: 25,
                  height: 35,
                }}
              />
            </TouchableOpacity>
            {showFlashOptions && (
              <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => handleSetFlashStatus('auto')}>
                <Text
                  style={{
                    fontSize: 18,
                    color:
                      flashItemStatus === 'auto' ? colors.yellow : colors.white,
                  }}>
                  Auto
                </Text>
              </TouchableOpacity>
            )}
            {showFlashOptions && (
              <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => handleSetFlashStatus('on')}>
                <Text
                  style={{
                    fontSize: 18,
                    color:
                      flashItemStatus === 'on' ? colors.yellow : colors.white,
                  }}>
                  On
                </Text>
              </TouchableOpacity>
            )}
            {showFlashOptions && (
              <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => handleSetFlashStatus('off')}>
                <Text
                  style={{
                    fontSize: 18,
                    color:
                      flashItemStatus === 'off' ? colors.yellow : colors.white,
                  }}>
                  Off
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 100,
              left: 0,
              right: 0,
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: '#ffffffaa',
                borderColor: 'white',
                borderWidth: 2,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <Text style={{ fontSize: 20, color: colors.blackGray }}>
                {currentDamage.current?.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              // right: _width / 2 - 30,
              right: 20,
              top: _height / 2 - 30,
            }}
            onPress={() => onPressCapture()}>
            <Image
              style={{ width: 70, height: 70 }}
              source={require('../../../assets/icons/ic_capture.png')}
            />
          </TouchableOpacity>
        </>
      ) : null}
      <Header iconBack iconHome title={caseData?.licensePlate} />
      {isLoading && <LoadingView />}
      {currentDamage.current?.skeleton &&
        currentDamage.current?.type === 'angle' ? (
        <VerticalSlider
          thumbSize={20}
          style={{ left: 30, top: _height / 2 - 175 }}
          height={200}
          width={10}
          color={colors.white}
          thumbColor={colors.gray}
          value={sliderValue}
          setValue={setSliderValue}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default MeasureAreaCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
});
