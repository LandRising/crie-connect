
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
  gradientColors?: string;
  fontFamily?: string;
  showAnalytics?: boolean;
};

// Default appearance settings
export const defaultAppearance: AppearanceSettings = {
  buttonStyle: "default",
  theme: "light",
  buttonColor: "#000000",
  backgroundColor: "#ffffff",
  backgroundStyle: "solid",
};
