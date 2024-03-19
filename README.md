# VoteSwiper / WahlSwiper - App

[![Last Commit](https://img.shields.io/github/last-commit/movact/voteswiper-expo)](https://github.com/MOVACT/voteswiper-expo/commits) [![Open issues](https://img.shields.io/github/issues/movact/voteswiper-expo)](https://github.com/MOVACT/voteswiper-expo/issues) [![Follow WahlSwiper](https://img.shields.io/twitter/follow/wahlswiper)](https://www.twitter.com/wahlswiper)

VoteSwiper (in Germany better known as WahlSwiper) is a cross-platform voting advice app for Android, iOS and web browsers. The app is operated by [MOVACT](https://www.movact.de) primarily for German federale and state elections. The content for the surveys is researched and developed by various institutions, most recently mainly by political scientists at the University of Freiburg.

We started this project in 2017 for the federal election and since then grow a user base of over one million. While we operated closed source for a long time, we believe the right thing to do is to disclose the source code of the whole project for transparency.

## Development

The app is built with Expo (React Native). You can start the project, like any other Expo project, by running the following commands in the terminal. Head over to the Expo documentation [here](https://expo.dev) to learn more.

#### 1. Create a Development Build

```console
eas build --profile development-simulator --platform ios
```

or

```console
eas build --profile development-simulator --platform android
```

#### 2. Start the bundler

```console
npx expo start
```

#### 3. Open Simulator

Follow the instructions in the console to open the emulator of your choice.

## How to contribute

We appreciate any feedback. Feel free to open an issue if you find errors or use the discussion board if you'd like to suggest new features.

## Security Bugs

If you find any security related issues we would appreciate if you safely disclose the issue to us via email to [max@voteswiper.org](mailto:max@voteswiper.org) directly.

## Contributors

[![](https://github.com/mxmtsk.png?size=50)](https://github.com/mxmtsk)

## License

Copyright MOVACT GmbH
