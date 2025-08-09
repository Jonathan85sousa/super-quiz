import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type BackgroundMode = "color" | "gradient" | "image";

export type FontOption = "sans" | "playfair" | "poppins" | "mono";

export interface AppearanceSettings {
  gameTitle: string;
  logoUrl: string;
  backgroundMode: BackgroundMode;
  backgroundColor: string; // HSL string like "210 40% 98%"
  gradientFrom: string; // HSL
  gradientTo: string; // HSL
  backgroundImageUrl: string;
  bodyFont: FontOption;
  headingFont: FontOption;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  updateSettings: (partial: Partial<AppearanceSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppearanceSettings = {
  gameTitle: "QUIZ MASTER",
  logoUrl: "",
  backgroundMode: "gradient",
  backgroundColor: "0 0% 100%", // fallback
  gradientFrom: "262 83% 58%",
  gradientTo: "217 91% 60%",
  backgroundImageUrl: "",
  bodyFont: "sans",
  headingFont: "playfair",
};

const AppearanceContext = createContext<AppearanceContextType | null>(null);

const LOCAL_KEY = "appearance-settings:v1";

function applyBackground(s: AppearanceSettings) {
  const root = document.documentElement;
  const body = document.body;

  // Reset background image properties
  body.style.backgroundImage = "";
  body.style.backgroundSize = "";
  body.style.backgroundRepeat = "";
  body.style.backgroundAttachment = "";
  body.style.backgroundPosition = "";

  // Apply background based on mode
  if (s.backgroundMode === "color") {
    root.style.setProperty("--background", s.backgroundColor);
  } else if (s.backgroundMode === "gradient") {
    // Keep base background for contrast and apply gradient overlay
    const gradient = `linear-gradient(135deg, hsl(${s.gradientFrom}) 0%, hsl(${s.gradientTo}) 100%)`;
    body.style.backgroundImage = gradient;
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundSize = "cover";
  } else if (s.backgroundMode === "image") {
    if (s.backgroundImageUrl) {
      body.style.backgroundImage = `url(${s.backgroundImageUrl})`;
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
    }
  }
}

function applyFonts(s: AppearanceSettings) {
  const body = document.body;
  const fontClasses = ["font-sans", "font-playfair", "font-poppins", "font-mono"];
  fontClasses.forEach((c) => body.classList.remove(c));
  const bodyFontClass = {
    sans: "font-sans",
    playfair: "font-playfair",
    poppins: "font-poppins",
    mono: "font-mono",
  }[s.bodyFont];
  body.classList.add(bodyFontClass);
}

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) } as AppearanceSettings;
    } catch {}
    return defaultSettings;
  });

  useEffect(() => {
    // Persist
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
    } catch {}

    // Apply visuals
    applyBackground(settings);
    applyFonts(settings);
  }, [settings]);

  const updateSettings = (partial: Partial<AppearanceSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings]
  );

  return (
    <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
  );
};

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used within AppearanceProvider");
  return ctx;
}
