myPSD.vm.toolbarVM = (function() {
	"use strict";

	var toolVM = {
		isText: ko.observable(false),
		text: ko.observable(''),
		styles: ko.observable('')
	};


	var editor = ace.edit('css-output');
	editor.session.setUseWrapMode(true);
	editor.$blockScrolling = Infinity;
	editor.setShowPrintMargin(false);
	editor.setReadOnly(true);
	editor.setOptions({
		maxLines: Infinity
	});
	editor.setTheme("ace/theme/monokai");
	editor.renderer.setShowGutter(false);
	editor.session.setMode('ace/mode/css');
	editor.getSession().setTabSize(2);

	editor.setValue('', -1);

	toolVM.update = function(elementVM){
		toolVM.styles(elementVM.styles);
	};

	toolVM.styles.subscribe(function(v) {
		editor.setValue(v, -1);
	});

	toolVM.bind = function() {
		ko.applyBindings(toolVM, document.getElementById('main-toolbar-container'));
	};
	return toolVM;
})();