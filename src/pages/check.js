   async function fetchComments(videoId) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10&key=AIzaSyB8RcykCgS5K8xAoDeFJ_2gAwFmxlvMoYc`
  );
  const data = await response.json();
  console.log(data.items,"comment");
  return data.items
}

const loadCommentData = async () => {
    const commentData = await fetchComments(videoId);
    setComments(commentData);
  };