"use client";

import { Clock, Mail, MailOpen, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteInquiry, useInquiries, useMarkInquiryRead } from "@/hooks/use-content";
import type { Inquiry } from "@/lib/content";

function formatDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function InquiryCard({
  inquiry,
  onToggleRead,
  onDelete,
  busy
}: {
  inquiry: Inquiry;
  onToggleRead: (inquiry: Inquiry) => void;
  onDelete: (inquiry: Inquiry) => void;
  busy: boolean;
}) {
  return (
    <Card className={inquiry.read ? undefined : "border-primary/40"}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium">{inquiry.name}</p>
            <p className="text-sm text-muted-foreground">
              <a href={`mailto:${inquiry.email}`} className="hover:text-foreground">
                {inquiry.email}
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {formatDate(inquiry.createdAt) && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {formatDate(inquiry.createdAt)}
              </span>
            )}
            <Badge variant={inquiry.read ? "secondary" : "default"}>
              {inquiry.read ? "Read" : "Unread"}
            </Badge>
          </div>
        </div>
        <p className="text-sm whitespace-pre-line text-muted-foreground">{inquiry.message}</p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => onToggleRead(inquiry)}
          >
            {inquiry.read ? <Mail /> : <MailOpen />}
            {inquiry.read ? "Mark as unread" : "Mark as read"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={busy}
            onClick={() => onDelete(inquiry)}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InquiriesPage() {
  const list = useInquiries();
  const markRead = useMarkInquiryRead();
  const deleteInquiry = useDeleteInquiry();

  const busy = markRead.isPending || deleteInquiry.isPending;
  const inquiries = list.data ?? [];
  const unreadCount = inquiries.filter((i) => !i.read).length;

  function toggleRead(inquiry: Inquiry) {
    markRead.mutate({ id: inquiry.id, read: !inquiry.read });
  }

  function handleDelete(inquiry: Inquiry) {
    if (window.confirm(`Delete inquiry from ${inquiry.name}? This cannot be undone.`)) {
      deleteInquiry.mutate(inquiry.id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Messages submitted through the public contact form.
          </p>
        </div>
        {!list.isPending && !list.isError && (
          <Badge variant="secondary">
            {unreadCount} unread / {inquiries.length} total
          </Badge>
        )}
      </div>

      {list.isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : list.isError ? (
        <p className="text-sm text-destructive">Failed to load inquiries. {list.error.message}</p>
      ) : inquiries.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No inquiries yet. Messages from the public contact form will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onToggleRead={toggleRead}
              onDelete={handleDelete}
              busy={busy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
