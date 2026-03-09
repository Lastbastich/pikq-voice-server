const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

app.post("/token", async (req, res) => {
  const { roomName, identity, canPublish } = req.body;

  const token = new AccessToken(
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    { identity }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: canPublish,
    canSubscribe: true
  });

  const jwt = await token.toJwt();

  res.json({ token: jwt });
});

app.listen(3000, () => {
  console.log("Pikq voice server running");
});