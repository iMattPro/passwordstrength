<?php
/**
*
* Password Strength [Simplified Chinese]
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
	'PASSWORD_STRENGTH_TYPE'			=> '密码强度算法',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> '选择用于判断密码强度的算法。<br><strong>复杂度</strong> 会检查密码中的字符、数字、符号组合以及长度，鼓励使用复杂密码。<br><strong>zxcvbn</strong>（由 DropBox 提供）会计算密码被猜中的难易程度，从而允许使用强大且便于用户记忆的密码。',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> '复杂度',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn 算法',
));
