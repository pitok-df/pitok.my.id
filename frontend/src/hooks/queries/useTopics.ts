"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const topicKeys = { all: ["topics"] as const, list: () => [...topicKeys.all, "list"] as const };
export function useTopics() { return useQuery({ queryKey: topicKeys.list(), queryFn: () => api.topics.list() }); }
export function useCreateTopic() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: { title: string; description: string; creator: string }) => api.topics.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: topicKeys.all }) });
}
export function useReplyTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, ...payload }: { topicId: string; name: string; message: string; replyTo?: string | null }) => api.topics.reply(topicId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: topicKeys.all }),
  });
}
