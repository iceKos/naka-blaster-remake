
async function KeyPress(e) {

    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 82 && evtobj.ctrlKey) {
        e.preventDefault();
        handleScreenRecord()
    }
}

async function handleScreenRecord() {
    if (record_status == false) { // have to record
        let stream = await recordScreen();
        let mimeType = 'video/webm';
        mediaRecorder = createRecorder(stream, mimeType);
    } else { // have record then have to stop and save data
        mediaRecorder.stop();
        record_status = false
    }
}

async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: { mediaSource: "screen", width: 1080, height: 720 }
    });
}

function createRecorder(stream, mimeType) {
    // the stream data is stored in this array
    let recordedChunks = [];

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (record_status == false) {
            record_status = true
        }

        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = function () {
        saveFile(recordedChunks);
        recordedChunks = [];
        stream.getTracks().forEach(track => track.stop())
    };



    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
}

function saveFile(recordedChunks) {

    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    let filename = window.prompt('Enter file name'),
        downloadLink = document.createElement('a');
    downloadLink.target = "_blank"
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.webm`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
    record_status = false
}

document.onkeydown = KeyPress;