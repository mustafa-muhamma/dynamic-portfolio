"use client";

import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { useSingleton, useUpsertSingleton } from "@/hooks/use-content";
import type { CreateDoc, SingletonDoc, SingletonResource } from "@/lib/content";
import type { ResourceFormProps } from "@/components/admin/collection-manager";

type SingletonManagerProps<K extends SingletonResource> = {
  resource: K;
  title: string;
  description: string;
  Form: React.ComponentType<ResourceFormProps<SingletonDoc[K]>>;
};

export function SingletonManager<K extends SingletonResource>({
  resource,
  title,
  description,
  Form
}: SingletonManagerProps<K>) {
  const singleton = useSingleton(resource);
  const upsert = useUpsertSingleton(resource);

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
        isEdit={!!singleton.data}
        submitting={upsert.isPending}
        defaultValues={singleton.data ? omitId(singleton.data) : undefined}
        onSubmit={(values) =>
          upsert.mutate(values, { onSuccess: () => toast.success(`${title} saved`) })
        }
      />
    </div>
  );
}

function omitId<T extends { id: string }>(doc: T): CreateDoc<T> {
  const { id: _id, ...rest } = doc;
  void _id;
  return rest as CreateDoc<T>;
}
