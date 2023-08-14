import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles';
import { colors } from '../../theme';

const Toggle = ({
  titleEnable,
  titleDisable,
  style,
  status = false,
  onPressToggle,
  viewSwitchStyle,
  viewInSwitchStyle,
  titleStyle,
  disabled = false,
}) => {
  const [isOn, setOn] = useState(status);
  const animatedValue = useRef(new Animated.Value(2)).current;
  const animatedValuee = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    setOn(status);
  }, [status]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 200,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  return (
    <View>
      <View style={{ ...styles.container, ...style }}>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            onPressToggle(!isOn);
          }}
          style={[
            styles.viewSwitch,
            { backgroundColor: isOn ? colors.primary : colors.lightBlue },
            viewSwitchStyle,
          ]}>
          {!isOn && (
            <Text style={[styles.textTitleEnable, titleStyle]}>
              {titleEnable}
            </Text>
          )}
          <View
            style={[
              styles.viewInSwitch,
              { backgroundColor: colors.white },
              isOn ? { marginRight: 8 } : { marginLeft: 8 },
              viewInSwitchStyle,
            ]}
          />
          {isOn && (
            <Text style={[styles.textTitleDisable, titleStyle]}>
              {titleDisable}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Toggle;
