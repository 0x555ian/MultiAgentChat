import { LLMApi, ChatOptions, LLMModel } from "./api";

export class ElizaAgentBridge implements LLMApi {
  private endpoint: string;

  constructor() {
    this.endpoint = process.env.ELIZA_API_URL || "http://0.0.0.0:5000";
  }

  async chat(options: ChatOptions) {
    const { messages, onUpdate, onFinish, onError } = options;

    try {
      // Verify model access first
      const modelResponse = await fetch(`${this.endpoint}/models/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.config.model,
        }),
      });

      if (!modelResponse.ok) {
        throw new Error(`Model access denied: ${options.config.model}`);
      }

      const response = await fetch(`${this.endpoint}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: options.config.model,
        }),
      });

      if (!response.ok) {
        throw new Error(`ElizaOS API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        onUpdate?.(text, "");
      }

      onFinish?.("", response);
    } catch (error) {
      console.error("ElizaOS chat error:", error);
      onError?.(error as Error);
    }
  }

  async models(): Promise<LLMModel[]> {
    try {
      const response = await fetch(`${this.endpoint}/models`);
      const models = await response.json();

      return models.map((model: any) => ({
        name: `eliza-${model.name}`,
        available: true,
        provider: "eliza",
      }));
    } catch (error) {
      console.error("Failed to fetch ElizaOS models:", error);
      return [];
    }
  }
}
