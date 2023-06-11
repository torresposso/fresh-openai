// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from "$fresh/server.ts";
import type { Provider } from "@supabase/supabase-js";
import { State } from "@/routes/_middleware.ts";
import redirect from "@/utils/redirect.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const provider = form.get("provider");

    if (typeof provider !== "string") {
      return new Response(null, { status: 400 });
    }

    const { origin } = new URL(req.url);
    const { data, error } = await ctx.state.supabaseClient.auth.signInWithOAuth(
      {
        provider: provider as Provider,
        options: {
          redirectTo: origin + "/auth/login/success",
        },
      },
    );

    if (error) throw error;

    return redirect(data.url);
  },
};
