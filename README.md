# IDEA Copy Reference

A VSCode extension that provides IntelliJ IDEA-like "Copy Reference" functionality for Java code. This extension allows you to quickly copy qualified references to Java elements and automatically manage imports.

## Features

- Copy fully qualified references to Java elements:
  - Classes
  - Interfaces
  - Enums
  - Methods
  - Fields
- Automatically add import statements when pasting
- Smart reference formatting based on element type
- Simplified references on paste (turns `com.example.User` into `User`)

## Usage

### Copy a Reference

1. Open a Java file
2. Place your cursor on any Java element (class, interface, enum, method, field)
3. Right-click and select "Copy Java Reference" from the context menu
4. The fully qualified reference is copied to your clipboard

### Paste a Reference with Import

1. Copy a Java reference using the extension
2. Navigate to where you want to use the reference
3. Right-click and select "Paste Java Reference with Import" from the context menu
4. The extension will:
   - Automatically add the appropriate import statement
   - Insert the simplified reference at the cursor position
   - Format the reference according to its type (for methods, adds parentheses)

### Element-Specific Behavior

#### Classes, Interfaces, and Enums
- Copies fully qualified name: `com.example.User`
- Pastes simplified name with import: `User`

#### Methods
- Copies fully qualified method reference: `com.example.User.getId`
- Pastes method call with import: `User.getId();`

#### Fields
- Copies fully qualified field reference: `com.example.User.STATUS`
- Pastes field reference with import: `User.STATUS`


## Requirements

- VS Code 1.60.0 or higher
- Java extension for VS Code

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests on our [GitHub repository](https://github.com/hendiaome/idea-copy-reference).


## Release Notes

### 1.0.0

- Added support for interfaces, enums, methods and fields
- Improved reference detection and formatting
- Smart handling of method references with parentheses
