"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileStack, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Fila" },
  { href: "/novo", label: "Novo expediente" },
  { href: "/configuracoes", label: "Unidade e API" },
];

export function AppHeader() {
  const path = usePathname();
  const [api, setApi] = useState<{ configured: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setApi)
      .catch(() => setApi({ configured: false }));
  }, []);

  return (
    <header className="border-b border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-start gap-3">
          <span className="mt-0.5 rounded-md bg-accent/90 p-2 text-accent-foreground">
            <FileStack className="size-5" />
          </span>
          <span>
            <span className="block text-xs tracking-[0.18em] uppercase opacity-80">
              TJSP · Secretaria de Governança de Sistemas
            </span>
            <span className="block font-semibold leading-tight">
              Assistente de Informações
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary-foreground/15 font-medium"
                    : "opacity-85 hover:bg-primary-foreground/10",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <span
            className={cn(
              "ml-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
              api?.configured
                ? "bg-emerald-400/20 text-emerald-50"
                : "bg-amber-400/20 text-amber-50",
            )}
          >
            <Settings2 className="size-3.5" />
            {api == null
              ? "API…"
              : api.configured
                ? "API DeepSeek"
                : "API ausente"}
          </span>
        </nav>
      </div>
    </header>
  );
}
