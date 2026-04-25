/**
 * Calcula la plusvalía estimada comparada con la inflación.
 * @param initialValue Valor inicial de la propiedad.
 * @param appreciationRate Tasa de apreciación anual (%).
 * @param inflationRate Tasa de inflación anual (%).
 * @param years Número de años.
 * @returns Un objeto con el valor final, valor ajustado y ganancia real.
 */
export const calculatePlusvalia = (
  initialValue: number,
  appreciationRate: number,
  inflationRate: number,
  years: number
) => {
  const finalValue = initialValue * Math.pow(1 + appreciationRate / 100, years);
  const inflationAdjustedValue = initialValue * Math.pow(1 + inflationRate / 100, years);
  const realGain = finalValue - inflationAdjustedValue;

  return {
    finalValue: Math.round(finalValue),
    inflationAdjustedValue: Math.round(inflationAdjustedValue),
    realGain: Math.round(realGain),
    percentageIncrease: ((finalValue - initialValue) / initialValue) * 100,
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
};
