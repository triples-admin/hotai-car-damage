import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import styles from './styles';
import { colors } from '../../theme';

const Switch = ({title, style}) => {
  const [isOn, setOn] = useState(false);
  const animatedValue = useRef(new Animated.Value(2)).current;
  const animatedValuee = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 200,
            duration: 1000,
            useNativeDriver: false
        }).start();

    }, [animatedValue])
    

  return (
    <View>
      <View style={{...styles.container, ...style}}>
        <TouchableOpacity onPress={(() => setOn(!isOn))} style={[styles.viewSwitch, {
            backgroundColor: isOn ? colors.white : colors.primary,
            alignItems: isOn ? 'flex-end' : 'flex-start',
            //m: isOn ? animatedValue : animatedValuee,
        }]}>
          <View style={[styles.viewInSwitch, {backgroundColor: isOn ? colors.backgroundStatusBar : colors.white}]} />
        </TouchableOpacity>
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

export default Switch;
