"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminApi, ApiError } from "@/lib/admin-api";
import { toastError } from "@/lib/toast";
import {
  COLLECTIONS,
  INQUIRIES,
  SINGLETONS,
  type CollectionDoc,
  type ContentResource,
  type CreateDoc,
  type Inquiry,
  type SingletonDoc,
  type SingletonResource,
  type UpdateDoc
} from "@/lib/content";

const queryKey = (resource: string) => [resource] as const;

function useInvalidate(resource: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKey(resource) });
}

export function useCollectionList<K extends ContentResource>(resource: K) {
  return useQuery({
    queryKey: queryKey(COLLECTIONS[resource]),
    queryFn: () => adminApi.list<CollectionDoc[K]>(COLLECTIONS[resource])
  });
}

export function useCreateItem<K extends ContentResource>(resource: K) {
  const invalidate = useInvalidate(COLLECTIONS[resource]);
  return useMutation({
    mutationFn: (data: CreateDoc<CollectionDoc[K]>) =>
      adminApi.create<CollectionDoc[K]>(COLLECTIONS[resource], data),
    onSuccess: invalidate,
    onError: (err) => toastError(err, "Failed to create")
  });
}

export function useUpdateItem<K extends ContentResource>(resource: K) {
  const invalidate = useInvalidate(COLLECTIONS[resource]);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDoc<CollectionDoc[K]> }) =>
      adminApi.update<CollectionDoc[K]>(COLLECTIONS[resource], id, data),
    onSuccess: invalidate,
    onError: (err) => toastError(err, "Failed to update")
  });
}

export function useDeleteItem(resource: ContentResource) {
  const invalidate = useInvalidate(COLLECTIONS[resource]);
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.remove<{ id: string; deleted: boolean }>(COLLECTIONS[resource], id),
    onSuccess: invalidate,
    onError: (err) => toastError(err, "Failed to delete")
  });
}

export function useSingleton<K extends SingletonResource>(resource: K) {
  return useQuery({
    queryKey: queryKey(SINGLETONS[resource]),
    queryFn: async () => {
      try {
        return await adminApi.get<SingletonDoc[K]>(SINGLETONS[resource]);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
      }
    },
    retry: false
  });
}

export function useUpsertSingleton<K extends SingletonResource>(resource: K) {
  const invalidate = useInvalidate(SINGLETONS[resource]);
  return useMutation({
    mutationFn: (data: CreateDoc<SingletonDoc[K]>) =>
      adminApi.upsert<SingletonDoc[K]>(SINGLETONS[resource], data),
    onSuccess: invalidate,
    onError: (err) => toastError(err, "Failed to save")
  });
}

export function useInquiries() {
  return useQuery({
    queryKey: queryKey(INQUIRIES),
    queryFn: () => adminApi.list<Inquiry>(INQUIRIES)
  });
}

export function useMarkInquiryRead() {
  const invalidate = useInvalidate(INQUIRIES);
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      adminApi.update<Inquiry>(INQUIRIES, id, { read }),
    onSuccess: invalidate,
    onError: (err) => toastError(err, "Failed to update inquiry")
  });
}

export function useDeleteInquiry() {
  const invalidate = useInvalidate(INQUIRIES);
  return useMutation({
    mutationFn: (id: string) => adminApi.remove<{ id: string; deleted: boolean }>(INQUIRIES, id),
    onSuccess: invalidate,
    onError: (err) => toastError(err, "Failed to delete inquiry")
  });
}
