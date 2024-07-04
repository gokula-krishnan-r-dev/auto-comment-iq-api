import http from "http";
import WebSocket from "ws";
import { sendComment } from "../utils/DashboardU";
import axios from "axios";
const createWebSocketServer = (): any => {
  const server = http.createServer();
  const wss: any = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");

    ws.on("message", async (message: string) => {
      // ws.send(`Server received your message: ${message}`);

      const messageString = Buffer.from(message).toString("utf-8");

      // if (messageString === "hi") {
      const setActiveAutoComment: any = [];
      sendComment(messageString, setActiveAutoComment, ws);
      // }
      if (messageString?.includes("like")) {
      }

      if (messageString?.includes("subCount")) {
        const parts = messageString.split(":");

        // Take the second part (index 1) of the resulting array
        const id = parts[1];
        console.log(id.replace(/"/g, ""), "id");
        console.log(
          parts.map((part) => part.replace(/"/g, "")),
          "parts"
        );
        let prevData = [];
        setInterval(() => {
          const res = axios.get(
            `https://mixerno.space/api/youtube-channel-counter/user/${id.replace(
              /"/g,
              ""
            )}`
          );

          res
            .then((response) => {
              if (response.data !== null) {
                // If response.data is not null, update prevData and send the response
                prevData = response.data;
                ws.send(JSON.stringify(response.data));
              } else {
                // If response.data is null, send the previous value
                ws.send(JSON.stringify(prevData));
              }
            })
            .catch((error) => {
              // Handle error if the request fails
              console.error("Error fetching data:", error);
            });
        }, 1000);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  server.listen(3002, () => {
    console.log(`WebSocket server is running on port 3002`);
  });

  return server;
};
export default createWebSocketServer;
