/**
*
* @package password_strength JavaScript Code
* @version 0.0.6 4/25/11 7:48 PM
* @copyright (c) 2011 VSE for phpBB
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
* @inspired by Naked Password by Platform45 at http://www.nakedpassword.com
*
**/

jQuery.fn.passwordStrength=function(){return this.each(function(){var fieldColor=new Array($(this).css("background-color"),"#f5a9a9","#f5d0a9","#f3f781","#a9f5a9","#00ff00");var respText=new Array("",ps_1,ps_2,ps_3,ps_4,ps_5);function trigger(){var password_score=getPasswordStrength($(this).val());showStrength($(this),password_score)}function showStrength(field,score){field.css("background-color",fieldColor[score]);$("#password_strength").html(respText[score])}function getPasswordStrength(password){return 0+(password.length>5)+(/[a-z]/.test(password)&&/[A-Z]/.test(password))+(/\d/.test(password)&&/\D/.test(password))+(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/.test(password)&&/\w/.test(password))+(password.length>12)}$(this).bind('keyup',trigger).bind('blur',trigger).after("<div id='password_strength'></div>")})};$(document).ready(function(){$("#new_password").passwordStrength()});