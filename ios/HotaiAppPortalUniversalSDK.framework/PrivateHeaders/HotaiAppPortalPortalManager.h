//
//  PortalManager.h
//  HotaiAppPortalUniversalSDK
//
//  Created by weiwu on 2018/1/19.
//  Copyright © 2018年 weiwu. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, HotaiPortalManager_LoginIdentity)
{
    HotaiPortalManager_LoginIdentity_None,
    HotaiPortalManager_LoginIdentity_Main,
    HotaiPortalManager_LoginIdentity_Simulator
};

//public key define
#define BRAND              @"BRAND"

#define BRNHCD             @"BRNHCD"

#define BRNHNM             @"BRNHNM"

#define BRANCHID           @"BRANCHID"

#define DLRCD              @"DLRCD"

#define COMPID             @"COMPID"

#define COMPNM             @"COMPNM"

#define USERID             @"USERID"

#define MAINUSERID             @"MAINUSERID"

#define USERNM             @"USERNM"

#define MOBILENO           @"MOBILENO"

#define ECHOTITLECD        @"ECHOTITLECD"

#define ECHOTITLENM        @"ECHOTITLENM"

#define DEVICE             @"DEVICE"

#define EMPNO              @"EMPNO"

#define SECTCD             @"SECTCD"

#define DATAGRPID          @"DATAGRPID"

#define SIMFLAG            @"SIMFLAG"

#define SIMLOGIN           @"SIMLOGIN"

#define kVersion           @"version"

#define kBuildCode         @"buildcode"

#define kUrlSchema         @"urlschema"

#define kUpgradeApp        @"upgradeApp"

#define kBundleId          @"bundleId"

#define USERPWD         @"USERPWD"

#define DATETIME        @"DATETIME"

#define kFirstOfflineLoginDATETIME  @"FirstOfflineLoginDATETIME"

//private key define
#define kDictLoginInfoKey_COMPID                    @"kDictLoginInfoKey_COMPID" //公司代碼
#define kDictLoginInfoKey_COMPNM                    @"kDictLoginInfoKey_COMPNM" //公司名稱
#define kDictLoginInfoKey_BRANCHID                  @"kDictLoginInfoKey_BRANCHID"   //據點代碼  (預留:目前用不到)
#define kDictLoginInfoKey_BRANDNM                   @"kDictLoginInfoKey_BRANDNM"    //據點名稱
#define kDictLoginInfoKey_USERID                    @"kDictLoginInfoKey_USERID" //使用者代碼
#define kDictLoginInfoKey_USERNM                    @"kDictLoginInfoKey_USERNM" //使用者名稱
#define kDictLoginInfoKey_DLRCD                     @"kDictLoginInfoKey_DLRCD"  //經銷商代碼
#define kDictLoginInfoKey_BRANDCD                   @"kDictLoginInfoKey_BRANDCD"    //營業所代碼
#define kDictLoginInfoKey_EMPNO                     @"kDictLoginInfoKey_EMPNO"  //員工編號
#define kDictLoginInfoKey_ECHOTITLECD               @"kDictLoginInfoKey_ECHOTITLECD"    //職稱代碼
#define kDictLoginInfoKey_ECHOTITLENM               @"kDictLoginInfoKey_ECHOTITLENM"    //職稱中文
#define kDictLoginInfoKey_MOBILENO                  @"kDictLoginInfoKey_MOBILENO"   //使用者電話(手機號碼)
#define kDictLoginInfoKey_BRAND                     @"kDictLoginInfoKey_BRAND"  //廠牌代碼(品課)
#define kDictLoginInfoKey_SECTCD                    @"kDictLoginInfoKey_SECTCD" //課別
#define kDictLoginInfoKey_DEVICE                    @"kDictLoginInfoKey_DEVICE" //DEVICE
#define kDictLoginInfoKey_DATAGRPID                 @"kDictLoginInfoKey_DATAGRPID"  //Data Group ID

