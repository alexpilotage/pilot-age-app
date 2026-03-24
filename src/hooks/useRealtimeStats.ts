"use client";

import { useEffect, useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface RealtimeSession {
  id: string;
  code: string;
  status: "draft" | "active" | "closed";
  created_at: string;
  started_at: string | null;
  closed_at: string | null;
  participant_count: number;
}

export interface RealtimeStats {
  total: number;
  aidant_probable: number;
  aidant_possible: number;
  non_aidant: number;
  average_score: number;
}

interface UseRealtimeStatsReturn {
  session: RealtimeSession | null;
  stats: RealtimeStats | null;
  loading: boolean;
  newResponseCount: number;
  refresh: () => Promise<void>;
}

export function useRealtimeStats(sessionId: string): UseRealtimeStatsReturn {
  const [session, setSession] = useState<RealtimeSession | null>(null);
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newResponseCount, setNewResponseCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/questionnaire/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        setStats(data.stats);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`session-realtime-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "questionnaire_responses",
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          // New response received — refresh stats
          setNewResponseCount((prev) => prev + 1);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchData]);

  return { session, stats, loading, newResponseCount, refresh: fetchData };
}
