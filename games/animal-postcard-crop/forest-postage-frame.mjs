// Unwired candidate: a permanent cosmetic only. The shared wallet receipt is
// the sole authority for ownership; the separate preference never grants it.
export const SKU = 'animal-postcard-crop:forest-postage-frame-v1';
export const COST = 5;
export const PREFERENCE_KEY = 'weightplay-animal-postcard-crop-frame-v1';
export const DIAMOND_ASSET = '/assets/weightplay-diamond.svg';

const keys = ['entry','title','description','balance','price','permanent','preview','buy','confirm',
  'confirmQuestion','cancel','owned','original','forest','selected','apply','insufficient',
  'unavailable','failed','unconfirmed','temporary','purchased','busy','currency'];
const rows = {
  en:['Frame appearance','Forest postage frame','A decorative frame for your postcards. Puzzle rules, moves and stars stay the same.','Balance: {balance}','Price: {cost}','Permanent appearance','Preview','Unlock','Confirm purchase','Unlock this permanent frame for {cost} diamonds?','Cancel','Owned','Original frame','Forest postage frame','Selected','Use frame','Not enough diamonds.','Wallet unavailable.','Purchase failed. Try again.','Purchase could not be confirmed. Check your wallet before retrying.','Frame active on this page; your choice could not be saved.','Frame unlocked and selected.','Purchase in progress.','diamonds'],
  'zh-Hant':['取景框外觀','林間郵票取景框','為明信片換上裝飾取景框，謎題規則、步數和星數不變。','餘額：{balance}','價格：{cost}','永久外觀','預覽','解鎖','確認購買','要花費 {cost} 顆鑽石解鎖永久取景框嗎？','取消','已擁有','原本取景框','林間郵票取景框','已選用','使用取景框','鑽石不足。','錢包暫時無法使用。','購買失敗，請再試一次。','無法確認購買結果，請先查看錢包再重試。','取景框已在此頁生效，但選擇無法儲存。','已解鎖並選用取景框。','正在處理購買。','顆鑽石'],
  'zh-Hans':['取景框外观','林间邮票取景框','为明信片换上装饰取景框，谜题规则、步数和星数不变。','余额：{balance}','价格：{cost}','永久外观','预览','解锁','确认购买','要花费 {cost} 颗钻石解锁永久取景框吗？','取消','已拥有','原有取景框','林间邮票取景框','已选用','使用取景框','钻石不足。','钱包暂时无法使用。','购买失败，请再试一次。','无法确认购买结果，请先查看钱包再重试。','取景框已在此页生效，但选择无法保存。','已解锁并选用取景框。','正在处理购买。','颗钻石'],
  ja:['フレームの見た目','森の切手フレーム','ポストカードを飾るフレームです。パズルのルール、手数、星は変わりません。','残高：{balance}','価格：{cost}','永久の見た目','プレビュー','解放','購入を確認','ダイヤ {cost} 個で永久フレームを解放しますか？','キャンセル','所有済み','元のフレーム','森の切手フレーム','選択中','フレームを使う','ダイヤが足りません。','ウォレットを利用できません。','購入できませんでした。もう一度お試しください。','購入結果を確認できません。再試行の前にウォレットを確認してください。','このページではフレームを使用していますが、選択を保存できませんでした。','フレームを解放して選択しました。','購入を処理中です。','ダイヤ'],
  ko:['프레임 꾸미기','숲속 우표 프레임','엽서를 꾸미는 프레임이에요. 퍼즐 규칙과 이동 수, 별은 바뀌지 않아요.','잔액: {balance}','가격: {cost}','영구 외관','미리보기','잠금 해제','구매 확인','다이아 {cost}개로 영구 프레임을 잠금 해제할까요?','취소','보유 중','기본 프레임','숲속 우표 프레임','선택됨','프레임 사용','다이아가 부족해요.','지갑을 사용할 수 없어요.','구매하지 못했어요. 다시 시도해 주세요.','구매 결과를 확인할 수 없어요. 다시 시도하기 전에 지갑을 확인해 주세요.','이 페이지에 프레임을 적용했지만 선택을 저장하지 못했어요.','프레임을 해제하고 선택했어요.','구매를 처리 중이에요.','다이아'],
  es:['Aspecto del marco','Marco de sello del bosque','Un marco decorativo para tus postales. Las reglas, los movimientos y las estrellas no cambian.','Saldo: {balance}','Precio: {cost}','Aspecto permanente','Vista previa','Desbloquear','Confirmar compra','¿Desbloquear este marco permanente por {cost} diamantes?','Cancelar','Adquirido','Marco original','Marco de sello del bosque','Seleccionado','Usar marco','No tienes suficientes diamantes.','La cartera no está disponible.','No se pudo completar la compra. Inténtalo de nuevo.','No se pudo confirmar la compra. Revisa la cartera antes de volver a intentarlo.','El marco está activo en esta página, pero no se pudo guardar la elección.','Marco desbloqueado y seleccionado.','Compra en curso.','diamantes'],
  'pt-BR':['Visual da moldura','Moldura de selo da floresta','Uma moldura decorativa para seus cartões. As regras, os movimentos e as estrelas não mudam.','Saldo: {balance}','Preço: {cost}','Visual permanente','Prévia','Desbloquear','Confirmar compra','Desbloquear esta moldura permanente por {cost} diamantes?','Cancelar','Adquirido','Moldura original','Moldura de selo da floresta','Selecionada','Usar moldura','Diamantes insuficientes.','Carteira indisponível.','Não foi possível concluir a compra. Tente novamente.','Não foi possível confirmar a compra. Confira a carteira antes de tentar novamente.','A moldura está ativa nesta página, mas a escolha não pôde ser salva.','Moldura desbloqueada e selecionada.','Compra em andamento.','diamantes'],
  fr:['Apparence du cadre','Cadre timbre forestier','Un cadre décoratif pour vos cartes. Les règles, les coups et les étoiles ne changent pas.','Solde : {balance}','Prix : {cost}','Apparence permanente','Aperçu','Débloquer','Confirmer l’achat','Débloquer ce cadre permanent pour {cost} diamants ?','Annuler','Obtenu','Cadre original','Cadre timbre forestier','Sélectionné','Utiliser ce cadre','Diamants insuffisants.','Portefeuille indisponible.','Achat impossible. Réessayez.','Achat non confirmé. Vérifiez le portefeuille avant de réessayer.','Le cadre est actif sur cette page, mais le choix n’a pas pu être enregistré.','Cadre débloqué et sélectionné.','Achat en cours.','diamants'],
  de:['Rahmendesign','Waldpost-Rahmen','Ein dekorativer Rahmen für deine Postkarten. Regeln, Züge und Sterne bleiben gleich.','Guthaben: {balance}','Preis: {cost}','Dauerhaftes Design','Vorschau','Freischalten','Kauf bestätigen','Diesen dauerhaften Rahmen für {cost} Diamanten freischalten?','Abbrechen','Im Besitz','Ursprünglicher Rahmen','Waldpost-Rahmen','Ausgewählt','Rahmen verwenden','Nicht genügend Diamanten.','Geldbörse nicht verfügbar.','Der Kauf ist fehlgeschlagen. Versuche es erneut.','Der Kauf konnte nicht bestätigt werden. Prüfe vor einem erneuten Versuch die Geldbörse.','Der Rahmen ist auf dieser Seite aktiv, aber die Auswahl konnte nicht gespeichert werden.','Rahmen freigeschaltet und ausgewählt.','Kauf wird verarbeitet.','Diamanten'],
  it:['Aspetto della cornice','Cornice francobollo del bosco','Una cornice decorativa per le cartoline. Regole, mosse e stelle non cambiano.','Saldo: {balance}','Prezzo: {cost}','Aspetto permanente','Anteprima','Sblocca','Conferma acquisto','Sbloccare questa cornice permanente per {cost} diamanti?','Annulla','Acquistata','Cornice originale','Cornice francobollo del bosco','Selezionata','Usa cornice','Diamanti insufficienti.','Portafoglio non disponibile.','Acquisto non riuscito. Riprova.','Acquisto non confermato. Controlla il portafoglio prima di riprovare.','La cornice è attiva in questa pagina, ma la scelta non è stata salvata.','Cornice sbloccata e selezionata.','Acquisto in corso.','diamanti'],
  ru:['Оформление рамки','Лесная почтовая рамка','Декоративная рамка для открыток. Правила, ходы и звёзды не меняются.','Баланс: {balance}','Цена: {cost}','Постоянное оформление','Предпросмотр','Открыть','Подтвердить покупку','Открыть постоянную рамку за {cost} алмазов?','Отмена','Получено','Обычная рамка','Лесная почтовая рамка','Выбрано','Использовать рамку','Недостаточно алмазов.','Кошелёк недоступен.','Не удалось завершить покупку. Попробуйте снова.','Не удалось подтвердить покупку. Проверьте кошелёк перед повторной попыткой.','Рамка действует на этой странице, но выбор не удалось сохранить.','Рамка открыта и выбрана.','Покупка обрабатывается.','алмазов'],
  hi:['फ्रेम की सजावट','वन डाक-टिकट फ्रेम','पोस्टकार्ड के लिए सजावटी फ्रेम। पहेली के नियम, चालें और सितारे नहीं बदलते।','शेष: {balance}','कीमत: {cost}','स्थायी सजावट','पूर्वावलोकन','अनलॉक करें','खरीद पक्की करें','क्या {cost} हीरों में यह स्थायी फ्रेम अनलॉक करें?','रद्द करें','आपके पास है','मूल फ्रेम','वन डाक-टिकट फ्रेम','चुना गया','फ्रेम लगाएँ','हीरे पर्याप्त नहीं हैं।','वॉलेट उपलब्ध नहीं है।','खरीद पूरी नहीं हुई। फिर कोशिश करें।','खरीद की पुष्टि नहीं हो सकी। दोबारा कोशिश करने से पहले वॉलेट जाँचें।','फ्रेम इस पेज पर लगा है, लेकिन चुनाव सहेजा नहीं जा सका।','फ्रेम अनलॉक करके चुन लिया।','खरीद जारी है।','हीरे'],
  ar:['مظهر الإطار','إطار طابع الغابة','إطار زخرفي لبطاقاتك. لا تتغير قواعد اللغز أو الحركات أو النجوم.','الرصيد: {balance}','السعر: {cost}','مظهر دائم','معاينة','فتح','تأكيد الشراء','هل تريد فتح هذا الإطار الدائم مقابل {cost} ألماسات؟','إلغاء','مملوك','الإطار الأصلي','إطار طابع الغابة','محدد','استخدام الإطار','الألماس غير كافٍ.','المحفظة غير متاحة.','تعذّر إتمام الشراء. حاول مجددًا.','تعذّر تأكيد الشراء. تحقّق من المحفظة قبل إعادة المحاولة.','الإطار مفعّل في هذه الصفحة، لكن تعذّر حفظ الاختيار.','تم فتح الإطار واختياره.','جارٍ تنفيذ الشراء.','ألماس'],
};
export const locales = Object.freeze(Object.fromEntries(Object.entries(rows).map(([locale,values])=>{
  if(values.length!==keys.length || values.some(value=>typeof value!=='string'||!value.trim())) throw Error(`INCOMPLETE_FRAME_COPY:${locale}`);
  return [locale,Object.freeze(Object.fromEntries(keys.map((key,index)=>[key,values[index]])))];
})));
export function format(locale,key,vars={}) {
  const message=locales[locale]?.[key];
  if(typeof message!=='string')throw Error('MISSING_FRAME_COPY');
  return message.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g,(_whole,name)=>{
    if(!Object.hasOwn(vars,name))throw Error(`MISSING_FRAME_VARIABLE:${name}`);
    const value=String(vars[name]);return locale==='ar'?`\u2068${value}\u2069`:value;
  });
}

