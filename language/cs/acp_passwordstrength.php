<?php
/**
*
* Password Strength [Czech]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Algoritmus síly hesla',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Vyberte algoritmus pro určení síly hesla. <br><strong>Složitost</strong> bere v potaz smíšené znaky, čísla, znaky a délku hesla, tudíž podporuje složitá hesla. <br><strong>zxcvbn</strong> (od DropBox) vypočítává, jak lehce může být heslo uhodnuto, což umožňuje vytvářet silná, pro uživatele přívětivá, hesla.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Složitost',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn algoritmus',
));
