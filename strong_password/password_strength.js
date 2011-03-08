/*
 * jQuery Password Strength Indicator 0.0.2
 *
 * Code inspired by Naked Password by Platform45 at http://www.nakedpassword.com
 */

jQuery.fn.passwordStrength = function ()
{
	return this.each (function ()
	{
		var prev_password_level = 0;

		var trigger = function(e)
		{
			var forward = false;
			password_level = getPasswordStrength($(this).val());
			if (prev_password_level <= password_level)
			{
				forward = true;
			}

			toggleField($(this).attr("id"), password_level);

		};

		function toggleField(field, level)
		{
			//Set the correct background color and text indicator for the current score
			switch (level)
			{
				case 0: 
					$("#" + field).css("background-color","#ffffff"); //white
					$("#" + field + "text").css("display", "none");
				break;

				case 1: 
					$("#" + field).css("background-color","#F5A9A9"); //red
					$("#" + field + "text").html("Very Weak").css("display", "block");
				break;

				case 2: 
					$("#" + field).css("background-color","#F5D0A9"); //orange
					$("#" + field + "text").html("Weak").css("display", "block");
				break;

				case 3: 
					$("#" + field).css("background-color","#F3F781"); //yellow
					$("#" + field + "text").html("Good").css("display", "block");
				break;

				case 4: 
					$("#" + field).css("background-color","#A9F5A9"); //green
					$("#" + field + "text").html("Strong").css("display", "block");
				break;

				case 5: 
					$("#" + field).css("background-color","#A9F5A9"); //green
					$("#" + field + "text").html("Very Strong").css("display", "block");
				break;
			}
		}

		function getPasswordStrength(password)
		{
			var score = 0;
			 
			//if password bigger than 5 give 1 point
			if (password.length > 5) { score++; }
			 
			//if password has both lower and uppercase characters give 1 point
			if ( ( password.match(/[a-z]/) ) && ( password.match(/[A-Z]/) ) ) { score++; }
			 
			//if password has at least one number AND at least 1 other character give 1 point
			if ( ( password.match(/\d+/) ) && ( password.match(/\D+/) ) ) { score++; }
			 
			//if password has a combination of other characters and special caracthers give 1 point
			if ( ( password.match(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]+/) ) && ( password.match(/\w+/) ) ) { score++; }
			 
			//if password bigger than 12 give another 1 point (thanks reddit)
			if (password.length > 12) { score++; }
			 
			return score;
		}

		//Set up hidden text indicator
		$(this).after("<div style='display:none;' id='" + $(this).attr("id") + "text" + "'></div>");
		
		//Keyup listener
		$(this).bind('keyup', trigger).bind('blur', trigger);
	});
};

$(document).ready(function() {
	$("#new_password").passwordStrength();
});