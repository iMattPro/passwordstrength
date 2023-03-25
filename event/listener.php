<?php
/**
 *
 * Password Strength
 *
 * @copyright (c) 2013 Matt Friedman
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace vse\passwordstrength\event;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Event listener
 */
class listener implements EventSubscriberInterface
{
	/** @var \phpbb\config\config */
	protected $config;

	/** @var \phpbb\template\template */
	protected $template;

	/** @var \phpbb\language\language */
	protected $language;

	/**
	 * Constructor
	 *
	 * @param \phpbb\config\config     $config   Config object
	 * @param \phpbb\template\template $template Template object
	 * @param \phpbb\language\language $language Language object
	 */
	public function __construct(\phpbb\config\config $config, \phpbb\template\template $template, \phpbb\language\language $language)
	{
		$this->config = $config;
		$this->template = $template;
		$this->language = $language;
	}

	/**
	 * Assign functions defined in this class to event listeners in the core
	 *
	 * @return array
	 */
	public static function getSubscribedEvents()
	{
		return [
			'core.user_setup' 				=> 'password_strength_setup',
			'core.acp_board_config_edit_add'	=> 'password_strength_acp_options',
		];
	}

	/**
	 * Load language file during user setup
	 *
	 * @param \phpbb\event\data $event The event object
	 */
	public function password_strength_setup($event)
	{
		$lang_set_ext = $event['lang_set_ext'];
		$lang_set_ext[] = [
			'ext_name' => 'vse/passwordstrength',
			'lang_set' => 'passwordstrength',
		];
		$event['lang_set_ext'] = $lang_set_ext;

		$this->template->assign_var('S_USE_ZXCVBN', (bool) $this->config->offsetGet('password_strength_type'));
	}

	/**
	 * Add Password Strength settings to the ACP
	 *
	 * @param \phpbb\event\data $event The event object
	 */
	public function password_strength_acp_options($event)
	{
		if ($event['mode'] !== 'registration' || !array_key_exists('pass_complex', $event['display_vars']['vars']))
		{
			return;
		}

		$this->language->add_lang('acp_passwordstrength', 'vse/passwordstrength');

		$pws_config_vars = [
			'password_strength_type' => [
				'lang'		=> 'PASSWORD_STRENGTH_TYPE',
				'validate'	=> 'int',
				'type'		=> 'select',
				'function'	=> 'build_select',
				'params'	=> [[0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX', 1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN'], '{CONFIG_VALUE}'],
				'explain'	=> true,
			],
		];

		$event->update_subarray('display_vars', 'vars', phpbb_insert_config_array($event['display_vars']['vars'], $pws_config_vars, ['after' => 'pass_complex']));
	}
}
