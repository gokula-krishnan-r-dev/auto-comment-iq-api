const express = require("express");
const bardRouter = express.Router();
const https = require("https");
const { v4: uuidv4 } = require("uuid");
// const { get } = require("curl-cmd");
const axios = require("axios");
// bardRouter.get("/bard", async (req, res) => {
//   const { message } = req.query;
//   try {
//     const response = await testAssistant(String(message));
//     console.log("Bard:", response);
//     res.json(response);
//   } catch (error) {
//     console.error("Error asking Bard AI:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

async function testAssistant(message) {
  try {
    const BardModule = await import("bard-ai");
    const BARD_API_KEY =
      "g.a000gAg7ciMPiZdvFwqO716fBrsCbJcgEvXNnERYuerqhFLcuhpuv8RzPii9RHgmErMkLXFjUgACgYKATsSAQASFQHGX2MiQ4Z6wRufzvcxT0NdJ6ut8RoVAUF8yKo6Qz86tAPP7MY8RbdiS-SW0076";

    const bard = new BardModule.default(BARD_API_KEY);

    const response = await bard.ask(String(message));
    return response;
  } catch (error) {
    console.error("Error in testAssistant:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
}

// Create an instance of Axios with default configuration
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Origin: "https://chat9.yqcloud.top",
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

bardRouter.get("/chatos", async (req, res) => {
  const { message } = req.query;

  try {
    const response = await axiosInstance.post(
      "https://api.aichatos.cloud/api/generateStream",
      {
        network: true,
        prompt: `"${message}" write a replay message for this comment message in you tube replay in main message only remove all other content and show only main content wand also write. 8 word sentence only if you canot provide code then show i can not provide code but watch video to get code use english as language and tamil`,
        stream: false,
        system: "",
        userId: "#/chat/1707212514306",
        withoutContext: false,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error asking Chatos AI:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = bardRouter;
