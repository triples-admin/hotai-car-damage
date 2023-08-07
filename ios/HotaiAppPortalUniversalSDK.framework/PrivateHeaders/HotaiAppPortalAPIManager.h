//
//  APIManager.h
//  HotaiAppPortalUniversalSDK
//
//  Created by weiwu on 2018/1/30.
//  Copyright © 2018年 weiwu. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "htDefined_Global.h"

#import "htUserData.h"

#define kHotaiAppPortalAPIManager     [HotaiAppPortalAPIManager defaultManager]


typedef NS_ENUM(NSInteger, HotaiApiManagerService)
{
    HotaiApiManagerService_Login,
    
    HotaiApiManagerService_GetSIMUserList,
    
    HotaiApiManagerService_ChangePwd,
    
    HotaiApiManagerService_SimLogin,
    
    HotaiApiManagerService_SimOpenLog,
    
    HotaiApiManagerService_AppNameList,
    
    HotaiApiManagerService_GetWebAppUrl
};

typedef NS_ENUM(NSInteger, HotaiApiManagerLogService)
{
    HotaiApiManagerLogService_DeviceCheck,
    
    HotaiApiManagerLogService_OpenLog,
    
    HotaiApiManagerLogService_UseLog,
    
    HotaiApiManagerLogService_DataGroupId,
    
    HotaiApiManagerLogService_SystemStatus,
    
    HotaiApiManagerLogService_GetIdleTime
};

@interface HotaiAppPortalAPIManager : NSObject

+ (HotaiAppPortalAPIManager *_Nullable)defaultManager;

+ (BOOL)isAPISuccess:(id _Nonnull)responseObject;

+ (BOOL)isAPISucessByResult:(id _Nonnull)responseObject;

//API 1-1 取得APP系統(維運)狀態
- (void)runAPIservice_101_getMaintenanceStatusListWithCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-2 登錄驗證
- (void)runAPIService_102_iLogin2WithAccount:(NSString *_Nonnull)account andPassword:(NSString *_Nonnull)pwd withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-3 取得有授權的可模擬人員清單(APP PORTAL SDK使用)
- (void)runAPIService_103_iSimAuthUserListWithUserID:(NSString *_Nonnull)userID andPGMId:(NSString *_Nonnull)pgmID withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-4 將所有登入資訊存入和泰(包含登入者資訊、機台資訊、登入APP...)
- (void)runAPIService_104_setDeviceInfoWithPGMID:(htAppData *_Nonnull)appData andUserData:(htUserData *_Nonnull)userData withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-5 記錄點擊次數
- (void)runAPIService_105_insOpenLogWithDICT:(NSDictionary *_Nonnull)dict withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-6 記錄點擊次數
- (void)runAPIService_106_saveUseLogWithJSON:(NSString *_Nonnull)jsonString withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-7 模擬人員詳細資料
- (void)runAPIService_107_iSimUserData3WithUserID:(NSString *_Nonnull)userId andSIMUserID:(NSString *_Nonnull)simUserId withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-8 取得GROUP ID
- (void)runAPIService_108_getDataGrpIdWithPGMID:(NSString *_Nonnull)pgmId andUserData:(htUserData *_Nonnull)data withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-9 記錄模擬開啟APP LOG
- (void)runAPIService_109_saveISimOpenLogWithUserID:(NSString *_Nonnull)userId andSIMUserID:(NSString *_Nonnull)simUserId andPGMId:(NSString *_Nonnull)pgmID withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 1-10 取得APP閒置時間
- (void)runAPIService_110_getIdleTimeWithCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 2-1 修改密碼驗證
- (void)runAPIService_201_ChangePasswordWithUserID:(NSString * _Nonnull)userID andOldPWD:(NSString * _Nonnull)oldPwd andNewPWD:(NSString * _Nonnull)newPwd withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 3-1 取得APP系統ID中文對照清單
- (void)runAPIService_301_iAppNameListWithPGMId:(NSString *_Nonnull)pgmID withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
//API 4-1 APP驗證轉址
- (void)runAPIService_401_iTransWithUserData:(htUserData *_Nonnull)data andAppId:(NSString *_Nonnull)appId withCompleteBlock:(APICompleteBlock _Nonnull)completeBlock andFailedBlock:(APIFailedBlock _Nonnull)failedBlock;
@end
