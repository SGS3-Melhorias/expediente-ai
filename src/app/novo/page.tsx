"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NovoPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const file = data.get("arquivo");
    if (!(file instanceof File) || file.size === 0) {
      toast.error("Selecione o PDF do processo.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/expedientes", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Falha no upload.");
      toast.success(
        `Detectado ${json.sistema} (${json.deteccao?.confianca ?? "confiança indefinida"}).`,
      );
      router.push(`/expedientes/${json.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no upload.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo expediente</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Não é preciso escolher SEI ou CPA: o app lê o PDF e sugere o sistema.
          Você confirma só se o palpite vier fraco.
        </p>
      </div>

      <Alert>
        <AlertTitle>De onde sai o PDF</AlertTitle>
        <AlertDescription>
          No SEI, baixe o processo completo. No SAJADM-CPA, exporte o expediente
          em PDF. Não há integração automática com os sistemas oficiais neste
          recorte.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Arquivo do processo</CardTitle>
          <CardDescription>
            Até 40 MB. PDFs longos são lidos em partes na análise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="arquivo">PDF</Label>
              <Input
                id="arquivo"
                name="arquivo"
                type="file"
                accept="application/pdf,.pdf"
                required
                onChange={(ev) =>
                  setFileName(ev.target.files?.[0]?.name ?? null)
                }
              />
              {fileName ? (
                <p className="text-xs text-muted-foreground">{fileName}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto (opcional)</Label>
              <Input
                id="assunto"
                name="assunto"
                placeholder="Se vazio, tentamos extrair do PDF"
              />
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? "Lendo o PDF…" : "Enviar e detectar sistema"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
