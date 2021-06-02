<?php
/**
 *
 * Password Strength
 *
 * @copyright (c) 2016 Matt Friedman
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace vse\passwordstrength\migrations;

class m1_add_configs extends \phpbb\db\migration\migration
{
	public function effectively_installed()
	{
		return $this->config->offsetExists('password_strength_type');
	}

	public static function depends_on()
	{
		return array('\phpbb\db\migration\data\v310\gold');
	}

	public function update_data()
	{
		return array(
			array('config.add', array('password_strength_type', 0)),
		);
	}
}
