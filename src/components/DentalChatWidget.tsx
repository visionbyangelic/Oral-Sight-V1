import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage, type ChatMessage } from "@/lib/chatApi";
import ReactMarkdown from "react-markdown";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  quickReplies?: string[];
}

const GREETING: DisplayMessage = {
  id: "greeting",
  role: "assistant",
  content: "Hi there! 👋 I'm **OralSight AI**, your dental health assistant. Tell me what's bothering you and I'll help you figure out what to do next.",
  quickReplies: [
    "I have tooth pain",
    "My gums are bleeding",
    "I have swelling",
    "Something else",
  ],
};

const FOLLOW_UP_CHIPS: Record<string, string[]> = {
  "I have tooth pain": ["Less than a week", "More than a week", "Comes and goes"],
  "My gums are bleeding": ["When I brush", "Randomly", "After eating"],
  "I have swelling": ["In my jaw", "On my gums", "Near a tooth"],
};

const DentalChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: DisplayMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const history: ChatMessage[] = updatedMessages
        .filter((m) => m.id !== "greeting" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await sendChatMessage(history);

      // Determine quick replies based on conversation stage
      let quickReplies: string[] | undefined;
      if (updatedMessages.length === 2) {
        quickReplies = FOLLOW_UP_CHIPS[text] || undefined;
      }
      if (reply.toLowerCase().includes("what city") || reply.toLowerCase().includes("what area")) {
        quickReplies = ["Lagos", "Abuja", "Kano", "Enugu", "Ibadan"];
      }
      if (reply.toLowerCase().includes("find dentist") || reply.toLowerCase().includes("find a dentist")) {
        quickReplies = ["Yes, find a dentist", "No, thanks"];
      }

      const botMsg: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        quickReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (content: string) => {
    if (content.includes("🟢") || content.toLowerCase().includes("low risk")) {
      return <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">🟢 Low Risk</Badge>;
    }
    if (content.includes("🟡") || content.toLowerCase().includes("moderate risk")) {
      return <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">🟡 Moderate Risk</Badge>;
    }
    if (content.includes("🔴") || content.toLowerCase().includes("severe risk")) {
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">🔴 Severe Risk</Badge>;
    }
    return null;
  };

  const handleReset = () => {
    setMessages([GREETING]);
    setInput("");
  };

  return (
    <>
      {/* Floating Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Open dental health chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">OralSight AI</p>
                  <p className="text-xs text-muted-foreground">Dental Health Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
                >
                  New chat
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] space-y-2`}>
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {getRiskBadge(msg.content) && (
                        <div className="mb-2">{getRiskBadge(msg.content)}</div>
                      )}
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_ol]:my-1 [&_ul]:my-1 [&_li]:my-0">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {/* Quick Reply Chips */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quickReplies.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleSend(chip)}
                            disabled={isLoading}
                            className="text-xs px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your symptoms..."
                  disabled={isLoading}
                  className="flex-1 h-9 rounded-full bg-muted border-none px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Not a medical diagnosis • See a dentist for proper care
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DentalChatWidget;
