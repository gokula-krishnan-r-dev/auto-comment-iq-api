export function formatLikeCount(likeCount: number): string {
  if (likeCount < 1000) {
    return likeCount.toString();
  } else if (likeCount < 1000000) {
    return Math.floor(likeCount / 1000) + "K";
  } else {
    return Math.floor(likeCount / 1000000) + "M";
  }
}
