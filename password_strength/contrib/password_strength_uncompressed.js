/**
*
* @package password_strength JavaScript Code
* @version 0.0.6 4/25/11 7:48 PM
* @copyright (c) 2011 VSE for phpBB
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
* @inspired by Naked Password by Platform45 at http://www.nakedpassword.com
*
**/

jQuery.fn.passwordStrength = function()
{
	return this.each(function()
	{
		var fieldColor = new Array(
			$(this).css("background-color"), // 0 default field color
			"#f5a9a9", // 1 red
			"#f5d0a9", // 2 orange
			"#f3f781", // 3 yellow
			"#a9f5a9", // 4 green
			"#00ff00"  // 5 green
		);
		var respText = new Array("", ps_1, ps_2, ps_3, ps_4, ps_5);

		function trigger()
		{
			var password_score = getPasswordStrength($(this).val());
			showStrength($(this), password_score);
		}

		function showStrength(field, score)
		{
			//Set the correct background color and text indicator for the current score
			field.css("background-color",fieldColor[score]);
			$("#password_strength").html(respText[score]);
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
		$(this).bind('keyup', trigger).bind('blur', trigger)
		//Set up hidden text indicator
		.after("<div id='password_strength'></div>");
	});
};

$(document).ready(function() {
	$("#new_password").passwordStrength();
});