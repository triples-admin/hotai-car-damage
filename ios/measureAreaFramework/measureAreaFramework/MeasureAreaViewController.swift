//
//  ViewController.swift
//  measureDistance
//
//  Created by Zhi Feng Huang on 4/6/22.
//

import UIKit
import RealityKit
import ARKit

public class OptionCell: UICollectionViewCell {
   @IBOutlet var img: UIImageView!
}

public class MeasureAreaViewController: UIViewController, ARSessionDelegate, UICollectionViewDelegate, UICollectionViewDataSource {
   enum MeasurementMode {
       case area
       func toAttrStr() -> NSAttributedString {
           let str = "面積評估" //"Measuring Area"
           return NSAttributedString(string: str, attributes: [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 20),
                                                               NSAttributedString.Key.foregroundColor: UIColor.black])
       }
   }
   
   public var licensePlate = "";
   public var damagedName = "";
   public var isFullPaint = false;
   
   @IBOutlet weak var headerBackButton: UIButton!
   @IBOutlet weak var licensePlateLabel: UILabel!
   @IBOutlet weak var nextButton: UIButton!
   @IBOutlet var arView: ARView!
   @IBOutlet var cancleButton: UIButton!
   @IBOutlet var resultBg: UIView! {
       didSet {
           resultBg.backgroundColor = UIColor.white.withAlphaComponent(0.8)
           resultBg.layer.cornerRadius = 45
           resultBg.clipsToBounds = true
       }
   }
   @IBOutlet var resultLabel: UILabel! {
       didSet {
           resultLabel.textAlignment = .center
           resultLabel.textColor = UIColor.black
           resultLabel.numberOfLines = 0
           resultLabel.font = UIFont.systemFont(ofSize: 10, weight: UIFont.Weight.heavy)
           resultLabel.attributedText = mode.toAttrStr()
       }
   }
   
   @IBOutlet var switchHor: UISwitch!
   @IBOutlet var switchLabel: UILabel!
   @IBOutlet var switchPlane: UISwitch!
   @IBOutlet var switchPlaneLabel: UILabel!
   @IBOutlet weak var sessionInfoView: UIView!
   @IBOutlet weak var sessionInfoLabel: UILabel!
   @IBOutlet weak var collectionView: UICollectionView!
   
