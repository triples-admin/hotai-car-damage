import UIKit
import AVFoundation
import Vision

class ViewController: UIViewController {
  public var prefix = ""; // params plate number
  public var suffix = ""; // params plate number
  
	// MARK: - UI objects
    @IBOutlet weak var previewView: PreviewView!
    @IBOutlet weak var cutoutView: UIView!
    @IBOutlet weak var mainView: UIView!
    @IBOutlet weak var headerView: UIView!
    @IBOutlet weak var bottomView: UIView!
    @IBOutlet weak var plateNumberView: UIView!
    @IBOutlet weak var loadUI: UIView!
    
    @IBOutlet weak var numberView: UILabel!
    @IBOutlet weak var borderScan: UIView!
    @IBOutlet weak var fieldInput1: TextFieldView!
    @IBOutlet weak var fieldInput2: TextFieldView!
    @IBOutlet weak var buttonBottomLeft: ButtonView!
    @IBOutlet weak var buttonBottomRight: ButtonView!
    @IBOutlet weak var buttonBack: UIButton!
    @IBOutlet weak var buttonLogout: ButtonView!
    
	var maskLayer = CAShapeLayer()

	var currentOrientation = UIDeviceOrientation.portrait
	
	// MARK: - Capture related objects
	private let captureSession = AVCaptureSession()
    let captureSessionQueue = DispatchQueue(label: "com.mjitec.detectPlateNumber.CaptureSessionQueue")
    
	var captureDevice: AVCaptureDevice?
    
	var videoDataOutput = AVCaptureVideoDataOutput()
    let videoDataOutputQueue = DispatchQueue(label: "com.mjitec.detectPlateNumber.VideoDataOutputQueue")
    
	// MARK: - Region of interest (ROI) and text orientation
	var regionOfInterest = CGRect(x: 0, y: 0, width: 1, height: 1)
	var textOrientation = CGImagePropertyOrientation.up
	
	// MARK: - Coordinate transforms
	var bufferAspectRatio: Double!
	var uiRotationTransform = CGAffineTransform.identity
	var bottomToTopTransform = CGAffineTransform(scaleX: 1, y: -1).translatedBy(x: 0, y: -1)
	var roiToGlobalTransform = CGAffineTransform.identity
	
	// Vision -> AVF coordinate transform.
	var visionToAVFTransform = CGAffineTransform.identity
    
    var borderOfInterest = UIView()
    
    var posCut = CGFloat();
    var posPreview = CGFloat();
    var posBottom = CGFloat();
    var posPlateNumber = CGFloat();
    var posHeader = CGFloat();
    var plateNumber = "";
  
