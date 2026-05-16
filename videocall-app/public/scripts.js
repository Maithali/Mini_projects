const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {};
const roomId = "room1";

// connect to peer server
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3000",
  path: "/peerjs",
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    // Answer calls
    myPeer.on("call", (call) => {
      call.answer(stream);

      const video = document.createElement("video");

      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // Call new user
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

myPeer.on("open", (id) => {
  socket.emit("join-room", roomId, id);
});

// Connect to new user
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

// Remove disconnected users
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

// Add video to UI
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
