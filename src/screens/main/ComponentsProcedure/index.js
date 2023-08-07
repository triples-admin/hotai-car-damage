import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import _ from 'lodash';
import React, {useState, useEffect, useRef} from 'react';
import Header from '../../../components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import Picker from '@wowmaking/react-native-ios-scroll-picker';
import Button from '../../../components/Button';
import LoadingView from '../../../components/Loading';
import TopScreen from '../../../components/TopScreen';
import {colors} from '../../../theme';
import styles from './styles';
import {icons, images} from '../../../assets';
import {routes} from '../../../navigation/routes';
import i18n from '../../../utils/i18n';
import procedureAPI from '../../../api/axios/procedure';
import caseListPageStorage from '../../../api/storage/caseListPage';

const screenSize = Dimensions.get('window');

// multi language ------------------
const ar_special_coating = i18n.t('ar_special_coating');
const ar_paint_film = i18n.t('ar_paint_film');
const ar_save = i18n.t('ar_save');
const ar_estimate = i18n.t('ar_estimate');
const ar_delete = i18n.t('ar_delete');
const ar_confirm = i18n.t('ar_confirm');
const ar_cancel = i18n.t('ar_cancel');
const ar_ok = i18n.t('ar_ok');
const ar_api_message_error = i18n.t('ar_api_message_error');

const _document = i18n.t('main_procedure_document');
const _damage_photos = i18n.t('main_procedure_damage_photos');
const _assessment = i18n.t('main_procedure_assessment');

const component_procedure_title = i18n.t('component_procedure_title');
const component_procedure_disaassemble = i18n.t(
  'component_procedure_disaassemble',
);
const component_procedure_replace = i18n.t('component_procedure_replace');
const _component_procedure_title_delete = i18n.t(
  'component_procedure_title_delete',
);
const _component_procedure_content_delete = i18n.t(
  'component_procedure_content_delete',
);
const _component_procedure_title_estimate = i18n.t(
  'component_procedure_title_estimate',
);
const _component_procedure_content_estimate = i18n.t(
  'component_procedure_content_estimate',
);
const _component_procedure_done = i18n.t('component_procedure_done');
const _component_prodedure_conetnt_empty = i18n.t(
  'component_prodedure_conetnt_empty',
);
//----------------------------------------------------

