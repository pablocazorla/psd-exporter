$(document).ready(function() {
	"use strict";

	var PSD = require('psd'),
		$wrap = $('#wrap'),
		tree = null,
		exported = null,
		groupID = 0,
		layerID = 0,
		exists = function(e){
			return typeof e != 'undefined';
		}

	var loop = function(itemExported, itemTree, $nodeParent) {
		var arrExported = itemExported.children,
			l = arrExported.length,
			arrTree = itemTree.children();

		for (var i = l - 1; i >= 0; i--) {
			var childExported = arrExported[i],
			childTree = arrTree[i];


			if (childExported.visible) {
				switch (childExported.type) {
					case 'group':
						// Render Group


						var $group = $('<div class="group" id="group-' + groupID + '" data-name="' + childExported.name + '"/>').appendTo($nodeParent);
						groupID++;

						// $group.css({
						// 	'top':childExported.top +'px',
						// 	'left':childExported.left +'px',
						// 	'width':childExported.width +'px',
						// 	'height':childExported.height +'px'
						// });



						loop(childExported, childTree , $group);
						break;
					default: //layer
						var $layer = $('<div class="layer" id="layer-' + layerID + '" data-name="' + childExported.name + '"/>').appendTo($nodeParent);
						layerID++;

						$layer.css({
							'top':childExported.top +'px',
							'left':childExported.left +'px',
							'width':childExported.width +'px',
							'height':childExported.height +'px'
						});

						$layer.append(itemTree.children()[i].toPng());


						// FX
						if(exists(childTree.layer.adjustments.objectEffects)){
							var fx = childTree.layer.adjustments.objectEffects.data;
							if(exists(fx.DrSh)){
								console.log(fx.DrSh);

								var sh = fx.DrSh;



								var color = 'rgba('+ sh["Clr "]["Rd  "]+','+ sh["Clr "]["Grn "]+','+ sh["Clr "]["Bl  "]+','+(0.01 * sh.Opct.value)+')';


								var x = -1 * sh.Dstn.value * Math.cos((sh.lagl.value * Math.PI/180));
								var y = sh.Dstn.value * Math.sin((sh.lagl.value * Math.PI/180));

								console.log(y);

								$layer.css({
									'box-shadow': x+'px '+ y+'px ' + sh.blur.value+'px '+color
								})

							}
							//console.log(fx);
						}
						
				}
			}

		}
	};


	var parsePSD = function() {
		exported = tree.export();
		var doc = exported.document;
		$wrap.width(doc.width).height(doc.height);
		//

		 		loop(exported, tree, $wrap);
		//
		//console.log(tree.children()[0].layer.adjustments.objectEffects.data);
	};



	PSD.fromURL("psd/wxa2.psd").then(function(psd) {
		tree = psd.tree();
		parsePSD();
	});



});