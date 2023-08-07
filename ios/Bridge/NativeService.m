
#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(NativeService, RCTEventEmitter)

// callback
RCT_EXTERN_METHOD(helloNative: (RCTResponseSenderBlock *) callback)

// promise: async/await
RCT_EXTERN_METHOD(helloNative1: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

//---------------------------------------------------------------------
// SDK login
// Login: async/await
RCT_EXTERN_METHOD(checkLoginStatus: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Login: async/await
RCT_EXTERN_METHOD(login: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Logout: async/await
RCT_EXTERN_METHOD(logout: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Logout: async/await
RCT_EXTERN_METHOD(getUserInfo: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

//---------------------------------------------------------------------
// MeasureArea
RCT_EXTERN_METHOD(startMeasure:(NSString *)licensePlate damagedName:(NSString *)damagedName isFullPaint:(BOOL)isFullPaint resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopMeasure: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

//---------------------------------------------------------------------
// Vision Scan
RCT_EXTERN_METHOD(startScanPlateNumber: (NSString *)prefix suffix:(NSString *)suffix resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopVisionScan: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end

