#!/bin/bash
echo "=== Dependency Usage Analysis ===" 

# Get all dependencies from package.json
echo ""
echo "Dependencies declared in package.json:"
grep -A 100 '"dependencies"' package.json | grep '": "' | wc -l

# Check which are actually imported
echo ""
echo "Checking actual usage in source code..."
echo ""

# Sample some key dependencies
deps=("react" "react-dom" "react-router-dom" "redux" "axios" "bootstrap" "dayjs" "jquery")

for dep in "${deps[@]}"; do
    count=$(grep -r "from ['\"]$dep" src/ 2>/dev/null | wc -l)
    if [ $count -gt 0 ]; then
        echo "✓ $dep: $count imports"
    else
        # Check for require
        count=$(grep -r "require(['\"]$dep" src/ 2>/dev/null | wc -l)
        if [ $count -gt 0 ]; then
            echo "✓ $dep: $count requires"
        else
            echo "⚠ $dep: No direct imports (may be used differently)"
        fi
    fi
done

echo ""
echo "Note: Some dependencies may be:"
echo "- Used only in index.html"
echo "- Peer dependencies"
echo "- Build tool dependencies"
echo "- Indirectly imported"
