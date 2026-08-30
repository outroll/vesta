# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| 0.9.8   | :white_check_mark: |
| < 0.9.8 | :x:                |

## Reporting a Vulnerability

We take the security of Vesta Control Panel seriously. If you discover a security vulnerability, please follow these guidelines:

### Please Do:

1. **Email us directly** at dev@vestacp.com
2. **Provide detailed information:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)
3. **Allow reasonable time** for us to respond and fix the issue before public disclosure
4. **Encrypt sensitive information** using our PGP key (if available on our website)

### Please Don't:

- Publicly disclose the vulnerability before we've had a chance to address it
- Test the vulnerability on production systems you don't own
- Exploit the vulnerability for malicious purposes
- Demand compensation (we appreciate responsible disclosure but don't offer bug bounties)

### What to Expect:

1. **Initial Response:** Within 48 hours
2. **Status Update:** Within 7 days
3. **Fix Timeline:** Depends on severity
   - Critical: 1-7 days
   - High: 7-30 days
   - Medium: 30-90 days
   - Low: Next planned release

### Security Best Practices for Users:

1. **Keep Updated:** Always run the latest version
2. **Strong Passwords:** Use strong, unique passwords for all accounts
3. **Firewall:** Keep firewall enabled and properly configured
4. **SSH Keys:** Use SSH keys instead of password authentication
5. **Regular Backups:** Maintain regular backups of your data
6. **Limited Access:** Only grant necessary permissions to users
7. **Monitor Logs:** Regularly review system and access logs
8. **SSL/TLS:** Use HTTPS for all web interfaces

### Known Security Considerations:

- Vesta requires root access to function - ensure physical/network security
- Keep PHP, MySQL, and other services updated independently
- Regularly review user accounts and permissions
- Monitor for brute-force attempts in logs
- Use fail2ban to prevent brute-force attacks (included by default)

### Security Updates:

Security updates are announced via:
- GitHub Security Advisories
- Gitter Chat
- Forum announcements
- Email notifications (if subscribed)

### Hall of Fame:

We acknowledge security researchers who responsibly disclose vulnerabilities:
- (Contributors will be listed here with their permission)

## Security Features:

Vesta includes several security features:

- **Fail2ban Integration:** Automatic IP blocking for failed login attempts
- **Firewall Management:** Built-in iptables configuration
- **SSL/TLS Support:** Let's Encrypt integration
- **User Isolation:** Each user has isolated environment
- **Command Validation:** Input validation on all CLI commands
- **Session Management:** Secure session handling
- **CSRF Protection:** Token-based CSRF protection
- **SQL Injection Prevention:** Prepared statements used throughout

### Audit:

We welcome security audits from the community. If you're interested in performing a comprehensive security audit:

1. Contact us at dev@vestacp.com
2. Describe your audit scope and methodology
3. We'll provide support and documentation as needed
4. Share findings responsibly

## Contact:

- Email: dev@vestacp.com
- Encrypted communication: (PGP key available on request)
- GitHub Security: Use GitHub's security advisory feature

Thank you for helping keep Vesta and its users safe!
