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
		var body = '';
		var sender ='';
		var xer;

		var el = document.createElement("div");
		 xer = threadView.getMessageViews();

		el.innerHTML = 'Hello world! ' + body + " " + sender;
		threadView.addSidebarContentPanel({
			title: 'Decrypt',
			el: el
		});
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
		ten = ten.replace(/<wbr>/g, "/");

		var message = ten;
		//var Decrypt = cryptico.decrypt(message, MattsRSAkey);
	var canDe =-1	//check if the email is actually encrpyed and we have the key to unlock it
		for(var i =0; i< resp.keys.length; i++){
			if(resp.keys[i] != null && resp.keys[i].id == senderEmail){
				console.log('getting key for '+ resp.keys[i].id);
				publicKey = resp.keys[i].pub_key;
				console.log('logging publicKeyString ' + publicKey);
				canDe =1;
				break;
			}
		}
		var ans;
		if(canDe =1){
			 ans = cryptico.decrypt(message, publicKey);
		}


		console.log(ans);


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
			//	var Bits = 1024;
				//var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
				//console.log(MattsRSAkey);
				//var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
				//console.log(MattsPublicKeyString);

				var message = composeView.getTextContent();
			//	console.log(receiver);


				var EncryptionResult = cryptico.encrypt(message, PassPhrase);

				event.composeView.setBodyText(EncryptionResult.cipher);

			},
		});
		composeView.addButton({
			title: "Decrypt",
			iconUrl: 'https://cdn3.iconfinder.com/data/icons/web-and-internet-icons/512/Unlock-512.png',
			onClick: function(event) {


								console.log(Decrypt);
							},
						});
	});

});