//   private var options: [String] = ["UPS", "A", "B", "C", "E"]
//   private var colors: [CIColor] =  [.blue, .green, .yellow, .red, .gray]
//   private var optionImgs: [String] = ["btn-ups-330x102", "btn-A-330x102", "btn-B-330x102", "btn-C-330x102", "btn-change-247x102"]
//   private var optionImgsSelected: [String] = ["btn-ups-checked-330x102", "btn-A1-330x102", "btn-B1-330x102", "btn-C1-330x102", "btn-change1-247x102"]
  
  private var options: [String] = ["A", "B", "C", "E"]
  private var colors: [CIColor] =  [.green, .yellow, .red, .gray]
  private var optionImgs: [String] = ["btn-A-330x102", "btn-B-330x102", "btn-C-330x102", "btn-change-247x102"]
  private var optionImgsSelected: [String] = ["btn-A1-330x102", "btn-B1-330x102", "btn-C1-330x102", "btn-change1-247x102"]
   
   private var selectedColor: CIColor?
   private var selectedOption: IndexPath? {
       didSet {
           guard let option = selectedOption else {
               return
           }
           selectedColor = colors[option.item]
           if vs.count  > 0 {
               reset()
               restartSceneView()
           }
       }
   }
  
  var leftInset = 0.0
  var rightInset = 0.0
   
   var planes: [AnchorEntity] = []
   var points: [AnchorEntity] = []
   var vs: [SCNVector3] = []
   var lines: [AnchorEntity] = []
   var showPlane: Bool = false
   var detectHor = false {
       didSet {
           if detectHor {
               switchLabel.text = "平面2D" //"Horizontal"
           } else {
               switchLabel.text = "平面2D" //"Hori and Vert"
           }
       }
   }
   private var mode = MeasurementMode.area
   
   private var measureUnit = MeasurementUnit.Unit.decimeter {
       didSet {
           let v = measureValue
           measureValue = v
       }
   }
   
   private var measureValue: MeasurementUnit? {
       didSet {
           if let m = measureValue {
               resultLabel.text = nil
               resultLabel.attributedText = m.attributeString(type: measureUnit)
           } else {
               resultLabel.attributedText = mode.toAttrStr()
           }
       }
   }
   
   private var timeoutTimer: Timer?
   
   public override func viewDidLoad() {
       super.viewDidLoad()
       restartSceneView()
       cancleButton.addTarget(self, action: #selector(MeasureAreaViewController.restart(_:)), for: .touchUpInside)
       headerBackButton.addTarget(self, action: #selector(MeasureAreaViewController.closeMeasure(_:)), for: .touchUpInside);
       nextButton.addTarget(self, action: #selector(MeasureAreaViewController.screenShotMeasure(_:)), for: .touchUpInside);
       switchHor.addTarget(self, action: #selector(MeasureAreaViewController.changeHor(_:)), for: .touchUpInside)
       switchPlane.addTarget(self, action: #selector(MeasureAreaViewController.showPlane(_:)), for: .touchUpInside)
       detectHor = false
       arView.session.delegate = self
       let collectionWidth = collectionView.bounds.width
//       leftInset = (collectionWidth - (130 * 5))/2;
       leftInset = (collectionWidth - (130 * 4))/2;
       rightInset = leftInset;
       // check to show switch options
       if damagedName == "後保險桿" || damagedName == "前保險桿" {
         if(isFullPaint){
           leftInset = (collectionWidth - (130 * 1))/2;
           rightInset = leftInset;
           options = ["E"]
           colors = [.gray]
           optionImgs = ["btn-3-330x102"]
           optionImgsSelected = ["btn-3-checked-330x102"]
         } else {
//           leftInset = (collectionWidth - (130 * 4))/2;
//           rightInset = leftInset;
//           options = ["UPS", "外傷", "變形", "E"]
//           colors = [.blue, .green, .yellow, .gray]
//           optionImgs = ["btn-ups-330x102", "btn-1-330x102", "btn-2-330x102", "btn-3-330x102"]
//           optionImgsSelected = ["btn-ups-checked-330x102", "btn-1-checked-330x102", "btn-2-checked-330x102", "btn-3-checked-330x102"]
           
           leftInset = (collectionWidth - (130 * 3))/2;
           rightInset = leftInset;
           options = ["外傷", "變形", "E"]
           colors = [.green, .yellow, .gray]
           optionImgs = ["btn-1-330x102", "btn-2-330x102", "btn-3-330x102"]
           optionImgsSelected = ["btn-1-checked-330x102", "btn-2-checked-330x102", "btn-3-checked-330x102"]
         }
       }
       if damagedName == "引擎蓋" || (isFullPaint && damagedName != "後保險桿" && damagedName != "前保險桿") {
           // remove UPS
           leftInset = (collectionWidth - (130 * 4))/2;
           rightInset = leftInset;
//           options.removeFirst()
//           colors.removeFirst()
//           optionImgs.removeFirst()
//           optionImgsSelected.removeFirst()
       }
       collectionView.contentInset = UIEdgeInsets(top: 0, left: CGFloat(leftInset), bottom: 0, right: CGFloat(rightInset))
       // check to show horizontal switch
       if damagedName == "引擎蓋" { // engine lid (hood)
           // When users choose engine lid as damage part, AR section automatically turn on 2D horizontal measure
           switchHor.isHidden = false
           switchLabel.isHidden = false
           switchHor.setOn(true, animated: false)
           changeHor(switchHor)
       } else if damagedName == "行李箱" { // trunk (luggage)
           // Only the truck part can be swith between 2D and 3D
           switchHor.isHidden = false
           switchLabel.isHidden = false
       } else {
           // Other parts dont show the swtich 2D/3D button
           switchHor.isHidden = true
           switchLabel.isHidden = true
       }
       licensePlateLabel.text = licensePlate;
   }
   
   @objc func showPlane(_ sender: UISwitch) {
       showPlane = self.switchPlane.isOn
       reset()
       self.restartSceneView()
   }
   
   @objc func changeHor(_ sender: UISwitch) {
       detectHor = self.switchHor.isOn
       reset()
       self.restartSceneView()
   }
   
   private func reset() {
       for node in lines {
           node.removeFromParent()
       }
       for node in points {
           node.removeFromParent()
       }
       for plane in planes {
           plane.removeFromParent()
       }
       planes = []
       vs = []
       points = []
       lines = []
       measureValue = nil
   }
   
   @objc func restart(_ sender: UIButton) {
       reset()
       restartSceneView()
   }
   
   @objc func closeMeasure(_ sender: UIButton) {
       print("---- onPress closeMeasure ");
       self.doCloseMeasure()
   }
   
   func doCloseMeasure() {
       // ------ post notification measure -----------------------
       let dataDict:[String: String] = ["back": "back"];
       NotificationCenter.default.post(name: NSNotification.Name("MeasureSendNotification"), object: nil, userInfo: dataDict);
       
       self.dismiss(animated: true, completion: nil);
   }
 
   func doSkipMeasure() {
       // ------ post notification measure -----------------------
       let dataDict:[String: String] = ["skip": "skip"];
       NotificationCenter.default.post(name: NSNotification.Name("MeasureSendNotification"), object: nil, userInfo: dataDict);
       
       self.dismiss(animated: true, completion: nil);
   }
   
   func startTimeoutTimer() {
       clearTimeoutTimer()
       timeoutTimer = Timer.scheduledTimer(timeInterval: 10.0, target: self, selector: #selector(timeoutFired), userInfo: nil, repeats: false)
   }
   
   @objc func timeoutFired() {
       // checking measure status
       print("sessionInfoLabel.text: " + (sessionInfoLabel.text ?? "nil"))
       if (sessionInfoView.isHidden) {
           // valid session
           print("valid session")
       } else {
           // session is errored
         doSkipMeasure()
       }
       // clear timer
       clearTimeoutTimer()
   }
   
   func clearTimeoutTimer() {
       if let timer = timeoutTimer {
           timer.invalidate()
           timeoutTimer = nil
       }
   }
   
   @objc func screenShotMeasure(_ sender: UIButton) {
       print("---- onPress screenShotMeasure ");
       if (lines.count > 0 && measureValue != nil) {
           screenShotAR();
       } else {
           let alert = UIAlertController(title: "", message: "請點擊屏幕畫出受損面積", preferredStyle: .alert)
           alert.addAction(UIAlertAction(title: "好", style: .default, handler: nil))
           self.present(alert, animated: true)
       }
   }
   
   func screenShotMethod() -> String? {
       //Create the UIImage
       UIGraphicsBeginImageContext(view.frame.size)
       view.layer.render(in: UIGraphicsGetCurrentContext()!)
       let image = UIGraphicsGetImageFromCurrentImageContext()
       UIGraphicsEndImageContext()

       let base64 = image?.jpegData(compressionQuality: 1)?.base64EncodedString() ?? "";
       print("----- image base64: " + base64);
       return base64;
   }

   // onPress Screen Shot AR
   func screenShotAR() -> Void {
       //  Create the UIImage
       arView.snapshot( saveToHDR: false) { arImage in
//           let size = CGSize(width: self.view.frame.size.width, height: self.view.frame.size.height)
           let size = CGSize(width: self.arView.frame.size.width, height: self.arView.frame.size.height)
           UIGraphicsBeginImageContext(size)
           self.resultBg.layer.render(in: UIGraphicsGetCurrentContext()!)
           let measureUnitImage = UIGraphicsGetImageFromCurrentImageContext()
           UIGraphicsEndImageContext()
           UIGraphicsBeginImageContext(size)
           let collectionViewOriginX = (size.width - self.collectionView.bounds.size.width)/2
           self.collectionView.layer.render(in: UIGraphicsGetCurrentContext()!)
           let optionsImage = UIGraphicsGetImageFromCurrentImageContext()
           UIGraphicsEndImageContext()
           UIGraphicsBeginImageContext(size)
           let areaSize = CGRect(x: 0, y: 0, width: size.width, height: size.height)
           var posMeasureUnitX = Float(0)
           if(self.resultBg.bounds.size.width < size.width){
               posMeasureUnitX = Float((size.width/2) - (self.resultBg.bounds.size.width/2))
           }
           let measureUnitSize = CGRect(x: CGFloat(posMeasureUnitX), y: 20, width: size.width, height: size.height)
           var posOptionsX = Float(0)
           if(self.collectionView.bounds.size.width < (size.width - 10)){
               posOptionsX = Float(collectionViewOriginX + self.leftInset)
           }
           let optionsSize = CGRect(x: CGFloat(posOptionsX), y: size.height - self.collectionView.bounds.size.height - 20, width: size.width, height: size.height)
           arImage!.draw(in: areaSize)
           measureUnitImage!.draw(in: measureUnitSize, blendMode: .normal, alpha: 1.0)
           optionsImage!.draw(in: optionsSize, blendMode: .normal, alpha: 1.0)
           let capturedImage = UIGraphicsGetImageFromCurrentImageContext()!
           UIGraphicsEndImageContext()
           let base64 = capturedImage.jpegData(compressionQuality: 0.8)?.base64EncodedString() ?? ""
           // print("----- Merge Image base64: " + base64);
           self.resultScreenShotAR(base64: base64);
       };
   }
   
   // on Result Screen Shot AR
   func resultScreenShotAR(base64: String) {
       // print("----- Result Image base64: " + base64);
       let level = options[selectedOption?.item ?? 0];
       let jsonObject: Any = [
           "base64": base64,
           "level": level,
           "area": resultLabel.text ?? ""
       ];
       // print("-------------- resultLabel " + (resultLabel.text ?? ""));
       // ------ post notification measure -----------------------
       let dataDict:[String: Any] = ["imageBase64": jsonObject];
       NotificationCenter.default.post(name: NSNotification.Name("MeasureSendNotification"), object: nil, userInfo: dataDict);
       
       self.dismiss(animated: true, completion: nil);
   }
   
   func restartSceneView() {
       let config = ARWorldTrackingConfiguration()
       config.planeDetection = self.detectHor ? [.horizontal] : [.horizontal, .vertical]
       arView.session.run(config, options: [.resetTracking, .removeExistingAnchors])
       arView.debugOptions = [ARView.DebugOptions.showFeaturePoints]
   }
   
   public override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
       print("touched")
       if let touchLocation = touches.first?.location(in: arView) {
           guard selectedOption != nil else {
               let alert = UIAlertController(title: "警告", // warn
                                             message: "請選擇以下的面積受損程度", // Please select the degree of area damage below
                                             preferredStyle: .alert)
               alert.addAction(UIAlertAction(title: "好", style: .default, handler: nil)) // good
               self.present(alert, animated: true)
               return
           }
           guard arView.point(inside: touchLocation, with: event) else {
               return
           }
           // print("---- Option - value: " + options[selectedOption?.item ?? 0]);
           let results = arView.raycast(from: touchLocation,
                                        allowing: .existingPlaneInfinite,
                                        alignment: .any)
           if let result = results.first {
               print(result)
               let anchorEntity = AnchorEntity(world: result.worldTransform)
               print(result.worldTransform)
                   
               let sphere = ModelEntity(mesh: .generateSphere(radius: 0.001))
               anchorEntity.addChild(sphere)
               
               let v = SCNVector3(
                   result.worldTransform.columns.3.x,
                   result.worldTransform.columns.3.y,
                   result.worldTransform.columns.3.z)
               print(v)
               if points.count > 0  {
                   drawLine(startPoint: vs.last!, endPoint: v)
               }
               points.append(anchorEntity)
               vs.append(v)
               
               computeArea()
               
               arView.scene.addAnchor(anchorEntity)
               
               if vs.count >= 3 {
                   if vs.count >= 4 {
                       let last = lines.remove(at: lines.count-2)
                       arView.scene.removeAnchor(last)
                   }
                   drawLine(startPoint: vs.first!, endPoint: vs.last!)
               }
           }
       }
   }
   
   func computeArea() {
       guard vs.count >= 3 else {
           return
       }
       
       let area = abs(area3DPolygonFormPointCloud(points: vs))
       measureValue =  MeasurementUnit(meterUnitValue: area, isArea: true)

   }
   
   func computeDistance(start: SCNVector3, end: SCNVector3) -> Float {
       let distance = sqrt(
            pow(end.x - start.x, 2) +
            pow(end.y - start.y, 2) +
            pow(end.z - start.z, 2)
       )

       print(distance)
       return distance
   }
   
   func drawLine(startPoint: SCNVector3, endPoint: SCNVector3) {
       guard let selectedColor = selectedColor else {
           return
       }

       let size = computeDistance(start: startPoint, end: endPoint)
       let material = UnlitMaterial(color: UIColor(ciColor: selectedColor))
       let rectangle = ModelEntity(mesh: .generateBox(width: 0.003, height: 0.003, depth: size), materials: [material])
           
       let middlePoint : simd_float3 = simd_float3((startPoint.x + endPoint.x)/2, (startPoint.y + endPoint.y)/2, (startPoint.z + endPoint.z)/2)

       let lineAnchor = AnchorEntity()
       lineAnchor.position = middlePoint
       lineAnchor.look(at: simd_float3(startPoint), from: middlePoint, relativeTo: nil)
       lineAnchor.addChild(rectangle)
       arView.scene.addAnchor(lineAnchor)
       lines.append(lineAnchor)
   }
   
   fileprivate func raycasting() {
           
       guard let query = arView.makeRaycastQuery(from: arView.center,
                                             allowing: .estimatedPlane,
                                            alignment: .horizontal)
       else { return }

       guard let result = arView.session.raycast(query).first
       else { return }

       print(result)
     let anchor = AnchorEntity();
       let box = ModelEntity(mesh: .generateBox(size: simd_make_float3(0.3, 0.1, 0.2), cornerRadius: 0.03))
       box.transform = Transform(pitch: 0, yaw: 1, roll: 0)
       anchor.addChild(box)
       arView.scene.anchors.append(anchor)

   }
   
   // MARK: - ARSessionDelegate

   public func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
       if showPlane {
           for anchor in anchors {
               if anchor is ARPlaneAnchor {
                   let planeAnchor = anchor as! ARPlaneAnchor
                   let plane = addPlaneEntity(with: planeAnchor, to: arView)
                   planes.append(plane)
               }
           }
       }
       
       guard let frame = session.currentFrame else { return }
     updateSessionInfoLabel(for: frame, trackingState: frame.camera.trackingState, firstTime: false)
   }
   
   public func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
       if showPlane {
           for anchor in anchors {
               if anchor is ARPlaneAnchor {
                   let planeAnchor = anchor as! ARPlaneAnchor
                   updatePlaneEntity(with: planeAnchor, in: arView)
               }
           }
       }
   }

   public func session(_ session: ARSession, didRemove anchors: [ARAnchor]) {
       if showPlane {
           for anchor in anchors {
               if anchor is ARPlaneAnchor {
                   let planeAnchor = anchor as! ARPlaneAnchor
                   let plane = removePlaneEntity(with: planeAnchor, from: arView)
                   if let plane = plane, let idx = planes.firstIndex(of: plane){
                       planes.remove(at: idx)
                   }
               }
           }
       }
       
       guard let frame = session.currentFrame else { return }
     updateSessionInfoLabel(for: frame, trackingState: frame.camera.trackingState, firstTime: false)
   }

   public func session(_ session: ARSession, cameraDidChangeTrackingState camera: ARCamera) {
     updateSessionInfoLabel(for: session.currentFrame!, trackingState: camera.trackingState, firstTime: true)
   }

   // MARK: - ARSessionObserver

   public func sessionWasInterrupted(_ session: ARSession) {
       sessionInfoLabel.text = "程式被中斷" // program was interrupted
   }

   public func sessionInterruptionEnded(_ session: ARSession) {
       sessionInfoLabel.text = "程式被中斷結束" // program terminated
       restartSceneView()
   }
   
   public func session(_ session: ARSession, didFailWithError error: Error) {
       sessionInfoLabel.text = "程式出錯: \(error.localizedDescription)" // program error:
       guard error is ARError else { return }
       
       let errorWithInfo = error as NSError
       let messages = [
           errorWithInfo.localizedDescription,
           errorWithInfo.localizedFailureReason,
           errorWithInfo.localizedRecoverySuggestion
       ]
       
       let errorMessage = messages.compactMap({ $0 }).joined(separator: "\n")
       
       DispatchQueue.main.async {
           // Present an alert informing about the error that has occurred.
           let alertController = UIAlertController(title: "模擬器錯誤", message: errorMessage, preferredStyle: .alert)
           let restartAction = UIAlertAction(title: "重啟程式", style: .default) { _ in
               alertController.dismiss(animated: true, completion: nil)
               self.restartSceneView()
           }
           alertController.addAction(restartAction)
           self.present(alertController, animated: true, completion: nil)
       }
   }

   // MARK: - Private methods

  private func updateSessionInfoLabel(for frame: ARFrame, trackingState: ARCamera.TrackingState, firstTime: Bool) {
       let message: String

       switch trackingState {
       case .normal where frame.anchors.isEmpty:
           message = "移動裝置去偵測橫向縱向" // Mobile devices to detect landscape orientation
           
       case .notAvailable:
           message = "沒有追蹤功能" // no tracking
           
       case .limited(.excessiveMotion):
           message = "慢慢移動" // move slowly
           
       case .limited(.insufficientFeatures):
           message = "請增加環境燈光" // please add ambient light
           
       case .limited(.initializing):
           message = "開始模擬器程式" // start emulator program (initializing)
           startTimeoutTimer()
         
       default :
         if(firstTime){
           message = "移動裝置去偵測橫向縱向"
         } else {
           message = ""
         }
         
       }

       sessionInfoLabel.text = message
       sessionInfoView.isHidden = message.isEmpty
   }
   
   public func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
       let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "OptionCell", for: indexPath) as! OptionCell
       cell.img.image = UIImage(named: optionImgs[indexPath.item])

       return cell
   }
   
   public func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
       return options.count
   }
   
   public func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
       if indexPath == selectedOption {
           return
       }
       if let oldOption = selectedOption {
           if let cell = collectionView.cellForItem(at: oldOption) as? OptionCell {
               cell.img.image = UIImage(named: optionImgs[oldOption.item])
           }
       }
       
       selectedOption = indexPath
       
       if let cell = collectionView.cellForItem(at: indexPath) as? OptionCell {
           cell.img.image = UIImage(named: optionImgsSelected[indexPath.item])
       }
       
   }
   
   // ==== public ==================================================

   
   public func stopMeasure() {
       print("---- on Stop Measure");
       self.dismiss(animated: true, completion: nil);
   }
   
   // ====end  public ==================================================
}
