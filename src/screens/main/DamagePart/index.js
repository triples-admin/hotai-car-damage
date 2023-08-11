import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../../components/Header';
import LoadingView from '../../../components/Loading';
import { colors } from '../../../theme';
import { icons, images } from '../../../assets';
import { routes } from '../../../navigation/routes';
import Button from '../../../components/Button';
import Toggle from '../../../components/Toggle';
const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');
import caseListPageStorage from '../../../api/storage/caseListPage';
import i18n from '../../../utils/i18n';

// 1. Right Front 45 - front bumper, hood, right front fender, right front door
// 2. Right rear 45 - right rear door, right rear fender,  luggage, rear bumper
// 3. Left Rear 45 - luggage, rear bumper, left rear fender, left rear door
// 4. Left front 45 - left front door, left front fender, hood, front bumper

const DamagePart = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const authen = route?.params?.authen;
  let caseData = useRef(route?.params?.caseData);
  const fromHome = route?.params?.fromHome ?? false;
  const dataConfig = route?.params?.dataConfig ?? null;
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState(dataConfig[1]);
  const [array, setArray] = useState([]);
  const [selected1, setSelected1] = useState(false); // Hood
  const [selected2, setSelected2] = useState(false); // Right Front fender
  const [selected3, setSelected3] = useState(false); // Right Front door
  const [selected4, setSelected4] = useState(false); // Right rear door
  const [selected5, setSelected5] = useState(false); // Right Rear fender
  const [selected6, setSelected6] = useState(false); // Luggage
  const [selected7, setSelected7] = useState(false); // Front bumper
  const [selected8, setSelected8] = useState(false); // Left Front Fender
  const [selected9, setSelected9] = useState(false); // Left Front Door
  const [selected10, setSelected10] = useState(false); // Left rear door
  const [selected11, setSelected11] = useState(false); // Left rear fender
  const [selected12, setSelected12] = useState(false); // Rear bumper
  const [selectedBodyPaint, setSelectedBodyPaint] = useState(false); // Body paint
  const [roofStatus, setRoofStatus] = useState(false);

  const caseListPage = useRef();

  // console.log(dataConfig[1])
  // console.log("ARRAY =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

  const _damaged_part_pls_select_damaged_part = i18n.t(
    'damaged_part_pls_select_damaged_part',
  );
  const _damaged_part_back = i18n.t('damaged_part_back');
  const _damaged_part_next = i18n.t('damaged_part_next');
  const _damaged_part_ok = i18n.t('damaged_part_ok');
  const _damaged_part_full_body_paint = i18n.t('damaged_part_full_body_paint');
  const _damaged_part_exclude_roof = i18n.t('damaged_part_exclude_roof');
  const _damaged_part_including_roof = i18n.t('damaged_part_including_roof');

  const damaged_part_confirm_title = i18n.t('damaged_part_confirm_title');
  const damaged_part_confirm_content = i18n.t('damaged_part_confirm_content');
  const ar_cancel = i18n.t('ar_cancel');
  const ar_sure = i18n.t('ar_sure');

  const damaged_part_special_alert_title = i18n.t(
    'damaged_part_special_alert_title',
  );
  const damaged_part_special_alert_content = i18n.t(
    'damaged_part_special_alert_content',
  );
  const damaged_part_special_alert_left = i18n.t(
    'damaged_part_special_alert_left',
  );
  const damaged_part_special_alert_right = i18n.t(
    'damaged_part_special_alert_right',
  );

  const car_damage_photos_right_front_45 = i18n.t(
    'car_damage_photos_right_front_45',
  );
  const car_damage_photos_right_rear_45 = i18n.t(
    'car_damage_photos_right_rear_45',
  );
  const car_damage_photos_left_rear_45 = i18n.t(
    'car_damage_photos_left_rear_45',
  );
  const car_damage_photos_left_front_45 = i18n.t(
    'car_damage_photos_left_front_45',
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

  useEffect(() => {
    // console.log('-- reload array ' + JSON.stringify(array));
    if (caseData.current?.progress >= 3) {
      const parts = caseData.current?.damagedPart ?? [];
      setArray(parts);
      // console.log('-- reload array ' + JSON.stringify(parts));
      parts.forEach(element => {
        if (element.id === 1) {
          setSelected1(true);
        } else if (element.id === 2) {
          setSelected2(true);
        } else if (element.id === 3) {
          setSelected3(true);
        } else if (element.id === 4) {
          setSelected4(true);
        } else if (element.id === 5) {
          setSelected5(true);
        } else if (element.id === 6) {
          setSelected6(true);
        } else if (element.id === 7) {
          setSelected7(true);
        } else if (element.id === 8) {
          setSelected8(true);
        } else if (element.id === 9) {
          setSelected9(true);
        } else if (element.id === 10) {
          setSelected10(true);
        } else if (element.id === 11) {
          setSelected11(true);
        } else if (element.id === 12) {
          setSelected12(true);
        }
      });
      setSelectedBodyPaint(caseData.current?.selectedBodyPaint);
      setRoofStatus(caseData.current?.roofStatus);
    }
  }, []);

  const checkNext = (setAlert = true) => {
    if (
      selected1 ||
      selected2 ||
      selected3 ||
      selected4 ||
      selected5 ||
      selected6 ||
      selected7 ||
      selected8 ||
      selected9 ||
      selected10 ||
      selected11 ||
      selected12
    ) {
      return true;
    } else if (setAlert) {
      SelectAlert();
    }
    return false;
  };

  const SelectAlert = () => {
    Alert.alert('', _damaged_part_pls_select_damaged_part, [
      { text: _damaged_part_ok, onPress: () => console.log('OK Pressed') },
    ]);
  };

  const toggle1 = () => {
    if (!selected1) {
      //console.log('selected', data[0].REGION);
      const newArray = {
        PNC: data[0].PNC,
        REGION: data[0].REGION,
        REGIONM: data[0].REGIONM,
        ENGNAME: 'hood',
        PHOTOS: [],
        id: 1,
        position: 2,
        group: ['rightFront', 'leftFront'],
      };
      array.push(newArray);
      setSelected1(!selected1);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 1);
      setArray(newList);
      setSelected1(!selected1);
      autoSave(newList);
    }
  };
  const toggle2 = () => {
    if (!selected2) {
      //console.log('selected', data[1].REGION);
      const newArray = {
        PNC: data[1].PNC,
        REGION: data[1].REGION,
        REGIONM: data[1].REGIONM,
        ENGNAME: 'rightFrontFender',
        PHOTOS: [],
        id: 2,
        position: 3,
        group: ['rightFront'],
      };
      array.push(newArray);
      setSelected2(!selected2);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 2);
      setArray(newList);
      setSelected2(!selected2);
      autoSave(newList);
    }
  };
  const toggle3 = () => {
    if (!selected3) {
      //console.log('selected', data[3].REGION);
      const newArray = {
        PNC: data[3].PNC,
        REGION: data[3].REGION,
        REGIONM: data[3].REGIONM,
        ENGNAME: 'rightFrontDoor',
        PHOTOS: [],
        id: 3,
        position: 4,
        group: ['rightFront'],
      };
      array.push(newArray);
      setSelected3(!selected3);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 3);
      setArray(newList);
      setSelected3(!selected3);
      autoSave(newList);
    }
  };
  const toggle4 = () => {
    if (!selected4) {
      //console.log('selected', data[5].REGION);
      const newArray = {
        PNC: data[5].PNC,
        REGION: data[5].REGION,
        REGIONM: data[5].REGIONM,
        ENGNAME: 'rightRearDoor',
        PHOTOS: [],
        id: 4,
        position: 5,
        group: ['rightRear'],
      };
      array.push(newArray);
      setSelected4(!selected4);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 4);
      setArray(newList);
      setSelected4(!selected4);
      autoSave(newList);
    }
  };
  const toggle5 = () => {
    if (!selected5) {
      //console.log('selected', data[7].REGION);
      const newArray = {
        PNC: data[7].PNC,
        REGION: data[7].REGION,
        REGIONM: data[7].REGIONM,
        ENGNAME: 'rightRearFender',
        PHOTOS: [],
        id: 5,
        position: 6,
        group: ['rightRear'],
      };
      array.push(newArray);
      setSelected5(!selected5);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 5);
      setArray(newList);
      setSelected5(!selected5);
      autoSave(newList);
    }
  };
  const toggle6 = () => {
    if (!selected6) {
      //console.log('selected', data[9].REGION);

      const newArray = {
        PNC: data[9].PNC,
        REGION: data[9].REGION,
        REGIONM: data[9].REGIONM,
        ENGNAME: 'luggage',
        PHOTOS: [],
        id: 6,
        position: 7,
        group: ['rightRear', 'leftRear'],
      };
      array.push(newArray);
      setSelected6(!selected6);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 6);
      setArray(newList);
      setSelected6(!selected6);
      autoSave(newList);
    }
  };
  const toggle7 = () => {
    if (!selected7) {
      //console.log('selected', data[12].REGION);
      const newArray = {
        PNC: data[12].PNC,
        REGION: data[12].REGION,
        REGIONM: data[12].REGIONM,
        ENGNAME: 'frontBumper',
        PHOTOS: [],
        id: 7,
        position: 1,
        group: ['rightFront', 'leftFront'],
      };
      array.push(newArray);
      setSelected7(!selected7);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 7);
      setArray(newList);
      setSelected7(!selected7);
      autoSave(newList);
    }
  };
  const toggle8 = () => {
    if (!selected8) {
      //console.log('selected', data[2].REGION);
      const newArray = {
        PNC: data[2].PNC,
        REGION: data[2].REGION,
        REGIONM: data[2].REGIONM,
        ENGNAME: 'leftFrontFender',
        PHOTOS: [],
        id: 8,
        position: 12,
        group: ['leftFront'],
      };
      array.push(newArray);
      setSelected8(!selected8);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 8);
      setArray(newList);
      setSelected8(!selected8);
      autoSave(newList);
    }
  };
  const toggle9 = () => {
    if (!selected9) {
      //console.log('selected', data[4].REGION);
      const newArray = {
        PNC: data[4].PNC,
        REGION: data[4].REGION,
        REGIONM: data[4].REGIONM,
        ENGNAME: 'leftFrontDoor',
        PHOTOS: [],
        id: 9,
        position: 11,
        group: ['leftFront'],
      };
      array.push(newArray);
      setSelected9(!selected9);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 9);
      setArray(newList);
      setSelected9(!selected9);
      autoSave(newList);
    }
  };
  const toggle10 = () => {
    if (!selected10) {
      //console.log('selected', data[6].REGION);
      const newArray = {
        PNC: data[6].PNC,
        REGION: data[6].REGION,
        REGIONM: data[6].REGIONM,
        ENGNAME: 'leftRearDoor',
        PHOTOS: [],
        id: 10,
        position: 10,
        group: ['leftRear'],
      };
      array.push(newArray);
      setSelected10(!selected10);
      autoSave(array);
    } else {
      let newList = array.filter(a => a.id != 10);
      setArray(newList);
      setSelected10(!selected10);
      autoSave(newList);
    }
  };
  const toggle11 = () => {
    if (!selected11) {
      //console.log('selected', data[8].REGION);
      const newArray = {
        PNC: data[8].PNC,
        REGION: data[8].REGION,
        REGIONM: data[8].REGIONM,
        ENGNAME: 'leftRearFender',
        PHOTOS: [],
        id: 11,
        position: 9,
        group: ['leftRear'],
      };
      array.push(newArray);
      setSelected11(!selected11);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 11);
      setArray(newList);
      setSelected11(!selected11);
      autoSave(newList);
    }
  };
  const toggle12 = () => {
    if (!selected12) {
      //console.log('selected', data[12].REGION);
      const newArray = {
        PNC: data[11].PNC,
        REGION: data[11].REGION,
        REGIONM: data[11].REGIONM,
        ENGNAME: 'rearBumper',
        PHOTOS: [],
        id: 12,
        position: 8,
        group: ['rightRear', 'leftRear'],
      };
      array.push(newArray);
      setSelected12(!selected12);
      autoSave(array);
    } else {
      //console.log('not selected');
      let newList = array.filter(a => a.id != 12);
      setArray(newList);
      setSelected12(!selected12);
      autoSave(newList);
    }
  };

  const toggleBodyPaint = async () => {
    setSelectedBodyPaint(!selectedBodyPaint);
    let index = array.findIndex(e => e.id == 13);
    if (!selectedBodyPaint) {
      let newArray = array;
      const newElement = {
        PNC: !roofStatus ? data[13].PNC : data[14].PNC,
        REGION: !roofStatus ? data[13].REGION : data[14].REGION,
        REGIONM: !roofStatus ? data[13].REGIONM : data[14].REGIONM,
        ENGNAME: 'excludeRoof',
        PHOTOS: [],
        id: 13,
        position: 13,
        group: [],
      };

      if (index !== -1) {
        newArray[index] = newElement;
        setArray(newArray);
      } else {
        array.push(newElement);
      }
    } else {
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
    autoSave(array);
  };

  const goToAssessment = async () => {
    const caseUpdate = await saveToStorage();
    navigation.navigate(routes.MAINPROCEDURESCREEN, {
      caseData: caseUpdate,
      dataConfig: dataConfig,
      authen: authen,
      fromHome: false,
      onlyFullBodyPaint: true,
    });
  }

  const gotoTakePhotos = caseUpdate => {
    // console.log('------ gotoTakePhotos - caseUpdate : ' + JSON.stringify(caseUpdate));
    navigation.navigate(routes.MEASURE_AREA_CAMERA, {
      caseData: caseUpdate,
      dataConfig: dataConfig,
      authen: authen,
    });
  };

  const onPressGoHome = async () => {
    await saveToStorage();
    navigation.reset({
      routes: [{ name: routes.HOMESCREEN }],
    });
  };

  const onPressGoBack = async () => {
    const caseUpdate = await saveToStorage();
    // navigation.goBack();
    navigation.navigate(routes.DRIVING_LICENSE, {
      caseData: caseUpdate,
      dataConfig: dataConfig,
      authen: authen,
    });
  };

  const AsyncAlert = async (index = 0, content, partName) => new Promise((resolve) => {
    Alert.alert(damaged_part_special_alert_title, content, [
      {
        text: damaged_part_special_alert_left,
        onPress: () => {
          chooseAngle('left', index);
          resolve(true);
        }
      },
      {
        text: damaged_part_special_alert_right,
        onPress: () => {
          chooseAngle('right', index);
          resolve(true);
        }
      },
    ]);
  });

  const onPressNext = async () => {
    if (checkNext(false) === false) {
      // check selected
      if (selectedBodyPaint) {
        goToAssessment();
      } else {
        SelectAlert();
      }
      return;
    }
    let frontAngle = [];
    let rearAngle = [];
    if ((selected7 || selected1) && selected8 && selected2) {
      frontAngle = ['leftFront', 'rightFront'];
    } else if ((selected7 || selected1) && selected8 && !selected2) {
      frontAngle = ['leftFront'];
    } else if ((selected7 || selected1) && !selected8 && selected2) {
      frontAngle = ['rightFront'];
    } else if (selected7 && selected1) {
      frontAngle = ['rightFront'];
    }
    if ((selected6 || selected12) && selected11 && !selected5) {
      rearAngle = ['leftRear', 'rightRear'];
    } else if ((selected6 || selected12) && selected11 && !selected5) {
      rearAngle = ['leftRear'];
    } else if ((selected6 || selected12) && !selected11 && selected5) {
      rearAngle = ['rightRear'];
    } else if (selected6 && selected12) {
      rearAngle = ['rightRear'];
    }
    Promise.all(array.map(async (value, index) => {
      if (checkSpecialPart(index) === true) {
        // check 1 part special selected (frontBumper, hood, luggage, rearBumper)
        const partName = array[index]?.REGIONM;
        if (
          frontAngle.length > 0 &&
          (
            array[index].ENGNAME === 'frontBumper' ||
            array[index].ENGNAME === 'hood'
          )
        ) {
          array[index].group = frontAngle;
        } else if (
          rearAngle.length > 0 &&
          (
            array[index].ENGNAME === 'luggage' ||
            array[index].ENGNAME === 'rearBumper'
          )
        ) {
          array[index].group = rearAngle;
        } else {
          const content = damaged_part_special_alert_content.replace(
            'ZZZZ',
            partName,
          );
          await AsyncAlert(index, content, partName);
        }
      }
    })).finally(() => {
      gotoNextPage();
    });
  };

  const chooseAngle = (angle, index = 0) => {
    if (array[index].ENGNAME === 'frontBumper' || array[index].ENGNAME === 'hood') {
      // 2 angle: ['rightFront', 'leftFront']
      if (angle === 'left') {
        array[index].group = ['leftFront'];
      } else if (angle === 'right') {
        array[index].group = ['rightFront'];
      }
    } else if (
      array[index].ENGNAME === 'luggage' ||
      array[index].ENGNAME === 'rearBumper'
    ) {
      // 2 angle: ['rightRear', 'leftRear']
      if (angle === 'left') {
        array[index].group = ['leftRear'];
      } else if (angle === 'right') {
        array[index].group = ['rightRear'];
      }
    }
    // gotoNextPage();
  };

  const gotoNextPage = async () => {
    const caseUpdate = await saveToStorage();
    gotoTakePhotos(caseUpdate);
  };

  const checkSpecialPart = (index = 0) => {
    let result = false;
    if (
      array[index].ENGNAME === 'frontBumper' ||
      array[index].ENGNAME === 'hood' ||
      array[index].ENGNAME === 'luggage' ||
      array[index].ENGNAME === 'rearBumper'
    ) {
      result = true;
    }
    return result;
  };

  const getListAngle = () => {
    // console.log('---- car damage: ' + JSON.stringify(array));
    let allGroup = [];
    if (array.length > 1) {
      // multi parts
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.ENGNAME === 'rightFrontFender') {
          allGroup = allGroup.concat(element.group);
        } else if (element.ENGNAME === 'rightFrontDoor') {
          allGroup = allGroup.concat(element.group);
        } else if (element.ENGNAME === 'rightRearDoor') {
          allGroup = allGroup.concat(element.group);
        } else if (element.ENGNAME === 'rightRearFender') {
          allGroup = allGroup.concat(element.group);
        } else if (element.ENGNAME === 'leftRearFender') {
          allGroup = allGroup.concat(element.group);
        } else if (element.ENGNAME === 'leftRearDoor') {
          allGroup = allGroup.concat(element.group);
        } else if (element.ENGNAME === 'leftFrontDoor') {
          allGroup = allGroup.concat(element.group);
        } else if (element.ENGNAME === 'leftFrontFender') {
          allGroup = allGroup.concat(element.group);
        } else if (
          element.ENGNAME === 'frontBumper' ||
          element.ENGNAME === 'hood'
        ) {
          allGroup = allGroup.concat(element.group);
          // // 2 angle: ['rightFront', 'leftFront']
          // let angle = '';
          // for (let j = 0; j < array.length; j++) {
          //   const temp = array[j];
          //   if (
          //     temp.ENGNAME === 'leftFrontDoor' ||
          //     temp.ENGNAME === 'leftFrontFender'
          //   ) {
          //     angle = 'leftFront';
          //   }
          //   if (
          //     temp.ENGNAME === 'rightFrontFender' ||
          //     temp.ENGNAME === 'rightFrontDoor'
          //   ) {
          //     angle = 'rightFront';
          //   }
          // }
          // if (angle !== '') {
          //   allGroup.push(angle);
          // } else {
          //   allGroup.push('rightFront');
          // }
        } else if (
          element.ENGNAME === 'luggage' ||
          element.ENGNAME === 'rearBumper'
        ) {
          allGroup = allGroup.concat(element.group);
          // 2 angle: ['rightRear', 'leftRear']
          // let angle = '';
          // for (let j = 0; j < array.length; j++) {
          //   const temp = array[j];
          //   if (
          //     temp.ENGNAME === 'leftRearFender' ||
          //     temp.ENGNAME === 'leftRearDoor'
          //   ) {
          //     angle = 'leftRear';
          //   }
          //   if (
          //     temp.ENGNAME === 'rightRearDoor' ||
          //     temp.ENGNAME === 'rightRearFender'
          //   ) {
          //     angle = 'rightRear';
          //   }
          // }
          // if (angle !== '') {
          //   allGroup.push(angle);
          // } else {
          //   allGroup.push('rightRear');
          // }
        }
      }
    } else if (array.length > 0) {
      // 1 part
      allGroup = array[0].group;
    }
    // console.log('---- allGroup : ', JSON.stringify(allGroup));

    // remove item duplicate
    let uniq = {};
    let arrFiltered = allGroup.filter(obj => !uniq[obj] && (uniq[obj] = true));
    // console.log('---- arrFiltered : ', JSON.stringify(arrFiltered));

    // create list angle
    let arrAngle = [];
    arrFiltered.forEach(element => {
      let title = '';
      let position = 999;
      if (element === 'rightFront') {
        title = car_damage_photos_right_front_45;
        position = 1;
      } else if (element === 'rightRear') {
        title = car_damage_photos_right_rear_45;
        position = 2;
      } else if (element === 'leftRear') {
        title = car_damage_photos_left_rear_45;
        position = 3;
      } else if (element === 'leftFront') {
        title = car_damage_photos_left_front_45;
        position = 4;
      }
      const temp = {
        position: position,
        name: title,
        value: element,
        photo: null,
      };
      arrAngle.push(temp);
    });

    // sort list
    arrAngle.sort((a, b) => a.position - b.position);
    // console.log('---- arrAngle : ', JSON.stringify(arrAngle));
    return arrAngle;
  };

  const saveToStorage = async () => {
    const arrAngle = getListAngle();
    let newArrAngle = arrAngle.map((item, i) => {
      if (caseData.current?.damagedAngle) {
        let index = caseData.current?.damagedAngle.findIndex(x => x.value === item.value);
        if (index > -1) {
          return Object.assign({}, item, caseData.current?.damagedAngle[index]);
        }
      }
      return Object.assign({}, caseData.current?.damagedAngle[i], item);
    });
    const arrParts = array.sort((a, b) => a.position - b.position);

    let caseUpdate = caseData.current;
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData.current?.id) {
        element.damagedPart = arrParts;
        element.damagedAngle = newArrAngle;
        element.progress = element.progress == 7 ? 7 : 3;
        element.selectedBodyPaint = selectedBodyPaint;
        element.roofStatus = roofStatus;
        caseUpdate = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    return caseUpdate;
  };

  const autoSave = async newData => {
    const arrParts = newData.sort((a, b) => a.position - b.position);
    // console.log('----- arrParts : ' + JSON.stringify(arrParts));

    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === caseData.current?.id) {
        element.damagedPart = arrParts;
        element.progress = element.progress == 7 ? 7 : 3;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
  };

  const renderCar2doors = () => {
    return (
      <View style={styles.viewCar}>
        <Image
          resizeMode="contain"
          source={images.car_image_2doors}
          style={styles.imageCar}
        />
        <View style={[styles.viewDamagedPart, { top: 40, right: 0, left: -280 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle7()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected7 ? colors.white : colors.primary,
                  borderColor: !selected7
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected7 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[12]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View
          style={[styles.viewDamagedPart, { top: 110, right: 0, left: -312 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle8()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected8 ? colors.white : colors.primary,
                  borderColor: !selected8
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected8 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[2]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View
          style={[styles.viewDamagedPart, { top: 220, right: 0, left: -312 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle9()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected9 ? colors.white : colors.primary,
                  borderColor: !selected9
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected9 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[4]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        {/* <View
          style={[styles.viewDamagedPart, { top: 270, right: 0, left: -312 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle10()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected10
                    ? colors.white
                    : colors.primary,
                  borderColor: !selected10
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected10 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { textAlign: 'center', color: colors.blackGray }]}>{data[6]?.REGIONM}</Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View> */}
        <View
          style={[styles.viewDamagedPart, { top: 335, right: 0, left: -310 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle11()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected11 ? colors.white : colors.primary,
                  borderColor: !selected11
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected11 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[8]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View
          style={[styles.viewDamagedPart, { top: 390, right: 0, left: -285 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle12()}
            style={[styles.viewCheckBoxItem, { marginRight: 5, top: 4 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected12 ? colors.white : colors.primary,
                  borderColor: !selected12
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected12 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[11]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft3}
            style={{ width: 164, height: 17 }}
          />
        </View>

        <View style={[styles.viewDamagedPart, { top: 50, right: 0, left: 136 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight1}
            style={{ width: 240, height: 38 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle1()}
            style={[styles.viewCheckBoxItem, { marginLeft: 16, height: 24 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected1 ? colors.white : colors.primary,
                  borderColor: !selected1
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected1 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[0]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 110, left: 193 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight2}
            style={{ width: 164, height: 17 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle2()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected2 ? colors.white : colors.primary,
                  borderColor: !selected2
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected2 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[1]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 220, left: 193 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight2}
            style={{ width: 164, height: 17 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle3()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected3 ? colors.white : colors.primary,
                  borderColor: !selected3
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected3 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[3]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={[styles.viewDamagedPart, { top: 270, left: 190 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight2}
            style={{ width: 164, height: 17 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle4()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected4 ? colors.white : colors.primary,
                  borderColor: !selected4
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected4 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>{data[5]?.REGIONM}</Text>
          </TouchableOpacity>
        </View> */}
        <View style={[styles.viewDamagedPart, { top: 320, left: 185 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight3}
            style={{ width: 181, height: 28 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle5()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected5 ? colors.white : colors.primary,
                  borderColor: !selected5
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected5 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[7]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 370, left: 140 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight4}
            style={{ width: 216, height: 17 }}
          />
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle6()}
            style={[styles.viewCheckBoxItem, { top: 4 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected6 ? colors.white : colors.primary,
                  borderColor: !selected6
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected6 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[9]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCar4doors = () => {
    return (
      <View style={styles.viewCar}>
        <Image
          resizeMode="contain"
          source={images.car_image_4doors}
          style={styles.imageCar}
        />
        <View style={[styles.viewDamagedPart, { top: 22, right: 0, left: -280 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle7()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected7 ? colors.white : colors.primary,
                  borderColor: !selected7
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected7 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[12]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View style={[styles.viewDamagedPart, { top: 90, right: 0, left: -312 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle8()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected8 ? colors.white : colors.primary,
                  borderColor: !selected8
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected8 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[2]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View
          style={[styles.viewDamagedPart, { top: 200, right: 0, left: -312 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle9()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected9 ? colors.white : colors.primary,
                  borderColor: !selected9
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected9 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[4]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View
          style={[styles.viewDamagedPart, { top: 280, right: 0, left: -312 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle10()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected10 ? colors.white : colors.primary,
                  borderColor: !selected10
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected10 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[6]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View
          style={[styles.viewDamagedPart, { top: 350, right: 0, left: -310 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle11()}
            style={[styles.viewCheckBoxItem, { marginRight: 5 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected11 ? colors.white : colors.primary,
                  borderColor: !selected11
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected11 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[8]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft1}
            style={{ width: 164, height: 17 }}
          />
        </View>
        <View
          style={[styles.viewDamagedPart, { top: 408, right: 0, left: -285 }]}>
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle12()}
            style={[styles.viewCheckBoxItem, { marginRight: 5, top: 4 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected12 ? colors.white : colors.primary,
                  borderColor: !selected12
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected12 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.textSelect,
                { textAlign: 'center', color: colors.blackGray },
              ]}>
              {data[11]?.REGIONM}
            </Text>
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            source={images.lineTopLeft3}
            style={{ width: 164, height: 17 }}
          />
        </View>

        <View style={[styles.viewDamagedPart, { top: 30, right: 0, left: 136 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight1}
            style={{ width: 240, height: 38 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle1()}
            style={[styles.viewCheckBoxItem, { marginLeft: 16, height: 24 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected1 ? colors.white : colors.primary,
                  borderColor: !selected1
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected1 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[0]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 90, left: 193 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight2}
            style={{ width: 164, height: 17 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle2()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected2 ? colors.white : colors.primary,
                  borderColor: !selected2
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected2 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[1]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 200, left: 193 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight2}
            style={{ width: 164, height: 17 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle3()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected3 ? colors.white : colors.primary,
                  borderColor: !selected3
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected3 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[3]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 280, left: 190 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight2}
            style={{ width: 164, height: 17 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle4()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected4 ? colors.white : colors.primary,
                  borderColor: !selected4
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected4 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[5]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 345, left: 185 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight3}
            style={{ width: 181, height: 28 }}
          />

          <TouchableOpacity
            disabled={false}
            onPress={() => toggle5()}
            style={styles.viewCheckBoxItem}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected5 ? colors.white : colors.primary,
                  borderColor: !selected5
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected5 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[7]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.viewDamagedPart, { top: 394, left: 160 }]}>
          <Image
            resizeMode="contain"
            source={images.lineTopRight4}
            style={{ width: 216, height: 17 }}
          />
          <TouchableOpacity
            disabled={false}
            onPress={() => toggle6()}
            style={[styles.viewCheckBoxItem, { top: 4 }]}>
            <View
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !selected6 ? colors.white : colors.primary,
                  borderColor: !selected6
                    ? colors.borderBackground
                    : colors.primary,
                },
              ]}>
              {selected6 && (
                <View style={styles.viewImageSelectItem}>
                  <Image
                    resizeMode="contain"
                    source={icons.tick_icon}
                    style={styles.imageSelectItem}
                  />
                </View>
              )}
            </View>
            <Text style={[styles.textSelect, { color: colors.blackGray }]}>
              {data[9]?.REGIONM}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMain = () => {
    const _info = dataConfig[0];
    const _shape = _info[0]?.SHAPE ?? '4';
    if (_shape === '2') {
      return renderCar2doors();
    } else if (_shape === '4' || _shape === 'G') {
      //Check if shape = 5-doors change text
      if (_shape === 'G' && dataConfig[1][9]?.REGIONM === '行李箱') {
        let dataTemp = dataConfig[1];
        dataTemp[9].REGIONM = '尾門';
        setData(dataTemp);
      }
      return renderCar4doors();
    }
    return null;
  };

  const onPressToggle = () => {
    setRoofStatus(!roofStatus);
    if (roofStatus) {
      let index = array.findIndex(e => e.id == 13);
      let newArray = array;
      const newElement = {
        PNC: data[13].PNC,
        REGION: data[13].REGION,
        REGIONM: data[13].REGIONM,
        ENGNAME: 'excludeRoof',
        PHOTOS: [],
        id: 13,
        position: 13,
        group: [],
      };

      if (index !== -1) {
        newArray[index] = newElement;
        setArray(newArray);
      } else {
        array.push(newElement);
      }
    } else {
      let index = array.findIndex(e => e.id == 13);
      let newArray = array;
      const newElement = {
        PNC: data[14].PNC,
        REGION: data[14].REGION,
        REGIONM: data[14].REGIONM,
        ENGNAME: 'excludeRoof',
        PHOTOS: [],
        id: 13,
        position: 13,
        group: [],
      };

      if (index !== -1) {
        newArray[index] = newElement;
        setArray(newArray);
      } else {
        array.push(newElement);
      }
    }
    autoSave(array);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        iconBack
        onPressBack={() => onPressGoBack()}
        iconHome
        onPressHome={() => onPressGoHome()}
        title={caseData.current?.licensePlate.toLocaleUpperCase()}
      />
      <View style={styles.viewBody}>
        <Text style={styles.textSelectDamagedPart}>
          {_damaged_part_pls_select_damaged_part}
        </Text>
        {renderMain()}
        <View style={styles.viewButton}>
          <View style={styles.bodyPaintBoxBtn}>
            <TouchableOpacity
              disabled={false}
              onPress={() => toggleBodyPaint()}
              style={[styles.viewCheckBoxFullBodyPaint]}>
              <View
                style={[
                  styles.viewCheckBoxFormItem,
                  {
                    backgroundColor: !selectedBodyPaint
                      ? colors.white
                      : colors.primary,
                    borderColor: !selectedBodyPaint
                      ? colors.borderBackground
                      : colors.primary,
                  },
                ]}>
                {selectedBodyPaint && (
                  <View style={styles.viewImageSelectItem}>
                    <Image
                      resizeMode="contain"
                      source={icons.tick_icon}
                      style={styles.imageSelectItem}
                    />
                  </View>
                )}
              </View>
              <Text style={[styles.textSelectFullBodyPaint]}>
                {_damaged_part_full_body_paint}
              </Text>
            </TouchableOpacity>
            <Toggle
              titleEnable={_damaged_part_exclude_roof}
              titleDisable={_damaged_part_including_roof}
              status={roofStatus}
              onPressToggle={onPressToggle}
              style={{ marginLeft: 60, marginTop: 20 }}
              viewSwitchStyle={styles.viewSwitch}
              viewInSwitchStyle={styles.viewInSwitch}
              titleStyle={styles.titleViewSwitch}
            // disabled={!selectedBodyPaint}
            />
          </View>

          <Button
            onPress={async () => onPressNext()}
            title={_damaged_part_next}
            style={{ backgroundColor: colors.primary }}
          />
        </View>
      </View>
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default DamagePart;
