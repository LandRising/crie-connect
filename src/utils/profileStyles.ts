
import { ButtonStyle, ThemeType } from "@/types/profile";

export const getButtonStyles = (buttonStyle: ButtonStyle) => {
  switch (buttonStyle) {
    case "outline":
      return "bg-transparent border-2 border-black text-black hover:bg-gray-100";
    case "rounded":
      return "bg-black text-white rounded-full hover:bg-gray-800";
    case "shadow":
      return "bg-black text-white shadow-lg hover:shadow-xl transition-shadow";
    case "glass":
      return "backdrop-blur-sm bg-white/20 border border-white/30 text-white hover:bg-white/30";
    case "soft":
      return "bg-black/80 text-white rounded-xl hover:bg-black/90";
    case "default":
    default:
      return "bg-black text-white hover:bg-gray-800";
  }
};

export const getThemeStyles = (theme: ThemeType) => {
  switch (theme) {
    case "dark":
      return {
        background: "bg-gray-900",
        text: "text-white",
        subtext: "text-gray-300",
        border: "border-gray-700"
      };
    case "black":
      return {
        background: "bg-black",
        text: "text-white",
        subtext: "text-gray-400",
        border: "border-gray-800"
      };
    case "purple":
      return {
        background: "bg-purple-900",
        text: "text-white",
        subtext: "text-purple-200",
        border: "border-purple-700"
      };
    case "blue":
      return {
        background: "bg-blue-900",
        text: "text-white",
        subtext: "text-blue-200",
        border: "border-blue-700"
      };
    case "light":
    default:
      return {
        background: "bg-white",
        text: "text-black",
        subtext: "text-gray-500",
        border: "border-gray-200"
      };
  }
};
