//
//  SystemInfoManager.h
//  HotaiAppPortalUniversalSDK
//
//  Created by weiwu on 2018/1/30.
//  Copyright © 2018年 weiwu. All rights reserved.
//

#import <Foundation/Foundation.h>

#define kSystemInfoManager    [SystemInfoManager defaultManager]

@interface SystemInfoManager : NSObject

@property (nonatomic, assign) BOOL isInternetConnected;

+ (SystemInfoManager *)defaultManager;

- (NSString *)getCurrentSSID;

- (NSString *)getCurrentIpAddress;

- (NSString *)getAppVersion;

- (NSString *)getAppBuildNumber;

- (NSString *)getAppName;

- (NSString *)getBundleId;

- (NSString *)getUrlSchema;

- (NSString *)getSystemName;

- (NSString *)getSystemVersion;

- (NSString *)getVendorUUID;

- (NSString *)getMACAddress;

- (NSString *)getModelId;

- (NSString *)getAdId;


@end
