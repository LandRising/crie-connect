
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProfileData } from "@/types/profile";

type ShareButtonProps = {
  profile: ProfileData;
  themeTextColor: string;
};

export const ShareButton = ({ profile, themeTextColor }: ShareButtonProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.full_name || profile.username} - CRIE Connect`,
          text: `Confira o perfil de ${profile.full_name || profile.username} no CRIE Connect!`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          description: "Link copiado para a área de transferência!",
        });
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 bg-white/50 backdrop-blur-sm hover:bg-white/70 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
        >
          <Share2 size={18} className={themeTextColor} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end" alignOffset={0} sideOffset={5}>
        <div className="flex flex-col gap-1">
          <Button 
            variant="ghost" 
            className="justify-start text-sm" 
            onClick={handleShare}
          >
            Compartilhar perfil
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start text-sm" 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({
                description: "Link copiado para a área de transferência!",
              });
            }}
          >
            Copiar link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
