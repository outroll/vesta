#!/bin/bash
# PHP Static Analysis Script (no PHP required)

echo "=== PHP Static Analysis ==="
echo ""

# Count total PHP files
total=$(find web bin -name "*.php" -type f | wc -l)
echo "Total PHP files: $total"
echo ""

# Check for common syntax errors
echo "1. Checking for unclosed PHP tags..."
unclosed=$(grep -l "<?php" web/**/*.php bin/v-* 2>/dev/null | while read file; do
    if [[ "$file" == *.php ]]; then
        if ! grep -q "?>" "$file" && ! grep -q "^\s*$" "$file" | tail -1; then
            echo "$file"
        fi
    fi
done | wc -l)
echo "   Files with potential unclosed tags: $unclosed"

# Check for deprecated functions
echo ""
echo "2. Checking for deprecated PHP functions..."
deprecated_funcs="create_function|each|mysql_connect|mysql_query|split|ereg|magic_quotes"
deprecated=$(grep -r -E "($deprecated_funcs)\s*\(" web/ bin/ --include="*.php" 2>/dev/null | grep -v "// " | wc -l)
echo "   Deprecated function calls found: $deprecated"
if [ $deprecated -gt 0 ]; then
    grep -r -E "($deprecated_funcs)\s*\(" web/ bin/ --include="*.php" 2>/dev/null | grep -v "// " | head -10
fi

# Check for short tags
echo ""
echo "3. Checking for short PHP tags (<?  instead of <?php)..."
short_tags=$(grep -r "<?\s" web/ --include="*.php" 2>/dev/null | grep -v "<?php" | grep -v "<?xml" | wc -l)
echo "   Short tags found: $short_tags"

# Check for common security issues
echo ""
echo "4. Checking for potential security issues..."
echo "   a. Potential SQL injection (direct \$_GET/\$_POST in queries):"
sql_inject=$(grep -r "query.*\$_\(GET\|POST\|REQUEST\)" web/ --include="*.php" 2>/dev/null | wc -l)
echo "      Found: $sql_inject potential issues"

echo "   b. Potential XSS (direct echo of user input):"
xss=$(grep -r "echo.*\$_\(GET\|POST\|REQUEST\)" web/ --include="*.php" 2>/dev/null | wc -l)
echo "      Found: $xss potential issues"

echo "   c. Dangerous functions (eval, exec without escapeshellarg):"
dangerous=$(grep -r "\(eval\|exec\|system\|passthru\|shell_exec\)(" web/ --include="*.php" 2>/dev/null | grep -v escapeshellarg | wc -l)
echo "      Found: $dangerous uses"

# Check for error_reporting(NULL) - PHP 8.1+ deprecation
echo ""
echo "5. Checking for error_reporting(NULL) - PHP 8.1+ deprecation..."
error_null=$(grep -r "error_reporting(NULL)" web/ bin/ --include="*.php" 2>/dev/null | wc -l)
echo "   Found: $error_null instances (should be 0)"

# Check for consistent coding style
echo ""
echo "6. Checking code structure..."
echo "   a. Files with proper opening tags:"
proper_tags=$(grep -l "<?php" web/**/*.php 2>/dev/null | wc -l)
echo "      Found: $proper_tags files"

echo "   b. Files using htmlspecialchars/htmlentities for output:"
safe_output=$(grep -r "htmlspecialchars\|htmlentities" web/ --include="*.php" 2>/dev/null | wc -l)
echo "      Found: $safe_output usages"

# Summary
echo ""
echo "=== Summary ==="
echo "Total PHP files analyzed: $total"
echo "Potential issues to review:"
echo "  - Deprecated functions: $deprecated"
echo "  - Short tags: $short_tags"
echo "  - SQL injection risks: $sql_inject"
echo "  - XSS risks: $xss"
echo "  - Dangerous functions: $dangerous"
echo "  - error_reporting(NULL): $error_null"
echo ""

if [ $deprecated -eq 0 ] && [ $error_null -eq 0 ]; then
    echo "✓ PHP 8 compatibility: GOOD"
else
    echo "⚠ PHP 8 compatibility: NEEDS REVIEW"
fi
