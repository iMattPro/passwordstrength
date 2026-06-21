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

	/** @var \phpbb\language\language|\PHPUnit\Framework\MockObject\MockObject */
	protected $language;

	protected function setUp(): void
	{
		parent::setUp();

		$this->config = new \phpbb\config\config(array());
		$this->template = $this->createMock('\phpbb\template\template');
		$this->language = $this->createMock('\phpbb\language\language');

		global $user;
		$user = new \phpbb\user($this->language, '\phpbb\datetime');
	}

	protected function set_listener()
	{
		$this->listener = new \vse\passwordstrength\event\listener($this->config, $this->template, $this->language);
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

	public function get_zxcvbnts_language_data()
	{
		return [
			'default language' => ['en', 'en'],
			'case insensitive' => ['FR', 'fr'],
			'phpBB underscore region fallback' => ['en_us', 'en'],
			'phpBB hyphen region fallback' => ['fr-ca', 'fr'],
			'German formal alias' => ['de_x_sie', 'de'],
			'Spanish alias' => ['es', 'es-es'],
			'Spanish regional fallback' => ['es_ar', 'es-es'],
			'Croatian Latin alias' => ['hr_x_vi', 'hr'],
			'Dutch alias' => ['nl', 'nl-be'],
			'Portuguese alias' => ['pt', 'pt-br'],
			'Portuguese Brazilian package' => ['pt_br', 'pt-br'],
			'Simplified Chinese alias' => ['zh_cmn_hans', 'zh'],
			'Traditional Chinese alias' => ['zh_cmn_hant', 'zh'],
			'unsupported fallback' => ['xx', 'en'],
		];
	}

	/**
	 * @dataProvider get_zxcvbnts_language_data
	 */
	public function test_get_zxcvbnts_language($language, $expected)
	{
		$this->set_listener();

		self::assertSame($expected, $this->listener->get_zxcvbnts_language($language));
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

		$user_lang_name = 'en';
		$event_data = array('lang_set_ext', 'user_lang_name');
		$event_data_filtered = $dispatcher->trigger_event('core.user_setup', compact($event_data));
		extract($event_data_filtered, EXTR_OVERWRITE);

		foreach ($expected_contains as $expected)
		{
			self::assertContains($expected, $lang_set_ext);
		}
	}

	public function test_password_strength_setup_uses_event_language()
	{
		$this->set_listener();

		$this->template->expects(self::once())
			->method('assign_vars')
			->with(self::callback(function ($vars) {
				return isset($vars['ZXCVBNTS_LANG']) && $vars['ZXCVBNTS_LANG'] === 'de';
			}));

		$dispatcher = new \phpbb\event\dispatcher();
		$dispatcher->addListener('core.user_setup', array($this->listener, 'password_strength_setup'));

		$lang_set_ext = array();
		$user_lang_name = 'de_x_sie';
		$event_data = array('lang_set_ext', 'user_lang_name');
		$dispatcher->trigger_event('core.user_setup', compact($event_data));
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

	public function pws_select_data()
	{
		return [
			'phpbb3 complex' => [
				'3.3.15',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				0,
				'<option value="0" selected="selected">complex</option><option value="1">zxcvbn</option>',
			],
			'phpbb3 zxcvbn' => [
				'3.3.15',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				1,
				'<option value="0">complex</option><option value="1" selected="selected">zxcvbn</option>',
			],
			'phpbb4 complex' => [
				'4.0.0',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				0,
				['options' => '<option value="0" selected="selected">complex</option><option value="1">zxcvbn</option>'],
			],
			'phpbb4 zxcvbn' => [
				'4.0.0',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				1,
				['options' => '<option value="0">complex</option><option value="1" selected="selected">zxcvbn</option>'],
			],
		];
	}

	/**
	 * @dataProvider pws_select_data
	 */
	public function test_pws_select($env, $options, $default, $expected)
	{
		global $user;

		$user->lang = [
			'PASSWORD_STRENGTH_TYPE_COMPLEX' => 'complex',
			'PASSWORD_STRENGTH_TYPE_ZXCVBN' => 'zxcvbn',
		];

		$this->config['version'] = $env;

		$this->set_listener();

		$this->assertEquals($expected, $this->listener->pws_select($options, $default));
	}
}
