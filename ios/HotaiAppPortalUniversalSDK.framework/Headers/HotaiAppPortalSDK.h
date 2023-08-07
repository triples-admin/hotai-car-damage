//
//  HotaiAppPortalSDK.h
//  HotaiAppPortalUniversalSDK
//
//  Created by weiwu on 2018/1/19.
//  Copyright © 2018年 weiwu. All rights reserved.
//

#import <Foundation/Foundation.h>

/*
typedef NS_ENUM(NSInteger, HotaiAppPortalSDKType)
{
    HotaiAppPortalSDKType_TypeA,    //無LOG
    HotaiAppPortalSDKType_TypeB     //有LOG
};
*/

typedef NS_ENUM(NSInteger, HotaiAppPortalSDKHost)
{
    HotaiAppPortalSDKHost_TEST, //測試環境
    HotaiAppPortalSDKHost_PROD  //正式環境
};

typedef void (^ServiceCompleteBlock)(void);
typedef void (^ITRANSServiceCompleteBlock)(NSString * _Nullable url);

@interface HotaiAppPortalSDK : NSObject

/*!
 * Showing Current SDK Type
 */
//@property (nonatomic, readonly) HotaiAppPortalSDKType type;

/*!
 * Showing Current API Host Type
 */
@property (nonatomic, readonly) HotaiAppPortalSDKHost sdkHost;

/*!
 * Boolen property can set whether to show log
 */
@property (nonatomic, assign) BOOL isShowLog;

/*!
 *@discussion HotaiAppPortalSDK is using Singleton pattern
 *@return Singleton of HotaiAppPortalSDK class
 */
+ (HotaiAppPortalSDK *_Nullable)sharedInstance;

/*!
 *@discussion Setting for SDK
 *@param host Type of SDK Host endpoint
 *@param pgmID String of HOTAI App program identifier
 *@param pgmNM String of HOTAI App program name
 */
- (void)setAppPortalSDKWithEndPoint:(HotaiAppPortalSDKHost)host andProgramId:(NSString *_Nonnull)pgmID andProgramName:(NSString *_Nonnull)pgmNM;

/*!
 *@discussion Save use Log which need to be uploaded
 *@param dict A dictionary carry logs
 */
- (void)saveUseLogWithLogDict:(NSDictionary *_Nonnull)dict;

/*!
 *@discussion Save use Log which need to be uploaded
 *@param userId A string from Login User Identifier
 */
- (void)saveUseLogWithUserIdentifier:(NSString *_Nonnull)userId andItemNumber:(NSString *_Nonnull)itemNo andActionCode:(NSString * _Nonnull)actionCode andMemo:(NSString * _Nonnull)memoText;

/*!
 *@discussion Save insert open Log which need to be uploaded
 *@param dict A dictionary carry logs
 */
- (void)saveInsertOpenLogDict:(NSDictionary *_Nonnull)dict;

/*!
 *@discussion Save insert open Log which need to be uploaded
 *@param userId A string from Login User Identifier
 */
- (void)saveInsertOpenLogUser:(NSString *_Nonnull)userId andItemNumber:(NSString *_Nonnull)itemNo andActionCode:(NSString * _Nonnull)actionCode andMemo:(NSString * _Nonnull)memoText;

/*!
 *@discussion A method will do app portal login
 */
- (void)callAppPortalLogin;

/*!
 *@discussion A method will do app portal logout
 */
- (void)callAppPortalLogout;

/*!
 *@discussion A method will do app portal force logout
 */
//- (void)callAppPortalForceLogout;

/*!
 *@discussion A method will do app portal login update
 */
//- (void)callAppPortalUpdate;

/*!
*@discussion Get user profile which belones to current login user
*@return A dictionary carries user profile
 */
- (NSDictionary *_Nullable)getUserProfile;

/*!
*@discussion Get user profile which belones to current login user
*@return A data model carries user profile
 */
//- (UserData *_Nullable)getUserProfileModel;

/*!
 *@discussion Get system pendding time
 *@return A time that shows how long users can pendding in background
 */
//- (NSTimeInterval)getSystemTimeoutSeconds;

/*!
 *@discussion Get app pendding time
 *@param bundleId Bundle id of app which user insterested
 *@return A time that shows how long users can pendding in background
 */
//- (NSTimeInterval)getAppTimeoutSecondsByBundleId:(NSString *_Nonnull)bundleId;

/*!
 *@discussion Check current login status is valied or not
 *@return A boolen shows current status valied
 */
- (BOOL)checkPortalLoginStatusValid;

/*!
 *@discussion Update current App infomation
 */
//- (void)updateCurrentAppInfoRecord;

/*!
 *@discussion A tool allows users to get App version
 *@return Current app version
 */
//- (NSString *_Nullable)getCurrentAppVersionRecord;

/*!
 *@discussion A tool allows users to get Build code
 *@return Current app build code
 */
//- (NSString *_Nullable)getCurrentAppBuildCodeRecord;

/*!
 *@discussion A tool allows users to get url schema
 *@return Current app url schema
 */
//- (NSString *_Nullable)getCurrentAppURLSchema;

/*!
 *@discussion A tool allows users to get whether force to update
 *@return boolen of force to update
 */
//- (BOOL)checkIsForceToUpdate;

/*!
 *@discussion A tool allows users to get other App version
 *@param bundleId Bundle id of app which user insterested
 *@return Other app version
 */
//- (NSString *_Nullable)getOtherAppVersionWithBundleId:(NSString *_Nonnull)bundleId;

/*!
 *@discussion A tool allows users to get other App version
 *@param bundleId Bundle id of app which user insterested
 *@return Other app build code
 */
//- (NSString *_Nullable)getOtherAppBuildCodeWithBundleId:(NSString *_Nonnull)bundleId;

/*!
 *@discussion A tool allows users to get other App version
 *@param bundleId Bundle id of app which user insterested
 *@return Other app url schema
 */
//- (NSString *_Nullable)getOtherAppURLSchemaWithBundleId:(NSString *_Nonnull)bundleId;

/*!
 *@discussion A tool allows users to get Vendor App PGM ID
 *@return Current app url schema
 */
- (NSString *_Nullable)getVendorProgramIdentifier;

/*!
 *@discussion A tool allows users to get Vendor App PGM Name
 *@return Current app url schema
 */
- (NSString *_Nullable)getVendorProgramName;

/*!
*@discussion Get user identifier which belones to current login user
*@return Current user identifier from user profile
 */
- (NSString *_Nullable)getLoginUserIdFromUserProfile;

/*!
*@discussion Get Data Group ID which belones to current login user
*@return Current user data group id from user profile
 */
- (NSString *_Nullable)getDataGroupIdFromUserProfile;

/*!
*@discussion Get Data Group ID which belones to current API Service
 */
- (void)getDataGroupIdTableFromHotaiAPIServiceWithCompleteBlock:(ServiceCompleteBlock _Nonnull)completeBlock;

- (void)getAppWebUrlFromHotaiAPIServiceWithCompleteBlock:(ITRANSServiceCompleteBlock _Nonnull)completeBlock;

/*!
 *@discussion A tool allows users to get other App whether force to update
 *@param bundleId Bundle id of app which user insterested
 *@return boolen of force to update
 */
//- (BOOL)checkIsForceToUpdateWithBundleId:(NSString *_Nonnull)bundleId;

//以下為 Demo Code 才會用到 (Only Demo App Usage)
- (NSDictionary *_Nullable)getSIMUserProfile;
- (void)updateFirstLoginTime:(NSTimeInterval)interval;

@end
 
