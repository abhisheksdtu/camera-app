// let allConstraints = navigator.MediaDevices.getSupportedConstraints()
// console.log('constraints', allConstraints);

// CREATE
let videoElem = document.querySelector('#video-elem');
// let audioElem = document.querySelector('audio');
let videoRecorder = document.querySelector('#record-video');
let captureBtn = document.querySelector('#capture');

let constraints = {
	video: true,
	audio: true,
};
let mediaRecorder;
let buffer = [];
let recordState = false;

// LOCAL MACHINE
navigator.mediaDevices
	.getUserMedia(constraints)
	.then(function (mediaStream) {
		// FEED
		videoElem.srcObject = mediaStream;
		// audioElem.srcObject = mediaStream;

		// GIVES A NEW OBJECT
		mediaRecorder = new MediaRecorder(mediaStream);

		mediaRecorder.addEventListener('dataavailable', function (e) {
			buffer.push(e.data);
		});

		mediaRecorder.addEventListener('stop', function (e) {
			// CONVERT THAT DATA INTO A BLOB
			// MIME TYPE
			let blob = new Blob(buffer, { type: 'video/mp4' });
			// CONVERT BLOB TO URL
			const url = window.URL.createObjectURL(blob);
			// DOWNLOAD BUTTON
			let a = document.createElement('a');
			// DOWNLOAD
			a.download = 'file.mp4';
			a.href = url;
			a.click();
			buffer = [];
		});
	})
	.catch(function (err) {
		console.log(err);
	});

videoRecorder.addEventListener('click', function () {
	if (!mediaRecorder) {
		alert('First allow permission');
	}

	if (recordState == false) {
		mediaRecorder.start();
		videoRecorder.innerHTML = 'Recording....';
		recordState = true;
	} else {
		mediaRecorder.stop();
		videoRecorder.innerHTML = 'Record....';
		recordState = false;
	}
});

captureBtn.addEventListener('click', function () {
	// CREATE A CANVAS ELEMENT EQUAL TO DIMENSIONS OF VIDEO FRAME
	let canvas = document.createElement('canvas');
	canvas.width = videoElem.videoWidth;
	canvas.height = videoElem.videoHeight;

	let tool = canvas.getContext('2d');

	// DRAWING A FRAME ON THE CANVAS
	tool.drawImage(videoElem, 0, 0);
	// CONVERT CANVAS toDataURL
	let link = canvas.toDataURL();
	// DOWNLOAD
	let anchor = document.createElement('a');
	anchor.href = link;
	anchor.download = 'file.jpg';
	anchor.click();
	anchor.remove();
});
