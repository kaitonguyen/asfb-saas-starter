'use client';
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Chapter } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

// Context for chapters
type ChapterContextType = {
  chapters: Chapter[];
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
};

const ChapterContext = createContext<ChapterContextType | undefined>(undefined);

export function ChapterProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params?.id;
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await createSupabaseBrowserClient()
        .from('chapters')
        .select('*')
        .eq('project_id', projectId)
        .order('order_number', { ascending: true });
      if (error) {
        console.error('Error fetching chapters:', error);
      } else {
        setChapters(data || []);
      }
    };
    fetchChapters();
  }, [projectId]);

  return (
    <ChapterContext.Provider value={{ chapters, setChapters }}>
      {children}
    </ChapterContext.Provider>
  );
}

export function useChapter() {
  const ctx = useContext(ChapterContext);
  if (!ctx) throw new Error("useChapter must be used within ChapterProvider");
  return ctx;
}
