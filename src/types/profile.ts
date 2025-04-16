
import { ButtonStyle, ThemeType, BackgroundStyle } from "@/components/AppearanceSettings";

export type ProfileLink = {
  id: string;
  title: string;
  url: string;
};

export type ProfileData = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
};

export type AppearanceSettings = {
  buttonStyle: ButtonStyle;
  theme: ThemeType;
  buttonColor?: string;
  backgroundColor?: string;
  backgroundStyle?: BackgroundStyle;
  backgroundImage?: string;
  gradientColors?: string;
  fontFamily?: string;
  customFontUrl?: string;
  iconStyle?: string;
  customIcons?: Record<string, string>;
  layoutTemplate?: string;
  layoutSettings?: Record<string, any>;
  showAnalytics?: boolean;
};

// Default appearance settings
export const defaultAppearance: AppearanceSettings = {
  buttonStyle: "default",
  theme: "light",
  buttonColor: "#000000",
  backgroundColor: "#ffffff",
  backgroundStyle: "solid",
  backgroundImage: "",
  gradientColors: "",
  fontFamily: "default",
  customFontUrl: "",
  iconStyle: "",
  customIcons: {},
  layoutTemplate: "standard",
  layoutSettings: {},
  showAnalytics: false
};

// Re-export the types from AppearanceSettings.tsx for better organization
export { ButtonStyle, ThemeType, BackgroundStyle } from "@/components/AppearanceSettings";
