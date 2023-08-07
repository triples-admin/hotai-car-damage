import UIKit

class TextFieldView: UITextField {
    // MARK: - Limit Characters
    var maxLength: Int = 4
    override func willMove(toSuperview newSuperview: UIView?) {
        addTarget(self, action: #selector(editingChanged), for: .editingChanged)
        editingChanged()
    }
    
    @objc func editingChanged() {
      text = String(text!.prefix(maxLength).uppercased())
    }
    
    // MARK: - init Style TextField
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.layer.cornerRadius = 8
        self.layer.borderWidth = 5
        self.layer.borderColor = CGColor.init(red: 169/255, green: 169/255, blue: 169/255, alpha: 1)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        self.layer.cornerRadius = 8
        self.layer.borderWidth = 5
        self.layer.borderColor = CGColor.init(red: 169/255, green: 169/255, blue: 169/255, alpha: 1)
    }
}
