const express = require("express");
import RouterApp from "./routes/route";
import mongoose from "mongoose";
const https = require("https");
import session from "express-session";
import cors from "cors";
import authRouter from "./routes/authRouter/authRouter";
import axios from "axios";
import Replicate from "replicate";
import { authenticateUser } from "./utils/verifyToken";
import createWebSocketServer from "./websocket/replyComment";
import Chat from "./websocket/RoomChat";
import MessageModel from "./websocket/models/Message";
const cookieParser = require("cookie-parser");
const passport = require("passport");
const app = express();
const port = 3000;

// const connectToMongoDB = require("./services/db/Mongodb"); // Import the module
const MONGODB_URI =
  "mongodb+srv://gokul:UPw3fCb6kDmF5CsE@cluster0.klfb9oe.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});
const { Hercai } = require("hercai");

const herc = new Hercai(); //new Hercai("your api key"); => Optional

/* Available Models */
/* "v3-beta" , "gemini" */
/* Default Model; "v3-beta" */

const connectToMongoDB = mongoose.connection;

connectToMongoDB.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
connectToMongoDB.once("open", () => {
  console.log("Connected to MongoDB");
});
require("./services/passport/passport");
app.use(cors());
app.use(authenticateUser);
createWebSocketServer();
Chat();

app.use(
  session({
    secret: "waytobigsecret",
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGODB_URI,
    //   ttl: 14 * 24 * 60 * 60, // 14 days
    // }),
  })
);

app.get("/ai", (req, res) => {
  const message = req.query.message;
  herc.question({ model: "v3-beta", content: message }).then((response) => {
    return res.json({ reply: response.reply });
    /* The module will reply based on the message! */
  });
});

app.use(cookieParser());
app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/docs", express.static("docs"));
app.use("/v1", RouterApp);
app.use("/auth", authRouter);
const openai = require("openai");
openai.apiKey = "AIzaSyDAIbJTbNIebqH1aw78RK19q13btquteWM";
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyD4K8sR-pV-n9wmB_FieK4gGJDAq3fIqAw";

async function run() {}

