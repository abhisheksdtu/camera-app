let videoPlayer = document.getElementById('video-elem');

let videoRecordBtn = document.getElementById('record-video');

let constraints = { audio: true, video: true };

let recordState = false;
videoRecordBtn.addEventListener('click', function () {
	if (mediaRecorder != undefined) {
		if (recordState == false) {
			recordState = true;

			// STARTS RECORDING
			mediaRecorder.start();
			// WHEN RECORDING IS STARTED WE NEED TO CATCH THIS DATA
			// THE DATA IS SENT INTO BLOB TYPE
			// THIS DATA IS NOT SENT ALL AT ONCE
			// SO THE BROWSER SENDS DATA IN TIME INTERVALS IN CHUNKS SO WE STORE IT IN AN ARRAY
			// AND WE NEED TO COMBINE THIS DATA INTO ONE

			videoRecordBtn.innerText = 'Recording...';
		} else {
			recordState = false;

			// STOPS RECORDING
			mediaRecorder.stop();

			videoRecordBtn.innerText = 'Record';
		}
	}
});

let chunks = [];

let mediaRecorder;

navigator.mediaDevices
	.getUserMedia(constraints)
	.then(function (mediaStream) {
		// audioPlayer.srcObject = mediaStream;
		videoPlayer.srcObject = mediaStream;

		// CREATED A MediaRecorder OBJECT IN WHICH WE PASS THE MEDIA STREAM FOR RECORDING
		mediaRecorder = new MediaRecorder(mediaStream);

		// EVERY WE GET CHUNK OF DATA WE PUSH IT IN chunks ARRAY
		mediaRecorder.ondataavailable = function (e) {
			chunks.push(e.data);
		};

		// WHEN THE CHUNK OF DATA STOPS COMING
		mediaRecorder.onstop = function () {
			// CREATE A NEW BLOB FROM CHUNKS
			let blob = new Blob(chunks, { type: 'video/mp4' });

			// EMPTY CHUNKS
			chunks = [];

			// DOWNLOAD THIS BLOB FILE

			// CREATE A BLOB URL
			let blobUrl = URL.createObjectURL(blob);

			// CREATE LINK
			let link = document.createElement('a');
			// ADD HREF
			link.href = blobUrl;
			// GIVE FILE A NAME FOR DOWNLOADING
			link.download = 'video.mp4';
			// CLICK THE LINK
			link.click();
			// REMOVE THE ANCHOR ELEM
			link.remove();
		};
	})
	.catch(function (err) {
		console.log(err);
	});
