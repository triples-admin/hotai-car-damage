import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../theme';
import styles from './styles';
import {icons} from '../../assets';

const Input = ({
  title,
  placeholder,
  autoFocus,
  issecure,
  value,
  onChangeText,
  style,
  inputStyle,
}) => {
  const [isCheck, setCheck] = useState(true);
  return (
    <View style={{...styles.container, ...style}}>
      <View style={styles.viewTextInput}>
        <Text style={styles.textTitle}>{title}</Text>
        <TextInput
          placeholder={placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor={colors.backgroundStatusBar}
          autoFocus={autoFocus}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={issecure ? isCheck : false}
          style={{...styles.textInput, ...{width: issecure ? '75%' : '85%'}, ...inputStyle}}
        />
        {issecure && (
          <Pressable
            onPress={() => setCheck(!isCheck)}
            style={styles.buttonSecure}>
            <Image
              source={isCheck ? icons.closeeye_icon : icons.openeye_icon}
              style={styles.imageSecure}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Input;
