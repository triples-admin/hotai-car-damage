
import Foundation
import UIKit
import AVFoundation

@objc(NativeService)
class NativeService: RCTEventEmitter {
  
  public static var shared: NativeService?
  
  override init() {
    super.init();
    NativeService.shared = self;
    
    // ------ recieve notification measure ---------------
    NotificationCenter.default.addObserver(self, selector: #selector(NativeService.sendImageAR(notification:)), name: Notification.Name("MeasureSendNotification"), object: nil)
    
    // ------ recieve notification vision scan ---------------
    NotificationCenter.default.addObserver(self, selector: #selector(NativeService.handleVisionScan(notification:)), name: Notification.Name("VisionScanSendNotification"), object: nil)
  }
  
  deinit { // ------ delete notification measure ----------
    NotificationCenter.default.removeObserver(self);
  }
  
  override open func supportedEvents() -> [String]! {
    return ["onHelloJS", "onResultImageAR", "onBackImageAR", "onSkipImageAR", "onResultVisionScan"];
  }
  
  @objc override static func requiresMainQueueSetup() ->Bool{
    return true;
  }
  
  // From AppDelegate call helloJS
  @objc func helloJS(data: String){
    sendEvent(withName: "onHelloJS", body: data);
  }
  
  // From React Call helloNative - Callback
  @objc func helloNative(_ callback: RCTResponseSenderBlock) {
    callback(["SWIFT native Module - Callback"]);
  }
  
  // From React Call helloNative - Promise : Async/Await
  @objc func helloNative1(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
      resolve("SWIFT native Module - Promise: Async/Await")
  }
  
  // --------------------------------------------------------------------------
  @objc func checkLoginStatus(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let isSDKLoging = HotaiAppPortalSDK.sharedInstance()?.checkPortalLoginStatusValid();
    resolve(isSDKLoging);
    // resolve(false);
  }
  
  @objc func login(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
  
    let isSDKLoging = HotaiAppPortalSDK.sharedInstance()?.checkPortalLoginStatusValid();
    if (isSDKLoging == false) {
      DispatchQueue.main.sync {
        HotaiAppPortalSDK.sharedInstance()?.callAppPortalLogin();
      }
      resolve("IOS - will Login SDK");
    } else {
      resolve("IOS - Logined");
    }
    // resolve("IOS - Logined");
  }
  
  @objc func logout(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
  
    HotaiAppPortalSDK.sharedInstance()?.callAppPortalLogout();
    resolve("IOS - Logout SDK");
  }
  
  @objc func getUserInfo(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
  
   let isSDKLoging = HotaiAppPortalSDK.sharedInstance()?.checkPortalLoginStatusValid();
   if (isSDKLoging == true) {
     print("------- isSDKLoging = true ---- ");
     let dictUserProfile = HotaiAppPortalSDK.sharedInstance()?.getUserProfile()

     resolve(dictUserProfile);
   } else {
     print("------- isSDKLoging = false ---- ");
     resolve("");
   }
    // resolve("");
  }
  
  //-----------------------------------------------------------------------
  // MeasureArea
  @objc func startMeasure(_ licensePlate: String, damagedName: String, isFullPaint: Bool, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    
    DispatchQueue.main.sync {
      let mainStoryboard = UIStoryboard(name: "Main", bundle: nil)
      let homeViewController = mainStoryboard.instantiateViewController(withIdentifier: "MeasureAreaViewController") as! MeasureAreaViewController
      homeViewController.modalPresentationStyle = .fullScreen;
      homeViewController.licensePlate = licensePlate;
      homeViewController.damagedName = damagedName;
      homeViewController.isFullPaint = isFullPaint;
      UIApplication.shared.keyWindow?.rootViewController?.present(homeViewController, animated: true)
    }
    
    resolve("--- zzz start ");
  }
  
  @objc func stopMeasure(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    
    let measureArea = MeasureAreaViewController();
    measureArea.stopMeasure();
    
    resolve("--- zzz stop ");
  }
  
  // From Measure callback sendImageAR
  @objc func sendImageAR(notification: Notification){
    if let dict = notification.userInfo as NSDictionary? {
      if let strBack = dict["back"] as? String{
        sendEvent(withName: "onBackImageAR", body: strBack);
      } else if let strBack = dict["skip"] as? String{
        sendEvent(withName: "onSkipImageAR", body: strBack);
      } else if let strBase64 = dict["imageBase64"]{
        sendEvent(withName: "onResultImageAR", body: strBase64);
      }
    }
  }
  
  //-----------------------------------------------------------------------
  // Vision Scan
  @objc func startScanPlateNumber(_ prefix: String, suffix: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    
    DispatchQueue.main.sync {
      let visionStoryboard = UIStoryboard(name: "VisionMain", bundle: nil)
      let visionViewController = visionStoryboard.instantiateViewController(withIdentifier: "VisionViewController") as! VisionViewController
      visionViewController.modalPresentationStyle = .fullScreen;
      visionViewController.prefix = prefix;
      visionViewController.suffix = suffix;
      let transition = CATransition()
      transition.duration = 0.5
      transition.type = CATransitionType.push
      transition.subtype = CATransitionSubtype.fromRight
      transition.timingFunction = CAMediaTimingFunction(name:CAMediaTimingFunctionName.easeInEaseOut)
      UIApplication.shared.keyWindow?.layer.add(transition, forKey: kCATransition)
      UIApplication.shared.keyWindow?.rootViewController?.present(visionViewController, animated: false)
    }
    
    resolve("--- zzz startScanPlateNumber ");
  }
  
  @objc func stopVisionScan(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    
    print("---------- stopVisionScan");
    DispatchQueue.main.sync {
      let transition = CATransition()
      transition.duration = 0.5
      transition.type = CATransitionType.push
      transition.subtype = CATransitionSubtype.fromLeft
      transition.timingFunction = CAMediaTimingFunction(name:CAMediaTimingFunctionName.easeInEaseOut)
      UIApplication.shared.keyWindow?.layer.add(transition, forKey: kCATransition)
      UIApplication.shared.keyWindow?.rootViewController?.dismiss(animated: true)
      print("---------- stopVisionScan 2");
    }
    resolve("--- zzz stopVisionScan");
  }
  
  // From VisionScan callback
  @objc func handleVisionScan(notification: Notification){
    if let dict = notification.userInfo as NSDictionary? {
      if let result = dict["VisionScanBack"]{
        sendEvent(withName: "onResultVisionScan", body: result);
      } else if let result = dict["VisionScanLogout"]{
        sendEvent(withName: "onResultVisionScan", body: result);
      } else if let result = dict["VisionScanManual"]{
        sendEvent(withName: "onResultVisionScan", body: result);
      } else if let result = dict["VisionScanDone"]{
        sendEvent(withName: "onResultVisionScan", body: result);
      }
    }
  }
  //-----------------------------------------------------------------------
}
