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

	/** @var \phpbb\user */
	protected $user;

	/**
	 * Constructor
	 *
	 * @param \phpbb\config\config     $config   Config object
	 * @param \phpbb\template\template $template Template object
	 * @param \phpbb\user              $user     User object
	 */
	public function __construct(\phpbb\config\config $config, \phpbb\template\template $template, \phpbb\user $user)
	{
		$this->config = $config;
		$this->template = $template;
		$this->user = $user;
	}

	/**
	 * Assign functions defined in this class to event listeners in the core
	 *
	 * @return array
	 */
	public static function getSubscribedEvents()
	{
		return array(
			'core.user_setup' 					=> 'password_strength_setup',
			'core.acp_board_config_edit_add'	=> 'password_strength_acp_options',
		);
	}

	/**
	 * Load language file during user setup
	 *
	 * @param \phpbb\event\data $event The event object
	 */
	public function password_strength_setup($event)
	{
		$lang_set_ext = $event['lang_set_ext'];
		$lang_set_ext[] = array(
			'ext_name' => 'vse/passwordstrength',
			'lang_set' => 'passwordstrength',
		);
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
		if ($event['mode'] === 'registration' && array_key_exists('pass_complex', $event['display_vars']['vars']))
		{
			$this->user->add_lang_ext('vse/passwordstrength', 'acp_passwordstrength');

			$display_vars = $event['display_vars'];

			$pws_config_vars = array(
				'password_strength_type' => array(
					'lang'		=> 'PASSWORD_STRENGTH_TYPE',
					'validate'	=> 'int',
					'type'		=> 'select',
					'function'	=> array($this, 'select_password_strength'),
					'explain'	=> true
				),
			);

			$display_vars['vars'] = phpbb_insert_config_array($display_vars['vars'], $pws_config_vars, array('after' => 'pass_complex'));

			$event['display_vars'] = $display_vars;
		}
	}

	/**
	 * Select Password Strength type
	 *
	 * @param string $selected_value
	 * @param string $key
	 * @return string
	 */
	public function select_password_strength($selected_value, $key = '')
	{
		$pws_type_ary = array(
			0 => 'PASSWORD_STRENGTH_TYPE_COMPLEX',
			1 => 'PASSWORD_STRENGTH_TYPE_ZXCVBN'
		);
		$pass_char_options = '';
		foreach ($pws_type_ary as $pws_id => $pws_type)
		{
			$selected = ($selected_value == $pws_id) ? ' selected="selected"' : '';
			$pass_char_options .= '<option value="' . $pws_id . '"' . $selected . '>' . $this->user->lang($pws_type) . '</option>';
		}

		return $pass_char_options;
	}
}
