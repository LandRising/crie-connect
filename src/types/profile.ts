
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
};

import { ButtonStyle, ThemeType } from "@/components/AppearanceSettings";

// Default appearance settings
export const defaultAppearance: AppearanceSettings = {
  buttonStyle: "default",
  theme: "light",
};
