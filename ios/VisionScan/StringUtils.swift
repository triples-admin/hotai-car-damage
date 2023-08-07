import Foundation

extension String {
  func extractPlateNumber() -> (Range<String.Index>, String)? {
    let pattern = #"""
      (?x)
      \b([A-Z]{2,3}-\d{4})|(\d{4}-[A-Z]{2,3})
      |(\d{4}-[A-Z]\d{1})|([A-Z]\d{1}-\d{4})|(\d{1}[A-Z]-\d{4})
      |(\d{4}-\d{2})
      """#
    
    guard let range = self.range(of: pattern, options: .regularExpression, range: nil, locale: nil) else {
      return nil
    }
    var plateNumber = ""
    let substring = String(self[range])
    plateNumber += substring
    
    var result = ""
    for char in plateNumber {
      result.append(char)
    }
    
    return (range, result)
  }
}

class StringTracker {
	var frameIndex: Int64 = 0
  var countIndex: Int64 = 0

	typealias StringObservation = (lastSeen: Int64, count: Int64)
	
	var seenStrings = [String: StringObservation]()
	var bestCount = Int64(0)
	var bestString = ""
  var lastString = ""

	func logFrame(strings: [String]) {
		for string in strings {
			if seenStrings[string] == nil {
				seenStrings[string] = (lastSeen: Int64(0), count: Int64(-1))
			}
			seenStrings[string]?.lastSeen = frameIndex
			seenStrings[string]?.count += 1
      lastString = string
			print("Seen \(string) \(seenStrings[string]?.count ?? 0) times")
		}
	
		var obsoleteStrings = [String]()

		for (string, obs) in seenStrings {
			if obs.lastSeen < frameIndex - 30 {
				obsoleteStrings.append(string)
			}
			
			let count = obs.count
			if !obsoleteStrings.contains(string) && count > bestCount {
				bestCount = Int64(count)
				bestString = string
			}
		}
		for string in obsoleteStrings {
			seenStrings.removeValue(forKey: string)
		}
    countIndex += 1
		frameIndex += 1
	}
	
	func getStableString() -> String? {
    if(countIndex == 0){
      lastString = ""
    }
#if DEBUG
    let hasSuitableString = bestCount >= 5 || countIndex >= 100
#else
    let hasSuitableString = bestCount >= 10 || countIndex >= 200
#endif
		if (hasSuitableString) {
      if(bestString == "" && lastString != ""){
        bestString = lastString
      } else if( bestString == "" ) {
        countIndex = 0
        return nil
      }
      countIndex = 0
      lastString = ""
      return bestString
		} else {
			return nil
		}
	}
	
	func reset(string: String) {
		seenStrings.removeValue(forKey: string)
		bestCount = 0
    bestString = ""
    countIndex = 0
    lastString = ""
	}
}
