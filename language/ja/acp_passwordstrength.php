<?php
/**
*
* Password Strength [Japanese]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'パスワード強度アルゴリズム',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'パスワードの強度を判定するアルゴリズムを選択してください。<br><strong>複雑さ</strong> は、パスワード内の文字、数字、記号、長さの組み合わせを確認し、複雑なパスワードの使用を促します。<br><strong>zxcvbn</strong>（DropBox 提供）は、パスワードがどれだけ推測されやすいかを計算し、強力で覚えやすいパスワードを使用できるようにします。',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> '複雑さ',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn アルゴリズム',
));
