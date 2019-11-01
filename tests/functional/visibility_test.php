<?php
/**
*
* Password Strength
*
* @copyright (c) 2014 Matt Friedman
* @license GNU General Public License, version 2 (GPL-2.0)
*
*/

namespace vse\passwordstrength\tests\functional;

/**
* @group functional
*/
class visibility_test extends \phpbb_functional_test_case
{
	protected static function setup_extensions()
	{
		return array('vse/passwordstrength');
	}

	public function setUp(): void
	{
		parent::setUp();
		$this->add_lang_ext('vse/passwordstrength', array('passwordstrength', 'acp_passwordstrength'));

		$this->purge_cache();
	}

	public function test_acp_pages()
	{
		$this->login();
		$this->admin_login();

		// Test ACP settings page
		$crawler = self::request('GET', "adm/index.php?i=acp_board&mode=registration&sid={$this->sid}");
		$this->assertContainsLang('PASSWORD_STRENGTH_TYPE', $crawler->filter('html')->text());
		$this->assertContainsLang('PASSWORD_STRENGTH_TYPE_COMPLEX', $crawler->filter('html')->text());
		$this->assertContainsLang('PASSWORD_STRENGTH_TYPE_ZXCVBN', $crawler->filter('html')->text());

		// Test password strength on ACP Account settings page
		$crawler = self::request('GET', "adm/index.php?i=acp_users&mode=overview&sid={$this->sid}");
		$this->assertNotContainsLang('PS_WEAK', $crawler->filter('html')->text());
		$form = $crawler->selectButton($this->lang('SUBMIT'))->form();
		$data = array('username' => 'admin');
		$form->setValues($data);
		$crawler = self::submit($form);
		$this->assertContainsLang('PS_WEAK', $crawler->filter('html')->text());
	}

	public function test_ucp_pages()
	{
		$this->login();

		// Test password strength on UCP Account settings page
		$crawler = self::request('GET', 'ucp.php?i=ucp_profile&mode=reg_details');
		$this->assertContainsLang('PS_WEAK', $crawler->filter('html')->text());

		// Test password strength on UCP registration page
		$this->logout();
		$crawler = self::request('GET', 'ucp.php?mode=register');
		$form = $crawler->selectButton($this->lang('AGREE'))->form();
		$crawler = self::submit($form);
		$this->assertContainsLang('PS_WEAK', $crawler->filter('html')->text());
	}

	public function test_other_pages()
	{
		// Test password strength NOT on index page
		$crawler = self::request('GET', 'index.php');
		$this->assertNotContainsLang('PS_WEAK', $crawler->filter('html')->text());
	}
}
