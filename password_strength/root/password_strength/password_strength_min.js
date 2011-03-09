/**
*
* @package password_strength JavaScript Code mini
* @version 0.0.4 3/8/11 3:19 PM
* @copyright (c) 2011 VSE for phpBB
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
* @code inspired by Naked Password by Platform45 at http://www.nakedpassword.com
*
**/

jQuery.fn.passwordStrength=function(){return this.each(function(){var fieldColor=$(this).css("background-color");var trigger=function(e){password_level=getPasswordStrength($(this).val());toggleField($(this).attr("id"),password_level)};function toggleField(field,level){switch(level){case 0:$("#"+field).css("background-color",fieldColor);$("#"+field+"text").css("display","none");break;case 1:$("#"+field).css("background-color","#F5A9A9");$("#"+field+"text").html(ps_1).css("display","block");break;case 2:$("#"+field).css("background-color","#F5D0A9");$("#"+field+"text").html(ps_2).css("display","block");break;case 3:$("#"+field).css("background-color","#F3F781");$("#"+field+"text").html(ps_3).css("display","block");break;case 4:$("#"+field).css("background-color","#A9F5A9");$("#"+field+"text").html(ps_4).css("display","block");break;case 5:$("#"+field).css("background-color","#A9F5A9");$("#"+field+"text").html(ps_5).css("display","block");break}}function getPasswordStrength(password){var score=0;if(password.length>5){score++}if((password.match(/[a-z]/))&&(password.match(/[A-Z]/))){score++}if((password.match(/\d+/))&&(password.match(/\D+/))){score++}if((password.match(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]+/))&&(password.match(/\w+/))){score++}if(password.length>12){score++}return score}$(this).after("<div style='display:none;' id='"+$(this).attr("id")+"text"+"'></div>");$(this).bind('keyup',trigger).bind('blur',trigger)})};$(document).ready(function(){$("#new_password").passwordStrength()});