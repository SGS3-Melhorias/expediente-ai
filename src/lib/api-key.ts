export function hasDeepSeekKey() {
  return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
}

export function deepSeekModel() {
  return process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";
}

export function apiStatus() {
  const configured = hasDeepSeekKey();
  return {
    configured,
    model: deepSeekModel(),
    hint: configured
      ? "A API DeepSeek está configurada neste servidor."
      : "Crie uma chave em platform.deepseek.com, coloque DEEPSEEK_API_KEY no .env.local e reinicie o servidor.",
  };
}
