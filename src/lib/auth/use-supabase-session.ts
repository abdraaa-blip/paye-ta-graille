"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

/**
 * Session navigateur Supabase + client : une seule souscription pour nav, landing, etc.
 * `ready` évite d’afficher « déconnecté » avant la première lecture des cookies.
 */
export function useSupabaseSession() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [sessionActive, setSessionActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setSessionActive(false);
      setReady(true);
      return;
    }
    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setSessionActive(Boolean(session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionActive(Boolean(session));
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return { supabase, sessionActive, ready };
}
