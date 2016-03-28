<?php
/**
*
* Password Strength [Croatian]
* Croatian translation by Ančica Sečan Matijaščić (http://ancica.sunceko.net)
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Algoritam jačine zaporke',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Ukoliko je izabrano “<strong>Složenost</strong>”, prilikom utvrđivanja <em>jačine zaporke</em>, bit će traženo miješanje znakova, brojeva, simbola i dužine zaporke uz poticanje na kompleksniju zaporku.<br/>Ukoliko je izabrano “<strong>zxcvbn algoritam</strong>” (DropBox), prilikom utvrđivanja <em>jačine zaporke</em>, bit će (iz)računa(va)no koliko bi lako zaporka mogla biti pogođena uz dozvoljavanje jače korisničko-prilagođene zaporke.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Složenost',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn algoritam',
));
