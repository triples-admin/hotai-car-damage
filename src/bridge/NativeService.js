import { NativeModules, NativeEventEmitter } from 'react-native';

const { NativeService } = NativeModules;
const EventEmitter = new NativeEventEmitter(NativeService);

export {
    NativeService,
    EventEmitter
}