app.get("/api/gemini", async (req, res) => {
  const { message } = req.query;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 100,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [{ text: message }];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  // console.log(response.text());
  res.json({ response: response.text() });
});
const genAI = new GoogleGenerativeAI(API_KEY);
app.get("/generateContent", async (req, res) => {
  try {
    const { input } = req.query;

    if (!input) {
      return res
        .status(400)
        .json({ error: 'Input parameter "input" is required.' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContentStream([input]);
    const generatedContent = [];

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      generatedContent.push(chunkText);
    }

    res.json({ generatedContent });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/batchFetchHercaiAPI", async (req, res) => {
  try {
    const { comments }: any = req.body;

    if (!comments || !Array.isArray(comments)) {
      return res.status(400).json({ error: "Invalid request format" });
    }
    const stringComment = JSON.stringify(comments);
    const apiUrl = `https://hercai.onrender.com/v3/hercai?question=${stringComment} write a you tube replay comment using this text is comment message reply this message from like arrry of reply message with JSON`;
    const response = await axios.get(apiUrl);

    // Send the API response quickly
    res.json(response.data);
    // Map each comment to its corresponding API request
    // const apiRequests = comments.map((comment) => {
    //   const apiUrl = `https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(
    //     comment.text
    //   )}`;
    //   return axios.get(apiUrl);
    // });
    // const apiUrl = `https://hercai.onrender.com/v3/hercai?question=${comments}`;
    // const apiRequests: any = axios.get(apiUrl);
    // // Execute all requests concurrently
    // const responses = await Promise.all(apiRequests);

    // Extract the data from each response
    // const responseData = responses.map((response) => response.data);

    // Send the API responses
  } catch (error) {
    console.error("Error fetching Hercai API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const replicate = new Replicate({
  auth: "r8_fRZ5zjCw3REFoFSBVMbnpPcuMSVGgs03rlXSn",
  userAgent: "https://www.npmjs.com/package/create-replicate",
});

const REPLICATE_API_TOKEN = "r8_fRZ5zjCw3REFoFSBVMbnpPcuMSVGgs03rlXSn"; // Replace with your actual token
const MODEL_ENDPOINT =
  "https://api.replicate.com/v1/models/meta/llama-2-70b-chat/predictions";

// Function to make a POST request
// async function makePostRequest() {
//   try {
//     const response = await axios.post(
//       MODEL_ENDPOINT,
//       {
//         input: {
//           debug: false,
//           top_k: 50,
//           top_p: 1,
//           prompt:
//             "Can you write a poem about open source machine learning? Let's make it in the style of E. E. Cummings. in 8 words or less.",
//           temperature: 0.5,
//           system_prompt:
//             "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
//           max_new_tokens: 100,
//           min_new_tokens: -1,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Token ${REPLICATE_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("POST Request Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error making POST request:", error.message);
//   }
// }

app.get("/api/llama", async (req, res) => {
  try {
    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "replicate/vicuna-13b:6282abe6a492de4145d7bb601023762212f9ddbbe78278bd6771c8b3b2f2a13b",
      {
        input: {
          seed: -1,
          debug: false,
          top_p: 1,
          prompt:
            "Write a love poem about open source machine learning. in 8 word",
          max_length: 50,
          temperature: 0.1,
          repetition_penalty: 1,
        },
      }
    );
    console.log(output);
    res.json({ response: output });
  } catch (error) {
    console.log("Error making GET request:", error.message);
  }
});

const apiKey = "AIzaSyD4K8sR-pV-n9wmB_FieK4gGJDAq3fIqAw"; // Replace with your actual API key

app.post("/generateContent", async (req, res) => {
  try {
    if (!req.body.message) {
      throw new Error('Missing required "message" parameter');
    }

    const { message } = req.body;
    const parts = [
      {
        text: message,
      },
    ];

    const requestData = {
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
        stopSequences: [],
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const postData = JSON.stringify(requestData);

    const options = {
      hostname: "generativelanguage.googleapis.com",
      port: 443,
      path: "/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length,
      },
    };

    const request = https.request(options, (response) => {
      const chunks = [];

      response.on("data", (chunk) => {
        chunks.push(chunk);
      });

      response.on("end", () => {
        const responseData = Buffer.concat(chunks).toString();

        res.statusCode = response.statusCode;
        res.send(responseData);
      });
    });

    request.on("error", (error) => {
      console.error(error);
      res.status(500).send("Error generating content: " + error.message);
    });

    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/api/hercai", async (req, res) => {
  try {
    const { message } = req.query;
    const response = await axios.get(
      `https://hercai.onrender.com/v3/hercai?question=${message}`
    );
    res.json({ response: response.data.reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.post("/api/reply", async (req: any, res: any) => {
//   try {
//     if (!req.body.videoId) {
//       throw new Error("Missing required 'videoId' parameter");
//     }
//     const videoId = req.body.videoId;

//     var setActiveAutoComment: any = [];
//     const user = await req.user;

//     if (!user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     console.log(user);

//     // await sendComment(videoId, setActiveAutoComment);
//     res.json({ message: "Comment processing completed" });
//   } catch (error) {
//     // console.error("Error processing comment:", error);
//     res.status(500).json({ error: "Error processing comment" });
//   }
// });
// import ollama from "ollama";

app.get("/api/phi", async (req: any, res: any) => {
  try {
    const { message } = req.query;
    const response = await axios.post(`http://localhost:11434/api/chat`, {
      model: "phi",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      raw: true,
      stream: false,
    });
    console.log(response.data);
    res.json({ response: response.data.message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/llama2", async (req, res) => {
  try {
    const { message } = req.query;

    const responseData = await axios.get(
      `https://worker-calm-voice-f2f0.gokulakrishnanr812-492.workers.dev?message=${
        message || "hi"
      }`
    );

    res.json(responseData.data[0]?.response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/striker", async (req, res) => {
  try {
    const { message } = req.query;
    const response = await axios.post(
      `https://youml.com/api/v1/recipes/5817/run`,
      {
        inputs: {
          prompt: message,
        },
      },
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODM2NjQwLCJpYXQiOjE3MDkzMDA2NDAsImp0aSI6InJFemV6emZOIiwidXNlcl9pZCI6MjE1N30.hhuYpGS1OZXBT1U875K9Hwy-Ju4kLUraqCtBLYyYJ3I",
        },
      }
    );
    res.json({ response: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/democomment", async (req: any, res: any) => {
  const apiUrl = `https://autocommentapi.vercel.app/api/llama2?message=${encodeURIComponent(
    `
    
      Title:”Neela Nilave - Video Song | RDX | Kapil Kapilan | Sam CS | Shane Nigam,Antony Varghese,Neeraj Madhav”,

      Des:”Presenting the love anthem of the year - "Neela Nilave" video song from 'RDX' starring Shane Nigam, Antony Varghese, Neeraj Madhav, Mahima Nambiar in lead roles. Written and directed by Nahas Hidhayath. Music composed by Sam CS”

      Comment:”I'm from karntaka but addicted to this song”,
      `
  )}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const apiResponse = data.response.replace(/"/g, ""); // Remove double quotes
      res.json({ response: apiResponse });
    })
    .catch((error) => {
      // responseInput.textContent = "Error fetching response";
    });
});

// app.get("/")
app.get("/gpt2", async (req: any, res: any) => {
  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/grammarly/coedit-large",
      {
        // headers: {
        //   Authorization: "Bearer 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",
        // },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  const responses = [];

  // Make the API call 100 times
  for (let i = 0; i < 1; i++) {
    const data = {
      inputs: "what is googple ",
      parameters: {},
    };
    const response = await query(data);
    responses.push(response);
  }

  console.log(JSON.stringify(responses), "code");
  res.json({ responses });
});

app.get("/api/llama70B", async (req: any, res: any) => {
  const apiKey =
    "f66a83cba77ea1064cdb2036161cb141aaf7c0a6597d19a35859048eaa890e58"; // Replace with your actual API key
  const { message } = req.query;
  try {
    const url = "https://api.together.xyz/v1/chat/completions";

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    });

    const data = {
      model: "meta-llama/Llama-2-70b-chat-hf",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant and for you tube channel related chat",
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        res.json({ response: result.choices[0].message.content });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Respond with JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/llama70B", async (req: any, res: any) => {
  const apiKey =
    "f66a83cba77ea1064cdb2036161cb141aaf7c0a6597d19a35859048eaa890e58"; // Replace with your actual API key

  const { message: messageBody } = req.body;
  try {
    const url = "https://api.together.xyz/v1/chat/completions";

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    });

    const data = {
      model: "meta-llama/Llama-2-70b-chat-hf",
      max_tokens: 500,
      messages: messageBody,
    };

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        res.json({ response: result.choices[0].message.content });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Respond with JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/llama70B", async (req: any, res: any) => {
  const apiKey =
    "f66a83cba77ea1064cdb2036161cb141aaf7c0a6597d19a35859048eaa890e58"; // Replace with your actual API key
  const { message } = req.query;
  try {
    const url = "https://api.together.xyz/v1/chat/completions";

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    });

    const data = {
      model: "meta-llama/Llama-2-70b-chat-hf",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant and for you tube channel related chat",
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        res.json({ response: result.choices[0].message.content });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Respond with JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get messages for a room
app.get("/api/messages/:roomId", async (req: any, res: any) => {
  try {
    const roomId = req.params.roomId;
    const messages: any[] = await MessageModel.find({ roomId })
      .populate("userId")
      .populate("pollId")
      .populate("userId")
      .populate("emotes.user")
      .sort("timestamp");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/sub-count", async (req: any, res: any) => {
  const { channelId } = req.query;
  const response = await axios.get(
    `https://api.socialcounts.org/youtube-live-subscriber-count/${channelId}`
  );
  res.json({ subCount: response.data.est_sub });
});

app.get("/api/ai-title-generator", async (req: any, res: any) => {
  const { message, count = 5 } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: `You are an AI assistant and should make ${count} alternative you tube video title`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((title) => title.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((title, index) => ({
          index: index + 1,
          title: title.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

app.get("/api/ai-channel-name-generator", async (req: any, res: any) => {
  const { message, count = 5 } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: `You are an AI assistant and should make ${count} write a you tube channel name from this text `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((title) => title.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((title, index) => ({
          index: index + 1,
          title: title.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

app.get("/api/ai-video-idea-generator", async (req: any, res: any) => {
  const { message, count = 5 } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: `You are an AI assistant and should make ${count} Discover Your Next Viral YouTube Video Idea `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((title) => title.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((title, index) => ({
          index: index + 1,
          title: title.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

app.get("/api/ai-description-generator", async (req: any, res: any) => {
  const { message, count = 5 } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: `You are an AI assistant and should make ${count} Boost Views with AI-Crafted YouTube Video Descriptions write a you tube video Descriptions from you tube video title this text  `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((title) => title.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((title, index) => ({
          index: index + 1,
          title: title.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

app.get("/api/ai-tag-generator", async (req: any, res: any) => {
  const { message, count = 5 } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: `You are an AI assistant and should make ${count} write a tags from this text `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((title) => title.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((title, index) => ({
          index: index + 1,
          title: title.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

app.get("/api/video-content", async (req: any, res: any) => {
  const { message } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: `You are an AI assistant and should make write a video title and Description and Keywords tags and Video Script from this text`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((title) => title.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((title, index) => ({
          index: index + 1,
          title: title.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

app.get("/api/llama13", async (req: any, res: any) => {
  const { message, system } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: system || "You are an AI assistant",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((title) => title.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((title, index) => ({
          index: index + 1,
          title: title.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});
app.get("/api/analysis", async (req: any, res: any) => {
  const { message, system } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: "You are an AI assistant to text sentiment analysis",
        },
        {
          role: "user",
          content: "you are killer",
        },
      ],
    }).then((response) => {
      res.json(response); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

// app.post("/api/comment/post", async (req: any, res: any) => {
//   // Replace these values with your own
//   const API_KEY = "AIzaSyCz3EpTwEZrYOENK5flv2W6DRlKlXF5rjA";
//   const VIDEO_ID = "XZTzOOiJPic";
//   const COMMENT_TEXT = "YOUR_COMMENT_TEXT";

//   // Create the YouTube API client
//   const youtube = google.youtube({
//     version: "v3",
//     auth: API_KEY,
//   });

//   // Make the API request to post the comment
//   youtube.commentThreads.get(
//     {
//       part: "snippet",
//       requestBody: {
//         snippet: {
//           videoId: VIDEO_ID,
//           topLevelComment: {
//             snippet: {
//               textOriginal: COMMENT_TEXT,
//             },
//           },
//         },
//       },
//     },
//     (err, data) => {
//       if (err) {
//         console.log("Error posting comment:", err);
//       } else {
//         console.log("Comment posted successfully:", data.id);
//       }
//     }
//   );
// });

app.get("/api/llama13/description", async (req: any, res: any) => {
  const { message, system } = req.query;
  try {
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    run("@hf/thebloke/llama-2-13b-chat-awq", {
      messages: [
        {
          role: "system",
          content: system || "You are an AI assistant",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }).then((response) => {
      // Extract alternative title ideas from the response string
      const titlesString = response?.result?.response
        ?.split("\n")
        ?.filter((description) => description.trim() !== "");

      // Create a JSON-like structure for the titles
      const alternativeTitles = titlesString
        ?.slice(1, 6)
        .map((description, index) => ({
          index: index + 1,
          description: description.replace(/^\d+\.\s+/, ""),
        }));

      console.log(alternativeTitles);
      res.json(alternativeTitles); // Send the extracted titles as JSON
    });
  } catch {
    res.send("somethings Went Wrong !");
  }
});

app.get("/api/llama13/endpoints", async (req, res) => {
  const { message } = req.query;
  try {
    // Function to run AI model
    async function run(model, input) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
        {
          headers: {
            Authorization: "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    }

    // Splitting the message if it exceeds 6144 characters
    if (message.length > 6144) {
      const chunks = [];
      const chunkSize = 6000; // Adjust chunk size as needed

      for (let i = 0; i < message.length; i += chunkSize) {
        chunks.push(message.substring(i, i + chunkSize));
      }

      const results = await Promise.all(
        chunks.map((chunk) =>
          run("@hf/thebloke/llama-2-13b-chat-awq", {
            messages: [
              {
                role: "system",
                content:
                  "I am an AI assistant. list all endpoints and API endpoints based on the text, payloads, and any parameters. give me in JSON format and also show for post method show model with example in JSON format",
              },

              {
                role: "user",
                content: chunk,
              },
            ],
          })
        )
      );

      // Joining the results
      const combinedResult = results.reduce((acc, curr) => {
        acc.messages.push(...curr.messages);
        return acc;
      });

      res.json(combinedResult);
    } else {
      // If the message is within the character limit, send a single request
      const response = await run("@hf/thebloke/llama-2-13b-chat-awq", {
        messages: [
          {
            role: "system",
            content:
              "I am an AI assistant. list all endpoints and API endpoints based on the text, payloads, and any parameters. give me in JSON format",
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      res.json(response);
    }
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
