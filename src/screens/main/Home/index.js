import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  Modal,
  Animated,
  Alert,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles';
import { icons } from '../../../assets';
import Header from '../../../components/Header';
import { routes } from '../../../navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { colors } from '../../../theme';
import caseListPageStorage from '../../../api/storage/caseListPage';
import authenStorage from '../../../api/storage/authen';
import caseListPageAPI from '../../../api/axios/caseListPage';
import procedureAPI from '../../../api/axios/procedure';
import { convertFromDate } from '../../../utils/utils';
import i18n from '../../../utils/i18n';
import LoadingView from '../../../components/Loading';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [caseCount, setCaseCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [authen, setAuthen] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // const [sortLicensePlate, setSortLicensePlate] = useState(false);
  // const [sortTime, setSortTime] = useState(false);
  // const [sortProgess, setSortProgess] = useState(false);
  // const [sortInsuranceCompany, setSortInsuranceCompany] = useState(false);
  // const [sortSource, setSortsource] = useState(false);
  // const [sortName, setSortName] = useState(false);
  // const [sortCaseNo, setSortCaseNo] = useState(false);

  const [headerSort, setHeaderSort] = useState({ position: 0, arrow: false });

  const bkCaseList = useRef();
  const [filterd, setFilterd] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);

  const [firstSearch, setFirstSearch] = useState('');
  const [secondSearch, setSecondSearch] = useState('');

  const ar_cancel = i18n.t('ar_cancel');
  const _vehicle_claims = i18n.t('case_list_page_vehicle_claims');
  const _license_plate = i18n.t('case_list_page_license_plate');
  const _time = i18n.t('case_list_page_time');
  const _progress = i18n.t('case_list_page_progress');
  const _insurance_comapny = i18n.t('case_list_page_insurance_company');
  const _source = i18n.t('case_list_page_source');
  const _name = i18n.t('case_list_page_name');
  const _case_no = i18n.t('case_list_page_case_no');
  const _home_new = i18n.t('home_new');
  const _home_adventure_search = i18n.t('home_adventure_search');
  const _home_license_plate = i18n.t('home_license_plate');
  const _home_search = i18n.t('home_search');
  const _home_failed_search = i18n.t('home_failed_search');
  const _home_cancel = i18n.t('home_cancel');
  const _home_ok = i18n.t('home_ok');
  const _home_delete = i18n.t('home_delete');
  const _home_title_delete = i18n.t('home_title_delete');
  const _home_content_delete = i18n.t('home_content_delete');
  const ar_api_message_error = i18n.t('ar_api_message_error');
  const license_plate_permission_camera = i18n.t(
    'license_plate_permission_camera',
  );

  const _title = i18n.t('case_list_page_title');

  useEffect(() => {
    navigation.addListener('focus', () => {
      clearFilter();
      getCaseListFromStorage();
      getAuthenFromStorage();
      // setAuthen({
      //   DLRCD: 'A',
      //   BRNHCD: '01',
      //   USERID: 'AA08199',
      // });
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      checkCamera();
    });
  }, [navigation]);

  const checkCamera = () => {
    check(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            requestCamera();
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            requestCamera();
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            requestCamera();
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            // setIsShowCamera(true);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            openSettingCamera();
            break;
        }
      })
      .catch(error => {
        // …
      });
  };

  const requestCamera = () => {
    request(PERMISSIONS.IOS.CAMERA).then(result => {
      console.log('----- requestCamera: ' + result);
      if (result === 'granted') {
        // setIsShowCamera(true);
      }
    });
  };

  const openSettingCamera = () => {
    Alert.alert('', license_plate_permission_camera, [
      {
        text: ar_cancel,
        onPress: () => {
          console.log('Cancel Pressed');
        },
      },
      {
        text: _home_ok,
        onPress: () => {
          openSettings().catch(() => console.warn('cannot open settings'));
        },
      },
    ]);
  };

  const getCaseListFromStorage = async () => {
    // await caseListPageStorage.remove();
    const result = await caseListPageStorage.get();
    console.log('result', result)
    if (result) {
      let listData = result;
      listData.sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1));
      setCaseCount(listData.length);
      setFilterd(listData);
      bkCaseList.current = listData;

      checkShowDeleteItem(listData);
      // console.log('=== home data === ' + JSON.stringify(listData));
    }
  };

  const getAuthenFromStorage = async () => {
    const result = await authenStorage.get();
    if (result) {
      setAuthen(result);
    }
  };

  const getConfigData = async itemCase => {
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
      LICSNO: itemCase?.licensePlate,
    };
    const result = await caseListPageAPI.getConfig(_body, _config);
    if (result && result?.data?.length > 0) {
      const resData = result.data;
      gotoNextPage(itemCase, resData);
      // console.log('------ getConfigData : ' + JSON.stringify(resData));
    } else {
      apiCallFailed();
    }
    setIsLoading(false);
    //console.log('------ getConfigData : ' + JSON.stringify(result));
  };

  const sendDeleteAll = async arrData => {
    setIsLoading(true);
    for (let i = 0; i < arrData.length; i++) {
      await sendDeleteServer(arrData[i], false);
    }
    setTimeout(() => {
      setIsLoading(false);
      setIsShowDelete(false);
    }, 3000);
  };

  const sendDeleteServer = async (itemCase, loading = true) => {
    // delete server
    if (loading) {
      setIsLoading(true);
    }

    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    // let step = 1;
    // if (itemCase?.progress < 6) {           // Component Page go back
    //   step = 1;
    // } else if (itemCase?.progress === 6) {  // Assessment Page go back
    //   step = 2;
    // } else if (itemCase?.progress === 7) {  // Cancel the Assessment
    //   step = 3;
    // }
    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      USERID: authen?.USERID,
      LICSNO: itemCase?.licensePlate,
      STEP: 3,
    };
    const result = await procedureAPI.deleteCase(_body, _config);
    if (result && result.status === 200) {
    } else {
      apiCallFailed();
    }
    // console.log('--- sendDeleteServer body : ' + JSON.stringify(_body));
    // console.log('--- sendDeleteServer result : ' + JSON.stringify(result));
    if (loading) {
      setIsLoading(false);
    }
  };

  const clearFilter = arrData => {
    setFirstSearch('');
    setSecondSearch('');
  };

  const clearALlSelected = arrData => {
    // clear all selected
    arrData.forEach(element => {
      element.selected = false;
    });
    setSelectedAll(false);
    setIsShowDelete(false);
    return arrData;
  };

  const submitDeleteCase = async itemCase => {
    await sendDeleteServer(itemCase);
    // delete local
    let newList = bkCaseList.current.filter(el => el.id !== itemCase?.id);
    // let newListFilter = filterd.filter(el => el.id !== itemCase?.id);
    // console.log('--- newList : ' + JSON.stringify(newList));
    newList = clearALlSelected(newList);
    await caseListPageStorage.set(newList);
    bkCaseList.current = newList;
    setCaseCount(newList.length);
    setFilterd(newList);
    checkShowDeleteItem(newList);
    clearFilter();
  };

  const submitDeleteItemSelected = async () => {
    let deleteList = [];
    // delete local
    let newList = bkCaseList.current;
    for (let i = newList.length - 1; i >= 0; i--) {
      if (newList[i]?.selected) {
        const temp = { ...newList[i] };
        deleteList.push(temp);
        newList.splice(i, 1);
      }
    }
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    bkCaseList.current = newList;
    setCaseCount(newList.length);
    setFilterd(newList);
    setSelectedAll(false);
    clearFilter();

    // delete server
    // console.log('--- deleteList ' + JSON.stringify(deleteList));
    await sendDeleteAll(deleteList);
  };

  const renderProgress = progress => {
    return (
      <View>
        {progress == 1 ? ( // license plate
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
          </View>
        ) : progress == 2 ? ( // document photo
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
          </View>
        ) : progress == 3 || progress == 4 ? ( // damage part select
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
          </View>
        ) : progress == 5 || progress == 6 ? (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_complete_icon}
                style={styles.imageProgress}
              />
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
            <View style={{ ...styles.viewImageProgress }}>
              <Image
                resizeMode="contain"
                source={icons.progress_completed_icon}
                style={[styles.imageProgress, styles.imageProgressCompleted]}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  //Sort item
  const onPressHeaderSortItem = numberSort => {
    if (numberSort == 1) {
      if (headerSort.arrow === true) {
        setHeaderSort({ position: 1, arrow: false });
        filterd.sort((a, b) => (a.licensePlate > b.licensePlate ? 1 : -1));
      } else {
        setHeaderSort({ position: 1, arrow: true });
        filterd.sort((a, b) => (a.licensePlate < b.licensePlate ? 1 : -1));
      }
    } else if (numberSort == 2) {
      if (headerSort.arrow === true) {
        setHeaderSort({ position: 2, arrow: false });
        filterd.sort((a, b) => (a.createdTime > b.createdTime ? 1 : -1));
      } else {
        setHeaderSort({ position: 2, arrow: true });
        filterd.sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1));
      }
    } else if (numberSort == 3) {
      if (headerSort.arrow === true) {
        setHeaderSort({ position: 3, arrow: false });
        filterd.sort((a, b) => (a.progress > b.progress ? 1 : -1));
      } else {
        setHeaderSort({ position: 3, arrow: true });
        filterd.sort((a, b) => (a.progress < b.progress ? 1 : -1));
      }
    } else if (numberSort == 4) {
      if (headerSort.arrow === true) {
        setHeaderSort({ position: 4, arrow: false });
        filterd.sort((a, b) =>
          a.assessment?.insuranceCompany?.label >
            b.assessment?.insuranceCompany?.label
            ? 1
            : -1,
        );
      } else {
        setHeaderSort({ position: 4, arrow: true });
        filterd.sort((a, b) =>
          a.assessment?.insuranceCompany?.label <
            b.assessment?.insuranceCompany?.label
            ? 1
            : -1,
        );
      }
    } else if (numberSort == 5) {
      if (headerSort.arrow === true) {
        setHeaderSort({ position: 5, arrow: false });
        filterd.sort((a, b) => (a.source > b.source ? 1 : -1));
      } else {
        setHeaderSort({ position: 5, arrow: true });
        filterd.sort((a, b) => (a.source < b.source ? 1 : -1));
      }
    } else if (numberSort == 6) {
      if (headerSort.arrow === true) {
        setHeaderSort({ position: 6, arrow: false });
        filterd.sort((a, b) => (a.name > b.name ? 1 : -1));
      } else {
        setHeaderSort({ position: 6, arrow: true });
        filterd.sort((a, b) => (a.name < b.name ? 1 : -1));
      }
    } else {
      if (headerSort.arrow === true) {
        setHeaderSort({ position: 7, arrow: false });
        filterd.sort((a, b) =>
          a.assessment?.caseNumber > b.assessment?.caseNumber ? 1 : -1,
        );
      } else {
        setHeaderSort({ position: 7, arrow: true });
        filterd.sort((a, b) =>
          a.assessment?.caseNumber < b.assessment?.caseNumber ? 1 : -1,
        );
      }
    }
  };

  const onPressNewCase = async () => {
    navigation.navigate(routes.LICENSEPLATESCREEN, { authen: authen });
  };

  const checkShowDeleteItem = arrData => {
    let result = false;
    arrData.forEach(element => {
      if (element.selected && element.selected === true) {
        result = true;
      }
    });
    setIsShowDelete(result);
    checkShowSelectAll(arrData);
  };

  const onPressSelectedRemove = item => {
    const temp = [...filterd];
    temp.forEach(element => {
      if (element.id === item.id) {
        element.selected = !item?.selected;
      }
    });
    setFilterd(temp);
    checkShowDeleteItem(temp);

    autoSave(temp);
  };

  const _renderItem = item => {
    return (
      <TouchableWithoutFeedback
        style={styles.viewInFormBody}
        onPress={() => onPressItemCase(item)}>
        <View
          style={[styles.viewItemInFormBody, { minHeight: 80, marginTop: 10 }]}>
          <View style={[styles.viewCheckBoxItem, {}]}>
            <TouchableOpacity
              onPress={() => onPressSelectedRemove(item)}
              style={[
                styles.viewCheckBoxFormItem,
                {
                  backgroundColor: !item?.selected
                    ? colors.white
                    : colors.primary,
                },
              ]}>
              {item?.selected && (
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
          <View style={styles.viewItemInForm}>
            <Text style={[styles.textItemInForm, , { color: colors.primary }]}>
              {item?.licensePlate.toUpperCase()}
            </Text>
          </View>
          <View style={styles.viewItemInForm}>
            <Text style={styles.textItemInForm}>
              {convertFromDate(item?.createdTime, 'YYYY/MM/DD')} {convertFromDate(item?.createdTime, 'HH:mm')}
            </Text>
          </View>
          <View
            style={[
              styles.viewItemInForm,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              },
            ]}>
            {renderProgress(item?.progress)}
          </View>
          <View style={styles.viewItemInForm}>
            <Text numberOfLines={1} style={styles.textItemInForm}>
              {item?.assessment?.insuranceCompany?.label}
            </Text>
          </View>
          <View style={styles.viewItemInForm}>
            <Text style={styles.textItemInForm}>{item?.source}</Text>
          </View>
          <View style={styles.viewItemInForm}>
            <Text numberOfLines={1} style={styles.textItemInForm}>
              {item?.name}
            </Text>
          </View>
          {/* <View style={styles.viewItemInForm}>
            <Text numberOfLines={1} style={styles.textItemInForm}>
              {item?.assessment?.caseNumber}
            </Text>
          </View> */}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const _renderHide = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => DeleteButtonAlert(item)}
        style={[styles.buttonDeleteHide, { minHeight: 80, marginTop: 10 }]}>
        <View style={styles.viewImageDeleteHide}>
          <Image
            resizeMode="contain"
            source={icons.trash_icon}
            style={{ height: 35, width: 35 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const checkShowSelectAll = arrData => {
    // console.log('--------- arrData :' + JSON.stringify(arrData));
    if (arrData.length === 0) {
      return;
    }

    let result = true;
    arrData.forEach(element => {
      if (!element.selected || element.selected === false) {
        result = false;
      }
    });
    setSelectedAll(result);
  };

  const onPressSelectedAll = () => {
    if (filterd.length === 0) {
      return;
    }

    setSelectedAll(!selectedAll);
    setIsShowDelete(!selectedAll);

    const temp = filterd;
    temp.forEach(element => {
      element.selected = !selectedAll;
    });
    setFilterd(temp);

    autoSave(temp);
  };

  const autoSave = async listDelete => {
    const newList = bkCaseList.current;
    newList.forEach(element1 => {
      listDelete.forEach(element2 => {
        if (element1.id === element2.id && element2?.selected === true) {
          element1.selected = true;
        }
      });
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
  };

  // Header List
  const renderListHeader = () => {
    return (
      <View style={styles.viewFormBody}>
        <View style={styles.viewCheckBox}>
          <TouchableOpacity
            onPress={() => onPressSelectedAll()}
            style={[
              styles.viewCheckBoxForm,
              { backgroundColor: !selectedAll ? colors.primary : colors.white },
            ]}>
            {selectedAll && (
              <View style={styles.viewImageSelect}>
                <Image
                  resizeMode="contain"
                  source={icons.tick_icon}
                  style={styles.imageSelect}
                />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.viewImageDelete}>
            <Image source={icons.trash_icon} style={styles.imageDelete} />
          </View>
        </View>

        <TouchableOpacity
          style={{ ...styles.viewItemForm }}
          onPress={() => onPressHeaderSortItem(1)}>
          <View style={{ ...styles.viewItemForm }}>
            <Text style={styles.textTitleForm}>{_license_plate}</Text>
            <Image
              resizeMode="contain"
              source={
                headerSort.position === 1 && headerSort.arrow
                  ? icons.arrow_up_icon
                  : icons.arrow_down_icon
              }
              style={styles.imageIconForm}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.viewItemForm }}
          onPress={() => onPressHeaderSortItem(2)}>
          <View style={{ ...styles.viewItemForm }}>
            <Text style={styles.textTitleForm}>{_time}</Text>
            <Image
              resizeMode="contain"
              source={
                headerSort.position === 2 && headerSort.arrow
                  ? icons.arrow_up_icon
                  : icons.arrow_down_icon
              }
              style={styles.imageIconForm}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.viewItemForm }}
          onPress={() => onPressHeaderSortItem(3)}>
          <View style={{ ...styles.viewItemForm }}>
            <Text style={styles.textTitleForm}>{_progress}</Text>
            <Image
              resizeMode="contain"
              source={
                headerSort.position === 3 && headerSort.arrow
                  ? icons.arrow_up_icon
                  : icons.arrow_down_icon
              }
              style={styles.imageIconForm}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.viewItemForm }}
          onPress={() => onPressHeaderSortItem(4)}>
          <View style={{ ...styles.viewItemForm }}>
            <Text style={styles.textTitleForm}>{_insurance_comapny}</Text>
            <Image
              resizeMode="contain"
              source={
                headerSort.position === 4 && headerSort.arrow
                  ? icons.arrow_up_icon
                  : icons.arrow_down_icon
              }
              style={styles.imageIconForm}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.viewItemForm }}
          onPress={() => onPressHeaderSortItem(5)}>
          <View style={{ ...styles.viewItemForm }}>
            <Text style={styles.textTitleForm}>{_source}</Text>
            <Image
              resizeMode="contain"
              source={
                headerSort.position === 5 && headerSort.arrow
                  ? icons.arrow_up_icon
                  : icons.arrow_down_icon
              }
              style={styles.imageIconForm}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.viewItemForm }}
          onPress={() => onPressHeaderSortItem(6)}>
          <View style={{ ...styles.viewItemForm }}>
            <Text style={styles.textTitleForm}>{_name}</Text>
            <Image
              resizeMode="contain"
              source={
                headerSort.position === 6 && headerSort.arrow
                  ? icons.arrow_up_icon
                  : icons.arrow_down_icon
              }
              style={styles.imageIconForm}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  //Body
  const renderBody = () => {
    return (
      <View style={styles.viewBody}>
        <View style={styles.viewSearch}>
          <Text style={styles.textVC}>
            {_vehicle_claims}
            <Text style={styles.textNumberVC}>{' (' + caseCount + ')'}</Text>
          </Text>
          <View style={styles.viewSearchFunc}>
            <TouchableOpacity
              disabled={!isShowDelete}
              onPress={() => DeleteItemSelected()}
              style={[
                styles.buttonDelete,
                { backgroundColor: isShowDelete ? colors.primary : colors.gray },
              ]}>
              <Image
                resizeMode="contain"
                source={icons.trash_icon}
                style={styles.imageDeleteButton}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.viewImageSearch}>
              <Image
                resizeMode="contain"
                source={icons.search_icon}
                style={styles.imageSearch}
              />
            </TouchableOpacity>
          </View>
        </View>

        {renderListHeader()}

        <View style={{ flex: 1 }}>
          <SwipeListView
            stopLeftSwipe={1}
            showsVerticalScrollIndicator={false}
            data={filterd}
            renderItem={({ item, index }) => _renderItem(item)}
            renderHiddenItem={({ item, index }) => (
              <_renderHide item={item} index={index} />
            )}
            rightOpenValue={-76}
          />
        </View>
      </View>
    );
  };

  const searchFilter = async (first, second) => {
    bkCaseList.current.forEach(element => {
      element.selected = false;
    });
    setSelectedAll(false);
    setIsShowDelete(false);

    const text = first.trim() + '-' + second.trim();
    if (text !== '-') {
      const newData = bkCaseList.current.filter(item => {
        const itemData = item.licensePlate
          ? item.licensePlate.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      if (newData.length > 0) {
        setFilterd(newData);
        setShowModal(false);
      } else {
        UndefinedSearch();
      }
    } else {
      // console.log('----- searchFilter : ' + JSON.stringify(bkCaseList.current));
      setFilterd(bkCaseList.current);
      setShowModal(false);
      await caseListPageStorage.set(bkCaseList.current);
    }
  };

  const apiCallFailed = () => {
    Alert.alert('', ar_api_message_error, [
      {
        text: _home_ok,
        onPress: () => {
          console.log('OK Pressed');
        },
      },
    ]);
  };

  const DeleteItemSelected = () => {
    Alert.alert(_home_title_delete, _home_content_delete, [
      {
        text: _home_cancel,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: _home_delete,
        onPress: () => {
          console.log('OK Pressed');
          submitDeleteItemSelected();
        },
        style: 'destructive',
      },
    ]);
  };

  //Footer
  const renderFooter = () => {
    return (
      <View style={styles.viewFooter}>
        <View style={{ marginHorizontal: 16 }}>
          <TouchableOpacity
            onPress={() => onPressNewCase()}
            style={styles.buttonNew}>
            <Image
              resizeMode="contain"
              source={icons.plus_icon}
              style={styles.imageNew}
            />
            <View style={styles.viewTextNew}>
              <Text style={styles.textNew}>{_home_new}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const DeleteButtonAlert = item => {
    // console.log(item.licensePlate);
    // console.log('License Plate Delete Button ==========>>>>>>>>>>>>>>>>');
    Alert.alert(_home_title_delete, _home_content_delete, [
      {
        text: _home_cancel,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: _home_delete,
        onPress: () => {
          console.log('OK Pressed');
          submitDeleteCase(item);
        },
        style: 'destructive'
      },
    ]);
  };

  const UndefinedSearch = () => {
    Alert.alert('', _home_failed_search, [
      {
        text: _home_ok,
        onPress: () => {
          setShowModal(false)
        },
      },
    ]);
  };

  const gotoNextPage = (itemData, dataConfig) => {
    let onlyFullBodyPaint = false;
    if (itemData?.damagedPart.length == 1 && itemData?.damagedPart[0]?.id == 13) {
      onlyFullBodyPaint = true;
    }
    if (itemData.progress == 1) {
      navigation.navigate(routes.LICENSEPLATESCREEN, {
        caseData: itemData,
        dataConfig: dataConfig,
        fromHome: true,
        authen: authen,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    } else if (itemData.progress == 2 ) {
      if (itemData.isInsurance == true) {
        navigation.navigate(routes.INSURANCE, {
          caseData: itemData,
          dataConfig: dataConfig,
          authen: authen,
        });
      } else {
        navigation.navigate(routes.DRIVING_LICENSE, {
          caseData: itemData,
          dataConfig: dataConfig,
          fromHome: true,
          authen: authen,
          onlyFullBodyPaint: onlyFullBodyPaint,
        });
      }
    } else if (itemData.progress == 3) {
      console.log('jzjz+aaa', dataConfig);
      navigation.navigate(routes.DAMAGEPARTSCREEN, {
        caseData: itemData,
        dataConfig: dataConfig,
        fromHome: true,
        authen: authen,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    } else if (itemData.progress == 4) {
      navigation.navigate(routes.MEASURE_AREA, {
        caseData: itemData,
        dataConfig: dataConfig,
        fromHome: true,
        authen: authen,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    } else if (itemData.progress == 5) {
      navigation.navigate(routes.MAINPROCEDURESCREEN, {
        caseData: itemData,
        dataConfig: dataConfig,
        fromHome: true,
        authen: authen,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    } else if (itemData.progress == 6) {
      if (onlyFullBodyPaint) {
        navigation.navigate(routes.MAINPROCEDURESCREEN, {
          caseData: itemData,
          dataConfig: dataConfig,
          fromHome: true,
          authen: authen,
          onlyFullBodyPaint: onlyFullBodyPaint,
        });
      } else {
        navigation.navigate(routes.COMPONENTSPROCEDURESCREEN, {
          caseData: itemData,
          dataConfig: dataConfig,
          fromHome: true,
          authen: authen,
          onlyFullBodyPaint: onlyFullBodyPaint,
        });
      }
    } else if (itemData.progress == 7) {
      navigation.navigate(routes.ASSESSMENTPROCEDURESCREEN, {
        caseData: itemData,
        dataConfig: dataConfig,
        fromHome: true,
        authen: authen,
        onlyFullBodyPaint: onlyFullBodyPaint,
      });
    }
  };

  const onPressItemCase = itemData => {
    getConfigData(itemData);
  };

  const renderModalFilter = () => {
    return (
      <Modal
        statusBarTranslucent
        transparent
        visible={showModal}
        animationType="fade"
        nRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? undefined : 'padding'}
          enabled
          style={styles.viewPopupContainer}>
          <Animated.View style={styles.viewPopup}>
            <View style={{}}>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.buttonClose}>
                  <Image
                    source={icons.close_icon}
                    style={styles.imageCloseButton}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ paddingBottom: 32 }}>
                <Text style={styles.textTitlePopup}>
                  {_home_adventure_search}
                </Text>
              </View>
              <View>
                <Text style={styles.textLicensePlatePopup}>
                  {_home_license_plate}
                </Text>
                <View style={styles.viewTextInputPopup}>
                  <TextInput
                    placeholder="BKR"
                    placeholderTextColor={colors.darkGray}
                    onChangeText={text => setFirstSearch(text)}
                    value={firstSearch}
                    style={styles.textInputPopup}
                  />
                  <View style={styles.lineWidthPopup} />
                  <TextInput
                    placeholder="7665"
                    placeholderTextColor={colors.darkGray}
                    onChangeText={text => setSecondSearch(text)}
                    value={secondSearch}
                    style={styles.textInputPopup}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => searchFilter(firstSearch, secondSearch)}
                  style={styles.buttonSearchPopup}>
                  <View style={styles.viewImageSearchPopup}>
                    <Image
                      resizeMode="contain"
                      source={icons.search_icon}
                      style={styles.imageSearchPopup}
                    />
                  </View>
                  <View style={styles.viewTextSearchPopup}>
                    <Text style={styles.textSearchPopup}>{_home_search}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const onPressReloadHome = () => {
    clearFilter();
    searchFilter('', '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        // onPressReloadHome={onPressReloadHome} 
        title={_title} logout titleStyle={{ color: colors.lightBlue }} />
      {renderBody()}
      {renderFooter()}
      {renderModalFilter()}
      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
};

export default HomeScreen;
