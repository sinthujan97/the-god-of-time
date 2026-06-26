"use server";

export type AIServerRequestOptions = {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
};

export async function callOpenAI(options: AIServerRequestOptions): Promise<{ content: string; error: string | null }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY in environment");
    return { content: "", error: "The OpenAI API key is missing. Please check your configuration." };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: options.systemPrompt,
          },
          {
            role: "user",
            content: options.userPrompt,
          },
        ],
        max_tokens: options.maxTokens ?? 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error response:", errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    return { content, error: null };
  } catch (err) {
    console.error("OpenAI Realm AI error:", err);
    return {
      content: "",
      error: "The timeline is unclear. Try again.",
    };
  }
}
