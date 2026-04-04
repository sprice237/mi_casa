# iOS
## When in doubt

Run: `npx expo prebuild --clean`
Also: `npx expo-doctor`

## Running on physical device

`npm run ios -- --device` or `npx expo run:ios --device`

Need to sign https://github.com/expo/fyi/blob/main/setup-xcode-signing.md

## Building with EAS

Can use Expo's cloud build service, or can do it locally

`npx eas build --platform ios --local --clear-cache`

I had to downgrade @sentry/react-native, and now it needs `SENTRY_DISABLE_AUTO_UPLOAD=true` to disable automatic uploading of sourcemaps, which I haven't configured
For SOME REASON I can't just add this environment variable to any of the .env files. It has to be passed into the commandline like

`SENTRY_DISABLE_AUTO_UPLOAD=true npx eas build --platform ios --local --clear-cache`

https://docs.expo.dev/build-reference/local-builds/

I enrolled in the apple developer program on 2/23/2026, looks like it might take a full business day plus identity verification.

Looks like it's working now!

Fastlane is not available, make sure it's installed and in your PATH -- https://stackoverflow.com/questions/36369197/fastlane-command-not-found

`brew install fastlane`

install cocoapods with gem, not homebrew

install `ffi` with gem `sudo gem install ffi`
install `cocoapods` with gem
sudo gem install -n /usr/local/bin cocoapods


need to upgrade ruby: `brew install rbenv ruby-build`

https://stackoverflow.com/questions/60124435/however-this-package-itself-specifies-a-main-module-field-that-could-not-be-r

## Submitting app to AppStore

Can use EAS submit, but this still seems to use their cloud build service, which has pretty brutal free queue delay times

Trying Transporter instead: https://apps.apple.com/us/app/transporter/id1450874784

WAY faster. It's a GUI app though, so I'll still need a CLI solution. Apparently you can use fastlane for this.

`fastlane pilot upload --ipa /path/to/ipa`

This triggers an error. Apparently you need an app specific password. At first I thought by "app-specific" they meant my app, but I actually think they mean fastlane.

`FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=ztjw-ewqo-nfma-zzmi fastlane pilot upload --ipa /path/to/ipa`

## Troubleshooting: New splash screen not appearing on iOS

For SDK 52 and earlier, in iOS development builds, launch screens can sometimes remain cached between builds, making it harder to test new images. Apple recommends clearing the derived data directory before rebuilding, this can be done with Expo CLI by running:

npx expo run:ios --no-build-cache