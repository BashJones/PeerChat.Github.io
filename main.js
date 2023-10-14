let localStream;
let remoteStream;
let peerConnection;


const servers = {
    iceServers:[
        {
            urls:['stun:stunl.1.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

/**
 * The getUserMedia func carries out the request for cam/mic perms
 * pass in the parameters of what you want access to
 */
let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream

    createOffer()
}
/**
 * peerConnection stores all info/methods to connect between peers
 * remoteStream sets up media stream for other user
 * offer - each peerConnection has an offer/answer (SDP)
 */
let createOffer = async () => {
//pass in the servers
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream

//loop through all the a/v tracks and add them to PeerConnection so remotePeer can access them
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    });

//listen for anytime remote peer adds track
//looping through every single track from remote peer
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
//Adding the track to the remote/peer stream 
            remoteStream.addTrack(track)
        })
    }

//Generate ICE candidates
    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            console.log('New ICE Candidate', event.candidate)
        }
    }

    let offer = await peerConnection.createOffer()
//Trigger STUN server and create candidates
    await peerConnection.setLocalDescription(offer)


    console.log('Offer:', offer)
}

init()