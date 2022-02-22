
async function KeyPress(e) {

    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 82 && evtobj.ctrlKey) {
        e.preventDefault();
        handleScreenRecord()
    }
}

// create button and call this function for record screen
async function handleScreenRecord(cb = function () { }) {
    if (record_status == false) { // have to record
        let stream = await recordScreen();
        let mimeType = 'video/webm';
        mediaRecorder = createRecorder(stream, mimeType, cb);
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

function createRecorder(stream, mimeType, cb = function () { }) {
    // the stream data is stored in this array
    let recordedChunks = [];

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (record_status == false) {
            record_status = true
            cb()
        }

        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = function () {
        saveFile(recordedChunks);
        recordedChunks = [];
        stream.getTracks().forEach(track => track.stop())
        cb()
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

window.addEventListener('load', function () {
    var myScript = document.querySelector('script[name="screenManager"]');
    if (record_status != undefined) {

        if (myScript) {
            var button = document.createElement("button")

            var x = myScript.getAttribute("x")
            var y = myScript.getAttribute("y")
            button.innerHTML = "Screen Record"
            button.id = "btn-record-screen"
            button.style.position = "fixed"
            button.style.left = `${x}px`
            button.style.top = `${y}px`
            var body = document.getElementsByTagName("body")

            // console.log(x, y, body,myScript);
            if (body.length > 0) {
                body[0].append(button)
            }

            button.addEventListener("click", function () {
                handleScreenRecord(function () {
                    console.log(record_status);
                    if (record_status == true) {
                        var btn = document.getElementById("btn-record-screen")
                        btn.innerText = "Stop Record"
                    } else {
                        var btn = document.getElementById("btn-record-screen")
                        btn.innerText = "Screen Record"
                    }
                })

            })
        } else {
            console.warn(`Can you add Attribute name equal screenManager <script name="screenManager"></script>`)
        }

    } else {
        console.warn("Can you create variables name record_status and set defult to true Boolean")
    }

})