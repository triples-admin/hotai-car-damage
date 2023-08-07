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

import Header from '../Header';
import {colors} from '../../theme';
import {routes} from '../../navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import i18n from '../../utils/i18n';
import LoadingView from '../../components/Loading';
import {TapGestureHandler} from 'react-native-gesture-handler';

import {Camera, useCameraDevices} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

const screen = Dimensions.get('window');
const _width = screen.width;
const _height = screen.height;

const ar_sure = i18n.t('ar_sure');
const ar_cancel = i18n.t('ar_cancel');
const driving_license_camera_re_take_photo = i18n.t(
  'driving_license_camera_re_take_photo',
);
const driving_license_camera_next_step = i18n.t(
  'driving_license_camera_next_step',
);
const driving_license_camera_message_title = i18n.t(
  'driving_license_camera_message_title',
);
const driving_license_camera_message_content = i18n.t(
  'driving_license_camera_message_content',
);

const takePhotoOptions = {
  photoCodec: 'jpeg',
  qualityPrioritization: 'speed',
  quality: 20,
  skipMetadata: true,
};

const CameraScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;

  const authen = route?.params?.authen;
  const caseData = route?.params?.caseData;
  const dataConfig = route?.params?.dataConfig ?? null;
  const photoType = route?.params?.photoType ?? '';
  const onChangeData = route?.params?.onChangeData;
  const photoName = route?.params?.photoName ?? '';

  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [foucusCameraVisible, setFoucusCameraVisible] = useState({
    x: null,
    y: null,
    visible: false,
  });

  const [showFlashOptions, setShowFlashOptions] = useState(false);
  const [flashItemStatus, setFlashItemStatus] = useState('off');

  const onPressNextStep = () => {
    onChangeData(photoType, photo);
    navigation.goBack();
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
      RNFS.readFile(result?.path, 'base64').then(async res => {
        const newImage = {path: `data:image/jpeg;base64,${res}`};
        const dataCompress = await compressPhoto(newImage.path, 1920);
        const newImageComporess = {
          path: `data:image/jpeg;base64,${
            dataCompress?.path ? dataCompress?.path : res
          }`,
        };
        setPhoto(newImageComporess);
      });
    } catch (e) {
      // console.error('Failed to take photo!', e);
    }
  };

  const onPressLeftButton = () => {
    if (photo) {
      setPhoto(null);
    } else {
      navigation.goBack();
    }
  };

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
                  resolve({path: data});
                })
                .catch(error => reject({error: error}));
            },
            error => reject({error: error}),
          );
        },
        error => {
          reject({error: error});
        },
      );
    });
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
      {photo ? (
        <View
          style={{position: 'absolute', left: 0, top: 50, right: 0, bottom: 0}}>
          <Image
            style={{width: _width, height: _height}}
            source={{uri: photo?.path}}
          />
        </View>
      ) : device ? (
        <>
          <TapGestureHandler
            onHandlerStateChange={({nativeEvent}) => {
              setFoucusCameraVisible({
                x: nativeEvent.x,
                y: nativeEvent.y,
                visible: true,
              });
              cameraRef.current?.focus({x: nativeEvent.x, y: nativeEvent.y});
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
              torch={flashItemStatus}
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
                  source={require('../../assets/icons/focus.png')}
                />
              )}
            </Camera>
          </TapGestureHandler>
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              alignItems: 'center',
              width: 90,
              right: 10,
              top: _height / 2 + 40,
            }}>
            <TouchableOpacity
              style={{padding: 20}}
              onPress={handleShowFlashOptions}>
              <Image
                source={
                  flashItemStatus === 'off'
                    ? require('../../assets/icons/thunder_off.png')
                    : require('../../assets/icons/thunder.png')
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
                style={{padding: 20}}
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
                style={{padding: 20}}
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
                style={{padding: 20}}
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              top: _height / 2 - 35,
            }}
            onPress={() => onPressCapture()}>
            <Image
              style={{width: 70, height: 70}}
              source={require('../../assets/icons/ic_capture.png')}
            />
          </TouchableOpacity>
        </>
      ) : null}
      {photo ? (
        <Header
          title={photoName ? photoName : caseData?.licensePlate}
          leftButton={driving_license_camera_re_take_photo}
          onPressLeft={() => onPressLeftButton()}
          buttonRight={driving_license_camera_next_step}
          onPressRight={() => onPressNextStep()}
        />
      ) : (
        <Header
          title={photoName ? photoName : caseData?.licensePlate}
          leftButton={true}
          onPressLeft={() => onPressLeftButton()}
        />
      )}
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
