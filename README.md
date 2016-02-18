# ![Password Strength](http://mattfriedman.me/forum/images/showpass.png "Password Strength") Password Strength

An extension for phpBB 3.1 that will show users how strong (or weak) their password is as they type it into the password field when creating or updating their account.

[![Build Status](https://travis-ci.org/VSEphpbb/passwordstrength.png?branch=extension)](https://travis-ci.org/VSEphpbb/passwordstrength)
[![Latest Stable Version](https://poser.pugx.org/vse/passwordstrength/v/stable)](https://www.phpbb.com/customise/db/extension/password_strength/)

## Browser support
![Chrome 4+](http://vsephpbb.github.io/browsericons/chrome.png "Chrome 4+")4+ &nbsp;&nbsp;&nbsp;
![Firefox 3.5+](http://vsephpbb.github.io/browsericons/firefox.png "Firefox 3.5+")3.5+ &nbsp;&nbsp;&nbsp;
![Safari 3+](http://vsephpbb.github.io/browsericons/safari.png "Safari 3+")3+ &nbsp;&nbsp;&nbsp;
![Internet Explorer 6+](http://vsephpbb.github.io/browsericons/ie.png "Internet Explorer 6+")6+ &nbsp;&nbsp;&nbsp;
![Opera 8+](http://vsephpbb.github.io/browsericons/opera.png "Opera 8+")8+

## Demo
Try it out yourself here: ([Online Demo](http://vsephpbb.github.io/passwordstrength/))

## Features
* Password field changes colors from red (weak) to green (strong) as the user types in a password.
* Password strength is also labeled as 'Very Weak', 'Weak', 'Good', 'Strong' or 'Very Strong'.
* Password Strength is active on new user registration, and in the UCP and ACP areas where you can enter new passwords.
* Password strength is graded by finding the following criteria in a password:
    1. Contains a minimum of 6 characters
    2. Contains mixed case letters
    3. Contains numbers
    4. Contains special characters
    5. Contains more than 12 characters
* Multiple languages are supported. View the pre-installed [localizations](https://github.com/VSEphpbb/passwordstrength/tree/master/language).

## Awards
* Featured MOD of the Week in the phpBB Weekly Podcast, episode #166.

## Requirements
* phpBB 3.1.0-RC2 or higher
* PHP 5.3.3 or higher

## Install
1. [Download the latest validated release](https://www.phpbb.com/customise/db/extension/password_strength/).
2. Unzip the downloaded release and copy it to the `ext` directory of your phpBB board.
3. Navigate in the ACP to `Customise -> Manage extensions`.
4. Look for `Password Strength` under the Disabled Extensions list and click its `Enable` link.

## Uninstall
1. Navigate in the ACP to `Customise -> Manage extensions`.
2. Click the `Disable` link for Password Strength.
3. To permanently uninstall, click `Delete Data`, then delete the `passwordstrength` folder from `phpBB/ext/vse/`.

## License
[GNU General Public License v2](http://opensource.org/licenses/GPL-2.0)

© 2013 - Matt Friedman (VSE)
