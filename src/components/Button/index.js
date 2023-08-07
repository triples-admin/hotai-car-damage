import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import { colors } from '../../theme';

const Button = ({onPress, title, disable, style, textStyle}) => {
  return (
    <TouchableOpacity disabled={disable} onPress={onPress} style={{...styles.button, ...style}}>
      <View style={styles.viewText}>
        <Text style={{...styles.text, ...textStyle}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
