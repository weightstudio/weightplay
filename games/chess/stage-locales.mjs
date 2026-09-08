// Short Stage labels are distinct from the complete tactical objective.
const rows = {
 en: ['Stage', 'Ready', 'Locked', 'Cleared'],
 'zh-Hant': ['關卡', '可挑戰', '未解鎖', '已完成'],
 'zh-Hans': ['关卡', '可挑战', '未解锁', '已完成'],
 ja: ['ステージ', '挑戦可能', '未解放', 'クリア済み'],
 ko: ['스테이지', '도전 가능', '잠김', '완료'],
 es: ['Nivel', 'Disponible', 'Bloqueado', 'Superado'],
 'pt-BR': ['Fase', 'Disponível', 'Bloqueada', 'Concluída'],
 fr: ['Niveau', 'Disponible', 'Verrouillé', 'Terminé'],
 de: ['Aufgabe', 'Verfügbar', 'Gesperrt', 'Gelöst'],
 it: ['Livello', 'Disponibile', 'Bloccato', 'Completato'],
 ru: ['Уровень', 'Доступен', 'Закрыт', 'Пройден'],
 hi: ['चरण', 'उपलब्ध', 'बंद', 'पूरा'],
 ar: ['المرحلة', 'متاحة', 'مقفلة', 'مكتملة'],
};
export const stageLocales = Object.fromEntries(Object.entries(rows).map(([locale, row]) => {
 if (row.length !== 4 || row.some(value => !value?.trim())) throw Error(`Incomplete Stage locale: ${locale}`);
 return [locale, Object.fromEntries(['stage', 'ready', 'locked', 'cleared'].map((key, index) => [key, row[index]]))];
}));
