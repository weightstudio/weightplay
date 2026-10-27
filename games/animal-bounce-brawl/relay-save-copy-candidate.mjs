// Candidate only: a lost acknowledgement may still mean the write succeeded.
// This warning does not claim anything about the separate Castle receipt.
const copy=Object.freeze({
  en:'Could not confirm saving Stage {stage}. Leaving or reloading may lose unconfirmed progress.',
  'zh-Hant':'無法確認第 {stage} 關是否已儲存。離開或重新載入可能失去未確認的進度。',
  'zh-Hans':'无法确认第 {stage} 关是否已保存。离开或重新加载可能丢失未确认的进度。',
  ja:'ステージ {stage} の保存を確認できません。終了や再読み込みで未確認の進行が失われる場合があります。',
  ko:'스테이지 {stage} 저장 여부를 확인할 수 없습니다. 나가거나 새로고침하면 확인되지 않은 진행 상황이 사라질 수 있습니다.',
  es:'No se pudo confirmar el guardado de la fase {stage}. Al salir o recargar podrías perder el progreso no confirmado.',
  'pt-BR':'Não foi possível confirmar o salvamento da fase {stage}. Ao sair ou recarregar, o progresso não confirmado pode ser perdido.',
  fr:'Impossible de confirmer la sauvegarde du niveau {stage}. Quitter ou recharger peut faire perdre la progression non confirmée.',
  de:'Das Speichern von Stufe {stage} konnte nicht bestätigt werden. Beim Verlassen oder Neuladen kann unbestätigter Fortschritt verloren gehen.',
  it:'Impossibile confermare il salvataggio del livello {stage}. Uscendo o ricaricando potresti perdere i progressi non confermati.',
  ru:'Не удалось подтвердить сохранение уровня {stage}. При выходе или перезагрузке неподтверждённый прогресс может быть потерян.',
  hi:'चरण {stage} का सहेजा जाना पक्का नहीं हुआ। बाहर जाने या दोबारा लोड करने पर अपुष्ट प्रगति खो सकती है।',
  ar:'تعذّر تأكيد حفظ المرحلة {stage}. قد تفقد التقدم غير المؤكد عند المغادرة أو إعادة التحميل.'
});
export function relaySaveWarning(locale,stage){
  if(!Number.isSafeInteger(stage)||stage<1||stage>60)throw new RangeError('invalid stage');
  // Isolate the number so RTL text does not reorder adjacent punctuation.
  return (copy[locale]||copy.en).replace('{stage}',`\u2066${stage}\u2069`);
}
export const RELAY_SAVE_WARNING_LOCALES=Object.freeze(Object.keys(copy));
