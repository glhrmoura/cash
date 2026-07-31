import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconName } from 'lucide-react/dynamic';
import { Expense } from '@/types/expense';
import { ColorPicker } from '@/components/ColorPicker';
import { IconPicker } from '@/components/IconPicker';
import { useCurrencyMask } from '@/hooks/use-currency-mask';
import { blockPointerEvents, blurActiveElement, waitForKeyboardClose } from '@/utils/ios-keyboard';

interface AddExpenseDialogProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  trigger?: React.ReactNode;
}

export function AddExpenseDialog({ onAddExpense, trigger }: AddExpenseDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { value, handleChange, getNumericValue, setFormattedValue } = useCurrencyMask();
  const [selectedIcon, setSelectedIcon] = useState<IconName>('droplets');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const resetForm = () => {
    setTitle('');
    setFormattedValue(null);
    setSelectedIcon('droplets');
    setSelectedColor('#3B82F6');
  };

  const closeSafely = async (afterBlur?: () => void) => {
    if (closing) return;
    setClosing(true);
    blurActiveElement();
    afterBlur?.();
    await waitForKeyboardClose();
    blockPointerEvents();
    setOpen(false);
    setClosing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || closing) return;

    const newExpense: Omit<Expense, 'id' | 'userId'> = {
      title: title.trim(),
      value: getNumericValue(),
      color: selectedColor,
      icon: selectedIcon,
      createdAt: new Date().toISOString(),
      done: [],
    };

    await closeSafely(() => {
      onAddExpense(newExpense);
      resetForm();
    });
  };

  return (
    <>
      <div
        onClick={() => {
          setClosing(false);
          setOpen(true);
        }}
      >
        {trigger ?? (
          <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary shadow-lg transition-shadow hover:shadow-xl">
            <Plus className="h-6 w-6 text-black" />
          </div>
        )}
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                void closeSafely();
              }
            }}
          >
            <div className="flex h-[min(80dvh,40rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold tracking-tight">{t('expenseForm.addTitle')}</h2>
                <button
                  type="button"
                  onClick={() => void closeSafely()}
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  aria-label={t('expenseForm.cancel')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="space-y-4 flex-1 overflow-y-auto py-4">
                  <div className="space-y-2 px-6">
                    <Label htmlFor="title">{t('expenseForm.name')}</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t('expenseForm.namePlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2 px-6">
                    <Label htmlFor="value">{t('expenseForm.value')}</Label>
                    <Input
                      id="value"
                      type="text"
                      inputMode="decimal"
                      value={value}
                      onChange={(e) => handleChange(e.target.value)}
                      placeholder={t('expenseForm.valuePlaceholder')}
                    />
                  </div>
                  <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
                  <IconPicker
                    selectedIcon={selectedIcon}
                    onIconChange={setSelectedIcon}
                    selectedColor={selectedColor}
                  />
                </div>
                <div className="flex gap-2 border-t border-border p-6 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void closeSafely()}
                    className="flex-1"
                    disabled={closing}
                  >
                    {t('expenseForm.cancel')}
                  </Button>
                  <Button type="submit" className="flex-1" disabled={closing}>
                    {t('expenseForm.add')}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
