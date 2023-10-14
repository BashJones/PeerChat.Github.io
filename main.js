//Yeeeeeah best replace with token authentication
let APP_ID = "0a6cf4470e0442939e5917ec50dbd8a8";

//pass this in next weekend!
let token = null;
//generate a random ID number for now mehhhh
let uid = String(Math.floor(Math.random() * 1000))

//create client object we can log in with
let client;
//The channel that the users actually join
let channel;

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

    //Create client object
    client = await AgoraRTM.createInstance(APP_ID)
    //The token value is null till you decide to implement it
    await client.login({uid, token})

    //change main to room ID once you figure out how
    //Create channel and jon functionality
    channel = client.createChannel('main')
    await channel.join()

    //Event listener for when the join method is called
    channel.on('MemberJoined', handleUserJoined)

    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream

    createOffer()
}

//Function to handle users who join
let handleUserJoined = async (MemberID) => {
    console.log('A new hero joined the channel', MemberID)
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