// APP
$(document).ready(function() {
	"use strict";

	var PSD = require('psd'),
		$wrap = $('#wrap'),
		tree = null,
		exported = null,
		doc = null,
		layerID = 0,
		exists = function(e) {
			return typeof e != 'undefined';
		};

	var loop = function(itemExported, itemTree) {
		var arrExported = itemExported.children,
			l = arrExported.length;

		var arrTree = itemTree.children();



		for (var i = l - 1; i >= 0; i--) {
			var childExported = arrExported[i];
			var childTree = arrTree[i];
			if (childExported.visible) {
				if (childExported.type == 'layer') {
					var $layer = $('<div class="layer" id="layer-' + layerID + '" data-name="' + childExported.name + '"/>').appendTo($wrap);
					layerID++;

					var top = (childExported.top + 1 < 0) ? 0 : childExported.top + 1,
						left = (childExported.left + 1 < 0) ? 0 : childExported.left + 1,
						width = childExported.width - 2,
						height = childExported.height - 2;


					if (exists(childTree.clippingMaskCached)) {
						top = childTree.clippingMaskCached.coords.top;
						left = childTree.clippingMaskCached.coords.left;
						width = doc.width - left - childTree.clippingMaskCached.coords.right;
						height = doc.width - top - childTree.clippingMaskCached.coords.bottom;
					}



					$layer.css({
						'top': top + 'px',
						'left': left + 'px',
						'width': width + 'px',
						'height': height + 'px'
					});
					// if (childExported.name == 'Layer 16' || childExported.name == 'xRectangle 3' || childExported.name == 'xLOGOPABLO') {
					// 	console.log(childTree);
					// }

					//$layer.append('<div class="label label-name">'+childExported.name+'</div>');

					$layer.append('<div class="label label-width">'+width + 'px</div>');
					$layer.append('<div class="label label-height">'+height + 'px</div>');



				} else {
					loop(childExported, childTree);
				}
			}
		}
	};



	var parsePSD = function(psd) {
		tree = psd.tree();
		exported = tree.export();
		doc = exported.document;
		$wrap
			.append(psd.image.toPng())
			.width(doc.width)
			.height(doc.height);
		//

		loop(exported, tree);
		//
		//console.log(tree.children()[0].layer.adjustments.objectEffects.data);

	};



//	PSD.fromURL("psd/wxa.psd").then(parsePSD);



});