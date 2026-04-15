import { defaultLocale, type Locale } from "@/config/site";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "zh";
}

export function localizePath(path: string, locale: Locale) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return normalized;
  }
  return normalized === "/" ? "/zh/" : `/zh${normalized}`;
}

export function switchLocale(pathname: string, locale: Locale) {
  const stripped = pathname.startsWith("/zh/") ? pathname.slice(3) : pathname === "/zh" ? "/" : pathname;
  const normalized = stripped.startsWith("/") ? stripped : `/${stripped}`;
  return localizePath(normalized, locale);
}

export function htmlLang(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
}
