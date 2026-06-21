<?php
/**
*
* Password Strength [Greek]
*
* @copyright (c) 2016 Matt Friedman
* @license GNU General Public License, version 2 (GPL-2.0)
*
*/

/**
* DO NOT CHANGE
*/
if (!defined('IN_PHPBB'))
{
	exit;
}

if (empty($lang) || !is_array($lang))
{
	$lang = array();
}

// DEVELOPERS PLEASE NOTE
//
// All language files should use UTF-8 as their encoding and the files must not contain a BOM.
//
// Placeholders can now contain order information, e.g. instead of
// 'Page %s of %s' you can (and should) write 'Page %1$s of %2$s', this allows
// translators to re-order the output of data while ensuring it remains correct
//
// You do not need this where single placeholders are used, e.g. 'Message %d' is fine
// equally where a string contains only two placeholders which are used to wrap text
// in a url you again do not need to specify an order e.g., 'Click %sHERE%s' is fine

$lang = array_merge($lang, array(
	'PASSWORD_STRENGTH_TYPE'			=> 'Αλγόριθμος ισχύος κωδικού',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Επιλέξτε έναν αλγόριθμο για τον προσδιορισμό της ισχύος ενός κωδικού.<br><strong>Πολυπλοκότητα</strong> ελέγχει τον συνδυασμό χαρακτήρων, αριθμών, συμβόλων και μήκους σε έναν κωδικό, ενθαρρύνοντας πολύπλοκους κωδικούς.<br><strong>zxcvbn</strong> (από το DropBox) υπολογίζει πόσο εύκολα μπορεί να μαντευτεί ένας κωδικός, επιτρέποντας ισχυρούς και φιλικούς προς τον χρήστη κωδικούς.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Πολυπλοκότητα',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'αλγόριθμος zxcvbn',
));
