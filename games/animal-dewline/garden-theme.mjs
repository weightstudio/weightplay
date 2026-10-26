// Standalone model for the optional permanent Dewline board appearance.
// A purchase is made only when the integrating UI calls purchase() after the
// player's confirmation. This module never alters puzzles or awards currency.
export const SKU = 'animal-dewline:moonlit-garden-v1';
export const COST = 5;
export const PREFERENCE_KEY = 'weightplay-animal-dewline-garden-theme-v1';
export const DIAMOND_ASSET = '/assets/weightplay-diamond.svg';

const keys=['title','open','description','balance','price','permanent','buy','cancel','owned','classic','moonlight','selected','insufficient','unavailable','error','preferenceTemporary','preview','apply','confirm','confirmQuestion','purchased','unconfirmed','busy','currency'];
const rows={
  en:['Moonlit garden','Garden appearance','A decorative moonlit board. Puzzle rules and targets stay the same.','Balance: {balance}','Price: {cost}','Permanent appearance','Unlock','Cancel','Owned','Original garden','Moonlit garden','Selected','Not enough diamonds.','Wallet unavailable.','Could not complete the purchase. Try again.','Appearance is active for this page; the choice could not be saved.','Preview appearance'],
  'zh-Hant':['月光花園','花園外觀','裝飾性的月光棋盤，謎題規則與目標不變。','餘額：{balance}','價格：{cost}','永久外觀','解鎖','取消','已擁有','原本花園','月光花園','已選用','鑽石不足。','錢包暫時無法使用。','無法完成購買，請再試一次。','外觀已在此頁面生效，但無法儲存選擇。','預覽外觀'],
  'zh-Hans':['月光花园','花园外观','装饰性的月光棋盘，谜题规则与目标不变。','余额：{balance}','价格：{cost}','永久外观','解锁','取消','已拥有','原有花园','月光花园','已选用','钻石不足。','钱包暂时无法使用。','无法完成购买，请再试一次。','外观已在此页面生效，但无法保存选择。','预览外观'],
  ja:['月光の庭','庭の見た目','月明かりの装飾です。パズルのルールや目標は変わりません。','残高：{balance}','価格：{cost}','永久の見た目','解放','キャンセル','所有済み','元の庭','月光の庭','選択中','ダイヤが足りません。','ウォレットを利用できません。','購入できませんでした。もう一度お試しください。','このページでは見た目を適用しましたが、選択を保存できませんでした。','見た目をプレビュー'],
  ko:['달빛 정원','정원 꾸미기','달빛 장식만 바뀌며 퍼즐 규칙과 목표는 그대로예요.','잔액: {balance}','가격: {cost}','영구 외관','잠금 해제','취소','보유 중','기본 정원','달빛 정원','선택됨','다이아가 부족해요.','지갑을 사용할 수 없어요.','구매하지 못했어요. 다시 시도해 주세요.','이 페이지에 외관을 적용했지만 선택을 저장하지 못했어요.','외관 미리보기'],
  es:['Jardín de luna','Aspecto del jardín','Un tablero decorado con luz de luna. Las reglas y los objetivos no cambian.','Saldo: {balance}','Precio: {cost}','Aspecto permanente','Desbloquear','Cancelar','Adquirido','Jardín original','Jardín de luna','Seleccionado','No tienes suficientes diamantes.','La cartera no está disponible.','No se pudo completar la compra. Inténtalo de nuevo.','El aspecto está activo en esta página, pero no se pudo guardar la elección.','Ver aspecto'],
  'pt-BR':['Jardim ao luar','Visual do jardim','Um tabuleiro decorado ao luar. As regras e os objetivos não mudam.','Saldo: {balance}','Preço: {cost}','Visual permanente','Desbloquear','Cancelar','Adquirido','Jardim original','Jardim ao luar','Selecionado','Diamantes insuficientes.','Carteira indisponível.','Não foi possível concluir a compra. Tente novamente.','O visual está ativo nesta página, mas a escolha não pôde ser salva.','Ver visual'],
  fr:['Jardin au clair de lune','Apparence du jardin','Un plateau décoré au clair de lune. Les règles et les objectifs restent identiques.','Solde : {balance}','Prix : {cost}','Apparence permanente','Débloquer','Annuler','Obtenu','Jardin original','Jardin au clair de lune','Sélectionné','Diamants insuffisants.','Portefeuille indisponible.','Achat impossible. Réessayez.','L’apparence est active sur cette page, mais le choix n’a pas pu être enregistré.','Voir l’apparence'],
  de:['Mondscheingarten','Gartendesign','Ein dekoratives Mondscheinbrett. Regeln und Ziele bleiben gleich.','Guthaben: {balance}','Preis: {cost}','Dauerhaftes Design','Freischalten','Abbrechen','Im Besitz','Ursprünglicher Garten','Mondscheingarten','Ausgewählt','Nicht genügend Diamanten.','Geldbörse nicht verfügbar.','Der Kauf konnte nicht abgeschlossen werden. Versuche es erneut.','Das Design ist auf dieser Seite aktiv, aber die Auswahl konnte nicht gespeichert werden.','Design ansehen'],
  it:['Giardino al chiaro di luna','Aspetto del giardino','Un tabellone decorativo al chiaro di luna. Regole e obiettivi restano invariati.','Saldo: {balance}','Prezzo: {cost}','Aspetto permanente','Sblocca','Annulla','Acquistato','Giardino originale','Giardino al chiaro di luna','Selezionato','Diamanti insufficienti.','Portafoglio non disponibile.','Impossibile completare l’acquisto. Riprova.','L’aspetto è attivo in questa pagina, ma la scelta non è stata salvata.','Anteprima aspetto'],
  ru:['Лунный сад','Оформление сада','Декоративное поле при лунном свете. Правила и цели головоломки не меняются.','Баланс: {balance}','Цена: {cost}','Постоянное оформление','Открыть','Отмена','Получено','Обычный сад','Лунный сад','Выбрано','Недостаточно алмазов.','Кошелёк недоступен.','Не удалось завершить покупку. Попробуйте снова.','Оформление действует на этой странице, но выбор не удалось сохранить.','Посмотреть оформление'],
  hi:['चाँदनी का बगीचा','बगीचे की सजावट','चाँदनी वाला सजावटी बोर्ड। पहेली के नियम और लक्ष्य नहीं बदलते।','शेष: {balance}','कीमत: {cost}','स्थायी सजावट','अनलॉक करें','रद्द करें','आपके पास है','मूल बगीचा','चाँदनी का बगीचा','चुना गया','हीरे पर्याप्त नहीं हैं।','वॉलेट उपलब्ध नहीं है।','खरीद पूरी नहीं हुई। फिर कोशिश करें।','सजावट इस पेज पर लगी है, लेकिन चुनाव सहेजा नहीं जा सका।','सजावट देखें'],
  ar:['حديقة ضوء القمر','مظهر الحديقة','لوحة مزينة بضوء القمر. تبقى قواعد الأحجية وأهدافها كما هي.','الرصيد: {balance}','السعر: {cost}','مظهر دائم','فتح','إلغاء','مملوك','الحديقة الأصلية','حديقة ضوء القمر','محدد','الألماس غير كافٍ.','المحفظة غير متاحة.','تعذّر إتمام الشراء. حاول مجددًا.','المظهر مفعّل في هذه الصفحة، لكن تعذّر حفظ الاختيار.','معاينة المظهر'],
};
const extra={
  en:['Use appearance','Confirm purchase','Unlock this permanent appearance for {cost} diamonds?','Unlocked and selected.','Purchase could not be confirmed. Check your wallet before retrying.','Purchase in progress.'],
  'zh-Hant':['使用此外觀','確認購買','要花費 {cost} 顆鑽石解鎖永久外觀嗎？','已解鎖並選用。','無法確認購買結果，請先查看錢包再重試。','正在處理購買。'],
  'zh-Hans':['使用此外观','确认购买','要花费 {cost} 颗钻石解锁永久外观吗？','已解锁并选用。','无法确认购买结果，请先查看钱包再重试。','正在处理购买。'],
  ja:['この見た目を使う','購入を確認','ダイヤ {cost} 個で永久の見た目を解放しますか？','解放して選択しました。','購入結果を確認できません。再試行の前にウォレットを確認してください。','購入を処理中です。'],
  ko:['이 외관 사용','구매 확인','다이아 {cost}개로 영구 외관을 잠금 해제할까요?','잠금을 해제하고 선택했어요.','구매 결과를 확인할 수 없어요. 다시 시도하기 전에 지갑을 확인해 주세요.','구매를 처리 중이에요.'],
  es:['Usar aspecto','Confirmar compra','¿Desbloquear este aspecto permanente por {cost} diamantes?','Desbloqueado y seleccionado.','No se pudo confirmar la compra. Revisa la cartera antes de reintentar.','Compra en curso.'],
  'pt-BR':['Usar visual','Confirmar compra','Desbloquear este visual permanente por {cost} diamantes?','Desbloqueado e selecionado.','Não foi possível confirmar a compra. Confira a carteira antes de tentar novamente.','Compra em andamento.'],
  fr:['Utiliser cette apparence','Confirmer l’achat','Débloquer cette apparence permanente pour {cost} diamants ?','Débloquée et sélectionnée.','Achat non confirmé. Vérifiez le portefeuille avant de réessayer.','Achat en cours.'],
  de:['Design verwenden','Kauf bestätigen','Dieses dauerhafte Design für {cost} Diamanten freischalten?','Freigeschaltet und ausgewählt.','Der Kauf konnte nicht bestätigt werden. Prüfe vor einem erneuten Versuch die Geldbörse.','Kauf wird verarbeitet.'],
  it:['Usa aspetto','Conferma acquisto','Sbloccare questo aspetto permanente per {cost} diamanti?','Sbloccato e selezionato.','Acquisto non confermato. Controlla il portafoglio prima di riprovare.','Acquisto in corso.'],
  ru:['Использовать оформление','Подтвердить покупку','Открыть постоянное оформление за {cost} алмазов?','Оформление открыто и выбрано.','Не удалось подтвердить покупку. Проверьте кошелёк перед повторной попыткой.','Покупка обрабатывается.'],
  hi:['यह सजावट लगाएँ','खरीद पक्की करें','क्या {cost} हीरों में यह स्थायी सजावट अनलॉक करें?','अनलॉक करके चुन लिया।','खरीद की पुष्टि नहीं हो सकी। दोबारा कोशिश करने से पहले वॉलेट जाँचें।','खरीद जारी है।'],
  ar:['استخدام المظهر','تأكيد الشراء','هل تريد فتح هذا المظهر الدائم مقابل {cost} ألماسات؟','تم فتح المظهر واختياره.','تعذّر تأكيد الشراء. تحقّق من المحفظة قبل إعادة المحاولة.','جارٍ تنفيذ الشراء.'],
};
for(const locale of Object.keys(rows)) rows[locale].push(...extra[locale]);
const currencies={en:'diamonds','zh-Hant':'顆鑽石','zh-Hans':'颗钻石',ja:'ダイヤ',ko:'다이아',es:'diamantes','pt-BR':'diamantes',fr:'diamants',de:'Diamanten',it:'diamanti',ru:'алмазов',hi:'हीरे',ar:'ألماس'};
for(const locale of Object.keys(rows)) rows[locale].push(currencies[locale]);
export const locales=Object.freeze(Object.fromEntries(Object.entries(rows).map(([locale,values])=>{
  if(values.length!==keys.length)throw new Error(`INCOMPLETE_GARDEN_THEME_COPY:${locale}`);
  return [locale,Object.freeze(Object.fromEntries(keys.map((key,index)=>[key,values[index]])))];
})));
export function format(locale,key,vars={}) {
  const message=locales[locale]?.[key];
  if(typeof message!=='string')throw new Error('MISSING_GARDEN_THEME_COPY');
  return message.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g,(_whole,name)=>{
    if(!Object.hasOwn(vars,name))throw new Error(`MISSING_GARDEN_THEME_VARIABLE:${name}`);
    const value=String(vars[name]);return locale==='ar'?`\u2068${value}\u2069`:value;
  });
}

