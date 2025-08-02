@echo off
echo Clearing all caches and restarting Expo...

REM Clear npm cache
npm cache clean --force

REM Clear Expo cache and start
npx expo start --clear

echo Development server started with cleared cache!
