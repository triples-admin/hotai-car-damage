import {StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import React from 'react';
import styles from './styles';
import {icons} from '../../assets';
import {colors} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {routes} from '../../navigation/routes';

const LoadingView = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.secondary} />
    </View>
  );
};

export default LoadingView;

