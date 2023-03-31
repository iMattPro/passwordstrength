<?php
/**
*
* Password Strength [Estonia]
* Estonian translation by phpBBeesti.ee <https://www.phpbbeesti.ee>
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Parooli tugevuse algoritm',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Valige parooli tugevuse määramiseks algoritm.<br><strong>Keerukus</strong> otsib salasõnaga kus segatud märke, numbreid, sümboleid ja pikkust.<br><strong>zxcvbn</strong> (by DropBox) arvutab, kui hõlpsalt parooli võime arvata, võimaldades tugevaid kasutajasõbralikke paroole.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Keerukus',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn algoritm',
));
