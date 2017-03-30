function ConvertFormToJSON(form){
			var array = jQuery(form).serializeArray();
			var json = {};

			jQuery.each(array, function() {
				json[this.name] = this.value || '';
			});

			return json;
		}

		jQuery(document).on('ready', function() {
			jQuery('form#add-new-task').bind('submit', function(event){
				event.preventDefault();

				var form = this;
				var json = ConvertFormToJSON(form);
				var tbody = jQuery('#to-do-list > tbody');

				$.ajax({
					type: "POST",
					url: "submit.php",
					data: json,
					dataType: "json"
				}).always(function() {
					tbody.append('<tr><th scope="row" style="background-color:' + form['new-task-color'].value +
						'"><input type="checkbox" /></th><td>' + form['new-task-date'].value +
						'</td><td>' + form['new-task-priority'].value + '</td><td>' + form['new-task-name'].value +
						'</td><td>' + form['new-task-desc'].value + '</td><td>' + form['new-task-email'].value + '</td></tr>');
				}).fail(function() {
					alert("Failed to add to-do");
				});

				return true;
			});
		});
