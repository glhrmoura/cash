import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface IconPickerProps {
  selectedIcon: IconName;
  onIconChange: (icon: IconName) => void;
  selectedColor: string;
  label?: string;
}

const iconOptions: { icon: IconName; name: string }[] = [
  { icon: 'droplets', name: 'Água' },
  { icon: 'zap', name: 'Energia' },
  { icon: 'wifi', name: 'Internet' },
  { icon: 'car', name: 'Transporte' },
  { icon: 'shopping-cart', name: 'Compras' },
  { icon: 'phone', name: 'Telefone' },
  { icon: 'home', name: 'Casa' },
  { icon: 'utensils', name: 'Alimentação' },
  { icon: 'graduation-cap', name: 'Educação' },
  { icon: 'heart', name: 'Saúde' },
  { icon: 'building', name: 'Trabalho' },
  { icon: 'credit-card', name: 'Cartão' },
  { icon: 'gamepad-2', name: 'Entretenimento' },
  { icon: 'music', name: 'Música' },
  { icon: 'shirt', name: 'Roupas' },
  { icon: 'book', name: 'Livros' },
  { icon: 'coffee', name: 'Café' },
  { icon: 'pizza', name: 'Comida' },
  { icon: 'beer', name: 'Bebidas' },
  { icon: 'cigarette', name: 'Tabaco' },
  { icon: 'pill', name: 'Medicamentos' },
  { icon: 'gift', name: 'Presentes' },
  { icon: 'plane', name: 'Viagem' },
  { icon: 'hotel', name: 'Hospedagem' },
  { icon: 'camera', name: 'Fotografia' },
  { icon: 'gamepad', name: 'Jogos' },
  { icon: 'tv', name: 'TV/Streaming' },
  { icon: 'headphones', name: 'Áudio' },
  { icon: 'laptop', name: 'Tecnologia' },
  { icon: 'smartphone', name: 'Celular' },
  { icon: 'watch', name: 'Relógio' },
  { icon: 'glasses', name: 'Óculos' },
  { icon: 'dumbbell', name: 'Academia' },
  { icon: 'bike', name: 'Bicicleta' },
  { icon: 'dog', name: 'Pet' },
  { icon: 'flower', name: 'Plantas' },
  { icon: 'hammer', name: 'Ferramentas' },
  { icon: 'wrench', name: 'Reparos' },
  { icon: 'paintbrush', name: 'Arte' },
  { icon: 'bookmark', name: 'Lazer' },
  { icon: 'star', name: 'Diversos' },
];

export function IconPicker({ selectedIcon, onIconChange, selectedColor, label = 'Ícone' }: IconPickerProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleIcons = showAll ? iconOptions : iconOptions.slice(0, 16);

  return (
    <div className="space-y-2 px-6">
      <Label>{label}</Label>
      <div className="grid grid-cols-4 gap-2">
        {visibleIcons.map((option, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onIconChange(option.icon)}
            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedIcon === option.icon 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: selectedColor }}>
              <DynamicIcon name={option.icon} className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>
      {iconOptions.length > 16 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-2 hover:bg-muted/30 hover:text-muted-foreground transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Ver mais
            </>
          )}
        </Button>
      )}
    </div>
  );
}
