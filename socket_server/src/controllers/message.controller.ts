import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { getUserDetails, removeUserDetails, isUserExist } from "../cache/userDetails.js";
import { io } from "../socket/socket.js";

interface MessageRequest {
    roomId: string;
    senderId: string;
    message: string;
}

const sendMessageController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { roomId, senderId, message }: MessageRequest = req.body;

    if (!senderId || !message) {
        throw new ApiError(400, "senderId and message are required");
    }

    io.to(senderId).emit("new_message", { roomId, senderId, message });
    console.log(`Emitted new_message to senderId: ${senderId} in roomId: ${roomId}`);

    res.status(200).json(new ApiResponse(200, null, "Message sent successfully"));
});


export {
    sendMessageController
}