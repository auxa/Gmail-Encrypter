chrome.runtime.sendMessage({
    'title': document.title,
    'url': window.location.href,
    'summary': window.getSelection().toString()
});
InboxSDK.load('2', 'sdk_auxaE_cc24e4dfd8').then(function(sdk){

	// the SDK has been loaded, now do something with it!
	sdk.Compose.registerComposeViewHandler(function(composeView){

		var PassPhrase = "Passphrase";
		// The length of the RSA key, in bits.
		var Bits = 1024;
		var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
		var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);

		// a compose view has come into existence, do something with it!
		composeView.addButton({
			title: "Encrypt",
			iconUrl: 'https://cdn1.iconfinder.com/data/icons/hawcons/32/698630-icon-114-lock-128.png',
			onClick: function(event) {

				var message = composeView.getTextContent();

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
