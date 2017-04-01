

InboxSDK.load('2', 'sdk_auxaE_cc24e4dfd8').then(function(sdk){

	sdk.Conversations.registerThreadViewHandler(function(threadView){
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
		var body = '';
		var sender ='';
		var xer;
		var el = document.createElement("div");
		 xer = threadView.getMessageViews();

		console.log(xer[0].getSender());
		var senderEmail = sdk.User.getEmailAddress();
		console.log(sender);

		console.log(xer[0].getBodyElement());
		var bob123 = xer[0].getBodyElement();
		var ten = bob123.innerHTML;
		var first = ten.indexOf("ltr") + 5;

		ten = ten.slice(first);

		first = ten.indexOf("</div><div") ;
		ten = ten.substring(0, first);
		ten = ten.replace(/<wbr>/g, "");
		var vello;
		var message = ten;
		console.log(message);
		//var Decrypt = cryptico.decrypt(message, MattsRSAkey);

	var canDe =-1	//check if the email is actually encrpyed and we have the key to unlock it
		for(var i =0; i< resp.keys.length; i++){
			if(resp.keys[i] != null && resp.keys[i].id == senderEmail){
				console.log('getting key for '+ resp.keys[i].id);
				vello = resp.keys[i].pri_key;
				console.log('logging private key ' + vello);
				console.log(resp.keys[i].pub_key);
				canDe =1;

				break;
			}
		}
		var Bits = 1024;

		//var MattsRSAkey = cryptico.generateRSAKey(vello, Bits);
		var myRSA = cryptico.generateRSAKey("Passphrase", Bits);
			var MattsPublicKeyString = cryptico.publicKeyString(myRSA);
			console.log(MattsPublicKeyString);
			var ans;
		if(canDe =1){
			console.log(message)
			 ans = cryptico.decrypt(message, myRSA);
			 console.log(ans);
		}


		el.innerHTML = 'Decrypted Message: <br> <br>' + ans.plaintext + '<br> <br> The Message was ' + ans.signature;
		threadView.addSidebarContentPanel({
			title: 'Decrypt',
			el: el
		});




	});

	// the SDK has been loaded, now do something with it!
	sdk.Compose.registerComposeViewHandler(function(composeView){

		// a compose view has come into existence, do something with it!
		composeView.addButton({
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
			title: "Encrypt",
			iconUrl: 'https://cdn1.iconfinder.com/data/icons/hawcons/32/698630-icon-114-lock-128.png',
			onClick: function(event) {
				var receiver =composeView.getToRecipients();
				console.log(receiver[0].emailAddress);
				var pubKey;
				var senderEmail = sdk.User.getEmailAddress();

				for(var i =0; i< resp.keys.length; i++){
					if(resp.keys[i] != null && resp.keys[i].id == receiver[0].emailAddress){
						console.log('logging id '+ resp.keys[i].id);
						pubKey = resp.keys[i].pub_key;
						console.log('logging publicKeyString ' +resp.keys[i].pub_key);
						break;
					}
				}
				var priKey;
				for(var i =0; i< resp.keys.length; i++){
					if(resp.keys[i] != null && resp.keys[i].id == senderEmail){
						console.log('logging id '+ resp.keys[i].id);
						priKey = resp.keys[i].pri_key;
						console.log('logging publicKeyString ' +priKey);
						break;
					}
				}

				// The length of the RSA key, in bits.
				var Bits = 1024;
				var myRSA1 = cryptico.generateRSAKey(priKey, Bits);
				//console.log(MattsRSAkey);
				//var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
				//console.log(MattsPublicKeyString);

				var message = composeView.getTextContent();
			//	console.log(receiver);


				var EncryptionResult = cryptico.encrypt(message, pubKey, myRSA1);

				event.composeView.setBodyText(EncryptionResult.cipher);

			},
		});
	});

});
