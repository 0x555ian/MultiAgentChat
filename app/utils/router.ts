import { LLMApi } from "../client/api";
import { ElizaAgentBridge } from "../client/elizaAgentBridge";
import { getModelProvider } from "./model";

export class UnifiedRouter {
  private elizaAgent: ElizaAgentBridge;
  private modelApis: Map<string, LLMApi>;

  constructor() {
    this.elizaAgent = new ElizaAgentBridge();
    this.modelApis = new Map();
  }

  async route(modelName: string) {
    // Check if it's an ElizaOS agent
    if (modelName.startsWith("eliza-")) {
      return this.elizaAgent;
    }

    // Get model provider
    const [provider] = getModelProvider(modelName);

    // Get or create model API instance
    if (!this.modelApis.has(provider)) {
      const ApiClass = await import(`../client/platforms/${provider}`);
      this.modelApis.set(provider, new ApiClass.default());
    }

    return this.modelApis.get(provider);
  }
}
