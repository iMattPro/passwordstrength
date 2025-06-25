<?php

/**
 *
 * Password Strength [PortuguÃªs Brasileiro]
 * Translated by _Vinny_
 *
 * @copyright (c) 2016 Matt Friedman
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

/**
 * DO NOT CHANGE
 */
if (!defined('IN_PHPBB')) {
	exit;
}

if (empty($lang) || !is_array($lang)) {
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
	'PASSWORD_STRENGTH_TYPE'			=> 'Algoritmo da qualidade da senha',
	'PASSWORD_STRENGTH_TYPE_EXPLAIN'	=> 'Escolhe um algoritmo para determinar a qualidade da senha.<br><strong>Complexidade</strong> pesquisa por caracteres misturados, números, símbolos, e tamanho da senha, forçando senhas complexas.<br><strong>zxcvbn</strong> (por DropBox) calcula quão fácil uma senha pode ser descoberta, encorajando senhas fortes e fáceis de lembrar.',
	'PASSWORD_STRENGTH_TYPE_COMPLEX'	=> 'Complexidade',
	'PASSWORD_STRENGTH_TYPE_ZXCVBN'		=> 'zxcvbn',
));
