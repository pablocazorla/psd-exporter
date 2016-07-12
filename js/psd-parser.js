myPSD.psdParser = function(psd) {
	"use strict";

	var data = {},
		tree = psd.tree(),
		exported = tree.export(),
		elementIdCouter = 0;
	//
	data.width = exported.document.width;
	data.height = exported.document.height;
	data.image = psd.image.toPng().src;
	data.elements = [];

	var loop = function(itemExported, itemTree) {

		var arrExported = itemExported.children,
			arrTree = itemTree.children(),
			l = arrExported.length;
		for (var i = l - 1; i >= 0; i--) {
			var childExported = arrExported[i],
				childTree = arrTree[i];


			if (childExported.visible) {
				if (childExported.type == 'layer') {
					var el = {};
					el.adjusts = childTree.layer.adjustments;
					
					el.id = elementIdCouter++;
					el.title = childExported.name;


					var masked = myPSD.exists(childTree.clippingMaskCached);

					var props = masked ? childTree.clippingMaskCached : childExported;



					el.top = (props.top < 0) ? 0 : props.top;
					el.left = (props.left < 0) ? 0 : props.left;
					el.right = (function() {
						var r = data.width - (el.left + props.width);
						return (r < 0) ? 0 : r;
					})();
					el.bottom = (function() {
						var b = data.height - (el.top + props.height);
						return (b < 0) ? 0 : b;
					})();
					el.width = data.width - (el.left + el.right);
					el.height = data.height - (el.top + el.bottom);


					// Remove masks
					if (masked) {
						var lenForMask = data.elements.length,
							indToremoveMask = -1;
						for (var j = lenForMask - 1; j <= 0; j--) {
							var elPrev = data.elements[j];
							if (elPrev.top == el.top && elPrev.left == el.left && elPrev.right == el.right && elPrev.bottom == el.bottom) {
								indToremoveMask = j;
							}
						}
						data.elements.splice(indToremoveMask, 1);
					}
					//////////
					/*************************/
					// TEXT
					el.text = childExported.text;
					/*************************/
					//////////
					if (el.top == 0 && el.left == 0 && el.right == 0 && el.bottom == 0) {
						// is background
					} else {
						data.elements.push(el);
					}



				} else {
					loop(childExported, childTree);
				}
			}

		}


	};
	loop(exported, tree);
	return data;
};