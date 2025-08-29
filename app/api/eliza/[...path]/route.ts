import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const elizaBaseUrl = process.env.ELIZA_API_URL || "http://0.0.0.0:8000";
  const apiPath = params.path.join("/");

  try {
    const body = await req.json();
    const response = await fetch(`${elizaBaseUrl}/${apiPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Eliza API error:", error);
    return new Response(JSON.stringify({ error: "Eliza API error" }), {
      status: 500,
    });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const elizaBaseUrl = process.env.ELIZA_API_URL || "http://0.0.0.0:8000";
  const apiPath = params.path.join("/");

  try {
    const response = await fetch(`${elizaBaseUrl}/${apiPath}`);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Eliza API error:", error);
    return new Response(JSON.stringify({ error: "Eliza API error" }), {
      status: 500,
    });
  }
}
