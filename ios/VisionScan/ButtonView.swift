import UIKit

class ButtonView: UIButton {
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.layer.cornerRadius = self.frame.height/2
        self.layer.borderWidth = 3
        self.layer.borderColor = CGColor.init(red: 255, green: 255, blue: 255, alpha: 1)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        self.layer.cornerRadius = self.frame.height/2
        self.layer.borderWidth = 3
        self.layer.borderColor = CGColor.init(red: 255, green: 255, blue: 255, alpha: 1)
    }
}
