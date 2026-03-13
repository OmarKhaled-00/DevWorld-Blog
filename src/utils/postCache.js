export const updateLikeCache = (queryClient, postId) => {
  queryClient.setQueryData(["posts"], (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      posts: oldData.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes_count: p.liked_by_user
                ? Number(p.likes_count) - 1
                : Number(p.likes_count) + 1,
              liked_by_user: !p.liked_by_user,
            }
          : p,
      ),
    };
  });
};

export const updateTrendCache = (queryClient, postId) => {
  queryClient.setQueryData(["posts"], (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      posts: oldData.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              trend_count: !p.trended_by_user
                ? Number(p.trend_count) + 1
                : Number(p.trend_count) - 1,
              trended_by_user: !p.trended_by_user,
            }
          : p,
      ),
    };
  });
};

export const updateRepostCache = (queryClient, postId) => {
  queryClient.setQueryData(["posts"], (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      posts: oldData.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              repost_count: p.reposted_by_user
                ? Number(p.repost_count) - 1
                : Number(p.repost_count) + 1,
              reposted_by_user: !p.reposted_by_user,
            }
          : p,
      ),
    };
  });
};

export const updateSaveCache = (queryClient, postId) => {
  queryClient.setQueryData(["posts"], (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      posts: oldData.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              saved_by_user: !p.saved_by_user,
            }
          : p,
      ),
    };
  });
};

export const updateFollowCache = (queryClient, user_Id) => {
  queryClient.setQueryData(["posts"], (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      posts: oldData.posts.map((p) =>
        p.author.id === user_Id
          ? {
              ...p,
              followed_by_user: !p.followed_by_user, // toggle follow
            }
          : p,
      ),
    };
  });
};
