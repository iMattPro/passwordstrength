<?php
/**
*
* Password Strength
*
* @copyright (c) 2014 Matt Friedman
* @license GNU General Public License, version 2 (GPL-2.0)
*
*/

namespace vse\passwordstrength\tests\event;

require_once __DIR__ . '/../../../../../includes/functions_acp.php';

class listener_test extends \phpbb_test_case
{
	/** @var \vse\passwordstrength\event\listener */
	protected $listener;

	/** @var \phpbb\config\config */
	protected $config;

	/** @var \phpbb\template\template|\PHPUnit\Framework\MockObject\MockObject */
	protected $template;

	/** @var \phpbb\user|\PHPUnit\Framework\MockObject\MockObject */
	protected $user;

	protected function setUp(): void
	{
		parent::setUp();

		$this->config = new \phpbb\config\config(array());
		$this->template = $this->getMockBuilder('\phpbb\template\template')
			->getMock();
		$this->user = $this->getMockBuilder('\phpbb\user')
			->disableOriginalConstructor()
			->getMock();
	}

	protected function set_listener()
	{
		$this->listener = new \vse\passwordstrength\event\listener($this->config, $this->template, $this->user);
	}

	public function test_construct()
	{
		$this->set_listener();
		self::assertInstanceOf('\Symfony\Component\EventDispatcher\EventSubscriberInterface', $this->listener);
	}

	public function test_getSubscribedEvents()
	{
		self::assertEquals(array(
			'core.user_setup',
			'core.acp_board_config_edit_add',
		), array_keys(\vse\passwordstrength\event\listener::getSubscribedEvents()));
	}

	public function password_strength_setup_data()
	{
		return array(
			array(
				array(),
				array(
					array(
						'ext_name' => 'vse/passwordstrength',
						'lang_set' => 'passwordstrength',
					),
				),
			),
			array(
				array(
					array(
						'ext_name' => 'foo/bar',
						'lang_set' => 'foobar',
					),
				),
				array(
					array(
						'ext_name' => 'foo/bar',
						'lang_set' => 'foobar',
					),
					array(
						'ext_name' => 'vse/passwordstrength',
						'lang_set' => 'passwordstrength',
					),
				),
			),
		);
	}

	/**
	* @dataProvider password_strength_setup_data
	*/
	public function test_password_strength_setup($lang_set_ext, $expected_contains)
	{
		$this->set_listener();

		$dispatcher = new \phpbb\event\dispatcher();
		$dispatcher->addListener('core.user_setup', array($this->listener, 'password_strength_setup'));

		$event_data = array('lang_set_ext');
		$event_data_filtered = $dispatcher->trigger_event('core.user_setup', compact($event_data));
		extract($event_data_filtered, EXTR_OVERWRITE);

		foreach ($expected_contains as $expected)
		{
			self::assertContains($expected, $lang_set_ext);
		}
	}

	public function password_strength_acp_options_data()
	{
		return array(
			array( // expected config and mode
				   'registration',
				   array('vars' => array('pass_complex' => array())),
				   array('pass_complex', 'password_strength_type'),
			),
			array( // unexpected mode
				   'foobar',
				   array('vars' => array('pass_complex' => array())),
				   array('pass_complex'),
			),
			array( // unexpected config
				   'registration',
				   array('vars' => array('foobar' => array())),
				   array('foobar'),
			),
			array( // unexpected config and mode
				   'foobar',
				   array('vars' => array('foobar' => array())),
				   array('foobar'),
			),
		);
	}

	/**
	 * @dataProvider password_strength_acp_options_data
	 */
	public function test_password_strength_acp_options($mode, $display_vars, $expected_keys)
	{
		$this->set_listener();

		$dispatcher = new \phpbb\event\dispatcher();
		$dispatcher->addListener('core.acp_board_config_edit_add', array($this->listener, 'password_strength_acp_options'));

		$event_data = array('display_vars', 'mode');
		$event_data_after = $dispatcher->trigger_event('core.acp_board_config_edit_add', compact($event_data));

		foreach ($event_data as $expected)
		{
			self::assertArrayHasKey($expected, $event_data_after);
		}
		extract($event_data_after, EXTR_OVERWRITE);

		$keys = array_keys($display_vars['vars']);

		self::assertEquals($expected_keys, $keys);
	}
}
