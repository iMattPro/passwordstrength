<?php
/**
*
* Password Strength [Russian]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Алгоритм сложности пароля',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Выберите алгоритм для определения сложности пароля.<br><strong>Комплексный</strong> проверяет наличие и сочетание букв, цифр и другних символов, а так же длину пароля, поощряя сложные пароли.<br><strong>zxcvbn-алгоритм</strong> (от Dropbox) вычисляет сложность подбора и позволяет использовать дружественные пользователю, но при этом надёжные пароли.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Комплексный',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn-алгоритм',
));
