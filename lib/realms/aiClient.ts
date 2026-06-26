import { useState } from "react";
import { callOpenAI } from "./aiActions";

export type AIRequestOptions = {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  expectJSON?: boolean;
};

export async function callRealmAI(
  options: AIRequestOptions
): Promise<{ content: string; error: string | null }> {
  return callOpenAI(options);
}

export function useRealmAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function generate(options: AIRequestOptions): Promise<void> {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const { content, error: apiError } = await callRealmAI(options);

    setIsLoading(false);

    if (apiError) {
      setError(apiError);
    } else {
      setResult(content);
    }
  }

  function reset() {
    setIsLoading(false);
    setError(null);
    setResult(null);
  }

  return { isLoading, error, result, generate, reset };
}
