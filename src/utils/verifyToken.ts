import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/dev";
import userModel from "../models/user.model";
export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded; // Set the decoded user information on the request object
    next();
  });
};
const authenticateToken = async (token: string | undefined) => {
  try {
    console.log(token);

    // Replace this with your actual asynchronous authentication logic
    const user: any = await userModel.findOne({ token: token });

    if (!user) {
      // console.error("User not found");
      return null;
    }

    // Assuming 'token' is a property on the user object
    const storedToken = user.token;

    if (token === storedToken) {
      return user;
    }

    return null;
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
};
export const authenticateUser = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.header("Authorization");
  console.log(req.path);

  const user = authenticateToken(authToken);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // Attach user information to the request for later use
  req.user = user;
  next();
};
