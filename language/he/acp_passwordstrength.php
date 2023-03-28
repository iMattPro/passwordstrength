<?php
/**
*
* Password Strength [Hebrew]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'אלגוריתם חוזק הסיסמה',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'בחר אלגוריתם לקביעת חוזק סיסמה.<br><strong>מורכבות</strong> מחפש תווים מעורבים מספרים וסמלים אורך סיסמה ומעודדת סיסמאות מורכבות.<br><strong>אלגוריתם zxcvbn</strong> (מאת DropBox) מחשב כמה קלה הסיסמה שניתנת לניחוש, ומאפשר בכך סיסמאות חזקות וידידותיות למשתמש.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'מורכבות',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'אלגוריתם zxcvbn',
));
