/**
*
* @package password_strength JavaScript Code mini
* @version 0.0.5 4/18/11 12:12 AM
* @copyright (c) 2011 VSE for phpBB
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
* @code inspired by Naked Password by Platform45 at http://www.nakedpassword.com
*
**/

jQuery.fn.passwordStrength=function(){return this.each(function(){var fieldColor=new Array($(this).css("background-color"),"#F5A9A9","#F5D0A9","#F3F781","#A9F5A9","#A9F5A9");var respText=new Array("",ps_1,ps_2,ps_3,ps_4,ps_5);function trigger(){var password_score=getPasswordStrength($(this).val());showStrength($(this),password_score)};function showStrength(field,score){field.css("background-color",fieldColor[score]);$("#password_strength").html(respText[score])}function getPasswordStrength(password){return 0+ +(password.length>5)+ +(/[a-z]/.test(password)&&/[A-Z]/.test(password))+ +(/\d/.test(password)&&/\D/.test(password))+ +(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/.test(password)&&/\w/.test(password))+ +(password.length>12)}$(this).bind('keyup',trigger).bind('blur',trigger).after("<div id='password_strength'></div>")})};$(document).ready(function(){$("#new_password").passwordStrength()});