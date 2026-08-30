#!/bin/bash
echo "=== API Endpoint Structure Validation ==="
echo ""

# Find all API endpoints
api_dir="web/api/v1"
echo "Analyzing API endpoints in $api_dir..."
echo ""

# Count endpoints by category
echo "Endpoint Categories:"
for category in add delete edit list suspend unsuspend; do
    count=$(find $api_dir/$category -name "index.php" 2>/dev/null | wc -l)
    echo "  $category: $count endpoints"
done

echo ""
echo "Total API endpoints:"
find $api_dir -name "index.php" | wc -l

echo ""
echo "Structural Validation:"

# Check for common patterns
errors=0

# 1. Check all have $_SESSION check
echo -n "1. Checking CSRF token validation... "
total=$(find $api_dir -name "index.php" | wc -l)
with_csrf=$(grep -l "token" $api_dir/*/index.php $api_dir/*/*/index.php 2>/dev/null | wc -l)
echo "$with_csrf/$total have token checks"

# 2. Check for proper error handling
echo -n "2. Checking error handling... "
with_errors=$(grep -l "error.*=" $api_dir/*/index.php $api_dir/*/*/index.php 2>/dev/null | wc -l)
echo "$with_errors/$total have error handling"

# 3. Check for VESTA_CMD usage
echo -n "3. Checking CLI integration... "
with_cmd=$(grep -l "VESTA_CMD" $api_dir/*/index.php $api_dir/*/*/index.php 2>/dev/null | wc -l)
echo "$with_cmd/$total use CLI commands"

# 4. Check for escapeshellarg
echo -n "4. Checking security (escapeshellarg)... "
with_escape=$(grep -l "escapeshellarg" $api_dir/*/index.php $api_dir/*/*/index.php 2>/dev/null | wc -l)
echo "$with_escape/$total use escapeshellarg"

echo ""
echo "Sample Endpoint Categories Found:"
find $api_dir -type d -maxdepth 1 | tail -n +2 | sort | head -10

echo ""
echo "✓ API structure validation complete"
