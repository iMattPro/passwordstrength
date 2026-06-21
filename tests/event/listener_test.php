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

use phpbb\config\config;
use phpbb\event\dispatcher;
use phpbb\language\language;
use phpbb\template\template;
use phpbb_test_case;
use PHPUnit\Framework\MockObject\MockObject;
use vse\passwordstrength\event\listener;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

require_once __DIR__ . '/../../../../../includes/functions_acp.php';

class listener_test extends phpbb_test_case
{
	/** @var listener */
	protected listener $listener;

	/** @var config */
	protected config $config;

	/** @var template|MockObject */
	protected template|MockObject $template;

	/** @var language|MockObject */
	protected language|MockObject $language;

	protected function setUp(): void
	{
		parent::setUp();

		$this->config = new config(array());
		$this->template = $this->createMock(template::class);
		$this->language = $this->createMock(language::class);
	}

	protected function set_listener(): void
	{
		$this->listener = new listener($this->config, $this->template, $this->language);
	}

	public function test_construct(): void
	{
		$this->set_listener();
		self::assertInstanceOf(EventSubscriberInterface::class, $this->listener);
	}

	public function test_getSubscribedEvents(): void
	{
		self::assertEquals(array(
			'core.user_setup',
			'core.acp_board_config_edit_add',
		), array_keys(listener::getSubscribedEvents()));
	}

	public static function get_zxcvbnts_language_data(): array
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

	public static function password_strength_setup_data(): array
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
	public function test_password_strength_setup($lang_set_ext, $expected_contains): void
	{
		$this->set_listener();

		$dispatcher = new dispatcher();
		$dispatcher->addListener('core.user_setup', array($this->listener, 'password_strength_setup'));

		$user_lang_name = 'en';
		$event_data = array('lang_set_ext', 'user_lang_name');
		$event_data_filtered = $dispatcher->trigger_event('core.user_setup', compact($event_data));
		extract($event_data_filtered);

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

	public static function password_strength_acp_options_data(): array
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
	public function test_password_strength_acp_options($mode, $display_vars, $expected_keys): void
	{
		$this->set_listener();

		$dispatcher = new dispatcher();
		$dispatcher->addListener('core.acp_board_config_edit_add', array($this->listener, 'password_strength_acp_options'));

		$event_data = array('display_vars', 'mode');
		$event_data_after = $dispatcher->trigger_event('core.acp_board_config_edit_add', compact($event_data));

		foreach ($event_data as $expected)
		{
			self::assertArrayHasKey($expected, $event_data_after);
		}
		extract($event_data_after);

		$keys = array_keys($display_vars['vars']);

		self::assertEquals($expected_keys, $keys);
	}

	public static function pws_select_data(): array
	{
		return [
			'phpbb3 complex' => [
				'3.3.15',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				0,
				[
					['value' => 0, 'selected' => true, 'label' => 'PASSWORD_STRENGTH_TYPE_COMPLEX'],
					['value' => 1, 'selected' => false, 'label' => 'PASSWORD_STRENGTH_TYPE_ZXCVBN']
				],
			],
			'phpbb3 zxcvbn' => [
				'3.3.15',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				1,
				[
					['value' => 0, 'selected' => false, 'label' => 'PASSWORD_STRENGTH_TYPE_COMPLEX'],
					['value' => 1, 'selected' => true, 'label' => 'PASSWORD_STRENGTH_TYPE_ZXCVBN']
				],
			],
			'phpbb4 complex' => [
				'4.0.0',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				0,
				['options' => [
					['value' => 0, 'selected' => true, 'label' => 'PASSWORD_STRENGTH_TYPE_COMPLEX'],
					['value' => 1, 'selected' => false, 'label' => 'PASSWORD_STRENGTH_TYPE_ZXCVBN']
				]],
			],
			'phpbb4 zxcvbn' => [
				'4.0.0',
				[
					0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
					1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN',
				],
				1,
				['options' => [
					['value' => 0, 'selected' => false, 'label' => 'PASSWORD_STRENGTH_TYPE_COMPLEX'],
					['value' => 1, 'selected' => true, 'label' => 'PASSWORD_STRENGTH_TYPE_ZXCVBN']
				]],
			],
		];
	}

	/**
	 * @dataProvider pws_select_data
	 */
	public function test_pws_select($env, $options, $default, $expected): void
	{
		global $language;
		$language = $this->language;

		$this->language->method('lang')->willReturnArgument(0);

		$this->config['version'] = $env;

		$this->set_listener();

		$this->assertEquals($expected, $this->listener->pws_select($options, $default));
	}
}
