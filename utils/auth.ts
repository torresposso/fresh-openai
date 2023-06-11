// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { MiddlewareHandlerContext } from "$fresh/server.ts";

import { createClient } from "@supabase/supabase-js";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { redirect } from "./http.ts";

// export type SupabaseClient = ReturnType<typeof createSupaClient>;

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_API_URL"),
  Deno.env.get("SUPABASE_ANON_KEY"),
);

// export function createSupabaseClient(
//   requestHeaders: Headers,
//   responseHeaders: Headers,
// ) {
//   return createServerSupabaseClient({
//     supabaseUrl: Deno.env.get("SUPABASE_API_URL")!,
//     supabaseKey: Deno.env.get("SUPABASE_ANON_KEY")!,
//     getRequestHeader: (key) => requestHeaders.get(key) ?? undefined,
//     getCookie: (name) => {
//       const cookie = getCookies(requestHeaders)[name];
//       return cookie ? decodeURIComponent(cookie) : undefined;
//     },
//     setCookie: (name, value, options) =>
//       setCookie(responseHeaders, {
//         name,
//         value: encodeURIComponent(value),
//         ...options,
//         sameSite: "Lax",
//         httpOnly: false,
//       }),
//   });
// }

// export async function ensureLoggedInMiddleware(
//   req: Request,
//   ctx: MiddlewareHandlerContext,
// ) {
//   if (!ctx.state.session) {
//     return redirect(`/login?redirect_url=${encodeURIComponent(req.url)}`);
//   }

//   return await ctx.next();
// }
