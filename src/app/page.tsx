"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FilePlus2, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, STATUS_LABEL } from "@/lib/labels";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Row = {
  id: string;
  arquivoNome: string;
  assunto: string;
  sistema: "SEI" | "CPA";
  sistemaConfirmado: boolean;
  confianca: string;
  processo?: string;
  status: "pdf" | "analise" | "rascunho" | "pronto";
  demo?: boolean;
  paginas: number;
  atualizadoEm: string;
};

export default function FilaPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/expedientes")
      .then(async (r) => {
        if (!r.ok) throw new Error("Não foi possível carregar a fila.");
        return r.json();
      })
      .then(setRows)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fila da equipe</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Baixe o processo no SEI ou no SAJADM-CPA, suba o PDF aqui, confira o
            sistema detectado e redija a Informação no modelo certo.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/novo" />}>
          <FilePlus2 />
          Novo expediente
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Falha ao abrir a fila</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {rows === null && !error ? (
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">
            Carregando expedientes…
          </CardContent>
        </Card>
      ) : null}

      {rows?.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="size-5" />
              Nenhum expediente ainda
            </CardTitle>
            <CardDescription>
              O primeiro passo é o PDF completo do processo. A detecção SEI/CPA
              e a leitura organizada vêm em seguida.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/novo" />}>
              Enviar o primeiro PDF
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-3">
        {rows?.map((row) => (
          <Link key={row.id} href={`/expedientes/${row.id}`}>
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base leading-snug">{row.assunto}</CardTitle>
                  <CardDescription>
                    {row.processo ?? "Processo não identificado"} · {row.arquivoNome} ·{" "}
                    {row.paginas} pág.
                    {row.demo ? " · demonstração" : ""}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={row.sistema === "CPA" ? "secondary" : "default"}>
                    {row.sistema}
                    {!row.sistemaConfirmado ? " · conferir" : ""}
                  </Badge>
                  <Badge variant="outline">{STATUS_LABEL[row.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Atualizado em {formatDate(row.atualizadoEm)}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
