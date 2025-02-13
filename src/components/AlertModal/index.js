import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Divider from '../Divider';
import styles from './styles';

// ActionButton List [{ title: '', onPress: () {} }]
const AlertModal = (props) => {
    const { visible, title, message, actionButton, onClose, type } = props;

    let viewBg = {};
    let titleColor = {};
    let customStyle = {};

    if (type == 'white') {
        viewBg = { backgroundColor: '#FFF' }
        titleColor = { color: '#000' };
        customStyle = { backgroundColor: 'rgba(60, 60, 60, 0.25)' }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, viewBg]}>
                    {title && <Text style={[styles.modalTitle, titleColor]}>{title}</Text>}
                    {message && <Text style={styles.modalMessage}>{message}</Text>}
                    <Divider customStyle={customStyle} />
                    {actionButton.map((element, index, array) => {
                        return (
                            <Button
                                title={element.title}
                                onPress={element.onPress}
                                hasDivider={index < array.length - 1}
                                dividerStyle={customStyle}
                            />
                        )
                    })}
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

export default AlertModal;