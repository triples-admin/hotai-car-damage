//
//  PlaneDetector.h
//  measureArea
//
//  Created by Zhi Feng Huang on 4/13/22.
//

#ifndef PlaneDetector_h
#define PlaneDetector_h

#import <Foundation/Foundation.h>
#import <SceneKit/SceneKit.h>

@interface PlaneDetector : NSObject

+ (SCNVector4)detectPlaneWithPoints:(NSArray <NSValue* >*)points;


@end

#endif 
