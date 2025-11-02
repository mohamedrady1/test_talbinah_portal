export function getTextByLang(item: any, currentLang: string): string {
    return currentLang === 'ar' ? item?.textAr : item?.textEn;
}
export function getSubTextByLang(item: any, currentLang: string): string {
    return currentLang === 'ar' ? item?.subTextAr : item?.subTextEn;
}
