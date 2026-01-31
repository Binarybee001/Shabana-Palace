import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AdminMessage } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  reply: z.string().trim().min(2, "Reply is required").max(1200, "Max 1200 characters"),
});

type FormValues = z.infer<typeof schema>;

export function MessageReplyDialog({
  message,
  onSave,
}: {
  message: AdminMessage;
  onSave: (reply: string) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reply: "" },
    mode: "onChange",
  });

  const submit = ({ reply }: FormValues) => {
    onSave(reply);
    const subject = `Reply from Shabana Palace`;
    const body = `Hi ${message.name},\n\n${reply}\n\nRegards,\nShabana Palace`;
    const mailto = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    toast.success("Opening your email app to send the reply");
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Reply</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Reply to {message.name}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <Label htmlFor={`reply-${message.id}`}>Message</Label>
            <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
              {message.message}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`reply-${message.id}`}>Your Reply</Label>
            <Textarea
              id={`reply-${message.id}`}
              placeholder="Type your response…"
              className="rounded-xl min-h-[140px]"
              {...form.register("reply")}
            />
            {form.formState.errors.reply?.message && (
              <p className="text-sm text-destructive">{form.formState.errors.reply.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="rounded-xl" disabled={!form.formState.isValid}>
              Send via Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
