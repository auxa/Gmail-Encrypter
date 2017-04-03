var xhr = new XMLHttpRequest();
var resp;
	xhr.open("GET", "http://localhost/keys.json", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			 resp = JSON.parse(xhr.responseText);
		}
	}
	xhr.send();

InboxSDK.load('2', 'sdk_auxaE_cc24e4dfd8').then(function(sdk){

	sdk.Conversations.registerThreadViewHandler(function(threadView){
		var body = '';
		var xer;
		var el = document.createElement("div");
		 xer = threadView.getMessageViews();

		var sender =xer[0].getSender();

		var receiverEmail = sdk.User.getEmailAddress();
		var senderEmail =sender.emailAddress;

		console.log(senderEmail);

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

	var canDe =-1	//check if the email is actually encrpyed and we have the key to unlock it
		for(var i =0; i< resp.keys.length; i++){
			if(resp.keys[i] != null && resp.keys[i].id == receiverEmail){
				console.log('getting key for '+ resp.keys[i].id);
				vello = resp.keys[i].pri_key;
				console.log('logging private key ' + vello);
				console.log(resp.keys[i].pub_key);
				canDe =1;

				break;
			}
		}

			var ans;
		if(canDe ===1){
			var Bits = 1024;
			var myRSA = cryptico.generateRSAKey(vello, Bits);
				var MattsPublicKeyString = cryptico.publicKeyString(myRSA);
				console.log(MattsPublicKeyString);
			console.log(message)
			 ans = cryptico.decrypt(message, myRSA);
			 console.log(ans);
			 el.innerHTML = 'Decrypted Message: <br> <br>' + ans.plaintext + '<br> <br> The Message was ' + ans.signature;

		}else{
			el.innerHTML = 'Access Denied: Consult Session Manager';

		}
		threadView.addSidebarContentPanel({
			title: 'Decrypt',
			el: el
		});
	});

	sdk.Compose.registerComposeViewHandler(function(composeView){

		composeView.addButton({
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
				console.log(resp);
				var Bits = 1024;

				var myRSA1 = cryptico.generateRSAKey(priKey, Bits);

				var message = composeView.getTextContent();

				var EncryptionResult = cryptico.encrypt(message, pubKey, myRSA1);

				event.composeView.setBodyText(EncryptionResult.cipher);

			},
		});
	});

});
