//
//  KeyChainManager.h
//  HotaiAppPortalUniversalSDK
//
//  Created by weiwu on 2018/2/1.
//  Copyright © 2018年 weiwu. All rights reserved.
//

#import <Foundation/Foundation.h>

#define kKeychainManager    [HotaiAppPortalKeychainManager defaultManager]

#define kAppIDsPrefix        @"BRAT5675T3"

#define kServerName          @"com.hotai.portal.sdk.profile"

#define kKeyChainGroupName   [NSString stringWithFormat:@"%@.%@", kAppIDsPrefix, kServerName]

@interface HotaiAppPortalKeychainManager : NSObject

+ (HotaiAppPortalKeychainManager *)defaultManager;

- (NSString *)getValueByKey:(NSString *)key;

- (void)setValue:(id)value withKey:(NSString *)key;

@end
