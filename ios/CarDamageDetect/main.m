#import <UIKit/UIKit.h>

#import "AppDelegate.h"

BOOL hasBeenJailBroken(void)
{
  //Check common Jailbreak files
  if (
    [[NSFileManager defaultManager] fileExistsAtPath:@"/Applications/Cydia.app"] ||
    [[NSFileManager defaultManager] fileExistsAtPath:@"/Library/MobileSubstrate/MobileSubstrate.dylib"] ||
    [[NSFileManager defaultManager] fileExistsAtPath:@"/bin/bash"] ||
    [[NSFileManager defaultManager] fileExistsAtPath:@"/usr/sbin/sshd"] ||
    [[NSFileManager defaultManager] fileExistsAtPath:@"/etc/apt"] ||
    [[NSFileManager defaultManager] fileExistsAtPath:@"/private/var/lib/apt/"]
  ){
    return YES;
  }
  if ( 
    //Check Cydia AppStore (Exclusive to Jailbroken Devices) URI Scheme
    [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"cydia://package/com.example.package"]]
  ){
    return YES;
  }
  NSError *error;
  //Check write permissions, by writing an arbitrary file to /private/ folder
  NSString *stringToBeWritten = @"If written successfully, device is jailbroken.";
  [stringToBeWritten writeToFile:@"/private/WriteTestJailbreak.txt" atomically:YES encoding:NSUTF8StringEncoding error:&error];
  [[NSFileManager defaultManager] removeItemAtPath:@"/private/WriteTestJailbreak.txt" error:nil];
  if(error == nil) {
    return YES;
  }
  return NO;
}

int main(int argc, char * argv[]) {
  @autoreleasepool {
    //Check Device is Jailbroken
    if (hasBeenJailBroken()) {
      return 0;
    }
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
