import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(5, 5, 5, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        width: 350,
        alignItems: 'center',
        backgroundColor: '#4C4D4E',
        paddingTop: 20,
    },
    modalTitle: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 20,
        color: '#FFFFFF',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        color: '#FFFFFF',
    },
    buttonView: {
        width: 300,
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        lineHeight: 22,
        fontSize: 18,
        color: '#007AFF',
    }
});