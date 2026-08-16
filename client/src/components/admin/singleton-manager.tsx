"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { useSingleton, useUpsertSingleton } from "@/hooks/use-content";
import {
  SINGLETONS,
  type CreateDoc,
  type SingletonDoc,
  type SingletonResource
} from "@/lib/content";
import type { ResourceFormProps } from "@/components/admin/collection-manager";
import { mediaDiffRemoved } from "@/lib/images";
import { deleteMedia } from "@/lib/media";

type SingletonManagerProps<K extends SingletonResource> = {
  resource: K;
  title: string;
  description: string;
  Form: React.ComponentType<ResourceFormProps<SingletonDoc[K]>>;
  getImages?: (doc: SingletonDoc[K]) => string[];
};

export function SingletonManager<K extends SingletonResource>({
  resource,
  title,
  description,
  Form,
  getImages
}: SingletonManagerProps<K>) {
  const singleton = useSingleton(resource);
  const upsert = useUpsertSingleton(resource);
  const queryClient = useQueryClient();
  const [savedAt, setSavedAt] = useState(0);

  if (singleton.isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-lg" />
      </div>
    );
  }

  if (singleton.isError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load {title.toLowerCase()}. {singleton.error.message}
      </p>
    );
  }

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Form
        key={`${resource}-${savedAt}`}
        isEdit={!!singleton.data}
        submitting={upsert.isPending}
        defaultValues={singleton.data ? omitId(singleton.data) : undefined}
        onSubmit={(values) => {
          const previous = singleton.data ? (getImages?.(singleton.data) ?? []) : [];
          upsert.mutate(values, {
            onSuccess: async () => {
              await queryClient.refetchQueries({ queryKey: [SINGLETONS[resource]] });
              setSavedAt((n) => n + 1);
              toast.success(`${title} saved`);
              const next = getImages ? (getImages(values as unknown as SingletonDoc[K]) ?? []) : [];
              const removed = mediaDiffRemoved(previous, next);
              if (removed.length > 0) void deleteMedia(removed);
            }
          });
        }}
      />
    </div>
  );
}

function omitId<T extends { id: string }>(doc: T): CreateDoc<T> {
  const { id: _id, ...rest } = doc;
  void _id;
  return rest as CreateDoc<T>;
}
