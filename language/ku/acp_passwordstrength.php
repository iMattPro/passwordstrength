<?php
/**
*
* Password Strength [Kurmanji Kurdish]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Algorîtmaya hêza şîfreyê',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Algorîtmayek hilbijêre ji bo diyarkirina hêza şîfreyê.<br><strong>Tevlihevî</strong> li têkela tîpan, hejmaran, sembolan û dirêjahiya şîfreyê dinêre û şîfreyên tevlihev teşwîq dike.<br><strong>zxcvbn</strong> (ji aliyê DropBox ve) hesab dike ka şîfre çiqas hêsan dikare were texmîn kirin, û şîfreyên xurt û bikarhêner-dost destûr dide.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Tevlihevî',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'algorîtmaya zxcvbn',
));
