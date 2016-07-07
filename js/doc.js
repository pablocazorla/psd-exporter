// Doc
myPSD.vm.docListVM = (function() {
	"use strict";

	var elementVM = function(el, parentDoc) {
		var vm = {
			id: el.id,
			title: el.title,
			top: el.top,
			left: el.left,
			width: el.width,
			height: el.height,
			labelWidth: el.width + 'px',
			labelHeight: el.height + 'px',
			active: ko.observable(false),
			parentDoc: parentDoc,
			text: '',
			styles: ''
		};
		vm.setActive = function() {
			ko.utils.arrayForEach(vm.parentDoc.elements(), function(vmElem) {
				if (vmElem.id !== vm.id) {
					vmElem.active(false);
				}
			});
			vm.active(true);
			myPSD.vm.toolbarVM.update(vm);
		};

		// Set Styles
		var className = (function() {
			var cl = vm.title
				.toLowerCase()
				.replace(/á/g, 'a')
				.replace(/é/g, 'e')
				.replace(/í/g, 'i')
				.replace(/ó/g, 'o')
				.replace(/ú/g, 'u')
				.replace(/ /g, '-')
				.replace(/ñ/g, 'n')
			;
			return cl;
		})();


		vm.styles = '.' + className + '{\n';
		vm.styles += '\t' + 'width:' + vm.width + 'px;\n';
		vm.styles += '\t' + 'height:' + vm.height + 'px;\n';
		vm.styles += '}';



		return vm;
	};



	//
	var docVM = function(idDoc) {
		var vm = {
			id: idDoc,
			idNode: 'psd-canvas-' + idDoc,
			title: ko.observable('untitled-' + idDoc),
			active: ko.observable(false),
			empty: ko.observable(true),
			width: ko.observable('0px'),
			height: ko.observable('0px'),
			image: ko.observable(''),

			elements: ko.observableArray()
		};
		vm.setActive = function() {
			ko.utils.arrayForEach(vmList.list(), function(vmDoc) {
				if (vmDoc.id !== vm.id) {
					vmDoc.active(false);
				}
			});
			vm.active(true);
			vmList.activeDoc = vm;
			vmList.activeDocID(vm.id);
		};
		vm.close = function() {
			vmList.closeDoc(vm.id);
		};

		vm.shown = ko.computed(function() {
			return vm.active() && !vm.empty();
		});


		/* Elements */
		vm.update = function(psd, title) {
			if (title) {
				vm.title(title);
			}

			vm.empty(false);
			var data = myPSD.psdParser(psd);

			vm.width(data.width + 'px');
			vm.height(data.height + 'px');
			vm.image(data.image);



			var l = data.elements.length;

			for (var i = 0; i < l; i++) {
				var el = elementVM(data.elements[i], vm);
				vm.elements.push(el);
			}



		};
		/************************/
		vm.setActive();

		return vm;
	};

	// DocList
	var idCounter = 0;
	var vmList = {
		list: ko.observableArray(),
		activeDoc: null,
		activeDocID: ko.observable()
	};
	vmList.newDoc = function() {
		var newDoc = docVM(idCounter++);
		vmList.list.push(newDoc);
	};
	vmList.closeDoc = function(idDoc) {
		var arr = vmList.list(),
			l = arr.length,
			index = 0;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id === idDoc) {
				index = i;
			}
		};
		var isActive = vmList.list()[index].active();
		vmList.list.splice(index, 1);
		if (isActive) {
			var nextActive = vmList.list().length - 1;
			if (nextActive >= 0) {
				vmList.list()[nextActive].setActive();
			} else {
				vmList.activeDoc = null;
				vmList.activeDocID(null);
			}
		}
	};
	vmList.activeIsEmpty = ko.computed(function() {
		vmList.activeDocID();
		if (vmList.activeDoc != null) {
			return vmList.activeDoc.empty();
		} else {
			return false;
		}
	});


	vmList.bind = function() {
		ko.applyBindings(vmList, document.getElementById('main-tabber'));
		ko.applyBindings(vmList, document.getElementById('main-container'));
	};


	return vmList;
})();