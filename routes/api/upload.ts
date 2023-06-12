// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from "$fresh/server.ts";
import { ensureGetEnv } from "../../utils/env.ts";
import { ApplicationError } from "../../utils/errors.ts";

export const corsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    form.append("n", "2");
    form.append("size", "256x256");

    try {
      // Handle CORS
      if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
      }

      // The Fetch API allows for easier response streaming over the OpenAI client.
      const response = await fetch(
        "https://api.openai.com/v1/images/variations",
        {
          headers: {
            Authorization: `Bearer ${ensureGetEnv("OPENAI_API_KEY")}`,
          },
          method: "POST",
          body: form,
        },
      );

      const { data } = await response.json();

      console.log("res", data);

      if (data) {
        return Response.json(data, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
      // Proxy the streamed SSE response from OpenAI
    } catch (error) {
      console.log(error);
    }
  },
};
