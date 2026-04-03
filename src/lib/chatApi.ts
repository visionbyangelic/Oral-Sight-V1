export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
}

const SYSTEM_PROMPT = `You are OralSight AI, a friendly dental health assistant for Nigerian users. 

Key behaviors:
- You help users identify dental symptoms through a conversational flow
- You ask follow-up questions (max 4 total) to understand their symptoms
- After gathering enough info, provide: a risk level (Low/Moderate/Severe), a plain-English explanation, 2-3 actionable tips
- You draw on knowledge of common Nigerian dental health patterns: high sugar intake, infrequent brushing, delayed clinic visits (often 20-40 months between visits)
- You never diagnose — always recommend professional care for moderate-to-severe cases
- Keep responses short and readable (WhatsApp-style, not clinical)
- Always end assessments with: "⚠️ This is not a medical diagnosis. OralSight AI does not replace a licensed dentist."
- For severe cases, ask what city/area they're in (common cities: Lagos, Abuja, Kano, Enugu, Ibadan) to help find nearby dentists
- Format risk levels clearly: 🟢 Low Risk, 🟡 Moderate Risk, 🔴 Severe Risk
- Be warm, empathetic, and concise`;

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status}`);
    }

    const data: ChatResponse = await res.json();
    return data.reply;
  } catch (error) {
    console.error("Chat API error:", error);
    // Fallback: simulate a response for development/demo
    return generateFallbackResponse(messages);
  }
}

function generateFallbackResponse(messages: ChatMessage[]): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
  
  if (messages.length <= 1) {
    return "Thanks for reaching out! To help you better, could you tell me:\n\n**How long have you had this issue?**";
  }
  
  if (messages.length <= 3) {
    return "Got it. One more question — **does it get worse when you eat or drink something hot/cold?**";
  }

  if (messages.length <= 5) {
    return "Thank you for sharing that. Let me give you my assessment:\n\n**🟡 Moderate Risk**\n\nBased on what you've described, this could be related to **tooth sensitivity or early decay**. It's not an emergency, but it shouldn't be ignored.\n\n**What you can do:**\n1. 🪥 Brush gently twice daily with fluoride toothpaste\n2. 🚫 Avoid very hot or cold foods for now\n3. 🏥 See a dentist within the next 1–2 weeks\n\n⚠️ This is not a medical diagnosis. OralSight AI does not replace a licensed dentist.\n\nWould you like help finding a dentist near you?";
  }

  if (lastMsg.includes("lagos") || lastMsg.includes("abuja") || lastMsg.includes("kano") || lastMsg.includes("enugu") || lastMsg.includes("ibadan")) {
    const city = lastMsg.trim();
    return `Great! Here's how to find a dentist near you:\n\n👉 [Find dentists near ${city}](https://www.google.com/maps/search/dentist+near+${encodeURIComponent(city)}+Nigeria)\n\nTake care and don't delay your visit! 😊`;
  }

  return "What city or area are you in? I can help you find a dentist nearby. Common cities I can help with include Lagos, Abuja, Kano, Enugu, and Ibadan.";
}
