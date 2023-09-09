import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Divider from '../Divider';
import styles from './styles';

// ActionButton List [{ title: '', onPress: () {} }]
const AlertRowModal = (props) => {
    const { visible, title, message, onPressCancel, onPressOK, type } = props;

    let viewBg = {};
    let titleColor = {};
    let customStyle = { marginVertical: 0 };

    if (type == 'white') {
        viewBg = { backgroundColor: '#FFF' }
        titleColor = { color: '#000' };
        customStyle = { ...customStyle, backgroundColor: 'rgba(60, 60, 60, 0.25)' }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, viewBg]}>
                    {title && <Text style={[styles.modalTitle, titleColor]}>{title}</Text>}
                    {message && <Text style={[styles.modalMessage, titleColor]}>{message}</Text>}
                    <Divider customStyle={customStyle} />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.buttonView} onPress={onPressCancel}>
                            <Text style={styles.buttonText}>{'取消'}</Text>
                        </TouchableOpacity>
                        <Divider customStyle={{ ...customStyle, width: 1, height: 50 }} />
                        <TouchableOpacity style={styles.buttonView} onPress={onPressOK}>
                            <Text style={[styles.buttonText, { color: '#F00' }]}>{'確定'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const Button = (props) => {
    const { title, onPress, hasDivider, dividerStyle } = props;

    return (
        <>
            <TouchableOpacity style={styles.buttonView} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
            {hasDivider && <Divider customStyle={dividerStyle} />}
        </>
    );
}

export default AlertRowModal;