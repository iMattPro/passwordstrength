<?php
/**
 *
 * Password Strength
 *
 * @copyright (c) 2023 Matt Friedman
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace vse\passwordstrength;

class ext extends \phpbb\extension\base
{
	/**
	 * {@inheritdoc}
	 *
	 * Requires phpBB 4.0.0
	 */
	public function is_enableable()
	{
		return phpbb_version_compare(PHPBB_VERSION, '4.0.0-dev', '>=');
	}
}
