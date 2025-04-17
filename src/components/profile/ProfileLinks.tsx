
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileLink } from "@/types/profile";
import { registerLinkClick } from "@/hooks/useRegisterLinkClick";

type ProfileLinksProps = {
  links: ProfileLink[];
  buttonStyle: string;
  getButtonStyles: (buttonStyle: string) => string;
  buttonColor?: string;
  profileId?: string;
  compact?: boolean; // Added compact prop
};

export const ProfileLinks = ({ 
  links, 
  buttonStyle, 
  getButtonStyles, 
  buttonColor,
  profileId = "",
  compact = false // Default value
}: ProfileLinksProps) => {
  if (links.length === 0) {
    return <p className="text-center text-gray-500">Nenhum link disponível</p>;
  }

  // Estilo personalizado para a cor do botão, se fornecido
  const customColor = buttonColor ? { 
    backgroundColor: buttonStyle === 'outline' ? 'transparent' : buttonColor,
    color: buttonStyle === 'outline' ? buttonColor : '#ffffff',
    borderColor: buttonColor
  } : {};

  const handleClick = (linkId: string) => {
    if (profileId) {
      registerLinkClick(linkId, profileId);
    }
  };

  // Apply compact styling if enabled
  const buttonPadding = compact ? "py-2 px-4" : "py-4 px-6";

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
          onClick={() => handleClick(link.id)}
        >
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-auto text-base font-medium",
              buttonPadding, // Apply dynamic padding
              getButtonStyles(buttonStyle)
            )}
            style={customColor}
          >
            {link.title}
            <ExternalLink size={18} />
          </Button>
        </a>
      ))}
    </div>
  );
};
