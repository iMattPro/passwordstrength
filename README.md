# ![Password Strength](http://mattfriedman.me/forum/images/showpass.png "Password Strength") Password Strength

An extension for phpBB 3.1 that will show users how strong (or weak) their password is as they type it into the password field when creating or updating their account.

[![Build Status](https://travis-ci.org/VSEphpbb/passwordstrength.png?branch=extension)](https://travis-ci.org/VSEphpbb/passwordstrength)

## Browser support
![Chrome 4+](http://mattfriedman.me/software/browsericons/chrome.png "Chrome 4+")4+ &nbsp;&nbsp;&nbsp;
![Firefox 3.5+](http://mattfriedman.me/software/browsericons/firefox.png "Firefox 3.5+")3.5+ &nbsp;&nbsp;&nbsp;
![Safari 3+](http://mattfriedman.me/software/browsericons/safari.png "Safari 3+")3+ &nbsp;&nbsp;&nbsp;
![Internet Explorer 6+](http://mattfriedman.me/software/browsericons/ie.png "Internet Explorer 6+")6+ &nbsp;&nbsp;&nbsp;
![Opera 8+](http://mattfriedman.me/software/browsericons/opera.png "Opera 8+")8+

## Demo
Try it out yourself here: ([Online Demo](http://vsephpbb.github.io/passwordstrength/))

## Features
* Password strength is indicated visually. The password field will change colors as the user types in a password, displaying red for weak passwords through green for strong passwords.
* Below the password field a text indicator will also appear describing the password strength as 'Very Weak', 'Weak', 'Good', 'Strong' and 'Very Strong'.
* Password Strength is active on new user registration, and in the UCP and ACP areas where you can change existing passwords to new passwords.
* Password strength is graded by finding the following criteria in a password:
    1. Contains a minimum of 6 characters
    2. Contains mixed case letters
    3. Contains numbers
    4. Contains special characters
    5. Password exceeds 12 characters

## Awards
* Featured MOD of the Week in the phpBB Weekly Podcast, episode #166.

### Languages supported:
* English
* Brazilian Portuguese
* Bulgarian
* Croatian
* Czech
* Dutch
* Estonian
* French
* German (Casual Honorifics)
* German (Formal Honorifics)
* Greek
* Persian
* Polish
* Spanish
* Ukrainian

## Requirements
* phpBB 3.1.0-RC2 or higher
* PHP 5.3.3 or higher

Note: This extension is in development. Installation is only recommended for testing purposes and is not supported on live boards. This extension will be officially released following phpBB 3.1.0.

## Installation
1. [Download the latest release](https://github.com/VSEphpbb/passwordstrength/releases) and unzip it.
2. Copy the entire contents from the unzipped folder to `phpBB/ext/vse/passwordstrength/`.
3. Navigate in the ACP to `Customise -> Manage extensions`.
4. Find Password Strength under "Disabled Extensions" and click `Enable`.

## Uninstallation
1. Navigate in the ACP to `Customise -> Manage extensions`.
2. Click the `Disable` link for Password Strength.
3. To permanently uninstall, click `Delete Data`, then delete the `passwordstrength` folder from `phpBB/ext/vse/`.

## License
[GNU General Public License v2](http://opensource.org/licenses/GPL-2.0)

© 2013 - Matt Friedman (VSE)
