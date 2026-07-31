import { useState, useCallback } from 'react';

export function useCurrencyMask(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const formatCurrency = useCallback((input: string) => {
    const numericValue = input.replace(/\D/g, '');

    if (numericValue === '' || parseInt(numericValue, 10) === 0) return '';

    const number = parseInt(numericValue, 10) / 100;

    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const handleChange = useCallback((inputValue: string) => {
    const formatted = formatCurrency(inputValue);
    setValue(formatted);
  }, [formatCurrency]);

  const getNumericValue = useCallback((): number | null => {
    if (value === '') return null;
    const numericString = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(numericString);
    if (!Number.isFinite(parsed) || parsed === 0) return null;
    return parsed;
  }, [value]);

  const setFormattedValue = useCallback((numericValue: number | null) => {
    if (numericValue == null || numericValue === 0) {
      setValue('');
      return;
    }

    const formatted = numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValue(formatted);
  }, []);

  return {
    value,
    handleChange,
    getNumericValue,
    setFormattedValue,
  };
}
