const SETTINGS_KEY = 'cash_settings_v1';

export const DEFAULT_PRIMARY = '#1dc35a';
export const DEFAULT_LANGUAGE = 'pt-BR';

export type AppLanguage = 'pt-BR' | 'en-US' | 'es-ES';

export type AppSettings = {
  primary: string;
  language: AppLanguage;
};

const LANGUAGES: AppLanguage[] = ['pt-BR', 'en-US', 'es-ES'];

function isLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && LANGUAGES.includes(value as AppLanguage);
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { primary: DEFAULT_PRIMARY, language: DEFAULT_LANGUAGE };

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const primary =
      typeof parsed.primary === 'string' && /^#[0-9a-fA-F]{6}$/.test(parsed.primary)
        ? parsed.primary
        : DEFAULT_PRIMARY;
    const language = isLanguage(parsed.language) ? parsed.language : DEFAULT_LANGUAGE;

    return { primary, language };
  } catch {
    return { primary: DEFAULT_PRIMARY, language: DEFAULT_LANGUAGE };
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function hexToHslChannels(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function applyPrimaryColor(primary: string) {
  const channels = hexToHslChannels(primary);
  const root = document.documentElement;
  root.style.setProperty('--primary', channels);
  root.style.setProperty('--accent', channels);
  root.style.setProperty('--ring', channels);
  root.style.setProperty('--success', channels);
  root.style.setProperty('--hover-overlay', `${channels} / 0.1`);
}
