# ![Password Strength](http://vsephpbb.github.io/logo/showpass.png "Password Strength") Password Strength

An extension for phpBB that will show users how strong (or weak) their password is as they type it into the password field when creating or updating their account.

[![Build Status](https://travis-ci.org/VSEphpbb/passwordstrength.png?branch=extension)](https://travis-ci.org/VSEphpbb/passwordstrength)
[![Latest Stable Version](https://poser.pugx.org/vse/passwordstrength/v/stable)](https://www.phpbb.com/customise/db/extension/password_strength/)

## Demo
Try it out yourself here: ([Online Demo](http://vsephpbb.github.io/passwordstrength/))

## Features
* Password field changes colors from red (weak) to green (strong) as the user types in a password.
* Password strength is also labeled as 'Very Weak', 'Weak', 'Good', 'Strong' or 'Very Strong'.
* Password Strength is active on new user registration, and in the UCP and ACP areas where you can enter new passwords.
* Password Strength is scored using one of the available algorithms:
    1. __Complexity__ is an unintelligent test that checks for complexity in a password by looking for a mix of characters, case, symbols, numbers and length. This is useful for encouraging hard to remember complex passwords, but can score easily cracked passwords like `P@s$w0rd` as Strong.
    2. __zxcvbn algorithm__ (used by DropBox) is an intelligent algorithm that calculates the guess-ability of a password by comparing it to a large dictionary of common English words as well as looking for recognizable patterns like `P@s$w0rd`. This is a more robust strength checker that allows for user-friendly passwords that are easy to remember but still hard to guess. A Very Strong result represents a password that may take a computer years to centuries to guess.
* Multiple languages are supported. View the pre-installed [localizations](https://github.com/VSEphpbb/passwordstrength/tree/master/language).

## Awards
* Featured MOD of the Week in the phpBB Weekly Podcast, episode #166.

## Minimum Requirements
* phpBB 3.1.0
* phpBB 3.2.0
* phpBB 3.3.0
* PHP 5.3.3

## Install
1. [Download the latest validated release](https://www.phpbb.com/customise/db/extension/password_strength/).
2. Unzip the downloaded release and copy it to the `ext` directory of your phpBB board.
3. Navigate in the ACP to `Customise -> Manage extensions`.
4. Look for `Password Strength` under the Disabled Extensions list and click its `Enable` link.
5. Choose a Password Strength algorithm under `User registration settings -> Password strength type`.

## Uninstall
1. Navigate in the ACP to `Customise -> Manage extensions`.
2. Click the `Disable` link for Password Strength.
3. To permanently uninstall, click `Delete Data`, then delete the `passwordstrength` folder from `phpBB/ext/vse/`.

## Disclaimer
Password Strength is intended to encourage your forum users to use strong passwords. It does not guarantee protection against password attacks, nor does it force your users to use strong passwords. The business of scoring password strength is a tricky and hotly debated subject and you are encouraged to decide which of the strength test models included in this extension will work best for your forum.

## License
[GNU General Public License v2](http://opensource.org/licenses/GPL-2.0)

© 2013 - Matt Friedman
