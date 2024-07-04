"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// import express, { Request, Response } from "express";
const express = require("express");
const route_1 = __importDefault(require("./routes/route"));
const mongoose_1 = __importDefault(require("mongoose"));
const https = require("https");
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("./routes/authRouter/authRouter"));
const fs = require("fs");
const path = require("path");
const axios_1 = __importDefault(require("axios"));
const replicate_1 = __importDefault(require("replicate"));
const verifyToken_1 = require("./utils/verifyToken");
const replyComment_1 = __importDefault(require("./websocket/replyComment"));
const RoomChat_1 = __importDefault(require("./websocket/RoomChat"));
const Message_1 = __importDefault(require("./websocket/models/Message"));
const cookieParser = require("cookie-parser");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const app = express();
const port = 3000;
// const connectToMongoDB = require("./services/db/Mongodb"); // Import the module
const MONGODB_URI =
  "mongodb+srv://gokul:UPw3fCb6kDmF5CsE@cluster0.klfb9oe.mongodb.net/?retryWrites=true&w=majority";
mongoose_1.default.connect(MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});
const { Hercai } = require("hercai");
const herc = new Hercai(); //new Hercai("your api key"); => Optional
/* Available Models */
/* "v3-beta" , "gemini" */
/* Default Model; "v3-beta" */
const connectToMongoDB = mongoose_1.default.connection;
connectToMongoDB.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
connectToMongoDB.once("open", () => {
  console.log("Connected to MongoDB");
});
require("./services/passport/passport");
app.use((0, cors_1.default)());
app.use(verifyToken_1.authenticateUser);
(0, replyComment_1.default)();
// chat();
(0, RoomChat_1.default)();
// app.use(server);
app.use(
  (0, express_session_1.default)({
    secret: "waytobigsecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
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
app.use("/v1", route_1.default);
app.use("/auth", authRouter_1.default);
const openai = require("openai");
openai.apiKey = "AIzaSyDAIbJTbNIebqH1aw78RK19q13btquteWM";
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyD4K8sR-pV-n9wmB_FieK4gGJDAq3fIqAw";
function run() {
  return __awaiter(this, void 0, void 0, function* () {});
}
app.get("/api/gemini", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
    const response = result.response;
    // console.log(response.text());
    res.json({ response: response.text() });
  })
);
const genAI = new GoogleGenerativeAI(API_KEY);
app.get("/generateContent", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
      const { input } = req.query;
      if (!input) {
        return res
          .status(400)
          .json({ error: 'Input parameter "input" is required.' });
      }
      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = yield model.generateContentStream([input]);
      const generatedContent = [];
      try {
        for (
          var _d = true, _e = __asyncValues(result.stream), _f;
          (_f = yield _e.next()), (_a = _f.done), !_a;
          _d = true
        ) {
          _c = _f.value;
          _d = false;
          const chunk = _c;
          const chunkText = chunk.text();
          generatedContent.push(chunkText);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      res.json({ generatedContent });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
app.post("/batchFetchHercaiAPI", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { comments } = req.body;
      if (!comments || !Array.isArray(comments)) {
        return res.status(400).json({ error: "Invalid request format" });
      }
      const stringComment = JSON.stringify(comments);
      const apiUrl = `https://hercai.onrender.com/v3/hercai?question=${stringComment} write a you tube replay comment using this text is comment message reply this message from like arrry of reply message with JSON`;
      const response = yield axios_1.default.get(apiUrl);
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
  })
);
const replicate = new replicate_1.default({
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
app.get("/api/llama", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const replicate = new replicate_1.default({
        auth: REPLICATE_API_TOKEN,
      });
      const output = yield replicate.run(
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
  })
);
const apiKey = "AIzaSyD4K8sR-pV-n9wmB_FieK4gGJDAq3fIqAw"; // Replace with your actual API key
app.post("/generateContent", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
  })
);
app.get("/api/hercai", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { message } = req.query;
      const response = yield axios_1.default.get(
        `https://hercai.onrender.com/v3/hercai?question=${message}`
      );
      res.json({ response: response.data.reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
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
app.get("/api/phi", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { message } = req.query;
      const response = yield axios_1.default.post(
        `http://localhost:11434/api/chat`,
        {
          model: "phi",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          raw: true,
          stream: false,
        }
      );
      console.log(response.data);
      res.json({ response: response.data.message.content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
app.get("/api/llama2", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
      const { message } = req.query;
      const responseData = yield axios_1.default.get(
        `https://worker-calm-voice-f2f0.gokulakrishnanr812-492.workers.dev?message=${
          message || "hi"
        }`
      );
      res.json(
        (_g = responseData.data[0]) === null || _g === void 0
          ? void 0
          : _g.response
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
app.get("/api/striker", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { message } = req.query;
      const response = yield axios_1.default.post(
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
  })
);
app.get("/api/democomment", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl = `https://autocommentapi.vercel.app/api/llama2?message=${encodeURIComponent(`
    
      Title:”Neela Nilave - Video Song | RDX | Kapil Kapilan | Sam CS | Shane Nigam,Antony Varghese,Neeraj Madhav”,

      Des:”Presenting the love anthem of the year - "Neela Nilave" video song from 'RDX' starring Shane Nigam, Antony Varghese, Neeraj Madhav, Mahima Nambiar in lead roles. Written and directed by Nahas Hidhayath. Music composed by Sam CS”

      Comment:”I'm from karntaka but addicted to this song”,
      `)}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const apiResponse = data.response.replace(/"/g, ""); // Remove double quotes
        res.json({ response: apiResponse });
      })
      .catch((error) => {
        // responseInput.textContent = "Error fetching response";
      });
  })
);
// app.get("/")
app.get("/gpt2", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    function query(data) {
      return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(
          "https://api-inference.huggingface.co/models/grammarly/coedit-large",
          {
            // headers: {
            //   Authorization: "Bearer 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",
            // },
            method: "POST",
            body: JSON.stringify(data),
          }
        );
        const result = yield response.json();
        return result;
      });
    }
    const responses = [];
    // Make the API call 100 times
    for (let i = 0; i < 1; i++) {
      const data = {
        inputs: "what is googple ",
        parameters: {},
      };
      const response = yield query(data);
      responses.push(response);
    }
    console.log(JSON.stringify(responses), "code");
    res.json({ responses });
  })
);
app.get("/api/llama70B", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
  })
);
app.post("/api/llama70B", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
  })
);
app.get("/api/llama70B", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
  })
);
// API endpoint to get messages for a room
app.get("/api/messages/:roomId", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const roomId = req.params.roomId;
      const messages = yield Message_1.default
        .find({ roomId })
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
  })
);
app.get("/sub-count", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.query;
    const response = yield axios_1.default.get(
      `https://api.socialcounts.org/youtube-live-subscriber-count/${channelId}`
    );
    res.json({ subCount: response.data.est_sub });
  })
);
app.get("/api/ai-title-generator", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, count = 5 } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((title) => title.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((title, index) => ({
                index: index + 1,
                title: title.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_h) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/ai-channel-name-generator", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, count = 5 } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((title) => title.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((title, index) => ({
                index: index + 1,
                title: title.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_j) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/ai-video-idea-generator", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, count = 5 } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((title) => title.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((title, index) => ({
                index: index + 1,
                title: title.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_k) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/ai-description-generator", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, count = 5 } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((title) => title.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((title, index) => ({
                index: index + 1,
                title: title.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_l) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/ai-tag-generator", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, count = 5 } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((title) => title.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((title, index) => ({
                index: index + 1,
                title: title.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_m) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/video-content", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((title) => title.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((title, index) => ({
                index: index + 1,
                title: title.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_o) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/llama13", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, system } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((title) => title.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((title, index) => ({
                index: index + 1,
                title: title.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_p) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/analysis", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, system } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
    } catch (_q) {
      res.send("somethings Went Wrong !");
    }
  })
);
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
app.get("/api/llama13/description", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message, system } = req.query;
    try {
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
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
        var _a, _b, _c;
        // Extract alternative title ideas from the response string
        const titlesString =
          (_c =
            (_b =
              (_a =
                response === null || response === void 0
                  ? void 0
                  : response.result) === null || _a === void 0
                ? void 0
                : _a.response) === null || _b === void 0
              ? void 0
              : _b.split("\n")) === null || _c === void 0
            ? void 0
            : _c.filter((description) => description.trim() !== "");
        // Create a JSON-like structure for the titles
        const alternativeTitles =
          titlesString === null || titlesString === void 0
            ? void 0
            : titlesString.slice(1, 6).map((description, index) => ({
                index: index + 1,
                description: description.replace(/^\d+\.\s+/, ""),
              }));
        console.log(alternativeTitles);
        res.json(alternativeTitles); // Send the extracted titles as JSON
      });
    } catch (_r) {
      res.send("somethings Went Wrong !");
    }
  })
);
app.get("/api/llama13/endpoints", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.query;
    try {
      // Function to run AI model
      function run(model, input) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = yield fetch(
            `https://api.cloudflare.com/client/v4/accounts/4927f1a99d25e859fc8b52d162887976/ai/run/${model}`,
            {
              headers: {
                Authorization:
                  "Bearer ODzs5VpOZ_AiqUUonA8O4dIbNVRoSgBp0ERfBYzn",
              },
              method: "POST",
              body: JSON.stringify(input),
            }
          );
          const result = yield response.json();
          return result;
        });
      }
      // Splitting the message if it exceeds 6144 characters
      if (message.length > 6144) {
        const chunks = [];
        const chunkSize = 6000; // Adjust chunk size as needed
        for (let i = 0; i < message.length; i += chunkSize) {
          chunks.push(message.substring(i, i + chunkSize));
        }
        const results = yield Promise.all(
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
        const response = yield run("@hf/thebloke/llama-2-13b-chat-awq", {
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
  })
);
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
