export function hasAnthropicKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export function anthropicModel() {
  return process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-5";
}

export function apiStatus() {
  const configured = hasAnthropicKey();
  return {
    configured,
    model: anthropicModel(),
    hint: configured
      ? "A API Anthropic está configurada neste servidor."
      : "Claude Pro (claude.ai) não autentica este app. Crie uma chave em console.anthropic.com, coloque ANTHROPIC_API_KEY no .env.local e reinicie o servidor.",
  };
}
