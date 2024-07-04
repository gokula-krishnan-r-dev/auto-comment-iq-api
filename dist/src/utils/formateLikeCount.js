"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLikeCount = void 0;
function formatLikeCount(likeCount) {
    if (likeCount < 1000) {
        return likeCount.toString();
    }
    else if (likeCount < 1000000) {
        return Math.floor(likeCount / 1000) + "K";
    }
    else {
        return Math.floor(likeCount / 1000000) + "M";
    }
}
exports.formatLikeCount = formatLikeCount;
//# sourceMappingURL=formateLikeCount.js.map