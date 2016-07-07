// BOOT
$(document).ready(function() {
	myPSD.PSD = require('psd');
	
myPSD.dropzone.init();


	// Bind of VMs
	for (var a in myPSD.vm) {
		myPSD.vm[a].bind();
	}
});