  override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
      return .landscape
  }
  
  override var preferredInterfaceOrientationForPresentation: UIInterfaceOrientation {
      return .landscapeLeft
  }
	
	// MARK: - View controller methods
	
	override func viewDidLoad() {
		super.viewDidLoad()
		
    // Load existed plate number
    if (!prefix.isEmpty && !suffix.isEmpty) {
      let plateNumber = prefix + "-" + suffix;
      showString(string: plateNumber);
    }
    
		// Set up preview view.
		previewView.session = captureSession
		
		// Set up cutout view.
		cutoutView.backgroundColor = UIColor.gray.withAlphaComponent(0.8)
		maskLayer.backgroundColor = UIColor.clear.cgColor
		maskLayer.fillRule = .evenOdd
		cutoutView.layer.mask = maskLayer
		
        captureSessionQueue.async {
            self.setupCamera()
            DispatchQueue.main.async {
                // Figure out initial ROI.
                self.calculateRegionOfInterest(_handleOrientation: true)
            }
        }
        
        posCut = cutoutView.frame.origin.y
        posPreview = previewView.frame.origin.y
        posBottom = bottomView.frame.origin.y
        posPlateNumber = plateNumberView.frame.origin.y
        posHeader = headerView.frame.origin.y
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
        
        buttonBottomLeft.addTarget(self, action: #selector(clickButtonBottomLeft), for: .touchUpInside)
        buttonBottomRight.addTarget(self, action: #selector(clickButtonBottomRight), for: .touchUpInside)
        buttonBack.addTarget(self, action: #selector(clickButtonBack), for: .touchUpInside)
        buttonLogout.addTarget(self, action: #selector(clickButtonLogout), for: .touchUpInside)
    
        fieldInput1.addTarget(self, action: #selector(valueDidChange), for: .editingChanged)
        fieldInput1.delegate = self
        fieldInput2.delegate = self
	}
    
    @objc func clickButtonBottomLeft(_ sender: ButtonView){
        if self.plateNumber != "" {
            print("Click Button Reset")
            captureSessionQueue.async {
                if !self.captureSession.isRunning {
                    self.captureSession.startRunning()
                }
                DispatchQueue.main.async {
                    self.plateNumber = ""
                    // self.numberView.isHidden = true
                    self.plateNumberView.isHidden = true
                    self.loadUI.isHidden = false
                    self.changeButtonAfterGetPlateNumber(_reset: true)
                }
            }
        } else {
          print("Click Button Left: Manual Input")
          let jsonObject: Any = ["VisionScanManual": "manual"];
          let dataDict:[String: Any] = ["VisionScanManual": jsonObject];
          NotificationCenter.default.post(name: NSNotification.Name("VisionScanSendNotification"), object: nil, userInfo: dataDict);
          DispatchQueue.main.async {
            self.closeUI()
          }
        }
    }
    
    @objc func clickButtonBottomRight(_ sender: ButtonView){
        if self.plateNumber != "" {
            print("Click Button Right")
            let jsonObject: Any = [
              "VisionScanDone": [
                "prefix": self.fieldInput1.text,
                "suffix": self.fieldInput2.text,
              ]
            ];
            let dataDict:[String: Any] = ["VisionScanDone": jsonObject];
            NotificationCenter.default.post(name: NSNotification.Name("VisionScanSendNotification"), object: nil, userInfo: dataDict);
        }
    }
    
    @objc func clickButtonBack(_ sender: ButtonView){
      print("Click Button Back")
      let jsonObject: Any = ["VisionScanBack": "back"];
      let dataDict:[String: Any] = ["VisionScanBack": jsonObject];
      NotificationCenter.default.post(name: NSNotification.Name("VisionScanSendNotification"), object: nil, userInfo: dataDict);
      DispatchQueue.main.async {
        self.closeUI()
      }
    }
    
    @objc func clickButtonLogout(_ sender: ButtonView){
      print("Click Button Logout")
      let jsonObject: Any = ["VisionScanLogout": "logout"];
      let dataDict:[String: Any] = ["VisionScanLogout": jsonObject];
      NotificationCenter.default.post(name: NSNotification.Name("VisionScanSendNotification"), object: nil, userInfo: dataDict);
      DispatchQueue.main.async {
        self.closeUI()
      }
    }
    
    func changeButtonAfterGetPlateNumber(_reset: Bool = false){
        if _reset {
            buttonBottomLeft.backgroundColor = UIColor.init(red: 253/255, green: 151/255, blue: 2/255, alpha: 1)
            buttonBottomLeft.setTitle("手動輸入", for: .normal)
            buttonBottomRight.backgroundColor = UIColor.init(red: 169/255, green: 169/255, blue: 169/255, alpha: 1)
            bottomView.backgroundColor = UIColor.init(white: 0, alpha: 1)
        } else {
            buttonBottomLeft.backgroundColor = UIColor.init(red: 68/255, green: 68/255, blue: 68/255, alpha: 1)
            buttonBottomLeft.setTitle("重新辨識", for: .normal)
            buttonBottomRight.backgroundColor = UIColor.init(red: 253/255, green: 151/255, blue: 2/255, alpha: 1)
            bottomView.backgroundColor = UIColor.init(white: 0, alpha: 0)
        }
    }
    
    @objc func keyboardWillShow(notification: NSNotification) {
        if let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            if( mainView.frame.origin.y == 0 ){
                headerView.subviews.first?.frame.origin.y += keyboardSize.height
                mainView.frame.origin.y -= keyboardSize.height
            }
        }
    }

    @objc func keyboardWillHide(notification: NSNotification) {
        if( mainView.frame.origin.y != 0 ){
            headerView.subviews.first?.frame.origin.y = 0
            mainView.frame.origin.y = 0
        }
    }
  
  @objc func valueDidChange(_ textField: TextFieldView) {
     guard let text = textField.text else { return }
     let maxLength = 3
     switch textField {
      case fieldInput1 where text.count >= maxLength:
         fieldInput2.becomeFirstResponder()
       default:
           break
     }
   }
	
	override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
		super.viewWillTransition(to: size, with: coordinator)

		let deviceOrientation = UIDevice.current.orientation
		if deviceOrientation.isPortrait || deviceOrientation.isLandscape {
			currentOrientation = deviceOrientation
		}
		
		if let videoPreviewLayerConnection = previewView.videoPreviewLayer.connection {
			if let newVideoOrientation = AVCaptureVideoOrientation(deviceOrientation: deviceOrientation) {
				videoPreviewLayerConnection.videoOrientation = newVideoOrientation
			}
		}
		
		// Orientation changed: figure out new region of interest (ROI).
		calculateRegionOfInterest()
	}
	
	override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews()
		updateCutout()
	}
	
	// MARK: - Setup
	
    func calculateRegionOfInterest(_handleOrientation: Bool = false) {
		let desiredHeightRatio = 0.25
		let desiredWidthRatio = 0.4
		let maxPortraitWidth = 0.8
        
        if _handleOrientation {
            let deviceOrientation = UIDevice.current.orientation
            if deviceOrientation.isPortrait || deviceOrientation.isLandscape {
                currentOrientation = deviceOrientation
            }
            
            if let videoPreviewLayerConnection = previewView.videoPreviewLayer.connection {
                if let newVideoOrientation = AVCaptureVideoOrientation(deviceOrientation: deviceOrientation) {
                    videoPreviewLayerConnection.videoOrientation = newVideoOrientation
                }
            }
        }
		
		// Figure out size of ROI.
		let size: CGSize
//		if currentOrientation.isPortrait || currentOrientation == .unknown {
//			size = CGSize(width: min(desiredWidthRatio * bufferAspectRatio, maxPortraitWidth), height: desiredHeightRatio / bufferAspectRatio)
//		} else {
			size = CGSize(width: desiredWidthRatio, height: desiredHeightRatio)
//		}
		// Make it centered.
        regionOfInterest.origin = CGPoint(x: (1 - size.width) / 2, y: (1 - size.height) / 2 + 0.1)
		regionOfInterest.size = size
		
		// ROI changed, update transform.
		setupOrientationAndTransform()
		
		// Update the cutout to match the new ROI.
		DispatchQueue.main.async {
			self.updateCutout()
      	self.borderScan.isHidden = false
		}
	}
  
  func closeUI(){
    let transition = CATransition()
    transition.duration = 0.5
    transition.type = CATransitionType.push
    transition.subtype = CATransitionSubtype.fromLeft
    transition.timingFunction = CAMediaTimingFunction(name:CAMediaTimingFunctionName.easeInEaseOut)
    UIApplication.shared.keyWindow?.layer.add(transition, forKey: kCATransition)
    self.dismiss(animated: false, completion: nil);
  }
	
	func updateCutout() {
		// Figure out where the cutout ends up in layer coordinates.
		let roiRectTransform = bottomToTopTransform.concatenating(uiRotationTransform)
		let cutout = previewView.videoPreviewLayer.layerRectConverted(fromMetadataOutputRect: regionOfInterest.applying(roiRectTransform))
		
		// Create the mask.
		let path = UIBezierPath(rect: cutoutView.frame)
    path.append(UIBezierPath(roundedRect: cutout, cornerRadius: 10.0))
		maskLayer.path = path.cgPath

		//Border style
		borderScan.frame.origin = CGPoint(x: cutout.origin.x - 3, y: cutout.origin.y - 3)
    borderScan.frame.size = CGSize(width: cutout.size.width + 6, height: cutout.size.height + 6)
    borderScan.layer.cornerRadius = 12
    borderScan.layer.backgroundColor = UIColor.white.cgColor
		
		var numFrame = cutout
		numFrame.origin.y += numFrame.size.height
		numberView.frame = numFrame
	}
	
	func setupOrientationAndTransform() {
		let roi = regionOfInterest
		roiToGlobalTransform = CGAffineTransform(translationX: roi.origin.x, y: roi.origin.y).scaledBy(x: roi.width, y: roi.height)
		
		switch currentOrientation {
		case .landscapeLeft:
			textOrientation = CGImagePropertyOrientation.up
			uiRotationTransform = CGAffineTransform.identity
		case .landscapeRight:
			textOrientation = CGImagePropertyOrientation.down
			uiRotationTransform = CGAffineTransform(translationX: 1, y: 1).rotated(by: CGFloat.pi)
//		case .portraitUpsideDown:
//			textOrientation = CGImagePropertyOrientation.left
//			uiRotationTransform = CGAffineTransform(translationX: 1, y: 0).rotated(by: CGFloat.pi / 2)
//		default:
//			textOrientation = CGImagePropertyOrientation.right
//			uiRotationTransform = CGAffineTransform(translationX: 0, y: 1).rotated(by: -CGFloat.pi / 2)
      default:
        textOrientation = CGImagePropertyOrientation.up
        uiRotationTransform = CGAffineTransform.identity
		}
		
		visionToAVFTransform = roiToGlobalTransform.concatenating(bottomToTopTransform).concatenating(uiRotationTransform)
	}
	
	func setupCamera() {
		guard let captureDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: AVMediaType.video, position: .back) else {
			print("Could not create capture device.")
			return
		}
		self.captureDevice = captureDevice
		
		if captureDevice.supportsSessionPreset(.hd4K3840x2160) {
			captureSession.sessionPreset = AVCaptureSession.Preset.hd4K3840x2160
			bufferAspectRatio = 3840.0 / 2160.0
		} else {
			captureSession.sessionPreset = AVCaptureSession.Preset.hd1920x1080
			bufferAspectRatio = 1920.0 / 1080.0
		}
		
		guard let deviceInput = try? AVCaptureDeviceInput(device: captureDevice) else {
			print("Could not create device input.")
			return
		}
		if captureSession.canAddInput(deviceInput) {
			captureSession.addInput(deviceInput)
		}
        
		
		// Configure video data output.
		videoDataOutput.alwaysDiscardsLateVideoFrames = true
		videoDataOutput.setSampleBufferDelegate(self, queue: videoDataOutputQueue)
		videoDataOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange]
		if captureSession.canAddOutput(videoDataOutput) {
			captureSession.addOutput(videoDataOutput)
			videoDataOutput.connection(with: AVMediaType.video)?.preferredVideoStabilizationMode = .off
		} else {
			print("Could not add VDO output")
			return
		}
		
		// Set zoom and autofocus to help focus on very small text.
		do {
			try captureDevice.lockForConfiguration()
			captureDevice.videoZoomFactor = 2
			captureDevice.autoFocusRangeRestriction = .near
			captureDevice.unlockForConfiguration()
		} catch {
			print("Could not set zoom level due to error: \(error)")
			return
		}
		
		captureSession.startRunning()
	}
	
	// MARK: - UI drawing and interaction
	
	func showString(string: String) {
		captureSessionQueue.sync {
			self.captureSession.stopRunning()
            DispatchQueue.main.async {
                // self.numberView.text = string
                // self.numberView.isHidden = false
                self.plateNumber = string
                let stringArr = string.components(separatedBy: "-")
                self.plateNumberView.isHidden = false
                self.loadUI.isHidden = true
                self.changeButtonAfterGetPlateNumber()
                self.fieldInput1.text = stringArr[0]
                self.fieldInput2.text = stringArr[1]
            }
		}
	}
	
	@IBAction func handleTap(_ sender: UITapGestureRecognizer) {
        captureSessionQueue.async {
            if !self.captureSession.isRunning {
                self.captureSession.startRunning()
            }
            DispatchQueue.main.async {
                self.numberView.isHidden = true
            }
        }
	}
}

// MARK: - AVCaptureVideoDataOutputSampleBufferDelegate

extension ViewController: AVCaptureVideoDataOutputSampleBufferDelegate {
	
	func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
		// This is implemented in VisionViewController.
	}
}

// MARK: - Utility extensions

extension AVCaptureVideoOrientation {
	init?(deviceOrientation: UIDeviceOrientation) {
		switch deviceOrientation {
//      case .portrait: self = .portrait
//      case .portraitUpsideDown: self = .portraitUpsideDown
      case .landscapeLeft: self = .landscapeRight
      case .landscapeRight: self = .landscapeLeft
      default: self = .landscapeRight
		}
	}
}

extension ViewController: UITextFieldDelegate {
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    let isDeleted = range.length > 0
    if isDeleted {
      return true
    } else if let _ = string.rangeOfCharacter(from: NSCharacterSet.alphanumerics) {
      return true
    } else {
      return false
    }
  }
}
