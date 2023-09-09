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
        width: 350,
        alignItems: 'center',
        backgroundColor: '#4C4D4E',
        paddingTop: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        color: '#FFFFFF',
    },
    modalMessage: {
        fontSize: 14,
        marginBottom: 20,
        color: '#FFFFFF',
        textAlign: 'center'
    },
    buttonView: {
        width: 174,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        lineHeight: 22,
        fontSize: 18,
        color: '#007AFF',
    }
});