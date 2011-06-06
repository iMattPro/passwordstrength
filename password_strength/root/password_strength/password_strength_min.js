/**
*
* @package password_strength JavaScript Code
* @version 0.0.7 6/2/11 5:23 PM
* @copyright (c) 2011 VSE for phpBB
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
* @inspired by Naked Password by Platform45 at http://www.nakedpassword.com
*
**/

(function(a){a.fn.passwordStrength=function(){return this.each(function(){var d=new Array();d[0]=new Array(a(this).css("background-color"),"");d[1]=new Array(ps_color1,ps_text1);d[2]=new Array(ps_color2,ps_text2);d[3]=new Array(ps_color3,ps_text3);d[4]=new Array(ps_color4,ps_text4);d[5]=new Array(ps_color5,ps_text5);function b(){var f=e(a(this).val());c(a(this),f)}function c(f,g){f.css("background-color",d[g][0]);a("#password_strength").html(d[g][1])}function e(f){return 0+(f.length>5)+(/[a-z]/.test(f)&&/[A-Z]/.test(f))+(/\d/.test(f)&&/\D/.test(f))+(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/.test(f)&&/\w/.test(f))+(f.length>12)}a(this).bind("keyup",b).bind("blur",b).after("<div id='password_strength'></div>")})}})(jQuery);$(document).ready(function(){$("#new_password").passwordStrength()});