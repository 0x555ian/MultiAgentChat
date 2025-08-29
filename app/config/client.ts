import { BuildConfig, getBuildConfig } from "./build";

export const ELIZA_AGENT_CONFIG = {
  endpoint: process.env.ELIZA_API_URL || "http://0.0.0.0:8000",
  defaultModel: "eliza-coder",
  supportedModels: ["eliza-coder", "eliza-designer", "eliza-researcher"],
  agentRegistry: {
    "eliza-coder": {
      name: "ElizaCoder",
      description: "Code generation and review specialist",
      contextSize: 4096,
      provider: {
        id: "elizaos",
        providerName: "ElizaOS",
        providerType: "elizaos",
      },
    },
    "eliza-designer": {
      name: "ElizaDesigner",
      description: "UI/UX design specialist",
      contextSize: 4096,
      provider: {
        id: "elizaos",
        providerName: "ElizaOS",
        providerType: "elizaos",
      },
    },
    "eliza-researcher": {
      name: "ElizaResearcher",
      description: "Research and analysis specialist",
      contextSize: 4096,
      provider: {
        id: "elizaos",
        providerName: "ElizaOS",
        providerType: "elizaos",
      },
    },
  },
};

export function getClientConfig() {
  if (typeof document !== "undefined") {
    // client side
    return JSON.parse(queryMeta("config") || "{}") as BuildConfig;
  }

  if (typeof process !== "undefined") {
    // server side
    return getBuildConfig();
  }
}

function queryMeta(key: string, defaultValue?: string): string {
  let ret: string;
  if (document) {
    const meta = document.head.querySelector(
      `meta[name='${key}']`,
    ) as HTMLMetaElement;
    ret = meta?.content ?? "";
  } else {
    ret = defaultValue ?? "";
  }

  return ret;
}
