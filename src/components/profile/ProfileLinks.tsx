
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileLink } from "@/types/profile";

type ProfileLinksProps = {
  links: ProfileLink[];
  buttonStyle: string;
  getButtonStyles: (buttonStyle: string) => string;
};

export const ProfileLinks = ({ links, buttonStyle, getButtonStyles }: ProfileLinksProps) => {
  if (links.length === 0) {
    return <p className="text-center text-gray-500">Nenhum link disponível</p>;
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-auto py-4 px-6 text-base font-medium",
              getButtonStyles(buttonStyle)
            )}
          >
            {link.title}
            <ExternalLink size={18} />
          </Button>
        </a>
      ))}
    </div>
  );
};
