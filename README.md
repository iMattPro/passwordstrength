# ![Password Strength](https://imattpro.github.io/logo/showpass.png "Password Strength") Password Strength

An extension for phpBB that shows users the strength of a password as they type it when registering, changing their password, or editing a user in the ACP.

[![Build Status](https://github.com/iMattPro/passwordstrength/actions/workflows/tests.yml/badge.svg)](https://github.com/iMattPro/passwordstrength/actions)
[![codecov](https://codecov.io/gh/iMattPro/passwordstrength/branch/master/graph/badge.svg?token=3D2AV28A3S)](https://codecov.io/gh/iMattPro/passwordstrength)
[![Latest Stable Version](https://poser.pugx.org/vse/passwordstrength/v/stable)](https://www.phpbb.com/customise/db/extension/password_strength/)

## Demo
Try it out yourself here: ([Online Demo](https://imattpro.github.io/passwordstrength/))

## Features
* Adds an accessible password strength meter beside password fields.
* Password strength is labeled as "Very Weak", "Weak", "Good", "Strong" or "Very Strong".
* Password strength is active on user-facing registration/account password forms and supported ACP user password forms.
* Password strength is scored using one of the available algorithms:
    1. __Complexity__ checks for a mix of characters, case, symbols, numbers and length. This can encourage complex passwords, but can score easily cracked passwords like `P@s$w0rd` as strong.
    2. __zxcvbn__ calculates how guessable a password is by comparing it to dictionaries and recognizable patterns. This is a more robust strength checker that allows user-friendly passwords that are easy to remember but still hard to guess.
* The zxcvbn algorithm displays localized feedback about weak passwords when available.
* zxcvbn dictionary/feedback support is included for Arabic, Croatian, Czech, Danish, Dutch (Belgium), English, Finnish, French, German, Indonesian, Italian, Japanese, Kurdish, Persian, Polish, Portuguese (Brazil), Romanian, Spanish, Thai, Turkish and Chinese.

## Requirements
* phpBB 3.3.10 or newer.
* PHP 7.1.3 or newer.

## Awards
* Featured MOD of the Week in the phpBB Weekly Podcast, episode #166.

## Install
1. [Download the latest validated release](https://www.phpbb.com/customise/db/extension/password_strength/).
2. Unzip the downloaded release and copy it to the `ext` directory of your phpBB board.
3. Navigate in the ACP to `Customise -> Manage extensions`.
4. Look for `Password Strength` under the Disabled Extensions list and click its `Enable` link.
5. Choose a password strength algorithm under `ACP -> General -> User registration settings -> Password strength algorithm`.

## Uninstall
1. Navigate in the ACP to `Customise -> Manage extensions`.
2. Click the `Disable` link for Password Strength.
3. To permanently uninstall, click `Delete Data`, then delete the `passwordstrength` folder from `phpBB/ext/vse/`.

## Disclaimer
Password Strength is intended to encourage forum users to choose stronger passwords. It does not guarantee protection against password attacks, and it does not replace phpBB's server-side password validation or password confirmation checks. Password scoring is an estimate, so choose the strength algorithm that best fits your forum.

## License
[GNU General Public License v2](https://opensource.org/licenses/GPL-2.0)

© 2013 - Matt Friedman