export function createFrameController({wallet,storage,onChange=()=>{}}={}) {
  let override=null, pending=null;
  const walletSource=()=>{try{return wallet ?? globalThis.WeightPlayWallet ?? null;}catch{return null;}};
  const preferenceStorage=()=>{try{return storage ?? globalThis.localStorage ?? null;}catch{return null;}};
  const savedSelection=()=>{try{const value=preferenceStorage()?.getItem(PREFERENCE_KEY);return value==='original'||value==='forest'?value:null;}catch{return null;}};
  const read=()=>{
    let value;try{value=walletSource()?.read?.();}catch{value=null;}
    if(!value?.available || !Number.isSafeInteger(value.diamonds) || value.diamonds<0 || !value.purchases || typeof value.purchases!=='object' || Array.isArray(value.purchases))
      return {available:false,balance:null,owned:null,selected:'original',pending:Boolean(pending)};
    const receipt=value.purchases[SKU],owned=Boolean(receipt && receipt.version===1 && receipt.sku===SKU && typeof receipt.id==='string' && Number.isSafeInteger(receipt.cost) && receipt.cost>=0);
    return {available:true,balance:value.diamonds,owned,selected:owned?(override ?? savedSelection() ?? 'original'):'original',pending:Boolean(pending)};
  };
  const notify=()=>{const state=read();try{onChange(state);}catch{/* Presentation cannot change a transaction. */}return state;};
  const saveSelection=value=>{
    override=value;
    try{const target=preferenceStorage();if(!target)return false;target.setItem(PREFERENCE_KEY,value);return target.getItem(PREFERENCE_KEY)===value;}catch{return false;}
  };
  const select=value=>{
    if(!['original','forest'].includes(value))return {ok:false,reason:'invalid',state:read()};
    if(pending)return {ok:false,reason:'busy',state:read()};
    const current=read();
    if(value==='forest'&&!current.available)return {ok:false,reason:'unavailable',state:current};
    if(value==='forest'&&!current.owned)return {ok:false,reason:'not_owned',state:current};
    const saved=saveSelection(value);return {ok:true,saved,state:notify()};
  };
  const purchase=()=>{
    if(pending)return pending;
    const before=read(), source=walletSource();
    if(!before.available||typeof source?.purchasePermanent!=='function')return Promise.resolve({ok:false,reason:'unavailable',state:before});
    if(before.owned)return Promise.resolve({ok:true,alreadyOwned:true,state:before});
    pending=(async()=>{
      let result;try{result=await source.purchasePermanent(SKU,COST);}catch{result={ok:false,reason:'storage'};}
      const verified=read();
      // A lost acknowledgement may still have committed. A durable receipt,
      // not the Promise's success alone, is the authority for delivery.
      if(verified.available&&verified.owned){
        const saved=saveSelection('forest');
        return {ok:true,alreadyOwned:result?.ok?Boolean(result.alreadyOwned):true,saved};
      }
      if(!verified.available || result?.ok)return {ok:false,reason:'unconfirmed'};
      return {ok:false,reason:result?.reason==='insufficient'?'insufficient':'failed'};
    })().then(result=>{pending=null;return {...result,state:notify()};},()=>{pending=null;return {ok:false,reason:'unconfirmed',state:notify()};});
    notify();return pending;
  };
  return Object.freeze({read,refresh:notify,select,purchase});
}
