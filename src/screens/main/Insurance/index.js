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
    const [modalValue, setModalValue] = useState(null);
    const [dataModal, setDataModal] = useState([]);
    const [caseNumber, setCaseNumber] = useState('');

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
    console.log('route: ', caseNumber);

    useEffect(() => {
        const list = insuranceList.map(element => ({ label: element['INSURNM'], value: element['INSURCD'] }));
        setDataModal(list);
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

    const onPressModalDone = () => {
        setModalPicker(false);
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
                                {/* <TouchableOpacity onPress={() => setModalPicker(false)}>
                                    <Text style={styles.modalButtonText}>
                                        {ar_cancel}
                                    </Text>
                                </TouchableOpacity> */}
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
                                {/* <TouchableOpacity onPress={() => onPressModalDone()}>
                                    <Text style={styles.modalButtonText}>
                                        {_main_procedure_done}
                                    </Text>
                                </TouchableOpacity> */}
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
                        // onPress={() => onPressNewCase()}
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