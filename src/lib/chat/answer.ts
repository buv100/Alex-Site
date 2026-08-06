import { contextToPromptBlock, type ChatContext } from "@/lib/chat/context";
import { localChatReply } from "@/lib/chat/local-reply";

const SYSTEM = `אתה עוזר צ׳אט בעברית באתר "אלכס נכסים" (תיווך דירות בירושלים של אלכס גריביאן).
כללים:
- ענה רק בעברית, בקצרה ובבירור.
- השתמש רק במידע הציבורי שסופק למטה (ובקישורים שבו).
- אסור לחשוף או לנחש: שם/טלפון בעל נכס, כתובת מדויקת עם מספר בניין/דירה, הערות פנימיות, מחיר מינימום למו״מ.
- אם מחיר לא ידוע בנתונים — אמור "צור קשר לבירור" והפנה לוואטסאפ/טלפון.
- אל תמציא נכסים שאינם ברשימה.
- לשאלות מו״מ, משפטיות, או מחוץ להיקף — הפנה לאלכס בוואטסאפ.
- אתה לא מחליף את אלכס בעסקה.`;

export async function answerWithOptionalLlm(
  question: string,
  history: { role: "user" | "assistant"; content: string }[],
  ctx: ChatContext,
): Promise<{ reply: string; mode: "llm" | "local" }> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    return { reply: localChatReply(question, ctx), mode: "local" };
  }

  try {
    const messages = [
      {
        role: "system",
        content: `${SYSTEM}\n\nמידע עדכני:\n${contextToPromptBlock(ctx)}`,
      },
      ...history.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: question },
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 450,
        messages,
      }),
    });

    if (!res.ok) {
      console.error("groq error", res.status, await res.text());
      return { reply: localChatReply(question, ctx), mode: "local" };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return { reply: localChatReply(question, ctx), mode: "local" };
    }
    return { reply: text, mode: "llm" };
  } catch (error) {
    console.error("groq failed", error);
    return { reply: localChatReply(question, ctx), mode: "local" };
  }
}
