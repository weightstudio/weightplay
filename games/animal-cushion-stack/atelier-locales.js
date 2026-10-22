/* Current gameplay copy. Legacy catalog supplies only unchanged identity/navigation. */
(() => {
  'use strict';
  const schema={
    materials:'felt linen cloud feltNote linenNote cloudNote',
    actions:'drop next replay help pause continue close equip equipped buy confirmBuy retry',
    status:'ready perfect steady miss win final lose winNote loseNote leaveTitle leaveText insufficient storage purchased',
    labels:'score layers attempts alignment combo wind calm studio garden moon free permanent owned balance saved request stars bestScore chapter check goal progress controls',
  };
  const data={
    'zh-Hans':{
      materials:'苔绿毛毡|金色亚麻|玫瑰云垫|宽容好上手|精准 · +45%|宽幅 · +20%',
      actions:'放下软垫|下一关|再玩一次|玩法说明|暂停|继续堆叠|知道了|使用配色|使用中|解锁 · 12|确认 · 12 颗钻石|重新加载',
      status:'对准发光的落点标记|完美落下！|稳稳接住|支撑不足，再靠近塔身一点。|又高了一点！|你的天空城完成了！|每座高塔，都从再试一次开始。|瞭望台已保存，继续向上吧。|先前通关已保留，试着更靠近落点。|休息一下吗？|离开会放弃未完成的塔，已解锁关卡、星星和布料会保留。|钻石不足，花园布料仍免费。|无法保存进度，仍可免费游玩。|月光布料已加入收藏！',
      labels:'分数|层数|机会|对齐|连击|风向|风平浪静|布料工坊|花园布料|月光布料|免费 · 永久拥有|永久配色 · 12 颗钻石|已永久收藏|钻石余额|已保存|本层布料|星星|本关最佳|章节|挑战关|堆起 {n} 层|瞭望台 {n} / 30|拖曳瞄准 · 放手落下',
      summary:'用软垫堆起 30 座瞭望台，六个章节逐步加入风向、偏移落点和布料订单，每五关一次综合挑战。',
      helpText:'看准金色标记后按放下软垫，或在场景中拖曳并放手。方向键瞄准，空格键落下，数字 1–3 选择布料。半透明预览显示风带来的偏移。足够的重叠才能站稳；三次失手结束本次挑战。没有倒计时。',
      fabricText:'毛毡较宽容；亚麻更窄，基础分数较高；云垫更宽，也需要更多支撑。当前软垫会成为下一层的支撑。遇到订单时须使用指定布料。',
      starsText:'通关获得一颗星，至少四成完美获得第二颗，零失误且至少七成完美获得三颗。连续完美增加奖励，重玩不会降低最佳纪录。旧版通关保留，新星星重新挑战。',
      studioText:'收藏永久布料配色，不影响规则、得分或关卡。购买前确认价格，拥有后可随时切换。花园布料始终免费；无法保存时禁止购买。',
      engine:'3D 场景加载失败，请重新加载。',arcs:'草地初见|微风工坊|灯火小径|云端高塔|拼布工坊|天空之城',
    },
    ja:{
      materials:'苔のフェルト|金色のリネン|バラ色の雲|置きやすい|精密 · +45%|幅広 · +20%',
      actions:'クッションを落とす|次のステージ|もう一度|遊び方|一時停止|続ける|閉じる|使う|使用中|解放 · 12|確認 · ダイヤ12個|再読み込み',
      status:'光る着地点に合わせよう|パーフェクト！|やさしく着地|支えが足りません。塔の近くに置こう。|もっと高く！|天空のお城が完成！|もう一度、ここから。|進み具合を保存しました。|前のクリアは残っています。|ひと休みしますか？|未完成の塔は失われます。クリア、星、布地は残ります。|ダイヤが足りません。庭園の布地は無料です。|保存できません。無料で遊べますが進み具合は残りません。|月光の布地を入手！',
      labels:'スコア|段数|残り回数|位置合わせ|コンボ|風|無風|布地の工房|庭園の布地|月光の布地|無料 · ずっと所有|永久カラー · ダイヤ12個|所有済み|ダイヤ残高|保存済み|指定の布地|星|ベスト|章|挑戦|{n} 段積もう|見晴らし台 {n} / 30|ドラッグで合わせ、離して落とす',
      summary:'30 の見晴らし台を築こう。全6章で風、ずれた着地点、布地の注文が登場し、5ステージごとに総合チャレンジが待っています。',
      helpText:'金色の印に合わせて落下ボタンを押すか、画面をドラッグして離します。矢印キーで照準、スペースで落下、数字1〜3で布地を選択。半透明の予測位置で風の影響を確認できます。十分に重なれば成功。3回失敗すると今回の挑戦は終了します。時間制限はありません。',
      fabricText:'フェルトは置きやすく、リネンは細い代わりに基本点が高く、雲は幅広ですが大きな支えが必要です。置いたクッションが次の土台になります。注文が出たら指定の布地を使います。',
      starsText:'クリアで星1個。4割以上パーフェクトなら星2個。失敗なしで7割以上なら星3個です。連続パーフェクトで加点。再挑戦してもベスト記録は下がりません。旧版のクリアは引き継ぎ、新しい星は改めて獲得します。',
      studioText:'永久カラーを集められます。見た目だけが変わり、ルールや得点は同じです。価格を確認して購入し、所有した配色はいつでも切り替えられます。庭園の布地は無料。保存不可の場合は購入できません。',
      engine:'3Dシーンを読み込めませんでした。再読み込みしてください。',arcs:'草原のはじまり|そよ風の工房|灯りの小道|雲の塔|パッチワーク工房|天空のお城',
    },
    ko:{
      materials:'이끼 펠트|황금 리넨|장미 구름|넉넉한 판정|정밀 · +45%|넓은 폭 · +20%',
      actions:'쿠션 놓기|다음 단계|다시 하기|게임 방법|일시 정지|계속 쌓기|닫기|사용|사용 중|해제 · 12|확인 · 다이아 12개|다시 불러오기',
      status:'빛나는 착지 표시에 맞추세요|완벽해요!|포근한 착지|받침이 부족해요. 탑에 더 가까이 놓으세요.|조금 더 높이!|하늘 궁전 완성!|다시 시작해 볼까요?|진행 상황을 저장했어요.|이전 완료 기록은 그대로예요.|잠깐 쉬어 갈까요?|미완성 탑은 사라지지만 완료 기록, 별, 원단은 유지돼요.|다이아가 부족해요. 정원 원단은 무료예요.|저장할 수 없어요. 무료로 플레이할 수 있지만 진행은 저장되지 않아요.|달빛 원단을 얻었어요!',
      labels:'점수|층|남은 기회|정렬|콤보|바람|바람 없음|원단 공방|정원 원단|달빛 원단|무료 · 영구 소유|영구 색상 · 다이아 12개|보유 중|다이아 잔액|저장됨|지정 원단|별|최고 점수|장|도전|{n} 층 쌓기|전망대 {n} / 30|드래그로 조준 · 놓아서 착지',
      summary:'전망대 30개를 쌓으세요. 6개 장에서 바람, 어긋난 착지점, 원단 주문을 배우고 다섯 단계마다 종합 도전을 만나요.',
      helpText:'금색 표시에 맞춰 쿠션 놓기를 누르거나 장면을 드래그한 뒤 놓으세요. 방향키로 조준하고 스페이스로 놓으며 1~3으로 원단을 선택해요. 반투명 미리보기는 바람에 밀릴 위치를 보여 줘요. 충분히 겹쳐야 성공하고 세 번 실패하면 이번 도전이 끝나요. 시간 제한은 없어요.',
      fabricText:'펠트는 판정이 넉넉해요. 리넨은 좁지만 기본 점수가 높아요. 구름은 넓지만 더 많은 받침이 필요해요. 놓은 쿠션이 다음 층의 받침이 돼요. 주문이 나오면 지정된 원단을 사용하세요.',
      starsText:'완료하면 별 1개, 40% 이상 완벽하게 놓으면 2개, 실패 없이 70% 이상이면 3개예요. 연속 완벽 착지는 추가 점수를 줘요. 다시 해도 최고 기록은 줄지 않아요. 이전 버전의 완료 기록은 유지되고 새 별은 새로 도전해요.',
      studioText:'영구 색상을 모으세요. 색상은 규칙과 점수에 영향을 주지 않아요. 가격을 확인하고 구매한 뒤 언제든 바꿀 수 있어요. 정원 원단은 항상 무료이고 저장할 수 없으면 구매가 제한돼요.',
      engine:'3D 장면을 불러오지 못했어요. 다시 불러와 주세요.',arcs:'초원의 시작|산들바람 공방|등불 오솔길|구름 첨탑|조각 원단 공방|하늘 궁전',
    },
    es:{
      materials:'Fieltro musgo|Lino dorado|Nube rosa|Más tolerante|Preciso · +45%|Ancho · +20%',
      actions:'Soltar cojín|Siguiente|Repetir|Cómo jugar|Pausa|Continuar|Cerrar|Usar|En uso|Desbloquear · 12|Confirmar · 12 diamantes|Recargar',
      status:'Apunta a la marca iluminada|¡PERFECTO!|Aterrizaje suave|Falta apoyo. Acércate a la torre.|¡Un poco más alto!|¡Tu palacio está listo!|Toda torre empieza de nuevo.|Tu progreso está guardado.|Los niveles anteriores siguen guardados.|¿Un descanso?|Perderás la torre sin terminar. Los niveles, estrellas y telas se conservan.|Faltan diamantes. Las telas Jardín son gratis.|No se puede guardar. Puedes jugar, pero perderás el progreso nuevo.|¡Ya tienes las telas Luz de luna!',
      labels:'Puntos|Capas|Intentos|Alineación|Combo|Viento|Sin viento|Taller de telas|Telas Jardín|Luz de luna|Gratis · para siempre|Paleta permanente · 12 diamantes|En propiedad|Diamantes|Guardado|Tela solicitada|Estrellas|Mejor puntuación|CAPÍTULO|DESAFÍO|Apila {n} capas|Mirador {n} / 30|Arrastra para apuntar · suelta para colocar',
      summary:'Construye 30 miradores en seis capítulos con viento, marcas desplazadas y pedidos de telas. Cada quinto nivel combina lo aprendido.',
      helpText:'Pulsa Soltar cuando el cojín coincida con la marca dorada, o arrastra y suelta en la escena. Usa las flechas para apuntar, Espacio para soltar y 1–3 para elegir tela. La vista transparente muestra el efecto del viento. Hace falta suficiente solapamiento; tres fallos terminan el intento. No hay cuenta atrás.',
      fabricText:'El fieltro tolera menos apoyo. El lino es más estrecho y da más puntos base. La nube es más ancha, pero necesita más apoyo. Cada cojín sostiene el siguiente. Cuando aparezca un pedido, utiliza la tela indicada.',
      starsText:'Completar da una estrella. Un 40% de aterrizajes perfectos da dos; sin fallos y con un 70% perfecto, tres. Los perfectos seguidos suman un bonus. Repetir nunca reduce tu récord. Se conservan los niveles antiguos; las nuevas estrellas se ganan jugando.',
      studioText:'Colecciona colores permanentes. No cambian las reglas ni los puntos. Confirma el precio antes de comprar y alterna entre tus paletas. Jardín siempre es gratis. Las compras se desactivan si no se puede guardar.',
      engine:'No se pudo cargar la escena 3D. Recarga para intentarlo de nuevo.',arcs:'Primeros prados|Taller de brisas|Sendero de faroles|Torres de nubes|Taller de retales|Palacio del cielo',
    },
    'pt-BR':{
      materials:'Feltro musgo|Linho dourado|Nuvem rosa|Mais tolerante|Preciso · +45%|Largo · +20%',
      actions:'Soltar almofada|Próxima|Repetir|Como jogar|Pausa|Continuar|Fechar|Usar|Em uso|Desbloquear · 12|Confirmar · 12 diamantes|Recarregar',
      status:'Mire na marca iluminada|PERFEITO!|Pouso suave|Falta apoio. Aproxime da torre.|Um pouco mais alto!|Seu palácio está pronto!|Toda torre pode recomeçar.|Seu progresso foi salvo.|As fases anteriores continuam salvas.|Uma pausa?|A torre inacabada será perdida. Fases, estrelas e tecidos ficam salvos.|Diamantes insuficientes. Os tecidos Jardim são grátis.|Não é possível salvar. Você pode jogar, mas o novo progresso será perdido.|Tecidos Luar adquiridos!',
      labels:'Pontos|Camadas|Chances|Alinhamento|Combo|Vento|Sem vento|Ateliê de tecidos|Tecidos Jardim|Tecidos Luar|Grátis · para sempre|Paleta permanente · 12 diamantes|Adquirido|Diamantes|Salvo|Tecido pedido|Estrelas|Melhor pontuação|CAPÍTULO|DESAFIO|Empilhe {n} camadas|Mirante {n} / 30|Arraste para mirar · solte para colocar',
      summary:'Construa 30 mirantes em seis capítulos, com vento, marcas deslocadas e pedidos de tecido. A cada cinco fases, combine o que aprendeu.',
      helpText:'Toque em Soltar quando a almofada alcançar a marca dourada ou arraste e solte na cena. Use as setas para mirar, Espaço para soltar e 1–3 para escolher o tecido. A prévia transparente mostra o efeito do vento. É preciso ter apoio suficiente; três erros encerram a tentativa. Não há contagem regressiva.',
      fabricText:'O feltro aceita menos apoio. O linho é estreito e dá mais pontos básicos. A nuvem é larga, mas precisa de mais apoio. Cada almofada sustenta a próxima. Quando aparecer um pedido, use o tecido indicado.',
      starsText:'Concluir rende uma estrela. Com 40% de pousos perfeitos, você ganha duas; sem erros e com 70%, três. Perfeitos seguidos aumentam o bônus. Repetir nunca reduz seu recorde. Fases antigas são preservadas; as novas estrelas são conquistadas jogando.',
      studioText:'Colecione cores permanentes, sem mudar regras ou pontuação. Confira o preço antes de comprar e alterne entre suas paletas. Jardim é sempre grátis. Sem armazenamento, as compras ficam desativadas.',
      engine:'Não foi possível carregar a cena 3D. Tente recarregar.',arcs:'Primeiros prados|Ateliê da brisa|Trilha das lanternas|Torres de nuvens|Ateliê de retalhos|Palácio do céu',
    },
    fr:{
      materials:'Feutre mousse|Lin doré|Nuage rose|Tolérant|Précis · +45%|Large · +20%',
      actions:'Lâcher le coussin|Suivant|Rejouer|Comment jouer|Pause|Continuer|Fermer|Utiliser|Équipé|Débloquer · 12|Confirmer · 12 diamants|Recharger',
      status:'Vise la marque lumineuse|PARFAIT !|Atterrissage doux|Appui insuffisant. Rapproche-toi de la tour.|Un peu plus haut !|Ton palais est prêt !|Chaque tour peut recommencer.|Ta progression est enregistrée.|Les niveaux précédents sont conservés.|Une petite pause ?|La tour inachevée sera perdue. Niveaux, étoiles et tissus restent acquis.|Pas assez de diamants. Les tissus Jardin sont gratuits.|Sauvegarde indisponible. Tu peux jouer, mais la nouvelle progression sera perdue.|Les tissus Clair de lune sont à toi !',
      labels:'Score|Étages|Essais|Alignement|Combo|Vent|Sans vent|Atelier de tissus|Tissus Jardin|Clair de lune|Gratuit · permanent|Palette permanente · 12 diamants|Acquis|Diamants|Enregistré|Tissu demandé|Étoiles|Meilleur score|CHAPITRE|DÉFI|Empile {n} étages|Belvédère {n} / 30|Glisse pour viser · relâche pour poser',
      summary:'Construis 30 belvédères en six chapitres : vent, cibles décalées et commandes de tissus. Chaque cinquième niveau réunit les nouvelles règles.',
      helpText:'Appuie sur Lâcher lorsque le coussin rejoint la marque dorée, ou glisse puis relâche dans la scène. Les flèches visent, Espace lâche, et 1–3 choisissent le tissu. L’aperçu transparent montre la dérive du vent. Il faut assez de chevauchement ; trois erreurs terminent l’essai. Aucun compte à rebours.',
      fabricText:'Le feutre accepte moins d’appui. Le lin est étroit et rapporte davantage de points de base. Le nuage est large, mais demande plus d’appui. Chaque coussin soutient le suivant. Respecte le tissu indiqué lorsqu’une commande apparaît.',
      starsText:'Terminer rapporte une étoile. Avec 40 % de poses parfaites, tu en gagnes deux ; sans erreur et avec 70 %, trois. Les poses parfaites consécutives ajoutent un bonus. Rejouer ne réduit jamais ton record. Les anciens niveaux restent acquis ; les nouvelles étoiles sont à gagner.',
      studioText:'Collectionne des couleurs permanentes sans modifier les règles ni les scores. Confirme le prix avant l’achat, puis change de palette à volonté. Jardin reste gratuit. Sans sauvegarde, les achats sont désactivés.',
      engine:'La scène 3D n’a pas pu être chargée. Réessaie en rechargeant.',arcs:'Premières prairies|Atelier des brises|Sentier des lanternes|Tours de nuages|Atelier de patchwork|Palais du ciel',
    },
    de:{
      materials:'Moosfilz|Goldleinen|Rosenwolke|Fehlertolerant|Präzise · +45%|Breit · +20%',
      actions:'Kissen fallen lassen|Weiter|Erneut|Spielanleitung|Pause|Weiterbauen|Schließen|Verwenden|Aktiv|Freischalten · 12|Bestätigen · 12 Diamanten|Neu laden',
      status:'Auf die leuchtende Marke zielen|PERFEKT!|Sanft gelandet|Zu wenig Halt. Näher am Turm landen.|Ein Stück höher!|Dein Himmelsschloss ist fertig!|Jeder Turm kann neu beginnen.|Dein Fortschritt ist gespeichert.|Frühere Abschlüsse bleiben erhalten.|Eine kleine Pause?|Der unfertige Turm geht verloren. Level, Sterne und Stoffe bleiben erhalten.|Nicht genug Diamanten. Gartenstoffe bleiben kostenlos.|Speichern ist nicht möglich. Spielen geht weiterhin, neuer Fortschritt wird aber nicht gespeichert.|Mondlichtstoffe freigeschaltet!',
      labels:'Punkte|Lagen|Versuche|Ausrichtung|Kombo|Wind|Windstill|Stoffatelier|Gartenstoffe|Mondlichtstoffe|Kostenlos · dauerhaft|Dauerhafte Palette · 12 Diamanten|Im Besitz|Diamanten|Gespeichert|Gewünschter Stoff|Sterne|Bestwert|KAPITEL|PRÜFUNG|{n} Lagen stapeln|Aussichtspunkt {n} / 30|Zum Zielen ziehen · zum Ablegen loslassen',
      summary:'Baue 30 Aussichtspunkte in sechs Kapiteln. Wind, versetzte Ziele und Stoffaufträge kommen hinzu. Jeder fünfte Level kombiniert das Gelernte.',
      helpText:'Lass das Kissen an der goldenen Marke fallen oder ziehe es in der Szene und lasse los. Pfeiltasten zielen, Leertaste lässt fallen, 1–3 wählen Stoffe. Die transparente Vorschau zeigt den Windversatz. Genug Überlappung gibt Halt; drei Fehler beenden den Versuch. Es gibt kein Zeitlimit.',
      fabricText:'Filz benötigt weniger Überlappung. Leinen ist schmaler und bringt mehr Basispunkte. Die Wolke ist breiter, braucht aber mehr Halt. Jedes Kissen stützt das nächste. Bei einem Auftrag ist der angezeigte Stoff erforderlich.',
      starsText:'Ein Abschluss bringt einen Stern. Ab 40 % perfekten Landungen gibt es zwei; ohne Fehler und ab 70 % gibt es drei. Perfekte Serien erhöhen den Bonus. Wiederholungen senken keinen Bestwert. Alte Abschlüsse bleiben erhalten, neue Sterne werden neu erspielt.',
      studioText:'Sammle dauerhafte Farben ohne Einfluss auf Regeln oder Punkte. Bestätige den Preis und wechsle jederzeit zwischen eigenen Paletten. Gartenstoffe sind kostenlos. Ohne Speicherzugriff sind Käufe deaktiviert.',
      engine:'Die 3D-Szene konnte nicht geladen werden. Bitte erneut laden.',arcs:'Wiesenanfang|Brisenatelier|Laternenpfad|Wolkentürme|Patchworkatelier|Himmelsschloss',
    },
    it:{
      materials:'Feltro muschio|Lino dorato|Nuvola rosa|Tollerante|Preciso · +45%|Largo · +20%',
      actions:'Lascia il cuscino|Avanti|Rigioca|Come giocare|Pausa|Continua|Chiudi|Usa|In uso|Sblocca · 12|Conferma · 12 diamanti|Ricarica',
      status:'Mira al segno luminoso|PERFETTO!|Atterraggio morbido|Poco sostegno. Avvicinati alla torre.|Un po’ più in alto!|Il tuo palazzo è pronto!|Ogni torre può ricominciare.|Progressi salvati.|I livelli precedenti restano salvati.|Una piccola pausa?|Perderai la torre incompleta. Livelli, stelle e tessuti rimangono.|Diamanti insufficienti. I tessuti Giardino sono gratis.|Salvataggio non disponibile. Puoi giocare, ma i nuovi progressi andranno persi.|Tessuti Chiaro di luna ottenuti!',
      labels:'Punti|Strati|Tentativi|Allineamento|Combo|Vento|Senza vento|Atelier di tessuti|Tessuti Giardino|Chiaro di luna|Gratis · permanenti|Palette permanente · 12 diamanti|Posseduto|Diamanti|Salvato|Tessuto richiesto|Stelle|Record|CAPITOLO|SFIDA|Impila {n} strati|Belvedere {n} / 30|Trascina per mirare · rilascia per posare',
      summary:'Costruisci 30 belvederi in sei capitoli con vento, bersagli spostati e ordini di tessuti. Ogni quinto livello combina le regole imparate.',
      helpText:'Premi Lascia quando il cuscino è sul segno dorato, oppure trascina e rilascia nella scena. Le frecce mirano, Spazio lascia e 1–3 scelgono il tessuto. L’anteprima trasparente mostra l’effetto del vento. Serve abbastanza sovrapposizione; tre errori terminano il tentativo. Non c’è conto alla rovescia.',
      fabricText:'Il feltro richiede meno sostegno. Il lino è stretto e dà più punti base. La nuvola è larga ma richiede più appoggio. Ogni cuscino sostiene il successivo. Se appare un ordine, usa il tessuto indicato.',
      starsText:'Completa per una stella. Con il 40% di atterraggi perfetti ne ottieni due; senza errori e con il 70%, tre. Le serie perfette aggiungono bonus. Rigiocare non riduce il record. I vecchi livelli restano completati, le nuove stelle vanno conquistate.',
      studioText:'Colleziona colori permanenti senza cambiare regole o punteggi. Conferma il prezzo prima di acquistare e cambia palette quando vuoi. Giardino è sempre gratis. Gli acquisti sono disattivati se non è possibile salvare.',
      engine:'Impossibile caricare la scena 3D. Prova a ricaricare.',arcs:'Primi prati|Atelier della brezza|Sentiero delle lanterne|Torri di nuvole|Atelier patchwork|Palazzo del cielo',
    },
    ru:{
      materials:'Моховой войлок|Золотой лён|Розовое облако|Прощает ошибки|Точность · +45%|Ширина · +20%',
      actions:'Опустить подушку|Дальше|Повторить|Как играть|Пауза|Продолжить|Закрыть|Выбрать|Выбрано|Открыть · 12|Подтвердить · 12 алмазов|Перезагрузить',
      status:'Совместите с золотой отметкой|ИДЕАЛЬНО!|Мягкая посадка|Не хватает опоры. Сдвиньте ближе к башне.|Ещё немного выше!|Небесный дворец готов!|Любую башню можно начать заново.|Прогресс сохранён.|Прошлые победы сохранены.|Немного отдохнуть?|Незавершённая башня пропадёт. Уровни, звёзды и ткани сохранятся.|Не хватает алмазов. Садовые ткани бесплатны.|Сохранение недоступно. Можно играть, но новый прогресс не сохранится.|Лунные ткани получены!',
      labels:'Очки|Слои|Попытки|Совмещение|Комбо|Ветер|Штиль|Мастерская тканей|Садовые ткани|Лунные ткани|Бесплатно · навсегда|Постоянные цвета · 12 алмазов|Получено|Алмазы|Сохранено|Нужная ткань|Звёзды|Рекорд|ГЛАВА|ИСПЫТАНИЕ|Сложите {n} слоёв|Площадка {n} / 30|Тяните для прицела · отпустите для падения',
      summary:'Постройте 30 площадок в шести главах. Освойте ветер, смещённые цели и заказы тканей. Каждый пятый уровень объединяет изученные правила.',
      helpText:'Нажмите кнопку у золотой отметки или перетащите подушку в сцене и отпустите. Стрелки наводят, пробел опускает, 1–3 выбирают ткань. Прозрачный силуэт учитывает ветер. Нужно достаточное перекрытие; три промаха заканчивают попытку. Таймера нет.',
      fabricText:'Войлок требует меньше опоры. Лён уже, но даёт больше базовых очков. Облако шире и нуждается в большей опоре. Каждая подушка поддерживает следующую. При заказе используйте указанную ткань.',
      starsText:'За завершение — одна звезда. За 40% идеальных посадок — две; без промахов и с 70% — три. Серия идеальных посадок увеличивает бонус. Повтор не снижает рекорд. Старые победы сохраняются, новые звёзды нужно заработать.',
      studioText:'Собирайте постоянные цвета без изменения правил и очков. Подтвердите цену перед покупкой и меняйте полученные палитры. Садовые ткани бесплатны. При недоступном сохранении покупки отключены.',
      engine:'Не удалось загрузить сцену 3D. Перезагрузите страницу.',arcs:'Первые луга|Мастерская бриза|Тропа фонарей|Облачные башни|Лоскутная мастерская|Небесный дворец',
    },
    hi:{
      materials:'काई का फेल्ट|सुनहरा लिनन|गुलाबी बादल|आसान संतुलन|सटीक · +45%|चौड़ा · +20%',
      actions:'कुशन छोड़ें|अगला|फिर खेलें|कैसे खेलें|विराम|जारी रखें|बंद करें|इस्तेमाल करें|इस्तेमाल में|खोलें · 12|पुष्टि · 12 हीरे|फिर लोड करें',
      status:'चमकते निशान पर निशाना लगाएँ|बिलकुल सही!|नरम लैंडिंग|सहारा कम है। मीनार के और पास रखें।|थोड़ा और ऊँचा!|आपका आकाश महल तैयार है!|फिर से शुरुआत करें।|आपकी प्रगति सहेजी गई।|पिछली जीत सुरक्षित हैं।|थोड़ा आराम करें?|अधूरी मीनार मिट जाएगी। स्तर, तारे और कपड़े सुरक्षित रहेंगे।|हीरे कम हैं। बगीचे के कपड़े मुफ्त हैं।|सहेजना उपलब्ध नहीं। खेल सकते हैं, पर नई प्रगति नहीं बचेगी।|चाँदनी के कपड़े मिल गए!',
      labels:'अंक|परतें|मौके|संरेखण|कॉम्बो|हवा|शांत हवा|कपड़ों की कार्यशाला|बगीचे के कपड़े|चाँदनी के कपड़े|मुफ्त · हमेशा के लिए|स्थायी रंग · 12 हीरे|आपके पास|हीरे|सहेजा गया|माँगा गया कपड़ा|तारे|सर्वश्रेष्ठ अंक|अध्याय|चुनौती|{n} परतें बनाएँ|मचान {n} / 30|खींचकर निशाना लगाएँ · छोड़कर रखें',
      summary:'छह अध्यायों में 30 मचान बनाएँ। हवा, बदले हुए निशान और कपड़ों के ऑर्डर सीखें। हर पाँचवाँ स्तर सीखी हुई बातों को जोड़ता है।',
      helpText:'सुनहरे निशान पर कुशन छोड़ें या दृश्य में खींचकर छोड़ दें। तीर कुंजियों से निशाना लगाएँ, स्पेस से छोड़ें और 1–3 से कपड़ा चुनें। पारदर्शी झलक हवा का असर दिखाती है। पर्याप्त सहारा चाहिए; तीन चूक पर यह कोशिश खत्म होगी। कोई समय सीमा नहीं है।',
      fabricText:'फेल्ट को कम सहारा चाहिए। लिनन पतला है और अधिक मूल अंक देता है। बादल चौड़ा है, पर अधिक सहारा चाहिए। हर कुशन अगली परत को सहारा देता है। ऑर्डर दिखने पर बताया गया कपड़ा चुनें।',
      starsText:'पूरा करने पर एक तारा। कम से कम 40% सटीक लैंडिंग पर दो; बिना चूक और 70% सटीक लैंडिंग पर तीन। लगातार सटीक लैंडिंग से बोनस बढ़ता है। फिर खेलने से रिकॉर्ड नहीं घटता। पुरानी जीत बचती हैं, नए तारे खेलकर कमाएँ।',
      studioText:'स्थायी रंग इकट्ठे करें। नियम और अंक नहीं बदलते। खरीदने से पहले कीमत की पुष्टि करें और अपने रंग कभी भी बदलें। बगीचे के कपड़े मुफ्त हैं। सहेजना उपलब्ध न हो तो खरीद बंद रहती है।',
      engine:'3D दृश्य लोड नहीं हुआ। कृपया फिर लोड करें।',arcs:'घास की शुरुआत|हवा की कार्यशाला|लालटेन की राह|बादलों की मीनारें|पैबंद की कार्यशाला|आकाश महल',
    },
    ar:{
      materials:'لباد طحلبي|كتان ذهبي|سحابة وردية|أكثر تسامحًا|دقيق · +45%|عريض · +20%',
      actions:'إسقاط الوسادة|التالي|إعادة اللعب|طريقة اللعب|إيقاف مؤقت|متابعة|إغلاق|استخدام|قيد الاستخدام|فتح · 12|تأكيد · 12 ألماسة|إعادة التحميل',
      status:'حاذِ العلامة المضيئة|مثالي!|هبوط ناعم|الدعم غير كافٍ. اقترب من البرج.|أعلى قليلًا!|قصر السماء جاهز!|كل برج يمكن بناؤه مجددًا.|تم حفظ تقدمك.|المراحل السابقة محفوظة.|هل تريد استراحة؟|ستفقد البرج غير المكتمل. تبقى المراحل والنجوم والأقمشة محفوظة.|الألماس غير كافٍ. أقمشة الحديقة مجانية.|الحفظ غير متاح. يمكنك اللعب لكن التقدم الجديد لن يُحفظ.|حصلت على أقمشة ضوء القمر!',
      labels:'النقاط|الطبقات|المحاولات|المحاذاة|تتابع|الرياح|جو هادئ|ورشة الأقمشة|أقمشة الحديقة|ضوء القمر|مجاني · دائم|ألوان دائمة · 12 ألماسة|مملوك|رصيد الألماس|محفوظ|القماش المطلوب|النجوم|أفضل نتيجة|الفصل|تحدٍّ|ابنِ {n} طبقات|المرصد {n} / 30|اسحب للتصويب · ارفع يدك للإسقاط',
      summary:'ابنِ 30 مرصدًا في ستة فصول مع الرياح والعلامات المتحركة وطلبات الأقمشة. كل مرحلة خامسة تجمع ما تعلمته.',
      helpText:'اضغط إسقاط عند العلامة الذهبية، أو اسحب داخل المشهد ثم ارفع يدك. الأسهم للتصويب والمسافة للإسقاط و1–3 لاختيار القماش. تُظهر المعاينة الشفافة تأثير الرياح. يلزم تداخل كافٍ للدعم؛ ثلاث أخطاء تنهي المحاولة. لا يوجد عد تنازلي.',
      fabricText:'اللباد يحتاج إلى دعم أقل. الكتان أضيق ويمنح نقاطًا أساسية أكثر. السحابة أعرض لكنها تحتاج إلى دعم أكبر. كل وسادة تحمل التالية. استخدم القماش المحدد عند ظهور طلب.',
      starsText:'الإكمال يمنح نجمة. تحقيق 40% من الهبوطات المثالية يمنح نجمتين؛ دون أخطاء ومع 70% تحصل على ثلاث. التتابع المثالي يزيد المكافأة. الإعادة لا تخفض الرقم القياسي. تُحفظ المراحل القديمة وتُكتسب النجوم الجديدة باللعب.',
      studioText:'اجمع ألوانًا دائمة دون تغيير القواعد أو النقاط. أكد السعر قبل الشراء وبدّل بين ألوانك متى شئت. أقمشة الحديقة مجانية دائمًا. تُعطل المشتريات إذا تعذر الحفظ.',
      engine:'تعذر تحميل المشهد ثلاثي الأبعاد. أعد التحميل للمحاولة مجددًا.',arcs:'بدايات المروج|ورشة النسيم|درب الفوانيس|أبراج السحاب|ورشة الرقع|قصر السماء',
    },
  };
  const out={};
  const summaries={
    'zh-Hans':'30 座瞭望台，三种布料。看准风向，堆出天空城。',ja:'30の見晴らし台と3つの布地。自分のリズムで積み上げよう。',ko:'전망대 30개, 원단 3종. 나만의 리듬으로 쌓아 보세요.',
    es:'30 miradores, tres telas. Encuentra tu ritmo y apila.', 'pt-BR':'30 mirantes, três tecidos. Encontre seu ritmo e empilhe.',
    fr:'30 belvédères, trois tissus. Trouve ton rythme et empile.',de:'30 Türme, drei Stoffe. Finde deinen Rhythmus und staple.',it:'30 belvederi, tre tessuti. Trova il tuo ritmo e impila.',
    ru:'30 башен, три ткани. Найдите свой ритм и стройте.',hi:'30 मचान, तीन कपड़े। अपनी लय खोजें और ऊँचा बनाएँ।',ar:'30 مرصدًا وثلاثة أقمشة. اعثر على إيقاعك وابنِ أعلى.',
  };
  for(const [locale,raw] of Object.entries(data)){
    const old=window.CUSHION_LOCALES?.[locale]||{};
    const p={title:old.title,start:old.start,back:old.back,stages:old.stages,noBest:'0'};
    for(const [group,keys] of Object.entries(schema)){
      const names=keys.split(' '),values=raw[group].split('|');
      if(names.length!==values.length)throw Error(`Cushion translation shape: ${locale}/${group}`);
      names.forEach((key,i)=>p[key]=values[i]);
    }
    for(const key of ['summary','helpText','studioText','engine'])p[key]=raw[key];
    raw.arcs.split('|').forEach((v,i)=>p['arc'+i]=v);
    Object.assign(p,{kicker:p.studio,intro:p.controls,best:p.stars,stageMap:p.stages,lobbyReturn:p.back,leave:p.stages,aim:p.controls,
      tutorial:p.help,startBuild:p.start,guideTitle:p.help,guideIntro:p.summary,factStages:p.stages,factStack:p.drop,
      guide1:p.drop,guide1Text:p.helpText,guide2:p.request,guide2Text:raw.fabricText,guide3:p.stages,guide3Text:p.summary,
      guide4:p.pause,guide4Text:p.leaveText+' '+p.storage,guide5:p.stars,guide5Text:raw.starsText,guide6:p.studio,guide6Text:p.studioText+' '+p.permanent});
    p.summary=summaries[locale];out[locale]=Object.freeze(p);
  }
  window.CUSHION_ATELIER_LOCALES=Object.freeze(out);
})();
