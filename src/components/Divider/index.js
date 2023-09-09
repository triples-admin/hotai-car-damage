

import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = (props) => {
    const { customStyle } = props;
    return <View style={[styles.divider, customStyle]} />;
};

const styles = StyleSheet.create({
    divider: {
        marginVertical: 5,
        width: 350,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default Divider;