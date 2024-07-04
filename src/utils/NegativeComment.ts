// utils/NegativeComment.ts

import { apiKey } from "../config/dev";

export const getComments = async (videoId: string, nextPageToken: string) => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&part=replies&videoId=${videoId}&key=${apiKey}&maxResults=5000&${
        nextPageToken ? `pageToken=${nextPageToken}` : ""
      }`
    );
    const data: any = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return error;
  }
};

export const analyzeSentiment = async (text: string): Promise<any> => {
  try {
    const response = await fetch(`http://0.0.0.0:8000/sentiment?text=${text}`);

    if (!response.ok) {
      return response.json().then((error) => {
        throw new Error(error.error);
      });
    }
    return await response.json().then((data) => {
      return data;
    });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw error;
  }
};
