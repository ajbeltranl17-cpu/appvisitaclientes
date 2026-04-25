import React from 'react';
import { calculatePlusvalia, formatCurrency } from '../../utils/finance';
import { Button } from '../../components/ui/Button';

export const Calculator: React.FC = () => {
  const [value, setValue] = React.useState(3500000);
  const [years, setYears] = React.useState(5);
  
  const results = React.useMemo(() => {
    return calculatePlusvalia(value, 8.5, 4.5, years);
  }, [value, years]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-xl font-bold text-[#1A3651] border-b-2 border-[#C5A059] pb-2 w-fit">
        Calculadora de Plusvalía
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor de la Propiedad (MXN)</label>
          <input 
            type="range" 
            min="1000000" 
            max="15000000" 
            step="100000"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
          />
          <p className="text-right font-bold text-[#1A3651] mt-1">{formatCurrency(value)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (Años)</label>
          <div className="flex gap-2">
            {[1, 3, 5, 10].map(yr => (
              <button 
                key={yr}
                onClick={() => setYears(yr)}
                className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
                  years === yr ? 'bg-[#1A3651] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {yr} {yr === 1 ? 'Añ' : 'Años'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-bold">Plusvalía Estimada</p>
          <p className="text-lg font-bold text-[#C5A059]">{formatCurrency(results.finalValue)}</p>
        </div>
        <div className="p-3 bg-[#1A3651]/5 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-bold">Ganancia Real</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(results.realGain)}</p>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 italic">
        * Estimaciones basadas en una tasa de plusvalía del 8.5% anual y una inflación del 4.5% anual.
      </p>
    </div>
  );
};
