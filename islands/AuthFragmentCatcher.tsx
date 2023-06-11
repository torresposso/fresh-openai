// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { useEffect } from "preact/hooks";
import { createBrowserClient } from "@/utils/supabase.ts";

interface AuthFragmentCatcherProps {
  supabaseUrl: string;
  supabaseKey: string;
}

export default function AuthFragmentCatcher(props: AuthFragmentCatcherProps) {
  useEffect(() => {
    const supabase = createBrowserClient(props);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        window.location.href = "/";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <span></span>;
}
