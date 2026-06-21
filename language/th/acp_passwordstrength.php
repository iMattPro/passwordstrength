<?php
/**
*
* Password Strength [Thai]
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
	'PASSWORD_STRENGTH_TYPE'			=> 'อัลกอริทึมความแข็งแรงของรหัสผ่าน',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'เลือกอัลกอริทึมสำหรับประเมินความแข็งแรงของรหัสผ่าน<br><strong>ความซับซ้อน</strong> ตรวจสอบการผสมตัวอักษร ตัวเลข สัญลักษณ์ และความยาวของรหัสผ่าน เพื่อส่งเสริมให้ใช้รหัสผ่านที่ซับซ้อน<br><strong>zxcvbn</strong> (โดย DropBox) คำนวณว่ารหัสผ่านสามารถถูกเดาได้ง่ายเพียงใด ทำให้ใช้รหัสผ่านที่แข็งแรงและเป็นมิตรกับผู้ใช้ได้',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'ความซับซ้อน',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'อัลกอริทึม zxcvbn',
));