export function createGardenThemeController({wallet, storage, onChange=()=>{}}={}) {
  let selectionOverride=null, pending=null;
  const accessWallet=()=>{try{return wallet ?? globalThis.WeightPlayWallet ?? null;}catch(_){return null;}};
  const accessStorage=()=>{try{return storage ?? globalThis.localStorage ?? null;}catch(_){return null;}};
  const persistedSelection=()=>{try{const value=accessStorage()?.getItem(PREFERENCE_KEY);return value==='classic'||value==='moonlight'?value:null;}catch(_){return null;}};
  const read=()=>{
    const source=accessWallet();let data;
    try { data=source?.read?.(); } catch (_) { data=null; }
    if (!data?.available || !Number.isSafeInteger(data.diamonds) || data.diamonds<0 || !data.purchases || typeof data.purchases!=='object')
      return {available:false,balance:null,owned:null,selected:'classic',pending:Boolean(pending)};
    const receipt=data.purchases[SKU], owned=Boolean(receipt && receipt.sku===SKU && receipt.version===1);
    const selected=owned ? (selectionOverride ?? persistedSelection() ?? 'moonlight') : 'classic';
    return {available:true,balance:data.diamonds,owned,selected,pending:Boolean(pending)};
  };
  const notify=()=>{const state=read();try{onChange(state);}catch(_){/* Presentation is not a wallet transaction. */}return state;};
  const saveSelection=value=>{
    selectionOverride=value;
    try {const target=accessStorage();if(!target) return false;target.setItem(PREFERENCE_KEY,value);return target.getItem(PREFERENCE_KEY)===value;}
    catch(_){return false;}
  };
  const select=value=>{
    if(!['classic','moonlight'].includes(value))return {ok:false,reason:'invalid',state:read()};
    if(pending)return {ok:false,reason:'busy',state:read()};
    const before=read();
    if(value==='moonlight' && !before.available)return {ok:false,reason:'unavailable',state:before};
    if(value==='moonlight' && !before.owned)return {ok:false,reason:'not_owned',state:before};
    const saved=saveSelection(value);return {ok:true,saved,state:notify()};
  };
  const purchase=()=>{
    if(pending)return pending;
    const before=read(), source=accessWallet();
    if(!before.available || typeof source?.purchasePermanent!=='function')return Promise.resolve({ok:false,reason:'unavailable',state:before});
    if(before.owned)return Promise.resolve({ok:true,alreadyOwned:true,state:before});
    pending=(async()=>{
      let result;
      try {result=await source.purchasePermanent(SKU,COST);}catch(_){result={ok:false,reason:'storage'};}
      if(!result?.ok)return {ok:false,reason:result?.reason==='insufficient'?'insufficient':'storage',state:read()};
      const verified=read();
      if(!verified.available || !verified.owned || result.receipt?.sku!==SKU)
        return {ok:false,reason:'unconfirmed',state:verified};
      const saved=saveSelection('moonlight');
      return {ok:true,alreadyOwned:Boolean(result.alreadyOwned),saved,state:read()};
    })().then(result=>{pending=null;return {...result,state:notify()};},error=>{
      pending=null;notify();throw error;
    });
    notify();return pending;
  };
  return Object.freeze({read,refresh:notify,select,purchase});
}
