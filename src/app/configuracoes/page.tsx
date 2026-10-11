"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Textarea } from "@/components/ui/textarea";
import type { UnitSettings } from "@/lib/types";

export default function ConfigPage() {
  const [settings, setSettings] = useState<UnitSettings | null>(null);
  const [api, setApi] = useState<{
    configured: boolean;
    model: string;
    hint: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => toast.error("Não carregou as configurações da unidade."));
    fetch("/api/status")
      .then((r) => r.json())
      .then(setApi)
      .catch(() => undefined);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Falha ao gravar.");
      setSettings(await res.json());
      toast.success("Configuração da unidade atualizada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao gravar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Unidade e API</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vocativo e signatários entram em toda Informação. A chave da DeepSeek
          fica só no servidor — nunca é exibida aqui.
        </p>
      </div>

      {api ? (
        <Alert variant={api.configured ? "default" : "destructive"}>
          <AlertTitle>
            {api.configured
              ? `API configurada · modelo ${api.model}`
              : "API DeepSeek ausente"}
          </AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{api.hint}</p>
            {!api.configured ? (
              <ol className="list-decimal space-y-1 pl-4 text-sm">
                <li>
                  Abra{" "}
                  <a
                    className="underline"
                    href="https://platform.deepseek.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    platform.deepseek.com
                  </a>
                  .
                </li>
                <li>Em API Keys, crie uma chave e adicione saldo se ainda não houver.</li>
                <li>Grave DEEPSEEK_API_KEY no .env.local.</li>
                <li>Reinicie o servidor de desenvolvimento.</li>
              </ol>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {settings ? (
        <Card>
          <CardHeader>
            <CardTitle>Padrões da SGS</CardTitle>
            <CardDescription>
              Usados na redação CPA e SEI quando o expediente não trouxer o dado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={save}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input
                    id="unidade"
                    value={settings.unidade}
                    onChange={(e) =>
                      setSettings({ ...settings, unidade: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefixo">Prefixo da Informação</Label>
                  <Input
                    id="prefixo"
                    value={settings.prefixoInformacao}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        prefixoInformacao: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número SGS sugerido</Label>
                <Input
                  id="numero"
                  value={settings.proximoNumeroSgs}
                  onChange={(e) =>
                    setSettings({ ...settings, proximoNumeroSgs: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vocativo">Vocativo padrão</Label>
                <Textarea
                  id="vocativo"
                  rows={3}
                  value={settings.vocativo}
                  onChange={(e) =>
                    setSettings({ ...settings, vocativo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signatarios">Signatários</Label>
                <Textarea
                  id="signatarios"
                  rows={5}
                  value={settings.signatarios}
                  onChange={(e) =>
                    setSettings({ ...settings, signatarios: e.target.value })
                  }
                />
              </div>
              <Button type="submit" disabled={busy}>
                {busy ? "Salvando…" : "Salvar unidade"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}
    </div>
  );
}
