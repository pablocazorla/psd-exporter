myPSD.dropzone = (function() {


	var dz = {};


	dz.init = function() {

		var nodeDZ = document.getElementById('drop-zone'),
			$nodeDZ = $(nodeDZ),
			$msg = $nodeDZ.find('.drop-zone-msg'),
			$msgErrorText = $msg.find('.msg-error-text'),
			error = '',
			msgErrors = {
				numFiles: 'Please, drop just 1 file',
				wrongFile: 'Wrong file'
			},
			setError = function() {
				$msgErrorText.text(msgErrors[error]);
				$msg.addClass('error');
			},
			loading = false,
			statusLoading = function(flag) {
				loading = flag;

				if (loading) {
					error = '';
					$msg.removeClass('error');
					$msg.addClass('loading');
				} else {
					$msg.removeClass('loading');
				}
			},


			onDragOver = function(e) {
				e.stopPropagation();
				e.preventDefault();
				e.dataTransfer.dropEffect = 'copy';
			},
			onDrop = function(e) {
				e.stopPropagation();
				e.preventDefault();
				if (!loading) {
					statusLoading(true);
					if (e.dataTransfer.files.length > 1) {
						error = 'numFiles';
					} else {
						var arr = e.dataTransfer.files[0].name.split('.'),
							ext = arr[arr.length - 1];
						if (ext.toLowerCase() != 'psd') {
							error = 'wrongFile';
						}
					}

					if (myPSD.exists(e.dataTransfer.files[0].name)) {
						var title = e.dataTransfer.files[0].name;
					} else {
						var title = false;
					}

					if (error !== '') {
						statusLoading(false);
						setError();
					} else {
						setTimeout(function() {
							myPSD.PSD.fromEvent(e).then(
								function(psd) {
									myPSD.vm.docListVM.activeDoc.update(psd, title);
									statusLoading(false);
								}
							);
						}, 100);
					}
				}
			};

		nodeDZ.addEventListener('dragover', onDragOver, true);
		nodeDZ.addEventListener('drop', onDrop, true);
	};

	return dz;

})()