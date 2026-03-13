import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateLikes,
  CreateTrend,
  CreateRepost,
  SavePost,
  ToggleFollow,
} from "../services/postApi.services";
import { useAuth } from "./useAuth";
import {
  updateLikeCache,
  updateRepostCache,
  updateSaveCache,
  updateTrendCache,
  updateFollowCache,
} from "../utils/postCache";

export function usePostActions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: ({ postId }) => CreateLikes(postId, user.id),

    // 🔥 Optimistic Update
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData(["posts"]);

      updateLikeCache(queryClient, postId);

      return { previousData };
    },

    onSuccess: (response) => {
      console.log("Response from CreateLikes:", response);
    },

    onError: (err, variables, context) => {
      // rollback if error
      queryClient.setQueryData(["posts"], context.previousData);
      console.log("Error in create likes: ", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // ✅ Trend Mutation
  const trendMutation = useMutation({
    mutationFn: ({ postId }) => CreateTrend(postId, user.id),

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData(["posts"]);

      updateTrendCache(queryClient, postId);

      return { previousData };
    },

    onSuccess: (response) => {
      console.log("Response from CreateTrend:", response);
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["posts"], context.previousData);
      }
      console.log("Error in create trend: ", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const repostMutation = useMutation({
    mutationFn: ({ postId }) => CreateRepost(postId, user.id),

    // 🔥 Optimistic Update
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData(["posts"]);

      updateRepostCache(queryClient, postId);

      return { previousData };
    },

    onSuccess: (response) => {
      console.log("Response from CreateRepost:", response);
    },

    onError: (err, variables, context) => {
      // rollback if error
      queryClient.setQueryData(["posts"], context.previousData);
      console.log("Error in create Repost: ", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const savedMutation = useMutation({
    mutationFn: ({ postId }) => SavePost(postId, user.id),

    // 🔥 Optimistic Update
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData(["posts"]);

      updateSaveCache(queryClient, postId);

      return { previousData };
    },

    onSuccess: (response) => {
      console.log("Response from SavePost:", response);
    },

    onError: (err, variables, context) => {
      // rollback if error
      queryClient.setQueryData(["posts"], context.previousData);
      console.log("Error in Save Post: ", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const followMutation = useMutation({
    mutationFn: ({ user_Id, isFollowing }) =>
      ToggleFollow(user_Id, isFollowing),

    // Optimistic update
    onMutate: async ({ user_Id }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData(["posts"]);

      // Optimistically toggle follow state in cache

      updateFollowCache(queryClient, user_Id);
      return { previousData };
    },

    onError: (err, variables, context) => {
      // rollback if error
      if (context?.previousData) {
        queryClient.setQueryData(["posts"], context.previousData);
      }
      console.log("Error following/unfollowing: ", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    likePost: (postId) => likeMutation.mutate({ postId }),
    likePending: likeMutation.isPending,
    trendPost: (postId) => trendMutation.mutate({ postId }),
    trendPending: trendMutation.isPending,
    repostPost: (postId) => repostMutation.mutate({ postId }),
    repostPending: repostMutation.isPending,
    savePost: (postId) => savedMutation.mutate({ postId }),
    savePending: savedMutation.isPending,
    followProcess: (user_Id, isFollowing) =>
      followMutation.mutate({ user_Id, isFollowing }),
  };
}
