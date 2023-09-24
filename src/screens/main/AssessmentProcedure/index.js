import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  Modal,
  Dimensions,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Header from '../../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../../components/Button';
import { colors } from '../../../theme';
import styles from './styles';
import { icons, images } from '../../../assets';
import { routes } from '../../../navigation/routes';
import Picker from '@wowmaking/react-native-ios-scroll-picker';
const screenSize = Dimensions.get('window');
import caseListPageStorage from '../../../api/storage/caseListPage';
import procedureAPI from '../../../api/axios/procedure';
import i18n from '../../../utils/i18n';
import LoadingView from '../../../components/Loading';
import { formatCurrency } from '../../../utils/utils';
import TopScreen from '../../../components/TopScreen';
import AlertRowModal from '../../../components/AlertRowModal';

import RNFetchBlob from 'rn-fetch-blob';
import { configGlobal } from '../../../api/endpoint';
import _ from 'lodash';
const screen = Dimensions.get('window');
const _width = screen.width;
const _height = screen.height;
// multiple language
const ar_special_coating = i18n.t('ar_special_coating');
const ar_paint_film = i18n.t('ar_paint_film');
const ar_save = i18n.t('ar_save');
const ar_upload = i18n.t('ar_upload');
const ar_upload_echo = i18n.t('ar_upload_echo');
const ar_total = i18n.t('ar_total');
const ar_cancel = i18n.t('ar_cancel');
const ar_delete = i18n.t('ar_delete');
const ar_confirm = i18n.t('ar_confirm');
const ar_ok = i18n.t('ar_ok');
const ar_api_message_error = i18n.t('ar_api_message_error');

const _document = i18n.t('main_procedure_document');
const _damage_photos = i18n.t('main_procedure_damage_photos');
const _assessment = i18n.t('main_procedure_assessment');

const assessment_title = i18n.t('assessment_title');
const assessment_insurance_comapny = i18n.t('assessment_insurance_comapny');
const assessment_case_number = i18n.t('assessment_case_number');
const assessment_insurance = i18n.t('assessment_insurance');
const assessment_self_pay = i18n.t('assessment_self_pay');
const assessment_content = i18n.t('assessment_content');
const assessment_note = i18n.t('assessment_note');
const assessment_qty = i18n.t('assessment_qty');
const assessment_price = i18n.t('assessment_price');
const assessment_labour = i18n.t('assessment_labour');
const assessment_parts = i18n.t('assessment_parts');
const assessment_waste = i18n.t('assessment_waste');
const assessment_wages = i18n.t('assessment_wages');
const _assessment_procedure_title_selfpay = i18n.t(
  'assessment_procedure_title_selfpay',
);
const _assessment_procedure_content_selfpay = i18n.t(
  'assessment_procedure_content_selfpay',
);
const _assessment_procedure_title_insurance = i18n.t(
  'assessment_procedure_title_insurance',
);
const _assessment_procedure_content_insurance = i18n.t(
  'assessment_procedure_content_insurance',
);
const _assessment_procedure_sucessfully = i18n.t(
  'assessment_procedure_sucessfully',
);
const _assessment_procedure_assessment_form_no = i18n.t(
  'assessment_procedure_assessment_form_no',
);
const _assessment_procedure_assessment_done = i18n.t(
  'assessment_procedure_assessment_done',
);
const _assessment_procedure_case_number = i18n.t(
  'assessment_procedure_case_number',
);
const _assessment_procedure_title_delete = i18n.t(
  'assessment_procedure_title_delete',
);
const _assessment_procedure_content_delete = i18n.t(
  'assessment_procedure_content_delete',
);
const _assessment_procedure_title_insurance_echo = i18n.t(
  'assessment_procedure_title_insurance_echo',
);
const _assessment_procedure_content_insurance_echo = i18n.t(
  'assessment_procedure_content_insurance_echo',
);
const assessment_procedure_contact = i18n.t('assessment_procedure_contact');
const assessment_procedure_contact_number = i18n.t(
  'assessment_procedure_contact_number',
);

//------------------------------------------------------------------------

