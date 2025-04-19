# Copy Reference & Paste Tool For Java

🚀 A VSCode extension for enhancing Java development with powerful reference copying and automatic import management functionality.

## ✨ Features

- **Copy Java References** with a simple right-click
- **Automatic Import Management** when pasting references
- **Smart Reference Formatting** based on element type
- Support for all Java elements:
  - Classes & Interfaces
  - Methods & Constructors
  - Fields & Constants
  - Enums & Annotations

## 🔥 Why You Need This

This extension helps you save time and reduce errors by quickly copying and pasting fully qualified references with proper imports. It's especially useful for developers working with complex Java codebases.

## 📋 Usage
<img width="659" alt="image" src="https://github.com/user-attachments/assets/1944af69-c1ee-420b-aa03-3fa083f82353" />


### Copy a Reference

1. Open any Java file
2. Place your cursor on a Java element (class, method, field, etc.)
3. Right-click and select "Copy Java Reference"
4. The fully qualified reference is copied to your clipboard

### Paste with Automatic Import

1. Copy a Java reference using the extension
2. Navigate to where you want to use the reference
3. Right-click and select "Paste Java Reference with Import"
4. The extension automatically:
   - Adds the appropriate import statement
   - Inserts the simplified reference at cursor position
   - Formats the reference according to its type

### Element-Specific Behavior

#### Classes, Interfaces, and Enums
- Copies: `com.example.User`
- Pastes: `User` with import added

#### Methods
- Copies: `com.example.User.getId`
- Pastes: `User.getId()` with import added

#### Fields
- Copies: `com.example.User.STATUS`
- Pastes: `User.STATUS` with import added

## 🛠️ Requirements

- VS Code 1.60.0 or higher
- Java extension for VS Code

## 👨‍💻 Contributing

Contributions are welcome! Feel free to submit issues or pull requests on our [GitHub repository](https://github.com/hendiaome/java-reference-tool).

## 📝 Release Notes

### 1.0.3
- Performance improvements and bug fixes

### 1.0.1
- Change name

### 1.0.0

- Full support for classes, interfaces, enums, methods and fields
- Smart reference detection and formatting
- Automatic import management
- Method references with proper parentheses handling