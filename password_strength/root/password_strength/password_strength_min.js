/**
*
* @package password_strength JavaScript Code
* @version 0.0.7 6/2/11 5:23 PM
* @copyright (c) 2011 VSE for phpBB
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
* @inspired by Naked Password by Platform45 at http://www.nakedpassword.com
*
**/

jQuery.fn.passwordStrength=function(){return this.each(function(){var c=new Array();c[0]=new Array($(this).css("background-color"),"");c[1]=new Array(ps_color1,ps_text1);c[2]=new Array(ps_color2,ps_text2);c[3]=new Array(ps_color3,ps_text3);c[4]=new Array(ps_color4,ps_text4);c[5]=new Array(ps_color5,ps_text5);function a(){var e=d($(this).val());b($(this),e)}function b(e,f){e.css("background-color",c[f][0]);$("#password_strength").html(c[f][1])}function d(e){return 0+(e.length>5)+(/[a-z]/.test(e)&&/[A-Z]/.test(e))+(/\d/.test(e)&&/\D/.test(e))+(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/.test(e)&&/\w/.test(e))+(e.length>12)}$(this).bind("keyup",a).bind("blur",a).after("<div id='password_strength'></div>")})};$(document).ready(function(){$("#new_password").passwordStrength()});