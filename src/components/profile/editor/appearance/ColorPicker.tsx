
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Paintbrush } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-1">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <div className="flex items-center gap-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div 
              className="h-8 w-8 rounded-full border overflow-hidden cursor-pointer relative"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/10 transition-opacity">
                <Paintbrush className="h-4 w-4 text-white drop-shadow-sm" />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-2">
              <div className="flex">
                <div className="flex-1 space-y-1">
                  <div className="h-24 rounded-md border mb-2" style={{ background: color }} />
                  <div className="grid grid-cols-5 gap-2">
                    {['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA69E', '#861657', 
                      '#FFFCF9', '#5D737E', '#64B6AC', '#C0FDFB', '#DAFFEF',
                      '#011627', '#FDFFFC', '#2EC4B6', '#E71D36', '#FF9F1C'].map((presetColor) => (
                      <div 
                        key={presetColor}
                        className={`h-6 w-6 rounded-md cursor-pointer border ${color === presetColor ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => onChange(presetColor)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  id="colorInput"
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="w-10 h-10 p-0 border-0"
                />
                <Input 
                  type="text" 
                  value={color} 
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#000000"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text" 
          value={color} 
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          pattern="^#[0-9A-Fa-f]{6}$"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};
