import { useState, useCallback } from 'react';

export function useCurrencyMask(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const formatCurrency = useCallback((input: string) => {
    let numericValue = input.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
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

  const getNumericValue = useCallback(() => {
    if (value === '') return 0;
    const numericString = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(numericString);
  }, [value]);

  const setFormattedValue = useCallback((numericValue: number) => {
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
