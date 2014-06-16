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
	/**
	* Assign functions defined in this class to event listeners in the core
	*
	* @return array
	* @static
	* @access public
	*/
	static public function getSubscribedEvents()
	{
		return array(
			'core.user_setup' => 'load_language_on_setup',
		);
	}

	/**
	* Load language file during user setup
	*
	* @param object $event The event object
	* @return null
	* @access public
	*/
	public function load_language_on_setup($event)
	{
		$lang_set_ext = $event['lang_set_ext'];
		$lang_set_ext[] = array(
			'ext_name' => 'vse/passwordstrength',
			'lang_set' => 'passwordstrength',
		);
		$event['lang_set_ext'] = $lang_set_ext;
	}
}
