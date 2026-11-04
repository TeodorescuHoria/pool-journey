import { useEffect, useRef, useState } from "react";
import { Timer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShotClock({ seconds = 30, highlight }: { seconds?: number; highlight?: boolean }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  useEffect(() => {
    if (left === 0) setRunning(false);
  }, [left]);

  const restart = () => {
    setLeft(seconds);
    setRunning(true);
  };

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border bg-card p-3", highlight && "border-amber-400 ring-2 ring-amber-200")}>
      <Timer className="h-5 w-5 text-muted-foreground" />
      <span
        className={cn(
          "w-12 font-display text-2xl font-extrabold tabular-nums",
          left <= 5 && running && "text-destructive animate-pulse",
          left === 0 && "text-destructive"
        )}
      >
        {left}s
      </span>
      <Button size="sm" variant={running ? "outline" : "default"} onClick={running ? () => setRunning(false) : restart}>
        {running ? "Pauză" : left === seconds || left === 0 ? "Start" : "Repornește"}
      </Button>
      <Button size="icon" variant="ghost" aria-label="Resetează" onClick={() => { setRunning(false); setLeft(seconds); }}>
        <RotateCcw />
      </Button>
      <span className="ml-auto text-xs text-muted-foreground">Ceas de lovitură</span>
    </div>
  );
}
