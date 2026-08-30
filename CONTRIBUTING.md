# Contributing to Vesta Control Panel

First off, thank you for considering contributing to Vesta! It's people like you that make Vesta such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Be collaborative
- Be patient and welcoming
- Focus on what is best for the community

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible using the issue template:

- **Operating System** (OS/Version)
- **VestaCP Version**
- **Installed Software** (what you installed with the installer)
- **Steps to Reproduce**
- **Expected vs Actual Behavior**
- **Error Messages/Logs**
- **Related Issues/Forum Threads**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear description** of the suggested enhancement
- **Use case** explaining why this would be useful
- **Possible implementation** approach (if you have ideas)
- **Examples** from other projects (if applicable)

### Pull Requests

1. **Fork the repository** and create your branch from `master`
2. **Follow the coding style** (see below)
3. **Test your changes** thoroughly
4. **Update documentation** as needed
5. **Write clear commit messages**
6. **Submit your pull request**

#### Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update the README.md or documentation with details of changes if applicable
3. The PR must pass all CI checks (once implemented)
4. Your PR will be reviewed by maintainers
5. Make requested changes if needed
6. Once approved, a maintainer will merge your PR

## Development Setup

### Prerequisites

- Linux development environment (or WSL on Windows)
- Bash 4.0+
- PHP 7.4+
- Node.js 18+ (for React development)
- Git

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/outroll/vesta.git
cd vesta

# For React UI development
cd src/react
npm install
npm start

# For testing changes
cd test
bash test_actions.sh
```

### Project Structure

```
vesta/
├── bin/          # CLI commands - executable bash scripts
│   └── v-*       # All CLI commands follow v-{action}-{resource} pattern
├── func/         # Bash function libraries
│   ├── main.sh   # Core functions
│   ├── domain.sh # Domain-related functions
│   └── db.sh     # Database functions
├── install/      # Installation scripts for different OS
├── src/
│   ├── react/    # Modern React UI
│   └── deb/      # Debian packages
├── web/          # Traditional PHP web interface
│   ├── api/      # REST API endpoints
│   └── templates/# HTML templates
├── test/         # Test scripts
└── upd/          # Update/migration scripts
```

## Coding Standards

### Bash Scripts

Follow the style guide in `src/bash_coding_style.txt`:

```bash
# Use meaningful variable names
user="admin"
domain="example.com"

# Always quote variables
echo "Processing domain: $domain"

# Use function for repeated code
check_user() {
    local user=$1
    if [ -z "$user" ]; then
        echo "Error: user not specified"
        exit 1
    fi
}

# Add comments for complex logic
# Check if user is suspended
if [ "$SUSPENDED" = 'yes' ]; then
    echo "Error: user is suspended"
    exit 1
fi
```

### PHP Code

```php
<?php
// Use PSR-2 coding standard
// Always escape output
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Use prepared statements for database queries
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
```

### React/JavaScript

```javascript
// Use modern ES6+ syntax
// Follow React best practices
// Use functional components with hooks

import React, { useState, useEffect } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  return <div>{/* JSX */}</div>;
};

export default MyComponent;
```

### Commit Messages

Write clear, descriptive commit messages:

```
Short summary (50 chars or less)

More detailed explanation if needed. Wrap at 72 characters.
Explain the problem this commit solves and why you chose
this solution.

- Bullet points are okay
- Use present tense ("Add feature" not "Added feature")
- Reference issues: "Fixes #123" or "Related to #456"
```

Good examples:
- `Add PostgreSQL 14 support`
- `Fix SSL certificate renewal for wildcard domains`
- `Update React dependencies to fix security vulnerabilities`

Bad examples:
- `fixed bug`
- `update`
- `WIP`

## Testing

### Running Tests

```bash
cd test
bash test_actions.sh

# Test specific functionality
bash test_json_listing.sh
```

### Manual Testing

Before submitting a PR:

1. Test installation on a clean VM
2. Test affected features manually
3. Check for error messages in logs
4. Verify backward compatibility
5. Test on multiple supported OS versions

## Documentation

When adding new features:

1. Update relevant documentation in `README.md`
2. Add inline code comments for complex logic
3. Update API documentation if API changes
4. Add examples for new CLI commands

## Security

- **Never** commit sensitive data (passwords, keys, tokens)
- Always validate and sanitize user input
- Use prepared statements for SQL queries
- Escape output in HTML contexts
- Follow principle of least privilege
- Report security vulnerabilities to dev@vestacp.com (not in public issues)

## Building and Releasing

Maintainers handle releases. The process includes:

1. Update version numbers
2. Update CHANGELOG.md
3. Create git tag
4. Build packages
5. Publish release on GitHub

## Community

- **Forum:** [forum.vestacp.com](https://forum.vestacp.com/)
- **Gitter Chat:** [vesta-cp/Lobby](https://gitter.im/vesta-cp/Lobby)
- **GitHub Issues:** For bug reports and feature requests

## Questions?

Don't hesitate to ask questions in our Gitter chat or forum. We're here to help!

## License

By contributing to Vesta, you agree that your contributions will be licensed under the GPLv3 License.

---

Thank you for contributing to Vesta Control Panel!
