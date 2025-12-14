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
	 * Requires phpBB 3.3.10 due to new template events in ADM styles.
	 */
	public function is_enableable()
	{
		return phpbb_version_compare(PHPBB_VERSION, '3.3.10-RC1', '>=');
	}
}
