import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Header from '../../../components/Header';
import { colors } from '../../../theme';
import { routes } from '../../../navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import caseListPageStorage from '../../../api/storage/caseListPage';
import LoadingView from '../../../components/Loading';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';
const screen = Dimensions.get('window');
const _width = screen.width;
const _height = screen.height;



const DrivingLicenseDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const authen = route?.params?.authen;
  const caseData = route?.params?.caseData;
  const dataConfig = route?.params?.dataConfig ?? null;
  const photoType = route?.params?.photoType;
  const title = route?.params?.title;
  const toggleStatus = route?.params?.toggleStatus;
  const callbackDocument = route?.params?.callbackDocument;

  const caseListPage = useRef([]);

  const [isLoading, setIsLoading] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [imageSelected, setImageSelected] = useState();
  const [photos, setPhotos] = useState(caseData.drivingLicense[photoType]);
  const [isDelete, setIsDelete] = useState(false);
  // console.log('--- caseData.drivingLicense : ' + JSON.stringify(caseData.drivingLicense));

  useEffect(() => {
    const getCaseList = async () => {
      const result = await caseListPageStorage.get();
      if (result) {
        caseListPage.current = result;
        // console.log('-- getCaseList : ' + JSON.stringify(result));
      }
    };
    getCaseList();
  }, []);

  const onPressPhoto = (title, item) => {
    const itemData = {
      title: title,
      data: item,
    };
    setImageSelected(itemData);
    setModalImage(true);
  };

  const onChangeData = async (type, ptData) => {
    if (ptData) {
      // console.log('----- detail - photoType : ');
      // console.log('----- detail - ptData : ', ptData);
      let newPhotos = [...photos];
      if (_.isArray(ptData) && !_.isEmpty(ptData)) {
        newPhotos.push(...ptData);
      } else {
        newPhotos.push(ptData);
      }
      setPhotos(newPhotos);

      //console.log('---- measure detail case -- ' + JSON.stringify(caseData));
      callbackDocument(photoType, newPhotos);
    }
  };

  const onPressBack = () => {
    setModalImage(!modalImage);
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

  const pickImage = () => {
    launchImageLibrary(
      {
        selectionLimit: 0,
        mediaType: 'photo',
        presentationStyle: 'fullScreen'
      },
      response => {
        const newImageComporess = [];
        !_.isEmpty(response.assets) &&
          new Promise.all(response.assets.map(async (asset, key) => {
            await RNFS.readFile(asset.uri, 'base64').then(async res => {
              const newImage = { path: `data:image/jpeg;base64,${res}` };
              const dataCompress = await compressPhoto(newImage.path, 1920);
              newImageComporess.push({
                path: `data:image/jpeg;base64,${dataCompress?.path ? dataCompress?.path : res
                  }`,
              });
            });
          })).finally(() => {
            if (newImageComporess.length > 0) {
              onChangeData('', newImageComporess);
            }
          });
      },
    );
  };

  const onPressNewImage = () => {
    if (photos?.length < 5) {
      if (!toggleStatus) {
        pickImage();
      } else {
        navigation.navigate(routes.CAMERA_SCREEN, {
          from: 'DRIVING_LICENSE',
          caseData: caseData,
          dataConfig: dataConfig,
          authen: authen,
          photoName: title,
          onChangeData: onChangeData,
        });
      }
    }
  };

  const onPressDelete = async () => {
    let newPhotos = [...photos];
    // console.log('---- newPhotos: ' + JSON.stringify(newPhotos));
    for (let i = newPhotos.length - 1; i >= 0; i--) {
      if (newPhotos[i].checked === true) {
        newPhotos.splice(i, 1);
      }
    }
    setPhotos(newPhotos);
    checkButtonDelete(newPhotos);

    callbackDocument(photoType, newPhotos);
  };

  const onPressCheckbox = (index) => {
    let newPhotos = [...photos];
    newPhotos[index].checked = !newPhotos[index].checked;
    setPhotos(newPhotos);
    checkButtonDelete(newPhotos);
  };

  const checkButtonDelete = arrPhotos => {
    // check button delete
    let _delete = false;
    arrPhotos.forEach(element => {
      if (element.checked === true) {
        _delete = true;
      }
    });
    setIsDelete(_delete);
  };

  const renderItem = (index, item, widthBox, heightBox) => {
    const name = title + '-' + index;
    let url = require('../../../assets/icons/ic_uncheck.png');
    if (item.checked) {
      url = require('../../../assets/icons/ic_checked.png');
    }
    return (
      <View style={{ flexDirection: 'column', marginRight: 20 }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: widthBox,
            height: heightBox,
            backgroundColor: colors.gray,
            borderRadius: 8,
          }}
          onPress={() => onPressPhoto(name, item)}>
          <Image
            style={{ width: widthBox, height: heightBox, borderRadius: 8 }}
            source={{ uri: item?.path }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}>
          <Text
            style={{ flex: 1, fontSize: 20, color: colors.blackGray }}
            numberOfLines={1}>
            {name}
          </Text>
          <TouchableOpacity onPress={() => onPressCheckbox(index - 1, item)}>
            <Image style={{ width: 30, height: 30 }} source={url} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMain = () => {
    const widthBox = _width / 4 - 30;
    const heightBox = (widthBox * 2) / 3;
    const listData = photos ?? [];
    let view = [];
    for (let i = 0; i < listData.length; i++) {
      const item = listData[i];
      view.push(renderItem(i + 1, item, widthBox, heightBox));
    }
    return (
      <ScrollView>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              flexWrap: 'wrap',
            }}>
            {view}
            {listData.length < 5 && (
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: widthBox,
                    height: heightBox,
                    backgroundColor: colors.gray,
                    borderRadius: 8,
                  }}
                  onPress={() => onPressNewImage()}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require('../../../assets/icons/ic_add.png')}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{ flex: 1, fontSize: 20, color: colors.blackGray }}
                    numberOfLines={1}>
                    {title}
                    {'-'}
                    {listData.length + 1}
                  </Text>
                  <View style={{ width: 36, height: 36 }} />
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderBottom = () => {
    const bgColor = isDelete ? colors.blackGray : colors.gray;
    const disableDelete = isDelete ? false : true;
    const left = _width / 2 - 27;
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          left: left,
        }}>
        <TouchableOpacity
          disabled={disableDelete}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 55,
            height: 55,
            borderRadius: 28,
            backgroundColor: bgColor,
          }}
          onPress={() => onPressDelete()}>
          <Image
            style={{ width: 32, height: 32 }}
            source={require('../../../assets/icons/trash_icon.webp')}
          />
        </TouchableOpacity>
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
                style={{ width: _width, height: _height - 50 }}
                source={{ uri: imageSelected?.data?.path }}
                resizeMode='contain'
              />
            </View>
            <View
              style={{ position: 'absolute', top: 0, left: 0, width: _width }}>
              <Header
                leftButton={true}
                onPressLeft={() => onPressBack()}
                title={imageSelected?.title}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {photos?.length < 1 ? onPressNewImage() : null}
      <Header iconBack={true} iconHome title={title} />
      {renderMain()}
      {renderBottom()}
      {renderModalImage()}
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default DrivingLicenseDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