#define kDictLoginInfoKey_COMPID_SIM                @"kDictLoginInfoKey_COMPID_SIM" //公司代碼(模擬者)
#define kDictLoginInfoKey_COMPNM_SIM                @"kDictLoginInfoKey_COMPNM_SIM" //公司名稱(模擬者)
#define kDictLoginInfoKey_BRANCHID_SIM              @"kDictLoginInfoKey_BRANCHID_SIM"   //據點代碼(模擬者)
#define kDictLoginInfoKey_BRANDNM_SIM               @"kDictLoginInfoKey_BRANDNM_SIM"    //據點名稱(模擬者)
#define kDictLoginInfoKey_USERID_SIM                @"kDictLoginInfoKey_USERID_SIM" //使用者代碼(模擬者)
#define kDictLoginInfoKey_USERNM_SIM                @"kDictLoginInfoKey_USERNM_SIM" //使用者名稱(模擬者)
#define kDictLoginInfoKey_DLRCD_SIM                 @"kDictLoginInfoKey_DLRCD_SIM"  //經銷商代碼(模擬者)
#define kDictLoginInfoKey_BRNHCD_SIM                @"kDictLoginInfoKey_BRNHCD_SIM" //營業所代碼(模擬者)
#define kDictLoginInfoKey_EMPNO_SIM                 @"kDictLoginInfoKey_EMPNO_SIM"  //員工編號(模擬者)
#define kDictLoginInfoKey_ECHOTITLECD_SIM           @"kDictLoginInfoKey_ECHOTITLECD_SIM"    //職稱代碼(模擬者)
#define kDictLoginInfoKey_ECHOTITLENM_SIM           @"kDictLoginInfoKey_ECHOTITLENM_SIM"    //職稱名稱(模擬者)
#define kDictLoginInfoKey_MOBILENO_SIM              @"kDictLoginInfoKey_MOBILENO_SIM"   //使用者電話(模擬者)
#define kDictLoginInfoKey_BRAND_SIM                 @"kDictLoginInfoKey_BRAND_SIM"  //品牌(模擬者)
#define kDictLoginInfoKey_SECTCD_SIM                @"kDictLoginInfoKey_SECTCD_SIM" //課別(模擬者)
#define kDictLoginInfoKey_DEVICE_SIM                @"kDictLoginInfoKey_DEVICE_SIM" //DEVICE(模擬者) (預留:目前API不會回傳)
#define kDictLoginInfoKey_DATAGRPID_SIM             @"kDictLoginInfoKey_DATAGRPID_SIM"  //Data Group ID(模擬者)

#define kDictLoginInfoKey_AUTHSIMFLAG               @"kDictLoginInfoKey_AUTHSIMFLAG"    //是否可模擬其它對象
#define kDictLoginInfoKey_SIMFLAG                   @"kDictLoginInfoKey_SIMFLAG"    //此登入人員是否為模擬對象
#define kDictLoginInfoKey_IS_PORTAL_LOGOUT          @"kDictLoginInfoKey_IS_PORTAL_LOGOUT"
#define kDictLoginInfoKey_Current_App_Version       @"kDictLoginInfoKey_Current_App_Version"
#define kDictLoginInfoKey_App_Upgrade_Info          @"kDictLoginInfoKey_App_Upgrade_Info"
#define kDictLoginInfoKey_Offline_Login_Info        @"kDictLoginInfoKey_Offline_Login_Info"

#define kDictLoginInfoKey_App_PGM_Identifier        @"kDictLoginInfoKey_App_PGM_Identifier"


//登入時間
#define kLoginTime              @"kLoginTime"

//閒置時間
#define kIdleTimeLimit          @"kIdelTimeLimit"

//閒置時間(新版)
#define kIdleTimeLimit2021      @"kIdelTimeLimit2021"

//系統閒置時間
#define kSystemIdleTimeLimit    @"kSystemIdleTimeLimit"

//誰呼叫portal的bundleId
#define kDirectBundleId        @"kDirectBundleId"

//是否登出
#define kIsPortalLogout         @"kIsPortalLogout"

//進入背景時間
#define kTimeIntoBackground     @"kTimeIntoBackground"

