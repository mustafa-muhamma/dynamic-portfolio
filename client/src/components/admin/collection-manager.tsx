"use client";

import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  useCollectionList,
  useCreateItem,
  useDeleteItem,
  useUpdateItem
} from "@/hooks/use-content";
import type { CollectionDoc, ContentResource, CreateDoc, UpdateDoc } from "@/lib/content";

export type ResourceFormProps<T extends { id: string }> = {
  defaultValues?: CreateDoc<T>;
  isEdit: boolean;
  submitting: boolean;
  onSubmit: (values: CreateDoc<T>) => void;
  onCancel?: () => void;
};

type CollectionManagerProps<K extends ContentResource> = {
  resource: K;
  title: string;
  description: string;
  Form: React.ComponentType<ResourceFormProps<CollectionDoc[K]>>;
  getLabel: (row: CollectionDoc[K]) => string;
  getSubtitle?: (row: CollectionDoc[K]) => string;
  searchText?: (row: CollectionDoc[K]) => string;
  extraStatus?: (row: CollectionDoc[K]) => ReactNode;
};

export function CollectionManager<K extends ContentResource>({
  resource,
  title,
  description,
  Form,
  getLabel,
  getSubtitle,
  searchText,
  extraStatus
}: CollectionManagerProps<K>) {
  const list = useCollectionList(resource);
  const createItem = useCreateItem(resource);
  const updateItem = useUpdateItem(resource);
  const deleteItem = useDeleteItem(resource);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CollectionDoc[K] | null>(null);
  const [search, setSearch] = useState("");

  const rows = (Array.isArray(list.data) ? list.data : []).filter(
    (row) => !search || !searchText || searchText(row).toLowerCase().includes(search.toLowerCase())
  );

  const submitting = createItem.isPending || updateItem.isPending;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(row: CollectionDoc[K]) {
    setEditing(row);
    setOpen(true);
  }

  async function handleSubmit(values: CreateDoc<CollectionDoc[K]>) {
    if (editing) {
      await updateItem.mutateAsync({ id: editing.id, data: values });
    } else {
      await createItem.mutateAsync(values);
    }
    setOpen(false);
  }

  function handleDelete(row: CollectionDoc[K]) {
    if (window.confirm(`Delete "${getLabel(row)}"? This cannot be undone.`)) {
      deleteItem.mutate(row.id);
    }
  }

  function togglePublish(row: CollectionDoc[K]) {
    const published = (row as unknown as { published?: boolean }).published;
    updateItem.mutate({
      id: row.id,
      data: { published: !published } as unknown as UpdateDoc<CollectionDoc[K]>
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {searchText && (
            <div className="relative flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 sm:w-48"
              />
            </div>
          )}
          <Button onClick={openCreate}>
            <Plus />
            New {title}
          </Button>
        </div>
      </div>

      {list.isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : list.isError ? (
        <p className="text-sm text-destructive">
          Failed to load {title.toLowerCase()}. {list.error.message}
        </p>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {search ? "No matches." : `No ${title.toLowerCase()} yet. Create the first one.`}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">{getLabel(row)}</p>
                    {getSubtitle && (
                      <p className="text-sm text-muted-foreground">{getSubtitle(row)}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={row.published ? "default" : "secondary"}>
                        {row.published ? "Published" : "Draft"}
                      </Badge>
                      {extraStatus ? extraStatus(row) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" aria-label="Actions" />}
                      >
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openEdit(row)}>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePublish(row)}>
                          {row.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row)}>
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(85vh,720px)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `New ${title}`}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Form
            key={editing?.id ?? "new"}
            isEdit={!!editing}
            submitting={submitting}
            defaultValues={editing ? omitId(editing) : undefined}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function omitId<T extends { id: string }>(doc: T): CreateDoc<T> {
  const { id: _id, ...rest } = doc;
  void _id;
  return rest as CreateDoc<T>;
}
