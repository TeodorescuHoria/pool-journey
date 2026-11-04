import { Link, NavLink } from "react-router-dom";
import { Mountain } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const links = [
  { to: "/joc", label: "Joc în grup" },
  { to: "/antrenament", label: "Antrenament" },
  { to: "/carti", label: "Cărți" },
  { to: "/reguli", label: "Reguli" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="container flex h-14 items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-lg font-extrabold text-primary">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Mountain className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">Pool Journey</span>
          </Link>
          <nav className="ml-auto flex gap-1 overflow-x-auto text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn("whitespace-nowrap rounded-md px-2 py-1.5 sm:px-3 font-medium hover:bg-secondary", isActive && "bg-secondary text-primary")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container py-6">{children}</main>
      <footer className="container pb-8 pt-4 text-center text-xs text-muted-foreground">
        Pool Journey · joc de cărți pentru antrenament la biliard · se joacă la o masă reală
      </footer>
    </div>
  );
}