//是否為更新時間
#define kCallPortalUpdate       @"kCallPortalUpdate"

#define kInsOpenLog             @"insOpenLog"

#define kSaveUseLog             @"saveUseLog"

#define kPortalManager [HotaiAppPortalPortalManager defaultManager]

@interface HotaiAppPortalPortalManager : NSObject

+ (HotaiAppPortalPortalManager *)defaultManager;

- (void)doLogin;

- (void)doLogout;

- (void)doForceLogout;

- (void)doLoginUpdate;

- (NSTimeInterval)getLastLoginTime;

- (NSTimeInterval)getIntoBackgroundTime;

- (NSTimeInterval)getIdleTimeIntervalLimit;

- (NSDictionary *)getDictIdleTimeLimit;

- (NSDictionary *)getUserProfile;

- (NSDictionary *)getSIMUserProfile;

- (NSDictionary *)getVersionInfo;

- (NSDictionary *)getUploadLogInfo;

- (NSDictionary *)getUpgradeInfo;

- (id)getSavedUseLogWithBundleId:(NSString *)bundleId;

- (id)getInsertOpenLogWithBundleId:(NSString *)bundleId;

- (BOOL)getIsPortalIsLogout;

- (BOOL)getIsCallUpdate;

- (BOOL)getIsSimulationLogin;

//for app portal app internal use
- (void)setLoginTimeToKeychainWithTime:(NSTimeInterval)timeInterval;

- (void)setIdleLimitToKeychainWithJsonString:(NSString *)jsonString;

- (void)setIdleLimitToKeychainWithTimeInterval:(NSString *)intervalString;

- (void)setBrandToKeychainWithBrand:(NSString *)brand andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setBrandCodeToKeychainWithBrandCode:(NSString *)brandCode andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setBrandNameToKeychainWithBrandName:(NSString *)brandName andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setDealerCodeToKeychainWithDealerCode:(NSString *)dealerCode andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setCompanyIdToKeychainWithCompanyId:(NSString *)companyId andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setCompanyNameToKeychainWithCompanyName:(NSString *)companyName andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setUserIdToKeychainWithUserId:(NSString *)userId andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setUserNameToKeychainWithUserName:(NSString *)userName andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setMobileNoToKeychainWithMobileNo:(NSString *)mobileNo andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setEchoTitleCodeToKeychainWithEchoTitleCode:(NSString *)echoTitleCode andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setEchoTitleNameToKeychainWithEchoTitleName:(NSString *)echoTitleName andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setDeviceToKeychainWithDevice:(NSString *)device andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setEmpNoToKeychainWithEmpNo:(NSString *)empNo andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setSectCDToKeychainWithSectCD:(NSString *)sectCD andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setDataGrpIdToKeychainWithDataGrpId:(NSString *)dataGrpId andIdentity:(HotaiPortalManager_LoginIdentity)identityType;

- (void)setSimFlagToKeychainWithSimFlag:(BOOL)simFlag;

- (void)setAuthSimFlagToKeychainWithAuthSimFlag:(BOOL)simFlag;

- (void)setIsPortalLogoutToKeychainWithIsPortalLogout:(BOOL)isPortalLogout;

- (void)setIsCallPortalUpdata:(BOOL)isUpdate;

- (void)setDirectBundleIdToKeychainWithDirectBundleId:(NSString *)directBundleId;

- (void)setCurrentVersionInfoToKeychain;

- (void)setAppUpdradeInfoToKeychainWithAppInfoDict:(NSDictionary *)dict;

- (void)setIntoBackgroundTimeWithTime:(NSTimeInterval)time;

- (void)setUploadLogWithDictLog:(NSDictionary *)dictLog;

- (void)clearUseLog;

- (void)clearOpenLog;

//清除登入者 User Info
- (void)clearAllUserInfo:(HotaiPortalManager_LoginIdentity)loginIdentity;

- (NSString *)getOfflineLoginInformation;

- (void)setOfflineLoginInformation:(NSString *)offlineJSON;



@end

