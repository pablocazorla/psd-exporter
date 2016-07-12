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
			styles: '',

			adjusts: el.adjusts
		};
		vm.setActive = function() {
			ko.utils.arrayForEach(vm.parentDoc.elements(), function(vmElem) {
				if (vmElem.id !== vm.id) {
					vmElem.active(false);
				}
			});
//vm.element.layer.adjustments.solidColor.obj

			console.log(vm.adjusts);
			vm.active(true);
			vm.parentDoc.activeElement(vm);
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
				.replace(/\//g, '-');
			return cl;
		})();
		vm.styles = '.' + className + '{\n';
		vm.styles += '\t' + 'width: ' + vm.width + 'px;\n';
		vm.styles += '\t' + 'height: ' + vm.height + 'px;\n';
		vm.styles += (function() {
			if (typeof el.text !== 'undefined') {
				vm.text = el.text.value;
				var t = '';
				t += '\t' + 'font-family: "' + el.text.font.name + '";\n';

				if(el.text.font.name.toLowerCase().indexOf('bold')>=0){
					t += '\t' + 'font-weight: bold;\n';
				}


				var col = (function() {
					var a = el.text.font.colors[0];
					return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + a[3] + ')';
				})();
				t += '\t' + 'color: ' + col + ';\n';

				t += '\t' + 'text-align: ' + el.text.font.alignment[0] + ';\n';

				var size = (function() {
					var s = el.text.font.sizes[0],
						p = 0.5 * (el.text.transform.xx + el.text.transform.yy);
						return Math.round(s * p);
				})();

				t += '\t' + 'font-size: ' + size + 'px;\n';

				return t;
			} else {
				return '';
			}
		})();

		/* FX ******************/
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

			elements: ko.observableArray(),
			activeElement: ko.observable(null)
		};
		vm.setActive = function() {
			ko.utils.arrayForEach(vmList.list(), function(vmDoc) {
				if (vmDoc.id !== vm.id) {
					vmDoc.active(false);
				}
			});
			vm.active(true);
			vmList.activeDoc(vm);
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
		activeDoc: ko.observable(null)
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
				vmList.activeDoc(null);
			}
		}
	};
	vmList.showAddBtn = ko.computed(function() {
		var arr = vmList.list(),
			l = arr.length,
			flag = true;
		for (var i = 0; i < l; i++) {
			if (arr[i].empty()) {
				flag = false;
			}
		}

		return flag;
	});



	vmList.bind = function() {
		ko.applyBindings(vmList, document.getElementById('main-tabber'));
		ko.applyBindings(vmList, document.getElementById('main-container'));
		vmList.newDoc();
	};


	return vmList;
})();