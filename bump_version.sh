#!/bin/bash

set -e

PACKAGE_JSON="package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "Error: $PACKAGE_JSON file not found!"
  exit 1
fi

VERSION_TYPE=${1:-3}

if [[ ! "$VERSION_TYPE" =~ ^[1-3]$ ]]; then
  echo "Error: Invalid version type specified. Use 1 for major, 2 for minor, or 3 for patch."
  exit 1
fi

CURRENT_VERSION=$(jq -r '.version' "$PACKAGE_JSON")

if [[ ! "$CURRENT_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Invalid version format in $PACKAGE_JSON. Expected format: x.y.z"
  exit 1
fi

IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"

MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $VERSION_TYPE in
  1)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  2)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  3)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

jq --arg new_version "$NEW_VERSION" '.version = $new_version' "$PACKAGE_JSON" > tmp.$$.json && mv tmp.$$.json "$PACKAGE_JSON"

echo "Version bumped to $NEW_VERSION"
