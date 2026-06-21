<?php
/**
*
* Password Strength [Traditional Chinese]
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
	'PASSWORD_STRENGTH_TYPE'			=> '密碼強度演算法',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> '選擇用於判斷密碼強度的演算法。<br><strong>複雜度</strong> 會檢查密碼中的字元、數字、符號組合以及長度，鼓勵使用複雜密碼。<br><strong>zxcvbn</strong>（由 DropBox 提供）會計算密碼被猜中的難易程度，從而允許使用強大且便於使用者記憶的密碼。',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> '複雜度',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn 演算法',
));
