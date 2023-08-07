import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../theme';

const screenSize = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenSize.width,
    height: screenSize.height,
    backgroundColor: '#00000022',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 99,
  },
  
});
