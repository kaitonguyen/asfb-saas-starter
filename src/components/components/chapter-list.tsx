"use client";
import { Card } from "@/components/components/ui/card";
import { Button } from "@/components/components/ui/button";
import { Pencil, GripVertical } from "lucide-react";
import { Separator } from "@/components/components/ui/separator";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/component";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState, forwardRef, createContext, useContext } from "react";
import { Chapter } from "@/lib/types";
import { useChapter } from "../hooks/use-chapter";
// Card for each chapter


type ChapterCardProps = {
  chapter: Chapter;
  listeners?: any;
  attributes?: any;
  isDragging?: boolean;
};

const ChapterCard = forwardRef<HTMLDivElement, ChapterCardProps>(
  ({ chapter, listeners, attributes, isDragging }, ref) => {
    const { setChapters, chapters } = useChapter();
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(chapter.name);
    const [editingNote, setEditingNote] = useState(false);
    const [note, setNote] = useState(chapter.note || "");
    const [loading, setLoading] = useState(false);

    // Update name in DB
    const handleSaveName = async () => {
      setLoading(true);
      await createClient()
        .from('chapters')
        .update({ name })
        .eq('id', chapter.id);
      setEditingName(false);
      setLoading(false);
      // Update context state so sidebar and chapter-list sync
      setChapters(
        chapters.map(c =>
          c.id === chapter.id ? { ...c, name } : c
        )
      );
    };

    // Update note in DB
    const handleSaveNote = async () => {
      setLoading(true);
      await createClient()
        .from('chapters')
        .update({ note })
        .eq('id', chapter.id);
      setEditingNote(false);
      setLoading(false);
    };

    // Prevent drag on interactive elements
    const stopDrag = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
    };
    return (
      <Card
        ref={ref}
        className={`mb-2 p-2 bg-card border relative ${isDragging ? "opacity-50" : ""}`}
        style={{ minHeight: "120px" }}
      >
        <div className="flex justify-between items-start ml-4">
          <div className="w-full">
            {editingName ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSaveName();
                }}
                className="flex gap-2 items-center"
              >
                <input
                  className="border rounded px-2 py-1 text-lg w-full"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  disabled={loading}
                />
                <Button type="submit" size="sm" disabled={loading}>Lưu</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => { setEditingName(false); setName(chapter.name); }} disabled={loading}>Hủy</Button>
              </form>
            ) : (
              <span>{name}</span>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-4 absolute top-2 right-2"
            onClick={() => setEditingName(true)}
            disabled={editingName || loading}
          >
            <Pencil size={16} />
          </Button>
          {/* Drag handle only: listeners/attributes here */}
          <span
            {...listeners}
            {...attributes}
            className="absolute top-2 left-2 cursor-grab text-muted-foreground"
            style={{ touchAction: "none" }}
            tabIndex={0}
            aria-label="Kéo để sắp xếp"
          >
            <GripVertical size={16} />
          </span>
        </div>
        <Separator className="my-2" />
        <div className="text-muted-foreground text-sm min-h-[32px] cursor-pointer" onClick={() => !editingNote && setEditingNote(true)}>
          {editingNote ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveNote();
              }}
              className="flex gap-2 items-center"
            >
              <input
                className="border rounded px-2 py-1 text-sm w-full"
                value={note}
                onChange={e => setNote(e.target.value)}
                autoFocus
                disabled={loading}
              />
              <Button type="submit" size="sm" disabled={loading}>Lưu</Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => { setEditingNote(false); setNote(chapter.note || ""); }} disabled={loading}>Hủy</Button>
            </form>
          ) : (
            <span>{note || <span className="italic text-xs">Thêm ghi chú...</span>}</span>
          )}
        </div>
      </Card>
    );
  }
);

// Sortable wrapper for each chapter
type SortableChapterProps = {
  chapter: Chapter;
  id: string;
};

function SortableChapter({ chapter, id }: SortableChapterProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({ id });
  return (
    <ChapterCard
      chapter={chapter}
      listeners={listeners}
      attributes={attributes}
      isDragging={isDragging}
      ref={setNodeRef}
    />
  );
}

export default function ChapterList() {
  const { chapters, setChapters } = useChapter();

  const handleDragEnd = async (event: any) => {
    if (!chapters || chapters.length === 0) return;
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = chapters.findIndex((c: Chapter) => c.id === active.id);
      const newIndex = chapters.findIndex((c: Chapter) => c.id === over.id);
      const newChapters = [...chapters];
      const moved = newChapters.splice(oldIndex, 1)[0];
      newChapters.splice(newIndex, 0, moved);
      for (let i = 0; i < newChapters.length; i++) {
        const chapter = newChapters[i];
        if (chapter.order_number !== i) {
          await createClient()
            .from('chapters')
            .update({ order_number: i })
            .eq('id', chapter.id);
        }
      }
      setChapters(newChapters);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {
        !chapters || chapters.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10">
            Không có chương nào. Hãy thêm chương mới để bắt đầu.
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={chapters.map((c: Chapter) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {chapters.map((chapter: Chapter) => (
                <SortableChapter key={chapter.id} chapter={chapter} id={chapter.id} />
              ))}
            </SortableContext>
          </DndContext>
        )
      }
    </div>
  );
}
