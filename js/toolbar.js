myPSD.vm.toolbarVM = (function() {
	"use strict";

	var toolVM = {
		isText: ko.observable(false),
		text: ko.observable(''),
		showTools:ko.observable(false)
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
/*
	toolVM.update = function(elementVM){
		toolVM.styles(elementVM.styles);
	};
*/
	toolVM.activeElement = ko.computed(function(){
		var doc = myPSD.vm.docListVM.activeDoc();
		if(doc == null){
			return null;
		}else{
			var elem = doc.activeElement();
			if(elem == null){
				return null;
			}else{
				return elem;
			}
		}
	});

	toolVM.textVisible = ko.computed(function(){
		return toolVM.text() != '';
	});

	toolVM.activeElement.subscribe(function(v){
		if(v == null){
			toolVM.showTools(false);
		}else{
			toolVM.showTools(true);
			toolVM.text(v.text);
			editor.setValue(v.styles, -1);
		}
	});
/*
	toolVM.styles.subscribe(function(v) {
		editor.setValue(v, -1);
	});
*/
	toolVM.activeDocIsNotEmpty = ko.computed(function() {
		var doc = myPSD.vm.docListVM.activeDoc();
		if (doc != null) {
			return !doc.empty();
		} else {
			return true;
		}
	});



	toolVM.bind = function() {
		ko.applyBindings(toolVM, document.getElementById('main-toolbar'));
	};
	return toolVM;
})();