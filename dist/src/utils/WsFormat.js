"use strict";
// // Define an interface for the comment status object
// interface CommentStatus {
//   type: string;
//   commentId?: string;
//   status?: string;
//   pendingCount?: number;
//   processingTime?: number;
//   totalLoadingTime?: number;
//   successCount?: number;
//   errorCount?: number;
//   videoId?: string;
//   commentID?: string;
//   perCommnetTime?: number;
//   commentCount?: number;
//   totalCommentCount?: number;
//   completedComment?: any;
//   pendingComment?: any;
//   failedComment?: any;
//   videoDetailsArray?: any;
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentStatus = void 0;
/**
 * Creates a dynamic comment status object based on the provided parameters.
 *
 * @param {Partial<CommentStatus>} [params] - The parameters for the comment status object.
 * @returns {CommentStatus} - The comment status object.
 */
const createCommentStatus = (params = {}) => ({
    type: params.type || "commentStatus",
    pendingCount: params.pendingCount || 0,
    commentId: params.commentId || "",
    status: params.status || [],
    processingTime: params.processingTime || 0,
    totalLoadingTime: params.totalLoadingTime || 0,
    successCount: params.successCount || 0,
    errorCount: params.errorCount || 0,
    videoId: params.videoId || "",
    perCommnetTime: params.perCommnetTime || 0,
    commentCount: params.commentCount || 0,
    totalCommentCount: params.totalCommentCount || 0,
    completedComment: params.completedComment || null,
    pendingComment: params.pendingComment || null,
    failedComment: params.failedComment || null,
    videoDetailsArray: params.videoDetailsArray || null,
    commentArray: params.commentArray || null,
    toastMessage: params.toastMessage || "",
    replyComment: params.replyComment || null,
});
exports.createCommentStatus = createCommentStatus;
//# sourceMappingURL=WsFormat.js.map