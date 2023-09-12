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
import React, {useState, useRef, useEffect} from 'react';
import Header from '../../../components/Header';
import {colors} from '../../../theme';
import {routes} from '../../../navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import caseListPageStorage from '../../../api/storage/caseListPage';
import i18n from '../../../utils/i18n';
import LoadingView from '../../../components/Loading';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';

const screen = Dimensions.get('window');
const _width = screen.width;
const _height = screen.height;

const measure_area_detail_take_photos = i18n.t(
  'measure_area_detail_take_photos',
);

const MeasureAreaDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const authen = route?.params?.authen;
  const caseData = route?.params?.caseData;
  const dataConfig = route?.params?.dataConfig ?? null;
  const dataDetail = route?.params?.dataDetail;
  const callbackMeasureArea = route?.params?.callbackMeasureArea;
  const toggleStatus = route?.params?.toggleStatus;

  const caseListPage = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [area, setArea] = useState(dataDetail);
  const [modalImage, setModalImage] = useState(false);
  const [imageSelected, setImageSelected] = useState();

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

  const onChangeData = (id, ptData) => {
    if (id && ptData) {
      // console.log('----- area detail - photoType : ' + id);
      let newPhotos = [...area?.PHOTOS];
      if (_.isArray(ptData) && !_.isEmpty(ptData)) {
        newPhotos.push(...ptData);
      } else {
        newPhotos.push(ptData);
      }
      
      setArea(prevState => ({
        ...prevState,
        PHOTOS: newPhotos,
      }));
      // console.log('---- measure detail case -- ' + JSON.stringify(caseData));
      area.PHOTOS = newPhotos;
      callbackMeasureArea(area);
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

  const pickImage = id => {
    launchImageLibrary(
      {
        selectionLimit: 0,
        mediaType: 'photo',
        presentationStyle: 'fullScreen',
      },
      response => {
        const newImageComporess = [];
        !_.isEmpty(response.assets) &&
        new Promise.all(response.assets.map(async(asset, key) => {
          await RNFS.readFile(asset.uri, 'base64').then(async res => {
            const newImage = {path: `data:image/jpeg;base64,${res}`};
            const dataCompress = await compressPhoto(newImage.path, 1920);
            newImageComporess.push({
              path: `data:image/jpeg;base64,${
                dataCompress?.path ? dataCompress?.path : res
              }`,
            });
          })
        })).finally(() => {
          if(newImageComporess.length > 0){
            onChangeData(id, newImageComporess);
          }
        });
      },
    );
  };

  const onPressNewImage = () => {
    if (!toggleStatus) {
      pickImage(dataDetail?.id);
    } else {
      navigation.navigate(routes.CAMERA_SCREEN, {
        from: 'AREA_DETAIL',
        caseData: caseData,
        dataConfig: dataConfig,
        authen: authen,
        photoType: dataDetail?.id,
        photoName: dataDetail?.REGIONM,
        onChangeData: onChangeData,
      });
    }
  };

  const onPressDelete = () => {
    let newPhotos = [...area.PHOTOS] ?? [];
    for (let i = newPhotos.length - 1; i >= 0; i--) {
      if (newPhotos[i]?.checked === true) {
        newPhotos.splice(i, 1);
      }
    }
    setArea(prevState => ({
      ...prevState,
      PHOTOS: newPhotos,
    }));
    area.PHOTOS = newPhotos;
    callbackMeasureArea(area);
  };

  const onPressCheckbox = index => {
    let newPhotos = area?.PHOTOS ?? [];
    newPhotos[index].checked = !newPhotos[index].checked;
    setArea(prevState => ({
      ...prevState,
      PHOTOS: newPhotos,
    }));
  };

  const renderItem = (index, item, widthBox, heightBox) => {
    const name = area?.REGIONM + '-' + index;
    let url = require('../../../assets/icons/ic_uncheck.png');
    if (item.checked) {
      url = require('../../../assets/icons/ic_checked.png');
    }
    return (
      <View style={{flexDirection: 'column', marginRight: 20}}>
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
            style={{width: widthBox, height: heightBox, borderRadius: 8}}
            source={{uri: item?.path}}
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
            style={{flex: 1, fontSize: 20, color: colors.blackGray}}
            numberOfLines={1}>
            {name}
          </Text>
          <TouchableOpacity onPress={() => onPressCheckbox(index - 1, item)}>
            <Image style={{width: 30, height: 30}} source={url} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMain = () => {
    const listData = area?.PHOTOS ?? [];
    let view = [];
    const widthBox = _width / 4 - 30;
    const heightBox = (widthBox * 2) / 3;
    for (let i = 0; i < listData.length; i++) {
      const item = listData[i];
      view.push(renderItem(i + 1, item, widthBox, heightBox));
    }
    return (
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              flexWrap: 'wrap',
            }}>
            {view}
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
                  style={{width: 50, height: 50}}
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
                  style={{flex: 1, fontSize: 20, color: colors.blackGray}}
                  numberOfLines={1}>
                  {area?.REGIONM + '-' + (listData.length + 1)}
                </Text>
                <View style={{width: 30, height: 30}} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderBottom = () => {
    const left = _width / 2 - 27;
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          left: left,
        }}>      
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 55,
            height: 55,
            borderRadius: 28,
            backgroundColor: colors.blackGray,
          }}
          onPress={() => onPressDelete()}>
          <Image
            style={{width: 32, height: 32}}
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
            <View style={{position: 'absolute', top: 30, left: 0}}>
              <Image
                style={{
                  flex: 1,
                  width: _width,
                  height: _height - 50,
                  resizeMode: 'contain',
                }}
                source={{uri: imageSelected?.data?.path}}
              />
            </View>
            <View
              style={{position: 'absolute', top: 0, left: 0, width: _width}}>
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
      <Header iconBack={true} iconHome title={area?.REGIONM} />
      {renderMain()}
      {renderBottom()}
      {renderModalImage()}
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default MeasureAreaDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
