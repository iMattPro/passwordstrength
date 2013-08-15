![Show Password Strength](http://mattfriedman.me/forum/images/showpass.png "Show Password Strength") Show Password Strength for phpBB3
---------------------------

An extension for phpBB 3.1 that will show users how strong (or weak) their password is as they type it into the password field.

## Browser support
![Chrome 4+](http://mattfriedman.me/software/browsericons/chrome.png "Chrome 4+")4+ &nbsp;&nbsp;&nbsp;
![Firefox 3.5+](http://mattfriedman.me/software/browsericons/firefox.png "Firefox 3.5+")3.5+ &nbsp;&nbsp;&nbsp;
![Safari 3+](http://mattfriedman.me/software/browsericons/safari.png "Safari 3+")3+ &nbsp;&nbsp;&nbsp;
![Internet Explorer 6+](http://mattfriedman.me/software/browsericons/ie.png "Internet Explorer 6+")6+ &nbsp;&nbsp;&nbsp;
![Opera 8+](http://mattfriedman.me/software/browsericons/opera.png "Opera 8+")8+

## Stable releases
Grab the latest release from phpBB: ([Download it here](https://www.phpbb.com/customise/db/mod/show_password_strength/)) 

## Demo
Try it out yourself here: ([Online Demo](http://vsephpbb.github.io/password_strength/)) 

## Features
* Password strength is indicated visually. The password field will change colors as the user types in a password, displaying red for weak passwords through green for strong passwords.
* Below the password field a text indicator will also appear describing the password strength as 'Very Weak', 'Weak', 'Good', 'Strong' and 'Very Strong'.
* Password Strength is active on new user registration, and in the UCP and ACP areas where you can change existing passwords to new passwords.
* Password strength is graded by finding the following criteria in a password:
    1. Contains mixed case letters
    2. Contains numbers
    3. Contains special characters
    4. Password exceeds 12 characters

## Awards
* Featured MOD of the Week in the phpBB Weekly Podcast, episode #166.

## Requirements
* phpBB 3.1-dev or higher
* PHP 5.3 or higher

## Installation
You can install this on the latest copy of the develop branch ([phpBB 3.1-dev](https://github.com/phpbb/phpbb3)) by following the steps below:

1. Copy the entire contents of this repo to `phpBB/ext/vse/`
2. Navigate in the ACP to `Customise -> Extension Management -> Extensions`.
3. Click Enable.

## Uninstallation
Navigate in the ACP to `Customise -> Extension Management -> Extensions` and click `Purge`.

## Support
* Report any bugs or problems you encounter to the issue tracker: https://github.com/VSEphpbb/password_strength/issues
* Support is also available at phpBB: https://www.phpbb.com/customise/db/mod/show_password_strength

## License
[GNU General Public License v2](http://opensource.org/licenses/GPL-2.0)
