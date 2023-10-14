let localStream;
let remoteStream;

/**
 * The getUserMedia func carries out the request for cam/mic perms
 * pass in the parameters of what you want access to
 */
let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream
}

init()