const ComponentsProcedure = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dataConfig = route?.params?.dataConfig ?? null;
  const authen = route?.params?.authen;

  const listBase = useRef([]);
  const [listData, setListData] = useState([]);
  const [dataSpecial, setDataSpecial] = useState(dataConfig[2]);
  const [dataPaint, setDataPaint] = useState(dataConfig[3]);

  const dataMappedSpecial = dataSpecial.map(item => {
    return {
      value: item.REFCD,
      label: item.REFCDNM,
    };
  });
  const dataMappedPaintFilm = dataPaint.map(item => {
    return {
      value: item.REFCD,
      label: item.REFCDNM,
    };
  });

  const [modalPicker, setModalPicker] = useState(false); // show/hide modal
  const [dataModal, setDataModal] = useState([]); // list data add to modal
  const [modalValue, setModalValue] = useState('');
  const [modalTitle, setModalTitle] = useState({key: '', value: ''}); // title modal

  let caseData = route?.params?.caseData ?? null;
  const caseListPage = useRef([]);
  const [currentCase, setCurrentCase] = useState(caseData);
  const [isLoading, setIsLoading] = useState(true);

  const bkCase = useRef(caseData);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getCaseList = async () => {
        const result = await caseListPageStorage.get();
        if (result) {
          caseListPage.current = result;
          for (let i = 0; i < result.length; i++) {
            if (caseData && caseData.id === result[i].id) {
              bkCase.current = result[i];
              setCurrentCase(result[i]);
            }
          }
        }

        // console.log('--- ComponentsProcedure bkCase ' + JSON.stringify(bkCase.current));
        // console.log('--- caseListPage ' + JSON.stringify(result));
        // console.log('--- currentCase ' + JSON.stringify(currentCase));
        // console.log('--- currentPart ' + JSON.stringify(currentPart));
      };
      getCaseList();
      reloadData();
      setCurrentCase(bkCase.current);
    });
  }, [navigation]);

  const reloadData = () => {
    // console.log('--- listContent 111 ---- ' + JSON.stringify(bkCase.current));
    if (bkCase.current?.progress >= 6) {
      // console.log('--- reload old list ')
      listBase.current = bkCase.current?.listBase
        ? JSON.parse(JSON.stringify(bkCase.current.listBase))
        : [];
      let listContent = bkCase.current?.componentsProcedure
        ? [...bkCase.current.componentsProcedure]
        : [];
      listContent.forEach(element1 => {
        element1._item.forEach(element2 => {
          listBase.current.forEach(element3 => {
            if (
              element2?.PARTNO === element3?.PARTNO &&
              element2?.REGION === element3?.REGION
            ) {
              element2.O_OPNO = element3.O_OPNO;
              element2.X_OPNO = element3.X_OPNO;
            }
          });
        });
      });

      setListData(listContent);
      setIsLoading(false);

      // console.log('--- listBase.current ---- ' + JSON.stringify(listBase.current));
      // console.log('--- listContent ---- ' + JSON.stringify(listContent));
    } else {
      // console.log('--- load from api ')
      getComponentProcedure();
    }
  };

  const getComponentProcedure = async () => {
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      USERID: authen?.USERID,
      LICSNO: currentCase?.licensePlate,
    };
    // console.log('------ getComponentProcedure Request: ' + JSON.stringify(_body));
    const result = await procedureAPI.getDataComponentProcedure(_body, _config);
    if (result && result.status === 200 && result?.data?.length > 0) {
      const resData = result?.data[0];
      if (_.isEmpty(resData)) {
        Alert.alert('', _component_prodedure_conetnt_empty, [
          {
            text: ar_ok,
            onPress: () => {
              console.log('OK Pressed');
            },
          },
        ]);
      }
      listBase.current = JSON.parse(JSON.stringify(resData));
      createContentProcedure(resData);
    } else {
      apiCallFailed();
    }
    setIsLoading(false);
    // console.log('------ getComponentProcedure : ' + JSON.stringify(result));
  };

  const createContentProcedure = arrData => {
    let listContent = [];
    let service = arrData ?? [];
    let count = 1;

    // group data
    let group = service.reduce((r, a) => {
      r[a.REGIONM] = [...(r[a.REGIONM] || []), a];
      return r;
    }, {});

    // create data for list
    for (const [key, value] of Object.entries(group)) {
      let item = {
        id: count,
        title: key,
        _item: value,
      };
      listContent.push(item);
      count++;
    }
    // console.log('--- list content: ' + JSON.stringify(listContent));
    setListData(listContent);
  };

  const RenderComponents = ({item}) => {
    const itemm = item.item;
    const [isExpand, setExpand] = useState(true);

    const ItemBodyComponents = ({item}) => {
      const itemChild = item.item;

      const disDefault = itemChild?.disassemble;
      const repDefault = itemChild?.replace;
      const [disassemble, setDisassemble] = useState(disDefault);
      const [replace, setReplace] = useState(repDefault);

      const onPressDisassemble = () => {
        const newValue = !disassemble;
        setDisassemble(newValue);
        if (newValue === true) {
          setReplace(false);
        }

        listData.forEach(temp1 => {
          temp1?._item.forEach(temp2 => {
            if (
              temp2?.PARTNO === itemChild?.PARTNO &&
              temp2?.REGION === itemChild?.REGION
            ) {
              temp2.disassemble = newValue;
              if (newValue === true) {
                temp2.replace = false;
              }
            }
          });
        });

        autoSave();
      };

      const onPressReplace = () => {
        const newValue = !replace;
        setReplace(newValue);
        if (newValue === true) {
          setDisassemble(false);
        }

        listData.forEach(temp1 => {
          temp1?._item.forEach(temp2 => {
            if (
              temp2?.PARTNO === itemChild?.PARTNO &&
              temp2?.REGION === itemChild?.REGION
            ) {
              temp2.replace = newValue;
              if (newValue === true) {
                temp2.disassemble = false;
              }
            }
          });
        });

        autoSave();
      };

      return (
        <View key={itemChild?._id}>
          <View style={styles.viewItemBodyComponents}>
            <View style={{flex: 5}}>
              <Text style={styles.textItemBodyComponents}>{itemChild?.NM}</Text>
            </View>
            <View style={{flex: 3}}>
              <View style={styles.viewCheckBoxItem}>
                {itemChild?.O_OPNO ? (
                  <TouchableOpacity
                    onPress={() => onPressDisassemble()}
                    style={[
                      styles.viewCheckBoxFormItem,
                      {
                        backgroundColor: !disassemble
                          ? colors.white
                          : colors.primary,
                        borderColor: !disassemble
                          ? colors.borderBackground
                          : colors.primary,
                      },
                    ]}>
                    {disassemble && (
                      <View style={styles.viewImageSelectItem}>
                        <Image
                          resizeMode="contain"
                          source={icons.tick_icon}
                          style={styles.imageSelectItem}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      styles.viewCheckBoxFormItem,
                      {
                        backgroundColor: colors.white,
                        borderColor: colors.whiteGray,
                      },
                    ]}></View>
                )}
              </View>
            </View>
            <View style={{flex: 2}}>
              <TouchableOpacity
                onPress={() => onPressReplace()}
                style={[
                  styles.viewCheckBoxFormItem,
                  {
                    backgroundColor: !replace ? colors.white : colors.primary,
                    borderColor: !replace
                      ? colors.borderBackground
                      : colors.primary,
                  },
                ]}>
                {replace && (
                  <View style={styles.viewImageSelectItem}>
                    <Image
                      resizeMode="contain"
                      source={icons.tick_icon}
                      style={styles.imageSelectItem}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View>
        <View style={{marginTop: 8}}>
          <View style={styles.viewItemHeaderComponents}>
            <View style={{flex: 5}}>
              <Text style={styles.textItemHeaderComponents}>{itemm.title}</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.textItemHeaderComponents}>
                {component_procedure_disaassemble}
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text style={styles.textItemHeaderComponents}>
                {component_procedure_replace}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setExpand(!isExpand)}
              style={{flex: 0.5, alignItems: 'flex-end'}}>
              <Image
                source={isExpand ? icons.minus_icon : icons.expand_icon}
                style={{height: 24, width: 24}}
              />
            </TouchableOpacity>
          </View>
        </View>
        {isExpand && (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            data={itemm._item}
            renderItem={item => <ItemBodyComponents item={item} />}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    );
  };

  const saveToStorage = async () => {
    // console.log('--- save listData : ' + JSON.stringify(listData));
    let caseUpdate = currentCase;
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === currentCase?.id) {
        element.specialCoating = currentCase.specialCoating;
        element.paintFilm = currentCase.paintFilm;
        element.progress = element.progress == 7 ? 7 : 6;
        element.componentsProcedure = listData;
        element.listBase = listBase.current;
        // console.log('--- element : ' + JSON.stringify(element));
        caseUpdate = element;
        bkCase.current = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    return caseUpdate;
  };

  const autoSave = async () => {
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === currentCase?.id) {
        element.progress = element.progress == 7 ? 7 : 6;
        element.componentsProcedure = listData;
        element.listBase = listBase.current;
      }
    });
    await caseListPageStorage.set(newList);
  };

  const createDataForSub = () => {
    let arrBase = listBase.current;
    let arrData = [];
    listData.forEach(element => {
      arrData = arrData.concat(element._item);
    });
    for (let i = 0; i < arrData.length; i++) {
      // user check
      if ('disassemble' in arrData[i]) {
        // O_OPNO
        if (arrData[i].disassemble) {
          let oValue = '';
          arrBase.forEach(element => {
            if (
              element?.PARTNO === arrData[i]?.PARTNO &&
              element?.REGION === arrData[i]?.REGION
            ) {
              oValue = element?.O_OPNO;
            }
          });
          arrData[i].O_OPNO = oValue;
          arrData[i].X_OPNO = ''; // replace = false
        } else {
          // check false
          arrData[i].O_OPNO = '';
        }
      } else {
        // user no check
        arrData[i].O_OPNO = '';
      }
      // user check
      if ('replace' in arrData[i]) {
        // X_OPNO
        if (arrData[i].replace) {
          let xValue = '';
          arrBase.forEach(element => {
            if (
              element?.PARTNO === arrData[i]?.PARTNO &&
              element?.REGION === arrData[i]?.REGION
            ) {
              xValue = element?.X_OPNO;
            }
          });
          arrData[i].X_OPNO = xValue;
          arrData[i].O_OPNO = ''; // disassemble = false
        } else {
          // check false
          arrData[i].X_OPNO = '';
        }
      } else {
        // user no check
        arrData[i].X_OPNO = '';
      }
    }
    // console.log('---- createDataForSub : ' + JSON.stringify(arrData));
    return arrData;
  };

  const onPressNext = async () => {
    // console.log('--- currentCase ' + JSON.stringify(currentCase));
    // console.log('--- bkCase ' + JSON.stringify(bkCase));
    // save to server
    setIsLoading(true);
    const _info = dataConfig[0];
    const _info2 = dataConfig[11];
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    let backupPhotos = [];
    let dataMain = currentCase?.damagedPart
      ? JSON.parse(JSON.stringify(currentCase.damagedPart))
      : [];
    const requestMain = [];
    dataMain.forEach(element => {
      element.AREA = element?.area?.value ?? '';
      element.DEGREE = element?.level?.value ?? '';
      element.TASK = element?.painting?.value ?? '';
      backupPhotos.push([...element.PHOTOS]);
      element.PHOTOS = [];
      let requestData = {
        PNC: element.PNC,
        REGION: element.REGION,
        WAY: element.WAY,
        AREA: element.AREA,
        DEGREE: element.DEGREE,
        TASK: element.TASK,
      };
      requestMain.push(requestData);
    });

    const subData = createDataForSub();
    const requestSub = [];
    subData.forEach(element => {
      if(element.X_OPNO == "" && element.O_OPNO == "" && element.P_OPNO == ""){
        //Don't run any
      } else {
        let requestData = {
          PNC: element.PNC,
          REGION: element.REGION,
          PROCD: element.PROCD,
          PARTNO: element.PARTNO,
          QTY: element.QTY,
          X_OPNO: element.X_OPNO,
          O_OPNO: element.O_OPNO,
          P_OPNO: element.P_OPNO,
        };
        requestSub.push(requestData);
      }
    });

    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      USERID: authen?.USERID,
      LICSNO: currentCase?.licensePlate,
      CARNM: _info[0].CARNM, // Q01 Input01
      VDS: _info[0].VDS, // Q01 Input01
      WMI: _info[0].WMI, // Q01 Input01
      CARSFX: _info[0].CARSFX, // Q01 Input01
      PRODDT: _info[0].PRODDT,
      YYMDL: _info[0].YYMDL,
      SPEC: currentCase?.specialCoating?.value,
      SMEAR: currentCase?.paintFilm?.value,
      PAINT: _info[0].PAINT, // Q01 Input01
      COLOR: _info[0].COLOR, // Q01 Input01
      WAGERT_C: _info2[0].WAGERT_C, // Q01 Input011
      WAGERT_A: _info2[0].WAGERT_A, // Q01 Input011
      ATXWAGE_C: _info2[0].ATXWAGE_C, // Q01 Input011
      ATXWAGE_A: _info2[0].ATXWAGE_A, // Q01 Input011
      MAIN: requestMain,
      SUB: requestSub,
    };
    const result = await procedureAPI.maintenanceContentStorage(_body, _config);
    // console.log('--- upload maintain - body: ' + JSON.stringify(_body));
    // console.log('--- upload maintain - result : ' + JSON.stringify(result));
    for (let i = 0; i < dataMain.length; i++) {
      dataMain[i].PHOTOS = backupPhotos[i];
    }
    setIsLoading(false);
    if (result && result.status === 200) {
      gotoNextPage();
    } else {
      // alert error
    }
  };

  const gotoNextPage = async () => {
    // next page
    const caseUpdate = await saveToStorage();
    navigation.navigate(routes.ASSESSMENTPROCEDURESCREEN, {
      caseData: caseUpdate,
      dataConfig: dataConfig,
      authen: authen,
      fromHome: false,
    });
    // console.log('--- listContent 222 ---- ' + JSON.stringify(caseUpdate));
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

  const handelPickerChange = value => {
    setModalValue(value);
  };

  const onPressSpecialCoating = name => {
    setDataModal(dataMappedSpecial);
    setModalValue(dataMappedSpecial[0]?.value);
    setModalTitle({key: 'SpecialCoating', value: name});
    setModalPicker(true);
  };

  const onPressPaintFilm = name => {
    setDataModal(dataMappedPaintFilm);
    setModalValue(dataMappedPaintFilm[0]?.value);
    setModalTitle({key: 'PaintFilm', value: name});
    setModalPicker(true);
  };

  const onPressModalDone = () => {
    setModalPicker(false);

    if (modalTitle?.key === 'SpecialCoating') {
      let result = '';
      dataMappedSpecial.forEach(element => {
        if (element.value === modalValue) {
          result = element;
        }
      });
      if (result) {
        currentCase.specialCoating = result;
        setCurrentCase(currentCase);
        // console.log('----- specialCoating Selected ' + JSON.stringify(result));
      }
    } else if (modalTitle?.key === 'PaintFilm') {
      let result = '';
      dataMappedPaintFilm.forEach(element => {
        if (element.value === modalValue) {
          result = element;
        }
      });
      if (result) {
        currentCase.paintFilm = result;
        setCurrentCase(currentCase);
        // console.log('----- paintFilm Selected ' + JSON.stringify(result));
      }
    }
  };

  const renderModalPicker = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPicker}
        onRequestClose={() => {}}>
        <SafeAreaView style={styles.safeView}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1}}></View>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: colors.white,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -5,
                },
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <TouchableOpacity onPress={() => setModalPicker(false)}>
                  <Text style={{fontSize: 18, color: colors.royalBlue}}>
                    {ar_cancel}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.black,
                    }}>
                    {modalTitle?.value}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => onPressModalDone()}>
                  <Text style={{fontSize: 18, color: colors.royalBlue}}>
                    {_component_procedure_done}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Picker
                  values={dataModal}
                  containerWidth={screenSize.width}
                  defaultValue={modalValue}
                  withTranslateZ={true}
                  withOpacity={true}
                  withScale={true}
                  visibleItems={5}
                  itemHeight={32}
                  deviderStyle={{
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  }}
                  labelStyle={{color: '#000000', fontSize: 24}}
                  onChange={handelPickerChange}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const sendDeleteServer = async newCase => {
    // delete server
    setIsLoading(true);
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      USERID: authen?.USERID,
      LICSNO: newCase?.licensePlate,
      STEP: 1,
    };
    const result = await procedureAPI.deleteCase(_body, _config);
    setIsLoading(false);
    if (result && result.status === 200) {
      navigation.navigate(routes.MAINPROCEDURESCREEN, {
        caseData: newCase,
        dataConfig: dataConfig,
        authen: authen,
      });
    } else {
      apiCallFailed();
    }
    // console.log('--- sendDeleteServer body : ' + JSON.stringify(_body));
    // console.log('--- sendDeleteServer result : ' + JSON.stringify(result));
  };

  const onPressGoHome = async () => {
    await saveToStorage();
    navigation.reset({
      routes: [{name: routes.HOMESCREEN}],
    });
  };

  const onPressGoBack = async () => {
    const newCase = await saveToStorage();
    await sendDeleteServer(newCase);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        iconBack
        onPressBack={() => onPressGoBack()}
        iconHome
        onPressHome={() => onPressGoHome()}
        title={currentCase?.licensePlate?.toLocaleUpperCase()}
      />
      <View style={styles.viewBody}>
        {/* <TopScreen disableDocument={true} disablePhotos={true} /> */}
        {/* <View style={styles.viewButtonDropDown}>
          <View style={{ width: '45%' }}>
            <Text style={styles.textTitle}>{ar_special_coating}</Text>
            <TouchableOpacity
              style={styles.buttonDropDown}
              onPress={() => onPressSpecialCoating(ar_special_coating)}>
              <Text style={styles.textDropDown} numberOfLines={1}>
                {currentCase?.specialCoating?.label ?? '---'}
              </Text>
              <Image
                resizeMode="contain"
                source={icons.drop_down_icon}
                style={{ height: 12, width: 12 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: '45%' }}>
            <Text style={styles.textTitle}>
              {ar_paint_film}
              <Text style={{ color: colors.backgroundLogin }}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.buttonDropDown}
              onPress={() => onPressPaintFilm(ar_paint_film)}>
              <Text style={styles.textDropDown} numberOfLines={1}>
                {currentCase?.paintFilm?.label}
              </Text>
              <Image
                resizeMode="contain"
                source={icons.drop_down_icon}
                style={{ height: 12, width: 12 }}
              />
            </TouchableOpacity>
          </View>
        </View> */}
        <View style={{flex: 1, marginTop: 12}}>
          <Text style={styles.textComponents}>{component_procedure_title}</Text>
          <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={listData}
            renderItem={item => <RenderComponents item={item} />}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.viewButtonFooter}>
          {/* <TouchableOpacity
            onPress={DeleteButtonAlert}
            style={styles.buttonDelete}>
            <Image
              resizeMode="contain"
              source={icons.trash_icon}
              style={styles.imageDeleteButton}
            />
          </TouchableOpacity> */}
          {/* <Button
            title={ar_save}
            style={{ backgroundColor: colors.primary, minWidth: 180 }}
            onPress={() => onPressSave()}
          /> */}
          <Button
            onPress={() => onPressNext()}
            title={ar_estimate}
            style={{backgroundColor: colors.primary, minWidth: 180}}
          />
        </View>
        {renderModalPicker()}
      </View>
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default ComponentsProcedure;
