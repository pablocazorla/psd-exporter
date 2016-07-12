// BOOT
$(document).ready(function() {
	myPSD.PSD = require('psd');
	
	// Bind of VMs
	for (var a in myPSD.vm) {
		myPSD.vm[a].bind();
	}
});