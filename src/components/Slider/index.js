import React, {useState} from 'react';
import {View, PanResponder, StyleSheet} from 'react-native';

const VerticalSlider = ({
  height = 200,
  width = 10,
  thumbSize = 20,
  color,
  thumbColor,
  style,
  value,
  setValue,
}) => {
  const [offset, setOffset] = useState(0);

  const handlePanResponderGrant = (_, gestureState) => {
    setOffset(value - gestureState.moveY);
  };

  const handlePanResponderMove = (_, gestureState) => {
    const newValue = Math.min(
      Math.max(gestureState.moveY + offset, 0),
      height - 10,
    );
    setValue(newValue);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
  });

  return (
    <View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: color,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: '#DDDDDD',
        },
        style,
      ]}
      {...panResponder.panHandlers}>
      <View
        style={[
          {
            width: thumbSize,
            height: thumbSize,
            backgroundColor: thumbColor || '#2196F3',
            borderRadius: thumbSize / 2,
            borderWidth: 1,
            borderColor: '#DDDDDD',
            position: 'absolute',
            top: 0,
            left: -thumbSize / 2 / 2,
          },
          {
            transform: [{translateY: value - 1}],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default VerticalSlider;
