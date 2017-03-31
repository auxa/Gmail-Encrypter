var xhr = new XMLHttpRequest();
var resp;
	xhr.open("GET", "http://localhost/keys.json", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			// innerText does not let the attacker inject HTML elements.
			 resp = JSON.parse(xhr.responseText);
		}
	}
	xhr.send();

InboxSDK.load('2', 'sdk_auxaE_cc24e4dfd8').then(function(sdk){

	sdk.Conversations.registerThreadViewHandler(function(threadView){
		var temp123 = threadView.getSender();

		var el = document.createElement("div");
		el.innerHTML = 'Hello world! ' + temp123;


		threadView.addSidebarContentPanel({
			title: 'Sidebar Example',
			el: el
		});

	});
	// the SDK has been loaded, now do something with it!
	sdk.Compose.registerComposeViewHandler(function(composeView){

		// a compose view has come into existence, do something with it!
		composeView.addButton({
			title: "Encrypt",
			iconUrl: 'https://cdn1.iconfinder.com/data/icons/hawcons/32/698630-icon-114-lock-128.png',
			onClick: function(event) {
				var receiver =composeView.getToRecipients();
				console.log(receiver[0].emailAddress);
				var PassPhrase = "";
				for(var i =0; i< resp.keys.length; i++){
					if(resp.keys[i] != null && resp.keys[i].id == receiver[0].emailAddress){
						console.log('logging id '+ resp.keys[i].id);
						PassPhrase = resp.keys[i].pub_key;
						console.log('logging publicKeyString ' +resp.keys[i].pub_key);
						break;
					}
				}
				// The length of the RSA key, in bits.
				var Bits = 1024;
				var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
				var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);

				var message = composeView.getTextContent();
				console.log(receiver);



				var EncryptionResult = cryptico.encrypt(message, MattsPublicKeyString, MattsRSAkey);

				event.composeView.setBodyText(EncryptionResult.cipher);

			},
		});
		composeView.addButton({
			title: "Decrypt",
			iconUrl: 'https://cdn3.iconfinder.com/data/icons/web-and-internet-icons/512/Unlock-512.png',
			onClick: function(event) {
				var message = composeView.getTextContent();
				var Decrypt = cryptico.decrypt(message, MattsRSAkey);
				event.composeView.setBodyText(Decrypt.plaintext);

								console.log(Decrypt);
							},
						});
	});

});
