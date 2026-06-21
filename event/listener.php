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
	protected const ZXCVBNTS_LANGUAGE_MAP = [
		'ar' => 'ar',
		'cs' => 'cs',
		'da-dk' => 'da-dk',
		'da' => 'da-dk',
		'de' => 'de',
		'de-x-sie' => 'de',
		'en' => 'en',
		'es' => 'es-es',
		'es-es' => 'es-es',
		'es-x-tu' => 'es-es',
		'fa' => 'fa',
		'fi' => 'fi',
		'fr' => 'fr',
		'hr' => 'hr',
		'hr-x-vi' => 'hr',
		'id' => 'id',
		'it' => 'it',
		'ja' => 'ja',
		'ku' => 'ku',
		'nl' => 'nl-be',
		'nl-be' => 'nl-be',
		'pl' => 'pl',
		'pt' => 'pt-br',
		'pt-br' => 'pt-br',
		'ro' => 'ro',
		'th' => 'th',
		'tr' => 'tr',
		'zh' => 'zh',
		'zh-cmn-hans' => 'zh',
		'zh-cmn-hant' => 'zh',
	];

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

		$this->template->assign_vars([
			'S_USE_ZXCVBN'	=> (bool) $this->config->offsetGet('password_strength_type'),
			'ZXCVBNTS_LANG'	=> $this->get_zxcvbnts_language($event['user_lang_name']),
		]);
	}

	/**
	 * Resolve phpBB language names to available zxcvbn-ts language package names.
	 *
	 * @param string $language
	 * @return string
	 */
	public function get_zxcvbnts_language($language)
	{
		$language = strtolower(str_replace('_', '-', $language));
		$base_language = explode('-', $language, 2)[0];

		return self::ZXCVBNTS_LANGUAGE_MAP[$language] ?? self::ZXCVBNTS_LANGUAGE_MAP[$base_language] ?? 'en';
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
				'function'	=> [$this, 'pws_select'],
				'params'	=> [[0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX', 1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN'], '{CONFIG_VALUE}'],
				'explain'	=> true,
			],
		];

		$event->update_subarray('display_vars', 'vars', phpbb_insert_config_array($event['display_vars']['vars'], $pws_config_vars, ['after' => 'pass_complex']));
	}

	/**
	 * Get select options for ACP (phpBB3 and phpBB4 compatible)
	 *
	 * @param array $options
	 * @param bool|int|string $default
	 * @return array|string
	 */
	public function pws_select($options, $default)
	{
		$opts = build_select($options, $default);

		if (phpbb_version_compare($this->config->offsetGet('version'), '4.0.0-dev', '>='))
		{
			return ['options' => $opts];
		}

		return $opts;
	}
}
