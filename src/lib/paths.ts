import path from "node:path";

export const ROOT = process.cwd();
export const DATA_DIR = path.join(ROOT, "data");
export const EXPEDIENTES_DIR = path.join(DATA_DIR, "expedientes");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
export const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");
export const PROMPTS_DIR = path.join(ROOT, "prompts");
export const TEMPLATES_DIR = path.join(ROOT, "templates");
