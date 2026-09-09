const keys=['stages','locked','cleared','play','backStages','next','flip','required','optional','visits','bridges','flips','deliveries','goal','summary','win','saveError'];
const rows={
 en:'Stages|Locked|Cleared|Play|Back to stages|Next stage|Flip tile|Required|Optional|Visit|Bridges|Flips|Delivery order|Goal|30 route puzzles · progress saved locally|Stage complete|Progress could not be saved. Keep this page open.',
 'zh-Hant':'關卡|尚未解鎖|已完成|開始|返回關卡|下一關|翻轉骨牌|必用|可選|必訪|橋樑|翻轉|送達順序|終點|30 道路線謎題・進度保存在本機|關卡完成|無法保存進度，請先保留此頁面。',
 'zh-Hans':'关卡|尚未解锁|已完成|开始|返回关卡|下一关|翻转骨牌|必用|可选|必访|桥梁|翻转|送达顺序|终点|30 道路线谜题・进度保存在本机|关卡完成|无法保存进度，请先保留此页面。',
 ja:'ステージ|未解放|クリア済み|開始|ステージへ|次のステージ|牌を反転|必須|任意|訪問先|橋|反転|配達順|ゴール|30 の経路パズル・進行状況は端末に保存|ステージクリア|保存できませんでした。このページを開いたままにしてください。',
 ko:'스테이지|잠김|완료|시작|스테이지로|다음 스테이지|패 뒤집기|필수|선택|방문지|다리|뒤집기|배달 순서|목표|경로 퍼즐 30개 · 진행 상황은 기기에 저장|스테이지 완료|진행 상황을 저장하지 못했습니다. 이 페이지를 열어 두세요.',
 es:'Niveles|Bloqueado|Completado|Jugar|Volver a niveles|Siguiente nivel|Girar ficha|Obligatoria|Opcional|Visitar|Puentes|Giros|Orden de entrega|Meta|30 puzles de rutas · progreso guardado localmente|Nivel completado|No se pudo guardar el progreso. Mantén esta página abierta.',
 'pt-BR':'Fases|Bloqueada|Concluída|Jogar|Voltar às fases|Próxima fase|Virar peça|Obrigatória|Opcional|Visitar|Pontes|Viradas|Ordem de entrega|Destino|30 desafios de rotas · progresso salvo localmente|Fase concluída|Não foi possível salvar. Mantenha esta página aberta.',
 fr:'Niveaux|Verrouillé|Terminé|Jouer|Retour aux niveaux|Niveau suivant|Retourner la tuile|Obligatoire|Facultative|Visiter|Ponts|Retournements|Ordre de livraison|Arrivée|30 énigmes de parcours · progression sauvegardée localement|Niveau terminé|Impossible de sauvegarder. Gardez cette page ouverte.',
 de:'Level|Gesperrt|Abgeschlossen|Spielen|Zur Levelauswahl|Nächstes Level|Stein umdrehen|Pflicht|Optional|Besuchen|Brücken|Drehungen|Lieferreihenfolge|Ziel|30 Wegerätsel · Fortschritt lokal gespeichert|Level abgeschlossen|Speichern fehlgeschlagen. Bitte diese Seite geöffnet lassen.',
 it:'Livelli|Bloccato|Completato|Gioca|Torna ai livelli|Livello successivo|Gira tessera|Obbligatoria|Facoltativa|Visita|Ponti|Rotazioni|Ordine di consegna|Meta|30 rompicapi di percorsi · progressi salvati localmente|Livello completato|Impossibile salvare. Tieni aperta questa pagina.',
 ru:'Уровни|Закрыто|Пройдено|Играть|К уровням|Следующий уровень|Перевернуть плитку|Обязательно|Необязательно|Посетить|Мосты|Перевороты|Порядок доставки|Цель|30 головоломок с маршрутами · прогресс хранится на устройстве|Уровень пройден|Не удалось сохранить прогресс. Не закрывайте страницу.',
 hi:'स्तर|बंद|पूरा|खेलें|स्तरों पर लौटें|अगला स्तर|टाइल पलटें|अनिवार्य|वैकल्पिक|यहाँ जाएँ|पुल|पलटाव|डिलीवरी क्रम|लक्ष्य|30 रास्तों की पहेलियाँ · प्रगति इसी उपकरण पर सहेजी जाती है|स्तर पूरा|प्रगति सहेजी नहीं जा सकी। यह पेज खुला रखें।',
 ar:'المراحل|مقفل|مكتمل|العب|العودة للمراحل|المرحلة التالية|اقلب القطعة|إلزامية|اختيارية|زيارة|الجسور|القلبات|ترتيب التسليم|الهدف|30 لغز مسارات · يُحفظ التقدم محليًا|اكتملت المرحلة|تعذر حفظ التقدم. أبقِ هذه الصفحة مفتوحة.',
};
export const campaignCopy=Object.freeze(Object.fromEntries(Object.entries(rows).map(([locale,row])=>{
 const values=row.split('|');if(values.length!==keys.length)throw new Error('Incomplete campaign locale '+locale);
 return [locale,Object.freeze(Object.fromEntries(keys.map((key,index)=>[key,values[index]])))];
})));