const AssessmentProcedure = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dataConfig = route?.params?.dataConfig ?? null;
  const authen = route?.params?.authen;
  const onlyFullBodyPaint = route?.params?.onlyFullBodyPaint ?? false;

  // HIDE COMPANY
  // 1.航聯
  // 2.國華
  // 3.環球
  // 4.宏泰
  // 5.聯邦
  // 6.新安東京
  // 7.商聯
  // 8.華山

  const _info = dataConfig[0];
  let insurCom = dataConfig[12];
  let newInsurCom = [];
  insurCom.forEach(element => {
    const temp = element?.INSURNM;
    if (
      temp != '航聯' &&
      temp != '國華' &&
      temp != '環球' &&
      temp != '宏泰' &&
      temp != '聯邦' &&
      temp != '新安東京' &&
      temp != '商聯' &&
      temp != '華山'
    ) {
      newInsurCom.push(element);
    }
  });

  const [dataInsuranceCompany, setDataInsuranceCompany] = useState(newInsurCom);
  const [dataMappedInsurance, setDataMappedInsurance] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(dataInsuranceCompany)) {
      let newDataMappedInsurance = dataInsuranceCompany.map(item => {
        return {
          value: item.INSURCD,
          label: item.INSURNM,
        };
      });
      const checkSelfPay = newDataMappedInsurance.find(
        item => item.label == '自費',
      );
      if (checkSelfPay === undefined) {
        newDataMappedInsurance = newDataMappedInsurance.concat({
          value: 'A',
          label: '自費',
        });
      }
      setDataMappedInsurance(newDataMappedInsurance);
    }
  }, [dataInsuranceCompany]);

  const [disableUpload, setDisableUpload] = useState(true);
  const [disableUploadEcho, setDisableUploadEcho] = useState(true);
  const [insurance, setInsurance] = useState(false);
  const [selfPay, setSelfPay] = useState(false);

  const [modalPicker, setModalPicker] = useState(false); // show/hide modal
  const [dataModal, setDataModal] = useState([]);
  const [modalValue, setModalValue] = useState('');
  const [modalTitle, setModalTitle] = useState(''); // title modal
  const [caseNumber, setCaseNumber] = useState('');

  let caseData = route?.params?.caseData ?? null;
  const caseListPage = useRef([]);
  const [currentAssessment, setCurrentAssessment] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);

  const [contactName, setContactName] = useState(caseData?.contactName);
  const [contactPhone, setContactPhone] = useState(caseData?.contactPhone);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: ' ',
    message: ' ',
    onPressOK: () => { },
    isShowCancel: true,
  });

  const [price, setPrice] = useState({
    labour: 0,
    parts: 0,
    waste: 0,
    total: 0,
    wages: 0,
  });

  const timeout = useRef();

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
            }
          }
        }
        // console.log('--- caseListPage ' + JSON.stringify(result));
        // console.log('--- currentPart ' + JSON.stringify(currentPart));

        loadDataDefault();
      };
      getCaseList();
      getEstimateData();
    });
  }, [navigation]);

  const loadDataDefault = () => {
    let insur = false;
    let selfP = false;
    let assessmentTemp = bkCase.current?.assessment;

    if (!assessmentTemp?.insuranceCompany?.label
      || assessmentTemp?.insuranceCompany?.label == '') {
      assessmentTemp.insuranceCompany = {
        value: 'A',
        label: '自費',
      };
    }

    if (assessmentTemp?.insuranceCompany?.value) {
      insur = true;
    }
    if (assessmentTemp?.caseNumber) {
      setCaseNumber(assessmentTemp.caseNumber);
    }
    setCurrentAssessment(assessmentTemp);

    showHideButtonUpload(insur, selfP, assessmentTemp);
  };

  const getEstimateData = async (firstLoad = true) => {
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
      LICSNO: bkCase.current?.licensePlate,
      FRAN: _info[0].FRAN, // Q01
    };
    // console.log('------ getEstimateData body: ' + JSON.stringify(_body));
    const result = await procedureAPI.getEstimatePrice(_body, _config);
    if (result && result.status === 200 && result?.data?.length > 0) {
      const resData = result?.data;
      setListData(resData);
      let _labour = 0;
      let _parts = 0;
      let _waste = 0;
      let _total = 0;
      let _wages = 0;

      resData.forEach(element => {
        if (element?.SOURCE === 'W' && element?.BPTYPE === 'B') {
          _wages = _wages + element?.ATXORI;
        } else if (element?.SOURCE === 'W' && element?.BPTYPE === 'P') {
          _labour = _labour + element?.ATXORI;
        } else if (element?.SOURCE === 'P') {
          _parts = _parts + element?.ATXORI;
        } else if (element?.SOURCE === 'X') {
          _waste = _waste + element?.ATXORI;
        }
        _total = _total + element?.ATXORI;
      });
      setPrice({
        wages: _wages,
        labour: _labour,
        parts: _parts,
        waste: _waste,
        total: _total,
      });
    } else {
      if (firstLoad) {
        await reloadContentStorage();
        getEstimateData(false);
      } else {
        apiCallFailed();
      }
    }
    setIsLoading(false);
    // console.log('------ getEstimateData : ' + JSON.stringify(result));
  };

  const createDataForSub = () => {
    let arrBase = bkCase.current?.listBase;
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

  const reloadContentStorage = async () => {
    // save to server
    const _info = dataConfig[0];
    const _info2 = dataConfig[11];
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    let backupPhotos = [];
    let currentCase = caseData;
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
    if (requestMain.length > 1 || (parseInt(requestMain[0].REGION) != 99 && parseInt(requestMain[0].REGION) != 98)) {
      subData.forEach(element => {
        if (element.X_OPNO == "" && element.O_OPNO == "" && element.P_OPNO == "") {
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
    }

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
    // console.log('--- upload maintain refresh - body: ' + JSON.stringify(_body));
    // console.log('--- upload maintain refresh - result : ' + JSON.stringify(result));
    for (let i = 0; i < dataMain.length; i++) {
      dataMain[i].PHOTOS = backupPhotos[i];
    }
  };

  const showHideButtonUpload = (insur, selfP, assessmentTemp = null) => {
    if (insur) {
      if (
        (assessmentTemp !== null && assessmentTemp?.insuranceCompany?.label) ||
        currentAssessment?.insuranceCompany?.label
      ) {
        if (
          assessmentTemp?.insuranceCompany?.label == '自費' ||
          currentAssessment?.insuranceCompany?.label == '自費'
        ) {
          setDisableUploadEcho(false);
          setDisableUpload(true);
        } else {
          setDisableUpload(false);
          setDisableUploadEcho(false);
        }
      } else {
        setDisableUpload(true);
        setDisableUploadEcho(true);
      }
    } else {
      setDisableUpload(true);
      setDisableUploadEcho(true);
    }
  };

  const onPressInsuranceCompany = name => {
    // console.log(name, ' ====================== onPressInsuranceCompany');
    setDataModal(dataMappedInsurance);
    setModalTitle(name);
    setModalValue(dataMappedInsurance[0].value);
    setModalPicker(true);
  };

  const onPressModalDone = () => {
    setModalPicker(false);

    let result = '';
    dataMappedInsurance.forEach(element => {
      if (element.value === modalValue) {
        result = element;
      }
    });
    if (result) {
      console.log('--------- onPressModalDone: ' + JSON.stringify(result));
      currentAssessment.insuranceCompany = result;
      setCurrentAssessment(currentAssessment);
      // console.log('----- insuranceCompany Selected ' + JSON.stringify(result));
      autoSave(caseNumber, true, selfPay);
      showHideButtonUpload(true, selfPay);
    }
  };

  const handelPickerChange = value => {
    setModalValue(value);
    // console.log(value + ' ====================== handelPickerChange');
  };

  const saveToStorage = async () => {
    let updateCase = bkCase.current;
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === bkCase.current?.id) {
        element.progress = 7;

        let newAssessment = currentAssessment;
        newAssessment.caseNumber = caseNumber;
        newAssessment.insurance = insurance;
        newAssessment.self_pay = selfPay;
        // newAssessment.listData = [];
        // newAssessment.labour = 0;
        // newAssessment.parts = 0;
        // newAssessment.waste = 0;
        element.assessment = newAssessment;
        element.contactName = contactName;
        element.contactPhone = contactPhone;
        // console.log('--- element : ' + JSON.stringify(element));

        // console.log('--- contact name: ' + contactName);
        updateCase = element;
      }
    });
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);
    return updateCase;
  };

  const autoSave = async (newCaseNumber, newInsurance, newSelfPay) => {
    const newList = caseListPage.current;
    newList.forEach(element => {
      if (element.id === bkCase.current?.id) {
        element.progress = 7;
        let newAssessment = currentAssessment;
        newAssessment.caseNumber = newCaseNumber;
        newAssessment.insurance = newInsurance;
        newAssessment.self_pay = newSelfPay;

        element.assessment = newAssessment;
        element.contactName = contactName;
        element.contactPhone = contactPhone;

        // console.log('--- contact name: ' + contactName);
      }
    });
    await caseListPageStorage.set(newList);
  };

  const ItemHeaderComponents = ({ title }) => {
    return (
      <View style={styles.viewItemHeaderComponents}>
        <View style={{ flex: 6 }}>
          <Text style={styles.textItemHeaderComponents}>{title}</Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <Text style={styles.textItemHeaderComponents}>
            {assessment_note}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={[styles.textItemHeaderComponents]}>
            {assessment_qty}
          </Text>
        </View>
        <View
          style={{
            flex: 2.5,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <Text style={styles.textItemHeaderComponents}>
            {assessment_price}
          </Text>
        </View>
      </View>
    );
  };

  const ItemBodyComponents = ({ item, index, style }) => {
    return (
      <View>
        <View style={{ ...styles.viewItemBodyComponents, ...style }}>
          <View style={{ flex: 6 }}>
            <Text style={styles.textItemBodyComponents}>{item?.NM}</Text>
          </View>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.textItemBodyComponents}>{item?.SYMBOL}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.textItemBodyComponents,
                {
                  textAlign: 'right',
                },
              ]}>
              {item?.QTY}
            </Text>
          </View>
          <View
            style={{
              flex: 2.5,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text
              style={[
                styles.textItemBodyComponents,
                { color: colors.primary, textAlign: 'right' },
              ]}>
              {formatCurrency(item.ATXORI)}
            </Text>
          </View>
        </View>
      </View>
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

  const onPressUploadImages = () => {
    const title = i18n.t('assessment_procedure_title_insurance', { insurance: currentAssessment?.insuranceCompany?.label ?? '' ?? '' });
    const message = _assessment_procedure_content_selfpay;
    setAlertMessage({
      title: title,
      message: message,
      onPressOK: () => {
        setAlertMessage({
          title: title,
          message: _assessment_procedure_content_insurance,
          onPressOK: () => {
            setIsShowAlert(false);
            getEvanoData('exploration');
          }
        });
      },
    });
    setIsShowAlert(true);
  };

  const onPressUploadEcho = () => {
    // 自費
    if (disableUpload == true) {
      const title = i18n.t('assessment_procedure_title_insurance_echo', { insurance: currentAssessment?.insuranceCompany?.label ?? '' });
      const message = _assessment_procedure_content_insurance_echo;
      setAlertMessage({
        title: title,
        message: message,
        onPressOK: () => {
          setIsShowAlert(false);
          getEvanoData('selfpay');
        },
      });
      setIsShowAlert(true);
    } else {
      const title = i18n.t('assessment_procedure_title_insurance_echo', { insurance: currentAssessment?.insuranceCompany?.label ?? '' ?? '' });
      const message = _assessment_procedure_content_selfpay;
      setAlertMessage({
        title: title,
        message: message,
        onPressOK: () => {
          setAlertMessage({
            title: title,
            message: _assessment_procedure_content_insurance_echo,
            onPressOK: () => {
              setIsShowAlert(false);
              getEvanoData('insurance_echo');
            }
          });
        },
      });
      setIsShowAlert(true);
    }
  };

  const renderAlertModal = () => {
    return (
      <AlertRowModal
        visible={isShowAlert}
        title={alertMessage?.title}
        message={alertMessage?.message}
        onPressCancel={() => setIsShowAlert(false)}
        onPressOK={alertMessage?.onPressOK}
        isShowCancel={alertMessage?.isShowCancel}
      />
    )
  }

  const showAlertSuccess = evano => {
    Alert.alert(
      _assessment_procedure_sucessfully,
      bkCase.current?.licensePlate +
      '\n' +
      _assessment_procedure_assessment_form_no +
      ':' +
      evano,
      [
        {
          text: ar_confirm,
          onPress: () => deleteCaseLocal(),
        },
      ],
    );
  };

  const deleteCaseLocal = async () => {
    // delete local
    let newList = caseListPage.current.filter(
      el => el.id !== bkCase.current?.id,
    );
    // console.log('--- newList : ' + JSON.stringify(newList));
    await caseListPageStorage.set(newList);

    navigation.reset({
      routes: [{ name: routes.HOMESCREEN }],
    });
  };

  const getEvanoData = async buttonType => {
    setIsLoading(true);
    setDisableUploadEcho(true);
    setDisableUpload(true);
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
      LICSNO: bkCase.current?.licensePlate,
      INSUR: insurance ? 'Y' : 'A', // insurence or self-pay
      INSUCD: modalValue, // insurence company
      INSURNO: caseNumber,
      CONTANM: contactName,
      CONTATEL: contactPhone,
    };

    const result = await procedureAPI.getEVANO(_body, _config);
    if (result && result.status === 200 && result?.data?.length > 0) {
      const resData = result?.data;
      const evano = resData[0].EVANO;
      submitCheckUpload(evano, buttonType);
    } else {
      setIsLoading(false);
      showHideButtonUpload(insurance, selfPay);
      apiCallFailed();
    }
    // console.log('------ getEvanoData body : ' + JSON.stringify(_body));
    // console.log('------ getEvanoData : ' + JSON.stringify(result));
  };

  const submitCheckUpload = async (evano, buttonType) => {
    // setIsLoading(true);
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const rics = buttonType === 'exploration' ? 'Y' : 'N'; // upload exploration / upload ECHO
    const _body = {
      DLRCD: authen?.DLRCD,
      BRNHCD: authen?.BRNHCD,
      EVANO: evano,
      RICS: rics,
      USERID: authen?.USERID,
      LICSNO: bkCase.current?.licensePlate,
    };
    const result = await procedureAPI.sendCheckUpload(_body, _config);
    if (result && result.status === 200 && result?.data?.MSG) {
      submitUploadImages(evano);
    } else {
      setIsLoading(false);
      showHideButtonUpload(insurance, selfPay);
      apiCallFailed();
    }
    // console.log('------ submitCheckUpload params : ' + JSON.stringify(_body));
    // console.log('------ submitCheckUpload : ' + JSON.stringify(result));
    // setIsLoading(false);
    // showHideButtonUpload(insurance, selfPay);
    // apiCallFailed();
  };

  const submitUploadImages = async evano => {
    // setIsLoading(true);
    const _config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    const _body = new FormData();
    _body.append('DLRCD', authen?.DLRCD);
    _body.append('BRNHCD', authen?.BRNHCD);
    _body.append('EVANO', evano);
    _body.append('USERID', authen?.USERID);
    _body.append('LICSNO', bkCase.current?.licensePlate);

    let angleExisted = [];

    const damagedPart = bkCase.current.damagedPart;
    const drivingLicense = bkCase.current.drivingLicense;
    const damagedAngle = bkCase.current.damagedAngle;
    // console.log('------ submitUploadImages damagedPart : ' + JSON.stringify(damagedPart));
    // console.log('------ submitUploadImages drivingLicense : ' + JSON.stringify(drivingLicense));
    // console.log('------ submitUploadImages damagedAngle : ' + JSON.stringify(damagedAngle));
    let countLicense = 0;
    for (let i = 0; i < 3; i++) {
      let arrPhoto = [];
      switch (i) {
        case 0:
          arrPhoto = drivingLicense?.photo1;
          break;
        case 1:
          arrPhoto = drivingLicense?.photo2;
          break;
        case 2:
          arrPhoto = drivingLicense?.photo3;
          break;
      }
      await Promise.all(
        arrPhoto.map(async (element, key) => {
          // LICSNO_文件_A_no#.jpg
          // BNC-5900_文件_A_01.jpg
          let count = countLicense + (key + 1);
          const strCount = count < 10 ? '0' + count : count;
          const filename =
            bkCase.current?.licensePlate.trim() +
            '_文件_A_' +
            strCount +
            '.jpg';
          const filePath = await createImagePath(element?.path, filename);
          const _photo = {
            uri: filePath.path,
            type: 'image/jpg',
            name: filename,
            fileSize: filePath.fileSize,
          };
          _body.append('image', _photo);
        }),
      );
      countLicense += arrPhoto.length;
    }
    for (let i = 0; i < damagedPart.length; i++) {
      let plus = 1;
      const part = damagedPart[i];
      const arrPhoto = damagedPart[i].PHOTOS;
      // console.log('------ submitUploadImages arrPhoto : ' + JSON.stringify(arrPhoto));
      for (let k = 0; k < damagedAngle.length; k++) {
        const angle = damagedAngle[k];

        // ------------ check angle existed ------------------
        let isUsed = false;
        let filter = angleExisted.filter(item => item.name === angle.name);
        if (filter && filter.length > 0) {
          isUsed = true;
        }
        // ---------------------------------------------------

        if (
          isUsed === false &&
          angle?.value &&
          _.isArray(part?.group) &&
          part?.group.includes(angle.value)
        ) {
          angleExisted.push(angle);
          const strCount = '01';
          const filename =
            bkCase.current?.licensePlate.trim() +
            '_' +
            part?.REGIONM.trim() +
            '_' +
            part?.REGION.trim() +
            '_' +
            strCount +
            '.jpg';
          const filePath = await createImagePath(angle?.photo.path, filename);
          const _photo = {
            uri: filePath.path,
            type: 'image/jpg',
            name: filename,
            fileSize: filePath.fileSize,
          };
          _body.append('image', _photo);
          plus = 2;
          break;
        }
      }
      await Promise.all(
        arrPhoto.map(async (element, key) => {
          // LICSNO_REGIONM_REGION_no#.jpg
          // BNC-5900_引擎蓋_01_01.jpg
          let count = key + plus;
          const strCount = count < 10 ? '0' + count : count;
          const filename =
            bkCase.current?.licensePlate.trim() +
            '_' +
            part?.REGIONM.trim() +
            '_' +
            part?.REGION.trim() +
            '_' +
            strCount +
            '.jpg';
          const filePath = await createImagePath(element?.path, filename);
          const _photo = {
            uri: filePath.path,
            type: 'image/jpg',
            name: filename,
            fileSize: filePath.fileSize,
          };
          _body.append('image', _photo);
        }),
      );
    }
    // console.log('------ submitUploadImages result : ' + JSON.stringify(_body));
    // setIsLoading(false);

    setTimeout(async () => {
      console.log(
        '------ submitUploadImages arrBody rrr : ' + JSON.stringify(_body),
      );
      const result = await procedureAPI.sendUploadImages(_body, _config);
      if (result && result.status === 200 && result?.data?.MSG) {
        showAlertSuccess(evano);
      } else {
        setIsLoading(false);
        showHideButtonUpload(insurance, selfPay);
        apiCallFailed();
      }
      // console.log('------ submitUploadImages result : ' + JSON.stringify(result));
    }, 2000);
  };

  const createImagePath = async (base64Image, filename) => {
    return new Promise((resolve, reject) => {
      const Base64Code = base64Image.split('data:image/jpeg;base64,'); //base64Image is my image base64 string
      const dirs = RNFetchBlob.fs.dirs;
      const path = dirs.DocumentDir + '/' + filename;
      RNFetchBlob.fs
        .writeFile(path, Base64Code[1], 'base64')
        .then(res => {
          console.log('----- File Size : ', res);
          console.log('----- Path : ', path);
          resolve({ path: path, fileSize: res });
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const onChangeCaseNumber = value => {
    setCaseNumber(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      autoSave(value, insurance, selfPay);
    }, 2000);
  };

  const onChangeContactName = value => {
    setContactName(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      autoSave(caseNumber, insurance, selfPay);
    }, 2000);
  };

  const onChangeContactPhone = value => {
    setContactPhone(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      autoSave(caseNumber, insurance, selfPay);
    }, 2000);
  };

  const renderModalPicker = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPicker}
        onRequestClose={() => { }}>
        <SafeAreaView style={{ flex: 1 }}>
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
                  <Text
                    style={{
                      marginVertical: 5,
                      fontSize: 18,
                      color: colors.royalBlue,
                    }}>
                    {ar_cancel}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingRight: 24,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.black,
                    }}>
                    {modalTitle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => onPressModalDone()}>
                  <Text
                    style={{
                      marginVertical: 5,
                      fontSize: 18,
                      color: colors.royalBlue,
                    }}>
                    {_assessment_procedure_assessment_done}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 50,
                }}>
                <Picker
                  values={dataModal}
                  containerWidth={screenSize.width}
                  defaultValue={modalValue}
                  withTranslateZ={true}
                  withOpacity={true}
                  withScale={true}
                  visibleItems={7}
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
      STEP: 2,
    };
    const result = await procedureAPI.deleteCase(_body, _config);
    setIsLoading(false);
    if (result && result.status === 200) {
      if (onlyFullBodyPaint) {
        navigation.navigate(routes.MAINPROCEDURESCREEN, {
          caseData: newCase,
          dataConfig: dataConfig,
          authen: authen,
          onlyFullBodyPaint: onlyFullBodyPaint
        });
      } else {
        navigation.navigate(routes.COMPONENTSPROCEDURESCREEN, {
          caseData: newCase,
          dataConfig: dataConfig,
          authen: authen,
        });
      }
    } else {
      apiCallFailed();
    }
    // console.log('--- sendDeleteServer body : ' + JSON.stringify(_body));
    // console.log('--- sendDeleteServer result : ' + JSON.stringify(result));
  };

  const onPressGoHome = async () => {
    await saveToStorage();
    navigation.reset({
      routes: [{ name: routes.HOMESCREEN }],
    });
  };

  const onPressGoBack = async () => {
    const newCase = await saveToStorage();
    await sendDeleteServer(newCase);
  };

  const onPressDocument = async () => {
    await saveToStorage();
    navigation.navigate(routes.DRIVING_LICENSE, {
      caseData: caseData,
      dataConfig: dataConfig,
      fromHome: false,
      authen: authen,
      onlyFullBodyPaint: onlyFullBodyPaint
    });
  };
  const onPressPhotos = async () => {
    await saveToStorage();
    if (onlyFullBodyPaint) {
      navigation.navigate(routes.DAMAGEPARTSCREEN, {
        caseData: caseData,
        dataConfig: dataConfig,
        fromHome: false,
        authen: authen,
      });
    } else {
      navigation.navigate(routes.MEASURE_AREA, {
        caseData: caseData,
        dataConfig: dataConfig,
        fromHome: false,
        authen: authen,
      });
    }
  };

  const tel = contactPhone.length >= 10 ? `${contactPhone.substring(0, contactPhone.length - 4)}****` : contactPhone ;
  return (
    <SafeAreaView style={styles.container}>
      <Header
        iconBack
        onPressBack={() => onPressGoBack()}
        iconHome
        onPressHome={() => onPressGoHome()}
        title={bkCase.current?.licensePlate?.toLocaleUpperCase()}
      />
      <View style={styles.viewBody}>
        <TopScreen
          topID={3}
          onPressDocument={onPressDocument}
          onPressPhotos={onPressPhotos}
        />
        <View style={styles.viewButtonDropDown}>
          <View style={{ width: '22%' }}>
            <Text style={styles.textTitle}>{assessment_procedure_contact}</Text>
            <TextInput
              placeholder={assessment_procedure_contact}
              underlineColorAndroid="transparent"
              value={contactName}
              maxLength={200}
              onChangeText={text => onChangeContactName(text)}
              style={[
                styles.buttonDropDown,
                {
                  paddingVertical: 9,
                  fontSize: 16,
                  color: colors.black,
                  backgroundColor: 'white',
                },
              ]}
            />
          </View>
          <View style={{ width: '22%' }}>
            <Text style={styles.textTitle}>
              {assessment_procedure_contact_number}
            </Text>
            <TextInput
              placeholder={assessment_procedure_contact_number}
              underlineColorAndroid="transparent"
              value={tel}
              maxLength={20}
              onChangeText={text => onChangeContactPhone(text)}
              style={[
                styles.buttonDropDown,
                {
                  paddingVertical: 9,
                  fontSize: 16,
                  color: colors.black,
                  backgroundColor: 'white',
                },
              ]}
            />
          </View>

          <View style={{ width: '22%' }}>
            <Text style={styles.textTitle}>
              {assessment_insurance_comapny}
              <Text style={{ color: colors.backgroundLogin }}>*</Text>
            </Text>
            <TouchableOpacity
              disabled={selfPay}
              onPress={() =>
                onPressInsuranceCompany(assessment_insurance_comapny)
              }
              style={[
                styles.buttonDropDown,
                { backgroundColor: selfPay ? colors.backgroundDisable : 'white' },
              ]}>
              <Text style={styles.textDropDown}>
                {currentAssessment?.insuranceCompany?.label ?? ''}
              </Text>
              <Image
                resizeMode="contain"
                source={icons.drop_down_icon}
                style={{ height: 12, width: 12 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: '22%' }}>
            <Text style={styles.textTitle}>{assessment_case_number}</Text>
            <TextInput
              editable={!selfPay}
              placeholder={_assessment_procedure_case_number}
              underlineColorAndroid="transparent"
              value={caseNumber}
              maxLength={20}
              onChangeText={text => onChangeCaseNumber(text)}
              style={[
                styles.buttonDropDown,
                {
                  paddingVertical: 9,
                  fontSize: 16,
                  color: colors.black,
                  backgroundColor: selfPay ? colors.backgroundDisable : 'white',
                },
              ]}
            />
          </View>
        </View>
        <View style={{ paddingVertical: 12, flex: 1 }}>
          <View style={styles.viewTextComponents}>
            <View
              style={{
                backgroundColor: colors.primary,
                flex: 1,
                marginRight: 1,
                flexDirection: 'row',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}>
              <View style={{ flex: 1.2, flexDirection: 'row' }}>
                <Text style={styles.headerTableText}>{assessment_wages}</Text>
                <Text style={[styles.headerTableText, { marginLeft: 5 }]}>
                  {formatCurrency(price.wages)}
                </Text>
              </View>

              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={[styles.headerTableText]}>
                  {assessment_labour}
                </Text>
                <Text style={[styles.headerTableText, { marginLeft: 5 }]}>
                  {formatCurrency(price.labour)}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={[styles.headerTableText]}>{assessment_parts}</Text>
                <Text style={[styles.headerTableText, { marginLeft: 5 }]}>
                  {formatCurrency(price.parts)}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={[styles.headerTableText]}>{assessment_waste}</Text>
                <Text style={[styles.headerTableText, { marginLeft: 5 }]}>
                  {formatCurrency(price.waste)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.primary,
                marginLeft: 1,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                flex: 0.37,
                justifyContent: 'space-between',
              }}>
              <Text style={styles.headerTableText}>{ar_total}</Text>
              <Text style={[styles.headerTableText]}>
                {formatCurrency(price.total)}
              </Text>
            </View>
          </View>
          <ItemHeaderComponents title={assessment_content} />
          <View
            style={{
              marginTop: 5,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 0.5,
              elevation: 5,
              paddingBottom: 65,
            }}>
            <FlatList
              data={listData}
              renderItem={ItemBodyComponents}
              style={{
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
                // maxHeight: (_height - 65) / 2.1,
              }}
              keyExtractor={item => item.id}
              bounces={false}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.white,
          }}></View>
        <View style={styles.viewButtonFooter}>
          <Button
            disable={disableUpload}
            onPress={() => onPressUploadImages()}
            title={ar_upload}
            textStyle={{
              color: disableUpload
                ? colors.white
                : colors.lightBlue
            }}
            style={{
              backgroundColor: disableUpload
                ? colors.backgroundStatusBar
                : colors.primary,
            }}
          />
          <Button
            disable={disableUploadEcho}
            onPress={() => onPressUploadEcho()}
            title={ar_upload_echo}
            textStyle={{
              color: disableUploadEcho
                ? colors.white
                : colors.lightBlue
            }}
            style={{
              backgroundColor: disableUploadEcho
                ? colors.backgroundStatusBar
                : colors.primary,
            }}
          />
        </View>
        {renderModalPicker()}
      </View>
      {isLoading && <LoadingView />}
      {renderAlertModal()}
    </SafeAreaView>
  );
};

export default AssessmentProcedure;
