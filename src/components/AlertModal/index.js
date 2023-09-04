import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Divider from '../Divider';
import styles from './styles';

// ActionButton List [{ title: '', onPress: () {} }]
const AlertModal = (props) => {
    const { visible, title, message, actionButton, onClose } = props;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {title && <Text style={styles.modalTitle}>{title}</Text>}
                    {message && <Text style={styles.modalMessage}>{message}</Text>}
                    <Divider />
                    {actionButton.map((element, index, array) => {
                        return (
                            <Button
                                title={element.title}
                                onPress={element.onPress}
                                hasDivider={index < array.length - 1}
                            />
                        )
                    })}
                </View>
            </View>
        </Modal>
    );
};

const Button = (props) => {
    const { title, onPress, hasDivider } = props;

    return (
        <>
            <TouchableOpacity style={styles.buttonView} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
            {hasDivider && <Divider />}
        </>
    );
}

export default AlertModal;