<?php
/**
*
* Password Strength [Danish]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Algoritme for adgangskodestyrke',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Vælg en algoritme til at bestemme styrken af en adgangskode.<br><strong>Kompleksitet</strong> ser efter en blanding af tegn, tal, symboler og længde i en adgangskode og tilskynder til komplekse adgangskoder.<br><strong>zxcvbn</strong> (af DropBox) beregner, hvor let en adgangskode kan gættes, hvilket giver mulighed for stærke og brugervenlige adgangskoder.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Kompleksitet',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn-algoritme',
));
