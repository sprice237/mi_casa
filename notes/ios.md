# iOS
## Running on physical device

`npm run ios -- --device` or `npx expo run:ios --device`

Need to sign https://github.com/expo/fyi/blob/main/setup-xcode-signing.md

## Building with EAS

Can use Expo's cloud build service, or can do it locally

`npx eas build --platform ios --local`

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