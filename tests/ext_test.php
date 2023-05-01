<?php
/**
 *
 * Password Strength
 *
 * @copyright (c) 2023 Matt Friedman
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace phpbb\passwordstrength\tests;

class ext_test extends \phpbb_test_case
{
	public function test_ext()
	{
		/** @var \PHPUnit\Framework\MockObject\MockObject|\Symfony\Component\DependencyInjection\ContainerInterface $container */
		$container = $this->getMockBuilder('\Symfony\Component\DependencyInjection\ContainerInterface')
			->disableOriginalConstructor()
			->getMock();

		/** @var \PHPUnit\Framework\MockObject\MockObject|\phpbb\finder\finder $extension_finder */
		$extension_finder = $this->getMockBuilder('\phpbb\finder\finder')
			->disableOriginalConstructor()
			->getMock();

		/** @var \PHPUnit\Framework\MockObject\MockObject|\phpbb\db\migrator $migrator */
		$migrator = $this->getMockBuilder('\phpbb\db\migrator')
			->disableOriginalConstructor()
			->getMock();

		$ext = new \vse\passwordstrength\ext(
			$container,
			$extension_finder,
			$migrator,
			'vse/passwordstrength',
			''
		);

		self::assertTrue($ext->is_enableable());
	}
}
