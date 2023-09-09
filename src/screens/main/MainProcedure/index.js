import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Picker from '@wowmaking/react-native-ios-scroll-picker';
import styles from './styles';
import Header from '../../../components/Header';
import { ThemeProvider, useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../../components/Button';
import { colors } from '../../../theme';
import 'react-native-gesture-handler';
import { routes } from '../../../navigation/routes';
import i18n from '../../../utils/i18n';
import caseListPageStorage from '../../../api/storage/caseListPage';
import procedureAPI from '../../../api/axios/procedure';
import LoadingView from '../../../components/Loading';
import TopScreen from '../../../components/TopScreen';
import AlertRowModal from '../../../components/AlertRowModal';

const screenSize = Dimensions.get('window');

// multi language ------------------
const ar_special_coating = i18n.t('ar_special_coating');
const ar_paint_film = i18n.t('ar_paint_film');
const ar_save = i18n.t('ar_save');
const ar_next = i18n.t('ar_next');
const ar_delete = i18n.t('ar_delete');
const ar_cancel = i18n.t('ar_cancel');
const ar_ok = i18n.t('ar_ok');
const ar_api_message_error = i18n.t('ar_api_message_error');

const main_procedure_title = i18n.t('main_procedure_title');
const main_procedure_part = i18n.t('main_procedure_part');
const main_procedure_method = i18n.t('main_procedure_method');
const main_procedure_area = i18n.t('main_procedure_area');
const main_procedure_level = i18n.t('main_procedure_level');
const main_procedure_painting = i18n.t('main_procedure_painting');
const _main_procedure_title_delete = i18n.t('main_procedure_title_delete');
const _main_procedure_content_delete = i18n.t('main_procedure_content_delete');
const _main_procedure_done = i18n.t('main_procedure_done');
//------------------------

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

const MainProcedure = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const authen = route?.params?.authen;
  const dataConfig = route?.params?.dataConfig ?? null;
  const onlyFullBodyPaint = route?.params?.onlyFullBodyPaint ?? false;

  const [dataSpecial, setDataSpecial] = useState(dataConfig[2]);
  const [dataPaint, setDataPaint] = useState(dataConfig[3]);
  const [dataMethod, setDataMethod] = useState(DATAMethod);
  const [dataArea, setDataArea] = useState(dataConfig[4]);
  const [dataLevel, setDataLevel] = useState(dataConfig[5]);

  const [dataPaintingAllReplace, setDataPaintingAllReplace] = useState(
    dataConfig[6],
  ); // All replace (no bumper)
  const [dataPaintingAllFix, setDataPaintingAllFix] = useState(dataConfig[7]); // All fixing (no bumper)
  const [dataPaintingBumper, setDataPaintingBumper] = useState(dataConfig[9]); // front/rear bumper - fix/replace

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
  const dataMappedMethod = dataMethod.map(item => {
    return {
      value: item.REFCD,
      label: item.REFCDNM,
    };
  });
  const dataMappedArea = dataArea
    .filter(area => area?.REFCDNM !== '0')
    .map(item => {
      return {
        value: item.REFCD,
        label: item.REFCDNM,
      };
    });
  const dataMappedLevel = dataLevel.map(item => {
    return {
      value: item.REFCD,
      label: item.REFCDNM,
    };
  });

  const dataMappedPaintingAllFix = dataPaintingAllFix.map(item => {
    return {
      value: item.REFCD,
      label: item.REFCDNM,
    };
  });
  const dataMappedPaintingAllReplace = dataPaintingAllReplace.map(item => {
    return {
      value: item.REFCD,
      label: item.REFCDNM,
    };
  });
  const dataMappedPaintingBumperFix = dataPaintingBumper
    .filter(painting => painting?.REFCD?.trim() !== 'X')
    .map(item => {
      return {
        value: item.REFCD,
        label: item.REFCDNM,
      };
    });
  const dataMappedPaintingBumperReplace = dataPaintingBumper
    .filter(painting => painting?.REFCD?.trim() === 'X')
    .map(item => {
      return {
        value: item.REFCD,
        label: item.REFCDNM,
      };
    });

  const [itemSelected, setItemSelected] = useState(null);

  const [modalPicker, setModalPicker] = useState(false); // show/hide modal
  const [dataModal, setDataModal] = useState([]); // list data add to modal
  const [modalValue, setModalValue] = useState('');
  const [modalTitle, setModalTitle] = useState({ key: '', value: '' }); // title modal
  const [isLoading, setIsLoading] = useState(false);
  const [isFullBodyPaint, setFullBodyPaint] = useState(false);

  let caseData = route?.params?.caseData ?? null;
  const caseListPage = useRef([]);
  const [currentCase, setCurrentCase] = useState({});
  const [currentPart, setCurrentPart] = useState([]);
  const [isShowAlert, setIsShowAlert] = useState(false);

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
        // console.log('--- caseListPage ' + JSON.stringify(result));
        // console.log('--- MainProcedure bkCase ' + JSON.stringify(bkCase.current));
        // console.log('--- currentPart ' + JSON.stringify(currentPart));

        loadDataDefault();
      };
      getCaseList();
    });
  }, [navigation]);

  const loadDataDefault = () => {
    const _info = dataConfig[0];
    const filterPainting = ['U1', 'U2'];
    const arrPainting = [];
    let caseTemp = bkCase.current;
    // console.log('----- dataMappedSpecial: ' + JSON.stringify(dataMappedSpecial));
    // console.log('----- dataMappedPaintFilm: ' + JSON.stringify(dataMappedPaintFilm));
    if (!caseTemp?.specialCoating?.value) {
      let specData = null;
      const spec = _info[0].SPEC.trim();
      // console.log('----- spec: ' + spec);
      dataMappedSpecial.forEach(element => {
        if (element.value.trim() === spec) {
          specData = element;
        }
      });
      // console.log('----- specData: ' + JSON.stringify(specData));
      caseTemp.specialCoating = specData ?? dataMappedSpecial[0];
    }
    if (!caseTemp?.paintFilm?.value) {
      let filmData = null;
      const smear = _info[0].SMEAR.trim();
      // console.log('----- smear: ' + smear);
      dataMappedPaintFilm.forEach(element => {
        if (element.value.trim() === smear) {
          filmData = element;
        }
      });
      // console.log('----- filmData: ' + JSON.stringify(filmData));
      caseTemp.paintFilm = filmData ?? dataMappedPaintFilm[0];
    }

    let partTemp = bkCase.current?.damagedPart ?? [];
    partTemp.forEach(element => {
      if (element.id !== 13) {
        if (element?.level?.value === 'UPS') {
          element.ups = true;
          element.upsValue = element?.area?.value
        }
        if (!element?.method?.value) {
          element.method = dataMappedMethod[0];
        }
        if (!element?.area?.value) {
          if (element?.level?.value === 'UPS') {
            element.area = { label: '', value: '' };
          } else {
            element.area = dataMappedArea[0];
          }
        } else {
          if (element?.level?.value === 'UPS') {
            element.area = { label: '', value: '' };
          } else {
            element.area = updateAreaValue(element.area);
          }
        }
        if (!element?.level?.value) {
          element.level = dataMappedLevel[0];
        } else {
          if (element?.level?.value === 'UPS') {
            element.level = { label: '', value: '' };
          }
        }
        if (!element?.painting?.value) {
          if (bkCase.current.selectedBodyPaint) {
            element.painting = { label: '', value: '' };
          } else {
            if (checkBumper(element?.REGION) === true) {
              // (bumper) 後保險桿/前保險桿
              if (element?.method?.value === '1') {
                // fix
                if (element.ups) {
                  for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
                    let tempValue = dataMappedPaintingAllFix[i];
                    if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) != 'undefined') {
                      arrPainting.push(tempValue);
                    }
                  }
                  if (parseInt(element.upsValue) >= 2) {
                    element.painting = arrPainting[1];
                  } else {
                    element.painting = arrPainting[0];
                  }
                  // arrPainting = dataMappedPaintingAllFix.splice(2, 4);
                } else {
                  element.painting = dataMappedPaintingBumperFix[0];
                }
              } else {
                // replace
                element.painting = dataMappedPaintingBumperReplace[0];
              }
            } else {
              // all case (no bumper)
              if (element?.method?.value === '1') {
                // fix
                if (element.ups) {
                  for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
                    let tempValue = dataMappedPaintingAllFix[i];
                    if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) != 'undefined') {
                      arrPainting.push(tempValue);
                    }
                  }
                  if (parseInt(element.upsValue) >= 2) {
                    element.painting = arrPainting[1];
                  } else {
                    element.painting = arrPainting[0];
                  }
                  // arrPainting = dataMappedPaintingAllFix.splice(2, 4);
                } else {
                  element.painting = dataMappedPaintingAllFix[0];
                }
              } else {
                // replace
                element.painting = dataMappedPaintingAllReplace[0];
              }
            }
          }
        }
        if (checkBumper(element?.REGION) === true && bkCase.current.selectedBodyPaint) {
          element.method = dataMappedMethod[1];
          element.area = { label: '', value: '' };
          element.level = { label: '', value: '' };
          element.painting = { label: '', value: '' };
        }
      } else {
        setFullBodyPaint(true);
        if (!element?.method?.value) {
          element.method = dataMappedMethod[0];
        }
        element.area = { label: '', value: '' };
        element.level = { label: '', value: '' };
        element.painting = { label: '', value: '' };
      }
    });

    // console.log('---- caseTemp: ' + JSON.stringify(caseTemp));
    // console.log('---- partTemp: ' + JSON.stringify(partTemp));
    setCurrentCase(caseTemp);
    setCurrentPart(partTemp);
  };

  const onPressSpecialCoating = name => {
    setDataModal(dataMappedSpecial);
    setModalValue(dataMappedSpecial[0]?.value);
    setModalTitle({ key: 'SpecialCoating', value: name });
    setModalPicker(true);
  };

  const onPressPaintFilm = name => {
    setDataModal(dataMappedPaintFilm);
    setModalValue(dataMappedPaintFilm[0]?.value);
    setModalTitle({ key: 'PaintFilm', value: name });
    setModalPicker(true);
  };

  const onPressMethod = item => {
    var dataMappedMethodT = dataMappedMethod
    const isBumper = checkBumper(item?.REGION);
    if (isBumper && isFullBodyPaint) {
      dataMappedMethodT = [dataMappedMethod[1]]
    }
    setDataModal(dataMappedMethodT);
    setModalValue(dataMappedMethodT[0]?.value);
    setModalTitle({ key: 'Method', value: '方式' });
    setModalPicker(true);
    setItemSelected(item);
  };

  const onPressArea = item => {
    setDataModal(dataMappedArea);
    setModalValue(dataMappedArea[0]?.value);
    setModalTitle({ key: 'Area', value: '面積' });
    setModalPicker(true);
    setItemSelected(item);
  };

  const onPressLevel = item => {
    setDataModal(dataMappedLevel);
    setModalValue(dataMappedLevel[0]?.value);
    setModalTitle({ key: 'Level', value: '級數' });
    setModalPicker(true);
    setItemSelected(item);
  };

  const onPressPainting = item => {
    let arrPainting = [];
    const levelCheck = ['A', 'B', 'C'];
    const filterPainting = ['U1', 'U2'];
    if (checkBumper(item?.REGION) === true) {
      // (bumper) 後保險桿/前保險桿
      if (item?.method?.value === '1') {
        // fix
        if (item.ups) {
          for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
            let tempValue = dataMappedPaintingAllFix[i];
            if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) != 'undefined') {
              arrPainting.push(tempValue);
            }
          }
          // arrPainting = dataMappedPaintingAllFix.splice(2, 4);
        } else {
          arrPainting = dataMappedPaintingBumperFix;
        }
      } else {
        // replace
        arrPainting = dataMappedPaintingBumperReplace;
      }
    } else {
      // all case (no bumper)
      if (item?.method?.value === '1') {
        // fix
        if (item.ups) {
          for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
            let tempValue = dataMappedPaintingAllFix[i];
            if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) != 'undefined') {
              arrPainting.push(tempValue);
            }
          }
          // arrPainting = dataMappedPaintingAllFix.splice(2, 4);
        } else {
          if (typeof levelCheck.find(element => element == item?.level?.value.trim().toUpperCase()) != 'undefined') {
            for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
              let tempValue = dataMappedPaintingAllFix[i];
              if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) == 'undefined') {
                arrPainting.push(tempValue);
              }
            }
          } else {
            arrPainting = dataMappedPaintingAllFix;
          }
        }
      } else {
        // replace
        arrPainting = dataMappedPaintingAllReplace;
      }
    }
    setDataModal(arrPainting);
    setModalValue(arrPainting[0]?.value);
    setModalTitle({ key: 'Painting', value: '噴漆' });
    setModalPicker(true);
    setItemSelected(item);
  };

  const checkBumper = value => {
    // console.log('--------- checkBumper: ' + value);
    const region = value.trim();
    if (region === '14' || region === '17') {
      return true;
    } else {
      return false;
    }
  };

  const onPressModalDone = () => {
    const levelCheck = ['A', 'B', 'C'];
    const filterPainting = ['U1', 'U2'];
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
        autoSave(currentCase.damagedPart, result, currentCase.paintFilm);
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
        autoSave(currentCase.damagedPart, currentCase.specialCoating, result);
        // console.log('----- paintFilm Selected ' + JSON.stringify(result));
      }
    } else if (modalTitle?.key === 'Method') {
      currentPart.forEach(element => {
        if (element.REGION === itemSelected.REGION) {
          dataMappedMethod.forEach(itemData => {
            if (itemData.value === modalValue) {
              element.method = itemData;
            }
          });
          if (element.id != 13) {
            if (element.ups !== true) {
              if (modalValue === '2') {
                // replace
                // method === change
                //----- reset area, level ----

                if (element?.area) {
                  delete element.area;
                }
                if (element?.level) {
                  delete element.level;
                }
                // --- bumper/all -----------------
                if (isFullBodyPaint) {
                  element.painting = { label: '', value: '' };
                } else {
                  if (checkBumper(element?.REGION) === true) {
                    element.painting = dataMappedPaintingBumperReplace[0];
                  } else {
                    element.painting = dataMappedPaintingAllReplace[0];
                  }
                }
              } else {
                // fix
                //---------------------------------------
                if (checkBumper(element?.REGION) === true) {
                  // console.log('--------- element 1 : ');
                  if (isFullBodyPaint) {
                    element.painting = { label: '', value: '' };
                  } else {
                    element.painting = dataMappedPaintingBumperFix[0];
                  }
                  if (element?.area) {
                    delete element.area;
                  }
                  if (element?.level) {
                    delete element.level;
                  }
                } else {
                  if (isFullBodyPaint) {
                    element.painting = { label: '', value: '' };
                  } else {
                    if (typeof levelCheck.find(element => element == dataMappedLevel[0].value.trim().toUpperCase()) != 'undefined') {
                      for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
                        let tempValue = dataMappedPaintingAllFix[i];
                        if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) == 'undefined') {
                          element.painting = tempValue;
                          i = dataMappedPaintingAllFix.length;
                        }
                      }
                    } else {
                      element.painting = dataMappedPaintingAllFix[0];
                    }
                  }
                  element.area = dataMappedArea[0];
                  element.level = dataMappedLevel[0];
                }
              }
            } else {
              element.area = { label: '', value: '' };
              element.level = { label: '', value: '' };
              if (modalValue === '2') {
                if (element?.area) {
                  delete element.area;
                }
                if (element?.level) {
                  delete element.level;
                }
                if (isFullBodyPaint) {
                  element.painting = { label: '', value: '' };
                } else {
                  // --- bumper/all -----------------
                  if (checkBumper(element?.REGION) === true) {
                    element.painting = dataMappedPaintingBumperReplace[0];
                  } else {
                    element.painting = dataMappedPaintingAllReplace[0];
                  }
                }
              } else {
                if (checkBumper(element?.REGION) === true) {
                  if (isFullBodyPaint) {
                    element.painting = { label: '', value: '' };
                  } else {
                    if (typeof levelCheck.find(element => element == dataMappedLevel[0].value.trim().toUpperCase()) != 'undefined') {
                      for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
                        let tempValue = dataMappedPaintingAllFix[i];
                        if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) != 'undefined') {
                          element.painting = tempValue;
                          i = dataMappedPaintingAllFix.length;
                        }
                      }
                    } else {
                      element.painting = dataMappedPaintingAllFix[0];
                    }
                  }
                  if (element?.area) {
                    delete element.area;
                  }
                  if (element?.level) {
                    delete element.level;
                  }
                } else {
                  if (isFullBodyPaint) {
                    element.painting = { label: '', value: '' };
                  } else {
                    if (typeof levelCheck.find(element => element == dataMappedLevel[0].value.trim().toUpperCase()) != 'undefined') {
                      for (let i = 0; i < dataMappedPaintingAllFix.length; i++) {
                        let tempValue = dataMappedPaintingAllFix[i];
                        if (typeof filterPainting.find(element => element == tempValue?.value.trim().toUpperCase()) != 'undefined') {
                          element.painting = tempValue;
                          i = dataMappedPaintingAllFix.length;
                        }
                      }
                    } else {
                      element.painting = dataMappedPaintingAllFix[0];
                    }
                  }
                }
              }
            }
          } else {
            element.painting = { label: '', value: '' };
            element.area = { label: '', value: '' };
            element.level = { label: '', value: '' };
          }
        }
      });
      setCurrentPart(currentPart);
      autoSave(currentPart, currentCase.specialCoating, currentCase.paintFilm);
    } else if (modalTitle?.key === 'Area') {
      currentPart.forEach(element => {
        if (element.REGION === itemSelected.REGION) {
          dataMappedArea.forEach(itemData => {
            if (itemData.value === modalValue) {
              element.area = itemData;
              // console.log('----- area Selected ' + JSON.stringify(itemData));
            }
          });
        }
      });
      setCurrentPart(currentPart);
      autoSave(currentPart, currentCase.specialCoating, currentCase.paintFilm);
    } else if (modalTitle?.key === 'Level') {
      currentPart.forEach(element => {
        if (element.REGION === itemSelected.REGION) {
          dataMappedLevel.forEach(itemData => {
            if (itemData.value === modalValue) {
              element.level = itemData;
              // console.log('----- level Selected ' + JSON.stringify(itemData));
            }
          });
        }
      });
      setCurrentPart(currentPart);
      autoSave(currentPart, currentCase.specialCoating, currentCase.paintFilm);
    } else if (modalTitle?.key === 'Painting') {
      currentPart.forEach(element => {
        if (element.REGION === itemSelected.REGION) {
          dataModal.forEach(itemData => {
            if (itemData.value === modalValue) {
              element.painting = itemData;
              // console.log('----- painting Selected ' + JSON.stringify(itemData));
            }
          });
        }
      });
      setCurrentPart(currentPart);
      autoSave(currentPart, currentCase.specialCoating, currentCase.paintFilm);
    }
  };

  const updateAreaValue = area => {
    let result = area;
    let count = 0;
    if (dataMappedArea.length > 0) {
      let areaValue = parseFloat(area.value);
      dataMappedArea.forEach(itemData => {
        count++;
        if (
          typeof area.value === 'string' &&
          area.value.trim() === itemData.value.trim()
        ) {
          result = {
            label: itemData.label, // area.label.toString(),
            value: itemData.value.trim(),
          };
        }
        if (!isNaN(areaValue)) {
          if (areaValue <= 0) {
            result = {
              label: '0',
              value: 'AA',
            };
          }
          let labelData = itemData.label.split('~');
          if (labelData.length == 1) {
            if (labelData[0] <= areaValue) {
              result = {
                label: itemData.label, // areaValue.toString(),
                value: itemData.value.trim(),
              };
            }
            if (count === dataMappedArea.length && areaValue > labelData[1]) {
              result = {
                label: itemData.label, // areaValue.toString(),
                value: itemData.value.trim(),
              };
            }
          } else if (labelData.length == 2) {
            if (areaValue >= labelData[0] && areaValue <= labelData[1]) {
              result = {
                label: itemData.label, // areaValue.toString(),
                value: itemData.value.trim(),
              };
            }
            if (count === dataMappedArea.length && areaValue > labelData[1]) {
              result = {
                label: itemData.label, //areaValue.toString(),
                value: itemData.value.trim(),
              };
            }
          }
        }
      });
    }
    return result;
  };

  const submitMainProcedure = async () => {
    setIsLoading(true);

    const _info = dataConfig[0];
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    let backupPhotos = [];
    let newDamagePart = currentCase?.damagedPart;
    const fixData = [];
    newDamagePart.forEach(element => {
      if (element?.area && dataMappedArea.length > 0) {
        element.area = updateAreaValue(element.area);
      }
      if (element?.method?.value === '1') {
        element.WAY = 'R';
      } else if (element?.method?.value === '2') {
        element.WAY = 'X';
      }
      let partData = {
        REGION: element.REGION,
        REGIONM: element.REGIONM,
        PNC: element.PNC,
        WAY: element.WAY,
      };
      fixData.push(partData);
      backupPhotos.push([...element.PHOTOS]);
      element.PHOTOS = [];
    });
    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      USERID: authen?.USERID,
      LICSNO: currentCase?.licensePlate,
      VDS: _info[0]?.VDS,
      WMI: _info[0]?.WMI,
      CARSFX: _info[0]?.CARSFX,
      PRODDT: _info[0]?.PRODDT,
      YYMDL: _info[0]?.YYMDL,
      FIX: fixData,
    };
    // console.log('------ submitMainProcedure params: ' + JSON.stringify(_body));
    const result = await procedureAPI.sendDataMainProcedure(_body, _config);
    // console.log('------ submitMainProcedure result: ', result);
    for (let i = 0; i < newDamagePart.length; i++) {
      newDamagePart[i].PHOTOS = backupPhotos[i];
    }
    if (result && result.status === 200) {
      gotoNextPage();
    } else {
      apiCallFailed();
    }
    setIsLoading(false);
    // console.log('------ submitMainProcedure : ' + JSON.stringify(result));
  };

  const handelPickerChange = value => {
    setModalValue(value);
  };

  const saveToStorage = async () => {
    let updateCase = currentCase;
    const newList = caseListPage.current;
    newList.forEach(element => {
      element.damagedPart.forEach(part => {
        if (part.ups) {
          part.level = { label: '', value: 'UPS' };
          part.area = { label: '', value: '' };
        }
      });
      if (element.id === currentCase?.id) {
        element.damagedPart = currentCase.damagedPart;
        element.specialCoating = currentCase.specialCoating;
        element.paintFilm = currentCase.paintFilm;
        element.progress = element.progress == 7 ? 7 : 5;
        // console.log('--- element : ' + JSON.stringify(element));

        updateCase = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    return updateCase;
  };

  const autoSave = async (damagedPart, specialCoating, paintFilm) => {
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === currentCase?.id) {
        element.damagedPart = damagedPart;
        element.specialCoating = specialCoating;
        element.paintFilm = paintFilm;
        element.progress = element.progress == 7 ? 7 : 5;
        // console.log('--- element : ' + JSON.stringify(element));
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
  };

  const callI02 = async (currentCaseI02) => {
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
    let dataMain = currentCaseI02?.damagedPart
      ? JSON.parse(JSON.stringify(currentCaseI02.damagedPart))
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

    const requestSub = [];

    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      USERID: authen?.USERID,
      LICSNO: currentCaseI02?.licensePlate,
      CARNM: _info[0].CARNM, // Q01 Input01
      VDS: _info[0].VDS, // Q01 Input01
      WMI: _info[0].WMI, // Q01 Input01
      CARSFX: _info[0].CARSFX, // Q01 Input01
      PRODDT: _info[0].PRODDT,
      YYMDL: _info[0].YYMDL,
      SPEC: currentCaseI02?.specialCoating?.value,
      SMEAR: currentCaseI02?.paintFilm?.value,
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
    if (!result || result.status !== 200) {

    }
  };

  const gotoNextPage = async () => {
    const updateCase = await saveToStorage();
    // console.log('--- updateCase : ' + JSON.stringify(updateCase)); 
    if (onlyFullBodyPaint) {
      await callI02(updateCase);
      navigation.navigate(routes.ASSESSMENTPROCEDURESCREEN, {
        caseData: updateCase,
        dataConfig: dataConfig,
        authen: authen,
        fromHome: false,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    } else {
      navigation.navigate(routes.COMPONENTSPROCEDURESCREEN, {
        caseData: updateCase,
        dataConfig: dataConfig,
        authen: authen,
      });
    }
  };

  const onPressNext = () => {
    setIsShowAlert(true);
  };

  const renderAlertModal = () => {
    return (
      <AlertRowModal
        visible={isShowAlert}
        title={'您要進入下一步嗎？'}
        message={'請注意：帶出附屬零件後，便無法修改主要零件。\n若要修改，請刪除此案件之後，重新開始'}
        type={'white'}
        onPressCancel={() => setIsShowAlert(false)}
        onPressOK={() => {
          setIsShowAlert(false);
          submitMainProcedure();
        }}
      />
    )
  }

  const renderFilter = () => {
    const specialCoating = ar_special_coating;
    const paintFilm = ar_paint_film;
    return (
      <View style={styles.viewBody}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 18, color: colors.black }}>
              {specialCoating}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 200,
                minHeight: 45,
                marginTop: 5,
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkGray,
              }}
              onPress={() => onPressSpecialCoating(specialCoating)}>
              <Text
                style={{ flex: 1, fontSize: 18, color: colors.blackGray }}
                numberOfLines={1}>
                {currentCase?.specialCoating?.label ?? '---'}
              </Text>
              <Image
                style={{ width: 16, height: 16 }}
                source={require('../../../assets/icons/ic_dropdown.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'column', marginLeft: 50 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 18, color: colors.black }}>
                {paintFilm}
              </Text>
              <Text style={{ fontSize: 18, color: colors.red }}>*</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 200,
                minHeight: 45,
                marginTop: 5,
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkGray,
              }}
              onPress={() => onPressPaintFilm(paintFilm)}>
              <Text
                style={{ flex: 1, fontSize: 18, color: colors.blackGray }}
                numberOfLines={1}>
                {currentCase?.paintFilm?.label ?? ''}
              </Text>
              <Image
                style={{ width: 16, height: 16 }}
                source={require('../../../assets/icons/ic_dropdown.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderMain = () => {
    return (
      <View style={{ flexDirection: 'column', paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 24, color: colors.black }}>
          {main_procedure_title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            backgroundColor: colors.primary,
            padding: 15,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.25,
            shadowRadius: 5.84,
            elevation: 5,
          }}>
          <View style={{ flex: 2 }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: colors.white }}>
              {main_procedure_part}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.white,
                marginLeft: 10,
              }}>
              {main_procedure_method}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.white,
                marginLeft: 10,
              }}>
              {main_procedure_area}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.white,
                marginLeft: 10,
              }}>
              {main_procedure_level}
            </Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.white,
                marginLeft: 10,
              }}>
              {main_procedure_painting}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = data => {
    const item = data?.item;
    const area = item?.area;
    const method = item?.method;
    const title = item?.REGIONM;
    const level = item?.level;
    const painting = item?.painting;
    // console.log('--- renderItem : ' + JSON.stringify(item));
    const bgColor = data?.index % 2 == 0 ? colors.white : colors.bgBlue;

    let hideAreaLevel = false;
    const isBumper = checkBumper(item?.REGION);
    if (isBumper) {
      hideAreaLevel = true;
    } else if (method?.value === '2') {
      hideAreaLevel = true;
    }
    // const isFullBodyPaint = item.id == 13;

    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 22,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: bgColor,
          }}>
          <View style={{ flex: 2 }}>
            <Text style={{ fontSize: 18, color: colors.blackGray }}>{title}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              disabled={item.id == 13}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
                minHeight: 50,
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkGray,
                backgroundColor: (item.id == 13) ? colors.whiteGray : colors.white,
              }}
              onPress={() => onPressMethod(item)}>
              <Text style={{ flex: 1, fontSize: 18, color: colors.blackGray }}>
                {method?.label}
              </Text>
              <Image
                style={{ width: 16, height: 16 }}
                source={require('../../../assets/icons/ic_dropdown.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {hideAreaLevel || item.id == 13 || item.ups ? (
              <Text style={{ fontSize: 18, color: colors.colorText }}>{'-'}</Text>
            ) : (
              <TouchableOpacity
                disabled={item.id == 13 || item.ups}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                  minHeight: 50,
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.darkGray,
                  backgroundColor: (item.id == 13 || item.ups) ? colors.whiteGray : colors.white,
                }}
                onPress={() => onPressArea(item)}>
                <Text style={{ flex: 1, fontSize: 18, color: colors.blackGray }}>
                  {area?.label}
                </Text>
                <Image
                  style={{ width: 16, height: 16 }}
                  source={require('../../../assets/icons/ic_dropdown.png')}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {hideAreaLevel || item.id == 13 || item.ups ? (
              <Text style={{ fontSize: 18, color: colors.colorText }}>{'-'}</Text>
            ) : (
              <TouchableOpacity
                disabled={item.id == 13 || item.ups}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                  minHeight: 50,
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.darkGray,
                  backgroundColor: (item.id == 13 || item.ups) ? colors.whiteGray : colors.white,
                }}
                onPress={() => onPressLevel(item)}>
                <Text style={{ flex: 1, fontSize: 18, color: colors.blackGray }}>
                  {level?.label}
                </Text>
                <Image
                  style={{ width: 16, height: 16 }}
                  source={require('../../../assets/icons/ic_dropdown.png')}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            {!painting?.label && !bkCase.current.selectedBodyPaint ? (
              <Text style={{ fontSize: 18, color: colors.colorText }}>{'-'}</Text>
            ) : (
              <TouchableOpacity
                disabled={item.id == 13 || isFullBodyPaint}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                  minHeight: 50,
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.darkGray,
                  backgroundColor: (item.id == 13 || isFullBodyPaint) ? colors.whiteGray : colors.white,
                }}
                onPress={() => onPressPainting(item)}>
                <Text style={{ flex: 2, fontSize: 18, color: colors.blackGray }}>
                  {painting?.label}
                </Text>
                <Image
                  style={{ width: 16, height: 16 }}
                  source={require('../../../assets/icons/ic_dropdown.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
        data={currentPart}
        renderItem={renderItem}
        keyExtractor={item => {
          item.id;
        }}
      />
    );
  };

  const renderButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 16,
        }}>
        <Button
          title={ar_next}
          style={{ backgroundColor: colors.primary }}
          onPress={() => onPressNext()}
        />
      </View>
    );
  };

  const renderModalPicker = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPicker}
        onRequestClose={() => { }}>
        <SafeAreaView style={styles.safeView}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 1 }}></View>
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
                  <Text style={{ fontSize: 18, color: colors.royalBlue }}>
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
                  <Text style={{ fontSize: 18, color: colors.royalBlue }}>
                    {_main_procedure_done}
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
                  labelStyle={{ color: '#000000', fontSize: 24 }}
                  onChange={handelPickerChange}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
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
    if (onlyFullBodyPaint) {
      navigation.navigate(routes.DAMAGEPARTSCREEN, {
        caseData: newCase,
        dataConfig: dataConfig,
        authen: authen,
      });
    } else {
      navigation.navigate(routes.MEASURE_AREA, {
        caseData: newCase,
        dataConfig: dataConfig,
        authen: authen,
      });
    }
  };
  const onPressDocument = async () => {
    await saveToStorage();
    navigation.navigate(routes.DRIVING_LICENSE, {
      caseData: caseData,
      dataConfig: dataConfig,
      fromHome: false,
      authen: authen,
      onlyFullBodyPaint: onlyFullBodyPaint,
    });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <Header
          iconHome
          onPressHome={() => onPressGoHome()}
          title={currentCase?.licensePlate?.toLocaleUpperCase()}
        />
        <TopScreen
          topID={3}
          onPressPhotos={onPressGoBack}
          onPressDocument={onPressDocument}
        />
        {renderFilter()}
        {renderMain()}
        {renderList()}
        {renderButton()}
        {renderModalPicker()}

        {isLoading && <LoadingView />}
      </View>
      {renderAlertModal()}
    </SafeAreaView>
  );
};

export default MainProcedure;
