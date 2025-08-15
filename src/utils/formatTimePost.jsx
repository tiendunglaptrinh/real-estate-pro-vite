const formatTimePost = (post) => {
    const date_post = new Date(post.createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date_post) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} giây trước`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    } else {
        return `${diffInDays} ngày trước`;
    }
};
export default formatTimePost;
