<?php
/**
*
* Password Strength extension for the phpBB Forum Software package.
* French translation by Galixte (http://www.galixte.com)
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
//
// Some characters you may want to copy&paste:
// ’ « » “ ” …
//

$lang = array_merge($lang, array(
	'PASSWORD_STRENGTH_TYPE'			=> 'Algorithme de robustesse du mot de passe',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Permet de choisir un algorithme pour déterminer la force du mot de passe.<br>La <strong>complexité</strong> du mot de passe dépend de la diversité des caractères, nombres, symboles utilisés ainsi que de sa longueur.<br>L’algorithme <strong>zxcvbn</strong> (créé par DropBox) calcule comment un mot de passe peut être deviné facilement, permettant ainsi de créer des mots de passe pratiques et robustes.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Complexité',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'Algorithme zxcvbn',
));
