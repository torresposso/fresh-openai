import type { MiddlewareHandlerContext } from "$fresh/server.ts";
import {
  BrowserCookieAuthStorageAdapter,
  CookieAuthStorageAdapter,
  CookieOptions,
  CookieOptionsWithName,
  createSupabaseClient,
  DEFAULT_COOKIE_OPTIONS,
  SupabaseClientOptionsWithoutAuth,
} from "@supabase/auth-helpers-shared";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import redirect from "@/utils/redirect.ts";

class DenoFreshServerComponentAuthStorageAdapter
  extends CookieAuthStorageAdapter {
  constructor(
    private readonly context: {
      req: Request;
      resHeaders?: Headers;
    },
    cookieOptions?: CookieOptions,
  ) {
    super(cookieOptions);
  }

  protected getCookie(name: string): string | null | undefined {
    const cookies = getCookies(this.context.req.headers);
    const cookie = cookies[name] ?? "";
    return decodeURIComponent(cookie);
  }
  protected setCookie(name: string, value: string): void {
    if (!this.context.resHeaders) return;
    setCookie(this.context.resHeaders, {
      name,
      value: encodeURIComponent(value),
      ...this.cookieOptions,
      sameSite: "Lax",
      httpOnly: false,
    });
  }
  protected deleteCookie(name: string): void {
    if (!this.context.resHeaders) return;
    deleteCookie(this.context.resHeaders, name, { ...this.cookieOptions });
  }
}

class DenoFreshBrowserComponentAuthStorageAdapter
  extends BrowserCookieAuthStorageAdapter {
  constructor(
    cookieOptions: CookieOptions,
  ) {
    super(cookieOptions);
  }
}

export function createServerClient(
  context: {
    req: Request;
    resHeaders?: Headers;
  },
  {
    supabaseUrl = Deno.env.get("SUPABASE_API_URL"),
    supabaseKey = Deno.env.get("SUPABASE_ANON_KEY"),
    options,
    cookieOptions,
  }: {
    supabaseUrl?: string;
    supabaseKey?: string;
    options?: SupabaseClientOptionsWithoutAuth<"public">;
    cookieOptions?: CookieOptionsWithName;
  } = {},
) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either SUPABASE_URL and SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!",
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options?.global,
      headers: {
        ...options?.global?.headers,
        "X-Client-Info": `DENO_FRESH@0.0.1`,
      },
    },
    auth: {
      storageKey: cookieOptions?.name,
      storage: new DenoFreshServerComponentAuthStorageAdapter(context, {
        ...DEFAULT_COOKIE_OPTIONS,
        ...cookieOptions,
      }),
    },
  });
}

export function createBrowserClient(
  {
    supabaseUrl,
    supabaseKey,
    options,
    cookieOptions,
  }: {
    supabaseUrl?: string;
    supabaseKey?: string;
    options?: SupabaseClientOptionsWithoutAuth<"public">;
    cookieOptions?: CookieOptionsWithName;
  } = {},
) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either SUPABASE_URL and SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!",
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options?.global,
      headers: {
        ...options?.global?.headers,
        "X-Client-Info": `DENO_FRESH@0.0.1`,
      },
    },
    auth: {
      storageKey: cookieOptions?.name,
      storage: new DenoFreshBrowserComponentAuthStorageAdapter({
        ...DEFAULT_COOKIE_OPTIONS,
        ...cookieOptions,
      }),
    },
  });
}

export async function ensureLoggedInMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  if (!ctx.state.session) {
    return redirect(`/login?redirect_url=${encodeURIComponent(req.url)}`);
  }

  return await ctx.next();
}

// export type SupabaseClient = ReturnType<typeof createSupaClient>;

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
