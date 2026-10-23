export const supportedLocales=['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
const keys='title|sub|cash|openDay|noStages|shoppers|queue|viewHint|saved|shop|supply|grow|staff|welcome|intro|tipRestock|tipDrag|tipReinvest|openShop|resetSave|settings|sound|shelf|fixtures|restockWater|waterDetail|highDemand|order10|restockSnack|snackDetail|steady|order8|premiumFizz|premiumLocked|locked|expand|expandDetail|coolerUpgrade|coolerDetail|storeCharm|tokens|shopProgress|purchases|fasterCheckout|checkoutDetail|hireHelper|helperDuty|helperNoWage|autoRestock|helperNeeded|placementSelected|placementCancelled|sceneStartError|retry|plannedGuard|returnPreview|ownerPreview|backToPreview|sceneLabel|canvasLabel|zoomOut|zoomIn|rotateView|pageDescription|stockCapacity|upgradeComplete|legacyUpgradeCredit|checkoutTime|browseTime|capacityFull'.split('|');
const rows={
en:'Animal Blockmart|WEIGHTPLAY · CONTINUOUS SHOP|SHOP CASH|OPEN · DAY|NO STAGES|Shoppers|Queue|Drag fixtures · pinch or use +/− · tap ↻ to rotate|Saved on this device|Shop|Supply|Grow|Staff|Welcome to Blockmart|Stock the shelves, welcome shoppers, and grow one persistent shop.|Tap a shelf to restock it.|Drag fixtures to shape open aisles.|Sales fund stock, equipment, helpers, and expansion.|Open the shop|Reset this local save|Settings|Sound|Place a shelf|fixtures|Restock water|on shelf · high demand|High demand|Order +10|Restock snacks|on shelf · steady demand|Steady demand|Order +8|Premium fizz|Unlock at $1,000 sales|LOCKED|Expand to 13 × 13|Adds 3 × 3 usable floor tiles|Bigger cooler|More capacity · faster browsing|Storefront charm|tokens|Shop progress|purchases|Faster checkout|Shorter queues|Hire stock helper|Helper on duty|One-time hire · no wage drain|Auto-restock assist|Hire a helper first',
'zh-Hant':'動物方塊便利店|WEIGHTPLAY · 持續經營|店鋪現金|營業日|沒有關卡|顧客|排隊|拖曳貨架 · 雙指縮放 · 點 ↻ 旋轉|已儲存於此裝置|商店|補貨|擴建|員工|歡迎來到方塊便利店|補滿貨架、迎接顧客，讓同一間店持續成長。|點貨架即可補貨。|拖動貨架安排走道。|收入可投入商品、設備、人手與擴建。|開始營業|重設本機存檔|設定|音效|擺放貨架|項設施|補貨礦泉水|架上 · 需求高|熱門商品|補 10 件|補貨脆餅|架上 · 穩定需求|穩定需求|補 8 件|高級氣泡飲|累積銷售 $1,000 解鎖|未解鎖|擴建至 13 × 13|增加 3 × 3 格可用地板|升級冷藏櫃|增加容量 · 加快挑選|店面布置|代幣|店鋪進度|筆消費|加快結帳|縮短排隊|聘請補貨員|員工正在工作|一次聘請 · 不扣工資|自動補貨協助|先聘請員工',
'zh-Hans':'动物方块便利店|WEIGHTPLAY · 持续经营|店铺现金|营业日|没有关卡|顾客|排队|拖动货架 · 双指缩放 · 点 ↻ 旋转|已保存到此设备|商店|补货|扩建|员工|欢迎来到方块便利店|补满货架、迎接顾客，让同一间店持续成长。|点货架即可补货。|拖动货架安排通道。|收入可投入商品、设备、人手与扩建。|开始营业|重置本地存档|设置|音效|摆放货架|项设施|补货矿泉水|架上 · 需求高|热门商品|补 10 件|补货脆饼|架上 · 稳定需求|稳定需求|补 8 件|高级气泡饮|累计销售 $1,000 解锁|未解锁|扩建至 13 × 13|增加 3 × 3 格可用地板|升级冷藏柜|增加容量 · 加快挑选|店面布置|代币|店铺进度|笔消费|加快结账|缩短排队|聘请补货员|员工正在工作|一次聘请 · 不扣工资|自动补货协助|先聘请员工',
ja:'アニマル・ブロックマート|WEIGHTPLAY · お店を続けよう|所持金|営業日|ステージなし|お客さん|列|棚をドラッグ · ピンチで拡大 · ↻で回転|この端末に保存|お店|仕入れ|拡張|スタッフ|ブロックマートへようこそ|商品を補充して、お客さんを迎え、お店を育てよう。|棚をタップして補充。|棚をドラッグして通路を整えよう。|売上を商品・設備・スタッフ・拡張に再投資。|営業開始|ローカルセーブをリセット|設定|サウンド|棚を置く|個の設備|水を仕入れる|在庫 · 人気|人気商品|10個注文|スナックを仕入れる|在庫 · 定番|定番商品|8個注文|プレミアムソーダ|売上$1,000で解放|未解放|13×13に拡張|使える床を3×3追加|冷蔵庫を強化|容量アップ · 選びやすく|店先の飾り|トークン|お店の記録|回の購入|会計を高速化|待ち列を短縮|品出しスタッフ|スタッフ勤務中|一度の採用 · 維持費なし|自動補充|先にスタッフを雇う',
ko:'애니멀 블록마트|WEIGHTPLAY · 계속 운영|상점 자금|영업일|스테이지 없음|손님|대기 줄|선반 드래그 · 핀치 확대 · ↻ 회전|이 기기에 저장됨|상점|보급|확장|직원|블록마트에 오신 걸 환영해요|진열대를 채우고 손님을 맞아 가게를 키워요.|선반을 눌러 재고를 채우세요.|선반을 끌어 통로를 정리하세요.|수익을 상품·장비·직원·확장에 재투자하세요.|영업 시작|이 기기 저장 초기화|설정|소리|선반 놓기|개 시설|생수 보급|진열 · 인기|인기 상품|10개 주문|간식 보급|진열 · 꾸준함|꾸준한 상품|8개 주문|프리미엄 탄산음료|누적 매출 $1,000에 해제|잠김|13 × 13 확장|사용 가능한 바닥 3 × 3 추가|냉장고 업그레이드|용량 증가 · 쇼핑 속도 향상|매장 장식|토큰|매장 진행|건 구매|빠른 계산대|줄을 줄여요|재고 직원 고용|직원 근무 중|일회 고용 · 유지비 없음|자동 보충 도움|직원을 먼저 고용하세요',
es:'Animal Blockmart|WEIGHTPLAY · TIENDA CONTINUA|EFECTIVO|DÍA|SIN FASES|Clientes|Fila|Arrastra estantes · pellizca para zoom · ↻ gira|Guardado en este dispositivo|Tienda|Suministros|Crecer|Personal|Bienvenido a Blockmart|Repón los estantes, recibe clientes y haz crecer una misma tienda.|Toca un estante para reponerlo.|Arrastra estantes para ordenar los pasillos.|Reinvierte en productos, equipo, personal y espacio.|Abrir tienda|Borrar este guardado local|Ajustes|Sonido|Colocar estante|instalaciones|Reponer agua|en estante · alta demanda|Alta demanda|Pedir +10|Reponer snacks|en estante · demanda estable|Demanda estable|Pedir +8|Refresco prémium|Se desbloquea con $1.000 en ventas|BLOQUEADO|Ampliar a 13 × 13|Añade 3 × 3 baldosas útiles|Mejorar nevera|Más capacidad · compra ágil|Atractivo del local|fichas|Progreso de la tienda|compras|Caja rápida|Colas más cortas|Contratar ayudante|Ayudante trabajando|Pago único · sin gastos fijos|Reposición automática|Contrata primero a alguien',
'pt-BR':'Animal Blockmart|WEIGHTPLAY · LOJA CONTÍNUA|DINHEIRO|DIA|SEM FASES|Clientes|Fila|Arraste prateleiras · pinça para zoom · ↻ gira|Salvo neste dispositivo|Loja|Estoque|Crescer|Equipe|Bem-vindo ao Blockmart|Reabasteça, receba clientes e faça a mesma loja crescer.|Toque na prateleira para abastecer.|Arraste prateleiras para organizar os corredores.|Reinvista em produtos, equipamentos, equipe e espaço.|Abrir a loja|Apagar este salvamento local|Configurações|Som|Colocar prateleira|instalações|Repor água|na prateleira · demanda alta|Alta demanda|Pedir +10|Repor salgadinhos|na prateleira · demanda estável|Demanda estável|Pedir +8|Refri premium|Desbloqueia com $1.000 em vendas|BLOQUEADO|Expandir para 13 × 13|Adiciona piso útil de 3 × 3|Melhorar refrigerador|Mais capacidade · compra mais rápida|Charme da loja|fichas|Progresso da loja|compras|Caixa rápida|Filas menores|Contratar ajudante|Ajudante trabalhando|Contratação única · sem salário|Reposição automática|Contrate alguém primeiro',
fr:'Animal Blockmart|WEIGHTPLAY · BOUTIQUE CONTINUE|CAISSE|JOUR|SANS NIVEAUX|Clients|File|Glissez les rayons · pincez pour zoomer · ↻ tourner|Sauvegardé sur cet appareil|Boutique|Stocks|Agrandir|Équipe|Bienvenue à Blockmart|Réapprovisionnez, accueillez les clients et faites grandir la même boutique.|Touchez un rayon pour le réapprovisionner.|Glissez les rayons pour créer des allées.|Réinvestissez dans les produits, l’équipement, l’équipe et l’espace.|Ouvrir la boutique|Effacer cette sauvegarde locale|Paramètres|Son|Placer un rayon|équipements|Réapprovisionner l’eau|en rayon · forte demande|Forte demande|Commander +10|Réapprovisionner les snacks|en rayon · demande stable|Demande stable|Commander +8|Soda premium|Débloqué à $1 000 de ventes|VERROUILLÉ|Agrandir en 13 × 13|Ajoute 3 × 3 cases utiles|Améliorer le frigo|Plus de stock · choix rapide|Charme de la boutique|jetons|Progression boutique|achats|Caisse plus rapide|Files réduites|Embaucher une aide|Aide en poste|Embauche unique · sans salaire|Réappro automatique|Embauchez d’abord',
de:'Animal Blockmart|WEIGHTPLAY · LADEN OHNE ENDE|LADENKASSE|TAG|OHNE LEVEL|Kundschaft|Schlange|Regale ziehen · zoomen · ↻ drehen|Auf diesem Gerät gespeichert|Laden|Waren|Wachsen|Team|Willkommen bei Blockmart|Fülle Regale auf, bediene Kundschaft und baue denselben Laden aus.|Regal antippen zum Auffüllen.|Regale ziehen und Gänge anlegen.|Umsatz in Waren, Geräte, Team und Ladenfläche reinvestieren.|Laden öffnen|Lokalen Spielstand löschen|Einstellungen|Ton|Regal aufstellen|Einrichtungen|Wasser auffüllen|im Regal · sehr gefragt|Stark gefragt|+10 bestellen|Snacks auffüllen|im Regal · regelmäßig gefragt|Regelmäßig gefragt|+8 bestellen|Premium-Limo|Ab $1.000 Umsatz freigeschaltet|GESPERRT|Auf 13 × 13 erweitern|3 × 3 nutzbare Felder mehr|Kühler verbessern|Mehr Platz · schneller einkaufen|Ladencharme|Token|Ladenfortschritt|Einkäufe|Schnellere Kasse|Kürzere Schlangen|Aushilfe einstellen|Aushilfe arbeitet|Einmalig · kein laufender Lohn|Automatisch auffüllen|Erst Hilfe einstellen',
it:'Animal Blockmart|WEIGHTPLAY · NEGOZIO CONTINUO|CASSA|GIORNO|SENZA LIVELLI|Clienti|Fila|Trascina gli scaffali · pizzica per zoom · ↻ ruota|Salvato su questo dispositivo|Negozio|Scorte|Crescita|Staff|Benvenuto a Blockmart|Rifornisci gli scaffali, accogli i clienti e fai crescere lo stesso negozio.|Tocca uno scaffale per rifornirlo.|Trascina gli scaffali per creare corsie.|Reinvesti in prodotti, attrezzature, staff e spazio.|Apri il negozio|Cancella questo salvataggio locale|Impostazioni|Audio|Posiziona scaffale|attrezzature|Rifornisci acqua|sullo scaffale · alta domanda|Alta domanda|Ordina +10|Rifornisci snack|sullo scaffale · domanda costante|Domanda costante|Ordina +8|Bibita premium|Si sblocca con $1.000 di vendite|BLOCCATO|Espandi a 13 × 13|Aggiunge 3 × 3 caselle utili|Migliora il frigo|Più capienza · acquisti rapidi|Fascino del negozio|gettoni|Progressi del negozio|acquisti|Cassa veloce|File più brevi|Assumi aiuto|Aiuto al lavoro|Una tantum · senza stipendio|Rifornimento automatico|Assumi prima un aiuto',
ru:'Animal Blockmart|WEIGHTPLAY · МАГАЗИН БЕЗ КОНЦА|КАССА|ДЕНЬ|БЕЗ ЭТАПОВ|Покупатели|Очередь|Перетаскивайте полки · масштабируйте · ↻ поворот|Сохранено на устройстве|Магазин|Запасы|Рост|Персонал|Добро пожаловать в Blockmart|Пополняйте полки, встречайте покупателей и развивайте один магазин.|Нажмите на полку, чтобы пополнить её.|Перетаскивайте полки, создавая проходы.|Вкладывайте выручку в товары, оборудование, персонал и площадь.|Открыть магазин|Сбросить локальное сохранение|Настройки|Звук|Поставить полку|оборудования|Пополнить воду|на полке · высокий спрос|Высокий спрос|Заказать +10|Пополнить снеки|на полке · стабильный спрос|Стабильный спрос|Заказать +8|Премиум-лимонад|Откроется при выручке $1 000|ЗАКРЫТО|Расширить до 13 × 13|Добавляет 3 × 3 полезных клетки|Улучшить холодильник|Больше запасов · быстрый выбор|Уют магазина|жетоны|Прогресс магазина|покупок|Быстрая касса|Меньше очередь|Нанять помощника|Помощник на смене|Разовый найм · без зарплаты|Автопополнение|Сначала наймите помощника',
hi:'एनिमल ब्लॉकमार्ट|WEIGHTPLAY · लगातार दुकान|दुकान की नकदी|दिन|कोई चरण नहीं|ग्राहक|कतार|शेल्फ़ खींचें · ज़ूम करें · ↻ घुमाएँ|इस डिवाइस पर सहेजा|दुकान|सामान|बढ़ाएँ|कर्मचारी|ब्लॉकमार्ट में आपका स्वागत है|शेल्फ़ भरें, ग्राहकों का स्वागत करें और इसी दुकान को बढ़ाएँ।|सामान भरने के लिए शेल्फ़ टैप करें।|रास्ते बनाने के लिए शेल्फ़ खींचें।|कमाई को सामान, उपकरण, कर्मचारी और जगह में लगाएँ।|दुकान खोलें|यह लोकल सेव रीसेट करें|सेटिंग|ध्वनि|शेल्फ़ रखें|फिक्स्चर|पानी भरें|शेल्फ़ में · ज़्यादा मांग|ज़्यादा मांग|+10 मँगाएँ|स्नैक्स भरें|शेल्फ़ में · स्थिर मांग|स्थिर मांग|+8 मँगाएँ|प्रीमियम फ़िज़|$1,000 बिक्री पर खुलेगा|बंद|13 × 13 तक बढ़ाएँ|3 × 3 उपयोगी फ़र्श जोड़ें|कूलर सुधारें|अधिक जगह · तेज़ खरीदारी|दुकान की सजावट|टोकन|दुकान की प्रगति|खरीद|तेज़ चेकआउट|छोटी कतार|स्टॉक सहायक रखें|सहायक काम पर|एक बार नियुक्ति · वेतन नहीं|ऑटो रीस्टॉक|पहले सहायक रखें',
ar:'متجر الحيوانات المكعّب|WEIGHTPLAY · متجر مستمر|نقد المتجر|يوم|بلا مراحل|المتسوقون|الطابور|اسحب الرفوف · كبّر بإصبعين · ↻ للتدوير|حُفظ على هذا الجهاز|المتجر|التوريد|النمو|الموظفون|مرحبًا بك في بلوك مارت|املأ الرفوف واستقبل الزبائن وطوّر المتجر نفسه.|انقر الرف لإعادة ملئه.|اسحب الرفوف لصنع ممرات.|أعد استثمار الدخل في البضائع والمعدات والموظفين والمساحة.|افتح المتجر|امسح الحفظ المحلي|الإعدادات|الصوت|ضع رفًا|تجهيزات|أعد توريد الماء|في الرف · طلب مرتفع|طلب مرتفع|اطلب +10|أعد توريد الوجبات|في الرف · طلب ثابت|طلب ثابت|اطلب +8|مشروب فاخر|يُفتح عند مبيعات $1,000|مغلق|وسّع إلى 13 × 13|أضف أرضية نافعة 3 × 3|طوّر المبرّد|سعة أكبر · تسوق أسرع|زينة الواجهة|رموز|تقدم المتجر|مشتريات|دفع أسرع|طابور أقصر|وظّف مساعد مخزون|المساعد يعمل|توظيف مرة واحدة · بلا أجور|مساعدة إعادة التوريد|وظّف مساعدًا أولًا'
};
const dict=Object.fromEntries(Object.entries(rows).map(([locale,row])=>[locale,Object.fromEntries(row.split('|').map((v,i)=>[keys[i],v]))]));
Object.assign(dict.en,{expandDetail:'Adds a 3-tile expansion ring'});Object.assign(dict['zh-Hant'],{expandDetail:'增加三格寬的擴建區'});Object.assign(dict['zh-Hans'],{expandDetail:'增加三格宽的扩建区'});Object.assign(dict.ja,{expandDetail:'幅3タイルの拡張区画を追加'});Object.assign(dict.ko,{expandDetail:'너비 3칸의 확장 구역 추가'});Object.assign(dict.es,{expandDetail:'Añade un ala de tres baldosas'});Object.assign(dict['pt-BR'],{expandDetail:'Adiciona uma ala de três peças'});Object.assign(dict.fr,{expandDetail:'Ajoute une aile de trois cases'});Object.assign(dict.de,{expandDetail:'Erweitert um einen drei Felder breiten Flügel'});Object.assign(dict.it,{expandDetail:'Aggiunge un’ala larga tre caselle'});Object.assign(dict.ru,{expandDetail:'Добавляет крыло шириной в три клетки'});Object.assign(dict.hi,{expandDetail:'तीन टाइल चौड़ी जगह जोड़ें'});Object.assign(dict.ar,{expandDetail:'يضيف جناحًا بعرض ثلاث بلاطات'});
const keepRouteCopy={en:'Keep a clear route from the entrance to checkout.', 'zh-Hant':'請保留入口至收銀台的暢通動線。','zh-Hans':'请保留入口至收银台的畅通动线。',ja:'入口からレジまでの通路を空けてください。',ko:'입구에서 계산대까지 통로를 비워 두세요.',es:'Deja una ruta libre desde la entrada hasta la caja.','pt-BR':'Mantenha livre o caminho da entrada ao caixa.',fr:'Gardez un passage libre entre l’entrée et la caisse.',de:'Halte den Weg vom Eingang zur Kasse frei.',it:'Lascia libero il percorso dall’ingresso alla cassa.',ru:'Оставьте свободный путь от входа к кассе.',hi:'प्रवेश से चेकआउट तक रास्ता खुला रखें।',ar:'اترك مسارًا مفتوحًا من المدخل إلى صندوق الدفع.'};
for(const [locale,copy]of Object.entries(keepRouteCopy))Object.assign(dict[locale],{keepRoute:copy});
const placementSelectedCopy={en:'Pick a tile, then confirm. Esc cancels.', 'zh-Hant':'選擇空格並確認擺放；按 Esc 取消。','zh-Hans':'选择空格并确认摆放；按 Esc 取消。',ja:'空きマスを選んで確定。Esc でキャンセル。',ko:'빈 타일을 선택하고 확인하세요. Esc로 취소.',es:'Elige una casilla y confirma. Esc cancela.','pt-BR':'Escolha um espaço e confirme. Esc cancela.',fr:'Choisissez une case et confirmez. Échap annule.',de:'Feld wählen und bestätigen. Esc bricht ab.',it:'Scegli una casella e conferma. Esc annulla.',ru:'Выберите клетку и подтвердите. Esc отменяет.',hi:'टाइल चुनें और पुष्टि करें। Esc से रद्द करें।',ar:'اختر مساحة وأكّد. Esc للإلغاء.'};
const placementCancelledCopy={en:'Placement cancelled. No purchase was made.', 'zh-Hant':'已取消擺放，沒有扣款。','zh-Hans':'已取消摆放，没有扣款。',ja:'配置をキャンセルしました。購入されていません。',ko:'배치를 취소했습니다. 구매되지 않았습니다.',es:'Colocación cancelada. No se realizó ninguna compra.','pt-BR':'Colocação cancelada. Nenhuma compra foi feita.',fr:'Placement annulé. Aucun achat effectué.',de:'Platzierung abgebrochen. Es wurde nichts gekauft.',it:'Posizionamento annullato. Nessun acquisto effettuato.',ru:'Размещение отменено. Покупка не совершена.',hi:'स्थान रखना रद्द हुआ। कोई खरीदारी नहीं हुई।',ar:'أُلغي الوضع. لم يتم الشراء.'};
for(const locale of supportedLocales)Object.assign(dict[locale],{placementSelected:placementSelectedCopy[locale],placementCancelled:placementCancelledCopy[locale]});
const startupCopy={
  en:{sceneStartError:'The shop scene could not start. Your saved shop is safe.',retry:'Retry',plannedGuard:'Open this planned game from the WeightPlay owner preview.',returnPreview:'Return to the preview lobby'},
  'zh-Hant':{sceneStartError:'店鋪場景無法啟動，你的存檔仍安全保留。',retry:'重試',plannedGuard:'此遊戲尚未公開，請從 WeightPlay 擁有者預覽頁面開啟。',returnPreview:'返回預覽首頁'},
  'zh-Hans':{sceneStartError:'店铺场景无法启动，你的存档仍安全保留。',retry:'重试',plannedGuard:'此游戏尚未公开，请从 WeightPlay 所有者预览页面打开。',returnPreview:'返回预览首页'},
  ja:{sceneStartError:'お店のシーンを起動できませんでした。保存データは安全に保護されています。',retry:'再試行',plannedGuard:'このゲームは公開前です。WeightPlay のオーナープレビューから開いてください。',returnPreview:'プレビューのロビーに戻る'},
  ko:{sceneStartError:'상점 장면을 시작할 수 없습니다. 저장된 상점은 안전하게 보관되어 있습니다.',retry:'다시 시도',plannedGuard:'아직 공개되지 않은 게임입니다. WeightPlay 소유자 미리보기에서 여세요.',returnPreview:'미리보기 로비로 돌아가기'},
  es:{sceneStartError:'No se pudo iniciar la tienda. Tu partida guardada está a salvo.',retry:'Reintentar',plannedGuard:'Este juego aún no está publicado. Ábrelo desde la vista previa del propietario de WeightPlay.',returnPreview:'Volver al vestíbulo de vista previa'},
  'pt-BR':{sceneStartError:'Não foi possível iniciar a loja. Seu jogo salvo está seguro.',retry:'Tentar novamente',plannedGuard:'Este jogo ainda não foi publicado. Abra-o pela prévia do proprietário do WeightPlay.',returnPreview:'Voltar ao lobby de prévia'},
  fr:{sceneStartError:'La boutique n’a pas pu démarrer. Votre partie sauvegardée est en sécurité.',retry:'Réessayer',plannedGuard:'Ce jeu n’est pas encore publié. Ouvrez-le depuis l’aperçu propriétaire de WeightPlay.',returnPreview:'Retourner au lobby de prévisualisation'},
  de:{sceneStartError:'Der Laden konnte nicht gestartet werden. Dein Spielstand ist sicher.',retry:'Erneut versuchen',plannedGuard:'Dieses Spiel ist noch nicht veröffentlicht. Öffne es über die Besitzer-Vorschau von WeightPlay.',returnPreview:'Zurück zur Vorschau-Lobby'},
  it:{sceneStartError:'Impossibile avviare il negozio. La partita salvata è al sicuro.',retry:'Riprova',plannedGuard:'Questo gioco non è ancora pubblicato. Aprilo dall’anteprima proprietario di WeightPlay.',returnPreview:'Torna alla lobby di anteprima'},
  ru:{sceneStartError:'Не удалось запустить магазин. Ваше сохранение в безопасности.',retry:'Повторить',plannedGuard:'Игра ещё не опубликована. Откройте её из предпросмотра владельца WeightPlay.',returnPreview:'Вернуться в лобби предпросмотра'},
  hi:{sceneStartError:'दुकान का दृश्य शुरू नहीं हो सका। आपका सहेजा हुआ खेल सुरक्षित है।',retry:'फिर कोशिश करें',plannedGuard:'यह गेम अभी प्रकाशित नहीं है। इसे WeightPlay के मालिक प्रीव्यू से खोलें।',returnPreview:'प्रीव्यू लॉबी पर लौटें'},
  ar:{sceneStartError:'تعذر تشغيل مشهد المتجر. لعبتك المحفوظة آمنة.',retry:'إعادة المحاولة',plannedGuard:'هذه اللعبة غير منشورة بعد. افتحها من معاينة مالك WeightPlay.',returnPreview:'العودة إلى ردهة المعاينة'}
};
Object.assign(startupCopy.en,{ownerPreview:'Owner Preview',backToPreview:'Back to owner preview',sceneLabel:'Shop scene',canvasLabel:'Isometric shop. Drag an item to reposition it.',zoomOut:'Zoom out',zoomIn:'Zoom in',rotateView:'Rotate view',pageDescription:'Owner preview: manage a growing block-animal neighborhood shop.'});
Object.assign(startupCopy['zh-Hant'],{ownerPreview:'擁有者預覽',backToPreview:'返回擁有者預覽',sceneLabel:'店鋪場景',canvasLabel:'等角視角的店鋪。拖曳物件可調整位置。',zoomOut:'縮小',zoomIn:'放大',rotateView:'旋轉視角',pageDescription:'擁有者預覽：經營一間持續成長的方塊動物便利店。'});
Object.assign(startupCopy['zh-Hans'],{ownerPreview:'所有者预览',backToPreview:'返回所有者预览',sceneLabel:'店铺场景',canvasLabel:'等角视角的店铺。拖动物件可调整位置。',zoomOut:'缩小',zoomIn:'放大',rotateView:'旋转视角',pageDescription:'所有者预览：经营一家持续成长的方块动物便利店。'});
Object.assign(startupCopy.ja,{ownerPreview:'オーナープレビュー',backToPreview:'オーナープレビューに戻る',sceneLabel:'お店のシーン',canvasLabel:'斜め見下ろしのお店。アイテムをドラッグして配置を変更できます。',zoomOut:'縮小',zoomIn:'拡大',rotateView:'視点を回転',pageDescription:'オーナープレビュー：成長を続けるブロックアニマルの街のお店を経営します。'});
Object.assign(startupCopy.ko,{ownerPreview:'소유자 미리보기',backToPreview:'소유자 미리보기로 돌아가기',sceneLabel:'상점 장면',canvasLabel:'등각 시점의 상점입니다. 아이템을 끌어 위치를 바꾸세요.',zoomOut:'축소',zoomIn:'확대',rotateView:'시점 회전',pageDescription:'소유자 미리보기: 계속 성장하는 블록 동물 동네 상점을 운영하세요.'});
Object.assign(startupCopy.es,{ownerPreview:'Vista previa del propietario',backToPreview:'Volver a la vista previa del propietario',sceneLabel:'Escena de la tienda',canvasLabel:'Tienda isométrica. Arrastra un objeto para cambiarlo de lugar.',zoomOut:'Alejar',zoomIn:'Acercar',rotateView:'Girar vista',pageDescription:'Vista previa del propietario: gestiona una tienda de barrio de animales de bloques en crecimiento.'});
Object.assign(startupCopy['pt-BR'],{ownerPreview:'Prévia do proprietário',backToPreview:'Voltar à prévia do proprietário',sceneLabel:'Cena da loja',canvasLabel:'Loja em perspectiva isométrica. Arraste um item para reposicioná-lo.',zoomOut:'Diminuir zoom',zoomIn:'Aumentar zoom',rotateView:'Girar visão',pageDescription:'Prévia do proprietário: administre uma loja de bairro de animais em blocos em crescimento.'});
Object.assign(startupCopy.fr,{ownerPreview:'Aperçu propriétaire',backToPreview:'Retour à l’aperçu propriétaire',sceneLabel:'Scène de la boutique',canvasLabel:'Boutique en vue isométrique. Faites glisser un objet pour le déplacer.',zoomOut:'Dézoomer',zoomIn:'Zoomer',rotateView:'Faire pivoter la vue',pageDescription:'Aperçu propriétaire : gérez une boutique de quartier d’animaux en blocs en pleine croissance.'});
Object.assign(startupCopy.de,{ownerPreview:'Besitzer-Vorschau',backToPreview:'Zurück zur Besitzer-Vorschau',sceneLabel:'Ladenszene',canvasLabel:'Laden in isometrischer Ansicht. Ziehe ein Objekt, um es neu zu platzieren.',zoomOut:'Verkleinern',zoomIn:'Vergrößern',rotateView:'Ansicht drehen',pageDescription:'Besitzer-Vorschau: Führe einen wachsenden Nachbarschaftsladen mit Blocktieren.'});
Object.assign(startupCopy.it,{ownerPreview:'Anteprima proprietario',backToPreview:'Torna all’anteprima proprietario',sceneLabel:'Scena del negozio',canvasLabel:'Negozio in visuale isometrica. Trascina un oggetto per riposizionarlo.',zoomOut:'Riduci zoom',zoomIn:'Aumenta zoom',rotateView:'Ruota visuale',pageDescription:'Anteprima proprietario: gestisci un negozio di quartiere con animali a blocchi in crescita.'});
Object.assign(startupCopy.ru,{ownerPreview:'Предпросмотр владельца',backToPreview:'Вернуться к предпросмотру владельца',sceneLabel:'Сцена магазина',canvasLabel:'Магазин в изометрическом виде. Перетащите предмет, чтобы изменить его положение.',zoomOut:'Уменьшить',zoomIn:'Увеличить',rotateView:'Повернуть вид',pageDescription:'Предпросмотр владельца: управляйте растущим магазином в районе блочных животных.'});
Object.assign(startupCopy.hi,{ownerPreview:'मालिक का प्रीव्यू',backToPreview:'मालिक के प्रीव्यू पर लौटें',sceneLabel:'दुकान का दृश्य',canvasLabel:'आइसोमेट्रिक दुकान। वस्तु को खींचकर उसकी जगह बदलें।',zoomOut:'ज़ूम आउट',zoomIn:'ज़ूम इन',rotateView:'दृश्य घुमाएँ',pageDescription:'मालिक का प्रीव्यू: बढ़ती ब्लॉक-पशु बस्ती की दुकान चलाएँ।'});
Object.assign(startupCopy.ar,{ownerPreview:'معاينة المالك',backToPreview:'العودة إلى معاينة المالك',sceneLabel:'مشهد المتجر',canvasLabel:'متجر بمنظور متساوي القياس. اسحب عنصرًا لتغيير موضعه.',zoomOut:'تصغير',zoomIn:'تكبير',rotateView:'تدوير العرض',pageDescription:'معاينة المالك: أدر متجر حيّ لحيوانات مكعبة يواصل النمو.'});
for(const locale of supportedLocales)Object.assign(dict[locale],startupCopy[locale]);
const economyCopy={
  en:{stockCapacity:'Stock capacity',upgradeComplete:'Installed',legacyUpgradeCredit:'Saved upgrade credit',checkoutTime:'Checkout time',browseTime:'Browse time',capacityFull:'Stock room is full'},
  'zh-Hant':{stockCapacity:'庫存容量',upgradeComplete:'已安裝',legacyUpgradeCredit:'舊版升級抵用',checkoutTime:'結帳時間',browseTime:'挑選時間',capacityFull:'庫存空間已滿'},
  'zh-Hans':{stockCapacity:'库存容量',upgradeComplete:'已安装',legacyUpgradeCredit:'旧版升级抵用',checkoutTime:'结账时间',browseTime:'挑选时间',capacityFull:'库存空间已满'},
  ja:{stockCapacity:'在庫容量',upgradeComplete:'設置済み',legacyUpgradeCredit:'旧版アップグレード特典',checkoutTime:'会計時間',browseTime:'商品選び時間',capacityFull:'在庫がいっぱいです'},
  ko:{stockCapacity:'재고 용량',upgradeComplete:'설치 완료',legacyUpgradeCredit:'이전 업그레이드 혜택',checkoutTime:'계산 시간',browseTime:'상품 선택 시간',capacityFull:'보관 공간이 가득 찼어요'},
  es:{stockCapacity:'Capacidad de existencias',upgradeComplete:'Instalado',legacyUpgradeCredit:'Crédito de mejora guardado',checkoutTime:'Tiempo de cobro',browseTime:'Tiempo para elegir',capacityFull:'El almacén está lleno'},
  'pt-BR':{stockCapacity:'Capacidade de estoque',upgradeComplete:'Instalado',legacyUpgradeCredit:'Crédito de melhoria salvo',checkoutTime:'Tempo de caixa',browseTime:'Tempo de escolha',capacityFull:'O estoque está cheio'},
  fr:{stockCapacity:'Capacité de stock',upgradeComplete:'Installé',legacyUpgradeCredit:'Crédit d’amélioration sauvegardé',checkoutTime:'Temps en caisse',browseTime:'Temps de choix',capacityFull:'Le stock est plein'},
  de:{stockCapacity:'Lagerkapazität',upgradeComplete:'Installiert',legacyUpgradeCredit:'Gespeichertes Upgrade-Guthaben',checkoutTime:'Kassierzeit',browseTime:'Auswahlzeit',capacityFull:'Der Lagerraum ist voll'},
  it:{stockCapacity:'Capacità scorte',upgradeComplete:'Installato',legacyUpgradeCredit:'Credito upgrade salvato',checkoutTime:'Tempo alla cassa',browseTime:'Tempo di scelta',capacityFull:'Scorte al completo'},
  ru:{stockCapacity:'Вместимость запасов',upgradeComplete:'Установлено',legacyUpgradeCredit:'Сохранённый кредит улучшения',checkoutTime:'Время оплаты',browseTime:'Время выбора',capacityFull:'Место для запасов закончилось'},
  hi:{stockCapacity:'भंडार क्षमता',upgradeComplete:'लग गया',legacyUpgradeCredit:'सहेजा गया अपग्रेड क्रेडिट',checkoutTime:'बिलिंग समय',browseTime:'चुनने का समय',capacityFull:'भंडार पूरी तरह भर गया है'},
  ar:{stockCapacity:'سعة المخزون',upgradeComplete:'تم التركيب',legacyUpgradeCredit:'رصيد ترقية محفوظ',checkoutTime:'وقت الدفع',browseTime:'وقت اختيار المنتج',capacityFull:'مساحة التخزين ممتلئة'}
};
for(const locale of supportedLocales)Object.assign(dict[locale],economyCopy[locale]);
const recoveryKeys='recoveryInvoice|recoveryOrder|recoveryPayment'.split('|');
const recoveryCopy={
  en:{recoveryInvoice:'Emergency supply balance',recoveryOrder:'Emergency water order · repaid from sales',recoveryPayment:'Paid toward emergency supply'},
  'zh-Hant':{recoveryInvoice:'緊急進貨欠款',recoveryOrder:'緊急補水 · 由銷售收入償還',recoveryPayment:'已償還緊急進貨款'},
  'zh-Hans':{recoveryInvoice:'紧急进货欠款',recoveryOrder:'紧急补水 · 由销售收入偿还',recoveryPayment:'已偿还紧急进货款'},
  ja:{recoveryInvoice:'緊急仕入れ残高',recoveryOrder:'緊急の水を仕入れ · 売上から返済',recoveryPayment:'緊急仕入れ分を返済'},
  ko:{recoveryInvoice:'긴급 물품 대금',recoveryOrder:'긴급 물 주문 · 매출에서 상환',recoveryPayment:'긴급 물품 대금 상환'},
  es:{recoveryInvoice:'Saldo de suministro urgente',recoveryOrder:'Pedido urgente de agua · se paga con las ventas',recoveryPayment:'Pago del suministro urgente'},
  'pt-BR':{recoveryInvoice:'Saldo do fornecedor emergencial',recoveryOrder:'Pedido emergencial de água · pago com as vendas',recoveryPayment:'Pagamento do fornecedor emergencial'},
  fr:{recoveryInvoice:'Solde du réapprovisionnement d’urgence',recoveryOrder:'Commande d’eau d’urgence · remboursée par les ventes',recoveryPayment:'Remboursement du stock d’urgence'},
  de:{recoveryInvoice:'Offener Notvorrat',recoveryOrder:'Notbestellung Wasser · Rückzahlung aus Verkäufen',recoveryPayment:'Notvorrat bezahlt'},
  it:{recoveryInvoice:'Saldo della fornitura d’emergenza',recoveryOrder:'Ordine d’acqua urgente · ripagato con le vendite',recoveryPayment:'Fornitura d’emergenza pagata'},
  ru:{recoveryInvoice:'Долг за аварийный запас',recoveryOrder:'Срочный заказ воды · оплата из выручки',recoveryPayment:'Оплата аварийного запаса'},
  hi:{recoveryInvoice:'आपात सामान का बकाया',recoveryOrder:'आपात पानी का ऑर्डर · बिक्री से भुगतान',recoveryPayment:'आपात सामान का भुगतान'},
  ar:{recoveryInvoice:'رصيد التوريد الطارئ',recoveryOrder:'طلب ماء طارئ · يُسدد من المبيعات',recoveryPayment:'سداد قيمة التوريد الطارئ'}
};
for(const locale of supportedLocales)Object.assign(dict[locale],recoveryCopy[locale]||recoveryCopy.en);
keys.push(...recoveryKeys);

const uxKeys='placementValid|placementBlocked|placementHint|confirmPlace|cancel|productToDisplay|placeShelfHint|premiumDetail|buyPrice|sellPrice|storedInactive|placeFree|moveDevice|toWarehouse|optionalDecor|lifetimeSales|noDailyReset|hired|autoRestockDetail|needMoreCash|placementDone|selectMovePrompt'.split('|');
const uxCopy={
'en':['Valid spot · confirm placement','Blocked tile · choose an open tile','Tap a floor tile to preview','Confirm place','Cancel','Product','Choose a product for this shelf','Small demand · higher margin','buy','sell','Stored · effect inactive','Place free','Move','Store','Optional decoration','lifetime sales','Your shop and progress persist every day.','HIRED','Helper tops up water stock when low · no wages','Not enough cash','Placed · no charge for moving','Fixture selected · choose Move to reposition'],
'zh-Hant':['位置有效 · 請確認擺放','位置無效 · 請選空格','點地板預覽位置','確認擺放','取消','商品','選擇此貨架販售的商品','需求較低 · 利潤較高','進貨','售價','已收進倉庫 · 效果暫停','免費放回','移動','收進倉庫','可選裝飾','累計營收','每天保留店鋪與進度。','已聘請','庫存偏低時自動補水 · 不扣工資','現金不足','已擺放 · 移動不收費','已選設備 · 點移動即可調整位置'],
'zh-Hans':['位置有效 · 请确认摆放','位置无效 · 请选择空格','点地板预览位置','确认摆放','取消','商品','选择此货架销售的商品','需求较低 · 利润较高','进货','售价','已存入仓库 · 效果暂停','免费放回','移动','存入仓库','可选装饰','累计营收','每天保留店铺与进度。','已聘用','库存偏低时自动补水 · 不扣工资','现金不足','已摆放 · 移动不收费','已选设备 · 点移动即可调整位置'],
ja:['有効な場所 · 配置を確定','置けない場所 · 空きタイルを選択','床をタップして位置を確認','配置を確定','キャンセル','商品','棚に並べる商品を選択','需要は少なめ · 利益は高め','仕入れ','販売価格','倉庫保管中 · 効果停止','無料で配置','移動','倉庫へ','任意の装飾','累計売上','毎日、店と進行状況を引き継ぎます。','雇用済み','水の在庫が減ると自動補充 · 維持費なし','現金が足りません','配置しました · 移動は無料','設備を選択 · 移動から場所を変更'],
ko:['놓을 수 있어요 · 배치 확인','놓을 수 없어요 · 빈 칸 선택','바닥을 눌러 위치 미리 보기','배치 확인','취소','상품','진열할 상품 선택','수요는 적지만 마진은 높아요','매입','판매가','창고 보관 · 효과 중지','무료 배치','이동','창고에 보관','선택 장식','누적 매출','매일 상점과 진행 상황을 이어갑니다.','고용됨','물이 부족하면 자동 보충 · 유지비 없음','현금이 부족해요','배치 완료 · 이동은 무료','기기 선택됨 · 이동을 눌러 위치 변경'],
es:['Lugar válido · confirma la colocación','Casilla bloqueada · elige otra','Toca el suelo para previsualizar','Confirmar lugar','Cancelar','Producto','Elige qué vender en este estante','Menos demanda · más margen','compra','venta','Guardado · efecto inactivo','Colocar gratis','Mover','Guardar','Decoración opcional','ventas totales','La tienda y el progreso continúan cada día.','CONTRATADO','Repone agua cuando escasea · sin sueldo','Falta efectivo','Colocado · mover es gratis','Equipo seleccionado · pulsa Mover para cambiarlo'],
'pt-BR':['Local válido · confirme a posição','Espaço bloqueado · escolha outro','Toque no chão para prévia','Confirmar local','Cancelar','Produto','Escolha o produto da prateleira','Menos demanda · mais margem','compra','venda','Guardado · efeito inativo','Posicionar grátis','Mover','Guardar','Decoração opcional','vendas totais','A loja e o progresso continuam a cada dia.','CONTRATADO','Repõe água quando baixa · sem salário','Dinheiro insuficiente','Posicionado · mover é grátis','Item selecionado · toque em Mover para reposicionar'],
fr:['Emplacement valide · confirmez la pose','Case bloquée · choisissez une case libre','Touchez le sol pour prévisualiser','Confirmer','Annuler','Produit','Choisissez le produit de ce rayon','Demande faible · marge élevée','achat','vente','En réserve · effet inactif','Placer gratuitement','Déplacer','Ranger','Décoration facultative','ventes cumulées','La boutique et la progression continuent chaque jour.','EMBAUCHÉ','Réapprovisionne l’eau · sans salaire','Fonds insuffisants','Installé · déplacement gratuit','Équipement sélectionné · choisissez Déplacer'],
de:['Gültiger Platz · Platzierung bestätigen','Blockiert · freien Platz wählen','Boden antippen für Vorschau','Platzierung bestätigen','Abbrechen','Produkt','Produkt für dieses Regal wählen','Weniger Nachfrage · höhere Marge','Einkauf','Verkauf','Eingelagert · Effekt pausiert','Kostenlos platzieren','Verschieben','Einlagern','Optionale Deko','Umsatz gesamt','Laden und Fortschritt bleiben jeden Tag erhalten.','EINGESTELLT','Füllt Wasser bei niedrigem Vorrat auf · kein Lohn','Nicht genug Geld','Platziert · Verschieben ist kostenlos','Gerät gewählt · zum Verschieben antippen'],
it:['Posizione valida · conferma il posizionamento','Casella bloccata · scegline una libera','Tocca il pavimento per l’anteprima','Conferma posizione','Annulla','Prodotto','Scegli il prodotto per lo scaffale','Meno domanda · margine più alto','acquisto','vendita','In magazzino · effetto sospeso','Posiziona gratis','Sposta','Riponi','Decorazione facoltativa','vendite totali','Negozio e progressi restano ogni giorno.','ASSUNTO','Rifornisce l’acqua quando scarseggia · senza paga','Contanti insufficienti','Posizionato · spostare è gratis','Dispositivo selezionato · scegli Sposta'],
'ru':['Место подходит · подтвердите размещение','Место занято · выберите свободную клетку','Коснитесь пола для предпросмотра','Подтвердить размещение','Отмена','Товар','Выберите товар для этой полки','Спрос ниже · прибыль выше','закупка','цена','На складе · эффект отключён','Разместить бесплатно','Переместить','На склад','Необязательный декор','общая выручка','Магазин и прогресс сохраняются каждый день.','НАНЯТ','Пополняет воду при нехватке · без зарплаты','Недостаточно денег','Размещено · перемещение бесплатно','Устройство выбрано · нажмите «Переместить»'],
'hi':['जगह सही · रखने की पुष्टि करें','जगह बंद है · खाली टाइल चुनें','पूर्वावलोकन के लिए फ़र्श छुएँ','जगह की पुष्टि','रद्द करें','उत्पाद','इस शेल्फ़ का उत्पाद चुनें','कम मांग · अधिक मुनाफ़ा','खरीद','बिक्री','गोदाम में · असर बंद','मुफ़्त रखें','खिसकाएँ','गोदाम में रखें','वैकल्पिक सजावट','कुल बिक्री','दुकान और प्रगति हर दिन बनी रहती है।','नियुक्त','पानी कम होने पर भरता है · वेतन नहीं','पैसे कम हैं','रखा गया · खिसकाना मुफ़्त','उपकरण चुना · जगह बदलने के लिए खिसकाएँ'],
'ar':['مكان صالح · أكّد الوضع','المربع محظور · اختر مربعاً فارغاً','المس الأرض لمعاينة المكان','تأكيد الوضع','إلغاء','المنتج','اختر منتجاً لهذا الرف','طلب أقل · ربح أعلى','شراء','بيع','في المخزن · التأثير متوقف','ضع مجاناً','نقل','إلى المخزن','زينة اختيارية','إجمالي المبيعات','يبقى المتجر والتقدم محفوظين كل يوم.','تم التوظيف','يعيد تعبئة الماء عند انخفاضه · بلا أجور','النقد غير كافٍ','تم الوضع · النقل مجاني','تم اختيار الجهاز · اضغط نقل لتغيير المكان']
};
for(const locale of supportedLocales){const vals=uxCopy[locale]||uxCopy.en;Object.assign(dict[locale],Object.fromEntries(uxKeys.map((k,i)=>[k,vals[i]])))}
keys.push(...uxKeys);

const screenKeys='mainSummary|leaveTitle|leaveText|continuePlaying|returnMain|guideSummary|guideStart|guideStock|guidePlace|guideGrow'.split('|');
const screenCopy={
'en':['Build a lively neighborhood shop. Stock blocky goods, welcome shoppers, and reinvest every sale into a bigger store.','Return to the shop menu?','Your shop keeps its saved stock, equipment, and cash.','Continue shopping','Return to Main','Keep your neighborhood store stocked and help each sale fund the next improvement.','Run your shop','Order water, snacks, and premium fizz from Supply.','Choose equipment, preview an open tile, then confirm placement.','Reinvest in staff and expand the same store from 10 × 10 to 13 × 13.'],
'zh-Hant':['打造熱鬧的街坊便利店。擺上方塊商品、迎接顧客，把每筆收入再投資到店鋪。','返回商店主頁？','商品、設備與現金都會保存在同一間店。','繼續經營','返回主頁','補滿街坊店鋪，讓每筆收入都能支持下一次升級。','經營店鋪','到補貨頁訂購礦泉水、點心與高級氣泡飲。','選擇設備、預覽空格，確認後才擺放與扣款。','投資員工並把同一店面從 10 × 10 擴建到 13 × 13。'],
'zh-Hans':['打造热闹的街坊便利店。摆上方块商品、迎接顾客，把每笔收入再投资到店铺。','返回商店主页？','商品、设备与现金都会保存在同一间店。','继续经营','返回主页','补满街坊店铺，让每笔收入都能支持下一次升级。','经营店铺','到补货页订购矿泉水、点心与高级气泡饮。','选择设备、预览空格，确认后才摆放与扣款。','投资员工并把同一店面从 10 × 10 扩建到 13 × 13。'],
'ja':['街の小さなお店を育てよう。ブロック商品を並べ、買い物客を迎え、売上を次の設備へ再投資。','ショップメニューへ戻りますか？','商品、設備、所持金は保存されます。','買い物を続ける','メインへ戻る','商品を切らさず、売上で次の改善につなげましょう。','お店を経営','補給から水、スナック、プレミアム炭酸を注文。','設備を選び、空きマスを確認してから配置を確定。','スタッフに投資し、同じ店を10×10から13×13へ拡張。'],
'ko':['동네 가게를 키워 보세요. 블록 상품을 진열하고 손님을 맞아 매출을 다시 투자하세요.','상점 메뉴로 돌아갈까요?','상품, 장비, 보유금은 저장됩니다.','계속 운영','메인으로 돌아가기','상품을 채우고 매출로 다음 개선을 준비하세요.','가게 운영','보급에서 물, 간식, 프리미엄 음료를 주문하세요.','장비를 선택하고 빈 칸을 미리 본 뒤 배치를 확인하세요.','직원에 투자하고 같은 매장을 10×10에서 13×13으로 확장하세요.'],
'es':['Haz crecer tu tienda del barrio. Coloca productos cúbicos, recibe clientes y reinvierte cada venta.','¿Volver al menú de la tienda?','Se guardan productos, equipos y dinero.','Seguir atendiendo','Volver al inicio','Mantén la tienda abastecida y usa cada venta para mejorarla.','Gestiona tu tienda','Pide agua, snacks y refresco prémium en Suministros.','Elige equipo, previsualiza una casilla libre y confirma.','Invierte en personal y amplía la misma tienda de 10 × 10 a 13 × 13.'],
'pt-BR':['Faça crescer sua loja do bairro. Coloque produtos em blocos, receba clientes e reinvista cada venda.','Voltar ao menu da loja?','Produtos, equipamentos e dinheiro ficam salvos.','Continuar atendendo','Voltar ao início','Mantenha a loja abastecida e use cada venda para melhorá-la.','Administre sua loja','Peça água, lanches e refrigerante premium em Suprimentos.','Escolha o equipamento, veja um espaço livre e confirme.','Invista na equipe e amplie a mesma loja de 10 × 10 para 13 × 13.'],
'fr':['Faites grandir votre commerce de quartier. Placez des produits cubiques, accueillez les clients et réinvestissez.','Retourner au menu de la boutique ?','Stock, équipements et argent sont conservés.','Continuer la boutique','Retour au menu','Gardez votre commerce approvisionné et financez chaque amélioration avec les ventes.','Gérez votre boutique','Commandez eau, snacks et soda premium dans Approvisionnement.','Choisissez un équipement, prévisualisez une case libre et confirmez.','Investissez dans le personnel et agrandissez la même boutique de 10 × 10 à 13 × 13.'],
'de':['Vergrößere deinen Laden im Viertel. Platziere Blockwaren, begrüße Kundschaft und investiere Verkäufe neu.','Zur Ladenübersicht zurückkehren?','Waren, Ausstattung und Geld bleiben erhalten.','Weiter einkaufen','Zurück zum Start','Halte den Laden gefüllt und finanziere Verbesserungen mit jedem Verkauf.','Laden führen','Bestelle Wasser, Snacks und Premium-Limo unter Vorräte.','Wähle ein Gerät, prüfe einen freien Platz und bestätige.','Investiere in Personal und erweitere denselben Laden von 10 × 10 auf 13 × 13.'],
'it':['Fai crescere il negozio del quartiere. Esponi prodotti a blocchi, accogli clienti e reinvesti ogni vendita.','Tornare al menu del negozio?','Scorte, attrezzature e denaro vengono conservati.','Continua a servire','Torna al menu','Rifornisci il negozio e usa ogni vendita per migliorarlo.','Gestisci il negozio','Ordina acqua, snack e bibita premium da Forniture.','Scegli un’attrezzatura, visualizza una casella libera e conferma.','Investi nel personale ed espandi lo stesso negozio da 10 × 10 a 13 × 13.'],
'ru':['Развивайте магазин у дома. Расставляйте блочные товары, встречайте покупателей и вкладывайте выручку.','Вернуться в меню магазина?','Запасы, оборудование и деньги сохраняются.','Продолжить работу','В меню','Пополняйте запасы и вкладывайте выручку в улучшения.','Управляйте магазином','Заказывайте воду, снеки и премиум-напиток в разделе поставок.','Выберите оборудование, проверьте свободную клетку и подтвердите.','Нанимайте сотрудников и расширьте тот же магазин с 10×10 до 13×13.'],
'hi':['अपने पड़ोस की दुकान बढ़ाएँ। ब्लॉक उत्पाद रखें, ग्राहकों का स्वागत करें और कमाई फिर निवेश करें।','दुकान मेनू पर लौटें?','स्टॉक, उपकरण और नकदी सुरक्षित रहते हैं।','खरीदारी जारी रखें','मुख्य मेनू पर लौटें','दुकान में सामान रखें और हर बिक्री से अगला सुधार करें।','दुकान चलाएँ','आपूर्ति से पानी, स्नैक्स और प्रीमियम पेय मँगाएँ।','उपकरण चुनें, खाली जगह देखें और पुष्टि करके रखें।','कर्मचारी रखें और उसी दुकान को 10×10 से 13×13 तक बढ़ाएँ।'],
'ar':['طوّر متجر الحي. رتّب السلع المكعبة واستقبل الزبائن وأعد استثمار كل عملية بيع.','العودة إلى قائمة المتجر؟','تبقى البضائع والمعدات والمال محفوظة.','تابع التسوق','العودة للرئيسية','حافظ على المخزون واجعل كل عملية بيع تمول تحسيناً جديداً.','أدر متجرك','اطلب الماء والوجبات والمشروب المميز من الإمدادات.','اختر جهازاً، عاين مربعاً فارغاً، ثم أكّد وضعه.','استثمر في الموظفين ووسّع المتجر نفسه من 10×10 إلى 13×13.']
};
for(const locale of supportedLocales){const vals=screenCopy[locale]||screenCopy.en;Object.assign(dict[locale],Object.fromEntries(screenKeys.map((k,i)=>[k,vals[i]])))}
keys.push(...screenKeys);

const supplementKeys='backToMain|posterAlt|guideKicker|cashShort|orderedFor|expandSuccess'.split('|');
const supplementCopy={
'en':['Back to Main','Original low-poly animal convenience shop','WeightPlay Original Game Guide','Not enough cash yet. Let shoppers keep buying, or wait for the helper.','ordered for','The 13 × 13 wing is open. Your same store and progress remain.'],
'zh-Hant':['返回主頁','原創低多邊形動物便利店','WeightPlay 原創遊戲指南','現金還不夠。讓顧客繼續購物，或等員工補貨。','進貨金額','13 × 13 新區已開放，同一間店與進度都會保留。'],
'zh-Hans':['返回主页','原创低多边形动物便利店','WeightPlay 原创游戏指南','现金还不够。让顾客继续购物，或等员工补货。','进货金额','13 × 13 新区已开放，同一间店与进度都会保留。'],
'ja':['メインに戻る','オリジナルのローポリ動物コンビニ','WeightPlay オリジナルゲームガイド','現金が足りません。買い物客の購入を待つか、補充を待ちましょう。','仕入れ金額','13×13の区画が開き、同じ店舗と進行状況が続きます。'],
'ko':['메인으로 돌아가기','오리지널 로우폴리 동물 편의점','WeightPlay 오리지널 게임 가이드','현금이 부족해요. 손님의 구매나 재고 보충을 기다리세요.','매입 금액','13×13 확장 구역이 열렸어요. 같은 매장과 진행 상황이 유지돼요.'],
'es':['Volver al menú','Tienda animal original de baja poligonización','Guía de juegos originales de WeightPlay','Falta efectivo. Espera a que compren los clientes o a que se reponga stock.','pedido por','Se abrió el ala 13 × 13. La misma tienda conserva su progreso.'],
'pt-BR':['Voltar ao início','Loja animal original em low poly','Guia de jogos originais WeightPlay','Dinheiro insuficiente. Aguarde as vendas ou a reposição do estoque.','pedido por','A ala 13 × 13 está aberta. A mesma loja mantém seu progresso.'],
'fr':['Retour au menu','Commerce animalier original en low poly','Guide des jeux originaux WeightPlay','Fonds insuffisants. Attendez les ventes ou le réapprovisionnement.','commande pour','L’aile 13 × 13 est ouverte. La même boutique garde sa progression.'],
'de':['Zurück zum Menü','Originaler Tierladen in Low-Poly-Optik','WeightPlay Original-Spielanleitung','Nicht genug Geld. Warte auf Verkäufe oder neue Vorräte.','Bestellung für','Der 13×13-Flügel ist geöffnet. Laden und Fortschritt bleiben erhalten.'],
'it':['Torna alla schermata principale','Negozio animalier originale low poly','Guida ai giochi originali WeightPlay','Contanti insufficienti. Attendi le vendite o il rifornimento.','ordine da','L’ala 13 × 13 è aperta. Il negozio conserva i progressi.'],
'ru':['В меню','Оригинальный магазин с животными в стиле low-poly','Руководство по оригинальным играм WeightPlay','Недостаточно денег. Дождитесь покупок или пополнения запасов.','заказ на','Крыло 13×13 открыто. Магазин и прогресс сохранены.'],
'hi':['मुख्य मेनू पर लौटें','मौलिक लो-पॉली पशु सुविधा स्टोर','WeightPlay मूल गेम गाइड','पैसे कम हैं। ग्राहकों की खरीद या स्टॉक भरने की प्रतीक्षा करें।','के लिए ऑर्डर','13×13 वाला हिस्सा खुला है। दुकान और प्रगति वही रहती है।'],
'ar':['العودة إلى الرئيسية','متجر حيوانات أصلي بأسلوب منخفض المضلعات','دليل ألعاب WeightPlay الأصلية','النقد غير كافٍ. انتظر مشتريات الزبائن أو إعادة تعبئة المخزون.','قيمة الطلب','تم فتح الجناح 13×13. يستمر المتجر نفسه مع حفظ التقدم.']
};
for(const locale of supportedLocales)Object.assign(dict[locale],Object.fromEntries(supplementKeys.map((k,i)=>[k,supplementCopy[locale][i]])));
keys.push(...supplementKeys);

const reasonKeys='placementOutside|placementEntry|placementOccupied|placementRoute'.split('|');
const reasonCopy={
'en':['Outside the shop floor','Entrance tile · keep the doorway open','Tile is occupied','This blocks a route to the checkout'],
'zh-Hant':['超出店面地板','入口格 · 請保持出入口暢通','此格已有設備','會阻斷通往結帳台的走道'],
'zh-Hans':['超出店面地板','入口格 · 请保持出入口畅通','此格已有设备','会阻断通往收银台的通道'],
'ja':['店の床の外です','入口マス · 通路を空けてください','このマスは使用中です','レジへの通路が塞がります'],
'ko':['매장 바닥 밖이에요','입구 칸 · 출입구를 비워 두세요','이미 장비가 있어요','계산대로 가는 길을 막아요'],
'es':['Fuera del suelo de la tienda','Casilla de entrada · deja libre el acceso','Casilla ocupada','Bloquea la ruta a la caja'],
'pt-BR':['Fora do piso da loja','Espaço da entrada · mantenha a passagem livre','Espaço ocupado','Bloqueia o caminho até o caixa'],
'fr':['Hors du sol de la boutique','Case d’entrée · gardez le passage libre','Case occupée','Bloque le chemin vers la caisse'],
'de':['Außerhalb der Ladenfläche','Eingangsfeld · Zugang freihalten','Platz ist belegt','Versperrt den Weg zur Kasse'],
'it':['Fuori dal pavimento del negozio','Casella d’ingresso · lascia libero il passaggio','Casella occupata','Blocca il percorso verso la cassa'],
'ru':['За пределами пола магазина','Входная клетка · оставьте проход свободным','Клетка занята','Перекрывает путь к кассе'],
'hi':['दुकान के फ़र्श से बाहर','प्रवेश टाइल · रास्ता खुला रखें','जगह पर उपकरण है','कैश काउंटर का रास्ता बंद होगा'],
'ar':['خارج أرضية المتجر','مربع المدخل · اترك الممر مفتوحاً','المربع مشغول','سيُغلق المسار إلى صندوق الدفع']
};
for(const locale of supportedLocales)Object.assign(dict[locale],Object.fromEntries(reasonKeys.map((k,i)=>[k,reasonCopy[locale][i]])));
keys.push(...reasonKeys);

const canvasCopy={en:'Isometric shop scene. Drag to pan, pinch to zoom and rotate, or right/Shift-drag to rotate.', 'zh-Hant':'等角商店場景。拖曳平移、雙指縮放旋轉，或按右鍵／Shift 拖曳旋轉。','zh-Hans':'等角商店场景。拖动平移、双指缩放旋转，或按右键／Shift 拖动旋转。',ja:'アイソメトリックの店舗画面。ドラッグで移動、ピンチで拡大縮小と回転、右/Shiftドラッグで回転。',ko:'등각 가게 화면. 드래그로 이동, 두 손가락으로 확대·회전, 오른쪽/Shift 드래그로 회전.',es:'Escena isométrica. Arrastra para mover, pellizca para zoom y giro o arrastra con clic derecho/Mayús.', 'pt-BR':'Cena isométrica. Arraste para mover, pinça para zoom e giro ou use botão direito/Shift.',fr:'Scène isométrique. Glissez pour déplacer, pincez pour zoomer et tourner, ou clic droit/Maj pour tourner.',de:'Isometrische Szene. Ziehen zum Schwenken, Zwei-Finger-Geste für Zoom und Drehung, Rechts-/Umschaltziehen dreht.',it:'Scena isometrica. Trascina per spostare, pizzica per zoom e rotazione, oppure trascina con destro/Maiusc.',ru:'Изометрический магазин. Перетаскивайте для панорамирования; два пальца меняют масштаб и угол.',hi:'आइसोमेट्रिक दुकान दृश्य। खींचकर पैन करें, दो उँगलियों से ज़ूम व घुमाएँ, दाएँ/Shift ड्रैग से घुमाएँ।',ar:'مشهد متجر متساوي القياس. اسحب للتحريك، بإصبعين للتكبير والتدوير، أو اسحب بالزر الأيمن/Shift.'};
for(const locale of supportedLocales)dict[locale].canvasLabel=canvasCopy[locale];


const gestureCopy={en:'Drag to pan · pinch to zoom · twist or right-drag to rotate', 'zh-Hant':'拖曳平移 · 雙指縮放與旋轉 · 桌面按右鍵拖曳旋轉','zh-Hans':'拖动平移 · 双指缩放与旋转 · 桌面按右键拖动旋转',ja:'ドラッグで移動 · ピンチで拡大縮小と回転 · PCは右ドラッグで回転',ko:'드래그로 이동 · 두 손가락으로 확대·회전 · PC는 오른쪽 드래그로 회전',es:'Arrastra para mover · pellizca para zoom y giro · clic derecho para girar', 'pt-BR':'Arraste para mover · pinça para zoom e giro · botão direito gira',fr:'Glisser pour déplacer · pincer pour zoomer et tourner · clic droit pour tourner',de:'Ziehen zum Schwenken · Zwei Finger für Zoom und Drehung · Rechtsziehen dreht',it:'Trascina per spostare · pizzica per zoom e rotazione · tasto destro ruota',ru:'Перетаскивайте для панорамирования · жест двумя пальцами меняет масштаб и угол',hi:'खींचकर पैन करें · दो उँगलियों से ज़ूम और घुमाएँ · दायाँ ड्रैग घुमाता है',ar:'اسحب للتحريك · اضغط بإصبعين للتكبير والتدوير · السحب بالزر الأيمن للتدوير'};
for(const locale of supportedLocales)dict[locale].viewHint=gestureCopy[locale]||gestureCopy.en;
const panCanvasCopy={en:'Isometric shop scene. Drag to pan in the direction of your pointer, pinch to zoom and rotate.', 'zh-Hant':'等角商店場景。依拖曳方向平移，雙指縮放與旋轉。','zh-Hans':'等角商店场景。按拖动方向平移，双指缩放与旋转。',ja:'アイソメトリックの店舗画面。ドラッグした方向へ移動し、ピンチで拡大縮小と回転。',ko:'등각 가게 화면. 드래그한 방향으로 이동하고 두 손가락으로 확대·회전하세요.',es:'Escena isométrica. Arrastra en la dirección del puntero y pellizca para zoom y giro.', 'pt-BR':'Cena isométrica. Arraste na direção do ponteiro e use dois dedos para zoom e giro.',fr:'Scène isométrique. Glissez dans le sens du pointeur et pincez pour zoomer et tourner.',de:'Isometrische Szene. Ziehe in Zeigerrichtung; zwei Finger ändern Zoom und Drehung.',it:'Scena isometrica. Trascina nella direzione del puntatore e usa due dita per zoom e rotazione.',ru:'Изометрический магазин. Перетаскивайте в сторону указателя; двумя пальцами меняйте масштаб и угол.',hi:'आइसोमेट्रिक दुकान दृश्य। पॉइंटर की दिशा में खींचें और दो उँगलियों से ज़ूम व घुमाएँ।',ar:'مشهد متجر متساوي القياس. اسحب باتجاه المؤشر واستخدم إصبعين للتكبير والتدوير.'};
const panGestureCopy={en:'Drag to pan · pinch to zoom and rotate', 'zh-Hant':'拖曳平移 · 雙指縮放與旋轉','zh-Hans':'拖动平移 · 双指缩放与旋转',ja:'ドラッグで移動 · ピンチで拡大縮小と回転',ko:'드래그로 이동 · 두 손가락으로 확대·회전',es:'Arrastra para mover · pellizca para zoom y giro', 'pt-BR':'Arraste para mover · use dois dedos para zoom e giro',fr:'Glisser pour déplacer · pincer pour zoomer et tourner',de:'Ziehen zum Schwenken · Zwei Finger für Zoom und Drehung',it:'Trascina per spostare · usa due dita per zoom e rotazione',ru:'Перетаскивайте для панорамирования · жест двумя пальцами меняет масштаб и угол',hi:'खींचकर पैन करें · दो उँगलियों से ज़ूम व घुमाएँ',ar:'اسحب للتحريك · استخدم إصبعين للتكبير والتدوير'};
for(const locale of supportedLocales){dict[locale].canvasLabel=panCanvasCopy[locale]||panCanvasCopy.en;dict[locale].viewHint=panGestureCopy[locale]||panGestureCopy.en}



const storedWarehouseCopy={en:'Stored in warehouse.', 'zh-Hant':'已存入倉庫。','zh-Hans':'已存入仓库。',ja:'倉庫に保管しました。',ko:'창고에 보관했습니다.',es:'Guardado en el almacén.','pt-BR':'Guardado no depósito.',fr:'Rangé dans l’entrepôt.',de:'Im Lager eingelagert.',it:'Riposto nel magazzino.',ru:'Убрано на склад.',hi:'गोदाम में रखा गया।',ar:'تم التخزين في المستودع.'};
for(const locale of supportedLocales)dict[locale].storedWarehouse=storedWarehouseCopy[locale]||storedWarehouseCopy.en;
keys.push('storedWarehouse');

const v9Keys='cookies|chips|juice|sparklingDrink|popularity|noTileSelected|selectedTile|selectFloorFirst|selectFloorThenPlace|productVariety|newGoods|oneTile|twoTiles|fourTiles|footprint|rotateFixture|turnFixturePrompt|moveFixture|dragFixturePrompt|selectedFixture|cashRegister|cashierService|cashierCountLabel|hireCashier|cashierHireDetail|cashierHired|cashierQueueSummary|popularityRecovery|popularityRecoveryDetail|coolerInstalled|moreCapacity|lastCashierCounter|keepStockAndLevel|onShelf|unlockAt|placementBlocked|shelfForSelectedProduct|doubleShelf|smallShelf|decorAppeal'.split('|');
const v9Copy={
  en:['Cookies','Chips','Juice','Sparkling drink','Popularity','No floor selected','Selected floor','Select a floor tile first.','Select a floor tile, then confirm placement.','Product variety','New goods','1 tile','2 tiles','4 tiles','Footprint','Rotate','Turn the fixture before placing it.','Move fixture','Drag to move this fixture.','Selected fixture','Cash register','Faces shoppers at the counter','Cashiers / registers','Hire cashier','Adds a cashier for an open register','Cashier hired','Queue length and popularity affect visits','Popularity recovery','Good service and decor help restore popularity','Cooler installed','More storage capacity','Keep one staffed register in the shop.','Preserves stock and upgrades','in stock','Unlock at lifetime sales','That placement is blocked. No purchase was made.','Place a shelf for the selected product.','Double shelf','Small shelf','Decor appeal'],
  'zh-Hant':['餅乾','洋芋片','果汁','氣泡飲','人氣','尚未選取地板','已選地板','請先選取地板格。','選擇地板格後，再確認擺放。','商品多樣性','新商品','1 格','2 格','4 格','占地','旋轉','擺放前可旋轉設備。','移動設備','拖曳可移動此設備。','已選設備','收銀台','面向櫃台服務顧客','收銀員／櫃台','聘請收銀員','為空櫃台增加一名收銀員','已聘請收銀員','排隊長度與人氣會影響來客','人氣回升','良好服務與裝飾能逐步恢復人氣','冷藏櫃已安裝','增加庫存容量','店內至少保留一個有人的收銀台。','保留庫存與升級','庫存','累計銷售達標解鎖','此位置無法擺放，沒有扣款。','為選取的商品擺放貨架。','雙格貨架','單格貨架','裝飾人氣'],
  'zh-Hans':['饼干','薯片','果汁','气泡饮','人气','尚未选择地板','已选地板','请先选择地板格。','选择地板格后，再确认摆放。','商品多样性','新商品','1 格','2 格','4 格','占地','旋转','摆放前可旋转设备。','移动设备','拖动可移动此设备。','已选设备','收银台','面向柜台服务顾客','收银员／柜台','聘请收银员','为开放柜台增加一名收银员','已聘请收银员','排队长度与人气会影响来客','人气回升','良好服务与装饰能逐步恢复人气','冷柜已安装','增加库存容量','店内至少保留一个有人值守的收银台。','保留库存与升级','库存','累计销售达标解锁','此位置无法摆放，没有扣款。','为选中的商品摆放货架。','双格货架','单格货架','装饰人气']
};
Object.assign(v9Copy,{
  "ja": [
    "クッキー",
    "ポテトチップス",
    "ジュース",
    "炭酸飲料",
    "人気度",
    "床は未選択",
    "選択した床",
    "先に床のマスを選んでください。",
    "床のマスを選び、配置を確定してください。",
    "商品の種類",
    "新商品",
    "1マス",
    "2マス",
    "4マス",
    "設置面積",
    "回転",
    "配置前に設備を回転できます。",
    "設備を移動",
    "ドラッグして設備を移動。",
    "選択した設備",
    "レジ",
    "レジでお客さんに向いて接客",
    "レジ係／レジ",
    "レジ係を雇う",
    "空いているレジに担当者を追加",
    "レジ係を雇いました",
    "行列の長さと人気度が来店に影響します",
    "人気度の回復",
    "良い接客と装飾で人気度が回復します",
    "冷蔵ケース設置済み",
    "在庫容量を増やす",
    "担当者のいるレジを最低1台残してください。",
    "在庫と強化を保ちます",
    "在庫",
    "累計売上で解放",
    "ここには置けません。購入は行われていません。",
    "選んだ商品の棚を配置してください。",
    "2枠の棚",
    "1枠の棚",
    "装飾の人気効果"
  ],
  "ko": [
    "쿠키",
    "감자칩",
    "주스",
    "탄산음료",
    "인기도",
    "선택한 바닥 없음",
    "선택한 바닥",
    "먼저 바닥 칸을 선택하세요.",
    "바닥 칸을 선택한 뒤 배치를 확인하세요.",
    "상품 종류",
    "새 상품",
    "1칸",
    "2칸",
    "4칸",
    "설치 면적",
    "회전",
    "배치 전에 기기를 회전할 수 있어요.",
    "기기 이동",
    "드래그해서 기기를 이동하세요.",
    "선택한 기기",
    "계산대",
    "계산대에서 손님을 향해 응대",
    "계산원 / 계산대",
    "계산원 고용",
    "빈 계산대에 계산원을 배치",
    "계산원을 고용했어요",
    "대기줄과 인기도가 방문에 영향을 줍니다",
    "인기도 회복",
    "좋은 응대와 장식으로 인기도를 회복합니다",
    "냉장 진열대 설치됨",
    "보관 용량 확대",
    "직원이 있는 계산대 하나는 남겨 두세요.",
    "재고와 업그레이드를 유지합니다",
    "재고",
    "누적 매출로 잠금 해제",
    "여기에는 놓을 수 없어요. 구매하지 않았어요.",
    "선택한 상품을 위한 선반을 배치하세요.",
    "두 칸 선반",
    "한 칸 선반",
    "장식 인기 효과"
  ],
  "es": [
    "Galletas",
    "Patatas fritas",
    "Zumo",
    "Bebida con gas",
    "Popularidad",
    "Sin casilla seleccionada",
    "Casilla seleccionada",
    "Selecciona primero una casilla del suelo.",
    "Selecciona una casilla y confirma la colocación.",
    "Variedad de productos",
    "Nuevos productos",
    "1 casilla",
    "2 casillas",
    "4 casillas",
    "Tamaño",
    "Girar",
    "Puedes girar el equipo antes de colocarlo.",
    "Mover equipo",
    "Arrastra para mover este equipo.",
    "Equipo seleccionado",
    "Caja",
    "Atiende a los clientes de frente en la caja",
    "Cajeros / cajas",
    "Contratar cajero",
    "Añade un cajero a una caja libre",
    "Cajero contratado",
    "La cola y la popularidad afectan a las visitas",
    "Recuperación de popularidad",
    "El buen servicio y la decoración recuperan popularidad",
    "Refrigerador instalado",
    "Más capacidad de almacén",
    "Conserva al menos una caja con cajero.",
    "Conserva existencias y mejoras",
    "en stock",
    "Se desbloquea con ventas acumuladas",
    "No se puede colocar aquí. No se ha comprado nada.",
    "Coloca un estante para el producto seleccionado.",
    "Estante doble",
    "Estante sencillo",
    "Atractivo de la decoración"
  ],
  "pt-BR": [
    "Biscoitos",
    "Batatas chips",
    "Suco",
    "Bebida gaseificada",
    "Popularidade",
    "Nenhum piso selecionado",
    "Piso selecionado",
    "Selecione primeiro um quadrado do piso.",
    "Selecione um quadrado e confirme a posição.",
    "Variedade de produtos",
    "Novos produtos",
    "1 quadrado",
    "2 quadrados",
    "4 quadrados",
    "Tamanho",
    "Girar",
    "Você pode girar o equipamento antes de posicioná-lo.",
    "Mover equipamento",
    "Arraste para mover este equipamento.",
    "Equipamento selecionado",
    "Caixa",
    "Atende os clientes de frente no caixa",
    "Operadores / caixas",
    "Contratar operador",
    "Adiciona um operador a um caixa livre",
    "Operador contratado",
    "A fila e a popularidade afetam as visitas",
    "Recuperação de popularidade",
    "Bom atendimento e decoração recuperam a popularidade",
    "Refrigerador instalado",
    "Mais capacidade de estoque",
    "Mantenha ao menos um caixa com operador.",
    "Preserva o estoque e as melhorias",
    "em estoque",
    "Desbloqueia com vendas acumuladas",
    "Não é possível posicionar aqui. Nenhuma compra foi feita.",
    "Posicione uma prateleira para o produto selecionado.",
    "Prateleira dupla",
    "Prateleira simples",
    "Atratividade da decoração"
  ],
  "fr": [
    "Biscuits",
    "Chips",
    "Jus",
    "Boisson gazeuse",
    "Popularité",
    "Aucune case sélectionnée",
    "Case sélectionnée",
    "Sélectionnez d’abord une case au sol.",
    "Sélectionnez une case puis confirmez la pose.",
    "Variété de produits",
    "Nouveaux produits",
    "1 case",
    "2 cases",
    "4 cases",
    "Surface",
    "Tourner",
    "Vous pouvez tourner l’équipement avant de le poser.",
    "Déplacer l’équipement",
    "Faites glisser cet équipement pour le déplacer.",
    "Équipement sélectionné",
    "Caisse",
    "Sert les clients face à eux à la caisse",
    "Caissiers / caisses",
    "Embaucher un caissier",
    "Ajoute un caissier à une caisse libre",
    "Caissier embauché",
    "La file et la popularité influencent les visites",
    "Retour de popularité",
    "Un bon service et la décoration restaurent la popularité",
    "Réfrigérateur installé",
    "Plus de capacité de stockage",
    "Gardez au moins une caisse avec un caissier.",
    "Conserve le stock et les améliorations",
    "en stock",
    "Débloqué avec les ventes cumulées",
    "Impossible de poser ici. Aucun achat n’a été effectué.",
    "Posez un rayon pour le produit sélectionné.",
    "Rayon double",
    "Rayon simple",
    "Attrait de la décoration"
  ],
  "de": [
    "Kekse",
    "Chips",
    "Saft",
    "Sprudelgetränk",
    "Beliebtheit",
    "Kein Bodenfeld gewählt",
    "Gewähltes Bodenfeld",
    "Wähle zuerst ein Bodenfeld.",
    "Wähle ein Bodenfeld und bestätige die Platzierung.",
    "Produktvielfalt",
    "Neue Produkte",
    "1 Feld",
    "2 Felder",
    "4 Felder",
    "Grundfläche",
    "Drehen",
    "Drehe das Gerät bei Bedarf vor dem Platzieren.",
    "Gerät verschieben",
    "Ziehe das Gerät zum Verschieben.",
    "Gewähltes Gerät",
    "Kasse",
    "Bedient Kunden mit Blick zu ihnen an der Kasse",
    "Kassierer / Kassen",
    "Kassierer einstellen",
    "Besetzt eine freie Kasse mit einem Kassierer",
    "Kassierer eingestellt",
    "Warteschlange und Beliebtheit beeinflussen Besuche",
    "Beliebtheit erholen",
    "Guter Service und Deko erhöhen die Beliebtheit",
    "Kühlregal aufgestellt",
    "Mehr Lagerkapazität",
    "Behalte mindestens eine besetzte Kasse im Laden.",
    "Behält Vorrat und Verbesserungen",
    "auf Lager",
    "Freischaltung durch Gesamtumsatz",
    "Hier ist keine Platzierung möglich. Es wurde nichts gekauft.",
    "Platziere ein Regal für das gewählte Produkt.",
    "Doppelregal",
    "Einfachregal",
    "Deko-Anziehungskraft"
  ],
  "it": [
    "Biscotti",
    "Patatine",
    "Succo",
    "Bibita frizzante",
    "Popolarità",
    "Nessuna casella selezionata",
    "Casella selezionata",
    "Seleziona prima una casella del pavimento.",
    "Seleziona una casella e conferma la posizione.",
    "Varietà di prodotti",
    "Nuovi prodotti",
    "1 casella",
    "2 caselle",
    "4 caselle",
    "Ingombro",
    "Ruota",
    "Puoi ruotare l’attrezzatura prima di posizionarla.",
    "Sposta attrezzatura",
    "Trascina per spostare questa attrezzatura.",
    "Attrezzatura selezionata",
    "Cassa",
    "Serve i clienti rivolto verso di loro alla cassa",
    "Cassieri / casse",
    "Assumi cassiere",
    "Aggiunge un cassiere a una cassa libera",
    "Cassiere assunto",
    "La coda e la popolarità influenzano le visite",
    "Recupero della popolarità",
    "Un buon servizio e gli arredi recuperano la popolarità",
    "Frigorifero installato",
    "Più capacità di magazzino",
    "Mantieni almeno una cassa con un cassiere.",
    "Conserva scorte e miglioramenti",
    "in scorta",
    "Si sblocca con le vendite cumulative",
    "Non puoi posizionare qui. Nessun acquisto effettuato.",
    "Posiziona uno scaffale per il prodotto selezionato.",
    "Scaffale doppio",
    "Scaffale singolo",
    "Attrattiva degli arredi"
  ],
  "ru": [
    "Печенье",
    "Чипсы",
    "Сок",
    "Газированный напиток",
    "Популярность",
    "Клетка пола не выбрана",
    "Выбранная клетка",
    "Сначала выберите клетку пола.",
    "Выберите клетку пола и подтвердите размещение.",
    "Разнообразие товаров",
    "Новые товары",
    "1 клетка",
    "2 клетки",
    "4 клетки",
    "Размер",
    "Повернуть",
    "Перед размещением можно повернуть оборудование.",
    "Переместить оборудование",
    "Перетащите это оборудование для перемещения.",
    "Выбранное оборудование",
    "Касса",
    "Обслуживает покупателей лицом к ним у кассы",
    "Кассиры / кассы",
    "Нанять кассира",
    "Добавляет кассира к свободной кассе",
    "Кассир нанят",
    "Очередь и популярность влияют на посещения",
    "Восстановление популярности",
    "Хорошее обслуживание и декор восстанавливают популярность",
    "Холодильная витрина установлена",
    "Больше места для запасов",
    "Оставьте хотя бы одну кассу с кассиром.",
    "Сохраняет запасы и улучшения",
    "в запасе",
    "Открывается по общей выручке",
    "Здесь нельзя разместить. Покупка не совершена.",
    "Разместите полку для выбранного товара.",
    "Двойная полка",
    "Одинарная полка",
    "Привлекательность декора"
  ],
  "hi": [
    "कुकीज़",
    "चिप्स",
    "जूस",
    "गैसयुक्त पेय",
    "लोकप्रियता",
    "फ़र्श की जगह नहीं चुनी",
    "चुनी गई जगह",
    "पहले फ़र्श की जगह चुनें।",
    "फ़र्श की जगह चुनकर रखने की पुष्टि करें।",
    "उत्पादों की विविधता",
    "नए उत्पाद",
    "1 खाना",
    "2 खाने",
    "4 खाने",
    "आकार",
    "घुमाएँ",
    "रखने से पहले उपकरण घुमा सकते हैं।",
    "उपकरण खिसकाएँ",
    "इस उपकरण को खिसकाने के लिए खींचें।",
    "चुना गया उपकरण",
    "कैश काउंटर",
    "काउंटर पर ग्राहकों की ओर देखकर सेवा करता है",
    "कैशियर / काउंटर",
    "कैशियर नियुक्त करें",
    "खाली काउंटर के लिए कैशियर जोड़ता है",
    "कैशियर नियुक्त हुआ",
    "कतार और लोकप्रियता ग्राहकों के आने पर असर डालती हैं",
    "लोकप्रियता की वापसी",
    "अच्छी सेवा और सजावट से लोकप्रियता लौटती है",
    "शीतल अलमारी लग गई",
    "ज़्यादा भंडारण क्षमता",
    "दुकान में कैशियर वाला एक काउंटर ज़रूर रखें।",
    "सामान और सुधार सुरक्षित रहते हैं",
    "स्टॉक में",
    "कुल बिक्री से खुलेगा",
    "यहाँ नहीं रख सकते। कोई खरीद नहीं हुई।",
    "चुने हुए उत्पाद के लिए शेल्फ़ रखें।",
    "दो खाने वाला शेल्फ़",
    "एक खाने वाला शेल्फ़",
    "सजावट का आकर्षण"
  ],
  "ar": [
    "بسكويت",
    "رقائق البطاطس",
    "عصير",
    "مشروب غازي",
    "الشعبية",
    "لم تُحدد خانة أرضية",
    "الخانة المحددة",
    "حدد خانة أرضية أولاً.",
    "حدد خانة أرضية ثم أكّد الوضع.",
    "تنوع المنتجات",
    "منتجات جديدة",
    "خانة واحدة",
    "خانتان",
    "أربع خانات",
    "المساحة",
    "تدوير",
    "يمكن تدوير التجهيز قبل وضعه.",
    "نقل التجهيز",
    "اسحب لنقل هذا التجهيز.",
    "التجهيز المحدد",
    "صندوق الدفع",
    "يخدم الزبائن مواجهاً لهم عند صندوق الدفع",
    "موظفو الدفع / الصناديق",
    "توظيف أمين صندوق",
    "يضيف موظفاً لصندوق دفع شاغر",
    "تم توظيف أمين صندوق",
    "يؤثر طول الطابور والشعبية في الزيارات",
    "استعادة الشعبية",
    "الخدمة الجيدة والزينة تعيدان الشعبية",
    "تم تركيب الثلاجة",
    "سعة مخزون أكبر",
    "اترك صندوق دفع واحداً على الأقل مع موظف.",
    "يحفظ المخزون والترقيات",
    "في المخزون",
    "يُفتح بإجمالي المبيعات",
    "لا يمكن الوضع هنا. لم تتم أي عملية شراء.",
    "ضع رفاً للمنتج المحدد.",
    "رف مزدوج",
    "رف مفرد",
    "جاذبية الزينة"
  ]
});
for(const locale of supportedLocales){const values=v9Copy[locale]||v9Copy.en;Object.assign(dict[locale],Object.fromEntries(v9Keys.map((key,index)=>[key,values[index]])))}
const managementCopy={
  en:{chooseProduct:'Choose product',shelfProductChanged:'Shelf product updated.',warehouseSummary:'Owned fixtures',owned:'owned',placed:'placed',stored:'stored',spendingTitle:'Cash activity',recoveryInvoice:'Recovery debt',noSpendRecords:'No cash activity yet.',manualOrderLabel:'Manual restock',automaticWaterOrder:'Automatic water order',purchaseLabel:'Purchase',salesLabel:'Sale',debtBorrowedLabel:'Debt added',debtPaidLabel:'Debt repaid',openCashActivity:'Open cash activity',autoRestockOptIn:'Only enabled automatic orders spend cash.',autoRestockOn:'Auto-restock on',autoRestockOff:'Auto-restock off',autoRestockTurnedOn:'Automatic restocking enabled.',autoRestockTurnedOff:'Automatic restocking disabled.',routeBlocked:'This blocks a shopper route.',routeOpen:'Shopper routes stay open.',routeSafetyHint:'Keep a clear path from entrances to a staffed register and exit.',entrance:'Shop entrance',exit:'Shop exit',explainPopularity:'Popularity affects how often shoppers visit.',helperAutoRestockHint:'Automatic orders are off until you turn them on.'},
  'zh-Hant':{chooseProduct:'選擇商品',shelfProductChanged:'已更換貨架商品。',warehouseSummary:'設備總覽',owned:'持有',placed:'已擺放',stored:'已收納',spendingTitle:'現金收支',recoveryInvoice:'補貨欠款',noSpendRecords:'目前沒有現金紀錄。',manualOrderLabel:'手動補貨',automaticWaterOrder:'自動訂購礦泉水',purchaseLabel:'購買',salesLabel:'銷售收入',debtBorrowedLabel:'新增欠款',debtPaidLabel:'償還欠款',openCashActivity:'查看現金收支',autoRestockOptIn:'只有開啟後，自動訂單才會扣款。',autoRestockOn:'自動補貨：開啟',autoRestockOff:'自動補貨：關閉',autoRestockTurnedOn:'已開啟自動補貨。',autoRestockTurnedOff:'已關閉自動補貨。',routeBlocked:'此位置會擋住顧客路線。',routeOpen:'顧客路線保持暢通。',routeSafetyHint:'入口、有人收銀台與出口之間請保持通道暢通。',entrance:'店鋪入口',exit:'店鋪出口',explainPopularity:'人氣會影響顧客來店頻率。',helperAutoRestockHint:'自動訂購預設關閉；需要時可自行開啟。'},
  'zh-Hans':{chooseProduct:'选择商品',shelfProductChanged:'已更换货架商品。',warehouseSummary:'设备总览',owned:'持有',placed:'已摆放',stored:'已收纳',spendingTitle:'现金收支',recoveryInvoice:'补货欠款',noSpendRecords:'目前没有现金记录。',manualOrderLabel:'手动补货',automaticWaterOrder:'自动订购矿泉水',purchaseLabel:'购买',salesLabel:'销售收入',debtBorrowedLabel:'新增欠款',debtPaidLabel:'偿还欠款',openCashActivity:'查看现金收支',autoRestockOptIn:'只有开启后，自动订单才会扣款。',autoRestockOn:'自动补货：开启',autoRestockOff:'自动补货：关闭',autoRestockTurnedOn:'已开启自动补货。',autoRestockTurnedOff:'已关闭自动补货。',routeBlocked:'此位置会挡住顾客路线。',routeOpen:'顾客路线保持畅通。',routeSafetyHint:'入口、有人收银台与出口之间请保持通道畅通。',entrance:'店铺入口',exit:'店铺出口',explainPopularity:'人气会影响顾客到店频率。',helperAutoRestockHint:'自动订购默认关闭；需要时可自行开启。'},
  ja:{chooseProduct:'商品を選択',shelfProductChanged:'棚の商品を変更しました。',warehouseSummary:'設備一覧',owned:'所有',placed:'設置中',stored:'保管中',spendingTitle:'現金の記録',recoveryInvoice:'補給の負債',noSpendRecords:'現金の記録はありません。',manualOrderLabel:'手動補充',automaticWaterOrder:'水の自動注文',purchaseLabel:'購入',salesLabel:'売上',debtBorrowedLabel:'負債の追加',debtPaidLabel:'負債の返済',openCashActivity:'現金の記録を開く',autoRestockOptIn:'自動注文は有効にした場合のみ現金を使います。',autoRestockOn:'自動補充：オン',autoRestockOff:'自動補充：オフ',autoRestockTurnedOn:'自動補充を有効にしました。',autoRestockTurnedOff:'自動補充を無効にしました。',routeBlocked:'買い物客の通路を塞ぎます。',routeOpen:'買い物客の通路を確保しています。',routeSafetyHint:'入口、有人レジ、出口の間に通路を確保してください。',entrance:'店舗入口',exit:'店舗出口',explainPopularity:'人気度は来店頻度に影響します。',helperAutoRestockHint:'自動注文は初期状態でオフです。'},
  ko:{chooseProduct:'상품 선택',shelfProductChanged:'진열 상품을 변경했습니다.',warehouseSummary:'시설 보유 현황',owned:'보유',placed:'배치됨',stored:'보관됨',spendingTitle:'현금 내역',recoveryInvoice:'보충 부채',noSpendRecords:'현금 내역이 없습니다.',manualOrderLabel:'수동 보충',automaticWaterOrder:'물 자동 주문',purchaseLabel:'구매',salesLabel:'판매',debtBorrowedLabel:'부채 추가',debtPaidLabel:'부채 상환',openCashActivity:'현금 내역 열기',autoRestockOptIn:'자동 주문은 켰을 때만 현금을 사용합니다.',autoRestockOn:'자동 보충 켜짐',autoRestockOff:'자동 보충 꺼짐',autoRestockTurnedOn:'자동 보충을 켰습니다.',autoRestockTurnedOff:'자동 보충을 껐습니다.',routeBlocked:'손님 통로를 막습니다.',routeOpen:'손님 통로가 열려 있습니다.',routeSafetyHint:'입구, 직원이 있는 계산대, 출구 사이 통로를 비워 두세요.',exit:'매장 출구',explainPopularity:'인기도에 따라 손님 방문 빈도가 달라집니다.',helperAutoRestockHint:'자동 주문은 기본으로 꺼져 있습니다.'},
  es:{chooseProduct:'Elegir producto',shelfProductChanged:'Producto del estante actualizado.',warehouseSummary:'Equipo disponible',owned:'en propiedad',placed:'colocado',stored:'guardado',spendingTitle:'Movimientos de caja',recoveryInvoice:'Deuda de reposición',noSpendRecords:'Aún no hay movimientos.',manualOrderLabel:'Reposición manual',automaticWaterOrder:'Pedido automático de agua',purchaseLabel:'Compra',salesLabel:'Venta',debtBorrowedLabel:'Deuda añadida',debtPaidLabel:'Deuda pagada',openCashActivity:'Ver movimientos de caja',autoRestockOptIn:'Los pedidos automáticos solo gastan dinero si los activas.',autoRestockOn:'Reposición automática activada',autoRestockOff:'Reposición automática desactivada',autoRestockTurnedOn:'Reposición automática activada.',autoRestockTurnedOff:'Reposición automática desactivada.',routeBlocked:'Bloquea el paso de los clientes.',routeOpen:'Los caminos de clientes quedan libres.',routeSafetyHint:'Deja un camino entre entradas, cajas atendidas y salida.',exit:'Salida de la tienda',explainPopularity:'La popularidad influye en la frecuencia de visitas.',helperAutoRestockHint:'Los pedidos automáticos empiezan desactivados.'},
  'pt-BR':{chooseProduct:'Escolher produto',shelfProductChanged:'Produto da prateleira atualizado.',warehouseSummary:'Equipamentos disponíveis',owned:'em estoque',placed:'posicionado',stored:'guardado',spendingTitle:'Movimentação do caixa',recoveryInvoice:'Dívida de reposição',noSpendRecords:'Ainda não há movimentações.',manualOrderLabel:'Reposição manual',automaticWaterOrder:'Pedido automático de água',purchaseLabel:'Compra',salesLabel:'Venda',debtBorrowedLabel:'Dívida adicionada',debtPaidLabel:'Dívida paga',openCashActivity:'Ver movimentação do caixa',autoRestockOptIn:'Pedidos automáticos só gastam dinheiro quando ativados.',autoRestockOn:'Reposição automática ativada',autoRestockOff:'Reposição automática desativada',autoRestockTurnedOn:'Reposição automática ativada.',autoRestockTurnedOff:'Reposição automática desativada.',routeBlocked:'Bloqueia o caminho dos clientes.',routeOpen:'Os caminhos dos clientes ficam livres.',routeSafetyHint:'Mantenha uma passagem entre entradas, caixas atendidos e saída.',exit:'Saída da loja',explainPopularity:'A popularidade influencia a frequência de visitas.',helperAutoRestockHint:'Pedidos automáticos começam desativados.'},
  fr:{chooseProduct:'Choisir un produit',shelfProductChanged:'Produit du rayon modifié.',warehouseSummary:'Équipements disponibles',owned:'possédé',placed:'installé',stored:'rangé',spendingTitle:'Mouvements de caisse',recoveryInvoice:'Dette de réapprovisionnement',noSpendRecords:'Aucun mouvement pour le moment.',manualOrderLabel:'Réappro manuel',automaticWaterOrder:'Commande automatique d’eau',purchaseLabel:'Achat',salesLabel:'Vente',debtBorrowedLabel:'Dette ajoutée',debtPaidLabel:'Dette remboursée',openCashActivity:'Voir les mouvements de caisse',autoRestockOptIn:'Les commandes automatiques dépensent uniquement si elles sont activées.',autoRestockOn:'Réappro auto activé',autoRestockOff:'Réappro auto désactivé',autoRestockTurnedOn:'Réapprovisionnement automatique activé.',autoRestockTurnedOff:'Réapprovisionnement automatique désactivé.',routeBlocked:'Bloque le passage des clients.',routeOpen:'Les passages des clients restent libres.',routeSafetyHint:'Gardez un passage entre les entrées, caisses avec personnel et sortie.',exit:'Sortie du magasin',explainPopularity:'La popularité influence la fréquence des visites.',helperAutoRestockHint:'Les commandes automatiques sont désactivées par défaut.'},
  de:{chooseProduct:'Produkt wählen',shelfProductChanged:'Regalprodukt geändert.',warehouseSummary:'Vorhandene Ausstattung',owned:'im Besitz',placed:'aufgestellt',stored:'eingelagert',spendingTitle:'Kassenbewegungen',recoveryInvoice:'Nachbestellschulden',noSpendRecords:'Noch keine Kassenbewegungen.',manualOrderLabel:'Manuelle Auffüllung',automaticWaterOrder:'Automatische Wasserbestellung',purchaseLabel:'Kauf',salesLabel:'Verkauf',debtBorrowedLabel:'Schulden aufgenommen',debtPaidLabel:'Schulden beglichen',openCashActivity:'Kassenbewegungen öffnen',autoRestockOptIn:'Automatische Bestellungen kosten nur bei Aktivierung Geld.',autoRestockOn:'Automatische Auffüllung an',autoRestockOff:'Automatische Auffüllung aus',autoRestockTurnedOn:'Automatische Auffüllung aktiviert.',autoRestockTurnedOff:'Automatische Auffüllung deaktiviert.',routeBlocked:'Versperrt den Kundenweg.',routeOpen:'Kundenwege bleiben frei.',routeSafetyHint:'Halte Wege zwischen Eingängen, besetzten Kassen und Ausgang frei.',exit:'Ladenausgang',explainPopularity:'Die Beliebtheit beeinflusst die Besuchshäufigkeit.',helperAutoRestockHint:'Automatische Bestellungen sind standardmäßig ausgeschaltet.'},
  it:{chooseProduct:'Scegli prodotto',shelfProductChanged:'Prodotto dello scaffale aggiornato.',warehouseSummary:'Attrezzature disponibili',owned:'posseduto',placed:'posizionato',stored:'in magazzino',spendingTitle:'Movimenti di cassa',recoveryInvoice:'Debito di rifornimento',noSpendRecords:'Nessun movimento registrato.',manualOrderLabel:'Rifornimento manuale',automaticWaterOrder:'Ordine automatico d’acqua',purchaseLabel:'Acquisto',salesLabel:'Vendita',debtBorrowedLabel:'Debito aggiunto',debtPaidLabel:'Debito saldato',openCashActivity:'Apri movimenti di cassa',autoRestockOptIn:'Gli ordini automatici spendono solo se attivati.',autoRestockOn:'Rifornimento automatico attivo',autoRestockOff:'Rifornimento automatico disattivo',autoRestockTurnedOn:'Rifornimento automatico attivato.',autoRestockTurnedOff:'Rifornimento automatico disattivato.',routeBlocked:'Blocca il percorso dei clienti.',routeOpen:'I percorsi dei clienti restano liberi.',routeSafetyHint:'Lascia libero il passaggio tra ingressi, casse presidiate e uscita.',exit:'Uscita del negozio',explainPopularity:'La popolarità influenza la frequenza delle visite.',helperAutoRestockHint:'Gli ordini automatici sono disattivati all’inizio.'},
  ru:{chooseProduct:'Выбрать товар',shelfProductChanged:'Товар на полке изменён.',warehouseSummary:'Имеющееся оборудование',owned:'всего',placed:'установлено',stored:'на складе',spendingTitle:'Движение денег',recoveryInvoice:'Долг за поставку',noSpendRecords:'Записей пока нет.',manualOrderLabel:'Ручное пополнение',automaticWaterOrder:'Автозаказ воды',purchaseLabel:'Покупка',salesLabel:'Продажа',debtBorrowedLabel:'Новый долг',debtPaidLabel:'Долг погашен',openCashActivity:'Открыть движение денег',autoRestockOptIn:'Автозаказы тратят деньги только после включения.',autoRestockOn:'Автопополнение включено',autoRestockOff:'Автопополнение выключено',autoRestockTurnedOn:'Автопополнение включено.',autoRestockTurnedOff:'Автопополнение выключено.',routeBlocked:'Перекрывает путь покупателей.',routeOpen:'Пути покупателей свободны.',routeSafetyHint:'Оставьте проход между входами, кассой с сотрудником и выходом.',exit:'Выход из магазина',explainPopularity:'Популярность влияет на частоту визитов.',helperAutoRestockHint:'Автозаказы изначально выключены.'},
  hi:{chooseProduct:'उत्पाद चुनें',shelfProductChanged:'शेल्फ़ का उत्पाद बदला गया।',warehouseSummary:'मौजूद उपकरण',owned:'कुल',placed:'रखा हुआ',stored:'गोदाम में',spendingTitle:'नकद गतिविधि',recoveryInvoice:'स्टॉक का कर्ज़',noSpendRecords:'अभी कोई नकद रिकॉर्ड नहीं।',manualOrderLabel:'हाथ से स्टॉक भरना',automaticWaterOrder:'पानी का स्वतः ऑर्डर',purchaseLabel:'खरीद',salesLabel:'बिक्री',debtBorrowedLabel:'कर्ज़ बढ़ा',debtPaidLabel:'कर्ज़ चुकाया',openCashActivity:'नकद गतिविधि खोलें',autoRestockOptIn:'स्वतः ऑर्डर चालू करने पर ही नकद खर्च होता है।',autoRestockOn:'स्वतः स्टॉक भरना चालू',autoRestockOff:'स्वतः स्टॉक भरना बंद',autoRestockTurnedOn:'स्वतः स्टॉक भरना चालू किया।',autoRestockTurnedOff:'स्वतः स्टॉक भरना बंद किया।',routeBlocked:'ग्राहकों का रास्ता बंद होगा।',routeOpen:'ग्राहकों के रास्ते खुले रहेंगे।',routeSafetyHint:'प्रवेश, कर्मचारी वाली कैश काउंटर और निकास के बीच रास्ता खुला रखें।',exit:'दुकान का निकास',explainPopularity:'लोकप्रियता से ग्राहकों के आने की आवृत्ति बदलती है।',helperAutoRestockHint:'स्वतः ऑर्डर शुरू में बंद रहते हैं।'},
  ar:{chooseProduct:'اختر منتجاً',shelfProductChanged:'تم تغيير منتج الرف.',warehouseSummary:'الأجهزة المتوفرة',owned:'الإجمالي',placed:'موضوع',stored:'مخزن',spendingTitle:'حركة النقد',recoveryInvoice:'دين التوريد',noSpendRecords:'لا توجد حركة نقدية بعد.',manualOrderLabel:'إعادة تعبئة يدوية',automaticWaterOrder:'طلب ماء تلقائي',purchaseLabel:'شراء',salesLabel:'بيع',debtBorrowedLabel:'إضافة دين',debtPaidLabel:'سداد دين',openCashActivity:'فتح حركة النقد',autoRestockOptIn:'الطلبات التلقائية تنفق النقد عند تفعيلها فقط.',autoRestockOn:'إعادة التعبئة التلقائية مفعلة',autoRestockOff:'إعادة التعبئة التلقائية متوقفة',autoRestockTurnedOn:'تم تفعيل إعادة التعبئة التلقائية.',autoRestockTurnedOff:'تم إيقاف إعادة التعبئة التلقائية.',routeBlocked:'سيحجب مسار الزبائن.',routeOpen:'مسارات الزبائن مفتوحة.',routeSafetyHint:'اترك ممراً بين المداخل والصناديق المأهولة والمخرج.',exit:'مخرج المتجر',explainPopularity:'تؤثر الشعبية في وتيرة زيارة الزبائن.',helperAutoRestockHint:'الطلبات التلقائية متوقفة افتراضياً.'}
};
for(const locale of supportedLocales)Object.assign(dict[locale],managementCopy[locale]||managementCopy.en);
const entranceCopy={en:'Shop entrance','zh-Hant':'店鋪入口','zh-Hans':'店铺入口',ja:'店舗入口',ko:'매장 입구',es:'Entrada de la tienda','pt-BR':'Entrada da loja',fr:'Entrée du magasin',de:'Ladeneingang',it:'Ingresso del negozio',ru:'Вход в магазин',hi:'दुकान का प्रवेश-द्वार',ar:'مدخل المتجر'};
for(const locale of supportedLocales)dict[locale].entrance=entranceCopy[locale];
const fixtureCopy={en:{product:'Product',selected:'Selected'},'zh-Hant':{product:'商品',selected:'已選取'},'zh-Hans':{product:'商品',selected:'已选择'},ja:{product:'商品',selected:'選択中'},ko:{product:'상품',selected:'선택됨'},es:{product:'Producto',selected:'Seleccionado'},'pt-BR':{product:'Produto',selected:'Selecionado'},fr:{product:'Produit',selected:'Sélectionné'},de:{product:'Produkt',selected:'Ausgewählt'},it:{product:'Prodotto',selected:'Selezionato'},ru:{product:'Товар',selected:'Выбрано'},hi:{product:'उत्पाद',selected:'चयनित'},ar:{product:'منتج',selected:'محدد'}};
for(const locale of supportedLocales)Object.assign(dict[locale],fixtureCopy[locale]);
const endpointCopy={
  en:{setEntrance:'Set entrance',setExit:'Set exit',entranceSaved:'Entrance saved.',exitSaved:'Exit saved.',endpointPickHint:'Tap a clear edge tile; keep the staffed checkout reachable.'},
  'zh-Hant':{setEntrance:'設定入口',setExit:'設定出口',entranceSaved:'入口已更新。',exitSaved:'出口已更新。',endpointPickHint:'點選空的邊緣地板格，並保留通往有人收銀台的路線。'},
  'zh-Hans':{setEntrance:'设置入口',setExit:'设置出口',entranceSaved:'入口已更新。',exitSaved:'出口已更新。',endpointPickHint:'点击空的边缘地板格，并保留通往有人收银台的路线。'},
  ja:{setEntrance:'入口を設定',setExit:'出口を設定',entranceSaved:'入口を更新しました。',exitSaved:'出口を更新しました。',endpointPickHint:'空いている端のタイルを選び、有人レジへの通路を確保してください。'},
  ko:{setEntrance:'입구 설정',setExit:'출구 설정',entranceSaved:'입구를 변경했습니다.',exitSaved:'출구를 변경했습니다.',endpointPickHint:'비어 있는 가장자리 타일을 선택하고 직원이 있는 계산대까지 길을 남겨 주세요.'},
  es:{setEntrance:'Fijar entrada',setExit:'Fijar salida',entranceSaved:'Entrada actualizada.',exitSaved:'Salida actualizada.',endpointPickHint:'Toca una casilla libre del borde y deja paso hasta una caja atendida.'},
  'pt-BR':{setEntrance:'Definir entrada',setExit:'Definir saída',entranceSaved:'Entrada atualizada.',exitSaved:'Saída atualizada.',endpointPickHint:'Toque em um espaço livre na borda e mantenha o caminho até um caixa atendido.'},
  fr:{setEntrance:'Définir l’entrée',setExit:'Définir la sortie',entranceSaved:'Entrée mise à jour.',exitSaved:'Sortie mise à jour.',endpointPickHint:'Touchez une case libre du bord et gardez un passage vers une caisse tenue.'},
  de:{setEntrance:'Eingang festlegen',setExit:'Ausgang festlegen',entranceSaved:'Eingang aktualisiert.',exitSaved:'Ausgang aktualisiert.',endpointPickHint:'Tippe auf ein freies Randfeld und lass einen Weg zur besetzten Kasse offen.'},
  it:{setEntrance:'Imposta ingresso',setExit:'Imposta uscita',entranceSaved:'Ingresso aggiornato.',exitSaved:'Uscita aggiornata.',endpointPickHint:'Tocca una casella libera sul bordo e lascia un percorso fino a una cassa presidiata.'},
  ru:{setEntrance:'Задать вход',setExit:'Задать выход',entranceSaved:'Вход изменён.',exitSaved:'Выход изменён.',endpointPickHint:'Выберите свободную клетку у края и оставьте путь к кассе с сотрудником.'},
  hi:{setEntrance:'प्रवेश तय करें',setExit:'निकास तय करें',entranceSaved:'प्रवेश अपडेट हुआ।',exitSaved:'निकास अपडेट हुआ।',endpointPickHint:'किनारे की खाली टाइल चुनें और कर्मचारी वाली कैश काउंटर तक रास्ता खुला रखें।'},
  ar:{setEntrance:'تحديد المدخل',setExit:'تحديد المخرج',entranceSaved:'تم تحديث المدخل.',exitSaved:'تم تحديث المخرج.',endpointPickHint:'اضغط على بلاطة فارغة عند الحافة واترك طريقاً إلى صندوق يعمل به موظف.'}
};
for(const locale of supportedLocales)Object.assign(dict[locale],endpointCopy[locale]);
keys.push(...new Set([...Object.keys(managementCopy.en),'entrance','product','selected',...Object.keys(endpointCopy.en)]));
const placementDoneCopy={en:'Placement complete.','zh-Hant':'擺放完成。','zh-Hans':'摆放完成。',ja:'配置しました。',ko:'배치를 완료했습니다.',es:'Colocación completada.','pt-BR':'Posicionamento concluído.',fr:'Placement terminé.',de:'Platzierung abgeschlossen.',it:'Posizionamento completato.',ru:'Размещение завершено.',hi:'जगह पूरी हुई।',ar:'اكتمل الوضع.'};
for(const locale of supportedLocales)dict[locale].placementDone=placementDoneCopy[locale];
keys.push(...v9Keys);
const achievementKeys=['achievementTab','achievementsTitle','achievementsIntro','achievement_first_sale','achievement_five_products','achievement_gross_1000','achievement_expansion_13','achievement_payments_25','achievement_patient_service_10','achievementReward','achievementCollected','achievementInProgress','achievementBack','achievementUnlocked','saveFailed'];
const achievementCopy={
  en:['Achievements','Shop achievements','Complete real shop milestones to collect free badges.','First sale','Sell all five products','$1,000 in gross sales','Expand to 13 × 13','Complete 25 customer payments','Serve 10 customers within 17 seconds','Free collectible badge','Collected','In progress','Back to shop','Achievement unlocked','Save unavailable. Keep this tab open.'],
  'zh-Hant':['成就','店鋪成就','完成實際經營目標，自動收藏免費徽章。','首次銷售','售出全部五種商品','累積銷售收入 $1,000','擴建至 13 × 13','完成 25 筆顧客結帳','17 秒內完成 10 筆服務','免費收藏徽章','已收藏','進行中','返回商店','成就解鎖','存檔無法寫入，請保持此頁開啟。'],
  'zh-Hans':['成就','店铺成就','完成实际经营目标，自动收藏免费徽章。','首次销售','售出全部五种商品','累计销售收入 $1,000','扩建至 13 × 13','完成 25 笔顾客结账','17 秒内完成 10 笔服务','免费收藏徽章','已收藏','进行中','返回商店','成就解锁','存档无法写入，请保持此页开启。'],
  ja:['実績','お店の実績','実際のお店の目標を達成して無料バッジを集めよう。','初めての販売','5種類の商品を販売','累計売上 $1,000','13×13に拡張','25回の会計を完了','17秒以内の接客を10回','無料コレクションバッジ','獲得済み','進行中','お店に戻る','実績を解除','保存できません。タブを開いたままにしてください。'],
  ko:['업적','매장 업적','실제 매장 목표를 달성해 무료 배지를 모으세요.','첫 판매','다섯 상품 모두 판매','누적 총매출 $1,000','13 × 13 확장','손님 결제 25회 완료','17초 안에 10회 서비스','무료 수집 배지','수집 완료','진행 중','상점으로 돌아가기','업적 달성','저장할 수 없습니다. 이 탭을 열어 두세요.'],
  es:['Logros','Logros de la tienda','Cumple metas reales de la tienda y colecciona insignias gratis.','Primera venta','Vender los cinco productos','$1.000 en ventas brutas','Ampliar a 13 × 13','Completar 25 pagos','Atender a 10 clientes en 17 s','Insignia coleccionable gratis','Coleccionada','En progreso','Volver a la tienda','Logro desbloqueado','No se pudo guardar. Mantén esta pestaña abierta.'],
  'pt-BR':['Conquistas','Conquistas da loja','Complete metas reais da loja e colecione emblemas grátis.','Primeira venda','Vender os cinco produtos','$1.000 em vendas brutas','Expandir para 13 × 13','Concluir 25 pagamentos','Atender 10 clientes em até 17 s','Emblema colecionável grátis','Colecionado','Em andamento','Voltar à loja','Conquista desbloqueada','Não foi possível salvar. Mantenha esta aba aberta.'],
  fr:['Succès','Succès de la boutique','Atteignez des objectifs réels et collectionnez des badges gratuits.','Première vente','Vendre les cinq produits','1 000 $ de ventes brutes','Agrandir en 13 × 13','Effectuer 25 paiements','Servir 10 clients en 17 s','Badge à collectionner gratuit','Collectionné','En cours','Retour à la boutique','Succès débloqué','Enregistrement impossible. Gardez cet onglet ouvert.'],
  de:['Erfolge','Ladenerfolge','Erreiche echte Ladenaufgaben und sammle kostenlose Abzeichen.','Erster Verkauf','Alle fünf Produkte verkaufen','1.000 $ Bruttoumsatz','Auf 13 × 13 erweitern','25 Kundenzahlungen abschließen','10 Kunden in höchstens 17 s bedienen','Kostenloses Sammelabzeichen','Gesammelt','In Arbeit','Zurück zum Laden','Erfolg freigeschaltet','Speichern fehlgeschlagen. Lass diesen Tab geöffnet.'],
  it:['Obiettivi','Obiettivi del negozio','Completa obiettivi reali e colleziona distintivi gratuiti.','Prima vendita','Vendere tutti e cinque i prodotti','1.000 $ di vendite lorde','Espandere a 13 × 13','Completare 25 pagamenti','Servire 10 clienti entro 17 s','Distintivo collezionabile gratuito','Collezionato','In corso','Torna al negozio','Obiettivo sbloccato','Salvataggio non riuscito. Lascia aperta questa scheda.'],
  ru:['Достижения','Достижения магазина','Выполняйте настоящие цели магазина и собирайте бесплатные значки.','Первая продажа','Продать все пять товаров','$1 000 валовой выручки','Расширить магазин до 13 × 13','Завершить 25 оплат','Обслужить 10 клиентов за 17 с','Бесплатный коллекционный значок','Собрано','В процессе','Вернуться в магазин','Достижение открыто','Не удалось сохранить. Оставьте вкладку открытой.'],
  hi:['उपलब्धियाँ','दुकान की उपलब्धियाँ','दुकान के असली लक्ष्य पूरे करें और मुफ़्त बैज पाएँ।','पहली बिक्री','पाँचों उत्पाद बेचें','$1,000 की कुल बिक्री','दुकान 13 × 13 तक बढ़ाएँ','25 ग्राहक भुगतान पूरे करें','17 सेकंड में 10 ग्राहकों की सेवा','मुफ़्त संग्रहणीय बैज','संग्रहित','जारी है','दुकान पर लौटें','उपलब्धि मिली','सेव नहीं हुआ। इस टैब को खुला रखें।'],
  ar:['الإنجازات','إنجازات المتجر','أكمل أهداف المتجر الفعلية واجمع شارات مجانية.','أول عملية بيع','بيع المنتجات الخمسة','مبيعات إجمالية بقيمة 1,000 دولار','توسعة المتجر إلى 13 × 13','إكمال 25 عملية دفع','خدمة 10 زبائن خلال 17 ثانية','شارة مجانية قابلة للجمع','تم جمعها','قيد التقدم','العودة إلى المتجر','تم فتح إنجاز','تعذر الحفظ. أبقِ علامة التبويب مفتوحة.']
};
for(const locale of supportedLocales)Object.assign(dict[locale],Object.fromEntries(achievementKeys.map((key,index)=>[key,(achievementCopy[locale]||achievementCopy.en)[index]])));
keys.push(...achievementKeys);
const staffShelfKeys=['availableStock','changeShelfProduct','registerRoster','registerStaffed','registerVacant','hireForRegister','fillFirstVacancy','noRegisterVacancy','addRegister'];
const staffShelfCopy={
 en:['Shop stock','Change product','Registers and cashiers','Cashier assigned','Needs a cashier','Hire cashier','Fill the first vacancy first.','Add a register before hiring another cashier.','Add register'],
 'zh-Hant':['店內庫存','更換商品','收銀台與員工','已有收銀員','待聘收銀員','聘用收銀員','請先補滿前一個空缺。','請先新增收銀台，再聘用下一位收銀員。','新增收銀台'],
 'zh-Hans':['店内库存','更换商品','收银台与员工','已有收银员','待聘收银员','聘用收银员','请先补满前一个空缺。','请先新增收银台，再聘用下一位收银员。','新增收银台'],
 ja:['店内在庫','商品を変更','レジとスタッフ','スタッフ配置済み','スタッフが必要','スタッフを雇う','先に最初の空席を埋めてください。','次のスタッフを雇う前にレジを追加してください。','レジを追加'],
 ko:['매장 재고','상품 변경','계산대와 직원','직원 배치됨','직원 필요','계산원 고용','먼저 앞의 빈자리를 채우세요.','계산원을 더 고용하려면 계산대를 추가하세요.','계산대 추가'],
 es:['Stock de tienda','Cambiar producto','Cajas y personal','Cajero asignado','Necesita cajero','Contratar cajero','Cubre primero la primera vacante.','Añade una caja antes de contratar otro cajero.','Añadir caja'],
 'pt-BR':['Estoque da loja','Trocar produto','Caixas e funcionários','Caixa com funcionário','Precisa de funcionário','Contratar caixa','Preencha primeiro a primeira vaga.','Adicione um caixa antes de contratar outro funcionário.','Adicionar caixa'],
 fr:['Stock du magasin','Changer de produit','Caisses et employés','Employé affecté','Employé requis','Recruter un employé','Pourvoyez d’abord la première place libre.','Ajoutez une caisse avant de recruter un autre employé.','Ajouter une caisse'],
 de:['Ladenbestand','Produkt wechseln','Kassen und Personal','Personal zugewiesen','Personal benötigt','Kassenkraft einstellen','Besetze zuerst den ersten freien Platz.','Füge eine Kasse hinzu, bevor du weitere Kassenkräfte einstellst.','Kasse hinzufügen'],
 it:['Scorte del negozio','Cambia prodotto','Casse e personale','Cassiere assegnato','Cassiere necessario','Assumi cassiere','Copri prima il primo posto libero.','Aggiungi una cassa prima di assumere un altro cassiere.','Aggiungi cassa'],
 ru:['Запас магазина','Сменить товар','Кассы и сотрудники','Кассир назначен','Нужен кассир','Нанять кассира','Сначала заполните первое свободное место.','Добавьте кассу перед наймом следующего кассира.','Добавить кассу'],
 hi:['दुकान का स्टॉक','उत्पाद बदलें','कैश काउंटर और कर्मचारी','कैशियर नियुक्त','कैशियर चाहिए','कैशियर नियुक्त करें','पहले पहली खाली जगह भरें।','अगला कैशियर रखने से पहले कैश काउंटर जोड़ें।','कैश काउंटर जोड़ें'],
 ar:['مخزون المتجر','تغيير المنتج','الصناديق والموظفون','موظف معيّن','يحتاج إلى موظف','توظيف أمين صندوق','املأ أول وظيفة شاغرة أولاً.','أضف صندوقاً قبل توظيف أمين صندوق آخر.','إضافة صندوق']
};
for(const locale of supportedLocales)Object.assign(dict[locale],Object.fromEntries(staffShelfKeys.map((key,index)=>[key,staffShelfCopy[locale][index]])));
keys.push(...staffShelfKeys);
const shelfUnitCopy={en:'Shelf','zh-Hant':'貨架','zh-Hans':'货架',ja:'棚',ko:'선반',es:'Estante','pt-BR':'Prateleira',fr:'Étagère',de:'Regal',it:'Scaffale',ru:'Полка',hi:'शेल्फ़',ar:'رف'};
for(const locale of supportedLocales)dict[locale].shelfUnit=shelfUnitCopy[locale];
keys.push('shelfUnit');
const managementV10Keys=['shelvesTab','restockAction','employee','employeeRole','cashierRole','restockerRole','employeeUnassigned','checkoutSkill','restockSkill','hireEmployee','cameraOrbit','continueHere','businessRetry','businessPaused','viewHint','guideStock','leaveText'];
const managementV10Copy={
en:['Shelves','Restock','Employee','Role','Checkout','Restock','No register assigned','Checkout speed','Restock speed','Hire employee','Rotate camera','Continue in this tab','Retry business','Business paused. Please retry.','Drag to pan · right-drag or Q/E to rotate · pinch to zoom','Restock and change products directly on each shelf card.','Business pauses while this dialog or Main is open. Switching browser tabs keeps it running.'],
'zh-Hant':['貨架','補貨','員工','職位','收銀','補貨','尚未分配收銀台','收銀速度','補貨速度','雇用員工','旋轉視角','在此分頁繼續','重試營業','營業已暫停，請重試。','拖曳移動畫面 · 右鍵拖曳或 Q/E 旋轉 · 雙指縮放','直接在各貨架卡片補貨或更換商品。','開啟此對話框或主畫面時暫停營業；切換瀏覽器分頁會繼續營業。'],
'zh-Hans':['货架','补货','员工','职位','收银','补货','尚未分配收银台','收银速度','补货速度','雇用员工','旋转视角','在此分页继续','重试营业','营业已暂停，请重试。','拖动移动画面 · 右键拖动或 Q/E 旋转 · 双指缩放','直接在各货架卡片补货或更换商品。','打开此对话框或主画面时暂停营业；切换浏览器分页会继续营业。'],
ja:['棚','補充','従業員','役割','レジ','補充','レジ未割り当て','レジ速度','補充速度','従業員を雇う','視点回転','このタブで続ける','営業を再試行','営業を停止しました。再試行してください。','ドラッグで移動 · 右ドラッグか Q/E で回転 · ピンチで拡大','各棚のカードで商品を補充・変更できます。','この画面とメニューでは営業が停止します。ブラウザーのタブ切り替え中は営業が続きます。'],
ko:['선반','보충','직원','직무','계산','보충','계산대 미배정','계산 속도','보충 속도','직원 고용','시점 회전','이 탭에서 계속','영업 재시도','영업이 중단되었습니다. 다시 시도하세요.','드래그로 이동 · 오른쪽 드래그 또는 Q/E로 회전 · 두 손가락 확대','각 선반 카드에서 상품을 보충하고 변경하세요.','이 대화창과 메뉴에서는 영업이 멈춥니다. 브라우저 탭을 바꾸면 영업은 계속됩니다.'],
es:['Estantes','Reponer','Empleado','Puesto','Caja','Reposición','Sin caja asignada','Velocidad de caja','Velocidad de reposición','Contratar empleado','Girar cámara','Continuar en esta pestaña','Reintentar negocio','Negocio pausado. Vuelve a intentarlo.','Arrastra para mover · botón derecho o Q/E para girar · pellizca para ampliar','Repón y cambia productos en cada tarjeta de estante.','El diálogo y el menú pausan el negocio. Cambiar de pestaña del navegador mantiene el negocio activo.'],
'pt-BR':['Prateleiras','Repor','Funcionário','Função','Caixa','Reposição','Sem caixa atribuído','Velocidade do caixa','Velocidade de reposição','Contratar funcionário','Girar câmera','Continuar nesta aba','Tentar negócio novamente','Negócio pausado. Tente novamente.','Arraste para mover · botão direito ou Q/E para girar · pinça para ampliar','Reponha e troque produtos em cada cartão de prateleira.','Este diálogo e o menu pausam o negócio. Trocar abas do navegador mantém o negócio funcionando.'],
fr:['Étagères','Réapprovisionner','Employé','Poste','Caisse','Réapprovisionnement','Aucune caisse attribuée','Vitesse de caisse','Vitesse de réapprovisionnement','Recruter un employé','Tourner la caméra','Continuer dans cet onglet','Réessayer le commerce','Commerce en pause. Réessayez.','Glisser pour déplacer · bouton droit ou Q/E pour tourner · pincer pour zoomer','Réapprovisionnez et changez les produits sur chaque carte d’étagère.','Ce dialogue et le menu mettent le commerce en pause. Il continue dans un autre onglet du navigateur.'],
de:['Regale','Auffüllen','Mitarbeiter','Aufgabe','Kasse','Auffüllen','Keine Kasse zugewiesen','Kassentempo','Auffülltempo','Mitarbeiter einstellen','Kamera drehen','In diesem Tab fortsetzen','Geschäft erneut starten','Geschäft pausiert. Bitte erneut versuchen.','Ziehen zum Verschieben · rechts ziehen oder Q/E zum Drehen · Pinch zum Zoomen','Fülle Waren auf und wechsle Produkte direkt an jeder Regalkarte.','Dieser Dialog und das Menü pausieren den Betrieb. Beim Wechsel des Browser-Tabs läuft er weiter.'],
it:['Scaffali','Rifornisci','Dipendente','Ruolo','Cassa','Rifornimento','Nessuna cassa assegnata','Velocità di cassa','Velocità di rifornimento','Assumi dipendente','Ruota visuale','Continua in questa scheda','Riprova attività','Attività in pausa. Riprova.','Trascina per spostare · tasto destro o Q/E per ruotare · pizzica per zoomare','Rifornisci e cambia prodotti sulla scheda di ogni scaffale.','Questa finestra e il menu mettono in pausa l’attività. Cambiando scheda del browser continua.'],
ru:['Полки','Пополнить','Сотрудник','Роль','Касса','Пополнение','Касса не назначена','Скорость кассы','Скорость пополнения','Нанять сотрудника','Повернуть камеру','Продолжить в этой вкладке','Повторить работу','Работа приостановлена. Повторите попытку.','Перетаскивание — сдвиг · правая кнопка или Q/E — поворот · щипок — масштаб','Пополняйте и меняйте товары в карточке каждой полки.','Этот диалог и меню приостанавливают работу. В других вкладках браузера магазин продолжает работать.'],
hi:['शेल्फ़','स्टॉक भरें','कर्मचारी','भूमिका','कैशियर','स्टॉक भरना','काउंटर आवंटित नहीं','कैशियर की गति','स्टॉक भरने की गति','कर्मचारी नियुक्त करें','कैमरा घुमाएँ','इस टैब में जारी रखें','कारोबार फिर शुरू करें','कारोबार रुका है। फिर कोशिश करें।','खींचकर खिसकाएँ · दायाँ बटन या Q/E से घुमाएँ · पिंच से ज़ूम','हर शेल्फ़ कार्ड पर स्टॉक भरें और उत्पाद बदलें।','इस संवाद और मेनू में कारोबार रुकता है। ब्राउज़र टैब बदलने पर चलता रहता है।'],
ar:['الرفوف','إعادة التخزين','موظف','الدور','أمين صندوق','إعادة التخزين','لم يُعيّن صندوق','سرعة الدفع','سرعة إعادة التخزين','توظيف موظف','تدوير الكاميرا','المتابعة في هذا التبويب','إعادة تشغيل المتجر','توقف المتجر مؤقتاً. حاول مجدداً.','اسحب للتحريك · السحب بالزر الأيمن أو Q/E للتدوير · القرص للتكبير','أعد التخزين وغيّر المنتجات من بطاقة كل رف.','تتوقف الأعمال في هذه النافذة والقائمة. تستمر عند تبديل تبويبات المتصفح.']
};
for(const locale of supportedLocales)Object.assign(dict[locale],Object.fromEntries(managementV10Keys.map((key,index)=>[key,managementV10Copy[locale][index]])));
keys.push(...managementV10Keys.filter(key=>!keys.includes(key)));
export const localeKeys=keys;
const businessPauseCopy={en:['Pause business','Resume business'],'zh-Hant':['暫停營業','繼續營業'],'zh-Hans':['暂停营业','继续营业'],ja:['営業を停止','営業を再開'],ko:['영업 일시정지','영업 재개'],es:['Pausar negocio','Reanudar negocio'],'pt-BR':['Pausar negócio','Retomar negócio'],fr:['Suspendre le commerce','Reprendre le commerce'],de:['Betrieb pausieren','Betrieb fortsetzen'],it:['Pausa attività','Riprendi attività'],ru:['Приостановить работу','Продолжить работу'],hi:['कारोबार रोकें','कारोबार जारी रखें'],ar:['إيقاف المتجر مؤقتاً','استئناف المتجر']};
for(const locale of supportedLocales){dict[locale].businessPause=businessPauseCopy[locale][0];dict[locale].businessResume=businessPauseCopy[locale][1]}
keys.push('businessPause','businessResume');
const badgeTabCopy={en:'Badges','zh-Hant':'成就','zh-Hans':'成就',ja:'実績',ko:'업적',es:'Logros','pt-BR':'Metas',fr:'Succès',de:'Abzeichen',it:'Traguardi',ru:'Награды',hi:'उपलब्धियाँ',ar:'الإنجازات'};
for(const locale of supportedLocales)dict[locale].badgesTab=badgeTabCopy[locale];keys.push('badgesTab');
const waterProductCopy={en:'Water','zh-Hant':'礦泉水','zh-Hans':'矿泉水',ja:'水',ko:'생수',es:'Agua','pt-BR':'Água',fr:'Eau',de:'Wasser',it:'Acqua',ru:'Вода',hi:'पानी',ar:'ماء'};
for(const locale of supportedLocales)dict[locale].waterProduct=waterProductCopy[locale];keys.push('waterProduct');
const managementV11Keys=['equipmentCategory','decorCategory','layoutCategory','ownedTotal','placedCount','storedCount','buyItem','buyBeforePlace','itemOptions','itemBoughtStored','selectFixtureFirst','fixtureRotated','cameraDragRotate','cameraDragPan','workerPreparing','workerTravel','workerStock','workerReturn'];
const managementV11Copy={
en:['Equipment','Decor','Layout','Owned','Placed','Stored','Buy','Buy an item first, then place it free.','Item options','Purchased. Tap its picture to place it.','Select an installed fixture first.','Rotated','Drag the scene to rotate','Drag the scene to pan','Preparing stock','Carrying stock','Stocking the shelf','Returning'],
'zh-Hant':['設備','裝飾','布局','持有','已擺放','倉庫','購買','先購買，再免費擺放。','物件操作','已購買，點圖片即可擺放。','請先選擇已擺放的設施。','已旋轉','拖曳場景以旋轉','拖曳場景以平移','準備貨物','搬運貨物','正在上架','返回取貨'],
'zh-Hans':['设备','装饰','布局','持有','已摆放','仓库','购买','先购买，再免费摆放。','物件操作','已购买，点图片即可摆放。','请先选择已摆放的设施。','已旋转','拖动场景以旋转','拖动场景以平移','准备货物','搬运货物','正在上架','返回取货'],
ja:['設備','装飾','配置','所有','設置','倉庫','購入','購入後は無料で設置できます。','アイテム操作','購入済み。画像から設置できます。','設置済みの設備を選択。','回転済み','ドラッグで回転','ドラッグで移動','商品を準備','商品を運搬','棚に補充中','戻っています'],
ko:['설비','장식','배치','보유','배치됨','창고','구매','구매 후 무료로 배치하세요.','물품 작업','구매 완료. 그림을 눌러 배치하세요.','배치된 설비를 선택하세요.','회전 완료','드래그하여 회전','드래그하여 이동','상품 준비','상품 운반','선반 보충 중','복귀 중'],
es:['Equipo','Decoración','Plano','Total','Colocado','Almacén','Comprar','Compra primero y coloca gratis.','Opciones','Comprado. Toca la imagen para colocar.','Selecciona un mueble colocado.','Girado','Arrastra para girar','Arrastra para mover','Preparando','Transportando','Reponiendo','Regresando'],
'pt-BR':['Equipamento','Decoração','Planta','Total','Colocado','Estoque','Comprar','Compre e coloque gratuitamente.','Opções','Comprado. Toque na imagem para colocar.','Selecione um móvel colocado.','Girado','Arraste para girar','Arraste para mover','Preparando','Transportando','Repondo','Retornando'],
fr:['Équipement','Décor','Plan','Total','Placés','Réserve','Acheter','Achetez puis placez gratuitement.','Options','Acheté. Touchez l’image pour placer.','Choisissez un meuble installé.','Tourné','Glissez pour tourner','Glissez pour déplacer','Préparation','Transport','Réassort','Retour'],
de:['Geräte','Deko','Grundriss','Besitz','Platziert','Lager','Kaufen','Erst kaufen, dann kostenlos platzieren.','Optionen','Gekauft. Bild zum Platzieren antippen.','Platziertes Möbel auswählen.','Gedreht','Ziehen zum Drehen','Ziehen zum Verschieben','Vorbereitung','Transport','Regal auffüllen','Rückweg'],
it:['Attrezzatura','Arredi','Pianta','Totale','Collocati','Magazzino','Compra','Compra e colloca gratuitamente.','Opzioni','Acquistato. Tocca l’immagine per collocare.','Seleziona un arredo collocato.','Ruotato','Trascina per ruotare','Trascina per spostare','Preparazione','Trasporto','Rifornimento','Ritorno'],
ru:['Оборудование','Декор','План','Всего','На месте','Склад','Купить','Купите, затем разместите бесплатно.','Действия','Куплено. Нажмите картинку для размещения.','Выберите установленный предмет.','Повёрнуто','Тяните для поворота','Тяните для перемещения','Подготовка','Доставка','Пополнение','Возвращение'],
hi:['उपकरण','सजावट','नक्शा','कुल','रखे हुए','गोदाम','खरीदें','पहले खरीदें, फिर मुफ्त रखें।','वस्तु विकल्प','खरीद लिया। रखने के लिए चित्र दबाएँ।','रखी हुई वस्तु चुनें।','घुमाया','घुमाने के लिए खींचें','खिसकाने के लिए खींचें','सामान की तैयारी','सामान ले जाना','शेल्फ़ भरना','वापसी'],
ar:['معدات','زينة','مخطط','المملوك','الموضوع','المخزن','شراء','اشترِ أولاً ثم ضع مجاناً.','خيارات العنصر','تم الشراء. اضغط الصورة للوضع.','اختر تجهيزاً موضوعاً.','تم التدوير','اسحب للتدوير','اسحب للتحريك','تجهيز البضاعة','نقل البضاعة','تعبئة الرف','العودة']
};
for(const locale of supportedLocales)Object.assign(dict[locale],Object.fromEntries(managementV11Keys.map((key,index)=>[key,managementV11Copy[locale][index]])));
keys.push(...managementV11Keys);
const activationCopy={en:'Ready-to-run: register + employee','zh-Hant':'啟用總成本：收銀台＋員工','zh-Hans':'启用总成本：收银台＋员工',ja:'稼働費用：レジ＋スタッフ',ko:'가동 비용: 계산대 + 직원',es:'Puesta en marcha: caja + empleado','pt-BR':'Custo para operar: caixa + funcionário',fr:'Mise en service : caisse + employé',de:'Betriebsbereit: Kasse + Mitarbeiter',it:'Costo operativo: cassa + dipendente',ru:'Запуск: касса + сотрудник',hi:'शुरू करने की लागत: काउंटर + कर्मचारी',ar:'تكلفة التشغيل: الصندوق + الموظف'};
for(const locale of supportedLocales)dict[locale].counterActivationCost=activationCopy[locale];keys.push('counterActivationCost');
const businessV12Keys='milk|bread|yogurt|icecream|noodles|duckStatue|breadThrone|kingReceipt|singlePurpose|doublePurpose|coolerPurpose|coldOnly|dryOnly|businessUpgrades|legacyTraining|wholeTeam|guideTitle|guideFirst|guideSecond|guideTeam|guideQueue|guideExpand|guideLandmark|recentBusiness|unitMargin|demandEstimate|actualPaid|stockMinutes|moreData|stockouts|stockCapital|endpointDirection'.split('|');
const businessV12Rows={
en:'Milk|Bread|Yogurt|Ice cream|Noodles|Serious Duck|Bread Throne|King of Receipts|1 dry-goods slot · compact|2 independent dry-goods slots · +20 stock capacity|2 cold-goods slots · +30 stock capacity · buy the module before selling|Requires a paid cooler|Dry goods only|Business upgrades|Previous paid training retained for its original employees|Whole team · base effect|Shop guide|Your water shelf is ready. Watch the first customer pay, then restock.|Buy a shelf, place it, choose cookies, and order stock for a second product.|Hire an employee and choose restocking. Enable auto-restock only when you can afford stock.|Busy queues? Buy and place a register, then assign a cashier. Keep its four-tile lane clear.|Reinvest after stock costs: expand, add products, and buy useful team upgrades.|Save for a funny landmark. Its small appeal bonus is optional.|Actual sales · last 3 active minutes|Unit margin|Estimated demand weight|Paid customers|Stock remaining · minutes|More sales needed for an estimate|Empty-stock visits|Stock at cost|Point the door inward from a shop edge and keep its approach tile clear',
'zh-Hant':'鮮奶|麵包|優格|冰淇淋|泡麵|認真鴨總裁|麵包王座|發票之王|1 個常溫商品槽 · 省空間|2 個獨立常溫商品槽 · 庫存容量 +20|2 個冷藏商品槽 · 容量 +30 · 購買模組後才可販售|需已購買的冷藏櫃|僅適用常溫商品|經營升級|舊版已付費訓練保留給原員工|全店 · 基礎效果|經營指引|礦泉水架已備好。等第一位客人付款，再補貨。|購買貨架、擺放、選擇餅乾並進貨，開始販售第二種商品。|聘請員工並指派補貨；備好進貨資金後再開啟自動補貨。|排隊變長？購買並擺放收銀台，再指派收銀員；保留前方四格走道。|留足進貨資金，再擴店、增加商品與購買全店升級。|存錢買搞笑地標。小幅人氣加成是可選目標。|實際銷售 · 最近 3 分鐘營業時間|單件毛利|預估需求權重|付款客數|庫存可售分鐘|更多銷售後再估算|空庫存來客|庫存成本|門須朝店內，位於店鋪邊緣，前方入口格須暢通',
'zh-Hans':'鲜奶|面包|酸奶|冰淇淋|方便面|认真鸭总裁|面包王座|发票之王|1 个常温商品槽 · 省空间|2 个独立常温商品槽 · 库存容量 +20|2 个冷藏商品槽 · 容量 +30 · 购买模块后才可销售|需要已购买的冷藏柜|仅适用常温商品|经营升级|旧版已付费训练保留给原员工|全店 · 基础效果|经营指引|矿泉水架已备好。等第一位客人付款，再补货。|购买货架、摆放、选择饼干并进货，开始销售第二种商品。|聘请员工并指派补货；备好进货资金后再开启自动补货。|排队变长？购买并摆放收银台，再指派收银员；保留前方四格通道。|留足进货资金，再扩店、增加商品与购买全店升级。|存钱买搞笑地标。小幅人气加成是可选目标。|实际销售 · 最近 3 分钟营业时间|单件毛利|预计需求权重|付款客数|库存可售分钟|更多销售后再估算|空库存来客|库存成本|门须朝店内，位于店铺边缘，前方入口格须畅通',
ja:'牛乳|パン|ヨーグルト|アイスクリーム|麺|まじめなアヒル社長|パンの玉座|レシート王|常温商品1枠 · 省スペース|独立した常温商品2枠 · 在庫容量+20|冷蔵商品2枠 · 容量+30 · 販売には装置の購入が必要|購入済み冷蔵庫が必要|常温商品のみ|店舗アップグレード|購入済み研修は元の従業員に保持|全員 · 基本効果|経営ガイド|水の棚は準備済み。最初のお客様の支払いを待って補充しよう。|棚を購入して設置し、クッキーを選んで仕入れると2品目を販売できる。|従業員を雇い補充係に。仕入れ資金を確保してから自動補充を有効に。|行列が増えたらレジを購入・設置して会計係を配置。前方4マスを空けよう。|仕入れ資金を残し、拡張・商品追加・全員の強化へ再投資しよう。|面白い置物を目標に貯金。小さな人気効果は任意。|実売上 · 直近3分の営業時間|1個の粗利|推定需要の重み|支払った客数|在庫の残り分数|推定には売上データが必要|在庫切れ時の来客|在庫原価|店の端でドアを内側に向け、進入マスを空けよう',
ko:'우유|빵|요구르트|아이스크림|라면|진지한 오리 사장|빵 왕좌|영수증 왕|상온 상품 1칸 · 공간 절약|독립 상온 상품 2칸 · 재고 용량 +20|냉장 상품 2칸 · 용량 +30 · 판매 전에 장치 구매|구매한 냉장고 필요|상온 상품만 가능|매장 업그레이드|구매한 교육은 기존 직원에게 유지|모든 직원 · 기본 효과|운영 안내|물 진열대가 준비됐어요. 첫 손님의 결제를 기다린 후 보충하세요.|진열대를 구매해 배치하고 쿠키를 선택해 주문하면 두 번째 상품을 팔 수 있어요.|직원을 고용해 보충 담당으로 지정하세요. 주문 자금이 있을 때 자동 보충을 켜세요.|대기열이 길면 계산대를 구매·배치하고 직원을 지정하세요. 앞 네 칸을 비워 두세요.|주문 자금을 남겨 두고 확장과 상품, 전체 직원 업그레이드에 투자하세요.|재미있는 장식물을 위해 저축하세요. 작은 인기 효과는 선택 사항이에요.|실제 판매 · 최근 영업 3분|개당 이익|예상 수요 가중치|결제 손님 수|재고 판매 가능 분|추정에 더 많은 판매 필요|재고가 없을 때 방문|재고 원가|가게 가장자리에서 문을 안쪽으로 향하게 하고 진입 칸을 비우세요',
es:'Leche|Pan|Yogur|Helado|Fideos|Pato Serio|Trono de Pan|Rey de Recibos|1 hueco de productos secos · compacto|2 huecos independientes · capacidad +20|2 huecos refrigerados · capacidad +30 · compra el módulo para vender|Necesita nevera comprada|Solo productos secos|Mejoras del negocio|Formación pagada conservada para los empleados originales|Todo el equipo · efecto base|Guía de la tienda|El agua está lista. Espera el primer pago y repón.|Compra y coloca un estante, elige galletas y pide existencias para un segundo producto.|Contrata un empleado y asígnale reposición. Activa la reposición automática con fondos para comprar.|¿Colas largas? Compra y coloca una caja, asigna un cajero y deja cuatro casillas libres delante.|Reserva dinero para existencias antes de ampliar, añadir productos y mejorar al equipo.|Ahorra para un adorno divertido. Su pequeño atractivo es opcional.|Ventas reales · últimos 3 minutos activos|Margen unitario|Peso de demanda estimado|Clientes que pagaron|Existencias en minutos|Faltan ventas para estimar|Visitas sin existencias|Existencias al coste|Orienta la puerta hacia dentro en un borde y despeja su acceso',
'pt-BR':'Leite|Pão|Iogurte|Sorvete|Macarrão|Pato Sério|Trono de Pão|Rei dos Recibos|1 espaço de produtos secos · compacto|2 espaços independentes · capacidade +20|2 espaços refrigerados · capacidade +30 · compre o módulo para vender|Precisa de geladeira comprada|Somente produtos secos|Melhorias do negócio|Treinamento pago mantido para os funcionários originais|Toda a equipe · efeito básico|Guia da loja|A água está pronta. Espere o primeiro pagamento e reponha.|Compre e coloque uma prateleira, escolha biscoitos e faça um pedido para vender o segundo produto.|Contrate um funcionário para reposição. Ative a reposição automática com dinheiro para pedidos.|Filas longas? Compre e coloque um caixa, atribua um funcionário e deixe quatro espaços livres na frente.|Reserve dinheiro para estoque antes de expandir, adicionar produtos e melhorar a equipe.|Economize para uma decoração engraçada. O pequeno bônus de atração é opcional.|Vendas reais · últimos 3 minutos ativos|Margem por unidade|Peso estimado da demanda|Clientes que pagaram|Estoque em minutos|Mais vendas para estimar|Visitas sem estoque|Estoque a custo|Vire a porta para dentro na borda da loja e deixe o acesso livre',
fr:'Lait|Pain|Yaourt|Glace|Nouilles|Canard Sérieux|Trône de Pain|Roi des Tickets|1 emplacement sec · compact|2 emplacements indépendants · capacité +20|2 emplacements froids · capacité +30 · module requis pour vendre|Réfrigérateur acheté requis|Produits secs uniquement|Améliorations du commerce|Formation payée conservée pour les employés d’origine|Toute l’équipe · effet de base|Guide du magasin|L’eau est prête. Attendez le premier paiement puis réapprovisionnez.|Achetez et placez une étagère, choisissez des biscuits et commandez pour vendre un deuxième produit.|Recrutez un employé au réassort. Activez le réassort automatique avec des fonds pour les commandes.|Longue file ? Achetez et placez une caisse, affectez un caissier et libérez quatre cases devant.|Gardez des fonds pour le stock avant d’agrandir, ajouter des produits et améliorer l’équipe.|Économisez pour une décoration amusante. Son petit attrait est facultatif.|Ventes réelles · 3 dernières minutes actives|Marge unitaire|Poids de demande estimé|Clients ayant payé|Stock restant en minutes|Plus de ventes pour estimer|Visites sans stock|Stock au coût|Orientez la porte vers l’intérieur au bord du magasin et dégagez son accès',
de:'Milch|Brot|Joghurt|Eis|Nudeln|Ernste Ente|Brotthron|König der Kassenbons|1 Trockenwarenplatz · kompakt|2 unabhängige Plätze · Kapazität +20|2 Kühlwarenplätze · Kapazität +30 · Modul zum Verkauf kaufen|Gekaufter Kühlschrank nötig|Nur Trockenwaren|Geschäftsverbesserungen|Bezahlte Schulung bleibt für die ursprünglichen Mitarbeiter|Gesamtes Team · Grundwirkung|Ladenhilfe|Das Wasser steht bereit. Warte auf die erste Zahlung und fülle nach.|Kaufe und platziere ein Regal, wähle Kekse und bestelle Vorrat für ein zweites Produkt.|Stelle einen Mitarbeiter zum Auffüllen ein. Aktiviere Automatik erst mit Geld für Bestellungen.|Lange Schlange? Kaufe und platziere eine Kasse, weise Personal zu und halte vier Felder davor frei.|Behalte Geld für Vorrat, bevor du ausbaust, Waren ergänzt und das Team verbesserst.|Spare für eine lustige Dekoration. Ihr kleiner Beliebtheitsbonus ist optional.|Echte Verkäufe · letzte 3 aktive Minuten|Stückmarge|Geschätztes Nachfragegewicht|Zahlende Kunden|Vorrat in Minuten|Mehr Verkäufe zur Schätzung nötig|Besuche ohne Vorrat|Vorrat zum Einkaufspreis|Tür am Ladenrand nach innen ausrichten und Zugang freihalten',
it:'Latte|Pane|Yogurt|Gelato|Noodles|Papero Serio|Trono di Pane|Re degli Scontrini|1 spazio per prodotti secchi · compatto|2 spazi indipendenti · capacità +20|2 spazi refrigerati · capacità +30 · acquista il modulo per vendere|Serve un frigorifero acquistato|Solo prodotti secchi|Migliorie del negozio|Formazione pagata conservata per i dipendenti originali|Tutto il gruppo · effetto base|Guida del negozio|L’acqua è pronta. Aspetta il primo pagamento e rifornisci.|Compra e posiziona uno scaffale, scegli biscotti e ordina per vendere un secondo prodotto.|Assumi un addetto al rifornimento. Attiva l’automatismo con fondi per gli ordini.|Coda lunga? Compra e posiziona una cassa, assegna un cassiere e libera quattro caselle davanti.|Conserva fondi per le scorte prima di ampliare, aggiungere prodotti e migliorare il gruppo.|Risparmia per una decorazione buffa. Il piccolo bonus di popolarità è facoltativo.|Vendite reali · ultimi 3 minuti attivi|Margine unitario|Peso della domanda stimato|Clienti paganti|Scorte in minuti|Servono più vendite per stimare|Visite senza scorte|Scorte al costo|Orienta la porta verso l’interno sul bordo del negozio e libera l’accesso',
ru:'Молоко|Хлеб|Йогурт|Мороженое|Лапша|Серьёзный Утконачальник|Хлебный Трон|Король Чеков|1 место сухих товаров · компактно|2 независимых места · вместимость +20|2 места холодных товаров · вместимость +30 · купите модуль для продаж|Нужен купленный холодильник|Только сухие товары|Улучшения магазина|Оплаченное обучение сохранено у прежних сотрудников|Вся команда · базовый эффект|Советы по магазину|Вода готова. Дождитесь первой оплаты и пополните запас.|Купите и поставьте полку, выберите печенье и закажите запас для второго товара.|Наймите сотрудника для пополнения. Включайте автоматизацию при наличии денег на заказ.|Длинная очередь? Купите и поставьте кассу, назначьте кассира и освободите четыре клетки впереди.|Оставляйте деньги на запас перед расширением, новыми товарами и улучшением команды.|Копите на смешной декор. Небольшая прибавка популярности необязательна.|Реальные продажи · последние 3 активные минуты|Маржа за штуку|Оценочный вес спроса|Оплатившие клиенты|Запаса в минутах|Нужно больше продаж для оценки|Визиты без запаса|Запас по себестоимости|Направьте дверь внутрь с края магазина и освободите подход',
hi:'दूध|ब्रेड|दही|आइसक्रीम|नूडल्स|गंभीर बतख|ब्रेड सिंहासन|रसीदों का राजा|सूखे सामान का 1 स्थान · कम जगह|2 अलग स्थान · भंडार क्षमता +20|ठंडे सामान के 2 स्थान · क्षमता +30 · बिक्री के लिए मॉड्यूल खरीदें|खरीदा हुआ फ्रिज चाहिए|केवल सूखा सामान|दुकान के अपग्रेड|पहले खरीदा प्रशिक्षण मूल कर्मचारियों के लिए सुरक्षित|पूरी टीम · आधार प्रभाव|दुकान मार्गदर्शिका|पानी तैयार है। पहले ग्राहक के भुगतान के बाद सामान भरें।|शेल्फ खरीदें और रखें, बिस्कुट चुनें और दूसरा उत्पाद बेचने के लिए सामान मँगाएँ।|कर्मचारी रखकर सामान भरने का काम दें। ऑर्डर के पैसे हों तभी स्वचालित भराई चालू करें।|लंबी कतार? काउंटर खरीदकर रखें, कैशियर लगाएँ और सामने चार खाने खाली रखें।|विस्तार, नए उत्पाद और टीम अपग्रेड से पहले भंडार के पैसे बचाएँ।|मजेदार सजावट के लिए बचत करें। उसका छोटा लोकप्रियता लाभ वैकल्पिक है।|वास्तविक बिक्री · पिछले 3 सक्रिय मिनट|प्रति वस्तु लाभ|अनुमानित माँग भार|भुगतान वाले ग्राहक|भंडार के बचे मिनट|अनुमान के लिए और बिक्री चाहिए|खाली भंडार पर आए ग्राहक|लागत पर भंडार|दुकान के किनारे दरवाजे को भीतर की ओर रखें और प्रवेश खाना खाली रखें',
ar:'حليب|خبز|زبادي|مثلجات|معكرونة|البطة الجادة|عرش الخبز|ملك الإيصالات|خانة واحدة للبضائع الجافة · موفر للمكان|خانتان مستقلتان · سعة المخزون +20|خانتان مبردتان · السعة +30 · اشتر الوحدة قبل البيع|يتطلب ثلاجة مشتراة|بضائع جافة فقط|ترقيات المتجر|يبقى التدريب المدفوع للموظفين الأصليين|الفريق كله · التأثير الأساسي|دليل المتجر|الماء جاهز. انتظر دفعة أول عميل ثم أعد التخزين.|اشتر رفًا وضعه واختر البسكويت واطلب مخزونًا لبيع المنتج الثاني.|وظّف عاملًا للتخزين. فعّل التخزين التلقائي عند توفر مال للطلبات.|طابور طويل؟ اشتر صندوقًا وضعه وعيّن أمينًا واترك أربع خانات أمامه خالية.|احتفظ بمال للمخزون قبل التوسع وإضافة منتجات وترقية الفريق.|ادخر لزينة مضحكة. مكافأة جاذبيتها الصغيرة اختيارية.|المبيعات الفعلية · آخر 3 دقائق عمل|هامش الوحدة|وزن الطلب المقدر|عملاء دفعوا|المخزون بالدقائق|تلزم مبيعات أكثر للتقدير|زيارات بلا مخزون|المخزون بسعر التكلفة|وجّه الباب للداخل عند حافة المتجر واترك خانة الدخول خالية'
};
for(const locale of supportedLocales){const values=businessV12Rows[locale].split('|');if(values.length!==businessV12Keys.length)throw new Error(`Incomplete Blockmart v12 locale: ${locale}`);businessV12Keys.forEach((key,index)=>dict[locale][key]=values[index]);dict[locale].viewHint=dict[locale].cameraDragPan;}
keys.push(...businessV12Keys);
dict.de.businessUpgrades='Betrieb';
const grossMarginCopy={en:'Gross margin','zh-Hant':'銷售毛利','zh-Hans':'销售毛利',ja:'売上粗利',ko:'판매 이익',es:'Margen bruto','pt-BR':'Margem bruta',fr:'Marge brute',de:'Rohertrag',it:'Margine lordo',ru:'Валовая прибыль',hi:'सकल लाभ',ar:'هامش الربح الإجمالي'};
for(const locale of supportedLocales)dict[locale].grossMargin=grossMarginCopy[locale];keys.push('grossMargin');
const packageTextureErrorCopy={en:'Package artwork could not load. Tap Retry; your shop save is safe.','zh-Hant':'商品包裝圖載入失敗。請按重試；店鋪存檔仍安全保留。','zh-Hans':'商品包装图加载失败。请按重试；店铺存档仍安全保留。',ja:'パッケージ画像を読み込めません。再試行してください。保存データは安全です。',ko:'포장 이미지를 불러오지 못했습니다. 재시도하세요. 저장 데이터는 안전합니다.',es:'No se cargó el diseño del envase. Pulsa Reintentar; tu tienda está guardada.','pt-BR':'A arte da embalagem não carregou. Toque em Tentar novamente; sua loja está salva.',fr:'Le visuel du produit ne s’est pas chargé. Réessayez ; votre boutique est sauvegardée.',de:'Die Verpackungsgrafik fehlt. Erneut versuchen; dein Laden bleibt gespeichert.',it:'Grafica della confezione non caricata. Riprova; il negozio è salvato.',ru:'Не загрузилось оформление упаковки. Повторите попытку; магазин сохранён.',hi:'पैकेज की तस्वीर लोड नहीं हुई। फिर कोशिश करें; दुकान का सेव सुरक्षित है।',ar:'لم تُحمّل رسومات العبوة. اضغط إعادة المحاولة؛ حفظ المتجر آمن.'};
for(const locale of supportedLocales)dict[locale].packageTextureError=packageTextureErrorCopy[locale];keys.push('packageTextureError');
const issueV14GuideKeys=["guideGoalTitle","guideGoalBody","guideControlsTitle","guideControlsBody","guideFinishingTitle","guideFinishingBody","guideComplete","saveRecoveredKnown","saveRecoveredFresh","guideStart","guideStock","guidePlace","guideGrow"];
const issueV14GuideRows={
  "en": [
    "Goal",
    "Build a stocked, varied animal shop. Reinvest paid sales in supplies, staff, equipment and a store up to22×22.",
    "Controls and rules",
    "Drag to pan. Enable Rotate camera to rotate by dragging; wheel or pinch to zoom. R rotates a selected fixture. Cancel or Escape cancels pending placement; owned fixtures remain in Warehouse.",
    "Finishing and feedback",
    "Paid sales increase cash and complete shop goals. Keep operating after the goals, or use Return to Main to pause. Progress stays on this device and resumes when you open the shop.",
    "Shop goals complete. Open Badges, or keep growing your shop.",
    "Readable progress recovered. The damaged original save is retained on this device.",
    "The previous progress could not be read. Its original save is retained; a new shop has been created.",
    "How to play",
    "Choose products on each shelf and order stock. Check unit cost and sale price; cold goods need a cooler.",
    "Bought fixtures enter Warehouse. Choose a valid tile and confirm placement. Storing and placing owned fixtures again is free.",
    "Keep stock money aside, hire staff, buy useful team upgrades and expand10→13→16→19→22. Landmarks are optional."
  ],
  "zh-Hant": [
    "目標",
    "經營商品充足、種類多樣的動物商店。用實際成交收入補貨、招募、添購設備，並逐步擴建至22×22。",
    "操作與規則",
    "拖曳場景平移；開啟「旋轉視角」後拖曳旋轉，滾輪或雙指縮放。R 可旋轉選取的設備；取消或 Esc 撤銷待放置，已擁有的設備仍留在倉庫。",
    "結束與回饋",
    "客人付款後才增加現金並完成店鋪目標。完成目標後可持續經營，或返回主選單暫停。進度保留在此裝置，重新開店即可繼續。",
    "店鋪目標已完成。查看徽章，或繼續經營成長。",
    "已恢復可讀取的進度，損壞的原始存檔仍保留在此裝置。",
    "原進度無法讀取；原始存檔已保留，並已建立新商店。",
    "玩法",
    "在各貨架選商品並補貨，留意進貨價與售價；冷藏商品需要冷藏櫃。",
    "設備購買後進入倉庫。選有效格再確認放置；收回與重新擺放已擁有設備不再扣款。",
    "先保留補貨資金，再招募、升級團隊，逐步擴建10→13→16→19→22。地標為選購項目。"
  ],
  "zh-Hans": [
    "目标",
    "经营商品充足、种类多样的动物商店。用实际成交收入补货、招募、购买设备，并逐步扩建至22×22。",
    "操作与规则",
    "拖动画面平移；开启“旋转视角”后拖动旋转，滚轮或双指缩放。R 旋转选中的设备；取消或 Esc 撤销待放置，已有设备仍留在仓库。",
    "结束与反馈",
    "顾客付款后才增加现金并完成商店目标。完成目标后可继续经营，或返回主菜单暂停。进度保留在此设备，重新开店即可继续。",
    "商店目标已完成。查看徽章，或继续经营成长。",
    "已恢复可读取的进度，损坏的原始存档仍保留在此设备。",
    "原进度无法读取；原始存档已保留，并已创建新商店。",
    "玩法",
    "在各货架选择商品并补货，留意进货价与售价；冷藏商品需要冷藏柜。",
    "设备购买后进入仓库。选择有效格再确认放置；收回与重新摆放已有设备不再扣款。",
    "先保留补货资金，再招募、升级团队，逐步扩建10→13→16→19→22。地标为可选购买。"
  ],
  "ja": [
    "目標",
    "品ぞろえ豊かな動物のお店を育てよう。実際の売上を補充、雇用、設備に回し、22×22まで拡張。",
    "操作とルール",
    "ドラッグで移動。「カメラ回転」を有効にしてドラッグすると回転。ホイールやピンチで拡大縮小。Rで選択設備を回転。キャンセルやEscで配置を取り消しても、所有設備は倉庫に残ります。",
    "終了とフィードバック",
    "支払いで現金と目標が進みます。達成後も営業を続けるか、メニューへ戻って一時停止。進捗はこの端末に保存され、再開店で続けられます。",
    "お店の目標を達成。バッジを見るか、営業を続けよう。",
    "読み取れる進捗を復元しました。破損した元データはこの端末に保管しています。",
    "以前の進捗を読み取れません。元データを保管し、新しいお店を作成しました。",
    "遊び方",
    "各棚で商品を選び補充。仕入れと販売価格を確認し、冷蔵品には冷蔵ケースを使います。",
    "購入設備は倉庫に入ります。有効なマスを選び配置を確定。所有設備の収納と再配置は無料です。",
    "補充資金を残して雇用、チーム強化、10→13→16→19→22の拡張へ。ランドマークは任意購入です。"
  ],
  "ko": [
    "목표",
    "다양한 상품을 갖춘 동물 상점을 키우세요. 실제 판매 수익으로 재고, 직원, 설비를 늘리고22×22까지 확장하세요.",
    "조작과 규칙",
    "드래그로 이동하고 카메라 회전을 켜면 드래그로 회전합니다. 휠이나 두 손가락으로 확대합니다. R로 선택한 설비를 회전하며 취소나Esc는 배치를 취소합니다. 소유 설비는 창고에 남습니다.",
    "종료와 피드백",
    "손님 결제로 현금과 목표가 늘어납니다. 목표 달성 후에도 운영하거나 메뉴로 돌아가 일시 정지하세요. 진행은 이 기기에 저장되며 다시 개점하면 이어집니다.",
    "상점 목표 완료. 배지를 확인하거나 운영을 계속하세요.",
    "읽을 수 있는 진행을 복구했습니다. 손상된 원본 저장은 이 기기에 보관됩니다.",
    "이전 진행을 읽을 수 없습니다. 원본 저장을 보관하고 새 상점을 만들었습니다.",
    "플레이 방법",
    "선반별 상품을 고르고 재고를 주문하세요. 매입가와 판매가를 확인하며 냉장 상품에는 냉장고가 필요합니다.",
    "구매한 설비는 창고로 갑니다. 유효한 칸을 골라 배치를 확정하세요. 소유 설비를 보관하거나 다시 놓는 것은 무료입니다.",
    "재고 자금을 남기고 직원과 팀을 강화하며10→13→16→19→22로 확장하세요. 랜드마크는 선택 구매입니다."
  ],
  "es": [
    "Objetivo",
    "Crea una tienda animal variada y abastecida. Reinverte ventas cobradas en existencias, personal y equipo, y amplía hasta22×22.",
    "Controles y reglas",
    "Arrastra para desplazar. Activa Girar cámara para rotar al arrastrar; rueda o pellizco para ampliar. R gira el equipo seleccionado. Cancelar oEsc anula la colocación; lo comprado sigue en Almacén.",
    "Final y respuesta",
    "Los pagos aumentan el efectivo y completan metas. Sigue operando o vuelve al menú para pausar. El progreso queda en este dispositivo y continúa al abrir.",
    "Metas completadas. Abre Insignias o sigue ampliando.",
    "Progreso legible recuperado. El guardado dañado original queda en este dispositivo.",
    "No se pudo leer el progreso anterior. Se conservó el original y se creó una tienda nueva.",
    "Cómo jugar",
    "Elige productos en cada estante y repón. Revisa coste y precio; los productos fríos necesitan un refrigerador.",
    "El equipo comprado va al Almacén. Elige una casilla válida y confirma. Guardar y recolocar equipo propio es gratis.",
    "Reserva dinero para existencias, contrata y mejora al equipo, y amplía10→13→16→19→22. Los monumentos son opcionales."
  ],
  "pt-BR": [
    "Objetivo",
    "Monte uma loja animal variada e abastecida. Reinvista vendas pagas em estoque, funcionários e equipamentos e amplie até22×22.",
    "Controles e regras",
    "Arraste para mover. Ative Girar câmera para girar ao arrastar; roda ou pinça para ampliar. R gira o equipamento escolhido. Cancelar ouEsc cancela a colocação; itens comprados ficam no Armazém.",
    "Fim e retorno",
    "Pagamentos aumentam o caixa e cumprem metas. Continue operando ou volte ao menu para pausar. O progresso fica neste dispositivo e continua ao abrir a loja.",
    "Metas concluídas. Abra Medalhas ou continue crescendo.",
    "Progresso legível recuperado. O arquivo danificado original fica neste dispositivo.",
    "Não foi possível ler o progresso anterior. O original foi preservado e uma nova loja foi criada.",
    "Como jogar",
    "Escolha produtos em cada prateleira e reponha. Veja custo e preço; produtos frios precisam de refrigerador.",
    "Equipamentos comprados vão ao Armazém. Escolha uma casa válida e confirme. Guardar e recolocar o que já possui é grátis.",
    "Reserve dinheiro para estoque, contrate e melhore a equipe e amplie10→13→16→19→22. Monumentos são opcionais."
  ],
  "fr": [
    "Objectif",
    "Développez une boutique animale variée et approvisionnée. Réinvestissez les ventes payées en stock, personnel et équipements, jusqu’à22×22.",
    "Commandes et règles",
    "Glissez pour déplacer. Activez Tourner la caméra pour pivoter en glissant ; molette ou pincement pour zoomer. R tourne le meuble choisi. Annuler ouEsc annule sa pose ; le meuble acheté reste en réserve.",
    "Fin et retour",
    "Les paiements augmentent la caisse et accomplissent les objectifs. Continuez ou revenez au menu pour suspendre. La progression reste sur cet appareil et reprend à l’ouverture.",
    "Objectifs accomplis. Ouvrez les badges ou continuez.",
    "Progression lisible récupérée. La sauvegarde endommagée originale reste sur cet appareil.",
    "La progression précédente est illisible. L’original est conservé et une nouvelle boutique a été créée.",
    "Comment jouer",
    "Choisissez et réapprovisionnez chaque rayon. Comparez coût et prix ; les produits frais exigent un réfrigérateur.",
    "Les meubles achetés vont en réserve. Choisissez une case valide et confirmez. Ranger et replacer vos meubles est gratuit.",
    "Gardez du budget pour le stock, recrutez et améliorez l’équipe, puis agrandissez10→13→16→19→22. Les monuments sont facultatifs."
  ],
  "de": [
    "Ziel",
    "Baue einen gut gefüllten Tierladen mit Vielfalt auf. Bezahlte Verkäufe finanzieren Vorräte, Personal, Ausstattung und Ausbau bis22×22.",
    "Steuerung und Regeln",
    "Ziehen verschiebt die Ansicht. Kamera drehen aktiviert Drehung beim Ziehen; Mausrad oder Pinch zoomt. R dreht das gewählte Objekt. Abbrechen oderEsc beendet das Platzieren; gekaufte Objekte bleiben im Lager.",
    "Abschluss und Rückmeldung",
    "Zahlungen erhöhen Geld und erfüllen Ziele. Betreibe den Laden weiter oder gehe zum Pausieren zurück zum Menü. Der Fortschritt bleibt auf diesem Gerät und läuft beim Öffnen weiter.",
    "Ladenziele geschafft. Öffne Abzeichen oder spiele weiter.",
    "Lesbarer Fortschritt wiederhergestellt. Der beschädigte Originalstand bleibt auf diesem Gerät.",
    "Der alte Fortschritt ist unlesbar. Das Original wurde gesichert und ein neuer Laden erstellt.",
    "So spielst du",
    "Wähle Waren je Regal und bestelle Vorräte. Prüfe Kosten und Preis; kalte Waren brauchen einen Kühlschrank.",
    "Gekaufte Objekte kommen ins Lager. Wähle ein gültiges Feld und bestätige. Einlagern und erneutes Platzieren eigener Objekte ist gratis.",
    "Behalte Geld für Vorräte, stelle Personal ein, verbessere das Team und erweitere10→13→16→19→22. Wahrzeichen sind optional."
  ],
  "it": [
    "Obiettivo",
    "Crea un negozio animale vario e rifornito. Reinvesti vendite pagate in scorte, personale e attrezzature, fino a22×22.",
    "Comandi e regole",
    "Trascina per spostare. Attiva Ruota camera per ruotare trascinando; rotella o pizzico per zoomare. R ruota l’oggetto scelto. Annulla oEsc annulla il posizionamento; gli acquisti restano in Magazzino.",
    "Fine e riscontro",
    "I pagamenti aumentano cassa e obiettivi. Continua o torna al menu per sospendere. I progressi restano su questo dispositivo e riprendono all’apertura.",
    "Obiettivi completati. Apri Distintivi o continua.",
    "Progressi leggibili recuperati. Il salvataggio originale danneggiato resta su questo dispositivo.",
    "I vecchi progressi non sono leggibili. L’originale è conservato ed è stato creato un nuovo negozio.",
    "Come giocare",
    "Scegli prodotti su ogni scaffale e rifornisci. Controlla costo e prezzo; i prodotti freddi richiedono un frigorifero.",
    "Gli acquisti vanno in Magazzino. Scegli una casella valida e conferma. Riporre e riposizionare oggetti posseduti è gratuito.",
    "Tieni fondi per le scorte, assumi e migliora la squadra, poi amplia10→13→16→19→22. I monumenti sono facoltativi."
  ],
  "ru": [
    "Цель",
    "Развивайте разнообразный магазин животных. Оплаченные продажи финансируют запасы, персонал и оборудование, а площадь растёт до22×22.",
    "Управление и правила",
    "Перетаскивание сдвигает вид. Включите поворот камеры для вращения; колесо или жест двумя пальцами меняет масштаб. R вращает выбранный объект. Отмена илиEsc отменяет размещение; купленное остаётся на складе.",
    "Завершение и отклик",
    "Оплата увеличивает деньги и выполняет цели. Продолжайте работу или вернитесь в меню для паузы. Прогресс хранится на устройстве и продолжается при открытии.",
    "Цели выполнены. Откройте значки или продолжайте.",
    "Читаемый прогресс восстановлен. Повреждённый оригинал сохранён на устройстве.",
    "Старый прогресс прочитать нельзя. Оригинал сохранён; создан новый магазин.",
    "Как играть",
    "Выбирайте товары на каждой полке и пополняйте запас. Сравнивайте себестоимость и цену; холодным товарам нужен холодильник.",
    "Покупки попадают на склад. Выберите допустимую клетку и подтвердите. Хранить и вновь размещать свои объекты можно бесплатно.",
    "Оставляйте деньги на запасы, нанимайте и улучшайте команду, расширяйтесь10→13→16→19→22. Памятники необязательны."
  ],
  "hi": [
    "लक्ष्य",
    "विविध सामान वाला पशु स्टोर बढ़ाएँ। वास्तविक भुगतान की बिक्री से भंडार, कर्मचारी और उपकरण लें तथा22×22 तक विस्तार करें।",
    "नियंत्रण और नियम",
    "खींचकर दृश्य सरकाएँ। कैमरा घुमाना चालू करके खींचें; पहिए या दो उँगलियों से ज़ूम करें। R चयनित उपकरण घुमाता है। रद्द याEsc से रखना रद्द होता है; खरीदा उपकरण गोदाम में रहता है।",
    "समाप्ति और प्रतिक्रिया",
    "भुगतान से नकद और लक्ष्य बढ़ते हैं। आगे दुकान चलाएँ या मुख्य मेन्यू में लौटकर रोकें। प्रगति इसी उपकरण में बचती है और दुकान खोलने पर जारी रहती है।",
    "दुकान के लक्ष्य पूरे। बैज देखें या आगे बढ़ाएँ।",
    "पढ़ी जा सकने वाली प्रगति लौटाई गई। खराब मूल सेव इसी उपकरण में सुरक्षित है।",
    "पुरानी प्रगति पढ़ी नहीं जा सकी। मूल सेव सुरक्षित रखा गया और नई दुकान बनाई गई।",
    "कैसे खेलें",
    "हर शेल्फ पर सामान चुनकर भंडार मँगाएँ। लागत और बिक्री मूल्य देखें; ठंडे सामान के लिए फ्रिज चाहिए।",
    "खरीदे उपकरण गोदाम में जाते हैं। सही खाना चुनकर रखने की पुष्टि करें। अपने उपकरण हटाकर दोबारा रखना मुफ्त है।",
    "भंडार के पैसे बचाएँ, कर्मचारी और टीम सुधारें तथा10→13→16→19→22 विस्तार करें। स्मारक वैकल्पिक हैं।"
  ],
  "ar": [
    "الهدف",
    "طوّر متجر حيوانات متنوعًا ومخزونًا. أعد استثمار المبيعات المدفوعة في السلع والموظفين والمعدات والتوسع حتى22×22.",
    "التحكم والقواعد",
    "اسحب لتحريك المنظر. فعّل تدوير الكاميرا للدوران بالسحب؛ العجلة أو إصبعان للتكبير. R يدير القطعة المختارة. إلغاء أوEsc يلغي وضعها؛ تبقى المشتريات في المخزن.",
    "الانتهاء والاستجابة",
    "الدفع يزيد المال ويحقق الأهداف. واصل التشغيل أو عد إلى القائمة الرئيسية للإيقاف المؤقت. يبقى التقدم على هذا الجهاز ويستأنف عند فتح المتجر.",
    "اكتملت أهداف المتجر. افتح الشارات أو واصل النمو.",
    "استُعيد التقدم القابل للقراءة. يبقى الحفظ الأصلي التالف على هذا الجهاز.",
    "تعذر قراءة التقدم السابق. حُفظ الأصل وأُنشئ متجر جديد.",
    "كيفية اللعب",
    "اختر سلع كل رف واطلب المخزون. راجع التكلفة والسعر؛ السلع الباردة تحتاج ثلاجة.",
    "تذهب المعدات المشتراة إلى المخزن. اختر خانة صالحة وأكد الوضع. حفظ معداتك ووضعها مجددًا مجاني.",
    "احتفظ بمال للمخزون ووظّف وحسّن الفريق وتوسع10→13→16→19→22. المعالم اختيارية."
  ]
};
for(const locale of supportedLocales){const values=issueV14GuideRows[locale];if(values.length!==issueV14GuideKeys.length)throw new Error("Incomplete Blockmart v14 guide: "+locale);issueV14GuideKeys.forEach((key,index)=>dict[locale][key]=values[index]);}keys.push(...issueV14GuideKeys.filter(key=>!keys.includes(key)));
// v15: choosing the employee role is the only automatic-restock control.
const roleRestockCopy={
 en:['Restock staff automatically buy up to 4 affordable units per trip. They wait when cash or storage is short.','Hire staff and choose Restock for automatic paid deliveries. Keep cash for stock.'],
 'zh-Hant':['補貨員每趟自動購入最多 4 件負擔得起的商品；現金或空間不足時等待。','雇用員工並選擇補貨職務，即會自動付費補貨；記得預留進貨現金。'],
 'zh-Hans':['补货员每趟自动购入最多 4 件负担得起的商品；现金或空间不足时等待。','雇用员工并选择补货职务，即会自动付费补货；记得预留进货现金。'],
 ja:['補充担当は1回につき購入可能な商品を最大4個自動で仕入れます。資金や空き容量が足りない間は待機します。','スタッフを雇い、補充担当を選ぶと自動で有料仕入れを行います。仕入れ資金を残しましょう。'],
 ko:['보충 직원은 매번 살 수 있는 상품을 최대 4개 자동 구매합니다. 자금이나 보관 공간이 부족하면 기다립니다.','직원을 고용하고 보충 역할을 선택하면 자동으로 유료 입고합니다. 재고 구매 자금을 남겨 두세요.'],
 es:['El personal de reposición compra hasta 4 unidades asequibles por viaje. Espera si falta dinero o espacio.','Contrata personal y elige Reposición para compras automáticas. Reserva dinero para existencias.'],
 'pt-BR':['A equipe de reposição compra até 4 unidades por viagem, conforme o saldo. Aguarda se faltar dinheiro ou espaço.','Contrate funcionários e escolha Reposição para compras automáticas. Reserve dinheiro para estoque.'],
 fr:['Le personnel de réassort achète au plus 4 unités abordables par trajet. Il attend si les fonds ou la place manquent.','Embauchez et choisissez Réassort pour les achats automatiques. Gardez des fonds pour le stock.'],
 de:['Nachfüllkräfte kaufen je Weg bis zu 4 bezahlbare Einheiten automatisch. Bei Geld- oder Platzmangel warten sie.','Personal einstellen und Nachfüllen wählen: Der Einkauf läuft automatisch. Geld für Waren zurücklegen.'],
 it:['Gli addetti al rifornimento acquistano fino a 4 unità per viaggio secondo il saldo. Aspettano se mancano fondi o spazio.','Assumi e scegli Rifornimento per gli acquisti automatici. Conserva fondi per le scorte.'],
 ru:['Сотрудник пополнения автоматически покупает до 4 доступных по цене единиц за рейс. Если денег или места мало, он ждёт.','Наймите сотрудника и выберите пополнение для автоматических закупок. Оставляйте деньги на товар.'],
 hi:['पुनर्भरण कर्मचारी हर चक्कर में बजट के अनुसार अधिकतम 4 सामान अपने आप खरीदते हैं। पैसे या जगह की कमी पर वे इंतज़ार करते हैं।','कर्मचारी रखें और पुनर्भरण की भूमिका चुनें; खरीद अपने आप होगी। सामान के लिए नकदी बचाएँ।'],
 ar:['يشتري موظف التزويد تلقائيًا حتى 4 وحدات يستطيع المتجر دفع ثمنها في الرحلة. ينتظر عند نقص المال أو المساحة.','وظّف موظفًا واختر دور التزويد ليشتري المخزون تلقائيًا. احتفظ بمال لشراء السلع.']
};
for(const locale of supportedLocales){[dict[locale].helperAutoRestockHint,dict[locale].guideTeam]=roleRestockCopy[locale];}
const rewardProfitKeys=['achievementsIntro','reward_payments','reward_restocked','reward_gross','reward_equipment','reward_minutes','reward_service','rewardTier','claimReward','netProfitMinute','netProfitWindow'];
const rewardProfitCopy={
 en:['Claim cash at each milestone. Your total progress carries into the next tier.','Customer payments','Items restocked','Total sales revenue','Equipment acquired','Minutes open','Customers served within 17 seconds','Tier','Claim','Average net profit / min:','Last 60 operating seconds. Sales minus stock purchases; other purchases and rewards excluded.'],
 'zh-Hant':['達標後點擊領獎，累積進度保留並進入下一階。','累積結帳次數','累積補貨件數','累積銷售金額','累積取得設備','累積營業分鐘','17 秒內完成服務','階段','領取獎金','平均每分鐘淨收益：','最近 60 秒營運時間：商品收入減補貨成本；不含設備、擴建與獎金。'],
 'zh-Hans':['达标后点击领奖，累计进度保留并进入下一阶。','累计结账次数','累计补货件数','累计销售金额','累计取得设备','累计营业分钟','17 秒内完成服务','阶段','领取奖金','平均每分钟净收益：','最近 60 秒营业时间：商品收入减补货成本；不含设备、扩建与奖金。'],
 ja:['達成したらタップで受け取り。累計進捗を保ったまま次の段階へ。','累計会計回数','累計仕入れ個数','累計売上','取得した設備','累計営業分数','17秒以内の接客','段階','受け取る','平均純利益 / 分：','直近60秒の営業時間。売上から仕入れを差し引き、設備と報酬は除外。'],
 ko:['목표 달성 후 눌러 보상을 받으세요. 누적 진행은 다음 단계에 유지됩니다.','누적 결제','누적 보충 수량','누적 매출','획득한 장비','누적 영업 시간(분)','17초 이내 서비스','단계','보상 받기','분당 평균 순수익:','최근 영업 60초의 매출에서 재고 구입비를 뺍니다. 장비와 보상은 제외합니다.'],
 es:['Reclama dinero al alcanzar cada meta. El progreso acumulado continúa.','Pagos de clientes','Unidades repuestas','Ventas acumuladas','Equipos adquiridos','Minutos de apertura','Clientes atendidos en 17 segundos','Nivel','Cobrar','Beneficio neto medio / min:','Últimos 60 segundos de actividad: ventas menos compras de stock. Excluye equipos y premios.'],
 'pt-BR':['Resgate dinheiro a cada meta. O progresso acumulado continua na próxima etapa.','Pagamentos de clientes','Unidades repostas','Vendas acumuladas','Equipamentos adquiridos','Minutos de funcionamento','Clientes atendidos em 17 segundos','Etapa','Resgatar','Lucro líquido médio / min:','Últimos 60 segundos de operação: vendas menos compras de estoque. Exclui equipamentos e prêmios.'],
 fr:['Réclamez la prime à chaque palier. La progression cumulée est conservée.','Paiements clients','Articles réapprovisionnés','Ventes cumulées','Équipements acquis','Minutes d’ouverture','Clients servis en 17 secondes','Palier','Réclamer','Bénéfice net moyen / min :','60 dernières secondes d’activité : ventes moins achats de stock. Hors équipements et primes.'],
 de:['Prämie bei jedem Ziel abholen. Der Gesamtfortschritt bleibt erhalten.','Kundenzahlungen','Nachgefüllte Artikel','Gesamtumsatz','Erworbene Ausstattung','Geöffnete Minuten','Kunden in 17 Sekunden bedient','Stufe','Abholen','Ø Nettogewinn / Min.:','Letzte 60 Betriebssekunden: Umsatz minus Wareneinkauf. Ausstattung und Prämien zählen nicht.'],
 it:['Riscatta il premio a ogni traguardo. I progressi cumulativi restano.','Pagamenti clienti','Articoli riforniti','Vendite cumulative','Attrezzature acquisite','Minuti di apertura','Clienti serviti entro 17 secondi','Livello','Riscuoti','Utile netto medio / min:','Ultimi 60 secondi di attività: vendite meno acquisti di scorte. Esclusi attrezzature e premi.'],
 ru:['Забирайте деньги за каждый этап. Общий прогресс сохраняется.','Оплаты покупателей','Пополнено товаров','Общая выручка','Получено оборудования','Минуты работы','Клиенты обслужены за 17 секунд','Этап','Получить','Средняя чистая прибыль / мин:','Последние 60 секунд работы: продажи минус закупки. Оборудование и награды не учитываются.'],
 hi:['हर लक्ष्य पर पुरस्कार लें। कुल प्रगति अगले चरण में बनी रहती है।','ग्राहक भुगतान','भरे गए सामान','कुल बिक्री','प्राप्त उपकरण','दुकान खुलने के मिनट','17 सेकंड में सेवा','चरण','इनाम लें','औसत शुद्ध लाभ / मिनट:','पिछले 60 सक्रिय सेकंड: बिक्री घटा सामान की खरीद। उपकरण और पुरस्कार शामिल नहीं हैं।'],
 ar:['اضغط لاستلام المكافأة عند كل هدف. يستمر التقدم التراكمي إلى المرحلة التالية.','مدفوعات الزبائن','وحدات أُعيد تزويدها','إجمالي المبيعات','المعدات المكتسبة','دقائق العمل','زبائن خُدموا خلال 17 ثانية','المرحلة','استلام','متوسط صافي الربح / دقيقة:','آخر 60 ثانية عمل: المبيعات ناقص شراء المخزون. لا تشمل المعدات والمكافآت.']
};
for(const locale of supportedLocales){Object.assign(dict[locale],Object.fromEntries(rewardProfitKeys.map((key,i)=>[key,rewardProfitCopy[locale][i]])));dict[locale].badgesTab=dict[locale].achievementTab;}
keys.push(...rewardProfitKeys.filter(key=>!keys.includes(key)));
const decorTrafficCopy={
 en:['Decoration traffic','Extra customers while placed. More decorations add a smaller bonus.'],
 'zh-Hant':['裝飾額外客流','擺放後吸引更多客人；越多裝飾，新增效益逐漸遞減。'],
 'zh-Hans':['装饰额外客流','摆放后吸引更多客人；装饰越多，新增效益逐渐递减。'],
 ja:['装飾による追加来客','設置中は来客が増加。追加するほど増分は小さくなります。'],
 ko:['장식 추가 방문객','배치한 장식이 손님을 늘립니다. 많을수록 추가 효과는 줄어듭니다.'],
 es:['Clientes extra por decoración','Atrae clientes al colocarla. Cada decoración adicional aporta menos.'],
 'pt-BR':['Clientes extras por decoração','Atrai clientes quando colocada. Cada decoração adicional contribui menos.'],
 fr:['Clientèle bonus des décorations','Attire des clients une fois placée. Les ajouts ont un effet décroissant.'],
 de:['Zusatzkundschaft durch Dekoration','Aufgestellte Deko zieht Kunden an. Weitere Stücke bringen weniger Zuwachs.'],
 it:['Clienti extra dalle decorazioni','Attira clienti quando posizionata. Ogni aggiunta rende meno.'],
 ru:['Дополнительные посетители от декора','Привлекает клиентов, пока стоит в зале. Каждая следующая даёт меньший прирост.'],
 hi:['सजावट से अतिरिक्त ग्राहक','रखी हुई सजावट ग्राहक बढ़ाती है। हर अतिरिक्त सजावट का लाभ थोड़ा कम होता है।'],
 ar:['زبائن إضافيون من الزينة','تجذب الزبائن عند وضعها. تقل الزيادة مع كل قطعة إضافية.']
};
for(const locale of supportedLocales)[dict[locale].decorTraffic,dict[locale].decorTrafficHint]=decorTrafficCopy[locale];
keys.push('decorTraffic','decorTrafficHint');
const decorPlacedCopy=['Placed: extra customers','擺放：增加客流','摆放：增加客流','設置で来客増加','배치 시 방문객 증가','Colocada: más clientes','Colocada: mais clientes','Placée : plus de clients','Aufgestellt: mehr Kunden','Posizionata: più clienti','В зале: больше клиентов','रखने पर अधिक ग्राहक','عند وضعها: زبائن أكثر'];
for(const [i,locale]of supportedLocales.entries())dict[locale].decorPlaced=decorPlacedCopy[i];
keys.push('decorPlaced');
const compactSlotCopy=[
 ['1 dry product','2 dry products · stock +20','2 cold products · stock +30'],
 ['1 款乾貨','2 款乾貨 · 庫存 +20','2 款冷藏 · 庫存 +30'],
 ['1 款干货','2 款干货 · 库存 +20','2 款冷藏 · 库存 +30'],
 ['常温1種','常温2種 · 在庫 +20','冷蔵2種 · 在庫 +30'],
 ['상온 상품 1종','상온 2종 · 재고 +20','냉장 2종 · 재고 +30'],
 ['1 producto seco','2 secos · stock +20','2 fríos · stock +30'],
 ['1 produto seco','2 secos · estoque +20','2 frios · estoque +30'],
 ['1 produit sec','2 secs · stock +20','2 froids · stock +30'],
 ['1 Trockenware','2 Trockenwaren · Lager +20','2 Kühlwaren · Lager +30'],
 ['1 prodotto secco','2 secchi · scorte +20','2 freddi · scorte +30'],
 ['1 сухой товар','2 сухих · запас +20','2 охлаждённых · запас +30'],
 ['1 सूखा उत्पाद','2 सूखे · भंडार +20','2 ठंडे · भंडार +30'],
 ['منتج جاف واحد','منتجان جافان · مخزون +20','منتجان مبردان · مخزون +30']
];
for(const [i,locale]of supportedLocales.entries())[dict[locale].singlePurpose,dict[locale].doublePurpose,dict[locale].coolerPurpose]=compactSlotCopy[i];
const profitPeriodCopy=['Last 60 operating seconds','最近 60 秒營運時間','最近 60 秒营业时间','直近60秒の営業時間','최근 영업 60초','Últimos 60 segundos de actividad','Últimos 60 segundos de operação','60 dernières secondes d’activité','Letzte 60 Betriebssekunden','Ultimi 60 secondi di attività','Последние 60 секунд работы','पिछले 60 सक्रिय सेकंड','آخر 60 ثانية عمل'];
for(const [i,locale]of supportedLocales.entries())dict[locale].recentBusiness=profitPeriodCopy[i];
const expansionRuleCopy=[
 ['Expand shop','Visitor capacity','More space brings more visitors. Existing passages and fixtures stay put; provide enough checkout service.'],
 ['擴建店面','接待容量','擴建增加空間與來客；原出入口和設備不搬動，記得增加收銀服務。'],
 ['扩建店面','接待容量','扩建增加空间与来客；原出入口和设备不搬动，记得增加收银服务。'],
 ['店舗を拡張','来客定員','空間と来客が増えます。既存の出入口と設備はそのまま。会計能力も増やしましょう。'],
 ['매장 확장','방문객 정원','공간과 방문객이 늘어납니다. 기존 출입구와 장비는 유지됩니다. 계산 서비스도 늘리세요.'],
 ['Ampliar tienda','Capacidad de clientes','Más espacio atrae visitas. Los accesos y equipos se conservan; amplía también el servicio de caja.'],
 ['Ampliar loja','Capacidade de clientes','Mais espaço atrai visitas. Acessos e equipamentos ficam no lugar; amplie também o atendimento nos caixas.'],
 ['Agrandir la boutique','Capacité clients','Plus d’espace attire des clients. Accès et équipements restent en place ; adaptez aussi les caisses.'],
 ['Laden erweitern','Kundenkapazität','Mehr Platz bringt mehr Kundschaft. Zugänge und Ausstattung bleiben stehen; erweitere auch den Kassenservice.'],
 ['Espandi negozio','Capienza clienti','Più spazio attira clienti. Accessi e attrezzature restano al loro posto; aumenta anche il servizio alle casse.'],
 ['Расширить магазин','Вместимость','Больше места привлекает клиентов. Входы и оборудование остаются на месте; увеличивайте и число кассиров.'],
 ['दुकान बढ़ाएँ','ग्राहक क्षमता','अधिक जगह से ग्राहक बढ़ते हैं। पुराने रास्ते और उपकरण अपनी जगह रहते हैं; भुगतान सेवा भी बढ़ाएँ।'],
 ['توسعة المتجر','سعة الزبائن','المساحة الأكبر تجذب زبائن أكثر. تبقى المداخل والمعدات في أماكنها؛ زِد خدمة الدفع أيضًا.']
];
for(const [i,locale]of supportedLocales.entries())[dict[locale].expand,dict[locale].visitorCapacity,dict[locale].expansionTrafficHint]=expansionRuleCopy[i];
keys.push('visitorCapacity','expansionTrafficHint');
const remainingCountLabels=['Remaining','剩餘數量','剩余数量','残り','남은 수량','Quedan','Restam','Restants','Verfügbar','Disponibili','Осталось','शेष','المتبقي'];
for(const [index,locale]of supportedLocales.entries())dict[locale].remainingCount=remainingCountLabels[index];
keys.push('remainingCount');
const aliases={'zh-tw':'zh-Hant','zh-hant':'zh-Hant','zh-cn':'zh-Hans','zh-hans':'zh-Hans','pt-br':'pt-BR'};
export function resolveLocale(){
  const url=new URL(location.href);
  // A localized entry owns its language. The referring page is never a
  // preference: Settings navigates from the previous language's route.
  let saved='';
  try{saved=localStorage.getItem('weightPlayLocale')||localStorage.getItem('weightplayLocale')||localStorage.getItem('wp-locale')||''}catch{}
  for(const raw of [url.pathname.split('/')[1],url.searchParams.get('lang'),saved,document.documentElement.lang]){
    const value=String(raw||'');const locale=aliases[value.toLowerCase()]||value;
    if(supportedLocales.includes(locale))return locale;
  }
  return 'en';
}
export function t(key,locale=resolveLocale()){
  if(key==='title')return globalThis.WEIGHTPLAY_GAME_TITLES?.['animal-blockmart']?.[locale]??dict[locale]?.title??dict.en.title;
  return dict[locale]?.[key]??dict.en[key]??key;
}
