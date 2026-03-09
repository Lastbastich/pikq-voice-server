const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const PORT = process.env.PORT || 3000;

app.post("/token", async (req, res) => {
  try {
    const { roomName, identity, canPublish } = req.body;

    if (!roomName || !identity) {
      return res.status(400).json({
        error: "roomName and identity are required"
      });
    }

    const token = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      { identity }
    );

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: !!canPublish,
      canSubscribe: true
    });

    const jwt = await token.toJwt();

    res.json({ token: jwt });
  } catch (error) {
    console.error("Token creation error:", error);
    res.status(500).json({ error: "Failed to create token" });
  }
});

app.get("/", (req, res) => {
  res.send("Pikq voice server is running.");
});

app.listen(PORT, () => {
  console.log(`Pikq voice server running on port ${PORT}`);
});