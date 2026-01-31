import { useState, useEffect } from "react";
import { Mail, MessageSquare, User, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  replies: Array<{ body: string; created_at: string }>;
  created_at: string;
}

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load messages");
      console.error(error);
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReplyClick = (message: Message) => {
    setSelectedMessage(message);
    setReplyText("");
    setReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setIsSending(true);

    try {
      // Update message with new reply
      const newReply = {
        body: replyText,
        created_at: new Date().toISOString(),
      };

      const updatedReplies = [newReply, ...(selectedMessage.replies || [])];

      const { error } = await supabase
        .from('messages')
        .update({ replies: updatedReplies })
        .eq('id', selectedMessage.id);

      if (error) throw error;

      // Create email with proper from/to addresses
      const fromEmail = "shabana26@gmail.com";
      const toEmail = selectedMessage.email;
      const subject = `Reply from Shabana Palace`;
      const body = `Hi ${selectedMessage.name},

${replyText}

Best regards,
Shabana Palace
Email: shabana26@gmail.com
Phone: 0742864164
WhatsApp: 0742864164
Location: Kenyatta Avenue, near Shawmut Plaza, Nakuru, Kenya`;

      // Open email client with Gmail composition if using Gmail
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Fallback to mailto for other email clients
      const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Try Gmail first, fallback to mailto
      const emailWindow = window.open(gmailUrl, "_blank");
      
      // If Gmail doesn't open (popup blocked), use mailto
      setTimeout(() => {
        if (!emailWindow || emailWindow.closed) {
          window.location.href = mailtoUrl;
        }
      }, 1000);

      toast.success("Reply saved! Opening your email client...");
      setReplyDialogOpen(false);
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error("Error saving reply:", error);
      toast.error("Failed to save reply");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Inbox</h1>
        <p className="text-muted-foreground">Messages from visitors</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.length === 0 ? (
          <Card className="rounded-2xl shadow-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No messages yet</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((m) => (
            <Card key={m.id} className="rounded-2xl shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    {m.name}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {m.email}
                  </span>
                </CardTitle>
                {m.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {m.phone}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-foreground">{m.message}</p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                    {m.replies?.length > 0 ? ` • ${m.replies.length} repl${m.replies.length === 1 ? "y" : "ies"}` : ""}
                  </p>
                  <Button 
                    className="rounded-xl" 
                    onClick={() => handleReplyClick(m)}
                  >
                    Reply
                  </Button>
                </div>

                {m.replies?.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Latest reply</p>
                    <div className="rounded-xl bg-muted p-3 text-sm">
                      {m.replies[0].body}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Reply from: shabana26@gmail.com → {selectedMessage?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Original Message</Label>
              <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
                {selectedMessage?.message}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="replyText">Your Reply</Label>
              <Textarea
                id="replyText"
                placeholder="Type your response..."
                className="rounded-xl min-h-[140px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setReplyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-xl" 
              onClick={handleSendReply}
              disabled={isSending || !replyText.trim()}
            >
              {isSending ? "Sending..." : "Send via Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}