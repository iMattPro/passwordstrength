/**
*
* @package password_strength JavaScript Code
* @version 0.0.7 6/2/11 5:23 PM
* @copyright (c) 2011 VSE for phpBB
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
* @inspired by Naked Password by Platform45 at http://www.nakedpassword.com
*
**/

(function( $ ){
	$.fn.passwordStrength = function()
	{
		return this.each(function()
		{
			var responseArr = new Array();
			responseArr[0] = new Array($(this).css("background-color"), ""); // 0 defaults
			responseArr[1] = new Array(ps_color1, ps_text1); // score 1
			responseArr[2] = new Array(ps_color2, ps_text2); // score 2
			responseArr[3] = new Array(ps_color3, ps_text3); // score 3
			responseArr[4] = new Array(ps_color4, ps_text4); // score 4
			responseArr[5] = new Array(ps_color5, ps_text5); // score 5
	
			function trigger()
			{
				var password_score = getPasswordStrength($(this).val());
				showStrength($(this), password_score);
			}
	
			function showStrength(field, score)
			{
				//Set the correct background color and text indicator for the current score
				field.css("background-color",responseArr[score][0]);
				$("#password_strength").html(responseArr[score][1]);
			}
	
			function getPasswordStrength(password)
			{
				return 0
				//if password has more than 5 characters give 1 point
				+ ( password.length > 5 )
				//if password has both lower and uppercase characters give 1 point
				+ ( /[a-z]/.test(password) && /[A-Z]/.test(password) )
				//if password has at least one number AND at least 1 other character give 1 point
				+ ( /\d/.test(password) && /\D/.test(password) )
				//if password has a combination of other characters and special characters give 1 point
				+ ( /[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/.test(password) && /\w/.test(password) )
				//if password has more than 12 characters give another 1 point
				+ ( password.length > 12 );
			}
	
			//Keyup listener
			$(this)
				.bind("keyup", trigger)
				.bind("blur", trigger)
				//Set up hidden text indicator
				.after("<div id='password_strength'></div>");
		});
	};
})( jQuery );

$(document).ready(function() {
	$("#new_password").passwordStrength();
});