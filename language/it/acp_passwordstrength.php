<?php
/**
*
* Password Strength [Italian]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Algoritmo di robustezza della password',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Scegli un algoritmo per determinare la robustezza di una password.<br><strong>Complessità</strong> verifica la combinazione di caratteri, numeri, simboli e lunghezza di una password, incoraggiando password complesse.<br><strong>zxcvbn</strong> (di DropBox) calcola quanto facilmente una password può essere indovinata, consentendo password robuste e facili da ricordare.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Complessità',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'algoritmo zxcvbn',
));
