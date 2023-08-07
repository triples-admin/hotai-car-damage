import Foundation
import UIKit
import AVFoundation
import Vision

class VisionViewController: ViewController {
	var request: VNRecognizeTextRequest!
	let numberTracker = StringTracker()
	
	override func viewDidLoad() {
		request = VNRecognizeTextRequest(completionHandler: recognizeTextHandler)
		super.viewDidLoad()
	}
	
	// MARK: - Text recognition
	
	// Vision recognition handler.
	func recognizeTextHandler(request: VNRequest, error: Error?) {
		var numbers = [String]()
		var redBoxes = [CGRect]()
		var greenBoxes = [CGRect]()
		
		guard let results = request.results as? [VNRecognizedTextObservation] else {
			return
		}
		
		let maximumCandidates = 1
		
		for visionResult in results {
			guard let candidate = visionResult.topCandidates(maximumCandidates).first else { continue }
			
			var numberIsSubstring = true
            
			if let result = candidate.string.extractPlateNumber() {
				let (range, number) = result
				if let box = try? candidate.boundingBox(for: range)?.boundingBox {
					numbers.append(number)
					greenBoxes.append(box)
					numberIsSubstring = !(range.lowerBound == candidate.string.startIndex && range.upperBound == candidate.string.endIndex)
				}
			}
			if numberIsSubstring {
				redBoxes.append(visionResult.boundingBox)
			}
            
		}
		
		// Log any found numbers.
		numberTracker.logFrame(strings: numbers)
		
		if let sureNumber = numberTracker.getStableString() {
			showString(string: sureNumber)
			numberTracker.reset(string: sureNumber)
            print("--------------------- sureNumber: " + sureNumber)
		}
	}
	
	override func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
		if let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) {
			// Configure for running in real-time.
			request.recognitionLevel = .accurate
			request.usesLanguageCorrection = true
			request.regionOfInterest = regionOfInterest
      request.usesCPUOnly = false
      request.revision = Int(0)
      request.recognitionLanguages = ["en-US"]
			
			let requestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: textOrientation, options: [:])
			do {
				try requestHandler.perform([request])
			} catch {
				print(error)
			}
		}
	}
	
	// MARK: - Bounding box drawing
	
	// Draw a box on screen. Must be called from main queue.
	var boxLayer = [CAShapeLayer]()
	func draw(rect: CGRect, color: CGColor) {
		let layer = CAShapeLayer()
		layer.opacity = 0.5
		layer.borderColor = color
		layer.borderWidth = 1
		layer.frame = rect
		boxLayer.append(layer)
		previewView.videoPreviewLayer.insertSublayer(layer, at: 1)
	}
	
	// Remove all drawn boxes. Must be called on main queue.
	func removeBoxes() {
		for layer in boxLayer {
			layer.removeFromSuperlayer()
		}
		boxLayer.removeAll()
	}
	
	typealias ColoredBoxGroup = (color: CGColor, boxes: [CGRect])
	
	// Draws groups of colored boxes.
	func show(boxGroups: [ColoredBoxGroup]) {
		DispatchQueue.main.async {
			let layer = self.previewView.videoPreviewLayer
			self.removeBoxes()
			for boxGroup in boxGroups {
				let color = boxGroup.color
				for box in boxGroup.boxes {
					let rect = layer.layerRectConverted(fromMetadataOutputRect: box.applying(self.visionToAVFTransform))
					self.draw(rect: rect, color: color)
				}
			}
		}
	}
}
