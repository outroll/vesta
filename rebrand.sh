#!/bin/bash

# Check que tu es bien dans le dossier git
if [ ! -d .git ]; then
  echo "Error: Ce script doit être lancé dans la racine du repo git"
  exit 1
fi

# 1. Remplacement "devit" par "devit" (minuscules)
echo "Remplacement de 'devit' par 'devit'..."
find . -type f \( -name "*.sh" -o -name "*.php" -o -name "*.pl" -o -name "*.conf" -o -name "*.py" -o -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.txt" -o -name "*.md" -o -name "*.xml" \) -exec sed -i 's/devit/devit/g' {} +

git add .
git commit -m "rebrand: remplacer toutes les occurrences 'devit' par 'devit'"

# 2. Remplacement "DevIT" par "DevIT" (majuscules)
echo "Remplacement de 'DevIT' par 'DevIT'..."
find . -type f \( -name "*.sh" -o -name "*.php" -o -name "*.pl" -o -name "*.conf" -o -name "*.py" -o -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.txt" -o -name "*.md" -o -name "*.xml" \) -exec sed -i 's/DevIT/DevIT/g' {} +

git add .
git commit -m "rebrand: remplacer toutes les occurrences 'DevIT' par 'DevIT'"

echo "Rebranding terminé avec succès ! 🚀"