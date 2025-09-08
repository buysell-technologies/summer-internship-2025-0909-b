// src/providers/I18nProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import moment from 'moment-timezone/builds/moment-timezone-with-data';
import '../utils/momentAllLocales';
import { LOCALE } from '../constants/locales';
import { TIMEZONE } from '../constants/timezones';

type Locale = (typeof LOCALE)[keyof typeof LOCALE];
type Timezone = (typeof TIMEZONE)[keyof typeof TIMEZONE];

type I18nContext = {
  locale: Locale;
  timezone: Timezone;
  setLocale: (l: Locale) => void;
  setTimezone: (tz: Timezone) => void;
  formatDate: (
    iso?: string,
    pattern?: 'YYYY/MM/DD HH:mm z' | 'YYYY/MM/DD',
  ) => string | undefined;
};

const Ctx = createContext<I18nContext | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(
    (localStorage.getItem('locale') as Locale) || LOCALE.JA,
  );
  const [timezone, setTimezone] = useState<Timezone>(
    (localStorage.getItem('timezone') as Timezone) || TIMEZONE.ASIA_TOKYO,
  );

  const handleSetLocale = useCallback((l: Locale) => {
    setLocale(l);
    localStorage.setItem('locale', l);
  }, []);

  const handleSetTimezone = useCallback((tz: Timezone) => {
    setTimezone(tz);
    localStorage.setItem('timezone', tz);
  }, []);

  const formatDate = useCallback(
    (
      iso?: string,
      pattern: 'YYYY/MM/DD HH:mm z' | 'YYYY/MM/DD' = 'YYYY/MM/DD HH:mm z',
    ) => {
      if (!iso) return undefined;
      if (!moment(iso).isValid()) return undefined;
      return moment.tz(iso, timezone).locale(locale).format(pattern);
    },
    [locale, timezone],
  );

  const value = useMemo(
    () => ({
      locale,
      timezone,
      setLocale: handleSetLocale,
      setTimezone: handleSetTimezone,
      formatDate,
    }),
    [locale, timezone, handleSetLocale, handleSetTimezone, formatDate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
