
export const getButtonStyles = (buttonStyle: string) => {
  switch (buttonStyle) {
    case "outline":
      return "bg-transparent border-2 border-black text-black hover:bg-gray-100";
    case "rounded":
      return "bg-black text-white rounded-full hover:bg-gray-800";
    case "default":
    default:
      return "bg-black text-white hover:bg-gray-800";
  }
};

export const getThemeStyles = (theme: string) => {
  if (theme === "dark") {
    return {
      background: "bg-gray-900",
      text: "text-white",
      subtext: "text-gray-300"
    };
  }
  return {
    background: "bg-white",
    text: "text-black",
    subtext: "text-gray-500"
  };
};
