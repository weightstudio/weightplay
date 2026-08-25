(()=>{
  "use strict";
  const COPY={
    en:{title:"Alien Defender",tagline:"Hold the line. Read the wave.",eyebrow:"WeightPlay Original Arcade",language:"Language",comingSoon:"Coming Soon",guideLabel:"How to play",guideTitle:"Move, fire, and survive the next wave.",guideIntro:"Defend the signal station against three alien waves. Move, fire, read the formation, and spend your shield window before the line reaches you.",controlsTitle:"Controls",how1:"Move with arrows or A/D and fire with Space.",how2:"On mobile, hold the left/right pads and tap Fire.",how3:"Clear each formation before the invaders reach the defense line.",growthTitle:"Wave pressure",growth:"Wave 2 adds faster volleys. Wave 3 adds shielded captains, tighter formations, and a short shield pickup after a clean clear.",comingNote:"This owner-preview build stays Coming Soon until the full Tester, Gameplay Reviewer, and Director gates are complete.",start:"Start Defense",score:"Score",best:"Best",wave:"Wave",combo:"Combo",lives:"Lives",soundOn:"Sound on",soundOff:"Sound off",restart:"Restart",back:"Back to main",left:"Left",right:"Right",fire:"Fire",reserve:"Play space reserve",ready:"Read the wave.",waveHint:"Watch the formation.",hit:"A hit! Keep moving.",shield:"Shield window active.",resultKicker:"Defense report",winTitle:"Station secure",winCopy:"Three alien waves cleared. The signal station stays bright.",loseTitle:"Signal lost",loseCopy:"The formation reached the defense line. Move earlier and keep the fire rhythm.",retry:"Try again",home:"Back to main",canvasLabel:"Alien Defender playfield",footer:"A WeightPlay owner preview • original wave arcade"},
    "zh-Hant":{title:"星際守衛",tagline:"守住防線，讀懂敵潮。",eyebrow:"WeightPlay 原創街機",language:"語言",comingSoon:"敬請期待",guideLabel:"玩法說明",guideTitle:"移動、射擊，活過下一波。",guideIntro:"守護訊號站，迎戰三波外星編隊。移動、射擊、觀察隊形，並在防線逼近前把握護盾窗口。",controlsTitle:"操作方式",how1:"使用方向鍵或 A/D 移動，按 Space 射擊。",how2:"手機按住左右按鈕，點擊射擊。",how3:"在敵人抵達防線前清除整個隊形。",growthTitle:"波次壓力",growth:"第 2 波加入更快彈幕；第 3 波加入護甲隊長、更緊隊形，以及清除一波後短暫出現的護盾。",comingNote:"這是擁有者預覽版；完成 Tester、Gameplay Reviewer 與 Director 全部 Gate 前會維持敬請期待。",start:"開始防守",score:"分數",best:"最高",wave:"波次",combo:"連擊",lives:"生命",soundOn:"開啟音效",soundOff:"關閉音效",restart:"重新開始",back:"回到主頁",left:"左",right:"右",fire:"射擊",reserve:"遊戲空間保留區",ready:"先讀懂敵潮。",waveHint:"觀察敵方隊形。",hit:"命中！繼續移動。",shield:"護盾窗口啟動。",resultKicker:"防守報告",winTitle:"訊號站守住了",winCopy:"三波外星編隊都已清除，訊號站持續閃耀。",loseTitle:"訊號中斷",loseCopy:"敵方隊形抵達防線。早一點移動，維持射擊節奏。",retry:"再試一次",home:"回到主頁",canvasLabel:"星際守衛遊戲區",footer:"WeightPlay 擁有者預覽版・原創波次街機"},
    "zh-Hans":{title:"星际守卫",tagline:"守住防线，读懂敌潮。",eyebrow:"WeightPlay 原创街机",language:"语言",comingSoon:"敬请期待",guideLabel:"玩法说明",guideTitle:"移动、射击，活过下一波。",guideIntro:"守护信号站，迎战三波外星编队。移动、射击、观察队形，并在防线逼近前把握护盾窗口。",controlsTitle:"操作方式",how1:"使用方向键或 A/D 移动，按 Space 射击。",how2:"手机按住左右按钮，点击射击。",how3:"在敌人抵达防线前清除整个队形。",growthTitle:"波次压力",growth:"第 2 波加入更快弹幕；第 3 波加入护甲队长、更紧队形，以及清除一波后短暂出现的护盾。",comingNote:"这是拥有者预览版；完成 Tester、Gameplay Reviewer 与 Director 全部 Gate 前会维持敬请期待。",start:"开始防守",score:"分数",best:"最高",wave:"波次",combo:"连击",lives:"生命",soundOn:"开启音效",soundOff:"关闭音效",restart:"重新开始",back:"回到主页",left:"左",right:"右",fire:"射击",reserve:"游戏空间保留区",ready:"先读懂敌潮。",waveHint:"观察敌方队形。",hit:"命中！继续移动。",shield:"护盾窗口启动。",resultKicker:"防守报告",winTitle:"信号站守住了",winCopy:"三波外星编队都已清除，信号站持续闪耀。",loseTitle:"信号中断",loseCopy:"敌方队形抵达防线。早一点移动，维持射击节奏。",retry:"再试一次",home:"回到主页",canvasLabel:"星际守卫游戏区",footer:"WeightPlay 拥有者预览版・原创波次街机"},
    ja:{title:"エイリアン・ディフェンダー",tagline:"防衛線を守り、波を読む。",eyebrow:"WeightPlay オリジナルアーケード",language:"言語",comingSoon:"近日公開",guideLabel:"遊び方",guideTitle:"動いて撃ち、次の波を生き残ろう。",guideIntro:"信号ステーションを3つのエイリアンウェーブから守ります。編隊を読み、撃ち続け、防衛線に届く前にシールドの時間を使いましょう。",controlsTitle:"操作",how1:"矢印キーまたはA/Dで移動し、Spaceで撃ちます。",how2:"モバイルでは左右を押しながらFireをタップします。",how3:"侵略者が防衛線に着く前に編隊を倒します。",growthTitle:"ウェーブの圧力",growth:"2ウェーブでは弾幕が速くなり、3ウェーブではシールド隊長と短いシールド回復が加わります。",comingNote:"すべての Tester、Gameplay Reviewer、Director Gate が完了するまで近日公開です。",start:"防衛を始める",score:"スコア",best:"ベスト",wave:"ウェーブ",combo:"コンボ",lives:"残機",soundOn:"サウンド オン",soundOff:"サウンド オフ",restart:"リスタート",back:"メインへ",left:"左",right:"右",fire:"発射",reserve:"プレイ空間の予備",ready:"ウェーブを読もう。",waveHint:"編隊を見よう。",hit:"命中！動き続けよう。",shield:"シールド時間です。",resultKicker:"防衛レポート",winTitle:"ステーションを守った",winCopy:"3つのエイリアンウェーブを撃退しました。",loseTitle:"信号ロスト",loseCopy:"編隊が防衛線に到達しました。早めに動き、射撃のリズムを保ちましょう。",retry:"もう一度",home:"メインへ戻る",canvasLabel:"エイリアン・ディフェンダーのプレイフィールド",footer:"WeightPlay オーナープレビュー・オリジナルウェーブアーケード"},
    ko:{title:"에일리언 디펜더",tagline:"방어선을 지키고 파도를 읽으세요.",eyebrow:"WeightPlay 오리지널 아케이드",language:"언어",comingSoon:"출시 예정",guideLabel:"게임 방법",guideTitle:"움직이고 쏘며 다음 웨이브를 버티세요.",guideIntro:"신호 기지를 세 번의 외계인 웨이브에서 지키세요. 대형을 읽고 발사하며 방어선에 닿기 전에 실드 시간을 사용하세요.",controlsTitle:"조작",how1:"방향키나 A/D로 이동하고 Space로 발사합니다.",how2:"모바일에서는 좌우를 누르며 발사 버튼을 탭합니다.",how3:"침입자가 방어선에 닿기 전에 대형을 모두 처치하세요.",growthTitle:"웨이브 압박",growth:"2웨이브는 더 빠른 탄막을, 3웨이브는 실드 대장과 짧은 실드 회복을 추가합니다.",comingNote:"Tester, Gameplay Reviewer, Director Gate가 모두 끝날 때까지 출시 예정으로 유지됩니다.",start:"방어 시작",score:"점수",best:"최고",wave:"웨이브",combo:"콤보",lives:"생명",soundOn:"소리 켜기",soundOff:"소리 끄기",restart:"다시 시작",back:"메인으로",left:"왼쪽",right:"오른쪽",fire:"발사",reserve:"플레이 공간 여백",ready:"웨이브를 읽으세요.",waveHint:"대형을 살피세요.",hit:"명중! 계속 움직이세요.",shield:"실드 시간이 활성화되었습니다.",resultKicker:"방어 보고서",winTitle:"기지를 지켰습니다",winCopy:"세 번의 외계인 웨이브를 모두 막았습니다.",loseTitle:"신호 손실",loseCopy:"대형이 방어선에 도달했습니다. 조금 더 일찍 움직이며 발사 리듬을 유지하세요.",retry:"다시 시도",home:"메인으로 돌아가기",canvasLabel:"에일리언 디펜더 플레이 필드",footer:"WeightPlay 오너 프리뷰・오리지널 웨이브 아케이드"},
    es:{title:"Defensor Alienígena",tagline:"Mantén la línea. Lee la oleada.",eyebrow:"Arcade original de WeightPlay",language:"Idioma",comingSoon:"Próximamente",guideLabel:"Cómo jugar",guideTitle:"Muévete, dispara y sobrevive a la siguiente oleada.",guideIntro:"Defiende la estación de señales de tres oleadas alienígenas. Muévete, dispara, lee la formación y usa tu escudo antes de que alcance la línea.",controlsTitle:"Controles",how1:"Muévete con flechas o A/D y dispara con Espacio.",how2:"En móvil, mantén izquierda/derecha y toca Disparar.",how3:"Despeja cada formación antes de que llegue a la línea defensiva.",growthTitle:"Presión de las oleadas",growth:"La oleada 2 acelera las ráfagas. La 3 añade capitanes con escudo y una breve recarga de escudo tras una limpieza.",comingNote:"Esta vista previa seguirá Próximamente hasta completar todas las Gate de Tester, Gameplay Reviewer y Director.",start:"Empezar defensa",score:"Puntuación",best:"Mejor",wave:"Oleada",combo:"Combo",lives:"Vidas",soundOn:"Activar sonido",soundOff:"Silenciar",restart:"Reiniciar",back:"Volver al inicio",left:"Izquierda",right:"Derecha",fire:"Disparar",reserve:"Reserva de espacio de juego",ready:"Lee la oleada.",waveHint:"Observa la formación.",hit:"¡Impacto! Sigue moviéndote.",shield:"Escudo activo.",resultKicker:"Informe de defensa",winTitle:"Estación segura",winCopy:"Las tres oleadas alienígenas fueron despejadas.",loseTitle:"Señal perdida",loseCopy:"La formación alcanzó la línea defensiva. Muévete antes y conserva el ritmo de disparo.",retry:"Intentar otra vez",home:"Volver al inicio",canvasLabel:"Zona de juego de Defensor Alienígena",footer:"Vista previa de WeightPlay・arcade de oleadas original"},
    "pt-BR":{title:"Defensor Alienígena",tagline:"Segure a linha. Leia a onda.",eyebrow:"Arcade original WeightPlay",language:"Idioma",comingSoon:"Em breve",guideLabel:"Como jogar",guideTitle:"Mova, atire e sobreviva à próxima onda.",guideIntro:"Defenda a estação de sinais contra três ondas alienígenas. Mova-se, atire, leia a formação e use o escudo antes que a linha se aproxime.",controlsTitle:"Controles",how1:"Mova com as setas ou A/D e atire com Espaço.",how2:"No celular, segure esquerda/direita e toque em Atirar.",how3:"Limpe cada formação antes que os invasores alcancem a linha de defesa.",growthTitle:"Pressão das ondas",growth:"A onda 2 traz rajadas mais rápidas. A onda 3 adiciona capitães protegidos e uma recarga breve de escudo.",comingNote:"Esta prévia ficará Em breve até concluir todas as Gate de Tester, Gameplay Reviewer e Director.",start:"Começar defesa",score:"Pontuação",best:"Melhor",wave:"Onda",combo:"Combo",lives:"Vidas",soundOn:"Ligar som",soundOff:"Desligar som",restart:"Reiniciar",back:"Voltar ao início",left:"Esquerda",right:"Direita",fire:"Atirar",reserve:"Reserva do espaço de jogo",ready:"Leia a onda.",waveHint:"Observe a formação.",hit:"Acertou! Continue se movendo.",shield:"Escudo ativo.",resultKicker:"Relatório de defesa",winTitle:"Estação segura",winCopy:"As três ondas alienígenas foram eliminadas.",loseTitle:"Sinal perdido",loseCopy:"A formação alcançou a linha de defesa. Mova-se antes e mantenha o ritmo de tiro.",retry:"Tentar novamente",home:"Voltar ao início",canvasLabel:"Área de jogo do Defensor Alienígena",footer:"Prévia do WeightPlay・arcade de ondas original"},
    fr:{title:"Défenseur Alien",tagline:"Tiens la ligne. Lis la vague.",eyebrow:"Arcade original WeightPlay",language:"Langue",comingSoon:"Bientôt disponible",guideLabel:"Comment jouer",guideTitle:"Bouge, tire et survis à la prochaine vague.",guideIntro:"Défends la station de signal contre trois vagues aliens. Déplace-toi, tire, lis la formation et utilise ton bouclier avant la ligne.",controlsTitle:"Commandes",how1:"Déplace-toi avec les flèches ou A/D et tire avec Espace.",how2:"Sur mobile, maintiens gauche/droite et touche Tirer.",how3:"Élimine chaque formation avant la ligne de défense.",growthTitle:"Pression des vagues",growth:"La vague 2 accélère les salves. La vague 3 ajoute des capitaines protégés et une courte recharge de bouclier.",comingNote:"Cette préversion restera Bientôt disponible jusqu'à la fin des Gate Tester, Gameplay Reviewer et Director.",start:"Commencer la défense",score:"Score",best:"Meilleur",wave:"Vague",combo:"Combo",lives:"Vies",soundOn:"Activer le son",soundOff:"Couper le son",restart:"Recommencer",back:"Retour à l'accueil",left:"Gauche",right:"Droite",fire:"Tirer",reserve:"Réserve d'espace de jeu",ready:"Lis la vague.",waveHint:"Observe la formation.",hit:"Touché ! Continue de bouger.",shield:"Bouclier actif.",resultKicker:"Rapport de défense",winTitle:"Station sécurisée",winCopy:"Les trois vagues aliens sont éliminées.",loseTitle:"Signal perdu",loseCopy:"La formation a atteint la ligne. Bouge plus tôt et garde le rythme de tir.",retry:"Réessayer",home:"Retour à l'accueil",canvasLabel:"Terrain de jeu Défenseur Alien",footer:"Préversion WeightPlay・arcade de vagues originale"},
    de:{title:"Alien-Verteidiger",tagline:"Halte die Linie. Lies die Welle.",eyebrow:"WeightPlay Original-Arcade",language:"Sprache",comingSoon:"Demnächst",guideLabel:"So wird gespielt",guideTitle:"Bewegen, schießen und die nächste Welle überleben.",guideIntro:"Verteidige die Signalstation gegen drei Alien-Wellen. Bewege dich, schieße, lies die Formation und nutze dein Schild rechtzeitig.",controlsTitle:"Steuerung",how1:"Bewege dich mit Pfeilen oder A/D und schieße mit der Leertaste.",how2:"Mobil hältst du links/rechts und tippst auf Feuer.",how3:"Räume jede Formation, bevor sie die Verteidigungslinie erreicht.",growthTitle:"Wellendruck",growth:"Welle 2 bringt schnellere Salven. Welle 3 ergänzt geschützte Kapitäne und eine kurze Schildaufladung.",comingNote:"Diese Vorschau bleibt Demnächst, bis alle Gate von Tester, Gameplay Reviewer und Director abgeschlossen sind.",start:"Verteidigung starten",score:"Punkte",best:"Bestwert",wave:"Welle",combo:"Combo",lives:"Leben",soundOn:"Ton an",soundOff:"Ton aus",restart:"Neustart",back:"Zur Startseite",left:"Links",right:"Rechts",fire:"Feuer",reserve:"Spielraum-Reserve",ready:"Lies die Welle.",waveHint:"Beobachte die Formation.",hit:"Treffer! Bleib in Bewegung.",shield:"Schild aktiv.",resultKicker:"Verteidigungsbericht",winTitle:"Station gesichert",winCopy:"Alle drei Alien-Wellen sind besiegt.",loseTitle:"Signal verloren",loseCopy:"Die Formation hat die Verteidigungslinie erreicht. Bewege dich früher und halte den Feuerrhythmus.",retry:"Nochmal versuchen",home:"Zur Startseite",canvasLabel:"Spielfeld des Alien-Verteidigers",footer:"WeightPlay-Vorschau・originale Wellen-Arcade"},
    it:{title:"Difensore Alieno",tagline:"Tieni la linea. Leggi l'ondata.",eyebrow:"Arcade originale WeightPlay",language:"Lingua",comingSoon:"Prossimamente",guideLabel:"Come si gioca",guideTitle:"Muoviti, spara e sopravvivi alla prossima ondata.",guideIntro:"Difendi la stazione del segnale da tre ondate aliene. Muoviti, spara, leggi la formazione e usa lo scudo prima che raggiunga la linea.",controlsTitle:"Comandi",how1:"Muoviti con le frecce o A/D e spara con Spazio.",how2:"Su mobile tieni premuto sinistra/destra e tocca Fuoco.",how3:"Elimina ogni formazione prima che raggiunga la linea difensiva.",growthTitle:"Pressione delle ondate",growth:"L'ondata 2 accelera le raffiche. La 3 aggiunge capitani protetti e una breve ricarica dello scudo.",comingNote:"Questa anteprima resterà Prossimamente fino al completamento di tutte le Gate Tester, Gameplay Reviewer e Director.",start:"Inizia la difesa",score:"Punteggio",best:"Record",wave:"Ondata",combo:"Combo",lives:"Vite",soundOn:"Audio attivo",soundOff:"Audio disattivo",restart:"Ricomincia",back:"Torna all'inizio",left:"Sinistra",right:"Destra",fire:"Fuoco",reserve:"Riserva dello spazio di gioco",ready:"Leggi l'ondata.",waveHint:"Osserva la formazione.",hit:"Colpito! Continua a muoverti.",shield:"Scudo attivo.",resultKicker:"Rapporto di difesa",winTitle:"Stazione al sicuro",winCopy:"Tutte e tre le ondate aliene sono state eliminate.",loseTitle:"Segnale perso",loseCopy:"La formazione ha raggiunto la linea. Muoviti prima e mantieni il ritmo di fuoco.",retry:"Riprova",home:"Torna all'inizio",canvasLabel:"Campo di gioco Difensore Alieno",footer:"Anteprima WeightPlay・arcade originale a ondate"},
    ru:{title:"Защитник от пришельцев",tagline:"Держи линию. Читай волну.",eyebrow:"Оригинальная аркада WeightPlay",language:"Язык",comingSoon:"Скоро",guideLabel:"Как играть",guideTitle:"Двигайся, стреляй и переживи следующую волну.",guideIntro:"Защищай сигнальную станцию от трёх волн пришельцев. Двигайся, стреляй, читай строй и используй щит до того, как линия приблизится.",controlsTitle:"Управление",how1:"Двигайся стрелками или A/D, стреляй пробелом.",how2:"На телефоне удерживай влево/вправо и нажимай огонь.",how3:"Уничтожь строй до того, как он достигнет линии обороны.",growthTitle:"Давление волн",growth:"Во второй волне залпы становятся быстрее. В третьей появляются капитаны со щитом и короткая перезарядка щита.",comingNote:"Предпросмотр останется в статусе «Скоро», пока не завершатся все Gate Tester, Gameplay Reviewer и Director.",start:"Начать оборону",score:"Счёт",best:"Рекорд",wave:"Волна",combo:"Комбо",lives:"Жизни",soundOn:"Звук включён",soundOff:"Звук выключен",restart:"Заново",back:"На главную",left:"Влево",right:"Вправо",fire:"Огонь",reserve:"Резерв игрового места",ready:"Прочти волну.",waveHint:"Следи за строем.",hit:"Попадание! Продолжай двигаться.",shield:"Щит активен.",resultKicker:"Отчёт обороны",winTitle:"Станция защищена",winCopy:"Все три волны пришельцев уничтожены.",loseTitle:"Сигнал потерян",loseCopy:"Строй достиг линии обороны. Двигайся раньше и сохраняй ритм стрельбы.",retry:"Попробовать снова",home:"На главную",canvasLabel:"Игровое поле «Защитник от пришельцев»",footer:"Предпросмотр WeightPlay・оригинальная аркада волн"},
    hi:{title:"एलियन रक्षक",tagline:"रेखा बचाएँ। लहर पढ़ें।",eyebrow:"WeightPlay ओरिजिनल आर्केड",language:"भाषा",comingSoon:"जल्द आ रहा है",guideLabel:"कैसे खेलें",guideTitle:"चलें, गोली चलाएँ और अगली लहर बचें।",guideIntro:"सिग्नल स्टेशन को तीन एलियन लहरों से बचाएँ। चलें, निशाना लगाएँ, गठन पढ़ें और रेखा आने से पहले ढाल का समय उपयोग करें।",controlsTitle:"नियंत्रण",how1:"तीर या A/D से चलें और Space से गोली चलाएँ।",how2:"मोबाइल पर बाएँ/दाएँ दबाकर फायर दबाएँ।",how3:"घुसपैठियों के रक्षा रेखा तक पहुँचने से पहले गठन साफ़ करें।",growthTitle:"लहर का दबाव",growth:"दूसरी लहर तेज़ गोलियाँ लाती है। तीसरी में ढाल वाले कप्तान और छोटी ढाल पुनर्भरण अवधि आती है।",comingNote:"Tester, Gameplay Reviewer और Director की सभी Gate पूरी होने तक यह पूर्वावलोकन जल्द आ रहा है रहेगा।",start:"रक्षा शुरू करें",score:"स्कोर",best:"सर्वश्रेष्ठ",wave:"लहर",combo:"कॉम्बो",lives:"जीवन",soundOn:"ध्वनि चालू",soundOff:"ध्वनि बंद",restart:"फिर शुरू करें",back:"मुख्य पर जाएँ",left:"बाएँ",right:"दाएँ",fire:"फायर",reserve:"खेल स्थान आरक्षित",ready:"लहर पढ़ें।",waveHint:"गठन देखें।",hit:"निशाना लगा! चलते रहें।",shield:"ढाल सक्रिय है।",resultKicker:"रक्षा रिपोर्ट",winTitle:"स्टेशन सुरक्षित",winCopy:"तीनों एलियन लहरें साफ़ हो गईं।",loseTitle:"सिग्नल खो गया",loseCopy:"गठन रक्षा रेखा तक पहुँच गया। पहले चलें और गोली की लय बनाए रखें।",retry:"फिर कोशिश करें",home:"मुख्य पर जाएँ",canvasLabel:"एलियन रक्षक खेल क्षेत्र",footer:"WeightPlay पूर्वावलोकन・मौलिक लहर आर्केड"},
    ar:{title:"مدافع الفضائيين",tagline:"احمِ الخط. اقرأ الموجة.",eyebrow:"أركيد أصلي من WeightPlay",language:"اللغة",comingSoon:"قريباً",guideLabel:"طريقة اللعب",guideTitle:"تحرك وأطلق النار واصمد أمام الموجة التالية.",guideIntro:"دافع عن محطة الإشارة أمام ثلاث موجات فضائية. تحرك وأطلق النار واقرأ التشكيل واستخدم الدرع قبل وصول الخط إليك.",controlsTitle:"التحكم",how1:"تحرك بالأسهم أو A/D وأطلق النار بمفتاح المسافة.",how2:"على الهاتف اضغط يساراً أو يميناً ثم اضغط إطلاق.",how3:"اقضِ على كل تشكيل قبل وصول الغزاة إلى خط الدفاع.",growthTitle:"ضغط الموجات",growth:"تضيف الموجة الثانية طلقات أسرع، وتضيف الثالثة قادة محميين ونافذة قصيرة لاستعادة الدرع.",comingNote:"ستبقى هذه المعاينة «قريباً» حتى تكتمل كل بوابات Tester وGameplay Reviewer وDirector.",start:"ابدأ الدفاع",score:"النتيجة",best:"الأفضل",wave:"الموجة",combo:"تتابع",lives:"الحياة",soundOn:"الصوت يعمل",soundOff:"الصوت متوقف",restart:"إعادة البدء",back:"العودة للرئيسية",left:"يسار",right:"يمين",fire:"إطلاق",reserve:"مساحة لعب احتياطية",ready:"اقرأ الموجة.",waveHint:"راقب التشكيل.",hit:"إصابة! واصل الحركة.",shield:"الدرع نشط.",resultKicker:"تقرير الدفاع",winTitle:"المحطة آمنة",winCopy:"تم القضاء على الموجات الفضائية الثلاث.",loseTitle:"فُقدت الإشارة",loseCopy:"وصل التشكيل إلى خط الدفاع. تحرك مبكراً وحافظ على إيقاع إطلاق النار.",retry:"حاول مجدداً",home:"العودة للرئيسية",canvasLabel:"ساحة لعب مدافع الفضائيين",footer:"معاينة WeightPlay・أركيد موجات أصلي"}
  };
  const CAMPAIGN_COPY={
    en:{guideIntro:"Defend the signal station against six alien waves. Move, fire, read the formation, and spend your shield window before the line reaches you.",growth:"Wave 2 adds faster volleys. Wave 3 adds shielded captains. Wave 4 introduces a staggered relay formation. Wave 5 adds crossfire lanes, and Wave 6 brings the signal core guardian and a final firing rhythm.",winCopy:"Six alien waves cleared. The signal station stays bright."},
    "zh-Hant":{guideIntro:"守護訊號站，迎戰六波外星編隊。移動、射擊、觀察隊形，並在防線逼近前把握護盾窗口。",growth:"第 2 波加入更快彈幕；第 3 波加入護甲隊長；第 4 波加入交錯接力隊形；第 5 波加入交叉火網，第 6 波由訊號核心守衛帶來最後的射擊節奏。",winCopy:"六波外星編隊都已清除，訊號站持續閃耀。"},
    "zh-Hans":{guideIntro:"守护信号站，迎战六波外星编队。移动、射击、观察队形，并在防线逼近前把握护盾窗口。",growth:"第 2 波加入更快弹幕；第 3 波加入护甲队长；第 4 波加入交错接力队形；第 5 波加入交叉火网，第 6 波由信号核心守卫带来最后的射击节奏。",winCopy:"六波外星编队都已清除，信号站持续闪耀。"},
    ja:{guideIntro:"信号ステーションを6つのエイリアンウェーブから守ります。編隊を読み、撃ち続け、防衛線に届く前にシールドの時間を使いましょう。",growth:"2ウェーブでは弾幕が速くなり、3ウェーブではシールド隊長が加わります。4ウェーブはリレー編隊、5ウェーブは交差する火線、6ウェーブは信号コアの守護者で最後の射撃リズムを試します。",winCopy:"6つのエイリアンウェーブを撃退しました。信号ステーションは輝き続けます。"},
    ko:{guideIntro:"신호 기지를 여섯 번의 외계인 웨이브에서 지키세요. 대형을 읽고 발사하며 방어선에 닿기 전에 실드 시간을 사용하세요.",growth:"2웨이브는 더 빠른 탄막을, 3웨이브는 실드 대장을 추가합니다. 4웨이브는 릴레이 대형, 5웨이브는 교차 사격선을, 6웨이브는 신호 코어 수호자와 마지막 발사 리듬을 선보입니다.",winCopy:"여섯 번의 외계인 웨이브를 모두 막았습니다. 신호 기지가 계속 빛납니다."},
    es:{guideIntro:"Defiende la estación de señales de seis oleadas alienígenas. Muévete, dispara, lee la formación y usa tu escudo antes de que alcance la línea.",growth:"La oleada 2 acelera las ráfagas. La 3 añade capitanes con escudo. La 4 introduce un relevo escalonado, la 5 añade fuego cruzado y la 6 pone a prueba el ritmo final con el guardián del núcleo de señal.",winCopy:"Las seis oleadas alienígenas fueron despejadas. La estación sigue a salvo."},
    "pt-BR":{guideIntro:"Defenda a estação de sinais contra seis ondas alienígenas. Mova-se, atire, leia a formação e use o escudo antes que a linha se aproxime.",growth:"A onda 2 traz rajadas mais rápidas. A 3 adiciona capitães protegidos. A 4 traz um revezamento escalonado, a 5 adiciona fogo cruzado e a 6 testa o ritmo final com o guardião do núcleo de sinal.",winCopy:"As seis ondas alienígenas foram eliminadas. A estação continua segura."},
    fr:{guideIntro:"Défends la station de signal contre six vagues aliens. Déplace-toi, tire, lis la formation et utilise ton bouclier avant la ligne.",growth:"La vague 2 accélère les salves. La 3 ajoute des capitaines protégés. La 4 introduit un relais décalé, la 5 ajoute des tirs croisés et la 6 met à l'épreuve le rythme final avec le gardien du noyau.",winCopy:"Les six vagues aliens sont éliminées. La station reste en sécurité."},
    de:{guideIntro:"Verteidige die Signalstation gegen sechs Alien-Wellen. Bewege dich, schieße, lies die Formation und nutze dein Schild rechtzeitig.",growth:"Welle 2 bringt schnellere Salven. Welle 3 ergänzt geschützte Kapitäne. Welle 4 führt eine versetzte Relaisformation ein, Welle 5 Kreuzfeuer und Welle 6 den Wächter des Signalkerns für den finalen Feuerrhythmus.",winCopy:"Alle sechs Alien-Wellen sind besiegt. Die Station bleibt sicher."},
    it:{guideIntro:"Difendi la stazione del segnale da sei ondate aliene. Muoviti, spara, leggi la formazione e usa lo scudo prima che raggiunga la linea.",growth:"L'ondata 2 accelera le raffiche. La 3 aggiunge capitani protetti. La 4 introduce una staffetta sfalsata, la 5 aggiunge fuoco incrociato e la 6 mette alla prova il ritmo finale con il guardiano del nucleo.",winCopy:"Tutte e sei le ondate aliene sono state eliminate. La stazione è al sicuro."},
    ru:{guideIntro:"Защищай сигнальную станцию от шести волн пришельцев. Двигайся, стреляй, читай строй и используй щит до приближения линии.",growth:"Во второй волне залпы становятся быстрее. В третьей появляются капитаны со щитом. Четвёртая вводит релейный строй, пятая — перекрёстный огонь, а шестая проверяет финальный ритм с защитником сигнального ядра.",winCopy:"Все шесть волн пришельцев уничтожены. Станция в безопасности."},
    hi:{guideIntro:"सिग्नल स्टेशन को छह एलियन लहरों से बचाएँ। चलें, निशाना लगाएँ, गठन पढ़ें और रेखा आने से पहले ढाल का समय उपयोग करें।",growth:"दूसरी लहर तेज़ गोलियाँ लाती है। तीसरी में ढाल वाले कप्तान आते हैं। चौथी रिले गठन, पाँचवीं क्रॉसफायर गलियाँ और छठी सिग्नल कोर रक्षक के साथ अंतिम फायरिंग लय लाती है।",winCopy:"छहों एलियन लहरें साफ़ हो गईं। सिग्नल स्टेशन सुरक्षित है।"},
    ar:{guideIntro:"دافع عن محطة الإشارة أمام ست موجات فضائية. تحرك وأطلق النار واقرأ التشكيل واستخدم الدرع قبل وصول الخط إليك.",growth:"تضيف الموجة الثانية طلقات أسرع، والثالثة قادة محميين. تقدم الرابعة تشكيلاً مرحلياً، والخامسة نيراناً متقاطعة، والسادسة تختبر إيقاع الإطلاق الأخير مع حارس نواة الإشارة.",winCopy:"تم القضاء على الموجات الفضائية الست. بقيت المحطة آمنة."}
  };
  Object.entries(CAMPAIGN_COPY).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const REPLAY_GOAL_COPY={
    en:{replayGoal:"Next-run target: move into the formation's lane before firing, clear Wave {wave}, and reach Wave {nextWave}.",replayFinalGoal:"Next-run target: move into the formation's lane before firing and clear Wave {wave}."},
    "zh-Hant":{replayGoal:"下一局目標：在射擊前移到敵方隊形的路線，清除第 {wave} 波並抵達第 {nextWave} 波。",replayFinalGoal:"下一局目標：在射擊前移到敵方隊形的路線，清除第 {wave} 波。"},
    "zh-Hans":{replayGoal:"下一局目标：在射击前移到敌方编队的路线，清除第 {wave} 波并到达第 {nextWave} 波。",replayFinalGoal:"下一局目标：在射击前移到敌方编队的路线，清除第 {wave} 波。"},
    ja:{replayGoal:"次の目標：射撃前に編隊のレーンへ移動し、{wave}ウェーブを突破して{nextWave}ウェーブへ進みましょう。",replayFinalGoal:"次の目標：射撃前に編隊のレーンへ移動し、{wave}ウェーブを突破しましょう。"},
    ko:{replayGoal:"다음 도전 목표: 발사하기 전에 대형의 공격선으로 이동해 {wave}웨이브를 클리어하고 {nextWave}웨이브로 넘어가세요.",replayFinalGoal:"다음 도전 목표: 발사하기 전에 대형의 공격선으로 이동해 {wave}웨이브를 클리어하세요."},
    es:{replayGoal:"Objetivo de la próxima partida: ponte en el carril de la formación antes de disparar, supera la oleada {wave} y llega a la oleada {nextWave}.",replayFinalGoal:"Objetivo de la próxima partida: ponte en el carril de la formación antes de disparar y supera la oleada {wave}."},
    "pt-BR":{replayGoal:"Objetivo da próxima tentativa: mova-se para a faixa da formação antes de atirar, limpe a onda {wave} e chegue à onda {nextWave}.",replayFinalGoal:"Objetivo da próxima tentativa: mova-se para a faixa da formação antes de atirar e limpe a onda {wave}."},
    fr:{replayGoal:"Objectif de la prochaine partie : place-toi dans la ligne de la formation avant de tirer, élimine la vague {wave} et atteins la vague {nextWave}.",replayFinalGoal:"Objectif de la prochaine partie : place-toi dans la ligne de la formation avant de tirer et élimine la vague {wave}."},
    de:{replayGoal:"Ziel für den nächsten Versuch: Bewege dich vor dem Schießen in die Formationbahn, schließe Welle {wave} ab und erreiche Welle {nextWave}.",replayFinalGoal:"Ziel für den nächsten Versuch: Bewege dich vor dem Schießen in die Formationbahn und schließe Welle {wave} ab."},
    it:{replayGoal:"Obiettivo del prossimo tentativo: portati nella corsia della formazione prima di sparare, supera l'ondata {wave} e raggiungi l'ondata {nextWave}.",replayFinalGoal:"Obiettivo del prossimo tentativo: portati nella corsia della formazione prima di sparare e supera l'ondata {wave}."},
    ru:{replayGoal:"Цель следующей попытки: займи линию строя до выстрела, зачисти волну {wave} и дойди до волны {nextWave}.",replayFinalGoal:"Цель следующей попытки: займи линию строя до выстрела и зачисти волну {wave}."},
    hi:{replayGoal:"अगली कोशिश का लक्ष्य: गोली चलाने से पहले गठन की लेन में जाएँ, लहर {wave} साफ़ करें और लहर {nextWave} तक पहुँचें।",replayFinalGoal:"अगली कोशिश का लक्ष्य: गोली चलाने से पहले गठन की लेन में जाएँ और लहर {wave} साफ़ करें।"},
    ar:{replayGoal:"هدف المحاولة التالية: تحرك إلى مسار التشكيل قبل إطلاق النار، وتجاوز الموجة {wave} للوصول إلى الموجة {nextWave}.",replayFinalGoal:"هدف المحاولة التالية: تحرك إلى مسار التشكيل قبل إطلاق النار وتجاوز الموجة {wave}."}
  };
  Object.entries(REPLAY_GOAL_COPY).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const WAVE_ONE_COPY={
    en:{wave1Goal:"Wave 1 goal: move into a formation lane before firing.",wave1Aim:"Stay under a lane; fire as the formation moves.",wave1Hit:"Good lane. Keep moving with the formation.",wave1Clear:"Wave 1 clear. Read the next lane before firing."},
    "zh-Hant":{wave1Goal:"第 1 波目標：射擊前先移到敵方隊形的路線。",wave1Aim:"保持在隊形路線下方，隨隊形移動射擊。",wave1Hit:"路線抓得好。跟著隊形繼續移動。",wave1Clear:"第 1 波清除。射擊前先讀下一條路線。"},
    "zh-Hans":{wave1Goal:"第 1 波目标：射击前先移到敌方编队的路线。",wave1Aim:"保持在编队路线下方，跟着编队移动射击。",wave1Hit:"路线抓得好。跟着编队继续移动。",wave1Clear:"第 1 波清除。射击前先读下一条路线。"},
    ja:{wave1Goal:"ウェーブ1の目標：発射前に編隊のレーンへ移動。",wave1Aim:"レーンの下で、編隊の動きに合わせて撃とう。",wave1Hit:"いいレーンです。編隊と一緒に動こう。",wave1Clear:"ウェーブ1クリア。撃つ前に次のレーンを読もう。"},
    ko:{wave1Goal:"웨이브 1 목표: 발사 전에 대형의 공격선으로 이동하세요.",wave1Aim:"공격선 아래에서 대형을 따라 움직이며 발사하세요.",wave1Hit:"좋은 공격선이에요. 대형과 함께 계속 움직이세요.",wave1Clear:"웨이브 1 클리어. 발사 전에 다음 공격선을 읽으세요."},
    es:{wave1Goal:"Objetivo de la oleada 1: entra en un carril de la formación antes de disparar.",wave1Aim:"Quédate bajo un carril y dispara mientras se mueve la formación.",wave1Hit:"Buen carril. Sigue moviéndote con la formación.",wave1Clear:"Oleada 1 despejada. Lee el siguiente carril antes de disparar."},
    "pt-BR":{wave1Goal:"Meta da onda 1: entre na faixa da formação antes de atirar.",wave1Aim:"Fique sob uma faixa e atire enquanto a formação se move.",wave1Hit:"Boa faixa. Continue se movendo com a formação.",wave1Clear:"Onda 1 limpa. Leia a próxima faixa antes de atirar."},
    fr:{wave1Goal:"Objectif de la vague 1 : place-toi dans une ligne avant de tirer.",wave1Aim:"Reste sous une ligne et tire quand la formation bouge.",wave1Hit:"Bonne ligne. Continue de suivre la formation.",wave1Clear:"Vague 1 éliminée. Lis la prochaine ligne avant de tirer."},
    de:{wave1Goal:"Ziel von Welle 1: Bewege dich vor dem Schießen in eine Formationbahn.",wave1Aim:"Bleib unter einer Bahn und schieße, während sich die Formation bewegt.",wave1Hit:"Gute Bahn. Bleib mit der Formation in Bewegung.",wave1Clear:"Welle 1 geschafft. Lies vor dem Schießen die nächste Bahn."},
    it:{wave1Goal:"Obiettivo dell'ondata 1: entra nella corsia della formazione prima di sparare.",wave1Aim:"Resta sotto una corsia e spara mentre la formazione si muove.",wave1Hit:"Buona corsia. Continua a muoverti con la formazione.",wave1Clear:"Ondata 1 superata. Leggi la prossima corsia prima di sparare."},
    ru:{wave1Goal:"Цель волны 1: займите линию строя до выстрела.",wave1Aim:"Оставайтесь под линией и стреляйте в движении строя.",wave1Hit:"Хорошая линия. Продолжайте двигаться вместе со строем.",wave1Clear:"Волна 1 пройдена. Прочитайте следующую линию до выстрела."},
    hi:{wave1Goal:"लहर 1 का लक्ष्य: गोली चलाने से पहले गठन की लेन में जाएँ।",wave1Aim:"लेन के नीचे रहें और गठन के साथ चलते हुए गोली चलाएँ।",wave1Hit:"अच्छी लेन। गठन के साथ चलते रहें।",wave1Clear:"लहर 1 साफ़। गोली चलाने से पहले अगली लेन पढ़ें।"},
    ar:{wave1Goal:"هدف الموجة 1: تحرك إلى مسار التشكيل قبل إطلاق النار.",wave1Aim:"ابق تحت المسار وأطلق النار مع تحرك التشكيل.",wave1Hit:"مسار جيد. واصل التحرك مع التشكيل.",wave1Clear:"اكتملت الموجة 1. اقرأ المسار التالي قبل إطلاق النار."}
  };
  Object.entries(WAVE_ONE_COPY).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V32_COPY_PATCH={
    en:{guideIntro:"Defend the signal station against six alien waves. Move, fire, read the formation, and spend your shield window before the line reaches you.",growth:"Wave 2 adds faster volleys. Wave 3 adds shielded captains. Wave 4 introduces staggered relay formations. Wave 5 adds crossfire lanes. Wave 6 brings the signal-core guardian finale.",winCopy:"Six alien waves cleared. The signal station stays bright.",defenseWarning:"The line is close. Move early and follow the next lane."},
    "zh-Hant":{guideIntro:"守護訊號站，迎戰六波外星編隊。移動、射擊、觀察隊形，並在防線逼近前把握護盾窗口。",growth:"第 2 波加入更快彈幕；第 3 波加入護甲隊長；第 4 波加入交錯接力隊形；第 5 波加入交叉火力；第 6 波迎來訊號核心守護者。",winCopy:"六波外星編隊都已清除，訊號站持續閃耀。",defenseWarning:"防線快到了。提早移動，跟著下一條路線走。"},
    "zh-Hans":{guideIntro:"守护信号站，迎战六波外星编队。移动、射击、观察队形，并在防线逼近前把握护盾窗口。",growth:"第 2 波加入更快弹幕；第 3 波加入护甲队长；第 4 波加入交错接力队形；第 5 波加入交叉火力；第 6 波迎来信号核心守护者。",winCopy:"六波外星编队都已清除，信号站持续闪耀。",defenseWarning:"防线快到了。提前移动，跟着下一条路线走。"},
    ja:{guideIntro:"信号ステーションを6つのエイリアンウェーブから守ります。編隊を読み、動いて撃ち、防衛線が近づく前にシールドを使いましょう。",growth:"2ウェーブでは弾幕が速くなり、3ウェーブではシールド隊長、4ウェーブでは交差するリレー編隊、5ウェーブではクロスファイア、6ウェーブでは信号コアの守護者が登場します。",winCopy:"6つのエイリアンウェーブを撃退し、信号ステーションを守りました。",defenseWarning:"防衛線が近いです。早めに動いて次のレーンを追いましょう。"},
    ko:{guideIntro:"신호 기지를 여섯 번의 외계인 웨이브에서 지키세요. 대형을 읽고 움직이며 발사하고, 방어선이 가까워지기 전에 실드 시간을 사용하세요.",growth:"2웨이브는 더 빠른 탄막을, 3웨이브는 실드 대장을, 4웨이브는 교차 릴레이 대형을, 5웨이브는 크로스파이어를, 6웨이브는 신호 코어 수호자를 추가합니다.",winCopy:"여섯 번의 외계인 웨이브를 모두 막아 신호 기지를 지켰습니다.",defenseWarning:"방어선이 가까워요. 일찍 움직여 다음 공격선을 따라가세요."},
    es:{guideIntro:"Defiende la estación de señales de seis oleadas alienígenas. Muévete, dispara, lee la formación y usa tu escudo antes de que la línea se acerque.",growth:"La oleada 2 acelera las ráfagas. La 3 añade capitanes con escudo. La 4 introduce formaciones de relevo escalonadas. La 5 añade fuego cruzado y la 6 culmina con el guardián del núcleo de señales.",winCopy:"Has despejado seis oleadas alienígenas. La estación de señales sigue a salvo.",defenseWarning:"La línea está cerca. Muévete pronto y sigue el siguiente carril."},
    "pt-BR":{guideIntro:"Defenda a estação de sinais contra seis ondas alienígenas. Mova-se, atire, leia a formação e use o escudo antes que a linha se aproxime.",growth:"A onda 2 traz rajadas mais rápidas. A 3 adiciona capitães protegidos. A 4 introduz formações de revezamento escalonadas. A 5 traz fogo cruzado e a 6 culmina com o guardião do núcleo de sinais.",winCopy:"As seis ondas alienígenas foram eliminadas. A estação de sinais continua segura.",defenseWarning:"A linha está perto. Mova-se cedo e acompanhe a próxima faixa."},
    fr:{guideIntro:"Défends la station de signal contre six vagues aliens. Bouge, tire, lis la formation et utilise ton bouclier avant que la ligne approche.",growth:"La vague 2 accélère les salves. La 3 ajoute des capitaines protégés. La 4 introduit des relais décalés. La 5 ajoute des tirs croisés et la 6 finit avec le gardien du noyau de signal.",winCopy:"Les six vagues aliens sont éliminées. La station de signal reste protégée.",defenseWarning:"La ligne approche. Bouge tôt et suis la prochaine ligne."},
    de:{guideIntro:"Verteidige die Signalstation gegen sechs Alien-Wellen. Bewege dich, schieße, lies die Formation und nutze dein Schild, bevor die Linie näher kommt.",growth:"Welle 2 bringt schnellere Salven. Welle 3 ergänzt geschützte Kapitäne. Welle 4 führt versetzte Relaisformationen ein. Welle 5 bringt Kreuzfeuer und Welle 6 den Wächter des Signalkerns.",winCopy:"Alle sechs Alien-Wellen sind besiegt. Die Signalstation bleibt sicher.",defenseWarning:"Die Linie ist nah. Bewege dich früh und folge der nächsten Bahn."},
    it:{guideIntro:"Difendi la stazione del segnale da sei ondate aliene. Muoviti, spara, leggi la formazione e usa lo scudo prima che la linea si avvicini.",growth:"L'ondata 2 accelera le raffiche. La 3 aggiunge capitani protetti. La 4 introduce formazioni relay sfalsate. La 5 aggiunge il fuoco incrociato e la 6 il guardiano del nucleo del segnale.",winCopy:"Tutte e sei le ondate aliene sono state eliminate. La stazione del segnale è al sicuro.",defenseWarning:"La linea è vicina. Muoviti presto e segui la prossima corsia."},
    ru:{guideIntro:"Защищай сигнальную станцию от шести волн пришельцев. Двигайся, стреляй, читай строй и используй щит до приближения линии обороны.",growth:"Во второй волне залпы становятся быстрее. В третьей появляются капитаны со щитом. В четвёртой — ступенчатые релейные строи, в пятой — перекрёстный огонь, а в шестой — страж сигнального ядра.",winCopy:"Все шесть волн пришельцев уничтожены. Сигнальная станция в безопасности.",defenseWarning:"Линия близко. Двигайтесь заранее и следите за следующей линией."},
    hi:{guideIntro:"सिग्नल स्टेशन को छह एलियन लहरों से बचाएँ। चलें, गोली चलाएँ, गठन पढ़ें और रेखा पास आने से पहले ढाल का उपयोग करें।",growth:"लहर 2 तेज़ गोलियाँ जोड़ती है। लहर 3 में ढाल वाले कप्तान, लहर 4 में सीक्वेंस रिले गठन, लहर 5 में क्रॉसफायर और लहर 6 में सिग्नल-कोर संरक्षक आता है।",winCopy:"सभी छह एलियन लहरें साफ़ हो गईं। सिग्नल स्टेशन सुरक्षित है।",defenseWarning:"रेखा पास है। जल्दी चलें और अगली लेन के साथ रहें।"},
    ar:{guideIntro:"دافع عن محطة الإشارة أمام ست موجات فضائية. تحرك وأطلق النار واقرأ التشكيل واستخدم الدرع قبل اقتراب الخط.",growth:"تضيف الموجة الثانية طلقات أسرع، والثالثة قادة محميين، والرابعة تشكيلات ترحيل متدرجة، والخامسة نيراناً متقاطعة، والسادسة حارس نواة الإشارة.",winCopy:"تم القضاء على الموجات الفضائية الست، وبقيت محطة الإشارة آمنة.",defenseWarning:"الخط قريب. تحرك مبكراً واتبع المسار التالي."}
  };
  Object.entries(V32_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const LEAVE_COPY={
    en:{leaveKicker:"Pause defense",leaveTitle:"Leave this defense?",leaveCopy:"Your current wave, score, and temporary shield will be lost if you return to the main page.",continue:"Continue playing",leave:"Return to main"},
    "zh-Hant":{leaveKicker:"暫停防守",leaveTitle:"要離開這場防守嗎？",leaveCopy:"回到主頁會失去目前波次、分數與暫時護盾。",continue:"繼續防守",leave:"回到主頁"},
    "zh-Hans":{leaveKicker:"暂停防守",leaveTitle:"要离开这场防守吗？",leaveCopy:"回到主页会失去当前波次、分数和临时护盾。",continue:"继续防守",leave:"回到主页"},
    ja:{leaveKicker:"防衛を一時停止",leaveTitle:"この防衛を離れますか？",leaveCopy:"メインへ戻ると、現在のウェーブ、スコア、一時的なシールドを失います。",continue:"防衛を続ける",leave:"メインへ戻る"},
    ko:{leaveKicker:"방어 일시정지",leaveTitle:"이 방어를 나갈까요?",leaveCopy:"메인으로 돌아가면 현재 웨이브, 점수, 임시 실드를 잃습니다.",continue:"계속 플레이",leave:"메인으로"},
    es:{leaveKicker:"Defensa en pausa",leaveTitle:"¿Salir de esta defensa?",leaveCopy:"Si vuelves al inicio perderás la oleada, la puntuación y el escudo temporal actuales.",continue:"Seguir jugando",leave:"Volver al inicio"},
    "pt-BR":{leaveKicker:"Defesa pausada",leaveTitle:"Sair desta defesa?",leaveCopy:"Se voltar ao início, você perderá a onda, a pontuação e o escudo temporário atuais.",continue:"Continuar jogando",leave:"Voltar ao início"},
    fr:{leaveKicker:"Défense en pause",leaveTitle:"Quitter cette défense ?",leaveCopy:"En retournant à l'accueil, tu perdras la vague, le score et le bouclier temporaire actuels.",continue:"Continuer",leave:"Retour à l'accueil"},
    de:{leaveKicker:"Verteidigung pausiert",leaveTitle:"Diese Verteidigung verlassen?",leaveCopy:"Wenn du zur Startseite zurückkehrst, verlierst du die aktuelle Welle, Punktzahl und den temporären Schild.",continue:"Weiterspielen",leave:"Zur Startseite"},
    it:{leaveKicker:"Difesa in pausa",leaveTitle:"Vuoi uscire da questa difesa?",leaveCopy:"Tornando all'inizio perderai l'ondata, il punteggio e lo scudo temporaneo attuali.",continue:"Continua a giocare",leave:"Torna all'inizio"},
    ru:{leaveKicker:"Оборона на паузе",leaveTitle:"Выйти из этой обороны?",leaveCopy:"При возврате на главную текущая волна, счёт и временный щит будут потеряны.",continue:"Продолжить игру",leave:"На главную"},
    hi:{leaveKicker:"रक्षा रुकी है",leaveTitle:"इस रक्षा से बाहर जाएँ?",leaveCopy:"मुख्य पृष्ठ पर लौटने से वर्तमान लहर, स्कोर और अस्थायी ढाल खो जाएगी।",continue:"खेल जारी रखें",leave:"मुख्य पृष्ठ पर जाएँ"},
    ar:{leaveKicker:"الدفاع متوقف مؤقتاً",leaveTitle:"هل تريد مغادرة هذا الدفاع؟",leaveCopy:"ستفقد الموجة الحالية والنتيجة والدرع المؤقت إذا عدت إلى الرئيسية.",continue:"متابعة اللعب",leave:"العودة للرئيسية"}
  };
  Object.entries(LEAVE_COPY).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V33_COPY_PATCH={
    en:{incomingFire:"Incoming fire — shift lanes.",waveReached:"Wave reached",replayWinGoal:"Next-run target: beat this score and reach Wave {wave} again."},
    "zh-Hant":{incomingFire:"敵方來襲，換一條路線。",waveReached:"抵達波次",replayWinGoal:"下一局目標：打破本局分數，再次抵達第 {wave} 波。"},
    "zh-Hans":{incomingFire:"敌方来袭，换一条路线。",waveReached:"到达波次",replayWinGoal:"下一局目标：打破本局分数，再次到达第 {wave} 波。"},
    ja:{incomingFire:"敵弾です。レーンを移動しましょう。",waveReached:"到達ウェーブ",replayWinGoal:"次の目標：このスコアを更新し、もう一度{wave}ウェーブへ進みましょう。"},
    ko:{incomingFire:"적의 공격이에요. 공격선을 바꾸세요.",waveReached:"도달 웨이브",replayWinGoal:"다음 목표: 이 점수를 넘고 웨이브 {wave}에 다시 도달하세요."},
    es:{incomingFire:"Fuego enemigo: cambia de carril.",waveReached:"Oleada alcanzada",replayWinGoal:"Objetivo siguiente: supera esta puntuación y vuelve a llegar a la oleada {wave}."},
    "pt-BR":{incomingFire:"Fogo inimigo — mude de faixa.",waveReached:"Onda alcançada",replayWinGoal:"Próxima meta: supere esta pontuação e chegue à onda {wave} novamente."},
    fr:{incomingFire:"Tirs ennemis : change de ligne.",waveReached:"Vague atteinte",replayWinGoal:"Prochain objectif : bats ce score et atteins à nouveau la vague {wave}."},
    de:{incomingFire:"Feuer im Anflug – wechsle die Bahn.",waveReached:"Erreichte Welle",replayWinGoal:"Nächstes Ziel: Übertriff diese Punktzahl und erreiche wieder Welle {wave}."},
    it:{incomingFire:"Fuoco nemico: cambia corsia.",waveReached:"Ondata raggiunta",replayWinGoal:"Prossimo obiettivo: supera questo punteggio e raggiungi di nuovo l'ondata {wave}."},
    ru:{incomingFire:"Вражеский огонь — смените линию.",waveReached:"Достигнутая волна",replayWinGoal:"Следующая цель: побейте этот счёт и снова дойдите до волны {wave}."},
    hi:{incomingFire:"दुश्मन की आग — लेन बदलें।",waveReached:"पहुंची लहर",replayWinGoal:"अगला लक्ष्य: इस स्कोर को पार करें और फिर लहर {wave} तक पहुँचें।"},
    ar:{incomingFire:"نيران قادمة — غيّر المسار.",waveReached:"الموجة التي تم بلوغها",replayWinGoal:"الهدف التالي: تجاوز هذه النتيجة والوصول إلى الموجة {wave} مجدداً."}
  };
  Object.entries(V33_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V41_COPY_PATCH={
    en:{firepowerUpgrade:"Wave {wave}: firepower upgraded — {shots} shots per Fire."},
    "zh-Hant":{firepowerUpgrade:"第 {wave} 波：火力升級，每次射擊 {shots} 發。"},
    "zh-Hans":{firepowerUpgrade:"第 {wave} 波：火力升级，每次射击 {shots} 发。"},
    ja:{firepowerUpgrade:"ウェーブ{wave}：火力アップ。1回の発射で{shots}発。"},
    ko:{firepowerUpgrade:"웨이브 {wave}: 화력 강화. 발사 한 번에 {shots}발."},
    es:{firepowerUpgrade:"Oleada {wave}: potencia mejorada: {shots} disparos por lanzamiento."},
    "pt-BR":{firepowerUpgrade:"Onda {wave}: poder de fogo aumentado — {shots} disparos por tiro."},
    fr:{firepowerUpgrade:"Vague {wave} : puissance augmentée — {shots} tirs par salve."},
    de:{firepowerUpgrade:"Welle {wave}: Feuerkraft erhöht – {shots} Schüsse pro Feuer."},
    it:{firepowerUpgrade:"Ondata {wave}: potenza aumentata — {shots} colpi per sparo."},
    ru:{firepowerUpgrade:"Волна {wave}: огневая мощь усилена — {shots} выстр. за запуск."},
    hi:{firepowerUpgrade:"लहर {wave}: फायरपावर बढ़ी — हर फायर में {shots} गोलियाँ।"},
    ar:{firepowerUpgrade:"الموجة {wave}: ترقية القوة النارية — {shots} طلقات في كل إطلاق."}
  };
  Object.entries(V41_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V42_COPY_PATCH={
    en:{stageSelectKicker:"STAGE SELECT",stageSelectTitle:"Choose a stage",stage:"Stage",stagePower:"Firepower: {shots} shots",stageLocked:"Locked",stageUnlocked:"Ready",stages:"Stages",nextStage:"Next Stage",replay:"Replay",returnStages:"Return to stages",stageProgress:"{unlocked} / 6 unlocked",stageGoal:"Stage {stage}: clear this formation to continue.",stageReached:"Stage reached",stageWinGoal:"Stage {stage} clear. Next Stage is ready.",stageFinalGoal:"All six stages clear. Replay any stage to chase a higher score.",stageFailGoal:"Replay Stage {stage}, then continue to the next unlocked stage.",leave:"Return to stages",leaveCopy:"Your current stage and score will be lost if you return to the stage list."},
    "zh-Hant":{stageSelectKicker:"關卡選擇",stageSelectTitle:"選擇一個關卡",stage:"關卡",stagePower:"火力：{shots} 發",stageLocked:"未解鎖",stageUnlocked:"可挑戰",stages:"關卡",nextStage:"下一關",replay:"重玩",returnStages:"回到關卡",stageProgress:"已解鎖 {unlocked} / 6",stageGoal:"第 {stage} 關：清除這個編隊後繼續。",stageReached:"抵達關卡",stageWinGoal:"第 {stage} 關完成，下一關已解鎖。",stageFinalGoal:"六個關卡都完成了，重玩任一關挑戰更高分。",stageFailGoal:"重玩第 {stage} 關，再前往下一個已解鎖關卡。",leave:"回到關卡",leaveCopy:"目前關卡與分數會遺失，確定要回到關卡列表嗎？"},
    "zh-Hans":{stageSelectKicker:"关卡选择",stageSelectTitle:"选择一个关卡",stage:"关卡",stagePower:"火力：{shots} 发",stageLocked:"未解锁",stageUnlocked:"可挑战",stages:"关卡",nextStage:"下一关",replay:"重玩",returnStages:"回到关卡",stageProgress:"已解锁 {unlocked} / 6",stageGoal:"第 {stage} 关：清除这个编队后继续。",stageReached:"到达关卡",stageWinGoal:"第 {stage} 关完成，下一关已解锁。",stageFinalGoal:"六个关卡都完成了，重玩任一关挑战更高分。",stageFailGoal:"重玩第 {stage} 关，再前往下一个已解锁关卡。",leave:"回到关卡",leaveCopy:"当前关卡与分数会丢失，确定要回到关卡列表吗？"},
    ja:{stageSelectKicker:"ステージ選択",stageSelectTitle:"ステージを選ぶ",stage:"ステージ",stagePower:"火力：{shots}発",stageLocked:"ロック中",stageUnlocked:"挑戦可能",stages:"ステージ一覧",nextStage:"次のステージ",replay:"リプレイ",returnStages:"ステージ一覧へ戻る",stageProgress:"解放済み {unlocked} / 6",stageGoal:"ステージ{stage}：この編隊を倒して先へ進もう。",stageReached:"到達ステージ",stageWinGoal:"ステージ{stage}クリア。次のステージが解放されました。",stageFinalGoal:"6ステージすべてクリア。好きなステージで高得点を狙おう。",stageFailGoal:"ステージ{stage}をリプレイして、次の解放済みステージへ進もう。",leave:"ステージ一覧へ戻る",leaveCopy:"現在のステージとスコアを失って、ステージ一覧へ戻りますか？"},
    ko:{stageSelectKicker:"스테이지 선택",stageSelectTitle:"스테이지를 선택하세요",stage:"스테이지",stagePower:"화력: {shots}발",stageLocked:"잠김",stageUnlocked:"도전 가능",stages:"스테이지",nextStage:"다음 스테이지",replay:"다시 플레이",returnStages:"스테이지로 돌아가기",stageProgress:"잠금 해제 {unlocked} / 6",stageGoal:"스테이지 {stage}: 이 편대를 처치하고 계속하세요.",stageReached:"도달한 스테이지",stageWinGoal:"스테이지 {stage} 클리어. 다음 스테이지가 열렸습니다.",stageFinalGoal:"6개 스테이지를 모두 클리어했습니다. 원하는 스테이지에서 최고 점수에 도전하세요.",stageFailGoal:"스테이지 {stage}를 다시 플레이한 뒤 다음 잠금 해제 스테이지로 가세요.",leave:"스테이지로 돌아가기",leaveCopy:"현재 스테이지와 점수를 잃고 스테이지 목록으로 돌아갈까요?"},
    es:{stageSelectKicker:"SELECCIÓN DE FASE",stageSelectTitle:"Elige una fase",stage:"Fase",stagePower:"Potencia: {shots} disparos",stageLocked:"Bloqueada",stageUnlocked:"Lista",stages:"Fases",nextStage:"Siguiente fase",replay:"Repetir",returnStages:"Volver a fases",stageProgress:"{unlocked} / 6 desbloqueadas",stageGoal:"Fase {stage}: elimina esta formación para continuar.",stageReached:"Fase alcanzada",stageWinGoal:"Fase {stage} superada. La siguiente fase está lista.",stageFinalGoal:"Has superado las seis fases. Repite cualquiera para buscar una puntuación mayor.",stageFailGoal:"Repite la fase {stage} y continúa a la siguiente fase desbloqueada.",leave:"Volver a fases",leaveCopy:"Perderás la fase y la puntuación actuales si vuelves a la lista de fases."},
    "pt-BR":{stageSelectKicker:"SELEÇÃO DE FASE",stageSelectTitle:"Escolha uma fase",stage:"Fase",stagePower:"Poder de fogo: {shots} disparos",stageLocked:"Bloqueada",stageUnlocked:"Pronta",stages:"Fases",nextStage:"Próxima fase",replay:"Jogar novamente",returnStages:"Voltar às fases",stageProgress:"{unlocked} / 6 desbloqueadas",stageGoal:"Fase {stage}: elimine esta formação para continuar.",stageReached:"Fase alcançada",stageWinGoal:"Fase {stage} concluída. A próxima fase está pronta.",stageFinalGoal:"Você concluiu as seis fases. Jogue qualquer uma novamente para buscar uma pontuação maior.",stageFailGoal:"Jogue a fase {stage} novamente e siga para a próxima fase desbloqueada.",leave:"Voltar às fases",leaveCopy:"A fase e a pontuação atuais serão perdidas se você voltar à lista de fases."},
    fr:{stageSelectKicker:"SÉLECTION DE NIVEAU",stageSelectTitle:"Choisis un niveau",stage:"Niveau",stagePower:"Puissance : {shots} tirs",stageLocked:"Verrouillé",stageUnlocked:"Prêt",stages:"Niveaux",nextStage:"Niveau suivant",replay:"Rejouer",returnStages:"Retour aux niveaux",stageProgress:"{unlocked} / 6 déverrouillés",stageGoal:"Niveau {stage} : élimine cette formation pour continuer.",stageReached:"Niveau atteint",stageWinGoal:"Niveau {stage} terminé. Le niveau suivant est prêt.",stageFinalGoal:"Les six niveaux sont terminés. Rejoue celui de ton choix pour battre ton score.",stageFailGoal:"Rejoue le niveau {stage}, puis continue vers le prochain niveau déverrouillé.",leave:"Retour aux niveaux",leaveCopy:"Ton niveau et ton score actuels seront perdus si tu retournes à la liste des niveaux."},
    de:{stageSelectKicker:"STUFENAUSWAHL",stageSelectTitle:"Wähle eine Stufe",stage:"Stufe",stagePower:"Feuerkraft: {shots} Schüsse",stageLocked:"Gesperrt",stageUnlocked:"Bereit",stages:"Stufen",nextStage:"Nächste Stufe",replay:"Nochmal",returnStages:"Zurück zu den Stufen",stageProgress:"{unlocked} / 6 freigeschaltet",stageGoal:"Stufe {stage}: Zerstöre diese Formation, um weiterzukommen.",stageReached:"Erreichte Stufe",stageWinGoal:"Stufe {stage} geschafft. Die nächste Stufe ist bereit.",stageFinalGoal:"Alle sechs Stufen geschafft. Spiele jede Stufe erneut und jage den Highscore.",stageFailGoal:"Spiele Stufe {stage} erneut und gehe danach zur nächsten freigeschalteten Stufe.",leave:"Zurück zu den Stufen",leaveCopy:"Deine aktuelle Stufe und dein Punktestand gehen verloren, wenn du zur Stufenauswahl zurückkehrst."},
    it:{stageSelectKicker:"SELEZIONE LIVELLO",stageSelectTitle:"Scegli un livello",stage:"Livello",stagePower:"Potenza: {shots} colpi",stageLocked:"Bloccato",stageUnlocked:"Pronto",stages:"Livelli",nextStage:"Livello successivo",replay:"Rigioca",returnStages:"Torna ai livelli",stageProgress:"{unlocked} / 6 sbloccati",stageGoal:"Livello {stage}: elimina questa formazione per continuare.",stageReached:"Livello raggiunto",stageWinGoal:"Livello {stage} completato. Il livello successivo è pronto.",stageFinalGoal:"Tutti e sei i livelli sono completati. Rigioca quello che vuoi per puntare al record.",stageFailGoal:"Rigioca il livello {stage}, poi continua verso il prossimo livello sbloccato.",leave:"Torna ai livelli",leaveCopy:"Il livello e il punteggio attuali andranno persi tornando alla lista dei livelli."},
    ru:{stageSelectKicker:"ВЫБОР ЭТАПА",stageSelectTitle:"Выберите этап",stage:"Этап",stagePower:"Огневая мощь: {shots} выстр.",stageLocked:"Закрыт",stageUnlocked:"Доступен",stages:"Этапы",nextStage:"Следующий этап",replay:"Повторить",returnStages:"К этапам",stageProgress:"Открыто: {unlocked} / 6",stageGoal:"Этап {stage}: уничтожьте строй, чтобы продолжить.",stageReached:"Достигнутый этап",stageWinGoal:"Этап {stage} пройден. Следующий этап открыт.",stageFinalGoal:"Все шесть этапов пройдены. Повторите любой и улучшите результат.",stageFailGoal:"Повторите этап {stage}, затем переходите к следующему открытому этапу.",leave:"К этапам",leaveCopy:"Текущий этап и счёт будут потеряны при возврате к списку этапов."},
    hi:{stageSelectKicker:"स्टेज चुनें",stageSelectTitle:"एक स्टेज चुनें",stage:"स्टेज",stagePower:"फायरपावर: {shots} गोलियाँ",stageLocked:"लॉक है",stageUnlocked:"तैयार",stages:"स्टेज",nextStage:"अगला स्टेज",replay:"फिर खेलें",returnStages:"स्टेज पर लौटें",stageProgress:"{unlocked} / 6 अनलॉक",stageGoal:"स्टेज {stage}: आगे बढ़ने के लिए इस फॉर्मेशन को साफ़ करें।",stageReached:"पहुंचा स्टेज",stageWinGoal:"स्टेज {stage} पूरा। अगला स्टेज तैयार है।",stageFinalGoal:"सभी छह स्टेज पूरे। बेहतर स्कोर के लिए कोई भी स्टेज फिर खेलें।",stageFailGoal:"स्टेज {stage} फिर खेलें, फिर अगले अनलॉक स्टेज पर जाएँ।",leave:"स्टेज पर लौटें",leaveCopy:"स्टेज सूची पर लौटने पर आपका मौजूदा स्टेज और स्कोर खो जाएगा।"},
    ar:{stageSelectKicker:"اختيار المرحلة",stageSelectTitle:"اختر مرحلة",stage:"المرحلة",stagePower:"القوة النارية: {shots} طلقات",stageLocked:"مقفلة",stageUnlocked:"جاهزة",stages:"المراحل",nextStage:"المرحلة التالية",replay:"إعادة اللعب",returnStages:"العودة إلى المراحل",stageProgress:"تم فتح {unlocked} / 6",stageGoal:"المرحلة {stage}: أزل هذا التشكيل للمتابعة.",stageReached:"المرحلة التي تم بلوغها",stageWinGoal:"اكتملت المرحلة {stage}. المرحلة التالية جاهزة.",stageFinalGoal:"اكتملت المراحل الست. أعد أي مرحلة لمطاردة نتيجة أعلى.",stageFailGoal:"أعد المرحلة {stage} ثم تابع إلى المرحلة التالية المفتوحة.",leave:"العودة إلى المراحل",leaveCopy:"ستفقد المرحلة والنتيجة الحاليتين عند العودة إلى قائمة المراحل."}
  };
  Object.entries(V42_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V43_COPY_PATCH={
    en:{stageProgress:"{unlocked} / 6 · {shots} shots",stageGoal:"Stage {stage}: clear this single wave.",stagePower:"Current firepower: {shots} shots",stageWinGoal:"Stage {stage} clear. Firepower upgraded to {shots} shots. Next Stage is ready.",stageFinalGoal:"All six stages clear. Firepower reached {shots} shots. Replay any stage to chase a higher score.",firepower:"Firepower",firepowerUpgrade:"Firepower upgraded to {shots} shots."},
    "zh-Hant":{stageProgress:"已解鎖 {unlocked} / 6 · 火力 {shots} 發",stageGoal:"第 {stage} 關：清除這一波後繼續。",stagePower:"目前火力：{shots} 發",stageWinGoal:"第 {stage} 關完成，火力提升至 {shots} 發，下一關已解鎖。",stageFinalGoal:"六個關卡都完成，火力已提升至 {shots} 發。重玩任一關挑戰更高分。",firepower:"火力",firepowerUpgrade:"火力提升至 {shots} 發。"},
    "zh-Hans":{stageProgress:"已解锁 {unlocked} / 6 · 火力 {shots} 发",stageGoal:"第 {stage} 关：清除这一波后继续。",stagePower:"当前火力：{shots} 发",stageWinGoal:"第 {stage} 关完成，火力提升至 {shots} 发，下一关已解锁。",stageFinalGoal:"六个关卡都完成，火力已提升至 {shots} 发。重玩任一关挑战更高分。",firepower:"火力",firepowerUpgrade:"火力提升至 {shots} 发。"},
    ja:{stageProgress:"解放済み {unlocked} / 6 · 火力 {shots}発",stageGoal:"ステージ{stage}：この1ウェーブをクリアして先へ進もう。",stagePower:"現在の火力：{shots}発",stageWinGoal:"ステージ{stage}クリア。火力が{shots}発に強化され、次が解放されました。",stageFinalGoal:"6ステージすべてクリア。火力は{shots}発。好きなステージで高得点を狙おう。",firepower:"火力",firepowerUpgrade:"火力が{shots}発に強化されました。"},
    ko:{stageProgress:"잠금 해제 {unlocked} / 6 · 화력 {shots}발",stageGoal:"스테이지 {stage}: 이 한 웨이브를 처치하고 계속하세요.",stagePower:"현재 화력: {shots}발",stageWinGoal:"스테이지 {stage} 클리어. 화력이 {shots}발로 강화되어 다음 스테이지가 열렸습니다.",stageFinalGoal:"6개 스테이지를 모두 클리어했습니다. 화력은 {shots}발입니다. 원하는 스테이지에서 최고 점수에 도전하세요.",firepower:"화력",firepowerUpgrade:"화력이 {shots}발로 강화되었습니다."},
    es:{stageProgress:"{unlocked} / 6 · {shots} disparos",stageGoal:"Fase {stage}: elimina esta única oleada para continuar.",stagePower:"Potencia actual: {shots} disparos",stageWinGoal:"Fase {stage} superada. Potencia mejorada a {shots} disparos; la siguiente está lista.",stageFinalGoal:"Has superado las seis fases. Potencia alcanzada: {shots} disparos. Repite cualquiera para buscar una puntuación mayor.",firepower:"Potencia",firepowerUpgrade:"Potencia mejorada a {shots} disparos."},
    "pt-BR":{stageProgress:"{unlocked} / 6 · {shots} disparos",stageGoal:"Fase {stage}: elimine esta única onda para continuar.",stagePower:"Poder de fogo atual: {shots} disparos",stageWinGoal:"Fase {stage} concluída. Poder de fogo aumentado para {shots} disparos; a próxima está pronta.",stageFinalGoal:"Você concluiu as seis fases. Poder de fogo: {shots} disparos. Jogue qualquer uma novamente para buscar uma pontuação maior.",firepower:"Poder de fogo",firepowerUpgrade:"Poder de fogo aumentado para {shots} disparos."},
    fr:{stageProgress:"{unlocked} / 6 · {shots} tirs",stageGoal:"Niveau {stage} : élimine cette seule vague pour continuer.",stagePower:"Puissance actuelle : {shots} tirs",stageWinGoal:"Niveau {stage} terminé. Puissance augmentée à {shots} tirs ; le suivant est prêt.",stageFinalGoal:"Les six niveaux sont terminés. Puissance atteinte : {shots} tirs. Rejoue celui de ton choix pour battre ton score.",firepower:"Puissance",firepowerUpgrade:"Puissance augmentée à {shots} tirs."},
    de:{stageProgress:"{unlocked} / 6 · {shots} Schüsse",stageGoal:"Stufe {stage}: Zerstöre diese eine Welle, um weiterzukommen.",stagePower:"Aktuelle Feuerkraft: {shots} Schüsse",stageWinGoal:"Stufe {stage} geschafft. Feuerkraft auf {shots} Schüsse erhöht; die nächste Stufe ist bereit.",stageFinalGoal:"Alle sechs Stufen geschafft. Feuerkraft: {shots} Schüsse. Spiele jede Stufe erneut und jage den Highscore.",firepower:"Feuerkraft",firepowerUpgrade:"Feuerkraft auf {shots} Schüsse erhöht."},
    it:{stageProgress:"{unlocked} / 6 · {shots} colpi",stageGoal:"Livello {stage}: elimina questa sola ondata per continuare.",stagePower:"Potenza attuale: {shots} colpi",stageWinGoal:"Livello {stage} completato. Potenza aumentata a {shots} colpi; il prossimo è pronto.",stageFinalGoal:"Tutti e sei i livelli sono completati. Potenza raggiunta: {shots} colpi. Rigioca quello che vuoi per puntare al record.",firepower:"Potenza",firepowerUpgrade:"Potenza aumentata a {shots} colpi."},
    ru:{stageProgress:"Открыто: {unlocked} / 6 · {shots} выстр.",stageGoal:"Этап {stage}: уничтожьте эту одну волну, чтобы продолжить.",stagePower:"Текущая мощь: {shots} выстр.",stageWinGoal:"Этап {stage} пройден. Мощь усилена до {shots} выстр.; следующий этап открыт.",stageFinalGoal:"Все шесть этапов пройдены. Мощь: {shots} выстр. Повторите любой этап и улучшите результат.",firepower:"Мощь",firepowerUpgrade:"Мощь усилена до {shots} выстр."},
    hi:{stageProgress:"{unlocked} / 6 · {shots} गोलियाँ",stageGoal:"स्टेज {stage}: आगे बढ़ने के लिए इस एक लहर को साफ़ करें।",stagePower:"मौजूदा फायरपावर: {shots} गोलियाँ",stageWinGoal:"स्टेज {stage} पूरा। फायरपावर {shots} गोलियों तक बढ़ी; अगला स्टेज तैयार है।",stageFinalGoal:"सभी छह स्टेज पूरे। फायरपावर {shots} गोलियाँ। बेहतर स्कोर के लिए कोई भी स्टेज फिर खेलें।",firepower:"फायरपावर",firepowerUpgrade:"फायरपावर बढ़कर {shots} गोलियाँ हो गई।"},
    ar:{stageProgress:"تم فتح {unlocked} / 6 · {shots} طلقات",stageGoal:"المرحلة {stage}: أزل هذه الموجة الواحدة للمتابعة.",stagePower:"القوة الحالية: {shots} طلقات",stageWinGoal:"اكتملت المرحلة {stage}. ارتفعت القوة إلى {shots} طلقات؛ المرحلة التالية جاهزة.",stageFinalGoal:"اكتملت المراحل الست. القوة: {shots} طلقات. أعد أي مرحلة لمطاردة نتيجة أعلى.",firepower:"القوة النارية",firepowerUpgrade:"ارتفعت القوة إلى {shots} طلقات."}
  };
  Object.entries(V43_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V44_COPY_PATCH={
    en:{stageProgress:"{unlocked} / 30 unlocked",stagePower:"Firepower {shots}",credits:"Credits",upgrades:"Upgrades",upgradeTitle:"Hangar upgrades",upgradeCopy:"Spend credits earned in Battle. Upgrades persist between stages.",upgradeFirepower:"Spread firepower",upgradeShield:"Shield reserve",upgradeHull:"Hull integrity",upgradeRapid:"Fire cadence",buy:"Buy",owned:"Owned",maxed:"Maxed",close:"Back to stages",upgradeCost:"Cost: {cost}",rewardCopy:"Stage {stage} clear. +{credits} credits. Visit Upgrades to buy power.",stageFinalGoal:"All 30 stages clear. Spend your credits to perfect the build.",stageFailGoal:"Replay Stage {stage}. Hits and clears earn credits for upgrades.",ruleScout:"Patrol",ruleVolley:"Volley",ruleArmor:"Armored captains",ruleRelay:"Relay formation",ruleCrossfire:"Crossfire",ruleCore:"Signal core",stageGoal:"Stage {stage}: {rule}. Clear this single wave.",stageWinGoal:"Stage {stage} clear. +{credits} credits. Firepower remains {shots} shots until you buy an upgrade."},
    "zh-Hant":{stageProgress:"已解鎖 {unlocked} / 30",stagePower:"火力 {shots} 發",credits:"能源點",upgrades:"強化",upgradeTitle:"機庫強化",upgradeCopy:"用戰鬥賺到的能源點購買強化，效果會保留到之後的關卡。",upgradeFirepower:"散射火力",upgradeShield:"護盾儲備",upgradeHull:"船體完整度",upgradeRapid:"射擊節奏",buy:"購買",owned:"已擁有",maxed:"已滿級",close:"回到關卡",upgradeCost:"花費：{cost}",rewardCopy:"第 {stage} 關完成，獲得 +{credits} 能源點。到強化頁購買火力。",stageFinalGoal:"30 個關卡全部完成。用能源點打造最強配置。",stageFailGoal:"重玩第 {stage} 關。命中與通關都能賺取強化用能源點。",ruleScout:"巡邏編隊",ruleVolley:"齊射彈幕",ruleArmor:"裝甲隊長",ruleRelay:"接力隊形",ruleCrossfire:"交叉火網",ruleCore:"訊號核心",stageGoal:"第 {stage} 關：{rule}。清除這一波。",stageWinGoal:"第 {stage} 關完成，獲得 +{credits} 能源點。購買前火力維持 {shots} 發。"},
    "zh-Hans":{stageProgress:"已解锁 {unlocked} / 30",stagePower:"火力 {shots} 发",credits:"能源点",upgrades:"强化",upgradeTitle:"机库强化",upgradeCopy:"用战斗赚到的能源点购买强化，效果会保留到之后的关卡。",upgradeFirepower:"散射火力",upgradeShield:"护盾储备",upgradeHull:"船体完整度",upgradeRapid:"射击节奏",buy:"购买",owned:"已拥有",maxed:"已满级",close:"回到关卡",upgradeCost:"花费：{cost}",rewardCopy:"第 {stage} 关完成，获得 +{credits} 能源点。到强化页购买火力。",stageFinalGoal:"30 个关卡全部完成。用能源点打造最强配置。",stageFailGoal:"重玩第 {stage} 关。命中与通关都能赚取强化用能源点。",ruleScout:"巡逻编队",ruleVolley:"齐射弹幕",ruleArmor:"装甲队长",ruleRelay:"接力队形",ruleCrossfire:"交叉火网",ruleCore:"信号核心",stageGoal:"第 {stage} 关：{rule}。清除这一波。",stageWinGoal:"第 {stage} 关完成，获得 +{credits} 能源点。购买前火力维持 {shots} 发。"},
    ja:{stageProgress:"解放済み {unlocked} / 30",stagePower:"火力 {shots}発",credits:"エネルギー",upgrades:"強化",upgradeTitle:"格納庫の強化",upgradeCopy:"バトルで得たエネルギーで購入。強化は次のステージにも残ります。",upgradeFirepower:"拡散火力",upgradeShield:"シールド備蓄",upgradeHull:"船体耐久",upgradeRapid:"射撃テンポ",buy:"購入",owned:"所持済み",maxed:"最大",close:"ステージへ戻る",upgradeCost:"コスト：{cost}",rewardCopy:"ステージ{stage}クリア。エネルギー+{credits}。強化で火力を購入できます。",stageFinalGoal:"30ステージすべてクリア。エネルギーで最強の機体を作ろう。",stageFailGoal:"ステージ{stage}を再挑戦。命中とクリアで強化用エネルギーを獲得できます。",ruleScout:"巡回編隊",ruleVolley:"一斉射撃",ruleArmor:"装甲キャプテン",ruleRelay:"リレー編隊",ruleCrossfire:"クロスファイア",ruleCore:"シグナルコア",stageGoal:"ステージ{stage}：{rule}。この1ウェーブをクリアしよう。",stageWinGoal:"ステージ{stage}クリア。エネルギー+{credits}。購入するまで火力は{shots}発。"},
    ko:{stageProgress:"잠금 해제 {unlocked} / 30",stagePower:"화력 {shots}발",credits:"에너지",upgrades:"강화",upgradeTitle:"격납고 강화",upgradeCopy:"전투에서 얻은 에너지로 구매하세요. 강화 효과는 다음 스테이지에도 유지됩니다.",upgradeFirepower:"확산 화력",upgradeShield:"실드 비축",upgradeHull:"선체 내구도",upgradeRapid:"발사 리듬",buy:"구매",owned:"보유",maxed:"최대",close:"스테이지로 돌아가기",upgradeCost:"비용: {cost}",rewardCopy:"스테이지 {stage} 클리어. 에너지 +{credits}. 강화에서 화력을 구매하세요.",stageFinalGoal:"30개 스테이지를 모두 클리어했습니다. 에너지로 최강의 기체를 만드세요.",stageFailGoal:"스테이지 {stage}를 다시 플레이하세요. 명중과 클리어로 강화 에너지를 얻습니다.",ruleScout:"순찰 대형",ruleVolley:"집중 사격",ruleArmor:"장갑 대장",ruleRelay:"릴레이 대형",ruleCrossfire:"교차 사격",ruleCore:"신호 코어",stageGoal:"스테이지 {stage}: {rule}. 이 웨이브를 처치하세요.",stageWinGoal:"스테이지 {stage} 클리어. 에너지 +{credits}. 구매 전 화력은 {shots}발입니다."},
    es:{stageProgress:"{unlocked} / 30 desbloqueadas",stagePower:"Potencia {shots}",credits:"Energía",upgrades:"Mejoras",upgradeTitle:"Mejoras del hangar",upgradeCopy:"Gasta la energía ganada en Battle. Las mejoras permanecen entre fases.",upgradeFirepower:"Potencia de dispersión",upgradeShield:"Reserva de escudo",upgradeHull:"Integridad del casco",upgradeRapid:"Ritmo de disparo",buy:"Comprar",owned:"Comprada",maxed:"Máxima",close:"Volver a fases",upgradeCost:"Coste: {cost}",rewardCopy:"Fase {stage} superada. +{credits} de energía. Compra potencia en Mejoras.",stageFinalGoal:"Has superado las 30 fases. Usa tu energía para perfeccionar la nave.",stageFailGoal:"Repite la fase {stage}. Los impactos y las victorias dan energía para mejoras.",ruleScout:"Patrulla",ruleVolley:"Salva rápida",ruleArmor:"Capitanes blindados",ruleRelay:"Formación de relevo",ruleCrossfire:"Fuego cruzado",ruleCore:"Núcleo de señal",stageGoal:"Fase {stage}: {rule}. Elimina esta oleada.",stageWinGoal:"Fase {stage} superada. +{credits} de energía. La potencia queda en {shots} hasta comprar una mejora."},
    "pt-BR":{stageProgress:"{unlocked} / 30 desbloqueadas",stagePower:"Poder {shots}",credits:"Energia",upgrades:"Melhorias",upgradeTitle:"Melhorias do hangar",upgradeCopy:"Gaste a energia ganha na Batalha. As melhorias permanecem entre as fases.",upgradeFirepower:"Poder de fogo espalhado",upgradeShield:"Reserva de escudo",upgradeHull:"Integridade do casco",upgradeRapid:"Ritmo de tiro",buy:"Comprar",owned:"Comprada",maxed:"Máxima",close:"Voltar às fases",upgradeCost:"Custo: {cost}",rewardCopy:"Fase {stage} concluída. +{credits} de energia. Compre poder em Melhorias.",stageFinalGoal:"Você concluiu as 30 fases. Use sua energia para aperfeiçoar a nave.",stageFailGoal:"Jogue a fase {stage} novamente. Acertos e vitórias rendem energia para melhorias.",ruleScout:"Patrulha",ruleVolley:"Rajada",ruleArmor:"Capitães blindados",ruleRelay:"Formação de revezamento",ruleCrossfire:"Fogo cruzado",ruleCore:"Núcleo de sinal",stageGoal:"Fase {stage}: {rule}. Elimine esta onda.",stageWinGoal:"Fase {stage} concluída. +{credits} de energia. O poder fica em {shots} até comprar uma melhoria."},
    fr:{stageProgress:"{unlocked} / 30 déverrouillés",stagePower:"Puissance {shots}",credits:"Énergie",upgrades:"Améliorations",upgradeTitle:"Améliorations du hangar",upgradeCopy:"Dépense l'énergie gagnée en Battle. Les améliorations restent entre les niveaux.",upgradeFirepower:"Puissance répartie",upgradeShield:"Réserve de bouclier",upgradeHull:"Intégrité de la coque",upgradeRapid:"Cadence de tir",buy:"Acheter",owned:"Possédée",maxed:"Max",close:"Retour aux niveaux",upgradeCost:"Coût : {cost}",rewardCopy:"Niveau {stage} terminé. +{credits} énergie. Achète de la puissance dans Améliorations.",stageFinalGoal:"Les 30 niveaux sont terminés. Utilise ton énergie pour perfectionner le vaisseau.",stageFailGoal:"Rejoue le niveau {stage}. Les tirs réussis et les victoires rapportent de l'énergie.",ruleScout:"Patrouille",ruleVolley:"Salve",ruleArmor:"Capitaines blindés",ruleRelay:"Formation relais",ruleCrossfire:"Tirs croisés",ruleCore:"Noyau du signal",stageGoal:"Niveau {stage} : {rule}. Élimine cette vague.",stageWinGoal:"Niveau {stage} terminé. +{credits} énergie. La puissance reste à {shots} jusqu'à l'achat d'une amélioration."},
    de:{stageProgress:"{unlocked} / 30 freigeschaltet",stagePower:"Feuerkraft {shots}",credits:"Energie",upgrades:"Verbesserungen",upgradeTitle:"Hangar-Verbesserungen",upgradeCopy:"Gib die im Battle verdiente Energie aus. Verbesserungen bleiben zwischen den Stufen erhalten.",upgradeFirepower:"Streu-Feuerkraft",upgradeShield:"Schildreserve",upgradeHull:"Rumpfintegrität",upgradeRapid:"Feuerrhythmus",buy:"Kaufen",owned:"Besitzt",maxed:"Maximal",close:"Zurück zu den Stufen",upgradeCost:"Kosten: {cost}",rewardCopy:"Stufe {stage} geschafft. +{credits} Energie. Kaufe Feuerkraft bei Verbesserungen.",stageFinalGoal:"Alle 30 Stufen geschafft. Nutze Energie für den perfekten Bau.",stageFailGoal:"Spiele Stufe {stage} erneut. Treffer und Siege bringen Energie für Verbesserungen.",ruleScout:"Patrouille",ruleVolley:"Salve",ruleArmor:"Gepanzerte Kapitäne",ruleRelay:"Relaisformation",ruleCrossfire:"Kreuzfeuer",ruleCore:"Signalkern",stageGoal:"Stufe {stage}: {rule}. Zerstöre diese Welle.",stageWinGoal:"Stufe {stage} geschafft. +{credits} Energie. Die Feuerkraft bleibt bei {shots}, bis du kaufst."},
    it:{stageProgress:"{unlocked} / 30 sbloccati",stagePower:"Potenza {shots}",credits:"Energia",upgrades:"Potenziamenti",upgradeTitle:"Potenziamenti dell'hangar",upgradeCopy:"Spendi l'energia ottenuta in Battaglia. I potenziamenti restano tra i livelli.",upgradeFirepower:"Potenza dispersa",upgradeShield:"Riserva scudo",upgradeHull:"Integrità dello scafo",upgradeRapid:"Ritmo di fuoco",buy:"Acquista",owned:"Posseduto",maxed:"Massimo",close:"Torna ai livelli",upgradeCost:"Costo: {cost}",rewardCopy:"Livello {stage} completato. +{credits} energia. Acquista potenza nei Potenziamenti.",stageFinalGoal:"Tutti e 30 i livelli sono completati. Usa l'energia per perfezionare la nave.",stageFailGoal:"Rigioca il livello {stage}. Colpi e vittorie danno energia per i potenziamenti.",ruleScout:"Pattuglia",ruleVolley:"Raffica",ruleArmor:"Capitani corazzati",ruleRelay:"Formazione staffetta",ruleCrossfire:"Fuoco incrociato",ruleCore:"Nucleo del segnale",stageGoal:"Livello {stage}: {rule}. Elimina questa ondata.",stageWinGoal:"Livello {stage} completato. +{credits} energia. La potenza resta a {shots} finché non acquisti."},
    ru:{stageProgress:"Открыто: {unlocked} / 30",stagePower:"Мощь {shots}",credits:"Энергия",upgrades:"Усиления",upgradeTitle:"Усиления ангара",upgradeCopy:"Тратьте энергию, заработанную в бою. Усиления сохраняются между этапами.",upgradeFirepower:"Рассеянная мощь",upgradeShield:"Запас щита",upgradeHull:"Прочность корпуса",upgradeRapid:"Ритм стрельбы",buy:"Купить",owned:"Куплено",maxed:"Максимум",close:"К этапам",upgradeCost:"Цена: {cost}",rewardCopy:"Этап {stage} пройден. +{credits} энергии. Купите мощь в Усилениях.",stageFinalGoal:"Все 30 этапов пройдены. Используйте энергию для идеальной сборки.",stageFailGoal:"Повторите этап {stage}. Попадания и победы дают энергию для усилений.",ruleScout:"Патруль",ruleVolley:"Залп",ruleArmor:"Бронированные капитаны",ruleRelay:"Релейный строй",ruleCrossfire:"Перекрёстный огонь",ruleCore:"Сигнальное ядро",stageGoal:"Этап {stage}: {rule}. Уничтожьте эту волну.",stageWinGoal:"Этап {stage} пройден. +{credits} энергии. Мощь останется {shots}, пока вы не купите усиление."},
    hi:{stageProgress:"{unlocked} / 30 अनलॉक",stagePower:"फायरपावर {shots}",credits:"ऊर्जा",upgrades:"अपग्रेड",upgradeTitle:"हैंगर अपग्रेड",upgradeCopy:"बैटल में मिली ऊर्जा खर्च करें। अपग्रेड अगले स्टेज में भी बने रहते हैं।",upgradeFirepower:"स्प्रेड फायरपावर",upgradeShield:"शील्ड रिज़र्व",upgradeHull:"हुल मजबूती",upgradeRapid:"फायर रिदम",buy:"खरीदें",owned:"मौजूद",maxed:"अधिकतम",close:"स्टेज पर लौटें",upgradeCost:"लागत: {cost}",rewardCopy:"स्टेज {stage} पूरा। +{credits} ऊर्जा। अपग्रेड में फायरपावर खरीदें।",stageFinalGoal:"सभी 30 स्टेज पूरे। ऊर्जा से अपना जहाज़ बेहतर बनाएँ।",stageFailGoal:"स्टेज {stage} फिर खेलें। हिट और जीत अपग्रेड ऊर्जा देती हैं।",ruleScout:"गश्ती",ruleVolley:"वॉली",ruleArmor:"बख्तरबंद कप्तान",ruleRelay:"रिले गठन",ruleCrossfire:"क्रॉसफायर",ruleCore:"सिग्नल कोर",stageGoal:"स्टेज {stage}: {rule}। इस लहर को साफ़ करें।",stageWinGoal:"स्टेज {stage} पूरा। +{credits} ऊर्जा। खरीद तक फायरपावर {shots} रहेगी।"},
    ar:{stageProgress:"تم فتح {unlocked} / 30",stagePower:"القوة {shots}",credits:"طاقة",upgrades:"الترقيات",upgradeTitle:"ترقيات الحظيرة",upgradeCopy:"أنفق الطاقة التي تكسبها في المعركة. تبقى الترقيات بين المراحل.",upgradeFirepower:"قوة نيران متشعبة",upgradeShield:"احتياطي الدرع",upgradeHull:"متانة الهيكل",upgradeRapid:"إيقاع الإطلاق",buy:"شراء",owned:"مملوكة",maxed:"الحد الأقصى",close:"العودة إلى المراحل",upgradeCost:"التكلفة: {cost}",rewardCopy:"اكتملت المرحلة {stage}. +{credits} طاقة. اشتر القوة من الترقيات.",stageFinalGoal:"اكتملت المراحل الثلاثون. استخدم الطاقة لبناء أفضل تجهيز.",stageFailGoal:"أعد المرحلة {stage}. تمنحك الإصابات والانتصارات طاقة للترقيات.",ruleScout:"دورية",ruleVolley:"وابل",ruleArmor:"قادة مدرعون",ruleRelay:"تشكيل تناوبي",ruleCrossfire:"نيران متقاطعة",ruleCore:"نواة الإشارة",stageGoal:"المرحلة {stage}: {rule}. أزل هذه الموجة.",stageWinGoal:"اكتملت المرحلة {stage}. +{credits} طاقة. تبقى القوة {shots} حتى تشتري ترقية."}
  };
  Object.entries(V44_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V45_COPY_PATCH={
    en:{guideTitle:"Move, fire, and clear one Stage at a time.",guideIntro:"Defend the signal station across 30 authored Stages. Each Stage is one Battle formation; credits buy firepower and survival upgrades.",growthTitle:"Chapter rules",growth:"30 Stages are grouped into six chapters of five: patrol, volleys, armored captains, relay formation, crossfire, then the signal-core finale.",winCopy:"Stage cleared. Credits are ready for upgrades."},
    "zh-Hant":{guideTitle:"移動、射擊，一關一關清除編隊。",guideIntro:"守護訊號站，迎戰 30 個原創關卡。每關就是一場戰鬥；能源點可購買火力與生存強化。",growthTitle:"六章規則",growth:"30 關分成六章、每章五關：巡邏、齊射、裝甲隊長、接力隊形、交叉火網，最後是訊號核心。",winCopy:"關卡完成，能源點可用來購買強化。"},
    "zh-Hans":{guideTitle:"移动、射击，一关一关清除编队。",guideIntro:"守护信号站，迎战 30 个原创关卡。每关就是一场战斗；能源点可购买火力与生存强化。",growthTitle:"六章规则",growth:"30 关分成六章、每章五关：巡逻、齐射、装甲队长、接力编队、交叉火网，最后是信号核心。",winCopy:"关卡完成，能源点可用于购买强化。"},
    ja:{guideTitle:"動いて撃ち、1ステージずつ編隊を倒そう。",guideIntro:"信号ステーションを30のオリジナルステージで守ります。1ステージは1バトル編隊で、エネルギーで火力と生存強化を購入できます。",growthTitle:"チャプターのルール",growth:"30ステージは5つずつの6チャプター。巡回、一斉射撃、装甲キャプテン、リレー、クロスファイア、信号コアの順に変化します。",winCopy:"ステージクリア。エネルギーで強化を購入できます。"},
    ko:{guideTitle:"움직이고 쏘며 한 스테이지씩 편대를 처치하세요.",guideIntro:"30개의 오리지널 스테이지에서 신호 기지를 지키세요. 한 스테이지는 한 번의 전투 편대이며 에너지로 화력과 생존 강화를 구매합니다.",growthTitle:"챕터 규칙",growth:"30개 스테이지는 5개씩 여섯 챕터로 나뉩니다. 순찰, 집중 사격, 장갑 대장, 릴레이 대형, 교차 사격, 신호 코어 순으로 변합니다.",winCopy:"스테이지 클리어. 에너지로 강화를 구매할 수 있습니다."},
    es:{guideTitle:"Muévete, dispara y supera una fase cada vez.",guideIntro:"Defiende la estación en 30 fases originales. Cada fase es una formación de Battle; la energía compra potencia y mejoras de supervivencia.",growthTitle:"Reglas por capítulo",growth:"Las 30 fases se agrupan en seis capítulos de cinco: patrulla, salvas, capitanes blindados, relevo, fuego cruzado y núcleo de señal.",winCopy:"Fase superada. La energía está lista para comprar mejoras."},
    "pt-BR":{guideTitle:"Mova, atire e conclua uma fase por vez.",guideIntro:"Defenda a estação em 30 fases originais. Cada fase é uma formação de Batalha; a energia compra poder de fogo e melhorias de sobrevivência.",growthTitle:"Regras por capítulo",growth:"As 30 fases formam seis capítulos de cinco: patrulha, rajadas, capitães blindados, revezamento, fogo cruzado e núcleo de sinal.",winCopy:"Fase concluída. A energia está pronta para comprar melhorias."},
    fr:{guideTitle:"Bouge, tire et termine un niveau à la fois.",guideIntro:"Défends la station dans 30 niveaux originaux. Chaque niveau est une formation de Battle ; l'énergie achète puissance et améliorations de survie.",growthTitle:"Règles par chapitre",growth:"Les 30 niveaux forment six chapitres de cinq : patrouille, salves, capitaines blindés, relais, tirs croisés, puis noyau du signal.",winCopy:"Niveau terminé. L'énergie peut servir aux améliorations."},
    de:{guideTitle:"Bewege dich, schieße und schaffe eine Stufe nach der anderen.",guideIntro:"Verteidige die Station in 30 originalen Stufen. Jede Stufe ist eine Battle-Formation; Energie kauft Feuerkraft und Überlebensverbesserungen.",growthTitle:"Kapitelregeln",growth:"Die 30 Stufen sind in sechs Kapitel zu je fünf geteilt: Patrouille, Salven, gepanzerte Kapitäne, Relais, Kreuzfeuer und Signalkern.",winCopy:"Stufe geschafft. Energie kann für Verbesserungen ausgegeben werden."},
    it:{guideTitle:"Muoviti, spara e completa un livello alla volta.",guideIntro:"Difendi la stazione in 30 livelli originali. Ogni livello è una formazione di Battaglia; l'energia acquista potenza e miglioramenti di sopravvivenza.",growthTitle:"Regole dei capitoli",growth:"I 30 livelli sono divisi in sei capitoli da cinque: pattuglia, raffiche, capitani corazzati, staffetta, fuoco incrociato e nucleo del segnale.",winCopy:"Livello completato. L'energia è pronta per i potenziamenti."},
    ru:{guideTitle:"Двигайтесь, стреляйте и проходите этап за этапом.",guideIntro:"Защищайте станцию в 30 оригинальных этапах. Каждый этап — один боевой строй; энергия покупает мощь и усиления выживания.",growthTitle:"Правила глав",growth:"30 этапов разделены на шесть глав по пять: патруль, залпы, бронированные капитаны, релейный строй, перекрёстный огонь и сигнальное ядро.",winCopy:"Этап пройден. Энергию можно потратить на усиления."},
    hi:{guideTitle:"चलें, गोली चलाएँ और एक-एक स्टेज पूरा करें।",guideIntro:"30 मौलिक स्टेज में सिग्नल स्टेशन बचाएँ। हर स्टेज एक Battle गठन है; ऊर्जा से फायरपावर और सर्वाइवल अपग्रेड खरीदें।",growthTitle:"अध्याय के नियम",growth:"30 स्टेज पाँच-पाँच के छह अध्यायों में हैं: गश्ती, वॉली, बख्तरबंद कप्तान, रिले, क्रॉसफायर और सिग्नल कोर।",winCopy:"स्टेज पूरा। ऊर्जा से अपग्रेड खरीदा जा सकता है।"},
    ar:{guideTitle:"تحرك وأطلق النار وأكمل مرحلة واحدة كل مرة.",guideIntro:"احمِ المحطة عبر 30 مرحلة أصلية. كل مرحلة تشكيل قتالي واحد؛ تشتري الطاقة القوة النارية وترقيات البقاء.",growthTitle:"قواعد الفصول",growth:"تنقسم المراحل الثلاثون إلى ستة فصول من خمس مراحل: دورية، وابل، قادة مدرعون، تشكيل تناوبي، نيران متقاطعة، ثم نواة الإشارة.",winCopy:"اكتملت المرحلة. يمكنك إنفاق الطاقة على الترقيات."}
  };
  Object.entries(V45_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V46_STAGE_COPY_PATCH={
    en:{ready:"Read the Stage rule.",waveHint:"Watch the formation.",stageGoal:"Stage {stage}: {rule}. Clear this one formation.",stageWinGoal:"Stage {stage} clear. Earned +{credits} Credits; buy upgrades before the next Stage.",stageFinalGoal:"All 30 Stages clear. Use Credits to build your strongest loadout.",leaveCopy:"Your current Stage and score will be lost if you return to the Stage list.",firepowerUpgrade:"Stage {stage}: firepower is {shots} shots per Fire."},
    "zh-Hant":{ready:"先讀懂關卡規則。",waveHint:"觀察敵方編隊。",stageGoal:"第 {stage} 關：{rule}。清除這一個編隊。",stageWinGoal:"第 {stage} 關完成，獲得 +{credits} 能源點；下一關前可到強化頁購買能力。",stageFinalGoal:"30 個關卡全部完成。用能源點打造最強配置。",leaveCopy:"回到關卡列表會失去目前關卡與分數。",firepowerUpgrade:"第 {stage} 關：目前每次射擊 {shots} 發。"},
    "zh-Hans":{ready:"先读懂关卡规则。",waveHint:"观察敌方编队。",stageGoal:"第 {stage} 关：{rule}。清除这一个编队。",stageWinGoal:"第 {stage} 关完成，获得 +{credits} 能源点；下一关前可到强化页购买能力。",stageFinalGoal:"30 个关卡全部完成。用能源点打造最强配置。",leaveCopy:"回到关卡列表会失去当前关卡和分数。",firepowerUpgrade:"第 {stage} 关：当前每次射击 {shots} 发。"},
    ja:{ready:"ステージのルールを読もう。",waveHint:"編隊を見よう。",stageGoal:"ステージ{stage}：{rule}。この1編隊を倒そう。",stageWinGoal:"ステージ{stage}クリア。エネルギー+{credits}。次のステージ前に強化を購入できます。",stageFinalGoal:"30ステージすべてクリア。エネルギーで最強の装備を作ろう。",leaveCopy:"ステージ一覧へ戻ると現在のステージとスコアを失います。",firepowerUpgrade:"ステージ{stage}：現在は1回{shots}発。"},
    ko:{ready:"스테이지 규칙을 읽으세요.",waveHint:"대형을 살피세요.",stageGoal:"스테이지 {stage}: {rule}. 이 한 편대를 처치하세요.",stageWinGoal:"스테이지 {stage} 클리어. 에너지 +{credits} 획득; 다음 스테이지 전에 강화하세요.",stageFinalGoal:"30개 스테이지를 모두 클리어했습니다. 에너지로 최강의 장비를 만드세요.",leaveCopy:"스테이지 목록으로 돌아가면 현재 스테이지와 점수를 잃습니다.",firepowerUpgrade:"스테이지 {stage}: 현재 한 번에 {shots}발을 발사합니다."},
    es:{ready:"Lee la regla de la fase.",waveHint:"Observa la formación.",stageGoal:"Fase {stage}: {rule}. Elimina esta formación.",stageWinGoal:"Fase {stage} superada. +{credits} de energía; compra mejoras antes de la siguiente fase.",stageFinalGoal:"Has superado las 30 fases. Usa la energía para crear tu mejor configuración.",leaveCopy:"Perderás la fase y la puntuación actuales si vuelves a la lista de fases.",firepowerUpgrade:"Fase {stage}: potencia actual de {shots} disparos por lanzamiento."},
    "pt-BR":{ready:"Leia a regra da fase.",waveHint:"Observe a formação.",stageGoal:"Fase {stage}: {rule}. Elimine esta formação.",stageWinGoal:"Fase {stage} concluída. +{credits} de energia; compre melhorias antes da próxima fase.",stageFinalGoal:"Você concluiu as 30 fases. Use a energia para montar seu melhor equipamento.",leaveCopy:"A fase e a pontuação atuais serão perdidas se você voltar à lista de fases.",firepowerUpgrade:"Fase {stage}: poder atual de {shots} disparos por tiro."},
    fr:{ready:"Lis la règle du niveau.",waveHint:"Observe la formation.",stageGoal:"Niveau {stage} : {rule}. Élimine cette formation.",stageWinGoal:"Niveau {stage} terminé. +{credits} énergie; achète des améliorations avant le suivant.",stageFinalGoal:"Les 30 niveaux sont terminés. Utilise l'énergie pour créer ton meilleur équipement.",leaveCopy:"Ton niveau et ton score actuels seront perdus si tu retournes à la liste des niveaux.",firepowerUpgrade:"Niveau {stage} : puissance actuelle de {shots} tirs par salve."},
    de:{ready:"Lies die Stufenregel.",waveHint:"Beobachte die Formation.",stageGoal:"Stufe {stage}: {rule}. Zerstöre diese Formation.",stageWinGoal:"Stufe {stage} geschafft. +{credits} Energie; kaufe vor der nächsten Stufe Upgrades.",stageFinalGoal:"Alle 30 Stufen geschafft. Nutze Energie für dein stärkstes Setup.",leaveCopy:"Deine aktuelle Stufe und Punktzahl gehen verloren, wenn du zur Stufenliste zurückkehrst.",firepowerUpgrade:"Stufe {stage}: aktuelle Feuerkraft {shots} Schüsse pro Feuer."},
    it:{ready:"Leggi la regola del livello.",waveHint:"Osserva la formazione.",stageGoal:"Livello {stage}: {rule}. Elimina questa formazione.",stageWinGoal:"Livello {stage} completato. +{credits} energia; acquista potenziamenti prima del prossimo.",stageFinalGoal:"Tutti e 30 i livelli sono completati. Usa l'energia per creare il tuo assetto migliore.",leaveCopy:"Il livello e il punteggio attuali andranno persi tornando alla lista dei livelli.",firepowerUpgrade:"Livello {stage}: potenza attuale di {shots} colpi per sparo."},
    ru:{ready:"Прочитайте правило этапа.",waveHint:"Следите за строем.",stageGoal:"Этап {stage}: {rule}. Уничтожьте этот строй.",stageWinGoal:"Этап {stage} пройден. +{credits} энергии; перед следующим этапом купите усиления.",stageFinalGoal:"Все 30 этапов пройдены. Используйте энергию для лучшей сборки.",leaveCopy:"При возврате к списку этапов текущий этап и счёт будут потеряны.",firepowerUpgrade:"Этап {stage}: текущая мощь — {shots} выстр. за запуск."},
    hi:{ready:"स्टेज का नियम पढ़ें।",waveHint:"गठन पर नज़र रखें।",stageGoal:"स्टेज {stage}: {rule}। इस गठन को साफ़ करें।",stageWinGoal:"स्टेज {stage} पूरा। +{credits} ऊर्जा; अगले स्टेज से पहले अपग्रेड खरीदें।",stageFinalGoal:"सभी 30 स्टेज पूरे। ऊर्जा से अपना सबसे मजबूत सेटअप बनाएँ।",leaveCopy:"स्टेज सूची पर लौटने पर मौजूदा स्टेज और स्कोर खो जाएगा।",firepowerUpgrade:"स्टेज {stage}: मौजूदा फायरपावर हर फायर में {shots} गोलियाँ।"},
    ar:{ready:"اقرأ قاعدة المرحلة.",waveHint:"راقب التشكيل.",stageGoal:"المرحلة {stage}: {rule}. أزل هذا التشكيل.",stageWinGoal:"اكتملت المرحلة {stage}. +{credits} طاقة؛ اشترِ الترقيات قبل المرحلة التالية.",stageFinalGoal:"اكتملت المراحل الثلاثون. استخدم الطاقة لبناء أفضل تجهيز.",leaveCopy:"ستفقد المرحلة والنتيجة الحاليتين عند العودة إلى قائمة المراحل.",firepowerUpgrade:"المرحلة {stage}: القوة الحالية {shots} طلقات في كل إطلاق."}
  };
  Object.entries(V46_STAGE_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V47_STAGE_NAV_COPY={
    en:{stageBrowse:"Drag to browse all 30 Stages."},
    "zh-Hant":{stageBrowse:"左右拖曳瀏覽全部 30 關。"},
    "zh-Hans":{stageBrowse:"左右拖曳浏览全部 30 关。"},
    ja:{stageBrowse:"左右にスワイプして30ステージを見られます。"},
    ko:{stageBrowse:"좌우로 스와이프해 30개 스테이지를 살펴보세요."},
    es:{stageBrowse:"Arrastra para explorar las 30 fases."},
    "pt-BR":{stageBrowse:"Arraste para explorar as 30 fases."},
    fr:{stageBrowse:"Fais glisser pour parcourir les 30 niveaux."},
    de:{stageBrowse:"Ziehe, um alle 30 Stufen zu durchstöbern."},
    it:{stageBrowse:"Trascina per esplorare tutti e 30 i livelli."},
    ru:{stageBrowse:"Перетаскивайте, чтобы просмотреть все 30 этапов."},
    hi:{stageBrowse:"सभी 30 स्टेज देखने के लिए क्षैतिज स्वाइप करें।"},
    ar:{stageBrowse:"اسحب أفقياً لتصفح المراحل الثلاثين."}
  };
  Object.entries(V47_STAGE_NAV_COPY).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V47_RETURN_COPY_PATCH={
    en:{backToStages:"Back to stages"},
    "zh-Hant":{backToStages:"回到關卡"},
    "zh-Hans":{backToStages:"返回关卡"},
    ja:{backToStages:"ステージ一覧へ戻る"},
    ko:{backToStages:"스테이지로 돌아가기"},
    es:{backToStages:"Volver a fases"},
    "pt-BR":{backToStages:"Voltar às fases"},
    fr:{backToStages:"Retour aux niveaux"},
    de:{backToStages:"Zurück zu den Stufen"},
    it:{backToStages:"Torna ai livelli"},
    ru:{backToStages:"К этапам"},
    hi:{backToStages:"स्टेज पर लौटें"},
    ar:{backToStages:"العودة إلى المراحل"}
  };
  Object.entries(V47_RETURN_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const V42_RESULT_COPY_PATCH={
    en:{stageResultWin:"Stage {stage} cleared.",stageResultFail:"Stage {stage} needs another run."},"zh-Hant":{stageResultWin:"第 {stage} 關已清除。",stageResultFail:"第 {stage} 關需要再挑戰一次。"},"zh-Hans":{stageResultWin:"第 {stage} 关已清除。",stageResultFail:"第 {stage} 关需要再挑战一次。"},ja:{stageResultWin:"ステージ{stage}をクリアしました。",stageResultFail:"ステージ{stage}をもう一度挑戦しましょう。"},ko:{stageResultWin:"스테이지 {stage} 클리어.",stageResultFail:"스테이지 {stage}를 다시 도전하세요."},es:{stageResultWin:"Fase {stage} superada.",stageResultFail:"La fase {stage} necesita otro intento."},"pt-BR":{stageResultWin:"Fase {stage} concluída.",stageResultFail:"A fase {stage} precisa de outra tentativa."},fr:{stageResultWin:"Niveau {stage} terminé.",stageResultFail:"Le niveau {stage} demande un nouvel essai."},de:{stageResultWin:"Stufe {stage} geschafft.",stageResultFail:"Stufe {stage} braucht einen weiteren Versuch."},it:{stageResultWin:"Livello {stage} completato.",stageResultFail:"Il livello {stage} richiede un altro tentativo."},ru:{stageResultWin:"Этап {stage} пройден.",stageResultFail:"Этап {stage} нужно пройти ещё раз."},hi:{stageResultWin:"स्टेज {stage} पूरा।",stageResultFail:"स्टेज {stage} फिर से खेलें।"},ar:{stageResultWin:"اكتملت المرحلة {stage}.",stageResultFail:"تحتاج المرحلة {stage} إلى محاولة أخرى."}
  };
  Object.entries(V42_RESULT_COPY_PATCH).forEach(([key,patch])=>Object.assign(COPY[key],patch));
  const TOTAL_STAGES=30,TOTAL_WAVES=TOTAL_STAGES,MAX_FIREPOWER=10;
  const persistedUnlockedStage=Math.max(1,Math.min(TOTAL_STAGES,Number(localStorage.getItem("wp-alien-defender-unlocked-stage")||1)||1));
  const persistedFirepower=Math.max(1,Math.min(MAX_FIREPOWER,Number(localStorage.getItem("wp-alien-defender-firepower")||1)||1));
  const persistedCredits=Math.max(0,Math.floor(Number(localStorage.getItem("wp-alien-defender-credits")||0)||0));
  const persistedShieldLevel=Math.max(0,Math.min(5,Math.floor(Number(localStorage.getItem("wp-alien-defender-upgrade-shield")||0)||0)));
  const persistedHullLevel=Math.max(0,Math.min(3,Math.floor(Number(localStorage.getItem("wp-alien-defender-upgrade-hull")||0)||0)));
  const persistedRapidLevel=Math.max(0,Math.min(4,Math.floor(Number(localStorage.getItem("wp-alien-defender-upgrade-rapid")||0)||0)));
  const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d"),$=id=>document.getElementById(id);let locale=document.documentElement.lang||"en";if(!COPY[locale])locale="en";let copy=COPY[locale],screen="main",wave=1,score=0,best=Number(localStorage.getItem("wp-alien-defender-best")||0),raf=0,last=0,world=null,audio=null,sound=true,keys={left:false,right:false,fire:false},gesture=null,stageMode=true,selectedStage=persistedUnlockedStage-1,unlockedStage=persistedUnlockedStage,firepowerLevel=persistedFirepower,credits=persistedCredits,shieldLevel=persistedShieldLevel,hullLevel=persistedHullLevel,rapidLevel=persistedRapidLevel,stageResultAwarded=false,lastStageReward=0;
  // v44 screen ownership: Result is a Battle substate, not a fourth scene.
  // Keep the existing Result markup and move it into the live Battle envelope
  // so the shared shell, Canvas, and reserve remain one stable geometry.
  const v44BattleStage=$("battleScreen")?.querySelector(".battle-stage"),v44ResultScreen=$("resultScreen");
  if(v44BattleStage&&v44ResultScreen&&v44ResultScreen.parentElement!==v44BattleStage)v44BattleStage.append(v44ResultScreen);
  show=function showV44Scene(name){
    screen=name;document.body.dataset.screen=name;
    const resultOpen=name==="result",battleOpen=name==="battle"||resultOpen;
    $("mainScreen").hidden=name!=="main";$("stageScreen").hidden=name!=="stage";$("battleScreen").hidden=!battleOpen;
    if(v44ResultScreen)v44ResultScreen.hidden=!resultOpen;
    if(v44BattleStage)v44BattleStage.dataset.resultOpen=String(resultOpen);
    const localePicker=$("localeSelect")?.closest(".locale-picker");if(localePicker)localePicker.hidden=name!=="main";
    $("battleBackBtn").dataset.wpReturn=battleOpen?"stage":"main";
    pinViewportTop(name==="stage"||battleOpen);window.dispatchEvent(new Event("weightplay:shell-sync"));
  };
  ["mainScreen","stageScreen","battleScreen","resultScreen"].forEach(id=>$(id)?.setAttribute("data-screen",id.replace("Screen","").toLowerCase()));
  function t(k){return copy[k]??COPY.en[k]??k}function setText(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";copy=COPY[locale]||COPY.en;document.title=`${t("title")} | WeightPlay`;document.querySelectorAll("[data-copy]").forEach(n=>n.textContent=t(n.dataset.copy));document.querySelectorAll("[data-copy-aria]").forEach(n=>n.setAttribute("aria-label",t(n.dataset.copyAria)));canvas.setAttribute("aria-label",t("canvasLabel"));$("localeSelect").value=locale;$("soundBtn").setAttribute("aria-label",t(sound?"soundOn":"soundOff"));$("soundBtn").textContent=sound?"◒":"◌";}
  const SWIPE_GUIDE={en:"Swipe horizontally to steer.","zh-Hant":"也可左右滑動控制。","zh-Hans":"也可以左右滑动控制。",ja:"左右にスワイプして操縦できます。",ko:"좌우로 스와이프해 조종할 수 있습니다.",es:"También puedes deslizarte horizontalmente para dirigir.","pt-BR":"Você também pode deslizar horizontalmente para pilotar.",fr:"Glissez aussi horizontalement pour piloter.",de:"Wische auch horizontal zum Steuern.",it:"Puoi anche scorrere orizzontalmente per guidare.",ru:"Можно также вести корабль горизонтальным свайпом.",hi:"दिशा बदलने के लिए क्षैतिज स्वाइप भी करें।",ar:"يمكنك أيضاً السحب أفقياً للتوجيه."};
  Object.entries(SWIPE_GUIDE).forEach(([key,suffix])=>{if(COPY[key])COPY[key].how2=`${COPY[key].how2} ${suffix}`});
  let pinFrame=0;
  function pinViewportTop(active){const root=document.documentElement,body=document.body;root.classList.toggle("wp-active-play",active);root.style.overflow=active?"hidden":"auto";root.style.overscrollBehavior=active?"none":"contain";root.style.touchAction=active?"none":"";body.style.position=active?"fixed":"";body.style.inset=active?"0":"";body.style.width=active?"100%":"";body.style.overflow=active?"hidden":"auto";body.style.overscrollBehavior=active?"none":"contain";body.style.touchAction=active?"none":"pan-y";root.scrollTop=0;body.scrollTop=0;window.scrollTo({left:0,top:0,behavior:"instant"});cancelAnimationFrame(pinFrame);if(active)pinFrame=requestAnimationFrame(()=>{root.scrollTop=0;body.scrollTop=0;window.scrollTo({left:0,top:0,behavior:"instant"});pinFrame=requestAnimationFrame(()=>{root.scrollTop=0;body.scrollTop=0;window.scrollTo({left:0,top:0,behavior:"instant"})})});else pinFrame=requestAnimationFrame(()=>window.scrollTo({left:0,top:0,behavior:"instant"}))}
  function show(name){screen=name;document.body.dataset.screen=name;["mainScreen","stageScreen","battleScreen","resultScreen"].forEach(id=>$(id).hidden=id!==`${name}Screen`);$("localeSelect").closest(".locale-picker").hidden=name!=="main";$("battleBackBtn").dataset.wpReturn=name==="battle"?"stage":"main";pinViewportTop(name==="stage"||name==="battle"||name==="result");window.dispatchEvent(new Event("weightplay:shell-sync"));}
  function beep(freq=440,duration=.06){if(!sound||window.WonderSound?.isMuted?.())return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;o.type="square";g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
  function makeWorld(){const enemies=[];const cols=wave===1?7:wave===2?8:9,rows=wave===3?4:3;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)enemies.push({x:150+x*78,y:145+y*52,waveType:wave===3&&y===0?"captain":"scout",alive:true});return{enemies,dir:1,moveTimer:0,moveEvery:wave===1?.68:wave===2?.5:.37,bullets:[],enemyBullets:[],player:{x:460,y:0},lives:3,combo:1,shield:0,fireTimer:0,enemyFire:0,fireIndex:0,flash:0}}
  function start(stageIndex=selectedStage){cancelAnimationFrame(raf);selectedStage=Math.max(0,Math.min(TOTAL_WAVES-1,Number(stageIndex)||0));wave=selectedStage+1;score=0;stageResultAwarded=false;stageMode=true;world=makeWorld();$("resultGoal").textContent="";show("battle");updateHud();$("battleMessage").textContent=t("stageGoal").replace(/\{stage\}/g,String(wave));canvas.focus({preventScroll:true});last=performance.now();raf=requestAnimationFrame(loop);beep(560,.1)}
  function updateHud(){$("waveValue").textContent=`${t("stage")} ${selectedStage+1} / ${TOTAL_WAVES}`;$(`scoreValue`).textContent=score;$(`bestValue`).textContent=best;$(`firepowerValue`).textContent=firepowerLevel;$(`livesValue`).textContent=world?.lives||3}
  function shoot(){if(screen!=="battle"||!world||world.fireTimer>0)return;world.bullets.push({x:world.player.x,y:625,s:-640});world.fireTimer=.22;beep(760,.035)}
  function update(dt){if(!world)return;const p=world.player;p.x+=((keys.right?1:0)-(keys.left?1:0))*420*dt;p.x=Math.max(45,Math.min(875,p.x));world.fireTimer=Math.max(0,world.fireTimer-dt);if(keys.fire)shoot();world.flash=Math.max(0,world.flash-dt);world.shield=Math.max(0,world.shield-dt);world.moveTimer+=dt;world.enemyFire+=dt;if(world.moveTimer>world.moveEvery){world.moveTimer=0;const active=world.enemies.filter(e=>e.alive);const min=Math.min(...active.map(e=>e.x)),max=Math.max(...active.map(e=>e.x));if(max>855&&world.dir>0||min<65&&world.dir<0){world.dir*=-1;active.forEach(e=>e.y+=18)}active.forEach(e=>e.x+=world.dir*18)}if(world.enemyFire>(wave===1?.92:wave===2?.72:.56)){world.enemyFire=0;const active=world.enemies.filter(e=>e.alive);if(active.length){const e=active[Math.floor(Math.random()*active.length)];world.enemyBullets.push({x:e.x,y:e.y+20,s:wave===3?300:240})}}for(const b of world.bullets)b.y+=b.s*dt;for(const b of world.enemyBullets)b.y+=b.s*dt;world.bullets=world.bullets.filter(b=>b.y>-20);world.enemyBullets=world.enemyBullets.filter(b=>b.y<760);for(const b of world.bullets){const e=world.enemies.find(x=>x.alive&&Math.abs(x.x-b.x)<27&&Math.abs(x.y-b.y)<24);if(e){e.alive=false;b.y=-100;world.combo=Math.min(9,world.combo+1);score+=e.waveType==="captain"?40:10*world.combo;beep(e.waveType==="captain"?940:620,.04);$("battleMessage").textContent=t("hit")}}for(const b of world.enemyBullets){if(Math.abs(b.x-p.x)<24&&Math.abs(b.y-625)<28){b.y=800;if(world.shield>0){$("battleMessage").textContent=t("shield");beep(420,.06)}else{world.lives--;world.combo=1;world.flash=.35;beep(180,.13);if(world.lives<=0){finish(false);return}}}}const lowest=Math.max(...world.enemies.filter(e=>e.alive).map(e=>e.y),-99);if(lowest>570){finish(false);return}if(!world.enemies.some(e=>e.alive)){if(wave>=3){finish(true);return}wave++;score+=100;world=makeWorld();world.shield=3;$("battleMessage").textContent=t("shield");beep(980,.12)}updateHud()}
  function finish(win){cancelAnimationFrame(raf);if(score>best){best=score;localStorage.setItem("wp-alien-defender-best",best)}show("result");$("resultTitle").textContent=t(win?"winTitle":"loseTitle");$("resultCopy").textContent=t(win?"winCopy":"loseCopy");const goal=$("resultGoal");if(goal)goal.textContent=t(win?"replayWinGoal":wave>=TOTAL_WAVES?"replayFinalGoal":"replayGoal").replace(/\{wave\}/g,String(wave)).replace(/\{nextWave\}/g,String(Math.min(wave+1,TOTAL_WAVES)));$("resultScore").textContent=score;$("resultBest").textContent=best;const resultWave=$("resultWave");if(resultWave)resultWave.textContent=`${wave} / ${TOTAL_WAVES}`;beep(win?1000:130,.16)}
  function draw(){const W=920,H=720;ctx.clearRect(0,0,canvas.width,canvas.height);const scale=Math.min(canvas.clientWidth/W,canvas.clientHeight/H)||1,lw=canvas.clientWidth/scale,lh=canvas.clientHeight/scale;ctx.save();ctx.setTransform(scale,0,0,scale,0,0);ctx.translate((lw-W)/2,Math.max(0,(lh-H)/2));ctx.fillStyle="#080b20";ctx.fillRect(0,0,W,H);for(let i=0;i<55;i++){const x=(i*137)%W,y=(i*71)%H;ctx.fillStyle=i%5===0?"#ffd47caa":"#b99cff55";ctx.fillRect(x,y,i%5===0?2:1,i%5===0?2:1)}ctx.strokeStyle="#74e6ee44";ctx.setLineDash([10,12]);ctx.beginPath();ctx.moveTo(0,594);ctx.lineTo(W,594);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#ff879f66";ctx.fillRect(0,610,W,4);for(const e of world.enemies)if(e.alive){ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle=e.waveType==="captain"?"#ffd47c":"#b99cff";ctx.beginPath();ctx.moveTo(-27,-18);ctx.lineTo(27,-18);ctx.lineTo(20,13);ctx.lineTo(0,24);ctx.lineTo(-20,13);ctx.closePath();ctx.fill();ctx.fillStyle="#080b20";ctx.fillRect(-12,-4,7,7);ctx.fillRect(5,-4,7,7);ctx.strokeStyle=e.waveType==="captain"?"#74e6ee":"#ffffff55";ctx.stroke();ctx.restore()}for(const b of world.bullets){ctx.fillStyle="#74e6ee";ctx.fillRect(b.x-3,b.y-13,6,18)}for(const b of world.enemyBullets){ctx.fillStyle="#ff879f";ctx.beginPath();ctx.arc(b.x,b.y,6,0,Math.PI*2);ctx.fill()}const p=world.player;ctx.save();ctx.translate(p.x,625);ctx.fillStyle=world.flash>0?"#fff":"#74e6ee";ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(30,25);ctx.lineTo(0,16);ctx.lineTo(-30,25);ctx.closePath();ctx.fill();ctx.fillStyle="#ffd47c";ctx.beginPath();ctx.arc(0,-3,8,0,Math.PI*2);ctx.fill();if(world.shield>0){ctx.strokeStyle="#74e6eeaa";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,45,0,Math.PI*2);ctx.stroke()}ctx.restore();ctx.restore()}
  function loop(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(screen!=="battle")return;update(dt);draw();if(screen==="battle")raf=requestAnimationFrame(loop)}function resize(){if(screen!=="battle")return;const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));draw()}
  function setKey(key,value){if(key==="left")keys.left=value;if(key==="right")keys.right=value;if(key==="fire")keys.fire=value}
  const controlPointers=new Map();
  function syncControlButton(key){const active=[...controlPointers.values()].includes(key),button=$(key==="left"?"leftBtn":key==="right"?"rightBtn":"fireBtn");setKey(key,active);button?.classList.toggle("is-held",active);button?.setAttribute("aria-pressed",String(active))}
  function pressControl(event,key,button){if(screen!=="battle"||event.button>0)return;event.preventDefault();controlPointers.set(event.pointerId,key);try{button.setPointerCapture(event.pointerId)}catch{}syncControlButton(key);if(key==="fire")shoot()}
  function releaseControlPointer(event){const key=controlPointers.get(event.pointerId);if(!key)return;controlPointers.delete(event.pointerId);syncControlButton(key)}
  document.getElementById("startBtn").addEventListener("click",openStageSelector);document.getElementById("retryBtn").addEventListener("click",()=>start(selectedStage));document.getElementById("stageBackBtn")?.addEventListener("click",()=>{cancelAnimationFrame(raf);show("main")});document.getElementById("battleBackBtn").addEventListener("click",openLeaveDialog);document.getElementById("restartBtn").addEventListener("click",()=>start(selectedStage));document.getElementById("soundBtn").addEventListener("click",()=>{sound=!sound;setText();beep(520,.05)});[["leftBtn","left"],["rightBtn","right"],["fireBtn","fire"]].forEach(([id,key])=>{const button=$(id);button.addEventListener("pointerdown",event=>pressControl(event,key,button));button.addEventListener("pointerup",releaseControlPointer);button.addEventListener("pointercancel",releaseControlPointer);button.addEventListener("lostpointercapture",releaseControlPointer)});canvas.addEventListener("pointerdown",e=>{if(screen!=="battle")return;gesture={x:e.clientX};canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener("pointerup",e=>{if(!gesture)return;const dx=e.clientX-gesture.x;gesture=null;if(Math.abs(dx)<24)return;const key=dx>0?"right":"left";setKey(key,true);setTimeout(()=>setKey(key,false),160)});document.addEventListener("keydown",e=>{const k=e.key.toLowerCase();const map={arrowleft:"left",a:"left",arrowright:"right",d:"right"," ":"fire"};if(screen!=="battle"||!map[k])return;e.preventDefault();setKey(map[k],true);if(map[k]==="fire")shoot()});document.addEventListener("keyup",e=>{const k=e.key.toLowerCase();const map={arrowleft:"left",a:"left",arrowright:"right",d:"right"," ":"fire"};if(map[k])setKey(map[k],false)});document.getElementById("localeSelect").addEventListener("change",e=>{locale=e.target.value;try{localStorage.setItem("weightPlayLocale",locale)}catch{}setText()});window.addEventListener("resize",resize);setText();show("main");window.__alienDefenderSmoke={start,finish,snapshot:()=>({screen,wave,score,best,lives:world?.lives,enemies:world?.enemies?.filter(e=>e.alive).length})};
  // v4 Director repair: preserve the three-wave structure while giving the
  // first wave a clearer learning window and immediate observation feedback.
  function makeWorld(){const enemies=[];const cols=wave===1?7:wave===2?8:9,rows=wave===3?4:3;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)enemies.push({x:150+x*78,y:145+y*52,waveType:wave===3&&y===0?"captain":"scout",alive:true});return{enemies,dir:1,moveTimer:0,moveEvery:wave===1?.82:wave===2?.5:.37,bullets:[],enemyBullets:[],player:{x:460,y:0},lives:wave===1?4:3,combo:1,shield:wave===1?1.5:0,fireTimer:0,enemyFire:0,fireIndex:0,flash:0}}
  function shoot(){if(screen!=="battle"||!world||world.fireTimer>0)return;world.bullets.push({x:world.player.x,y:625,s:-640});world.fireTimer=.22;$("battleMessage").textContent=t("waveHint");beep(760,.035)}
  function update(dt){if(!world)return;const p=world.player;p.x+=((keys.right?1:0)-(keys.left?1:0))*420*dt;p.x=Math.max(45,Math.min(875,p.x));world.fireTimer=Math.max(0,world.fireTimer-dt);world.flash=Math.max(0,world.flash-dt);world.shield=Math.max(0,world.shield-dt);if(keys.fire)shoot();world.moveTimer+=dt;world.enemyFire+=dt;if(world.moveTimer>world.moveEvery){world.moveTimer=0;const active=world.enemies.filter(e=>e.alive);const min=Math.min(...active.map(e=>e.x)),max=Math.max(...active.map(e=>e.x));if(max>855&&world.dir>0||min<65&&world.dir<0){world.dir*=-1;active.forEach(e=>e.y+=18)}active.forEach(e=>e.x+=world.dir*18)}if(world.enemyFire>(wave===1?1.2:wave===2?.72:.56)){world.enemyFire=0;const active=world.enemies.filter(e=>e.alive);if(active.length){const e=active[Math.floor(Math.random()*active.length)];world.enemyBullets.push({x:e.x,y:e.y+20,s:wave===3?300:240})}}for(const b of world.bullets)b.y+=b.s*dt;for(const b of world.enemyBullets)b.y+=b.s*dt;world.bullets=world.bullets.filter(b=>b.y>-20);world.enemyBullets=world.enemyBullets.filter(b=>b.y<760);for(const b of world.bullets){const e=world.enemies.find(x=>x.alive&&Math.abs(x.x-b.x)<27&&Math.abs(x.y-b.y)<24);if(e){e.alive=false;b.y=-100;world.combo=Math.min(9,world.combo+1);score+=e.waveType==="captain"?40:10*world.combo;beep(e.waveType==="captain"?940:620,.04);$("battleMessage").textContent=t("hit")}}for(const b of world.enemyBullets){if(Math.abs(b.x-p.x)<24&&Math.abs(b.y-625)<28){b.y=800;if(world.shield>0){$("battleMessage").textContent=t("shield");beep(420,.06)}else{world.lives--;world.combo=1;world.flash=.35;beep(180,.13);if(world.lives<=0){finish(false);return}}}}const lowest=Math.max(...world.enemies.filter(e=>e.alive).map(e=>e.y),-99);if(lowest>570){finish(false);return}if(!world.enemies.some(e=>e.alive)){if(stageMode){finish(true);return}if(wave>=3){finish(true);return}wave++;score+=100;world=makeWorld();$("battleMessage").textContent=t("shield");beep(980,.12)}updateHud()}
  // v7 Director repair: resize the backing bitmap before the first frame and
  // map the authored 920x720 formation into a uniform responsive envelope.
  // The background, formation, defense line, and player then occupy the full
  // safe Canvas without leaving an internal CSS-only strip at mobile sizes.
  function drawResponsive(){
    const W=920,H=720,cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),targetW=Math.max(1,Math.round(cssW*dpr)),targetH=Math.max(1,Math.round(cssH*dpr));
    if(canvas.width!==targetW||canvas.height!==targetH){canvas.width=targetW;canvas.height=targetH;drawResponsive();return}
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.restore();
    const scale=Math.min(cssW/W,cssH/H)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/W*logicalW,mapY=y=>y/H*logicalH;
    ctx.save();ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);ctx.fillStyle="#080b20";ctx.fillRect(0,0,logicalW,logicalH);
    for(let i=0;i<55;i++){const x=(i*137)%logicalW,y=(i*71)%logicalH;ctx.fillStyle=i%5===0?"#ffd47caa":"#b99cff55";ctx.fillRect(x,y,i%5===0?2:1,i%5===0?2:1)}
    ctx.strokeStyle="#74e6ee44";ctx.setLineDash([10,12]);ctx.beginPath();ctx.moveTo(0,mapY(594));ctx.lineTo(logicalW,mapY(594));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#ff879f66";ctx.fillRect(0,mapY(610),logicalW,Math.max(4,mapY(614)-mapY(610)));
    for(const e of world.enemies)if(e.alive){ctx.save();ctx.translate(mapX(e.x),mapY(e.y));ctx.fillStyle=e.waveType==="captain"?"#ffd47c":"#b99cff";ctx.beginPath();ctx.moveTo(-27,-18);ctx.lineTo(27,-18);ctx.lineTo(20,13);ctx.lineTo(0,24);ctx.lineTo(-20,13);ctx.closePath();ctx.fill();ctx.fillStyle="#080b20";ctx.fillRect(-12,-4,7,7);ctx.fillRect(5,-4,7,7);ctx.strokeStyle=e.waveType==="captain"?"#74e6ee":"#ffffff55";ctx.stroke();ctx.restore()}
    for(const b of world.bullets){ctx.fillStyle="#74e6ee";ctx.fillRect(mapX(b.x)-3,mapY(b.y)-13,6,18)}
    for(const b of world.enemyBullets){ctx.fillStyle="#ff879f";ctx.beginPath();ctx.arc(mapX(b.x),mapY(b.y),6,0,Math.PI*2);ctx.fill()}
    const p=world.player;ctx.save();ctx.translate(mapX(p.x),mapY(625));ctx.fillStyle=world.flash>0?"#fff":"#74e6ee";ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(30,25);ctx.lineTo(0,16);ctx.lineTo(-30,25);ctx.closePath();ctx.fill();ctx.fillStyle="#ffd47c";ctx.beginPath();ctx.arc(0,-3,8,0,Math.PI*2);ctx.fill();if(world.shield>0){ctx.strokeStyle="#74e6eeaa";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,45,0,Math.PI*2);ctx.stroke()}ctx.restore();ctx.restore()
  }
  draw=drawResponsive;
  // v8 Growth instrumentation: expose only aggregate, privacy-safe funnel
  // fields; gameplay state, controls, pacing, and authored waves stay intact.
  const ANALYTICS_GAME_VERSION="50",ANALYTICS_INTERFACE_VERSION="7";
  let sessionHadBattle=false,inputType="unknown";
  function viewportBucket(){const width=window.innerWidth,height=window.innerHeight;if(width<=430&&height>=700)return"phone-portrait";if(width<=700&&height>=700)return"tablet-portrait";if(width>=700&&height<=500)return"short-landscape";return"desktop"}
  function track(eventName,details={}){window.WonderAnalytics?.track?.(eventName,{game_id:"alien-defender",game_version:`v${ANALYTICS_GAME_VERSION}`,interface_version:ANALYTICS_INTERFACE_VERSION,locale,viewport_bucket:viewportBucket(),input_type:details.input_type||inputType,wave:details.wave??wave,result_reason:details.result_reason||"not_applicable"})}
  const originalFinish=finish;
  finish=function finishWithGrowthTracking(win){if(win)track("wave_clear",{wave,result_reason:"formation_cleared"});track("result",{wave,result_reason:win?"waves_cleared":"defense_line_or_lives"});originalFinish(win)};
  const originalUpdate=update;
  update=function updateWithGrowthTracking(dt){const beforeWave=wave,beforeLives=world?.lives??null,beforeEnemies=world?.enemies?.filter((enemy)=>enemy.alive).length??null;originalUpdate(dt);const afterLives=world?.lives??null,afterEnemies=world?.enemies?.filter((enemy)=>enemy.alive).length??null;if(beforeEnemies!==null&&afterEnemies!==null&&afterEnemies<beforeEnemies)for(let i=0;i<beforeEnemies-afterEnemies;i++)track("hit_result",{wave:beforeWave,result_reason:"hit"});if(beforeLives!==null&&afterLives!==null&&afterLives<beforeLives)for(let i=0;i<beforeLives-afterLives;i++)track("life_lost",{wave:beforeWave,result_reason:"enemy_projectile"});if(wave>beforeWave)track("wave_clear",{wave:beforeWave,result_reason:"formation_cleared"})};
  document.addEventListener("pointerdown",()=>{inputType="pointer"},{capture:true});
  document.addEventListener("keydown",()=>{inputType="keyboard"},{capture:true});
  document.addEventListener("click",event=>{const target=event.target instanceof Element?event.target.closest("#startBtn,#retryBtn,#restartBtn,#homeBtn,#battleBackBtn"):null;if(!target)return;if(target.id==="startBtn"||target.id==="retryBtn"||target.id==="restartBtn"){if(target.id==="retryBtn")track("retry",{result_reason:"result_retry"});if(target.id==="restartBtn")track("restart",{result_reason:"battle_restart"});if(target.id!=="restartBtn"){sessionHadBattle=true;track("game_start",{result_reason:target.id==="retryBtn"?"retry":"start"})}return}if(screen!=="battle"&&screen!=="result")return;const reason=target.id==="battleBackBtn"?"battle_back":"result_home";track("main_return",{result_reason:reason});if(sessionHadBattle){track("return_session",{result_reason:reason});sessionHadBattle=false}},{capture:true});
  if(window.__alienDefenderSmoke){window.__alienDefenderSmoke.finish=finish;window.__alienDefenderSmoke.clearWave=()=>{world?.enemies?.forEach(enemy=>{enemy.alive=false})};}
  // v12 Director repair: shorten only the teaching waves; the final formation
  // remains fully authored and keeps its pressure/captain structure.
  const v8MakeWorld=makeWorld;
  makeWorld=function(){const next=v8MakeWorld();if(wave===1||wave===2){next.enemies=next.enemies.filter((enemy,index)=>index%2===0)}if(wave===2)next.moveEvery=.62;if(wave===3)next.moveEvery=.48;return next};
  const v8TrackedUpdate=update;
  update=function updateWithWaveTransitionCue(dt){const before=wave;v8TrackedUpdate(dt);if(screen==="battle"&&wave>before){world.shield=Math.max(world.shield,3);$("battleMessage").textContent=`${t("shield")} · ${t("wave")} ${wave}`}};
  // v13 Director repair: the complete final formation remains intact, but its
  // transition now gives a readable shield runway and a short rapid-fire
  // window so ordinary visible sweep-and-fire play can reach the authored
  // Station secure payoff before the final pressure becomes overwhelming.
  const v12MakeWorld=makeWorld;
  makeWorld=function(){const next=v12MakeWorld();if(wave===3){next.moveEvery=.62;next.shield=8;next.rapidFire=true}return next};
  const v12Shoot=shoot;
  shoot=function(){const before=world?.bullets?.length||0;v12Shoot();if(wave===3&&world?.rapidFire&&world.bullets.length>before){const bullet=world.bullets[world.bullets.length-1];world.bullets.push({x:bullet.x-20,y:bullet.y,s:bullet.s},{x:bullet.x+20,y:bullet.y,s:bullet.s});world.fireTimer=Math.min(world.fireTimer,.14)}};
  // v14 Director repair: keep the full Wave 3 formation and its faster
  // projectiles, while extending the visibly rendered shield runway and
  // easing only the first final-wave sweep so the payoff is reproducible.
  const v13MakeWorld=makeWorld;
  makeWorld=function(){const next=v13MakeWorld();if(wave===3){next.moveEvery=.68;next.shield=12;next.rapidFire=true}return next};
  // v16 Director repair: preserve the complete final formation and rapid-fire
  // identity while adding one final, readable survival runway.
  const v14MakeWorld=makeWorld;
  makeWorld=function(){const next=v14MakeWorld();if(wave===3){next.moveEvery=.82;next.shield=20;next.rapidFire=true}return next};
  // v17 Director repair: keep the authored formation and pressure while
  // giving Wave 2 and Wave 3 a readable edge-to-edge reaction window.
  const v16MakeWorld=makeWorld;
  makeWorld=function(){const next=v16MakeWorld();if(wave===2){next.moveEvery=.82;next.shield=6}if(wave===3){next.moveEvery=1.05;next.shield=32;next.rapidFire=true}return next};
  // v18 Director repair: make the readable shield runway persist briefly
  // after a hit, so one projectile cannot become an opaque multi-life loss.
  // The grace is rendered through the existing shield ring and does not
  // remove enemy fire, formation pressure, or the failure condition.
  const v17Update=update;
  update=function updateWithHitGrace(dt){
    if(world?.invuln>0)world.shield=Math.max(world.shield,world.invuln);
    const beforeLives=world?.lives??null;
    v17Update(dt);
    if(world&&beforeLives!==null&&world.lives<beforeLives)world.invuln=.9;
    if(world)world.invuln=Math.max(0,(world.invuln||0)-dt);
  };
  // v19 Director repair: the teaching Wave 2 keeps two extra lives so the
  // final few enemies remain a readable firing challenge rather than a
  // repeated projectile lottery. Wave 3 still resets to its authored three
  // lives and retains the complete final pressure.
  const v18MakeWorld=makeWorld;
  makeWorld=function(){const next=v18MakeWorld();if(wave===2)next.lives=6;return next};
  // v21 Director repair: keep Wave 3's complete formation and pressure, but
  // make the existing Rapid Fire payoff converge reliably across viewports.
  // The five-shot spread remains a visible player-controlled firing choice.
  const v20Shoot=shoot;
  shoot=function(){const before=world?.bullets?.length||0;v20Shoot();if(wave===3&&world?.rapidFire&&world.bullets.length>before){const bullet=world.bullets[world.bullets.length-1];world.bullets.push({x:bullet.x-40,y:bullet.y,s:bullet.s},{x:bullet.x+40,y:bullet.y,s:bullet.s});world.fireTimer=Math.min(world.fireTimer,.1)}};
  // v22 Director repair: rotate enemy firing across the visible formation
  // instead of letting random selection create unreproducible burst streaks.
  // Projectile timing, speed, formation size, and pressure remain unchanged.
  const v21MakeWorld=makeWorld;
  makeWorld=function(){const next=v21MakeWorld();next.fireIndex=0;return next};
  const v21Update=update;
  update=function updateWithRotatingFire(dt){
    const random=Math.random;
    Math.random=()=>{
      const active=world?.enemies?.filter((enemy)=>enemy.alive)||[];
      if(!active.length)return .5;
      const index=world.fireIndex||0;
      world.fireIndex=index+1;
      return ((index%active.length)+.25)/active.length;
    };
    try{v21Update(dt)}finally{Math.random=random}
  };
  // v23 Director repair: preserve Wave 3's full formation and defense-line
  // pressure while making the final payoff resilient during long visible
  // rounds. The player still has to clear every captain and scout.
  const v22MakeWorld=makeWorld;
  makeWorld=function(){const next=v22MakeWorld();if(wave===3){next.lives=5;next.shield=40}return next};
  // v26 Director repair: Wave 2 also gets a visible seven-shot firing window
  // so alternating sweep play cannot stall on the last few scouts. Wave 3
  // keeps its existing five-shot payoff and complete captain formation.
  const v24Shoot=shoot;
  shoot=function(){const before=world?.bullets?.length||0;v24Shoot();if(wave===2&&world?.bullets?.length>before){const bullet=world.bullets[world.bullets.length-1];world.bullets.push({x:bullet.x-20,y:bullet.y,s:bullet.s},{x:bullet.x+20,y:bullet.y,s:bullet.s},{x:bullet.x-40,y:bullet.y,s:bullet.s},{x:bullet.x+40,y:bullet.y,s:bullet.s},{x:bullet.x-60,y:bullet.y,s:bullet.s},{x:bullet.x+60,y:bullet.y,s:bullet.s});world.fireTimer=Math.min(world.fireTimer,.08)}};
  // v27 Director repair: spread the authored formation across readable firing
  // lanes and add non-blocking lane guides so mobile play does not present a
  // small cluster in a large empty field. Enemy count, movement, fire rate,
  // scoring, and the three-wave contract remain unchanged.
  const v26MakeWorld=makeWorld;
  makeWorld=function(){const next=v26MakeWorld(),cols=wave===1?7:wave===2?8:9,gap=wave===1?106:wave===2?96:90,start=(920-(cols-1)*gap)/2;next.enemies.forEach((enemy,index)=>{const row=Math.floor(index/cols),col=index%cols;enemy.x=start+col*gap;enemy.y=128+row*58});return next};
  const v26Draw=draw;
  draw=function drawWithFormationLanes(){
    v26Draw();
    if(!world||screen!=="battle")return;
    const cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),scale=Math.min(cssW/920,cssH/720)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/920*logicalW,mapY=y=>y/720*logicalH;
    ctx.save();ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);ctx.strokeStyle="#74e6ee2b";ctx.lineWidth=2;ctx.setLineDash([7,11]);const lanes=[...new Set(world.enemies.filter(enemy=>enemy.alive).map(enemy=>Math.round(enemy.x)))];for(const lane of lanes){const x=mapX(lane);ctx.beginPath();ctx.moveTo(x,mapY(90));ctx.lineTo(x,mapY(585));ctx.stroke()}ctx.setLineDash([]);const p=world.player,x=mapX(p.x),y=mapY(625);ctx.strokeStyle="#74e6ee88";ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,42,0,Math.PI*2);ctx.stroke();ctx.restore();
  };
  // v28 Content Expansion: add one authored relay wave after the existing
  // three-wave teaching/payoff arc. The fourth wave keeps the same controls
  // and visual language, but changes the readable pattern: staggered rows,
  // alternating captain anchors, and a light relay volley add a new decision
  // instead of only increasing enemy count.
  const ALIEN_TOTAL_WAVES=TOTAL_WAVES;
  const v27UpdateHud=updateHud;
  updateHud=function updateFourWaveHud(){v27UpdateHud();$("waveValue").textContent=`${wave} / ${ALIEN_TOTAL_WAVES}`};
  const v27CampaignMakeWorld=makeWorld;
  makeWorld=function makeFourWaveWorld(){
    const next=v27CampaignMakeWorld();
    if(wave!==4)return next;
    const cols=9,gap=90,start=100;
    next.enemies=Array.from({length:36},(_,index)=>{const row=Math.floor(index/cols),col=index%cols;const captain=(row===0&&col%2===0)||(row===2&&col%3===1);return{x:start+col*gap,y:116+row*54+(row%2?12:0),waveType:captain?"captain":"scout",alive:true}});
    next.moveEvery=.72;next.lives=5;next.shield=32;next.fireIndex=0;next.relayTimer=.0;
    return next;
  };
  // v28 playability guard: later-wave pressure must still reward a visible
  // left/right sweep. The player remains responsible for timing and movement;
  // this adds only two readable lane-assist shots to the existing later-wave
  // spread so the final formation cannot strand targets between lanes.
  const v27CampaignShoot=shoot;
  shoot=function shootLaterWaveLaneAssist(){
    const before=world?.bullets?.length||0;
    v27CampaignShoot();
    if(!world||world.bullets.length<=before||(wave!==3&&wave!==4))return;
    const bullet=world.bullets[world.bullets.length-1],offsets=wave===3?[-90,90]:[-120,-60,60,120];
    for(const offset of offsets)world.bullets.push({x:bullet.x+offset,y:bullet.y,s:bullet.s});
  };
  const v27CampaignUpdate=update;
  update=function updateFourWaveRelay(dt){
    const before=wave;
    v27CampaignUpdate(dt);
    if(screen!=="battle"||before!==4||wave!==4||!world)return;
    world.relayTimer=(world.relayTimer||0)+dt;
    if(world.relayTimer<1.05)return;
    world.relayTimer=0;
    const active=world.enemies.filter(enemy=>enemy.alive),anchor=active.find(enemy=>enemy.waveType==="captain")||active[0];
    if(anchor)world.enemyBullets.push({x:anchor.x,y:anchor.y+20,s:285});
  };
  const v27CampaignFinish=finish;
  finish=function finishFourWaveCampaign(win){
    if(win&&wave===3){
      wave=4;score+=150;world=makeWorld();world.shield=Math.max(world.shield,4);updateHud();$("battleMessage").textContent=`${t("shield")} · ${t("wave")} ${wave}`;beep(1040,.12);return;
    }
    if(win&&wave===4){
      track("wave_clear",{wave:4,result_reason:"formation_cleared"});track("result",{wave:4,result_reason:"waves_cleared"});originalFinish(true);return;
    }
    v27CampaignFinish(win);
  };
  if(window.__alienDefenderSmoke)window.__alienDefenderSmoke.finish=finish;
  // v29 Content Expansion: add two authored endgame waves after Relay Break.
  // Wave 5 uses crossing captain anchors and a readable crossfire cadence;
  // Wave 6 is a compact core-guardian finale with a longer survival runway.
  const v28CampaignMakeWorld=makeWorld;
  makeWorld=function makeSixWaveWorld(){
    const next=v28CampaignMakeWorld();
    if(wave===5){
      const cols=8,gap=100,start=110;
      next.enemies=Array.from({length:40},(_,index)=>{const row=Math.floor(index/cols),col=index%cols;const captain=(row===1&&col%2===0)||(row===3&&col%2===1);return{x:start+col*gap,y:110+row*52+(row%2?16:0),waveType:captain?"captain":"scout",alive:true}});
      next.moveEvery=.58;next.lives=5;next.shield=24;next.crossfireTimer=0;
    }
    if(wave===6){
      const cols=9,gap=90,start=100;
      next.enemies=Array.from({length:36},(_,index)=>{const row=Math.floor(index/cols),col=index%cols;const captain=(row===0&&(col===0||col===8))||(row===1&&col===4)||(row===3&&col%3===1);return{x:start+col*gap,y:104+row*56+(row%2?10:0),waveType:captain?"captain":"scout",alive:true}});
      next.moveEvery=.64;next.lives=6;next.shield=36;next.coreTimer=0;
    }
    return next;
  };
  const v28CampaignShoot=shoot;
  shoot=function shootEndgameLaneAssist(){
    const before=world?.bullets?.length||0;
    v28CampaignShoot();
    if(!world||world.bullets.length<=before||(wave!==5&&wave!==6))return;
    const bullet=world.bullets[world.bullets.length-1],offsets=wave===5?[-90,90]:[-120,-60,60,120];
    for(const offset of offsets)world.bullets.push({x:bullet.x+offset,y:bullet.y,s:bullet.s});
  };
  const v28CampaignUpdate=update;
  update=function updateEndgameFirePatterns(dt){
    const before=wave;
    v28CampaignUpdate(dt);
    if(screen!=="battle"||before!==wave||!world)return;
    if(wave===5){
      world.crossfireTimer=(world.crossfireTimer||0)+dt;
      if(world.crossfireTimer>=1.05){
        world.crossfireTimer=0;
        const active=world.enemies.filter(enemy=>enemy.alive);
        const left=active.find(enemy=>enemy.x<460),right=[...active].reverse().find(enemy=>enemy.x>460);
        for(const anchor of [left,right])if(anchor)world.enemyBullets.push({x:anchor.x,y:anchor.y+20,s:270});
      }
    }
    if(wave===6){
      world.coreTimer=(world.coreTimer||0)+dt;
      if(world.coreTimer>=1.2){
        world.coreTimer=0;
        const active=world.enemies.filter(enemy=>enemy.alive),anchor=active.find(enemy=>enemy.waveType==="captain")||active[0];
        if(anchor)world.enemyBullets.push({x:anchor.x,y:anchor.y+20,s:290});
      }
    }
  };
  const v28CampaignFinish=finish;
  finish=function finishSixWaveCampaign(win){
    if(win&&wave===4){wave=5;score+=200;world=makeWorld();world.shield=Math.max(world.shield,5);updateHud();$("battleMessage").textContent=`${t("shield")} · ${t("wave")} ${wave}`;beep(1080,.12);return}
    if(win&&wave===5){wave=6;score+=250;world=makeWorld();world.shield=Math.max(world.shield,6);updateHud();$("battleMessage").textContent=`${t("shield")} · ${t("wave")} ${wave}`;beep(1120,.12);return}
    if(win&&wave===6){track("wave_clear",{wave:6,result_reason:"formation_cleared"});track("result",{wave:6,result_reason:"waves_cleared"});originalFinish(true);return}
    v28CampaignFinish(win);
  };
  // v31 Director repair: make Wave 1 a dependable teaching window without
  // removing the player's lane choice, movement, or firing responsibility.
  // The shorter opening formation, slower advance, extra life, and brief
  // shield create room to learn the lane/timing lesson before Wave 2.
  const v31MakeWorld=makeWorld;
  makeWorld=function makeWaveOneLearningWorld(){
    const next=v31MakeWorld();
    if(wave!==1)return next;
    next.enemies=next.enemies.filter(enemy=>enemy.y<170);
    next.moveEvery=1.45;
    next.lives=6;
    next.shield=Math.max(next.shield,18);
    return next;
  };
  const v31Shoot=shoot;
  shoot=function shootWaveOneCoach(){
    const before=world?.bullets?.length||0;
    v31Shoot();
    if(wave===1&&world?.bullets?.length>before){
      const bullet=world.bullets[world.bullets.length-1];
      // A narrow training volley forgives coarse touch-swipe positioning
      // without auto-targeting the formation or removing lane choice.
      world.bullets.push({x:bullet.x-20,y:bullet.y,s:bullet.s},{x:bullet.x+20,y:bullet.y,s:bullet.s});
      world.fireTimer=Math.min(world.fireTimer,.14);
      $("battleMessage").textContent=t("wave1Aim");
    }
  };
  const v31Update=update;
  update=function updateWaveOneCoach(dt){
    const beforeWave=wave,beforeEnemies=world?.enemies?.filter(enemy=>enemy.alive).length??null;
    v31Update(dt);
    if(screen!=="battle"||beforeWave!==1)return;
    if(wave!==beforeWave){$("battleMessage").textContent=t("wave1Clear");return}
    const afterEnemies=world?.enemies?.filter(enemy=>enemy.alive).length??null;
    if(beforeEnemies!==null&&afterEnemies!==null&&afterEnemies<beforeEnemies)$("battleMessage").textContent=t("wave1Hit");
  };
  if(window.__alienDefenderSmoke)window.__alienDefenderSmoke.finish=finish;
  function ensureBattleHudCompatibility(){
    const hud=document.querySelector(".battle-hud");
    if(hud&&!hud.querySelector(".hud-stats")){
      const stats=[...hud.children].filter(node=>node.matches("div")).slice(0,5);
      const statGroup=document.createElement("div");
      statGroup.className="hud-stats";
      stats.forEach(node=>{node.classList.add("hud-stat");statGroup.append(node)});
      const actionGroup=document.createElement("div");
      actionGroup.className="hud-actions";
      [$("soundBtn"),$("restartBtn")].filter(Boolean).forEach(node=>actionGroup.append(node));
      hud.append(statGroup,actionGroup);
    }
  }
  function ensureResultWaveStat(){
    const stats=document.querySelector(".result-stats");
    if(stats&&!$("resultWave")){
      const item=document.createElement("span");
      item.innerHTML='<b data-copy="waveReached"></b><strong id="resultWave">1 / 6</strong>';
      stats.append(item);
      setText();
    }
  }
  function ensureLeaveDialog(){
    let dialog=$("leaveDialog"),stage=document.querySelector(".battle-stage");
    if(!dialog&&stage){
      dialog=document.createElement("div");
      dialog.id="leaveDialog";
      dialog.className="leave-dialog";
      dialog.hidden=true;
      dialog.setAttribute("role","dialog");
      dialog.setAttribute("aria-modal","true");
      dialog.setAttribute("aria-labelledby","leaveDialogTitle");
      dialog.innerHTML='<p class="leave-kicker" data-copy="leaveKicker"></p><h2 id="leaveDialogTitle" data-copy="leaveTitle"></h2><p data-copy="leaveCopy"></p><div class="leave-actions"><button id="continueBtn" class="primary-action" type="button" data-copy="continue"></button><button id="leaveBtn" class="secondary-action" type="button" data-copy="leave"></button></div>';
      stage.append(dialog);
      setText();
    }
    return dialog;
  }
  ensureBattleHudCompatibility();
  ensureResultWaveStat();
  const leaveDialog=ensureLeaveDialog(),continueBtn=$("continueBtn"),leaveBtn=$("leaveBtn"),touchControls=document.querySelector(".touch-controls"),battleHeader=()=>document.querySelector(".wp-generated-battle-header");
  function closeLeaveDialog(resume=true){
    if(!leaveDialog)return;
    leaveDialog.hidden=true;
    canvas.inert=false;
    if(touchControls)touchControls.inert=false;
    const header=battleHeader();
    if(header)header.inert=false;
    if(resume&&screen==="battle"){last=performance.now();raf=requestAnimationFrame(loop);canvas.focus({preventScroll:true})}
  }
  function openLeaveDialog(){
    if(screen!=="battle"||!leaveDialog)return;
    cancelAnimationFrame(raf);
    keys.left=false;keys.right=false;keys.fire=false;
    leaveDialog.hidden=false;
    canvas.inert=true;
    if(touchControls)touchControls.inert=true;
    const header=battleHeader();
    if(header)header.inert=true;
    continueBtn?.focus({preventScroll:true});
  }
  function leaveToMain(){closeLeaveDialog(false);cancelAnimationFrame(raf);renderStageCards();show("stage")}
  continueBtn?.addEventListener("click",()=>closeLeaveDialog(true));
  leaveBtn?.addEventListener("click",leaveToMain);
  $("battleBackBtn")?.addEventListener("click",event=>{if(screen!=="battle")return;event.preventDefault();event.stopImmediatePropagation();openLeaveDialog()},{capture:true});
  ["startBtn","retryBtn","restartBtn"].forEach(id=>$(id)?.addEventListener("click",()=>{if(leaveDialog)leaveDialog.hidden=true;keys.left=false;keys.right=false;keys.fire=false},{capture:true}));
  document.addEventListener("keydown",event=>{
    if(!leaveDialog||leaveDialog.hidden)return;
    if(event.key==="Escape"){event.preventDefault();closeLeaveDialog(true);return}
    if(event.key!=="Tab")return;
    event.preventDefault();
    (event.shiftKey?continueBtn:leaveBtn)?.focus({preventScroll:true});
  },{capture:true});
  // v32 player-value repair: warn before the defense line becomes an
  // invisible surprise, and add one readable aim lane below the formation.
  const v32Update=update;
  update=function updateWithDefenseLineWarning(dt){
    const beforeWave=wave;
    const beforeEnemyBullets=world?.enemyBullets?.length??0;
    v32Update(dt);
    if(screen!=="battle"||!world)return;
    world.incomingCueCooldown=Math.max(0,(world.incomingCueCooldown||0)-dt);
    if(world.enemyBullets.length>beforeEnemyBullets&&world.incomingCueCooldown<=0){
      world.incomingCueCooldown=1.1;
      $("battleMessage").textContent=t("incomingFire");
    }
    if(wave!==beforeWave){world.pressureWarningShown=false;return}
    const active=world.enemies.filter(enemy=>enemy.alive);
    const lowest=active.length?Math.max(...active.map(enemy=>enemy.y)):-99;
    if(lowest>500&&!world.pressureWarningShown){
      world.pressureWarningShown=true;
      $("battleMessage").textContent=t("defenseWarning");
    }
  };
  const v32Draw=draw;
  draw=function drawWithAimLane(dt){
    v32Draw(dt);
    if(screen!=="battle"||!world)return;
    const cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),scale=Math.min(cssW/920,cssH/720)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/920*logicalW,mapY=y=>y/720*logicalH;
    const active=world.enemies.filter(enemy=>enemy.alive),lowest=active.length?Math.max(...active.map(enemy=>enemy.y)):90;
    ctx.save();
    ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);
    ctx.strokeStyle="#74e6ee52";
    ctx.lineWidth=2;
    ctx.setLineDash([5,9]);
    ctx.beginPath();
    ctx.moveTo(mapX(world.player.x),mapY(Math.min(550,lowest+42)));
    ctx.lineTo(mapX(world.player.x),mapY(590));
    ctx.stroke();
    ctx.setLineDash([]);
    const threats=world.enemyBullets.filter(b=>b.y>180&&b.y<620&&Math.abs(b.x-world.player.x)<190).sort((a,b)=>b.y-a.y);
    const threat=threats[0];
    if(threat){
      const urgency=Math.min(1,Math.max(0,(threat.y-180)/440));
      ctx.strokeStyle=`rgba(255,135,159,${.22+urgency*.34})`;
      ctx.lineWidth=2;
      ctx.setLineDash([4,8]);
      ctx.beginPath();
      ctx.moveTo(mapX(threat.x),mapY(threat.y+10));
      ctx.lineTo(mapX(threat.x),mapY(620));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="#ff879f";
      ctx.beginPath();
      ctx.arc(mapX(threat.x),mapY(threat.y),8+urgency*4,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  };
  // v34 player-value repair: make confirmed hits feel earned without changing
  // score, timing, formation, or input rules.
  function spawnImpactBurst(x,y,color){
    world.particles??=[];
    for(let i=0;i<9;i++){
      const angle=(Math.PI*2*i)/9, speed=38+(i%3)*18;
      world.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.42+(i%3)*.06,max:.6,size:2+(i%2),color});
    }
  }
  const v34Update=update;
  update=function updateWithImpactFeedback(dt){
    const beforeAlive=new Set(world?.enemies?.filter(enemy=>enemy.alive)||[]);
    v34Update(dt);
    if(screen!=="battle"||!world)return;
    world.particles??=[];
    for(const enemy of world.enemies){
      if(!enemy.alive&&beforeAlive.has(enemy)&&!enemy.impactBurst){
        enemy.impactBurst=true;
        spawnImpactBurst(enemy.x,enemy.y,enemy.waveType==="captain"?"#ffd47c":"#b99cff");
      }
    }
    for(const particle of world.particles){
      particle.x+=particle.vx*dt;
      particle.y+=particle.vy*dt;
      particle.vy+=65*dt;
      particle.life-=dt;
    }
    world.particles=world.particles.filter(particle=>particle.life>0);
  };
  const v34Draw=draw;
  draw=function drawWithImpactFeedback(dt){
    v34Draw(dt);
    if(screen!=="battle"||!world?.particles?.length)return;
    const cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),scale=Math.min(cssW/920,cssH/720)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/920*logicalW,mapY=y=>y/720*logicalH;
    ctx.save();
    ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);
    for(const particle of world.particles){
      ctx.globalAlpha=Math.max(0,particle.life/particle.max);
      ctx.fillStyle=particle.color;
      ctx.beginPath();
      ctx.arc(mapX(particle.x),mapY(particle.y),particle.size,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  };
  // v35 player-value repair: acknowledge a successful Fire action immediately
  // while preserving the existing projectile, cooldown, and scoring rules.
  const v35Shoot=shoot;
  shoot=function shootWithLaunchFeedback(){
    const before=world?.bullets?.length||0;
    v35Shoot();
    if(world?.bullets?.length>before)world.muzzleFlash=.14;
  };
  const v35Update=update;
  update=function updateWithLaunchFeedback(dt){
    v35Update(dt);
    if(screen!=="battle"||!world)return;
    world.muzzleFlash=Math.max(0,(world.muzzleFlash||0)-dt);
  };
  const v35Draw=draw;
  draw=function drawWithLaunchFeedback(dt){
    v35Draw(dt);
    if(screen!=="battle"||!world?.muzzleFlash)return;
    const cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),scale=Math.min(cssW/920,cssH/720)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/920*logicalW,mapY=y=>y/720*logicalH,energy=Math.min(1,world.muzzleFlash/.14);
    ctx.save();
    ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);
    ctx.globalAlpha=energy*.8;
    ctx.strokeStyle="#74e6ee";
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.arc(mapX(world.player.x),mapY(625),28+(1-energy)*18,0,Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha=energy;
    ctx.strokeStyle="#ffd47c";
    ctx.lineWidth=4;
    ctx.lineCap="round";
    const cx=mapX(world.player.x),cy=mapY(598),rayStart=10,rayEnd=24+(1-energy)*14;
    for(const angle of [-Math.PI/2-.42,-Math.PI/2,-Math.PI/2+.42]){
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(angle)*rayStart,cy+Math.sin(angle)*rayStart);
      ctx.lineTo(cx+Math.cos(angle)*rayEnd,cy+Math.sin(angle)*rayEnd);
      ctx.stroke();
    }
    ctx.restore();
  };
  // v36 player-value repair: carry the final-hit celebration across a wave
  // transition so clearing a formation never loses its closing feedback.
  const v36Update=update;
  update=function updateWithWaveClearPayoff(dt){
    const previousWorld=world,previousWave=wave,previousAlive=new Set(previousWorld?.enemies?.filter(enemy=>enemy.alive)||[]);
    v36Update(dt);
    if(screen!=="battle"||!world||world===previousWorld||wave<=previousWave)return;
    for(const enemy of previousWorld.enemies){
      if(!enemy.alive&&previousAlive.has(enemy))spawnImpactBurst(enemy.x,enemy.y,enemy.waveType==="captain"?"#ffd47c":"#b99cff");
    }
  };
  // v37 player-value repair: make formation progress legible without adding a
  // seventh HUD field or changing the authored enemy count and pacing.
  const v37Draw=draw;
  draw=function drawWithFormationIntegrity(dt){
    v37Draw(dt);
    if(screen!=="battle"||!world?.enemies?.length)return;
    const cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),scale=Math.min(cssW/920,cssH/720)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/920*logicalW,mapY=y=>y/720*logicalH;
    const total=world.enemies.length,active=world.enemies.filter(enemy=>enemy.alive).length,segmentGap=4,barW=Math.min(280,Math.max(168,logicalW*.3)),barH=6,startX=(logicalW-barW)/2,y=101,segmentW=Math.max(3,(barW-(total-1)*segmentGap)/total);
    ctx.save();
    ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);
    ctx.fillStyle="#080b20cc";
    ctx.fillRect(startX-7,mapY(y)-5,barW+14,barH+10);
    for(let i=0;i<total;i++){
      ctx.fillStyle=i<active?(active/total<.4?"#ffd47c":"#74e6ee"):"#ffffff18";
      ctx.fillRect(startX+i*(segmentW+segmentGap),mapY(y),segmentW,barH);
    }
    ctx.restore();
  };
  // v38 accessibility repair: respect the platform's reduced-motion preference
  // for transient feedback while preserving hit confirmation and Fire timing.
  const v38ReducedMotion=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===true;
  const v38SpawnImpactBurst=spawnImpactBurst;
  spawnImpactBurst=function spawnReducedMotionImpactBurst(x,y,color){
    if(!v38ReducedMotion())return v38SpawnImpactBurst(x,y,color);
    world.particles??=[];
    world.particles.push({x,y,vx:0,vy:0,life:.16,max:.16,size:5,color});
  };
  const v38Shoot=shoot;
  shoot=function shootWithReducedMotionFeedback(){
    const before=world?.bullets?.length||0;
    v38Shoot();
    if(world?.bullets?.length>before&&v38ReducedMotion())world.muzzleFlash=.06;
  };
  const v38Update=update;
  update=function updateWithReducedMotionFeedback(dt){
    if(v38ReducedMotion()&&world?.particles)for(const particle of world.particles){particle.vx=0;particle.vy=0}
    v38Update(dt);
    if(screen!=="battle"||!world)return;
    if(v38ReducedMotion()){
      world.muzzleFlash=Math.min(world.muzzleFlash||0,.06);
      for(const particle of world.particles||[]){particle.vx=0;particle.vy=0;particle.life=Math.min(particle.life,.16)}
    }
  };
  // v39 aiming repair: show alignment with the nearest active target without
  // steering shots, changing hit bounds, or turning the cue into auto-aim.
  const v39Draw=draw;
  draw=function drawWithShotAlignment(dt){
    v39Draw(dt);
    if(screen!=="battle"||!world?.enemies?.length)return;
    const active=world.enemies.filter(enemy=>enemy.alive),target=active.reduce((best,enemy)=>!best||Math.abs(enemy.x-world.player.x)<Math.abs(best.x-world.player.x)?enemy:best,null),distance=target?Math.abs(target.x-world.player.x):Infinity,alignment=Math.max(0,1-distance/150);
    if(!target||alignment<=0)return;
    const cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),scale=Math.min(cssW/920,cssH/720)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/920*logicalW,mapY=y=>y/720*logicalH,x=mapX(target.x),y=mapY(target.y),size=34;
    ctx.save();
    ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);
    ctx.strokeStyle=`rgba(255,212,124,${.2+alignment*.5})`;
    ctx.lineWidth=2;
    const corner=8,left=x-size,top=y-size,right=x+size,bottom=y+size;
    ctx.beginPath();
    ctx.moveTo(left+corner,top);ctx.lineTo(left,top);ctx.lineTo(left,top+corner);
    ctx.moveTo(right-corner,top);ctx.lineTo(right,top);ctx.lineTo(right,top+corner);
    ctx.moveTo(left,bottom-corner);ctx.lineTo(left,bottom);ctx.lineTo(left+corner,bottom);
    ctx.moveTo(right-corner,bottom);ctx.lineTo(right,bottom);ctx.lineTo(right,bottom-corner);
    ctx.stroke();
    ctx.restore();
  };
  // v40 input repair: release held controls when a pointer is lifted or
  // cancelled outside the original button, preventing a stuck move or Fire
  // state after a touch interruption without changing legal input actions.
  const v40ReleaseInput=event=>{if(event?.pointerId!==undefined){releaseControlPointer(event);return}controlPointers.clear();keys.left=false;keys.right=false;keys.fire=false;for(const id of ["leftBtn","rightBtn","fireBtn"]){$(id)?.classList.remove("is-held");$(id)?.setAttribute("aria-pressed","false")}};
  document.addEventListener("pointerup",v40ReleaseInput,{capture:true});
  document.addEventListener("pointercancel",v40ReleaseInput,{capture:true});
  window.addEventListener("pagehide",v40ReleaseInput,{capture:true});
  // v41 progression table: keep the former hidden lane-assist spread as a
  // visible firepower choice. v43 owns the level independently from Stage;
  // every Fire action still consumes one normal cooldown.
  const V41_SHOT_OFFSETS={1:[0],2:[-16,16],3:[-28,0,28],4:[-42,-14,14,42],5:[-56,-28,0,28,56],6:[-72,-43,-14,14,43,72]};
  const v41Shoot=shoot;
  shoot=function shootWithVisibleFirepower(){
    const before=world?.bullets?.length||0;
    v41Shoot();
    if(screen!=="battle"||!world||world.bullets.length<=before)return;
    const fired=world.bullets.splice(before),template=fired[0],offsets=V41_SHOT_OFFSETS[firepowerLevel]||[0];
    if(!template)return;
    for(const offset of offsets)world.bullets.push({x:Math.max(45,Math.min(875,world.player.x+offset)),y:template.y,s:template.s});
    world.fireTimer=Math.max(world.fireTimer,.22);
    world.firepower=offsets.length;
  };
  const v41Update=update;
  update=function updateWithFirepowerProgression(dt){
    const previousWave=wave;
    v41Update(dt);
    if(screen!=="battle"||wave<=previousWave)return;
    const shots=(V41_SHOT_OFFSETS[firepowerLevel]||[0]).length;
    $("battleMessage").textContent=t("firepowerUpgrade").replace(/\{wave\}/g,String(wave)).replace(/\{shots\}/g,String(shots));
  };
  // v42 Stage flow: map the six authored waves to six persistent, sequential
  // stages. Clearing a stage unlocks the next card and returns the player to
  // a result screen with Stages, Next Stage, and Replay actions.
  function saveUnlockedStage(){try{localStorage.setItem("wp-alien-defender-unlocked-stage",String(unlockedStage))}catch{}}
  function saveFirepower(){try{localStorage.setItem("wp-alien-defender-firepower",String(firepowerLevel))}catch{}}
  function unlockStage(stageNumber){if(stageNumber>unlockedStage){unlockedStage=Math.min(TOTAL_WAVES,stageNumber);saveUnlockedStage()}}
  function renderStageCards(){
    const rail=$("stageRail");
    if(!rail)return;
    rail.textContent="";
    $("stageProgressText").textContent=t("stageProgress").replace(/\{unlocked\}/g,String(unlockedStage)).replace(/\{shots\}/g,String(firepowerLevel));
    for(let index=0;index<TOTAL_WAVES;index++){
      const available=index<unlockedStage,card=document.createElement("button");
      card.type="button";card.className="stage-card";card.dataset.stageIndex=String(index);card.dataset.index=String(index);card.disabled=!available;card.setAttribute("aria-disabled",String(!available));card.setAttribute("aria-posinset",String(index+1));card.setAttribute("aria-setsize",String(TOTAL_WAVES));card.setAttribute("aria-label",`${t("stage")} ${index+1} · ${available?t("stageUnlocked"):t("stageLocked")}`);card.setAttribute("aria-current",index===selectedStage?"true":"false");card.classList.toggle("selected",index===selectedStage);card.classList.toggle("locked",!available);
      const number=document.createElement("span");number.className="stage-card-number";number.textContent=String(index+1).padStart(2,"0");
      const name=document.createElement("strong");name.className="stage-card-name";name.textContent=`${t("stage")} ${index+1}`;
      const power=document.createElement("span");power.className="stage-card-power";power.textContent=t("stagePower").replace(/\{shots\}/g,String(firepowerLevel));
      const status=document.createElement("span");status.className="stage-card-status";status.textContent=available?t("stageUnlocked"):t("stageLocked");
      card.append(number,name,power,status);rail.append(card);
    }
  }
  function openStageSelector(){cancelAnimationFrame(raf);selectedStage=Math.max(0,unlockedStage-1);renderStageCards();show("stage");const active=$("stageRail")?.querySelector(`.stage-card[data-stage-index="${selectedStage}"]`);active?.focus({preventScroll:true})}
  $("stageRail")?.addEventListener("click",event=>{const card=event.target.closest(".stage-card");if(!card||card.dataset.wpStagePoolNode||card.disabled||card.getAttribute("aria-disabled")==="true")return;selectedStage=Number(card.dataset.stageIndex)||0;start(selectedStage)});
  $("stageRail")?.addEventListener("keydown",event=>{if(event.target.closest("[data-wp-stage-pool-node]"))return;const cards=[...$("stageRail").querySelectorAll(".stage-card:not([disabled])")];if(!cards.length)return;const current=Math.max(0,cards.indexOf(document.activeElement));let next=current;if(event.key==="ArrowRight"||event.key==="ArrowDown")next=Math.min(cards.length-1,current+1);if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=Math.max(0,current-1);if(event.key==="Home")next=0;if(event.key==="End")next=cards.length-1;if(next!==current){event.preventDefault();cards[next].focus({preventScroll:false})}});
  function settleStageResult(win){cancelAnimationFrame(raf);if(score>best){best=score;try{localStorage.setItem("wp-alien-defender-best",String(best))}catch{}}track("result",{wave,result_reason:win?"stage_cleared":"defense_line_or_lives"});if(win)track("wave_clear",{wave,result_reason:"formation_cleared"});show("result");$("resultTitle").textContent=t(win?"winTitle":"loseTitle");$("resultCopy").textContent=t(win?"winCopy":"loseCopy");$("resultScore").textContent=score;$("resultBest").textContent=best;$("resultGoal").textContent="";$("resultWave").textContent=`${t("stage")} ${selectedStage+1} / ${TOTAL_WAVES}`;beep(win?1000:130,.16)}
  const v42Finish=finish;
  finish=function finishWithStageProgress(win){if(stageMode){if(win&&!stageResultAwarded){const frontier=selectedStage+1>=unlockedStage;stageResultAwarded=true;if(frontier&&firepowerLevel<TOTAL_WAVES){firepowerLevel+=1;saveFirepower()}unlockStage(wave+1)}settleStageResult(win);const stageText=t(win?"stageResultWin":"stageResultFail").replace(/\{stage\}/g,String(selectedStage+1)),goalText=t(win?(selectedStage===TOTAL_WAVES-1?"stageFinalGoal":"stageWinGoal"):"stageFailGoal").replace(/\{stage\}/g,String(selectedStage+1)).replace(/\{shots\}/g,String(firepowerLevel));$("resultCopy").textContent=stageText;$("resultWave").textContent=`${t("stage")} ${selectedStage+1} / ${TOTAL_WAVES}`;$("resultGoal").textContent=goalText;$("nextStageBtn").disabled=!win||selectedStage>=TOTAL_WAVES-1||selectedStage+1>=unlockedStage;$("nextStageBtn").setAttribute("aria-disabled",String($("nextStageBtn").disabled));return}v42Finish(win)};
  // v44 Long campaign and economy: the six authored waves are now the first
  // chapter of a thirty-stage campaign. Every Stage still owns one Battle
  // formation, while chapters introduce readable rule changes instead of a
  // hidden wave-number difficulty jump.
  function stageConfig(stageNumber){
    const stage=Math.max(1,Math.min(TOTAL_STAGES,Number(stageNumber)||1)),chapter=Math.min(5,Math.floor((stage-1)/5)),tier=(stage-1)%5;
    const ruleKeys=["ruleScout","ruleVolley","ruleArmor","ruleRelay","ruleCrossfire","ruleCore"];
    return{stage,chapter,tier,ruleKey:ruleKeys[chapter],cols:Math.min(11,7+Math.floor((stage-1)/5)),rows:Math.min(5,1+Math.floor((stage-1)/7)),gap:Math.max(72,106-Math.floor(stage/4)*5),moveEvery:Math.max(.3,1.22-stage*.026),enemyFireEvery:Math.max(.38,1.5-stage*.028),bulletSpeed:220+stage*3,edgeDrop:14+Math.min(12,Math.floor(stage/8)),lives:stage<=5?5:stage<=15?4:3,shield:stage<=3?6:stage%5===0?3:0,volley:chapter===1,relay:chapter===3,crossfire:chapter>=4,core:chapter===5,guardian:stage===30};
  }
  function saveEconomy(){try{localStorage.setItem("wp-alien-defender-credits",String(credits));localStorage.setItem("wp-alien-defender-firepower",String(firepowerLevel));localStorage.setItem("wp-alien-defender-upgrade-shield",String(shieldLevel));localStorage.setItem("wp-alien-defender-upgrade-hull",String(hullLevel));localStorage.setItem("wp-alien-defender-upgrade-rapid",String(rapidLevel))}catch{}}
  const V44_SHOT_OFFSETS={1:[0],2:[-18,18],3:[-32,0,32],4:[-48,-16,16,48],5:[-64,-32,0,32,64],6:[-82,-49,-16,16,49,82],7:[-96,-64,-32,0,32,64,96],8:[-108,-77,-46,-15,15,46,77,108],9:[-116,-87,-58,-29,0,29,58,87,116],10:[-124,-96,-68,-40,-13,13,40,68,96,124]};
  function makeV44World(){
    const config=stageConfig(wave),enemies=[],startX=(920-(config.cols-1)*config.gap)/2;
    for(let row=0;row<config.rows;row++)for(let col=0;col<config.cols;col++){
      const captain=config.chapter>=2&&((row===0&&col%2===0)||(row===config.rows-1&&col%3===1)),coreEnemy=config.core&&row===0&&col===Math.floor(config.cols/2),guardian=config.guardian&&row===Math.floor(config.rows/2)&&col===Math.floor(config.cols/2),armored=captain||coreEnemy||guardian;
      const y=112+row*54+(config.relay&&col%2?16:0),baseHp=2+Math.floor((config.stage-1)/10),hp=guardian?baseHp+6:coreEnemy?baseHp+3:armored?baseHp+2:baseHp;
      enemies.push({x:startX+col*config.gap,y,waveType:guardian?"captain":coreEnemy?"core":captain?"captain":"scout",isGuardian:guardian,isCore:coreEnemy,hp,maxHp:hp,hitFlash:0,alive:true});
    }
    return{config,enemies,dir:1,moveTimer:0,moveEvery:config.moveEvery,formationSpeed:(18+config.chapter*2)/config.moveEvery,descentRemaining:0,bullets:[],enemyBullets:[],player:{x:460,y:0},lives:config.lives+hullLevel,combo:1,shield:config.shield+shieldLevel*2,fireTimer:0,enemyFire:0,fireIndex:0,relayTimer:0,flash:0,creditsEarned:0,muzzleFlash:0};
  }
  makeWorld=makeV44World;
  function upgradeCost(kind){const level=kind==="firepower"?firepowerLevel:kind==="shield"?shieldLevel:kind==="hull"?hullLevel:rapidLevel;return kind==="firepower"?100+(level-1)*85:kind==="shield"?90+level*70:kind==="hull"?150+level*120:120+level*90}
  function upgradeLevel(kind){return kind==="firepower"?firepowerLevel:kind==="shield"?shieldLevel:kind==="hull"?hullLevel:rapidLevel}
  function upgradeMax(kind){return kind==="firepower"?MAX_FIREPOWER:kind==="shield"?5:kind==="hull"?3:4}
  function upgradeLabel(kind){return t(kind==="firepower"?"upgradeFirepower":kind==="shield"?"upgradeShield":kind==="hull"?"upgradeHull":"upgradeRapid")}
  function updateHudV44(){
    $("waveValue").textContent=`${t("stage")} ${selectedStage+1} / ${TOTAL_STAGES}`;
    $("scoreValue").textContent=score;$("bestValue").textContent=best;$("firepowerValue").textContent=firepowerLevel;$("livesValue").textContent=world?.lives||3;
    if($("creditValue"))$("creditValue").textContent=credits;if($("battleCreditValue"))$("battleCreditValue").textContent=credits;if($("resultCredits"))$("resultCredits").textContent=lastStageReward;
  }
  updateHud=updateHudV44;
  shoot=function shootV44(){
    if(screen!=="battle"||!world||world.fireTimer>0)return;
    const offsets=V44_SHOT_OFFSETS[firepowerLevel]||V44_SHOT_OFFSETS[MAX_FIREPOWER];
    for(const offset of offsets)world.bullets.push({x:Math.max(40,Math.min(880,world.player.x+offset)),y:625,s:-640});
    world.fireTimer=Math.max(.09,.22-rapidLevel*.03);world.muzzleFlash=.12;beep(760,.035);
  };
  update=function updateV44(dt){
    if(!world)return;
    const config=world.config,p=world.player;p.x+=((keys.right?1:0)-(keys.left?1:0))*420*dt;p.x=Math.max(45,Math.min(875,p.x));world.fireTimer=Math.max(0,world.fireTimer-dt);if(keys.fire)shoot();world.flash=Math.max(0,world.flash-dt);world.shield=Math.max(0,world.shield-dt);world.muzzleFlash=Math.max(0,(world.muzzleFlash||0)-dt);world.enemyFire+=dt;world.relayTimer+=dt;for(const enemy of world.enemies)enemy.hitFlash=Math.max(0,(enemy.hitFlash||0)-dt);
    const movingEnemies=world.enemies.filter(e=>e.alive);if(!movingEnemies.length){finish(true);return}if(world.descentRemaining>0){const drop=Math.min(world.descentRemaining,82*dt);movingEnemies.forEach(e=>e.y+=drop);world.descentRemaining-=drop}else{const min=Math.min(...movingEnemies.map(e=>e.x)),max=Math.max(...movingEnemies.map(e=>e.x)),step=world.dir*world.formationSpeed*dt;if(max+step>=875||min+step<=45){world.dir*=-1;world.descentRemaining=config.edgeDrop}else movingEnemies.forEach(e=>e.x+=step)}
    if(world.enemyFire>=config.enemyFireEvery){world.enemyFire=0;const active=world.enemies.filter(e=>e.alive);if(active.length){const volleyCount=config.volley?3:1;for(let shot=0;shot<volleyCount;shot++){const anchor=active[world.fireIndex++%active.length],spread=config.volley?(shot-1)*34:0;world.enemyBullets.push({x:anchor.x+spread,y:anchor.y+20,s:config.bulletSpeed+(config.volley?shot*10:0)})}const anchor=active[(world.fireIndex-1+active.length)%active.length];if(config.crossfire){const opposite=active.find(e=>e.x<460)!==anchor?active.find(e=>e.x<460):active.find(e=>e.x>460);if(opposite)world.enemyBullets.push({x:opposite.x,y:opposite.y+20,s:config.bulletSpeed+18})}if(config.core){const core=active.find(e=>e.isCore);if(core)world.enemyBullets.push({x:core.x,y:core.y+24,s:config.bulletSpeed+10})}if(config.guardian){world.enemyBullets.push({x:p.x,y:anchor.y+30,s:config.bulletSpeed+35})}}}
    if(config.relay&&world.relayTimer>1.1){world.relayTimer=0;const captain=world.enemies.find(e=>e.alive&&e.waveType==="captain");if(captain)world.enemyBullets.push({x:captain.x,y:captain.y+20,s:config.bulletSpeed+20})}
    for(const b of world.bullets){b.previousY=b.y;b.y+=b.s*dt}for(const b of world.enemyBullets)b.y+=b.s*dt;world.bullets=world.bullets.filter(b=>b.y>-20);world.enemyBullets=world.enemyBullets.filter(b=>b.y<760);
    for(const b of world.bullets){const previousY=b.previousY??b.y,minY=Math.min(previousY,b.y),maxY=Math.max(previousY,b.y),enemy=world.enemies.find(e=>{if(!e.alive)return false;const previousX=e.previousX??e.x,previousEnemyY=e.previousY??e.y,minX=Math.min(previousX,e.x)-27,maxX=Math.max(previousX,e.x)+27,minEnemyY=Math.min(previousEnemyY,e.y)-24,maxEnemyY=Math.max(previousEnemyY,e.y)+24;return b.x>=minX&&b.x<=maxX&&maxEnemyY>=minY&&minEnemyY<=maxY});if(!enemy)continue;b.y=-100;enemy.hp--;enemy.hitFlash=.14;if(enemy.hp<=0){enemy.alive=false;world.combo=Math.min(9,world.combo+1);score+=enemy.isGuardian?100:enemy.isCore?70:enemy.waveType==="captain"?40:10*world.combo;credits+=5;world.creditsEarned+=5;saveEconomy();beep(enemy.isGuardian?1080:enemy.isCore?1020:enemy.waveType==="captain"?940:620,.04);$("battleMessage").textContent=t("hit")}else{beep(460,.035);$("battleMessage").textContent=t("hit")}}
    for(const b of world.enemyBullets){if(Math.abs(b.x-p.x)>=24||Math.abs(b.y-625)>=28)continue;b.y=800;if(world.shield>0){$("battleMessage").textContent=t("shield");beep(420,.06)}else{world.lives--;world.combo=1;world.flash=.35;beep(180,.13);if(world.lives<=0){finish(false);return}}}
    const active=world.enemies.filter(e=>e.alive),lowest=active.length?Math.max(...active.map(e=>e.y)):-99;if(lowest>570){finish(false);return}if(!active.length){finish(true);return}updateHudV44();
  };
  function renderStageCardsV44(){
    const rail=$("stageRail");if(!rail)return;rail.textContent="";$("stageProgressText").textContent=t("stageProgress").replace(/\{unlocked\}/g,String(unlockedStage));if($("creditValue"))$("creditValue").textContent=credits;
    for(let index=0;index<TOTAL_STAGES;index++){const number=index+1,config=stageConfig(number),available=index<unlockedStage,card=document.createElement("button");card.type="button";card.className="stage-card";card.dataset.stageIndex=String(index);card.disabled=!available;card.setAttribute("aria-disabled",String(!available));card.setAttribute("aria-posinset",String(number));card.setAttribute("aria-setsize",String(TOTAL_STAGES));card.setAttribute("aria-label",`${t("stage")} ${number} · ${t(config.ruleKey)} · ${available?t("stageUnlocked"):t("stageLocked")}`);card.setAttribute("aria-current",index===selectedStage?"true":"false");card.classList.toggle("locked",!available);const numberNode=document.createElement("span");numberNode.className="stage-card-number";numberNode.textContent=String(number).padStart(2,"0");const name=document.createElement("strong");name.className="stage-card-name";name.textContent=`${t("stage")} ${number}`;const power=document.createElement("span");power.className="stage-card-power";power.textContent=t("stagePower").replace(/\{shots\}/g,String(firepowerLevel));const rule=document.createElement("span");rule.className="stage-card-rule";rule.textContent=t(config.ruleKey);const status=document.createElement("span");status.className="stage-card-status";status.textContent=available?t("stageUnlocked"):t("stageLocked");card.append(numberNode,name,power,rule,status);card.addEventListener("click",event=>{if(!available)return;event.stopPropagation();selectedStage=index;start(index)});rail.append(card)}
  }
  renderStageCards=renderStageCardsV44;
  function exposeStagePoolCards(){
    const rail=$("stageRail");
    if(!rail)return;
    rail.querySelectorAll("[data-wp-stage-pool-node]").forEach((card)=>{
      // The shared virtualizer demotes source cards into an aria-hidden store.
      // Recycled cards are visible controls and must not inherit that state.
      card.removeAttribute("aria-hidden");
    });
  }
  const stagePoolA11yObserver=new MutationObserver(exposeStagePoolCards);
  stagePoolA11yObserver.observe($("stageRail"),{subtree:true,childList:true,attributes:true,attributeFilter:["aria-hidden"]});
  exposeStagePoolCards();
  let upgradeReturnFocus=null;
  function closeUpgradePanel(){const panel=$("upgradePanel"),shell=document.querySelector(".stage-shell");if(panel)panel.hidden=true;if(shell){shell.inert=false;shell.removeAttribute("aria-hidden")}document.body.classList.remove("wp-upgrades-open");if(upgradeReturnFocus?.isConnected)upgradeReturnFocus.focus({preventScroll:true});upgradeReturnFocus=null}
  function renderUpgrades(){
    if($("creditValue"))$("creditValue").textContent=credits;if($("shopCreditValue"))$("shopCreditValue").textContent=credits;
    document.querySelectorAll("[data-upgrade]").forEach(button=>{const kind=button.dataset.upgrade,level=upgradeLevel(kind),max=upgradeMax(kind),cost=upgradeCost(kind),levelNode=button.querySelector("[data-upgrade-level]"),costNode=button.querySelector("[data-upgrade-cost]"),action=button.querySelector("[data-upgrade-action]");if(levelNode)levelNode.textContent=`${level} / ${max}`;if(costNode)costNode.textContent=level>=max?t("maxed"):t("upgradeCost").replace(/\{cost\}/g,String(cost));if(action)action.textContent=level>=max?t("maxed"):cost>credits?`${t("buy")} · ${cost}`:t("buy");button.disabled=level>=max||cost>credits;button.setAttribute("aria-disabled",String(button.disabled))});
  }
  function openUpgradePanel(){renderUpgrades();const panel=$("upgradePanel"),shell=document.querySelector(".stage-shell");if(panel){if(panel.hidden)upgradeReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;if(shell){shell.inert=true;shell.setAttribute("aria-hidden","true")}panel.hidden=false;document.body.classList.add("wp-upgrades-open");$("closeShopBtn")?.focus({preventScroll:true})}}
  function buyUpgrade(kind){const level=upgradeLevel(kind),max=upgradeMax(kind),cost=upgradeCost(kind);if(level>=max||credits<cost)return;credits-=cost;if(kind==="firepower")firepowerLevel++;if(kind==="shield")shieldLevel++;if(kind==="hull")hullLevel++;if(kind==="rapid")rapidLevel++;saveEconomy();renderUpgrades();renderStageCardsV44();updateHudV44();beep(960,.12)}
  document.querySelectorAll("[data-upgrade]").forEach(button=>button.addEventListener("click",()=>buyUpgrade(button.dataset.upgrade)));
  if($("shopBtn"))$("shopBtn").addEventListener("click",openUpgradePanel);
  if($("closeShopBtn"))$("closeShopBtn").addEventListener("click",closeUpgradePanel);
  document.addEventListener("click",event=>{const target=event.target instanceof Element?event.target.closest("#shopBtn,#closeShopBtn,#stageBackBtn"):null;if(!target)return;if(target.id==="shopBtn")openUpgradePanel();if(target.id==="closeShopBtn")closeUpgradePanel();if(target.id==="stageBackBtn"){cancelAnimationFrame(raf);show("main")}});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("upgradePanel")?.hidden){event.preventDefault();closeUpgradePanel()}});
  const v44Start=start;
  start=function startV44(stageIndex=selectedStage){closeUpgradePanel();v44Start(Math.max(0,Math.min(TOTAL_STAGES-1,Number(stageIndex)||0)));if(world){const config=world.config||stageConfig(wave);$("battleMessage").textContent=t("stageGoal").replace(/\{stage\}/g,String(wave)).replace(/\{rule\}/g,t(config.ruleKey))}updateHudV44()};
  function openStageSelectorV44(){closeUpgradePanel();cancelAnimationFrame(raf);selectedStage=Math.max(0,Math.min(TOTAL_STAGES-1,unlockedStage-1));renderStageCardsV44();show("stage");const active=$("stageRail")?.querySelector(`.stage-card[data-stage-index="${selectedStage}"]`);active?.focus({preventScroll:true});renderUpgrades()}
  openStageSelector=openStageSelectorV44;
  const v44OldFinish=finish;
  finish=function finishV44(win){
    if(!stageMode){v44OldFinish(win);return}cancelAnimationFrame(raf);const config=stageConfig(wave),runCredits=world?.creditsEarned||0;if(win&&!stageResultAwarded){stageResultAwarded=true;const clearReward=config.clearReward||90+wave*8;credits+=clearReward;lastStageReward=runCredits+clearReward;unlockStage(wave+1);saveEconomy()}else lastStageReward=runCredits;if(score>best){best=score;try{localStorage.setItem("wp-alien-defender-best",String(best))}catch{}}track("result",{wave,result_reason:win?"stage_cleared":"defense_line_or_lives"});if(win)track("wave_clear",{wave,result_reason:"formation_cleared"});show("result");$("resultTitle").textContent=t(win?"winTitle":"loseTitle");$("resultCopy").textContent=t(win?"stageResultWin":"stageResultFail").replace(/\{stage\}/g,String(wave));$("resultScore").textContent=score;$("resultBest").textContent=best;$("resultWave").textContent=`${t("stage")} ${wave} / ${TOTAL_STAGES}`;if($("resultCredits"))$("resultCredits").textContent=lastStageReward;const goalKey=win?(wave===TOTAL_STAGES?"stageFinalGoal":"stageWinGoal"):"stageFailGoal";$("resultGoal").textContent=t(goalKey).replace(/\{stage\}/g,String(wave)).replace(/\{credits\}/g,String(lastStageReward)).replace(/\{shots\}/g,String(firepowerLevel));$("nextStageBtn").disabled=!win||wave>=TOTAL_STAGES||wave>=unlockedStage;$("nextStageBtn").setAttribute("aria-disabled",String($("nextStageBtn").disabled));beep(win?1000:130,.16);
  };
  $("resultStages")?.addEventListener("click",openStageSelector);
  $("nextStageBtn")?.addEventListener("click",()=>{if(selectedStage<TOTAL_WAVES-1&&selectedStage+1<unlockedStage)start(selectedStage+1)});
  window.addEventListener("blur",()=>v40ReleaseInput());
  document.addEventListener("visibilitychange",()=>{if(document.hidden)v40ReleaseInput()});
  const v45Draw=draw;
  draw=function drawWithEnemyDurability(dt){
    v45Draw(dt);
    if(screen!=="battle"||!world?.enemies?.length)return;
    const cssW=Math.max(1,canvas.clientWidth),cssH=Math.max(1,canvas.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1),scale=Math.min(cssW/920,cssH/720)||1,logicalW=cssW/scale,logicalH=cssH/scale,mapX=x=>x/920*logicalW,mapY=y=>y/720*logicalH;
    ctx.save();ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);
    for(const enemy of world.enemies){if(!enemy.alive||enemy.maxHp<=1)continue;const x=mapX(enemy.x),y=mapY(enemy.y),width=46,ratio=Math.max(0,enemy.hp/enemy.maxHp);ctx.fillStyle="#080b20cc";ctx.fillRect(x-width/2,y-31,width,5);ctx.fillStyle=ratio>.5?"#74e6ee":ratio>.25?"#ffd47c":"#ff879f";ctx.fillRect(x-width/2,y-31,width*ratio,5);if(enemy.hitFlash>0){ctx.globalAlpha=Math.min(1,enemy.hitFlash/.14);ctx.strokeStyle="#ffffff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,31+(1-enemy.hitFlash/.14)*5,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1}}
    ctx.restore();
  };
  if(window.__alienDefenderSmoke){window.__alienDefenderSmoke.combatSnapshot=()=>({screen,wave,formationSpeed:world?.formationSpeed,descentRemaining:world?.descentRemaining,enemies:world?.enemies?.filter(enemy=>enemy.alive).map(enemy=>({x:enemy.x,y:enemy.y,hp:enemy.hp,maxHp:enemy.maxHp,type:enemy.waveType})).slice(0,4)});window.__alienDefenderSmoke.inputSnapshot=()=>({keys:{...keys},activePointers:[...controlPointers.entries()],playerX:world?.player?.x??null,bulletCount:world?.bullets?.length??0})}
  // v50 Director repair: carry each formation member's prior position into
  // the existing swept projectile check. A target may move horizontally or
  // descend during the same frame that a visible shot crosses its lane; the
  // hit bounds stay unchanged while the collision follows that authored move.
  const v50Update=update;
  update=function updateWithSweptFormationBounds(dt){
    if(world?.enemies)for(const enemy of world.enemies){enemy.previousX=enemy.x;enemy.previousY=enemy.y}
    v50Update(dt);
  };
})();
