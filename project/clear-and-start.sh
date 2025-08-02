#!/bin/bash

echo "Clearing all caches and restarting Expo..."

# Clear npm cache
npm cache clean --force

# Clear Expo cache
npx expo start --clear

echo "Development server started with cleared cache!"
