InboxSDK.load('1.0', 'Encrypt').then(function(sdk){

	// the SDK has been loaded, now do something with it!
	sdk.Compose.registerComposeViewHandler(function(composeView){

		// a compose view has come into existence, do something with it!
		composeView.addButton({
			title: "Encrypt",
			iconUrl: 'https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365',
			onClick: function(event) {

				var message = composeView.getTextContent();

				var PassPhrase = "The Moon is a Harsh Mistress.";

				// The length of the RSA key, in bits.
				var Bits = 1024;

				var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
			//	console.log(MattsRSAkey);


				var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
				var EncryptionResult = cryptico.encrypt(message, MattsPublicKeyString);

				event.composeView.setBodyText(EncryptionResult.cipher);

				console.log(EncryptionResult.cipher);
			},
		});

	});

});
