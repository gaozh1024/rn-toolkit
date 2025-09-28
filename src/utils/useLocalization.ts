// import { useState, useEffect } from 'react';
// import LocalizationService, { LocalizationData } from './LocalizationService';

// export interface UseLocalizationResult {
//   localizationData: LocalizationData;
//   currentLanguage: string;
//   currentCountry: string;
//   isRTL: boolean;
//   formatNumber: (number: number) => string;
//   formatCurrency: (amount: number, currencyCode?: string) => string;
//   formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
//   formatTime: (date: Date) => string;
// }

// /**
//  * 本地化 Hook
//  */
// export function useLocalization(): UseLocalizationResult {
//   const [localizationData, setLocalizationData] = useState<LocalizationData>(
//     LocalizationService.getLocalizationData()
//   );

//   useEffect(() => {
//     const handleChange = () => {
//       setLocalizationData(LocalizationService.getLocalizationData());
//     };

//     LocalizationService.addChangeListener(handleChange);

//     return () => {
//       LocalizationService.removeChangeListener(handleChange);
//     };
//   }, []);

//   return {
//     localizationData,
//     currentLanguage: LocalizationService.getCurrentLanguageCode(),
//     currentCountry: LocalizationService.getCurrentCountryCode(),
//     isRTL: LocalizationService.isRTL(),
//     formatNumber: LocalizationService.formatNumber,
//     formatCurrency: LocalizationService.formatCurrency,
//     formatDate: LocalizationService.formatDate,
//     formatTime: LocalizationService.formatTime,
//   };
// }

// export default useLocalization;