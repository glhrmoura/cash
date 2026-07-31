import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpenseItemProps {
  id: string;
  title: string;
  value: number | null;
  color: string;
  icon: IconName;
  isPaid: boolean;
  onTogglePaid: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpenseItem({
  id,
  title,
  value,
  color,
  icon,
  isPaid,
  onTogglePaid,
  onEdit,
  onDelete,
}: ExpenseItemProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button')) {
      onTogglePaid(id);
    }
  };

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all duration-200',
        isPaid 
          ? 'bg-muted/50 border-muted opacity-60 border-l-8 border-l-primary' 
          : 'bg-expense-unpaid hover:border-primary'
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              isPaid && 'opacity-50'
            )}
            style={{ backgroundColor: color }}
          >
            <DynamicIcon name={icon} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={cn(
              'font-semibold',
              isPaid ? 'text-muted-foreground line-through' : 'text-foreground'
            )}>
              {title}
            </h3>
            {value != null && (
              <p className={cn(
                'text-sm',
                isPaid ? 'text-muted-foreground' : 'text-muted-foreground'
              )}>
                R$ {value.toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            className={cn(
              'h-8 w-8 p-0',
              isPaid 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-accent'
            )}
            disabled={isPaid}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className={cn(
              'h-8 w-8 p-0',
              isPaid 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-destructive/10 hover:text-destructive'
            )}
            disabled={isPaid}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}