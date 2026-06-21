<?php
/**
*
* Password Strength [Bulgarian]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Алгоритъм за сила на паролата',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Изберете алгоритъм за определяне на силата на паролата.<br><strong>Сложност</strong> проверява за комбинация от букви, цифри, символи и дължина в паролата, като насърчава сложни пароли.<br><strong>zxcvbn</strong> (от DropBox) изчислява колко лесно може да бъде отгатната паролата, позволявайки силни и удобни за потребителя пароли.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Сложност',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'алгоритъм zxcvbn',
));
