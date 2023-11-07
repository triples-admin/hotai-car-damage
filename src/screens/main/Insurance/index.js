import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    TextInput,
    Button
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Picker from '@wowmaking/react-native-ios-scroll-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

import { routes } from '../../../navigation/routes';
import { colors } from '../../../theme';
import Header from '../../../components/Header';
import caseListPageStorage from '../../../api/storage/caseListPage';

import i18n from '../../../utils/i18n';
const ar_cancel = i18n.t('ar_cancel');
const _main_procedure_done = i18n.t('main_procedure_done');
const _damaged_part_next = i18n.t('damaged_part_next');
const _insurance_comapny = i18n.t('case_list_page_insurance_company');
const assessment_case_number = i18n.t('assessment_case_number');

const screenSize = Dimensions.get('window');

const Insurance = () => {

    const route = useRoute();
    const navigation = useNavigation();
    const [modalPicker, setModalPicker] = useState(false);
    const [modalValue, setModalValue] = useState('null');
    const [dataModal, setDataModal] = useState([]);
    const [caseNumber, setCaseNumber] = useState('');

    const authen = route?.params?.authen;
    const caseData = route?.params?.caseData ?? null;
    const dataConfig = route?.params?.dataConfig ?? null;
    const insuranceList = dataConfig?.[12] ?? [];
    let selectValue = '';
    if (modalValue != null) {
        let index = dataModal.findIndex(element => element.value == modalValue);
        if (index != -1) {
            selectValue = dataModal[index].label;
        }
    }

    const title = caseData?.licensePlate?.toLocaleUpperCase();

    useEffect(() => {
        let list = insuranceList.map(element => ({ label: element['INSURNM'], value: element['INSURCD'] }));
        list = list?.filter(element =>
            element.label != '航聯' &&
            element.label != '國華' &&
            element.label != '環球' &&
            element.label != '宏泰' &&
            element.label != '聯邦' &&
            element.label != '新安東京' &&
            element.label != '商聯' &&
            element.label != '華山' &&
            element.label != ''
        )
        list = [{ label: '請選擇保險公司', value: 'null' }, ...list];
        setDataModal(list);

        if (caseData?.assessment?.caseNumber != '') {
            setCaseNumber(caseData?.assessment?.caseNumber);
        }

        let value = caseData?.assessment?.insuranceCompany?.value;
        if (value != '' && value != null) {
            setModalValue(value);
        }
    }, []);

    const onPressGoHome = () => {
        navigation.reset({
            routes: [{ name: routes.HOMESCREEN }],
        });
    };

    const onPressMethod = item => {
        setModalPicker(true);
    };

    const handelPickerChange = value => {
        setModalValue(value);
    };

    const onPressNext = async () => {
        caseData.isInsurance = false;
        if (caseNumber != '' && modalValue != 'null') {
            // 記錄 AsyncStorage
            const caseList = await caseListPageStorage.get();
            caseList.forEach(element => {
                if (element.id == caseData.id) {
                    element.assessment.caseNumber = caseNumber;
                    element.assessment.insuranceCompany = {
                        label: selectValue,
                        value: modalValue,
                    };
                    element.isInsurance = false
                }
            });
            caseListPageStorage.set(caseList);

            // 跳轉至 車損照片
            let onlyFullBodyPaint = false;
            if (caseData?.damagedPart.length == 1 && caseData?.damagedPart[0]?.id == 13) {
                onlyFullBodyPaint = true;
            }

            caseData.assessment.caseNumber = caseNumber;
            caseData.assessment.insuranceCompany = {
                label: selectValue,
                value: modalValue,
            };

            // COMPONENTSPROCEDURESCREEN

            // ASSESSMENTPROCEDURESCREEN

            // MAINPROCEDURESCREEN

            navigation.navigate(routes.DAMAGEPARTSCREEN, {
                caseData: caseData,
                dataConfig: dataConfig,
                fromHome: true,
                authen: authen,
                onlyFullBodyPaint: onlyFullBodyPaint,
            });
        } else {
            const caseList = await caseListPageStorage.get();
            caseList.forEach(element => {
                if (element.id == caseData.id) {
                    element.isInsurance = false
                }
            });
            caseListPageStorage.set(caseList);
            // 跳轉至 應備文件
            navigation.navigate(routes.DRIVING_LICENSE, {
                caseData: caseData,
                dataConfig: dataConfig,
                authen: authen,
            });
        }
    }

    const renderModalPicker = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPicker}
                onRequestClose={() => { }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalPicker(false)}></TouchableOpacity>
                        <View style={styles.modalView}>
                            <View style={styles.modalViewContent}>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={styles.modalTitleText}>
                                        {_insurance_comapny}
                                    </Text>
                                </View>
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

    return (
        <SafeAreaView>
            <Header
                iconHome
                onPressHome={() => onPressGoHome()}
                title={title}
            />
            <View style={{ height: '90%', justifyContent: 'space-around' }}>
                <View>
                    <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24 }}>{_insurance_comapny}</Text>
                        <TouchableOpacity
                            style={{
                                width: 350,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                minHeight: 50,
                                padding: 10,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: colors.darkGray,
                                backgroundColor: colors.white,
                            }}
                            onPress={() => onPressMethod('item')}
                        >
                            <Text style={{ flex: 1, fontSize: 24, color: colors.blackGray }}>
                                {selectValue}
                            </Text>
                            <Image
                                style={{ width: 16, height: 16 }}
                                source={require('../../../assets/icons/ic_dropdown.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 50, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24 }}>{assessment_case_number}</Text>
                        <TextInput
                            style={{
                                width: 350,
                                backgroundColor: colors.white,
                                borderWidth: 1,
                                borderColor: colors.borderBackground,
                                paddingHorizontal: 10,
                                fontSize: 24,
                                marginLeft: 10,
                                color: colors.colorTextInput,
                                borderRadius: 8,
                                paddingVertical: 12,
                            }}
                            value={caseNumber}
                            onChangeText={setCaseNumber}
                        />
                    </View>
                    <View style={{ marginTop: 40, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, color: '#F00', paddingTop: 10 }}>*</Text>
                        <Text style={{ fontSize: 18 }}> 送出後，只能至最後估價單頁面修改</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => onPressNext()}
                        style={styles.buttonNew}
                    >
                        <View style={styles.viewTextNew}>
                            <Text style={styles.textNew}>{_damaged_part_next}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {renderModalPicker()}
        </SafeAreaView >
    )
}

export default Insurance;


const styles = StyleSheet.create({
    modalView: {
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
    },
    modalViewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10
    },
    modalButtonText: {
        fontSize: 18,
        color: colors.royalBlue
    },
    modalTitleText: {
        fontSize: 24,
        color: colors.black,
    },
    textNew: {
        fontSize: 20,
        color: colors.lightBlue,
        fontWeight: 'bold'
    },
    viewTextNew: {
        paddingLeft: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonNew: {
        height: 60,
        width: 450,
        backgroundColor: colors.primary,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        borderColor: colors.lightBlue,
        borderWidth: 2
    },
});