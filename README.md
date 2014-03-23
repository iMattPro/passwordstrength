# ![Password Strength](http://mattfriedman.me/forum/images/showpass.png "Password Strength") Password Strength

An extension for phpBB 3.1 that will show users how strong (or weak) their password is as they type it into the password field when creating or updating their account.

## Browser support
![Chrome 4+](http://mattfriedman.me/software/browsericons/chrome.png "Chrome 4+")4+ &nbsp;&nbsp;&nbsp;
![Firefox 3.5+](http://mattfriedman.me/software/browsericons/firefox.png "Firefox 3.5+")3.5+ &nbsp;&nbsp;&nbsp;
![Safari 3+](http://mattfriedman.me/software/browsericons/safari.png "Safari 3+")3+ &nbsp;&nbsp;&nbsp;
![Internet Explorer 6+](http://mattfriedman.me/software/browsericons/ie.png "Internet Explorer 6+")6+ &nbsp;&nbsp;&nbsp;
![Opera 8+](http://mattfriedman.me/software/browsericons/opera.png "Opera 8+")8+

## Stable releases
Grab the latest release from phpBB: ([Download it here](https://www.phpbb.com/customise/db/mod/show_password_strength/)) 

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
* Croatian
* Czech
* French
* German (Casual Honorifics)
* German (Formal Honorifics)
* Greek
* Polish
* Ukrainian
* Spanish

## Requirements
* phpBB 3.1-dev or higher
* PHP 5.3.3 or higher

## Installation
You can install this on the latest copy of the develop branch ([phpBB 3.1-dev](https://github.com/phpbb/phpbb3)) by following the steps below:

**Manual:**

1. Copy the entire contents of this repo to to `phpBB/ext/vse/passwordstrength/`
2. Navigate in the ACP to `Customise -> Extension Management -> Extensions`.
3. Click `Enable`.

**Git CLI:**

1. From the board root run the following git command:
`git clone -b extension https://github.com/VSEphpbb/password_strength.git phpBB/ext/vse/passwordstrength`
2. Navigate in the ACP to `Customise -> Extension Management -> Extensions`.
3. Click `Enable`.

Note: This extension is in development. Installation is only recommended for testing purposes and is not supported on live boards. This extension will be officially released following phpBB 3.1.0.

## Uninstallation
Navigate in the ACP to `Customise -> Extension Management -> Extensions` and click `Disable`.

To permanently uninstall, click `Delete Data` and then you can safely delete the `/ext/vse/passwordstrength` folder.

## License
[GNU General Public License v2](http://opensource.org/licenses/GPL-2.0)

© 2013 - Matt Friedman (VSE)
