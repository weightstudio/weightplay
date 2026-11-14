/* Topic collection: original editorial presentation; progress is owned by WeightPlayCollections. */
(function () {
  'use strict';
  // title, intro, close, collected, locked, unlock instruction, read, back,
  // fiction label, game image caption, play, article heading, standfirst, story
  const copy = {
    en: ['Topic Newsroom','Collect stories by completing games in this hall.','Close','Collected','Not collected','Complete this game to collect its story.','Read story','Back to stories','Fictional game story','Gameplay image','Play game','A tram takes to the rooftops','A cup of tea is along for the ride.','A block-built tram lifts off between rooftop pads. The pilot must keep the tea steady while navigating the sky and landing safely. This story is set in the game’s fictional world.'],
    'zh-Hant': ['熱梗新聞室','完成熱梗館的遊戲，收藏一則則故事。','關閉','已收藏','尚未收藏','完成這款遊戲即可收藏故事。','閱讀故事','返回故事列表','遊戲虛構故事','遊戲實際畫面','前往遊戲','電車飛上屋頂，珍奶也跟著出發','一杯珍奶，陪著電車展開空中旅程。','方塊電車從屋頂起飛，在空中穿梭並準備降落。駕駛要穩住車內的珍奶，安全抵達下一座屋頂。這則故事發生在遊戲的虛構世界。'],
    'zh-Hans': ['热梗新闻室','完成热梗馆的游戏，收藏一则则故事。','关闭','已收藏','尚未收藏','完成这款游戏即可收藏故事。','阅读故事','返回故事列表','游戏虚构故事','游戏实际画面','前往游戏','电车飞上屋顶，珍奶也跟着出发','一杯珍奶，陪着电车展开空中旅程。','方块电车从屋顶起飞，在空中穿梭并准备降落。驾驶员要稳住车内的珍奶，安全抵达下一座屋顶。这则故事发生在游戏的虚构世界。'],
    ja: ['話題のニュースルーム','この館のゲームをクリアして、物語を集めよう。','閉じる','収集済み','未収集','このゲームをクリアすると物語を収集できます。','記事を読む','記事一覧へ','ゲームの架空の物語','ゲームの実画面','ゲームへ','トラムが屋上から空へ、タピオカも一緒に','一杯のタピオカを乗せて空の旅へ。','ブロックのトラムが屋上から飛び立ち、空を進んで着陸を目指します。運転手は車内のタピオカをこぼさないよう、次の屋上へ安全に向かいます。これはゲームの架空世界の物語です。'],
    ko: ['화제 뉴스룸','이 공간의 게임을 완료하고 이야기를 모아 보세요.','닫기','수집 완료','미수집','이 게임을 완료하면 이야기를 수집할 수 있어요.','이야기 읽기','목록으로','게임 속 가상 이야기','실제 게임 화면','게임 하러 가기','전차와 버블티가 옥상 위 하늘로','버블티 한 잔과 함께하는 하늘 여행.','블록 전차가 옥상에서 이륙해 하늘을 지나 착륙을 준비합니다. 운전사는 차 안의 버블티를 지키며 다음 옥상에 안전하게 도착해야 합니다. 이 이야기는 게임 속 가상 세계를 배경으로 합니다.'],
    es: ['Sala de noticias','Completa juegos de esta sala para coleccionar historias.','Cerrar','En tu colección','Sin coleccionar','Completa este juego para guardar su historia.','Leer historia','Volver a las historias','Historia ficticia del juego','Imagen del juego','Ir al juego','Un tranvía vuela entre azoteas con un té a bordo','Un té de burbujas acompaña el viaje.','Un tranvía de bloques despega desde una azotea, cruza el cielo y se prepara para aterrizar. El piloto debe mantener estable el té y llegar a salvo a la siguiente azotea. Esta historia transcurre en el mundo ficticio del juego.'],
    'pt-BR': ['Sala de notícias','Complete jogos desta sala para colecionar histórias.','Fechar','Na coleção','Não coletada','Complete este jogo para guardar a história.','Ler história','Voltar às histórias','História fictícia do jogo','Imagem do jogo','Ir ao jogo','Um bonde voa entre telhados com chá a bordo','Um chá de bolhas acompanha a viagem.','Um bonde de blocos decola de um telhado, cruza o céu e se prepara para pousar. O piloto precisa manter o chá estável e chegar em segurança ao próximo telhado. A história acontece no mundo fictício do jogo.'],
    fr: ['Salle de rédaction','Terminez les jeux de cette salle pour collectionner leurs histoires.','Fermer','Dans la collection','Non collectionné','Terminez ce jeu pour collectionner son histoire.','Lire l’histoire','Retour aux histoires','Histoire fictive du jeu','Image du jeu','Jouer','Un tram s’envole entre les toits avec son thé','Un thé aux perles accompagne le voyage.','Un tram en blocs décolle d’un toit, traverse le ciel et prépare son atterrissage. Le pilote doit garder le thé stable et rejoindre le toit suivant sans encombre. Cette histoire se déroule dans l’univers fictif du jeu.'],
    de: ['Themen-Redaktion','Schließe Spiele in dieser Halle ab und sammle ihre Geschichten.','Schließen','Gesammelt','Noch nicht gesammelt','Schließe dieses Spiel ab, um die Geschichte zu sammeln.','Geschichte lesen','Zurück zur Übersicht','Fiktive Spielgeschichte','Spielaufnahme','Zum Spiel','Eine Bahn fliegt mit Tee über die Dächer','Ein Becher Bubble Tea reist mit.','Eine Bahn aus Blöcken hebt von einem Dach ab, fliegt durch den Himmel und bereitet die Landung vor. Der Fahrer muss den Tee ruhig halten und sicher das nächste Dach erreichen. Diese Geschichte spielt in der fiktiven Welt des Spiels.'],
    it: ['Redazione dei temi','Completa i giochi di questa sala per collezionare storie.','Chiudi','Nella collezione','Non raccolta','Completa questo gioco per collezionare la storia.','Leggi la storia','Torna alle storie','Storia immaginaria del gioco','Immagine di gioco','Vai al gioco','Un tram vola tra i tetti con un tè a bordo','Un bubble tea accompagna il viaggio.','Un tram a blocchi decolla da un tetto, attraversa il cielo e si prepara ad atterrare. Il pilota deve tenere fermo il tè e raggiungere in sicurezza il tetto successivo. La storia è ambientata nel mondo immaginario del gioco.'],
    ru: ['Редакция новостей','Проходите игры этого зала и собирайте истории.','Закрыть','В коллекции','Не собрано','Пройдите эту игру, чтобы собрать историю.','Читать историю','К списку историй','Вымышленная история игры','Кадр из игры','К игре','Трамвай взлетает над крышами с чаем на борту','Стакан бабл-ти отправляется в полёт.','Блочный трамвай взлетает с крыши, пересекает небо и готовится к посадке. Водителю нужно удержать чай и безопасно добраться до следующей крыши. История происходит в вымышленном мире игры.'],
    hi: ['ख़बरों का कक्ष','इस कक्ष के खेल पूरे करके कहानियाँ जुटाएँ।','बंद करें','संग्रह में','अभी संग्रह में नहीं','कहानी जुटाने के लिए यह खेल पूरा करें।','कहानी पढ़ें','कहानियों पर लौटें','खेल की काल्पनिक कहानी','खेल का दृश्य','खेल पर जाएँ','चाय के साथ छतों के ऊपर उड़ी ट्राम','एक कप बबल टी भी सफ़र पर है।','ब्लॉक वाली ट्राम छत से उड़ती है, आसमान पार करती है और उतरने की तैयारी करती है। चालक को चाय संभालकर अगली छत पर सुरक्षित पहुँचना है। यह कहानी खेल की काल्पनिक दुनिया में घटती है।'],
    ar: ['غرفة أخبار المواضيع','أكمل ألعاب هذه القاعة لتجمع قصصها.','إغلاق','في مجموعتك','لم تُجمع بعد','أكمل هذه اللعبة لجمع قصتها.','اقرأ القصة','العودة إلى القصص','قصة خيالية من اللعبة','لقطة من اللعبة','اذهب إلى اللعبة','ترام يحلّق بين الأسطح ومعه الشاي','كوب من شاي الفقاعات يرافق الرحلة.','يقلع ترام مكعب من سطح، ويعبر السماء ويستعد للهبوط. على السائق تثبيت الشاي والوصول بأمان إلى السطح التالي. تجري هذه القصة في عالم اللعبة الخيالي.']
  };
  // Original summaries of the cited reports. The game itself is fictional.
  // Fields: label, headline, standfirst, event, game disclaimer, source label.
  const news = {
    en: ['THE STORY','Tesla Roadster makes a short leap at a demonstration','A ramp-assisted jump drew attention to the new sports car.','On 15 October 2026 in Texas, Tesla demonstrated a next-generation Roadster. The car went up a curved ramp, briefly became airborne, rotated and landed. The demonstration did not establish sustained flight or ordinary road use.','Skybound Tram is an original fictional game, not an official Tesla product or collaboration.','Read the reporting'],
    'zh-Hant': ['事件背景','Tesla Roadster 展示短暫躍起，引發熱議','新款跑車藉由斜坡起跳的畫面成為話題。','2026 年 10 月 15 日，Tesla 在美國德州展示新一代 Roadster。車輛沿彎曲斜坡駛上，短暫離地、翻轉後落地；這場展示並未證明車輛能持續飛行，或可在一般道路如此使用。','《飛天電車》是原創虛構遊戲，並非 Tesla 官方產品或合作作品。','閱讀報導'],
    'zh-Hans': ['事件背景','Tesla Roadster 展示短暂跃起，引发热议','新款跑车借助斜坡起跳的画面成为话题。','2026 年 10 月 15 日，Tesla 在美国得克萨斯州展示新一代 Roadster。车辆沿弯曲斜坡驶上，短暂离地、翻转后落地；这场展示并未证明车辆能持续飞行，或可在普通道路如此使用。','《飞天电车》是原创虚构游戏，并非 Tesla 官方产品或合作作品。','阅读报道'],
    ja: ['出来事','Tesla Roadster の短い跳躍が話題に','新型スポーツカーが斜面を使って跳ぶ姿に注目が集まりました。','2026年10月15日、Tesla は米国テキサス州で次世代 Roadster を披露しました。車は湾曲したスロープを上り、短く宙に浮いて回転し、着地しました。この実演は持続飛行や一般道路での使用を証明するものではありません。','「空飛ぶトラム」はオリジナルの架空ゲームで、Tesla の公式製品や共同作品ではありません。','報道を読む'],
    ko: ['사건 배경','Tesla Roadster의 짧은 도약 시연이 화제','새 스포츠카가 경사로를 이용해 뛰어오르는 장면이 주목받았습니다.','2026년 10월 15일 Tesla는 미국 텍사스에서 차세대 Roadster를 선보였습니다. 차량은 굽은 경사로를 올라 잠시 공중에 떠 회전한 뒤 착지했습니다. 이 시연은 지속 비행이나 일반 도로에서의 사용을 입증하지 않았습니다.','「하늘 전차」는 독창적인 가상 게임이며 Tesla의 공식 제품이나 협업 작품이 아닙니다.','보도 읽기'],
    es: ['EL HECHO','Un Tesla Roadster da un breve salto en una demostración','El salto del nuevo deportivo con ayuda de una rampa llamó la atención.','El 15 de octubre de 2026, Tesla presentó en Texas, EE. UU., un Roadster de nueva generación. El coche subió por una rampa curva, quedó brevemente en el aire, giró y aterrizó. La demostración no probó un vuelo sostenido ni su uso así en vías públicas.','Tranvía Volador es un juego original de ficción; no es un producto oficial de Tesla ni una colaboración.','Leer la noticia'],
    'pt-BR': ['O ACONTECIMENTO','Tesla Roadster dá um breve salto em demonstração','O salto do novo esportivo com ajuda de uma rampa chamou atenção.','Em 15 de outubro de 2026, a Tesla apresentou um Roadster de nova geração no Texas, EUA. O carro subiu uma rampa curva, ficou brevemente no ar, girou e pousou. A demonstração não comprovou voo sustentado nem uso assim em vias públicas.','Bonde Voador é um jogo original de ficção, não um produto oficial ou colaboração da Tesla.','Ler a reportagem'],
    fr: ['LES FAITS','Une Tesla Roadster effectue un bref saut en démonstration','Le saut du nouveau véhicule à l’aide d’une rampe a attiré l’attention.','Le 15 octobre 2026, Tesla a présenté au Texas, aux États-Unis, une Roadster de nouvelle génération. La voiture a emprunté une rampe courbe, brièvement quitté le sol, tourné puis atterri. La démonstration n’a pas établi un vol prolongé ni un tel usage sur route ouverte.','Tramway Volant est un jeu de fiction original, sans statut de produit officiel ni collaboration avec Tesla.','Lire les articles'],
    de: ['HINTERGRUND','Tesla Roadster zeigt bei Vorführung einen kurzen Sprung','Der rampengestützte Sprung des neuen Sportwagens sorgte für Aufmerksamkeit.','Am 15. Oktober 2026 zeigte Tesla in Texas, USA, einen Roadster der nächsten Generation. Das Auto fuhr eine gekrümmte Rampe hinauf, hob kurz ab, drehte sich und landete. Die Vorführung belegte weder dauerhaften Flug noch eine solche Nutzung im Straßenverkehr.','Himmelsbahn ist ein eigenständiges fiktives Spiel, kein offizielles Tesla-Produkt und keine Kooperation.','Berichte lesen'],
    it: ['IL FATTO','Una Tesla Roadster compie un breve salto durante una dimostrazione','Il salto della nuova sportiva con l’aiuto di una rampa ha attirato attenzione.','Il 15 ottobre 2026 Tesla ha presentato in Texas, negli Stati Uniti, una Roadster di nuova generazione. L’auto ha percorso una rampa curva, si è sollevata brevemente, ha ruotato ed è atterrata. La dimostrazione non ha provato un volo prolungato né un simile uso sulle strade pubbliche.','Tram Volante è un gioco originale di fantasia, non un prodotto ufficiale Tesla né una collaborazione.','Leggi gli articoli'],
    ru: ['ЧТО ПРОИЗОШЛО','Tesla Roadster совершил короткий прыжок на демонстрации','Прыжок нового спорткара с рампы привлёк внимание.','15 октября 2026 года Tesla представила в Техасе, США, Roadster нового поколения. Автомобиль поднялся по изогнутой рампе, ненадолго оторвался от земли, перевернулся и приземлился. Демонстрация не доказала длительный полёт или такое использование на обычных дорогах.','«Летающий трамвай» — оригинальная вымышленная игра, не официальный продукт Tesla и не совместный проект.','Читать публикации'],
    hi: ['क्या हुआ','प्रदर्शन में Tesla Roadster ने छोटी छलाँग लगाई','रैंप की मदद से नई स्पोर्ट्स कार की छलाँग चर्चा में रही।','15 अक्टूबर 2026 को Tesla ने अमेरिका के टेक्सास में नई पीढ़ी की Roadster दिखाई। कार घुमावदार रैंप पर चढ़ी, थोड़ी देर हवा में उठी, घूमी और उतरी। इस प्रदर्शन से लगातार उड़ान या सामान्य सड़क पर ऐसे उपयोग का प्रमाण नहीं मिला।','उड़ती ट्राम एक मूल काल्पनिक खेल है; यह Tesla का आधिकारिक उत्पाद या सहयोग नहीं है।','रिपोर्ट पढ़ें'],
    ar: ['ما الذي حدث','قفزة قصيرة لسيارة Tesla Roadster خلال عرض','لفتت قفزة السيارة الرياضية الجديدة بمساعدة منحدر الانتباه.','في 15 أكتوبر 2026، عرضت Tesla جيلاً جديداً من Roadster في تكساس بالولايات المتحدة. صعدت السيارة منحدراً منحنياً، وارتفعت لفترة قصيرة ودارت ثم هبطت. لم يثبت العرض طيراناً مستمراً أو استخداماً مماثلاً على الطرق العامة.','الترام الطائر لعبة خيالية أصلية وليست منتجاً رسمياً أو تعاوناً مع Tesla.','اقرأ التقارير']
  };
  const trafficNews = {
    en:['THE STORY','Holiday traffic forecast in Taiwan','The freeway authority warned of busy routes over the National Day holiday.','On 8 October 2026, Taiwan’s freeway authority forecast congestion during the 9–11 October holiday and advised travellers to plan ahead.','Traffic Jam Diner is an original fictional game, not an account of the forecast.','Official notice'],
    'zh-Hant':['事件背景','國慶連假交通預報','高公局提醒連假期間部分國道路段可能壅塞。','2026 年 10 月 8 日，高公局預測 10 月 9 至 11 日國慶連假期間的交通壅塞，提醒用路人事先規劃行程。','《交通塞車餐館》是原創虛構遊戲，並非這則預報的事件重現。','官方公告'],
    'zh-Hans':['事件背景','国庆连假交通预报','高速公路局提醒连假期间部分路段可能拥堵。','2026 年 10 月 8 日，台湾高速公路局预测 10 月 9 至 11 日国庆连假期间的交通拥堵，提醒出行者提前规划行程。','《交通塞车餐馆》是原创虚构游戏，并非这则预报的事件重现。','官方公告'],
    ja:['出来事','台湾の連休交通予測','高速道路当局が連休中の渋滞に注意を呼びかけました。','2026年10月8日、台湾の高速道路当局は10月9〜11日の連休中の渋滞を予測し、事前の計画を呼びかけました。','このゲームはオリジナルの架空作品で、予報を再現したものではありません。','公式発表'],
    ko:['사건 배경','대만 연휴 교통 예보','고속도로 당국이 연휴 기간 혼잡을 예고했습니다.','2026년 10월 8일 대만 고속도로 당국은 10월 9~11일 연휴의 정체를 예측하고 미리 이동 계획을 세우도록 안내했습니다.','이 게임은 독창적인 가상 작품이며 예보를 재현한 것이 아닙니다.','공식 안내'],
    es:['EL HECHO','Previsión de tráfico para el festivo en Taiwán','La autoridad de autopistas advirtió de posibles retenciones.','El 8 de octubre de 2026, la autoridad de autopistas de Taiwán previó congestión durante el festivo del 9 al 11 de octubre y aconsejó planificar el viaje.','El juego es una ficción original, no una recreación de la previsión.','Aviso oficial'],
    'pt-BR':['O ACONTECIMENTO','Previsão de trânsito para o feriado em Taiwan','A autoridade rodoviária alertou para possíveis congestionamentos.','Em 8 de outubro de 2026, a autoridade rodoviária de Taiwan previu congestionamentos no feriado de 9 a 11 de outubro e recomendou planejar a viagem.','O jogo é uma ficção original, não uma reconstituição da previsão.','Comunicado oficial'],
    fr:['LES FAITS','Prévisions de circulation pour les congés à Taïwan','L’autorité autoroutière a signalé des risques de congestion.','Le 8 octobre 2026, l’autorité autoroutière de Taïwan a prévu des embouteillages pendant les congés du 9 au 11 octobre et conseillé de préparer son trajet.','Ce jeu est une fiction originale, pas une reconstitution de ces prévisions.','Communiqué officiel'],
    de:['HINTERGRUND','Verkehrsprognose für die Feiertage in Taiwan','Die Autobahnbehörde warnte vor möglichen Staus.','Am 8. Oktober 2026 prognostizierte Taiwans Autobahnbehörde Staus für die Feiertage vom 9. bis 11. Oktober und empfahl, Fahrten im Voraus zu planen.','Das Spiel ist eine eigenständige Fiktion und keine Nachstellung der Prognose.','Offizielle Mitteilung'],
    it:['IL FATTO','Previsioni sul traffico per le festività a Taiwan','L’autorità autostradale ha avvertito di possibili code.','L’8 ottobre 2026 l’autorità autostradale di Taiwan ha previsto congestione durante le festività dal 9 all’11 ottobre e consigliato di pianificare il viaggio.','Il gioco è una fiction originale, non una ricostruzione delle previsioni.','Avviso ufficiale'],
    ru:['ЧТО ПРОИЗОШЛО','Прогноз движения на праздники в Тайване','Дорожное ведомство предупредило о возможных пробках.','8 октября 2026 года дорожное ведомство Тайваня прогнозировало заторы на праздниках 9–11 октября и посоветовало заранее планировать поездки.','Игра — оригинальный вымысел, а не реконструкция прогноза.','Официальное сообщение'],
    hi:['क्या हुआ','ताइवान की छुट्टियों का यातायात पूर्वानुमान','राजमार्ग प्राधिकरण ने जाम की आशंका जताई।','8 अक्टूबर 2026 को ताइवान के राजमार्ग प्राधिकरण ने 9–11 अक्टूबर की छुट्टियों में जाम का पूर्वानुमान दिया और पहले से यात्रा की योजना बनाने को कहा।','यह खेल मूल काल्पनिक रचना है, पूर्वानुमान का पुनर्निर्माण नहीं।','आधिकारिक सूचना'],
    ar:['ما الذي حدث','توقعات حركة المرور لعطلة تايوان','حذرت هيئة الطرق السريعة من ازدحام محتمل.','في 8 أكتوبر 2026، توقعت هيئة الطرق السريعة في تايوان ازدحاماً خلال عطلة 9–11 أكتوبر ونصحت بالتخطيط للرحلات مسبقاً.','اللعبة عمل خيالي أصلي وليست إعادة تمثيل للتوقعات.','البيان الرسمي']
  };
  const robotNews = {
    en:['THE STORY','Robots and dancers share a Shanghai stage','Humanoid robots joined performers at a skills competition opening.','On 22 September 2026, humanoid robots performed with dancers at the opening of WorldSkills Shanghai. The real performance featured humanoid robots, not robot dogs.','Robot Dog Showtime is an original fictional game, not a recreation or official event product.','Official report'],
    'zh-Hant':['事件背景','機器人與舞者同台演出','世界技能大賽上海開幕式結合機器人與表演。','2026 年 9 月 22 日，世界技能大賽在上海開幕，人形機器人與舞者共同演出。實際登台的是人形機器人，並非機器狗。','《機器狗才藝秀》是原創虛構遊戲，並非該演出的重現或官方作品。','官方報導'],
    'zh-Hans':['事件背景','机器人与舞者同台演出','世界技能大赛上海开幕式结合机器人与表演。','2026 年 9 月 22 日，世界技能大赛在上海开幕，人形机器人与舞者共同演出。实际登台的是人形机器人，并非机器狗。','《机器狗才艺秀》是原创虚构游戏，并非该演出的重现或官方作品。','官方报道'],
    ja:['出来事','ロボットとダンサーが上海で共演','技能競技大会の開会式で人型ロボットが出演しました。','2026年9月22日、上海の国際技能競技大会の開会式で人型ロボットがダンサーと共演しました。実際に出演したのは人型ロボットで、ロボット犬ではありません。','このゲームはオリジナルの架空作品で、実演の再現や公式作品ではありません。','公式報道'],
    ko:['사건 배경','상하이 무대에 함께 선 로봇과 무용수','기능 대회 개막식에 휴머노이드 로봇이 참여했습니다.','2026년 9월 22일 상하이 세계기능올림픽 개막식에서 휴머노이드 로봇이 무용수들과 공연했습니다. 실제 공연의 로봇은 개가 아닌 사람 형태였습니다.','이 게임은 독창적인 가상 작품이며 공연의 재현이나 공식 작품이 아닙니다.','공식 보도'],
    es:['EL HECHO','Robots y bailarines comparten escenario en Shanghái','Robots humanoides participaron en la apertura de una competición de habilidades.','El 22 de septiembre de 2026, robots humanoides actuaron con bailarines en la apertura de WorldSkills Shanghái. La actuación real presentó robots humanoides, no perros robot.','El juego es una ficción original, no una recreación ni un producto oficial del evento.','Informe oficial'],
    'pt-BR':['O ACONTECIMENTO','Robôs e dançarinos dividem palco em Xangai','Robôs humanoides participaram da abertura de uma competição de habilidades.','Em 22 de setembro de 2026, robôs humanoides se apresentaram com dançarinos na abertura do WorldSkills Xangai. A apresentação real teve robôs humanoides, não cães robôs.','O jogo é uma ficção original, não uma reconstituição nem produto oficial do evento.','Reportagem oficial'],
    fr:['LES FAITS','Robots et danseurs partagent la scène à Shanghai','Des robots humanoïdes ont participé à l’ouverture d’une compétition des métiers.','Le 22 septembre 2026, des robots humanoïdes ont dansé avec des artistes à l’ouverture de WorldSkills Shanghai. La représentation mettait en scène des robots humanoïdes, pas des chiens robots.','Ce jeu est une fiction originale, ni reconstitution ni produit officiel de l’événement.','Article officiel'],
    de:['HINTERGRUND','Roboter und Tänzer gemeinsam auf einer Bühne in Shanghai','Humanoide Roboter traten bei der Eröffnung eines Berufswettbewerbs auf.','Am 22. September 2026 traten humanoide Roboter bei der Eröffnung von WorldSkills Shanghai mit Tänzern auf. Die reale Aufführung zeigte humanoide Roboter, keine Roboterhunde.','Das Spiel ist eine eigenständige Fiktion, keine Nachstellung und kein offizielles Produkt der Veranstaltung.','Offizieller Bericht'],
    it:['IL FATTO','Robot e ballerini insieme sul palco a Shanghai','Robot umanoidi hanno partecipato all’apertura di una gara di abilità.','Il 22 settembre 2026 robot umanoidi si sono esibiti con ballerini all’apertura di WorldSkills Shanghai. Lo spettacolo reale presentava robot umanoidi, non cani robot.','Il gioco è una fiction originale, non una ricostruzione né un prodotto ufficiale dell’evento.','Articolo ufficiale'],
    ru:['ЧТО ПРОИЗОШЛО','Роботы и танцоры выступили на сцене в Шанхае','Человекоподобные роботы участвовали в открытии конкурса мастерства.','22 сентября 2026 года человекоподобные роботы выступили с танцорами на открытии WorldSkills в Шанхае. В реальном выступлении участвовали гуманоиды, а не робопсы.','Игра — оригинальный вымысел, не реконструкция и не официальный продукт события.','Официальная публикация'],
    hi:['क्या हुआ','शंघाई में रोबोट और नर्तक एक मंच पर','कौशल प्रतियोगिता के उद्घाटन में मानवाकार रोबोट शामिल हुए।','22 सितंबर 2026 को शंघाई में WorldSkills के उद्घाटन पर मानवाकार रोबोटों ने नर्तकों के साथ प्रस्तुति दी। वास्तविक प्रस्तुति में रोबोट कुत्ते नहीं, मानवाकार रोबोट थे।','यह खेल मूल काल्पनिक रचना है, प्रस्तुति का पुनर्निर्माण या आधिकारिक उत्पाद नहीं।','आधिकारिक रिपोर्ट'],
    ar:['ما الذي حدث','روبوتات وراقصون على مسرح واحد في شنغهاي','شاركت روبوتات بشرية الشكل في افتتاح مسابقة للمهارات.','في 22 سبتمبر 2026، قدمت روبوتات بشرية الشكل عرضاً مع راقصين في افتتاح WorldSkills شنغهاي. ضم العرض الحقيقي روبوتات بشرية الشكل، لا كلاباً آلية.','اللعبة عمل خيالي أصلي وليست إعادة للعرض أو منتجاً رسمياً للفعالية.','التقرير الرسمي']
  };
  // Original copy; source verification lives in docs/topics-newsroom.md, never in the UI.
  const gatheringNews = {
    en:['THE STORY','White House ballroom construction reaches a milestone','The final steel beam became the focus of a site visit.','On 4 November 2026, Donald Trump signed the final beam for the White House ballroom and watched it being installed. A reporter at the site recorded the visit.','Gilded Gathering turns venue planning into a fictional puzzle about seats, open aisles and power. Its guests and constraints do not describe the real building.'],
    'zh-Hant':['事件背景','白宮舞廳工程迎來鋼樑吊裝節點','最後一根鋼樑成為工地視察的焦點。','2026 年 11 月 4 日，川普在白宮舞廳工程的最後一根鋼樑上簽名，並觀看吊裝。現場隨行記者記錄了這次視察。','《金頂開席》將場館規劃轉為原創謎題：安排座位、保留走道，並分配供電。賓客需求與場地限制是遊戲設定，並非真實建築的問題。'],
    'zh-Hans':['事件背景','白宫舞厅工程迎来钢梁吊装节点','最后一根钢梁成为工地视察的焦点。','2026 年 11 月 4 日，特朗普在白宫舞厅工程的最后一根钢梁上签名，并观看吊装。现场随行记者记录了这次视察。','《金顶开席》将场馆规划转为原创谜题：安排座位、保留通道，并分配供电。宾客需求与场地限制是游戏设定，并非真实建筑的问题。'],
    ja:['出来事','ホワイトハウスの舞踏室工事、最後の鉄骨を設置','工事現場の視察で最後の鉄骨に注目が集まりました。','2026年11月4日、トランプ氏はホワイトハウスの舞踏室の最後の鉄骨に署名し、設置を見守りました。現場の同行記者が視察を記録しています。','このゲームは席、通路、電力を考える架空の会場パズルです。客の要望や制約はゲームの設定で、実際の建物の問題を示すものではありません。'],
    ko:['사건 배경','백악관 연회장 공사, 마지막 철골 설치','현장 방문에서 마지막 철골이 주목받았습니다.','2026년 11월 4일 트럼프는 백악관 연회장의 마지막 철골에 서명하고 설치를 지켜봤습니다. 현장 동행 기자가 방문을 기록했습니다.','이 게임은 좌석, 통로, 전력을 배치하는 가상의 공간 퍼즐입니다. 손님 요구와 제약은 실제 건물의 문제를 나타내지 않습니다.'],
    es:['EL HECHO','Un hito en las obras del salón de baile de la Casa Blanca','La última viga centró una visita a las obras.','El 4 de noviembre de 2026, Trump firmó la última viga del salón de baile de la Casa Blanca y observó su instalación. Una periodista presente registró la visita.','El juego convierte la planificación de un recinto en un puzle ficticio de asientos, pasillos y energía. Sus invitados y restricciones no describen el edificio real.'],
    'pt-BR':['O ACONTECIMENTO','Obra do salão da Casa Branca chega à última viga','Uma visita à obra destacou a instalação da viga final.','Em 4 de novembro de 2026, Trump assinou a última viga do salão de baile da Casa Branca e acompanhou sua instalação. Uma jornalista presente registrou a visita.','O jogo transforma o planejamento de espaços em um quebra-cabeça fictício de mesas, corredores e energia. Os convidados e limites não descrevem o prédio real.'],
    fr:['LES FAITS','Une étape dans le chantier de la salle de bal de la Maison-Blanche','La dernière poutre était au centre de la visite du chantier.','Le 4 novembre 2026, Trump a signé la dernière poutre de la salle de bal de la Maison-Blanche et assisté à sa pose. Une journaliste sur place a relaté la visite.','Le jeu imagine un casse-tête de sièges, de passages et d’électricité. Les invités et les contraintes sont fictifs et ne décrivent pas le bâtiment réel.'],
    de:['HINTERGRUND','Letzter Stahlträger für den Ballsaal des Weißen Hauses','Bei einem Baustellenbesuch stand der letzte Träger im Mittelpunkt.','Am 4. November 2026 unterschrieb Trump den letzten Träger des Ballsaals des Weißen Hauses und sah beim Einbau zu. Eine Reporterin vor Ort dokumentierte den Besuch.','Das Spiel macht Raumplanung zu einem fiktiven Rätsel mit Sitzplätzen, Wegen und Strom. Gäste und Einschränkungen beschreiben nicht das echte Gebäude.'],
    it:['IL FATTO','Una tappa nei lavori della sala da ballo della Casa Bianca','L’ultima trave al centro di una visita al cantiere.','Il 4 novembre 2026 Trump ha firmato l’ultima trave della sala da ballo della Casa Bianca e ne ha osservato l’installazione. Una giornalista sul posto ha documentato la visita.','Il gioco trasforma la progettazione di spazi in un rompicapo immaginario di posti, passaggi ed energia. Ospiti e vincoli non descrivono l’edificio reale.'],
    ru:['ЧТО ПРОИЗОШЛО','Последняя балка для бального зала Белого дома','Установка балки стала центральным моментом посещения стройки.','4 ноября 2026 года Трамп подписал последнюю балку бального зала Белого дома и наблюдал за её установкой. Посещение описала присутствовавшая журналистка.','Игра превращает планирование зала в вымышленную задачу о местах, проходах и электричестве. Гости и ограничения не описывают реальное здание.'],
    hi:['क्या हुआ','व्हाइट हाउस के बॉलरूम में अंतिम इस्पात बीम लगी','निर्माण स्थल की यात्रा में अंतिम बीम पर ध्यान रहा।','4 नवंबर 2026 को ट्रंप ने व्हाइट हाउस के बॉलरूम की अंतिम बीम पर हस्ताक्षर किए और उसे लगते देखा। वहाँ मौजूद पत्रकार ने इस यात्रा का विवरण दिया।','खेल में बैठने की जगह, रास्ते और बिजली की योजना एक काल्पनिक पहेली है। मेहमानों की जरूरतें और सीमाएँ वास्तविक भवन की समस्याएँ नहीं हैं।'],
    ar:['ما الذي حدث','تركيب آخر عارضة في قاعة احتفالات البيت الأبيض','كانت العارضة الأخيرة محور زيارة موقع البناء.','في 4 نوفمبر 2026، وقّع ترامب على آخر عارضة لقاعة احتفالات البيت الأبيض وشاهد تركيبها. وسجلت صحفية كانت في الموقع تفاصيل الزيارة.','تحوّل اللعبة تخطيط القاعة إلى لغز خيالي للمقاعد والممرات والطاقة. احتياجات الضيوف والقيود لا تصف مشكلات المبنى الحقيقي.']
  };
  const lifeStory = {
    en:['GAME STORY','One life, a different starting point','Birthplace and surroundings shape an imagined life.','A Life in Moments imagines one life among roughly eight billion. The story unfolds through childhood, work and later life, with different surroundings along the way. This is a game premise, not a report about a real person or a newly verified news event.','The lives are fictional. Population data informs the simulation; it cannot predict any individual’s future.'],
    'zh-Hant':['遊戲故事','同樣一生，不同的起點','出生地與生活環境，串起一段虛構人生。','《人間一瞬》以約八十億人之中的一段人生為敘事起點，讓童年、工作與晚年隨環境展開不同片段。這是遊戲創作，並非某位真實人物的報導，也不代表新近發生的新聞。','角色的人生是虛構故事；人口資料用來支援模擬，不能預測個人的未來。'],
    'zh-Hans':['游戏故事','同样一生，不同的起点','出生地与生活环境，串起一段虚构人生。','《人间一瞬》以约八十亿人之中的一段人生为叙事起点，让童年、工作与晚年随环境展开不同片段。这是游戏创作，并非某位真实人物的报道，也不代表新近发生的新闻。','角色的人生是虚构故事；人口资料用来支持模拟，不能预测个人的未来。'],
    ja:['ゲームの物語','ひとつの人生、異なる出発点','生まれた場所と環境が架空の人生を彩ります。','約80億人の中のひとつの人生を想像するゲームです。幼少期、仕事、老後が異なる環境の中で展開します。実在人物の報道や、新しく確認されたニュースではありません。','人生の物語は架空です。人口データはシミュレーションの参考であり、個人の未来を予測するものではありません。'],
    ko:['게임 이야기','하나의 삶, 서로 다른 출발점','태어난 곳과 환경이 가상의 삶을 만듭니다.','약 80억 명 중 한 사람의 삶을 상상하는 게임입니다. 어린 시절, 직장 생활, 노년이 다양한 환경에서 펼쳐집니다. 실제 인물의 보도나 새로 확인된 뉴스가 아닙니다.','삶의 이야기는 허구입니다. 인구 자료는 시뮬레이션에 활용되며 개인의 미래를 예측하지 않습니다.'],
    es:['HISTORIA DEL JUEGO','Una vida, distintos puntos de partida','El lugar de nacimiento y el entorno dan forma a una vida imaginada.','El juego imagina una vida entre unos ocho mil millones. Infancia, trabajo y vejez transcurren en entornos diferentes. Es una premisa ficticia, no un reportaje sobre alguien real ni una noticia recién verificada.','Las vidas son ficticias. Los datos demográficos orientan la simulación; no predicen el futuro de una persona.'],
    'pt-BR':['HISTÓRIA DO JOGO','Uma vida, diferentes pontos de partida','O lugar de nascimento e o ambiente formam uma vida imaginada.','O jogo imagina uma vida entre cerca de oito bilhões. Infância, trabalho e velhice acontecem em ambientes diferentes. É uma premissa fictícia, não uma reportagem sobre alguém real nem uma notícia recém-verificada.','As vidas são fictícias. Os dados populacionais orientam a simulação, sem prever o futuro de uma pessoa.'],
    fr:['HISTOIRE DU JEU','Une vie, des départs différents','Le lieu de naissance et le milieu façonnent une vie imaginée.','Le jeu imagine une vie parmi environ huit milliards. Enfance, travail et vieillesse se déroulent dans des milieux variés. Il s’agit d’une fiction, pas du portrait d’une personne réelle ni d’une actualité nouvellement vérifiée.','Les vies sont fictives. Les données démographiques guident la simulation sans prédire l’avenir individuel.'],
    de:['SPIELGESCHICHTE','Ein Leben, unterschiedliche Ausgangspunkte','Geburtsort und Umfeld prägen ein erdachtes Leben.','Das Spiel stellt sich ein Leben unter rund acht Milliarden vor. Kindheit, Arbeit und Alter entfalten sich in verschiedenen Umgebungen. Das ist eine Spielidee, kein Bericht über eine echte Person oder ein neu belegtes Ereignis.','Die Lebensgeschichten sind erfunden. Bevölkerungsdaten dienen der Simulation, nicht der Vorhersage persönlicher Zukunft.'],
    it:['STORIA DEL GIOCO','Una vita, punti di partenza diversi','Luogo di nascita e ambiente danno forma a una vita immaginata.','Il gioco immagina una vita fra circa otto miliardi. Infanzia, lavoro e vecchiaia si svolgono in ambienti diversi. È una premessa narrativa, non un resoconto su una persona reale o una notizia appena verificata.','Le vite sono inventate. I dati demografici guidano la simulazione, senza prevedere il futuro individuale.'],
    ru:['ИСТОРИЯ ИГРЫ','Одна жизнь, разные отправные точки','Место рождения и окружение формируют воображаемую жизнь.','Игра представляет одну жизнь среди примерно восьми миллиардов. Детство, работа и старость проходят в разных условиях. Это вымысел, а не репортаж о реальном человеке или новом подтверждённом событии.','Истории вымышлены. Демографические данные служат симуляции, но не предсказывают будущее отдельного человека.'],
    hi:['खेल की कहानी','एक जीवन, अलग शुरुआत','जन्मस्थान और परिवेश एक काल्पनिक जीवन को आकार देते हैं।','खेल लगभग आठ अरब लोगों में से एक जीवन की कल्पना करता है। बचपन, काम और बुढ़ापा अलग परिवेश में खुलते हैं। यह खेल की कल्पना है, किसी वास्तविक व्यक्ति की रिपोर्ट या नई सत्यापित खबर नहीं।','जीवन की कहानियाँ काल्पनिक हैं। जनसंख्या के आँकड़े सिमुलेशन में मदद करते हैं, किसी व्यक्ति का भविष्य नहीं बताते।'],
    ar:['قصة اللعبة','حياة واحدة وبدايات مختلفة','يشكّل مكان الميلاد والبيئة حياة متخيّلة.','تتخيّل اللعبة حياة واحدة بين نحو ثمانية مليارات. تتكشف الطفولة والعمل والشيخوخة في بيئات مختلفة. هذه فكرة خيالية وليست تقريراً عن شخص حقيقي أو خبراً جديداً موثّقاً.','الحيوات خيالية. تسترشد المحاكاة ببيانات السكان ولا تتنبأ بمستقبل أي فرد.']
  };
  const rainlineNews = {
    en: ['THE EVENT','Rain cuts short the Wellington chase','The second one-day international was decided at the rain-adjusted target.','On 7 November 2026 in Wellington, rain ended play with India on 113 for seven. The Duckworth–Lewis–Stern method set the par score at 109, giving India a four-run win over New Zealand.','In the fictional Rainline Chase, every ball gives you a choice between chasing runs and protecting your batters before the rain stops play.'],
    'zh-Hant': ['事件背景','威靈頓雨勢提前結束追分','第二場單日國際賽依雨停時計算的分數判定勝負。','2026 年 11 月 7 日，威靈頓的比賽因雨提前結束，印度得 113 分、7 名打者出局。依 DLS 雨停計分法，當時的平手線是 109 分，印度以 4 分擊敗紐西蘭。','在原創虛構遊戲《雨線追分》裡，每球都要決定是冒險搶分，還是在雨停前保住打者。'],
    'zh-Hans': ['事件背景','惠灵顿的雨让追分提前结束','第二场一日国际赛按因雨调整的分数判定胜负。','2026 年 11 月 7 日，惠灵顿的比赛因雨提前结束，印度拿到 113 分，7 名击球员出局。按 DLS 法，当时的平分线是 109 分，印度以 4 分击败新西兰。','在虚构原创游戏《雨线追分》中，你要在雨停比赛前决定每一球是冒险抢分，还是保护击球员。'],
    ja: ['出来事','ウェリントンの雨で追い上げが打ち切りに','第2戦のワンデー国際試合は雨天時の基準点で決着。','2026年11月7日、ウェリントンでの試合はインドが113点、7ウィケットを失った時点で雨のため終了。DLS方式での同点基準は109点となり、インドがニュージーランドに4点差で勝ちました。','架空のゲーム「雨の追点線」では、雨で試合が止まる前に、得点を狙うか打者を守るかを一球ずつ選びます。'],
    ko: ['사건 배경','웰링턴의 비로 추격전 조기 종료','두 번째 원데이 국제경기는 우천 상황에 맞춰 산정한 기준 점수로 결판이 났습니다.','2026년 11월 7일 웰링턴에서 인도가 113점에 위켓 7개를 잃은 시점에 비로 경기가 끝났습니다. DLS 방식의 동점 기준은 109점이었고, 인도는 뉴질랜드에 4점 차로 이겼습니다.','가상의 게임 「빗줄기 추격전」에서는 비로 경기가 끝나기 전에 매 공마다 점수를 노릴지 타자를 지킬지 선택합니다.'],
    es: ['EL HECHO','La lluvia acorta la persecución en Wellington','El segundo partido internacional de un día se resolvió con el umbral ajustado por lluvia.','El 7 de noviembre de 2026, en Wellington, la lluvia terminó el partido con India en 113 carreras y siete wickets perdidos. El método DLS fijó el empate en 109 y dio a India la victoria por cuatro carreras sobre Nueva Zelanda.','En el juego de ficción Carrera contra la lluvia, cada bola te obliga a elegir entre arriesgarte para sumar carreras y proteger a tus bateadores antes de que pare el juego.'],
    'pt-BR': ['O FATO','A chuva encurta a perseguição em Wellington','O segundo jogo internacional de um dia foi decidido pela pontuação ajustada à chuva.','Em 7 de novembro de 2026, em Wellington, a chuva encerrou o jogo com a Índia em 113 corridas e sete wickets perdidos. O método DLS fixou a pontuação de empate em 109, e a Índia venceu a Nova Zelândia por quatro corridas.','No jogo fictício Corrida contra a chuva, a cada bola você escolhe entre arriscar corridas e proteger seus rebatedores até a interrupção.'],
    fr: ['LES FAITS','La pluie écourte la poursuite à Wellington','Le deuxième match international d’un jour s’est joué sur un seuil ajusté à la pluie.','Le 7 novembre 2026 à Wellington, la pluie a mis fin au match alors que l’Inde avait marqué 113 points et perdu sept guichets. La méthode DLS a fixé le score d’égalité à 109. L’Inde a battu la Nouvelle-Zélande de quatre points.','Dans le jeu fictif Au-delà de la pluie, chaque balle invite à choisir entre marquer et préserver ses batteurs avant l’arrêt du jeu.'],
    de: ['DAS EREIGNIS','Regen beendet die Aufholjagd in Wellington vorzeitig','Im zweiten Eintagesländerspiel entschied die an den Regen angepasste Punktzahl.','Am 7. November 2026 endete das Spiel in Wellington wegen Regens bei 113 Runs und sieben verlorenen Wickets für Indien. Nach der DLS-Methode lag der Gleichstand bei 109. Indien schlug Neuseeland mit vier Runs Vorsprung.','Im fiktiven Spiel Jagd an der Regenlinie entscheidest du bei jedem Ball, ob du Runs riskierst oder deine Schlagleute bis zum Regenabbruch schützt.'],
    it: ['IL FATTO','La pioggia accorcia la rincorsa a Wellington','Il secondo incontro internazionale di un giorno si è deciso con la soglia ricalcolata per la pioggia.','Il 7 novembre 2026, a Wellington, la pioggia ha chiuso la partita con l’India a 113 punti e sette wicket persi. Il metodo DLS ha fissato la parità a 109. L’India ha battuto la Nuova Zelanda di quattro punti.','Nel gioco di fantasia Rincorsa sotto la pioggia, a ogni palla scegli se rischiare per fare punti o proteggere i battitori prima dell’interruzione.'],
    ru: ['СОБЫТИЕ','Дождь прервал погоню за очками в Веллингтоне','Второй однодневный международный матч решили по счёту, пересчитанному из-за дождя.','7 ноября 2026 года в Веллингтоне дождь остановил матч при 113 очках и семи потерянных калитках у Индии. По методу DLS для ничьей требовалось 109 очков, и Индия выиграла у Новой Зеландии с разницей в четыре очка.','В вымышленной игре «Гонка до дождя» на каждой подаче надо решить, рискнуть ради очков или сохранить отбивающих до остановки игры.'],
    hi: ['घटना','वेलिंगटन में बारिश ने लक्ष्य का पीछा बीच में रोका','दूसरे एकदिवसीय अंतरराष्ट्रीय मैच का नतीजा बारिश के लिए समायोजित स्कोर से निकला।','7 नवंबर 2026 को वेलिंगटन में बारिश से खेल रुका तो भारत के सात विकेट पर 113 रन थे। डीएलएस पद्धति में बराबरी का स्कोर 109 था, इसलिए भारत ने न्यूज़ीलैंड को चार रन से हराया।','काल्पनिक खेल “बारिश से पहले” में हर गेंद पर तय करना है कि खेल रुकने से पहले रन के लिए जोखिम लें या बल्लेबाज़ों को बचाएँ।'],
    ar: ['الحدث','المطر يوقف مطاردة النقاط مبكرًا في ويلينغتون','حُسمت المباراة الدولية الثانية ليوم واحد بالنتيجة المعدّلة بسبب المطر.','في 7 نوفمبر 2026 في ويلينغتون، أنهى المطر اللعب والهند عند 113 ركضة مع خسارة سبع ويكيتات. حددت طريقة DLS نتيجة التعادل عند 109، ففازت الهند على نيوزيلندا بفارق أربع ركضات.','في لعبة «سباق مع المطر» الخيالية تختار مع كل كرة بين المجازفة لإحراز الركضات وحماية الضاربين قبل توقف اللعب.']
  };
  const tidegateNews = {
    "en": ["THE STORY","Changhua’s coast gets another road inland","A new section of Route 76 connects the coast to existing express roads.","The western extension opened at noon on November 8, 2026, following a ceremony the previous day. It links the Fangyuan area with the existing Route 76 corridor.","Tidegate Relay is fiction. Its harbor, vehicles and timed tide gate turn the idea of a new connection into a traffic puzzle.","News background"],
    "zh-Hant": ["事件背景","彰化海線與內陸多了一條路","台76線向西延伸，讓沿海路網接上既有快速道路。","2026 年 11 月 8 日中午，台76線西向延伸段開放通行。前一天先舉行通車典禮。新路段串聯芳苑一帶與既有台76線。","《潮口放行》的港灣、車輛與潮閘都是虛構設計。遊戲把新路段開通後的分流問題改編為回合策略。","事件查證"],
    "zh-Hans": ["事件背景","彰化海线与内陆多了一条路","台76线向西延伸，让沿海道路接上既有快速路网。","2026 年 11 月 8 日中午，台76线西向延伸段开放通行。前一天先举行通车仪式。新路段连接芳苑一带与既有台76线。","《潮口放行》的港湾、车辆与潮闸均为虚构。游戏把新路开通后的分流改编为回合策略。","事件核实"],
    "ja": ["出来事","彰化の海岸から内陸へ、新たな道","台湾の台76線が西へ延び、沿岸部と既存の道路網がつながりました。","2026年11月8日の正午に西側の延伸区間が開通しました。式典は前日に行われ、新区間は芳苑周辺と既存の台76線を結びました。","ゲームの港、車両、潮のゲートは架空です。新しい道路への交通の振り分けをターン制パズルにしました。","報道の背景"],
    "ko": ["사건 배경","장화 해안과 내륙을 잇는 새길","타이완 76호선이 서쪽으로 연장되어 기존 도로망과 해안을 연결합니다.","2026년 11월 8일 정오에 서쪽 연장 구간이 개통됐습니다. 전날 기념식이 열렸으며 새 구간은 팡위안 일대와 기존 76호선을 잇습니다.","게임 속 항구와 차량, 조수 관문은 가상입니다. 새 도로로 교통을 분산하는 상황을 턴제 퍼즐로 만들었습니다.","사건 정보"],
    "es": ["EL HECHO","Una nueva vía entre la costa de Changhua y el interior","La ampliación hacia el oeste de la Ruta 76 enlaza la costa con la red existente.","El nuevo tramo abrió al mediodía del 8 de noviembre de 2026, un día después de la ceremonia. Conecta la zona de Fangyuan con el corredor existente.","El puerto, los vehículos y la compuerta del juego son ficticios. La apertura de una vía inspira un rompecabezas de tráfico por turnos.","Contexto informativo"],
    "pt-BR": ["O FATO","Uma nova ligação entre o litoral de Changhua e o interior","A extensão oeste da Rota 76 conecta a costa à rede existente.","O trecho abriu ao meio-dia de 8 de novembro de 2026, um dia depois da cerimônia. Ele liga a região de Fangyuan à Rota 76 existente.","O porto, os veículos e a comporta do jogo são fictícios. A abertura de uma estrada inspira um quebra-cabeça de trânsito em turnos.","Contexto da notícia"],
    "fr": ["LES FAITS","Une nouvelle route de la côte de Changhua vers l’intérieur","Le prolongement vers l’ouest de la route 76 relie le littoral au réseau existant.","Le nouveau tronçon a ouvert le 8 novembre 2026 à midi, au lendemain de la cérémonie. Il relie le secteur de Fangyuan à la route 76 existante.","Le port, les véhicules et la barrière de marée du jeu sont fictifs. L’ouverture d’une liaison inspire un jeu de circulation au tour par tour.","Contexte de l’actualité"],
    "de": ["DAS EREIGNIS","Eine neue Straße von Changhuas Küste ins Landesinnere","Die westliche Verlängerung der Route 76 bindet die Küste an das bestehende Straßennetz an.","Der neue Abschnitt wurde am 8. November 2026 um zwölf Uhr freigegeben. Die Feier fand am Vortag statt. Die Strecke verbindet den Raum Fangyuan mit der bisherigen Route 76.","Hafen, Fahrzeuge und Gezeitentor im Spiel sind erfunden. Eine neue Straßenverbindung wird zum rundenbasierten Verkehrsproblem.","Hintergrund"],
    "it": ["IL FATTO","Una nuova via dalla costa di Changhua all’entroterra","Il prolungamento occidentale della Strada 76 collega la costa alla rete esistente.","Il tratto è stato aperto a mezzogiorno l’8 novembre 2026, dopo la cerimonia del giorno precedente. Collega l’area di Fangyuan alla Strada 76 già in uso.","Porto, veicoli e barriera di marea sono inventati. Una nuova strada diventa lo spunto per un rompicapo di traffico a turni.","Contesto della notizia"],
    "ru": ["СОБЫТИЕ","Побережье Чжанхуа получило новую дорогу вглубь острова","Западное продолжение трассы 76 связало побережье с действующей сетью дорог.","Новый участок открыли в полдень 8 ноября 2026 года. Церемония прошла накануне. Участок соединяет район Фанъюань с действующей трассой 76.","Порт, машины и приливные ворота в игре вымышлены. Открытие дороги стало основой пошаговой задачи по управлению движением.","Контекст новости"],
    "hi": ["घटना","चांगहुआ के तट से अंदरूनी इलाकों तक नई सड़क","मार्ग 76 का पश्चिमी विस्तार तट को मौजूदा सड़क नेटवर्क से जोड़ता है।","नया खंड 8 नवंबर 2026 को दोपहर में खोला गया। समारोह एक दिन पहले हुआ था। यह फ़ांगयुआन क्षेत्र को मौजूदा मार्ग 76 से जोड़ता है।","खेल का बंदरगाह, गाड़ियाँ और ज्वार द्वार काल्पनिक हैं। नई सड़क खोलने की स्थिति से बारी आधारित यातायात पहेली बनाई गई है।","घटना की पृष्ठभूमि"],
    "ar": ["خلفية الحدث","طريق جديد من ساحل تشانغهوا إلى الداخل","يربط التمديد الغربي للطريق 76 الساحل بشبكة الطرق القائمة.","فُتح المقطع الجديد ظهر 8 نوفمبر 2026 بعد حفل أُقيم في اليوم السابق. ويربط منطقة فانغيوان بالطريق 76 القائم.","الميناء والمركبات وبوابة المد في اللعبة خيالية. افتتاح طريق جديد ألهم لغزًا لإدارة المرور بالدور.","خلفية الخبر"],
  };
  const siliconShiftNews = {
  "en": [
    "THE STORY",
    "Taiwan reports a record month for exports",
    "The October preliminary figures mark a new monthly high.",
    "Taiwan’s Ministry of Finance released preliminary customs figures on 9 November 2026. Exports in October reached US$96.76 billion, up 58.9% from a year earlier.",
    "Silicon Shift imagines a workshop with more orders to check. Route pulses, uncover phase marks and test every case with one wiring plan. The workshop and its faults are fictional."
  ],
  "zh-Hant": [
    "事件背景",
    "十月出口寫下新的單月紀錄",
    "海關初步統計顯示，台灣出口金額再創月度新高。",
    "財政部在 2026 年 11 月 9 日公布海關初步統計。台灣 10 月出口為 967.6 億美元，比上年同期增加 58.9%。",
    "《矽光校準》從出貨增加的情境出發，設計一座需要加快驗收的虛構工坊。玩家切換光路、量測反相標記，再用一組接線交驗所有案例。工坊和接線故障都是遊戲設定。"
  ],
  "zh-Hans": [
    "事件背景",
    "十月出口刷新单月纪录",
    "海关初步统计显示，台湾出口金额达到新的月度高点。",
    "财政部门在 2026 年 11 月 9 日公布海关初步统计。台湾 10 月出口为 967.6 亿美元，较上年同期增加 58.9%。",
    "《硅光校准》把出货增加改编成虚构工坊的检验挑战。玩家切换光路，测量反相标记，再用同一组接线验收所有案例。工坊和接线故障均为虚构。"
  ],
  "ja": [
    "出来事",
    "台湾の10月の輸出額、単月の最高を更新",
    "税関の速報値で月間輸出額が新たな水準に達しました。",
    "台湾の財政部は2026年11月9日に貿易統計の速報値を公表しました。10月の輸出額は967億6000万米ドルで、前年同月比58.9％増でした。",
    "ゲームは注文が増えた架空の工房が舞台です。経路を切り替え、反転の印を測り、同じ配線で全ケースを検定します。工房や配線の不具合は創作です。"
  ],
  "ko": [
    "사건 배경",
    "대만의 10월 수출액, 월간 최고 기록",
    "세관 잠정 통계에서 월간 수출액이 새 기록을 세웠습니다.",
    "대만 재정부는 2026년 11월 9일 세관 잠정 통계를 발표했습니다. 10월 수출액은 967억 6천만 달러로, 전년 동월보다 58.9% 늘었습니다.",
    "게임에서는 주문이 늘어난 가상의 공방을 운영합니다. 신호 경로를 바꾸고 반전 표시를 측정한 뒤 같은 배선으로 모든 검사를 통과하세요. 공방과 배선 문제는 창작입니다."
  ],
  "es": [
    "EL HECHO",
    "Octubre marca un récord de exportación en Taiwán",
    "El dato preliminar de aduanas alcanza un nuevo máximo mensual.",
    "El Ministerio de Finanzas de Taiwán publicó sus cifras preliminares el 9 de noviembre de 2026. Las exportaciones de octubre sumaron 96 760 millones de dólares, un 58,9 % más que un año antes.",
    "El juego imagina un taller con más pedidos que revisar. Desvía pulsos, descubre marcas de fase y valida todos los casos con un mismo cableado. El taller y sus fallos son ficticios."
  ],
  "pt-BR": [
    "O ACONTECIMENTO",
    "Taiwan registra novo pico mensal nas exportações",
    "Os dados preliminares de outubro mostram o maior valor de um mês.",
    "O Ministério das Finanças de Taiwan divulgou os dados aduaneiros em 9 de novembro de 2026. As exportações de outubro somaram US$ 96,76 bilhões, alta de 58,9% ante o mesmo mês do ano anterior.",
    "O jogo imagina uma oficina com mais encomendas para conferir. Desvie pulsos, meça marcas de fase e valide todos os casos com as mesmas conexões. A oficina e seus defeitos são fictícios."
  ],
  "fr": [
    "LES FAITS",
    "Les exportations de Taïwan atteignent un record en octobre",
    "Les premières données douanières placent le mois au plus haut.",
    "Le ministère taïwanais des Finances a publié ces chiffres provisoires le 9 novembre 2026. Les exportations d’octobre ont atteint 96,76 milliards de dollars américains, en hausse de 58,9 % sur un an.",
    "Le jeu imagine un atelier qui reçoit davantage de commandes à contrôler. Dévie les impulsions, sonde les repères de phase et valide tous les cas avec un seul câblage. L’atelier et ses pannes sont fictifs."
  ],
  "de": [
    "HINTERGRUND",
    "Taiwans Exporte erreichen im Oktober einen Monatsrekord",
    "Vorläufige Zolldaten zeigen einen neuen Höchststand.",
    "Taiwans Finanzministerium veröffentlichte am 9. November 2026 die vorläufigen Zolldaten. Die Exporte erreichten im Oktober 96,76 Milliarden US-Dollar, 58,9 Prozent mehr als im Vorjahresmonat.",
    "Das Spiel zeigt eine erfundene Werkstatt mit mehr Prüfaufträgen. Leite Impulse um, prüfe Phasenmarken und löse alle Fälle mit derselben Verdrahtung. Die Werkstatt und ihre Fehler sind erfunden."
  ],
  "it": [
    "IL FATTO",
    "Taiwan raggiunge un nuovo record mensile di esportazioni",
    "I dati doganali preliminari di ottobre segnano un nuovo massimo.",
    "Il ministero delle Finanze di Taiwan ha diffuso i dati preliminari il 9 novembre 2026. Le esportazioni di ottobre hanno raggiunto 96,76 miliardi di dollari statunitensi, il 58,9% in più rispetto a un anno prima.",
    "Il gioco immagina un’officina con più ordini da controllare. Devia gli impulsi, misura i segni di fase e verifica tutti i casi con lo stesso cablaggio. L’officina e i guasti sono inventati."
  ],
  "ru": [
    "СОБЫТИЕ",
    "Экспорт Тайваня поставил месячный рекорд в октябре",
    "Предварительная таможенная статистика показала новый максимум.",
    "Министерство финансов Тайваня опубликовало предварительные данные 9 ноября 2026 года. Объём октябрьского экспорта достиг 96,76 миллиарда долларов США — на 58,9% больше, чем годом ранее.",
    "В игре вымышленная мастерская получает больше заказов на проверку. Меняйте маршруты импульсов, находите фазовые метки и сдавайте все тесты с одной схемой. Мастерская и её неполадки вымышлены."
  ],
  "hi": [
    "घटना",
    "अक्टूबर में ताइवान का निर्यात मासिक रिकॉर्ड पर",
    "प्रारंभिक सीमा शुल्क आँकड़ों में निर्यात का नया मासिक उच्च स्तर दर्ज हुआ।",
    "ताइवान के वित्त मंत्रालय ने 9 नवंबर 2026 को प्रारंभिक आँकड़े जारी किए। अक्टूबर का निर्यात 96.76 अरब अमेरिकी डॉलर रहा, जो एक साल पहले से 58.9 प्रतिशत अधिक है।",
    "खेल एक काल्पनिक कार्यशाला में बढ़ते ऑर्डरों की जाँच दिखाता है। संकेतों के रास्ते बदलें, कला के निशान खोजें और एक ही जोड़ से हर जाँच पूरी करें। कार्यशाला और उसकी खराबियाँ काल्पनिक हैं।"
  ],
  "ar": [
    "خلفية الحدث",
    "صادرات تايوان تسجل رقمًا شهريًا قياسيًا في أكتوبر",
    "أظهرت بيانات الجمارك الأولية ارتفاع الصادرات إلى أعلى قيمة شهرية.",
    "أعلنت وزارة المالية في تايوان الأرقام الأولية في 9 نوفمبر 2026. بلغت صادرات أكتوبر 96.76 مليار دولار أمريكي، بزيادة 58.9٪ عن الشهر نفسه قبل عام.",
    "تتخيل اللعبة ورشة عليها فحص مزيد من الطلبات. بدّل مسار النبضات، واكشف علامات الطور، واختبر كل الحالات بالتوصيلات نفسها. الورشة والأعطال من الخيال."
  ]
};
  const sunshiftCommonsNews = {
  "en": [
    "THE STORY",
    "Rooftop solar on the agenda in Antalya",
    "A declaration at the climate talks calls for broader use of solar on homes.",
    "On 10 November 2026, a coalition of countries backed a declaration promoting residential rooftop solar during COP31 in Antalya. Its campaign aims for 300 million solar-powered homes by 2030.",
    "Sunshift Commons follows a fictional neighborhood. You allocate sunlight, store the surplus, and send electricity after dark. The residents, contracts, and power grid are invented."
  ],
  "zh-Hant": [
    "事件背景",
    "安塔利亞會議談住宅屋頂太陽能",
    "一項會議宣言倡議讓更多住戶使用屋頂太陽能。",
    "2026 年 11 月 10 日，多國在安塔利亞 COP31 期間支持一項推廣住宅屋頂太陽能的宣言。相關倡議將 2030 年全球 3 億戶使用太陽能定為目標。",
    "《暮電共巷》把題材搬進虛構街區。玩家分配當拍日照、把餘電留在電池裡，並在入夜後完成供電。角色、工單與電網都是原創設定。"
  ],
  "zh-Hans": [
    "事件背景",
    "安塔利亚会议谈住宅屋顶太阳能",
    "一项会议宣言倡议让更多住户使用屋顶太阳能。",
    "2026 年 11 月 10 日，多国在安塔利亚 COP31 期间支持一项推广住宅屋顶太阳能的宣言。相关倡议将 2030 年全球 3 亿户使用太阳能定为目标。",
    "《暮电共巷》把题材搬进虚构街区。玩家分配当拍日照、把余电留在电池里，并在入夜后完成供电。角色、工单和电网都是原创设定。"
  ],
  "ja": [
    "ニュースの背景",
    "アンタルヤで住宅の屋上太陽光を議論",
    "住宅の屋上発電を広げる宣言が発表されました。",
    "2026年11月10日、アンタルヤのCOP31で複数の国が住宅の屋上太陽光発電を広げる宣言を支持しました。関連する取り組みは2030年までに世界で3億世帯への普及を目指します。",
    "ゲームの街区と住人、依頼、電力網は架空です。日中に電力を分け、余りを蓄えて夜の依頼に備えます。"
  ],
  "ko": [
    "뉴스 배경",
    "안탈리아에서 논의한 주택 옥상 태양광",
    "기후회의에서 주택 태양광을 확대하자는 선언이 나왔습니다.",
    "2026년 11월 10일 여러 나라가 안탈리아 COP31에서 주택 옥상 태양광 확대 선언을 지지했습니다. 관련 계획은 2030년까지 전 세계 3억 가구가 태양광을 이용하는 것을 목표로 합니다.",
    "가상의 동네에서 낮에 전력을 나누고 남은 전기를 밤에 보냅니다. 주민과 요청, 전력망은 게임을 위해 만들었습니다."
  ],
  "es": [
    "EL CONTEXTO",
    "Energía solar en tejados, en la agenda de Antalya",
    "Una declaración propone extender la energía solar en los hogares.",
    "El 10 de noviembre de 2026, varios países respaldaron en la COP31 de Antalya una declaración de promoción de la energía solar residencial. Su iniciativa aspira a llegar a 300 millones de hogares en 2030.",
    "El juego imagina un barrio que distribuye la energía de día y guarda el excedente para la noche. Sus vecinos, pedidos y red son ficticios."
  ],
  "pt-BR": [
    "O CONTEXTO",
    "Energia solar nos telhados em debate em Antália",
    "Uma declaração propõe expandir a energia solar nas moradias.",
    "Em 10 de novembro de 2026, vários países apoiaram na COP31 de Antália uma declaração para ampliar a energia solar residencial. A iniciativa tem como meta chegar a 300 milhões de lares até 2030.",
    "O jogo imagina uma vila que distribui a energia durante o dia e guarda o excedente para a noite. Moradores, pedidos e rede são fictícios."
  ],
  "fr": [
    "LES FAITS",
    "Le solaire sur les toits au programme à Antalya",
    "Une déclaration vise à étendre l’usage du solaire dans les logements.",
    "Le 10 novembre 2026, plusieurs pays ont soutenu à la COP31 d’Antalya une déclaration en faveur du solaire résidentiel. L’initiative associée vise 300 millions de foyers alimentés par le solaire d’ici 2030.",
    "Le quartier du jeu répartit l’électricité de jour et garde le surplus pour la nuit. Les habitants, demandes et lignes sont fictifs."
  ],
  "de": [
    "HINTERGRUND",
    "Solarstrom von Wohndächern in Antalya",
    "Eine Erklärung wirbt für mehr Solaranlagen auf Wohngebäuden.",
    "Am 10. November 2026 unterstützten mehrere Staaten auf der COP31 in Antalya eine Erklärung zum Ausbau von Solarstrom auf Wohngebäuden. Die Initiative zielt auf 300 Millionen solarversorgte Haushalte bis 2030.",
    "Im Spiel verteilt ein erfundenes Viertel tagsüber Solarstrom und spart Überschüsse für die Nacht. Bewohner, Aufträge und Netz sind fiktiv."
  ],
  "it": [
    "IL CONTESTO",
    "Solare sui tetti delle case ad Antalya",
    "Una dichiarazione propone di ampliare l’uso del solare residenziale.",
    "Il 10 novembre 2026 diversi paesi hanno sostenuto alla COP31 di Antalya una dichiarazione per promuovere il solare domestico. L’iniziativa punta a 300 milioni di abitazioni alimentate dal solare entro il 2030.",
    "Nel quartiere immaginario del gioco si distribuisce l’energia di giorno e la si conserva per la notte. Abitanti, richieste e rete sono inventati."
  ],
  "ru": [
    "ЧТО ПРОИЗОШЛО",
    "В Анталье обсудили солнечные панели на домах",
    "Декларация призывает шире применять солнечную энергию в жилых домах.",
    "10 ноября 2026 года несколько стран поддержали на COP31 в Анталье декларацию о развитии солнечной энергетики на крышах домов. Инициатива ставит цель обеспечить солнечной энергией 300 миллионов домов к 2030 году.",
    "В вымышленном квартале игрок распределяет дневную энергию и сохраняет запас на ночь. Жители, заявки и сеть придуманы для игры."
  ],
  "hi": [
    "घटना",
    "अंताल्या में घरों की छत पर सौर ऊर्जा की चर्चा",
    "एक घोषणा में घरों तक सौर ऊर्जा पहुँचाने का प्रस्ताव है।",
    "10 नवंबर 2026 को अंताल्या की COP31 बैठक में कई देशों ने घरों की छतों पर सौर ऊर्जा बढ़ाने की घोषणा का समर्थन किया। पहल का लक्ष्य 2030 तक 30 करोड़ घरों तक सौर ऊर्जा पहुँचाना है।",
    "खेल के काल्पनिक मोहल्ले में दिन की बिजली बाँटें और रात के लिए बचाएँ। निवासी, काम और बिजली की लाइनें खेल के लिए बनाई गई हैं।"
  ],
  "ar": [
    "خلفية الحدث",
    "الطاقة الشمسية فوق المنازل على جدول أنطاليا",
    "إعلان يدعو إلى توسيع استخدام الطاقة الشمسية في المساكن.",
    "في ١٠ نوفمبر ٢٠٢٦ دعمت عدة دول خلال مؤتمر COP31 في أنطاليا إعلانًا لتوسيع الطاقة الشمسية على أسطح المنازل. تهدف المبادرة إلى وصول الطاقة الشمسية إلى ٣٠٠ مليون منزل بحلول ٢٠٣٠.",
    "في حي اللعبة الخيالي توزّع الكهرباء نهارًا وتخزّن الفائض لليل. السكان والطلبات والشبكة من ابتكار اللعبة."
  ]
};
  const parcelPactNews = {
  "en": [
    "Event",
    "When a discount is worth using",
    "Some shoppers weighed the November offers against their shopping lists.",
    "The annual online shopping event centered on November 11, 2026, after promotions started weeks earlier. Shoppers interviewed by independent outlets described cutting some nonessential purchases or checking whether a discount met a real need.",
    "In Parcel Pact, the fictional co-op opens one mixed crate per batch. The player sorts goods among neighbors and decides which surplus to carry forward."
  ],
  "zh-Hant": [
    "事件背景",
    "購物節裡，折扣要合用才值得",
    "有受訪者把折扣和自己的清單放在一起衡量。",
    "2026 年的年度網購活動以 11 月 11 日為節點，相關促銷已提前數週展開。不同媒體訪問到的部分消費者談到減少非必要採買，或仔細看優惠是否符合需求。",
    "遊戲中的共購所是虛構的。每批只能拆一箱，玩家逐件分給住戶，再決定哪些餘貨值得留給下一批。"
  ],
  "zh-Hans": [
    "事件背景",
    "购物节里，折扣要合用才值得",
    "有受访者把折扣和自己的清单放在一起衡量。",
    "2026 年的年度网购活动以 11 月 11 日为节点，相关促销已提前数周展开。不同媒体采访到的部分消费者谈到减少非必要采购，或仔细看优惠是否符合需求。",
    "游戏中的共购所是虚构的。每批只能拆一箱，玩家逐件分给住户，再决定哪些余货留给下一批。"
  ],
  "ja": [
    "出来事",
    "値引きと買い物リスト",
    "セールの値引きを、本当に必要な品と比べる人もいました。",
    "2026年の恒例ネットセールは、数週間前から販促が始まり、11月11日が中心でした。別々の取材で、不要不急の品を控え、値引きが実際の需要に合うかを見る買い物客がいました。",
    "架空の共同購入所では一便に一箱だけ開け、近所へ配り、余った品を次の便に残すか決めます。"
  ],
  "ko": [
    "사건 배경",
    "할인과 장보기 목록",
    "일부 구매자는 할인보다 실제로 필요한 물건을 따졌어요.",
    "2026년 온라인 할인 행사는 몇 주 전부터 시작돼 11월 11일을 중심으로 진행됐어요. 서로 다른 매체가 만난 일부 구매자는 불필요한 구매를 줄이거나 할인이 실제 필요에 맞는지 살폈어요.",
    "가상의 공동 구매소에서는 한 차수에 상자 하나를 열고, 이웃에게 물건을 나눈 뒤 다음 차수에 남길 것을 정해요."
  ],
  "es": [
    "El hecho",
    "Cuándo compensa una oferta",
    "Algunos compradores compararon los descuentos con su lista.",
    "Las rebajas en línea de 2026 giraron en torno al 11 de noviembre, aunque las promociones comenzaron semanas antes. Algunos consumidores entrevistados por medios distintos redujeron compras no esenciales o valoraron si el descuento encajaba con sus necesidades.",
    "En la cooperativa ficticia abres una caja por tanda, repartes los productos entre vecinos y decides qué guardar."
  ],
  "pt-BR": [
    "O fato",
    "Quando vale usar um desconto",
    "Alguns compradores compararam as ofertas com a lista de compras.",
    "As ofertas on-line de 2026 tiveram 11 de novembro como data central, com promoções iniciadas semanas antes. Em entrevistas de veículos distintos, alguns consumidores disseram ter cortado itens não essenciais ou avaliado se o desconto atendia a uma necessidade real.",
    "Na cooperativa fictícia, você abre uma caixa por rodada, divide os produtos entre vizinhos e escolhe o que guardar."
  ],
  "fr": [
    "Le fait",
    "Les promotions à l’épreuve de la liste",
    "Des acheteurs ont comparé les remises à leurs besoins.",
    "Les promotions en ligne de 2026 étaient centrées sur le 11 novembre et avaient commencé plusieurs semaines plus tôt. Des acheteurs interrogés par différents médias ont réduit certains achats non essentiels ou vérifié si une remise répondait à leur besoin.",
    "Dans la coopérative fictive, vous ouvrez une caisse par lot, répartissez les produits entre voisins et décidez quoi garder."
  ],
  "de": [
    "Ereignis",
    "Rabatte und Einkaufslisten",
    "Einige Käufer verglichen Angebote mit ihrem Bedarf.",
    "Die Online-Aktion 2026 konzentrierte sich auf den 11. November, obwohl Angebote schon Wochen vorher begannen. In unabhängigen Interviews schilderten einige Käufer, dass sie auf entbehrliche Ware verzichteten oder prüften, ob ein Rabatt zu ihrem Bedarf passte.",
    "In der fiktiven Genossenschaft öffnest du pro Runde eine Kiste, verteilst Waren und hebst geeignete Reste auf."
  ],
  "it": [
    "Il fatto",
    "Sconti e liste della spesa",
    "Alcuni acquirenti hanno confrontato le offerte con ciò che serviva davvero.",
    "Le offerte online del 2026 ruotavano attorno all’11 novembre, dopo promozioni iniziate settimane prima. In interviste di testate diverse, alcuni acquirenti hanno raccontato di aver ridotto gli acquisti non essenziali o valutato l’utilità di ogni sconto.",
    "Nella cooperativa inventata apri una cassa per lotto, distribuisci i prodotti e decidi cosa conservare."
  ],
  "ru": [
    "Событие",
    "Скидки и список покупок",
    "Некоторые покупатели сверяли предложения со своими нуждами.",
    "Главной датой онлайн-распродажи 2026 года стало 11 ноября, хотя акции начались на несколько недель раньше. Покупатели в разных интервью рассказывали, как отказывались от лишнего или проверяли, нужен ли им товар со скидкой.",
    "В вымышленном кооперативе вы открываете один ящик на партию, раздаёте товары соседям и решаете, что оставить."
  ],
  "hi": [
    "घटना",
    "छूट और खरीदारी की सूची",
    "कुछ खरीदारों ने ऑफ़र की तुलना अपनी असली ज़रूरत से की।",
    "2026 की ऑनलाइन बिक्री का मुख्य दिन 11 नवंबर था, जबकि ऑफ़र कई सप्ताह पहले शुरू हुए। अलग-अलग रिपोर्टों में कुछ खरीदारों ने गैरज़रूरी खरीद कम करने या छूट वाले सामान की उपयोगिता परखने की बात कही।",
    "काल्पनिक सहकारी केंद्र में हर खेप के लिए एक पेटी खोलें, पड़ोसियों में सामान बाँटें और अगली खेप के लिए सही सामान बचाएँ।"
  ],
  "ar": [
    "خلفية الحدث",
    "الخصومات وقائمة المشتريات",
    "قارن بعض المتسوقين العروض باحتياجاتهم الفعلية.",
    "تمحورت التخفيضات عبر الإنترنت عام ٢٠٢٦ حول ١١ نوفمبر، بعد عروض بدأت قبل أسابيع. وفي مقابلات لوسائل مختلفة، تحدث بعض المتسوقين عن تقليل مشتريات غير ضرورية أو التحقق من ملاءمة الخصم لحاجتهم.",
    "في التعاونية الخيالية تفتح صندوقًا واحدًا لكل دفعة، وتوزع السلع على الجيران، وتختار ما تحتفظ به للدفعة التالية."
  ]
};
  const lastQuarterRelayNews = {
  "en": [
    "Basketball",
    "A 22-point gap, then a comeback",
    "The visiting side overturned a big deficit.",
    "On November 11 in Chicago, the visiting team came back from 22 points down to win 124–119.",
    "In the fictional league, an open shot can close the gap, while a stop or steal changes what is possible on the next possession."
  ],
  "zh-Hant": [
    "籃球",
    "22 分落差後的逆轉",
    "客隊把大幅落後扳成勝局。",
    "11 月 11 日芝加哥當地時間的一場籃球賽中，客隊一度落後 22 分，最後以 124 比 119 獲勝。",
    "在虛構聯賽裡，空位出手能縮小分差，守住或抄截則能改變下一波球權的選擇。"
  ],
  "zh-Hans": [
    "篮球",
    "22 分落差后的逆转",
    "客队把大幅落后扳成胜局。",
    "11 月 11 日芝加哥当地时间的一场篮球赛中，客队一度落后 22 分，最后以 124 比 119 获胜。",
    "在虚构联赛里，空位出手能缩小分差，守住或抢断则能改变下一波球权的选择。"
  ],
  "ja": [
    "バスケットボール",
    "22点差からの逆転",
    "アウェーチームが大差をひっくり返しました。",
    "11月11日、シカゴのバスケットボールの試合で、アウェーチームは最大22点差を逆転し、124対119で勝利しました。",
    "架空のリーグでは、フリーのシュートで差を詰め、守備やスティールで次の攻防の選択肢を変えます。"
  ],
  "ko": [
    "농구",
    "22점 차를 뒤집은 경기",
    "원정팀이 큰 점수 차를 뒤집었습니다.",
    "11월 11일 시카고에서 열린 농구 경기에서 원정팀은 한때 22점 뒤졌지만 124대 119로 이겼습니다.",
    "가상의 리그에서는 빈자리 슛으로 점수 차를 좁히고, 수비나 가로채기로 다음 공방의 선택지를 바꿉니다."
  ],
  "es": [
    "Baloncesto",
    "Remontada tras ir 22 puntos abajo",
    "El equipo visitante dio la vuelta a una amplia desventaja.",
    "El 11 de noviembre, en Chicago, el equipo visitante remontó una desventaja de 22 puntos para ganar por 124 a 119.",
    "En la liga ficticia, un tiro libre de marca recorta la diferencia y una parada o un robo abre opciones en la posesión siguiente."
  ],
  "pt-BR": [
    "Basquete",
    "A virada depois de 22 pontos atrás",
    "A equipe visitante virou depois de ficar bem atrás.",
    "Em 11 de novembro, em Chicago, a equipe visitante saiu de 22 pontos atrás e venceu por 124 a 119.",
    "Na liga fictícia, um arremesso livre diminui a diferença e uma defesa ou roubada de bola muda as opções da próxima posse."
  ],
  "fr": [
    "Basket-ball",
    "Une remontée après 22 points de retard",
    "Les visiteurs ont renversé un large écart.",
    "Le 11 novembre à Chicago, l’équipe visiteuse a comblé un retard de 22 points pour gagner 124 à 119.",
    "Dans cette ligue fictive, un tir ouvert réduit l’écart et un arrêt ou une interception change les options à la possession suivante."
  ],
  "de": [
    "Basketball",
    "Die Aufholjagd nach 22 Punkten Rückstand",
    "Das Auswärtsteam drehte einen deutlichen Rückstand.",
    "Am 11. November in Chicago holte das Auswärtsteam einen Rückstand von 22 Punkten auf und gewann mit 124 zu 119.",
    "In der fiktiven Liga verkürzt ein freier Wurf den Rückstand. Ein Stopp oder Ballgewinn ändert die Optionen beim nächsten Ballbesitz."
  ],
  "it": [
    "Pallacanestro",
    "La rimonta dopo uno svantaggio di 22 punti",
    "La squadra ospite ha ribaltato un ampio svantaggio.",
    "L’11 novembre a Chicago la squadra ospite ha recuperato 22 punti di svantaggio e ha vinto 124 a 119.",
    "Nel campionato immaginario, un tiro libero riduce il divario e uno stop o un recupero cambia le scelte del possesso successivo."
  ],
  "ru": [
    "Баскетбол",
    "Рывок после отставания в 22 очка",
    "Гости переломили ход матча после большого отставания.",
    "11 ноября в Чикаго гостевая команда отыграла отставание в 22 очка и победила со счётом 124:119.",
    "В вымышленной лиге свободный бросок сокращает разрыв, а остановка или перехват меняют выбор при следующем владении."
  ],
  "hi": [
    "बास्केटबॉल",
    "22 अंकों से पीछे होकर वापसी",
    "मेहमान टीम ने बड़ा अंतर पलट दिया।",
    "11 नवंबर को शिकागो में मेहमान टीम 22 अंक पीछे थी और फिर 124–119 से जीती।",
    "काल्पनिक लीग में खाली जगह से शॉट अंतर घटाता है और बचाव या गेंद छीनना अगली बारी के विकल्प बदलता है।"
  ],
  "ar": [
    "كرة السلة",
    "عودة بعد التأخر بـ22 نقطة",
    "قلب الفريق الضيف تأخّرًا كبيرًا.",
    "في 11 نوفمبر في شيكاغو، عوّض الفريق الضيف تأخّرًا بـ22 نقطة وفاز بنتيجة 124 مقابل 119.",
    "في الدوري الخيالي، تقلّل التسديدة المفتوحة الفارق، ويغيّر إيقاف الهجوم أو افتكاك الكرة خيارات الاستحواذ التالي."
  ]
};
  const glowtideNews = {"en":["Festival","Winter lights open across New Taipei","The main display lit up together with seven other areas.","On November 13, 2026, New Taipei opened a winter festival by lighting its main display and seven supporting areas.","In this fictional festival, lighting a tower changes which paths arriving groups take."],"zh-Hant":["節慶","一個晚上，點亮多處燈區","主燈和七處響應燈區同晚亮起。","2026 年 11 月 13 日，新北冬季活動開幕，主燈和七處響應燈區同步點亮。","虛構夜祭把這個情境變成點燈分流，哪座燈塔亮起，就會改變新來隊伍走的路。"],"zh-Hans":["节庆","一个晚上，点亮多处灯区","主灯和七处响应灯区同晚亮起。","2026 年 11 月 13 日，新北冬季活动开幕，主灯和七处响应灯区同步点亮。","虚构夜祭把这一情境变成点灯分流，哪座灯塔亮起，就会改变新来队伍走的路。"],"ja":["祭り","新北の冬を照らす一斉点灯","主灯と七つの会場が同じ夜に点灯しました。","2026年11月13日、新北市の冬の催しで主灯と七つの会場が一斉に点灯しました。","架空の祭りでは、点灯する塔によって来場者が選ぶ道が変わります。"],"ko":["축제","신베이 곳곳을 밝힌 겨울 조명","메인 조명과 일곱 곳의 조명이 같은 밤에 켜졌습니다.","2026년 11월 13일 신베이의 겨울 행사가 메인 조명과 일곱 곳의 조명을 켜며 시작했습니다.","게임 속 축제에서는 켠 등탑이 새 관람객의 길을 바꿉니다."],"es":["Festival","Nueva Taipéi enciende sus luces de invierno","La instalación principal se iluminó junto a otras siete zonas.","El 13 de noviembre de 2026, Nueva Taipéi inauguró su festival de invierno al iluminar su instalación principal y siete zonas más.","En el festival ficticio, cada torre encendida cambia la ruta de los recién llegados."],"pt-BR":["Festival","Nova Taipé acende suas luzes de inverno","A instalação principal acendeu junto com outras sete áreas.","Em 13 de novembro de 2026, Nova Taipé abriu seu festival de inverno iluminando a instalação principal e mais sete áreas.","Na festa fictícia, as torres acesas mudam o caminho dos visitantes que chegam."],"fr":["Fête","Nouveau Taipei allume ses lumières d’hiver","L’installation principale et sept autres zones se sont allumées le même soir.","Le 13 novembre 2026, le festival d’hiver de Nouveau Taipei a débuté avec l’allumage de l’installation principale et de sept autres zones.","Dans le festival fictif, une tour allumée change le chemin des nouveaux groupes."],"de":["Fest","Neu-Taipeh schaltet die Winterlichter ein","Die Hauptinstallation und sieben weitere Bereiche leuchteten am selben Abend.","Am 13. November 2026 eröffnete Neu-Taipeh sein Winterfest mit Licht an der Hauptinstallation und in sieben weiteren Bereichen.","Im fiktiven Fest ändern die Lichter den Weg der ankommenden Gruppen."],"it":["Festa","Nuova Taipei accende le luci d’inverno","L’installazione principale e altre sette zone si sono accese la stessa sera.","Il 13 novembre 2026, Nuova Taipei ha inaugurato la festa invernale illuminando l’installazione principale e altre sette zone.","Nella festa immaginaria, la luce cambia il percorso dei nuovi gruppi."],"ru":["Фестиваль","В Новом Тайбэе зажглись зимние огни","Главная инсталляция и ещё семь площадок зажглись в один вечер.","13 ноября 2026 года на открытии зимнего фестиваля в Новом Тайбэе зажглись главная инсталляция и семь других площадок.","На вымышленном фестивале огни меняют путь прибывающих групп."],"hi":["उत्सव","न्यू ताइपे में सर्दियों की रोशनी जली","मुख्य रोशनी और सात अन्य इलाके एक ही शाम जगमगाए।","13 नवंबर 2026 को न्यू ताइपे में शीत उत्सव की शुरुआत मुख्य रोशनी और सात अन्य इलाकों को जगमगाकर हुई।","खेल के काल्पनिक उत्सव में रोशनी नए समूहों का रास्ता बदलती है।"],"ar":["مهرجان","أضواء الشتاء تضيء تايبيه الجديدة","أُضيء العرض الرئيسي وسبع مناطق أخرى في الأمسية نفسها.","في 13 نوفمبر 2026 افتتحت تايبيه الجديدة مهرجانها الشتوي بإضاءة العرض الرئيسي وسبع مناطق أخرى.","في المهرجان الخيالي تغيّر الأبراج المضاءة مسار الوافدين."]};
  const items = [
    { ...{"id":"topics:glowtide-parade","gameId":"glowtide-parade","kind":"news","eventDate":"2026-11-13","unlock":{"kind":"gameClear","gameId":"glowtide-parade"},"image":"/games/glowtide-parade/art/story.webp?wp-media=879f72712cc3be2b","cover":true}, news: glowtideNews },
    { id:"topics:last-quarter-relay",gameId:"last-quarter-relay",kind:"news",eventDate:"2026-11-11",unlock:{kind:"gameClear",gameId:"last-quarter-relay"},image:"/games/last-quarter-relay/art/cover.webp?wp-media=879f72712cc3be2b",cover:true,news:lastQuarterRelayNews },
    { ...{"id":"topics:parcel-pact","gameId":"parcel-pact","kind":"news","eventDate":"2026-11-11","unlock":{"kind":"gameClear","gameId":"parcel-pact"},"image":"/games/parcel-pact/art/cover.webp?wp-media=879f72712cc3be2b","cover":true}, news: parcelPactNews },
    { id:'topics:sunshift-commons', gameId:'sunshift-commons', kind:'news', eventDate:'2026-11-10', unlock:{kind:'gameClear',gameId:'sunshift-commons'}, image:'/games/sunshift-commons/art/story.webp?wp-media=879f72712cc3be2b', cover:true, news:sunshiftCommonsNews },
    { id:'topics:silicon-shift', gameId:'silicon-shift', kind:'news', eventDate:'2026-11-09', unlock:{kind:'gameClear',gameId:'silicon-shift'}, image:'/games/silicon-shift/art/cover.webp?wp-media=879f72712cc3be2b', cover:true, news:siliconShiftNews },
    { id:'topics:tidegate-relay', gameId:'tidegate-relay', kind:'news', eventDate:'2026-11-08', unlock:{kind:'gameClear',gameId:'tidegate-relay'}, image:'/games/tidegate-relay/assets/cover.webp?wp-media=879f72712cc3be2b', cover:true, news:tidegateNews },
    { id:'topics:rainline-chase', gameId:'rainline-chase', kind:'news', eventDate:'2026-11-07', unlock:{kind:'gameClear',gameId:'rainline-chase'}, image:'/games/rainline-chase/assets/story.webp?wp-media=879f72712cc3be2b', cover:true, news:rainlineNews },
    { id:'topics:gilded-gathering', gameId:'gilded-gathering', kind:'news', eventDate:'2026-11-04', unlock:{kind:'gameClear',gameId:'gilded-gathering'}, image:'/games/gilded-gathering/assets/cover.webp?wp-media=879f72712cc3be2b', cover:true, news:gatheringNews },
    { id:'topics:flying-tram', gameId:'flying-tram', unlock:{kind:'gameClear',gameId:'flying-tram'}, image:'/games/flying-tram/assets/cover-block-v1.webp?wp-media=879f72712cc3be2b', cover:true, news },
    { id:'topics:traffic-jam-diner', gameId:'traffic-jam-diner', unlock:{kind:'gameClear',gameId:'traffic-jam-diner'}, image:'/assets/traffic-jam-diner-cover-v3.png.webp?wp-media=879f72712cc3be2b', cover:true, news:trafficNews },
    { id:'topics:robot-dog-showtime', gameId:'robot-dog-showtime', unlock:{kind:'gameClear',gameId:'robot-dog-showtime'}, image:'/assets/robot-dog-showtime-cover-v3.webp?wp-media=879f72712cc3be2b', cover:true, news:robotNews },
    { id:'topics:smallwood-lives', gameId:'smallwood-lives', kind:'fiction', unlock:{kind:'gameClear',gameId:'smallwood-lives'}, image:'/games/smallwood-lives/assets/cover-v2.webp?wp-media=879f72712cc3be2b', cover:true, news:lifeStory }
  ];
  const dates = {'flying-tram':'2026-10-15','traffic-jam-diner':'2026-10-08','robot-dog-showtime':'2026-09-22'};
  items.forEach(item => { if (dates[item.gameId]) { item.kind = 'news'; item.eventDate = dates[item.gameId]; } });
  // intro, game artwork caption, unavailable game label
  const editorial = {
    en:['Short reads on the events behind our games. Read freely; complete a game to collect its story.','Game artwork','Coming soon'],
    'zh-Hant':['用短篇讀懂遊戲背後的事件。直接閱讀，完成遊戲後收藏故事。','遊戲原創美術','敬請期待'],
    'zh-Hans':['用短篇读懂游戏背后的事件。直接阅读，完成游戏后收藏故事。','游戏原创美术','敬请期待'],
    ja:['ゲームの背景を短い記事で。自由に読んで、クリアしたら物語を収集。','ゲームのアート','近日公開'],
    ko:['게임 속 배경을 짧은 글로 읽어보세요. 자유롭게 읽고 게임을 완료해 수집하세요.','게임 아트','출시 예정'],
    es:['Los hechos detrás de los juegos, en breve. Lee libremente y completa el juego para coleccionar su historia.','Arte del juego','Próximamente'],
    'pt-BR':['Os fatos por trás dos jogos, em poucas palavras. Leia livremente e conclua o jogo para colecionar a história.','Arte do jogo','Em breve'],
    fr:['Les faits derrière nos jeux, en bref. Lisez librement et terminez le jeu pour collectionner son histoire.','Illustration du jeu','Bientôt disponible'],
    de:['Kurze Artikel über die Hintergründe unserer Spiele. Frei lesen und durch Abschließen die Geschichte sammeln.','Spielgrafik','Demnächst'],
    it:['I fatti dietro i giochi, in breve. Leggi liberamente e completa il gioco per collezionarne la storia.','Illustrazione del gioco','Prossimamente'],
    ru:['Коротко о событиях за нашими играми. Читайте свободно и проходите игры, чтобы собирать истории.','Иллюстрация игры','Скоро'],
    hi:['खेलों के पीछे की घटनाएँ संक्षेप में पढ़ें। पढ़ना सबके लिए खुला है; कहानी संग्रह करने के लिए खेल पूरा करें।','खेल की कलाकृति','जल्द आ रहा है'],
    ar:['قراءات قصيرة عن خلفيات ألعابنا. اقرأ بحرية وأكمل اللعبة لتجمع قصتها.','رسوم اللعبة','قريباً']
  };
  const css = `
    .wpt-news{box-sizing:border-box;color:#23314d;background:#faf7ef;border:1px solid #e3d5b9;border-radius:22px;padding:clamp(16px,3vw,28px);font:500 16px/1.5 system-ui,sans-serif}
    .wpt-news *{box-sizing:border-box}.wpt-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;border-bottom:2px solid #24314b;padding-bottom:14px}.wpt-eyebrow{display:block;color:#b84f3e;font-size:.75rem;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.wpt-head h2{margin:2px 0;font-size:clamp(1.35rem,4vw,1.9rem);line-height:1.2;color:#24314b}.wpt-head p{margin:5px 0 0;color:#657087;font-size:.9rem}.wpt-close,.wpt-back{flex:none;border:1px solid #bdc3ca;background:white;color:#25344d;border-radius:999px;min-height:44px;padding:8px 16px;font:700 .9rem/1.2 system-ui,sans-serif;cursor:pointer}.wpt-news button:focus-visible,.wpt-news a:focus-visible{outline:3px solid #e1684d;outline-offset:3px}
    .wpt-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px;margin-top:18px}.wpt-card{border:1px solid #e3dccc;background:#fffdf8;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px #23314d0d}.wpt-card__body{padding:16px}.wpt-card h3{font-size:1.2rem;line-height:1.35;margin:7px 0;color:#24314b}.wpt-card p{color:#667186;font-size:.9rem;margin:0 0 14px}.wpt-tag{display:inline-block;color:#aa4a3d;font-size:.75rem;font-weight:800}.wpt-status{font-size:.82rem;font-weight:750;color:#6c7784}.wpt-read,.wpt-play{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 17px;border:0;border-radius:10px;background:#d45d49;color:#fff;text-decoration:none;font:750 .95rem/1.2 system-ui,sans-serif;cursor:pointer}.wpt-read:disabled{background:#e5e3dc;color:#6b7378;cursor:default}
    .wpt-story{max-width:680px;margin:0 auto}.wpt-story h3{font-size:clamp(1.55rem,5vw,2.25rem);line-height:1.2;margin:12px 0;color:#1f2d49}.wpt-story .wpt-lead{font-size:1.1rem;font-weight:650;color:#59657a}.wpt-story p{line-height:1.75}.wpt-story a:not(.wpt-play){color:#005b91;text-decoration:underline;font-weight:700}.wpt-back{margin-top:17px}.wpt-separator{border:0;border-top:1px solid #e1d9ca;margin:23px 0}.wpt-shot{margin:0}.wpt-shot img{display:block;width:100%;max-width:480px;height:auto;border-radius:12px;border:1px solid #d6d3c8;background:#d3e1dd}.wpt-shot figcaption{margin:7px 0 14px;color:#657087;font-size:.85rem}.wpt-game-title{font-size:1.05rem;font-weight:800;margin:0 0 10px}.wpt-grid[hidden],.wpt-story[hidden]{display:none}
    @media(max-width:520px){.wpt-news{padding:15px;border-radius:18px}.wpt-head h2{font-size:1.3rem}.wpt-close{padding:8px 12px}.wpt-story h3{font-size:1.5rem}.wpt-card__body{padding:14px}}
    @media(prefers-reduced-motion:reduce){.wpt-news *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
    .wpt-news{border-radius:6px;background:#fbf8ef;color:#26312d;overflow-wrap:anywhere}
    .wpt-head{border-top:5px solid #26312d;border-bottom:3px double #26312d;padding-block:18px}
    .wpt-head h2{font-family:Georgia,'Noto Serif TC',serif;font-size:clamp(1.6rem,4vw,2.5rem);color:#26312d}
    .wpt-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px}
    .wpt-card{min-width:0;border:0;border-bottom:1px solid #ccc5b5;border-radius:0;box-shadow:none;background:transparent;padding-block:20px}
    .wpt-card:first-child{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;border-bottom:3px double #26312d}
    .wpt-card__body{padding:14px 0 0}.wpt-card h3{font-family:Georgia,'Noto Serif TC',serif;font-size:1.4rem;color:#26312d}
    .wpt-card:first-child h3{font-size:clamp(1.6rem,3vw,2.2rem)}
    .wpt-card .wpt-shot img{width:100%;max-width:none;aspect-ratio:16/9;object-fit:contain;background:#e5e6df;border-radius:4px}
    .wpt-date{display:block;color:#657064;font-size:.8rem;margin-block:4px 10px;font-variant-numeric:tabular-nums}
    .wpt-read,.wpt-play{background:#24584b;border-radius:4px}.wpt-tag{color:#8e3d2c;letter-spacing:.06em}
    .wpt-story{max-width:720px;padding-bottom:8px}.wpt-story h3{font-family:Georgia,'Noto Serif TC',serif;color:#26312d}
    .wpt-game-panel{margin-top:24px;padding:20px;background:#edf0e7;border-inline-start:4px solid #24584b}
    .wpt-game-panel .wpt-shot img{max-height:260px;width:100%;object-fit:contain;border:0;border-radius:4px}
    .wpt-game-panel .wpt-play{width:100%}.wpt-game-title{margin-block:8px 12px}
    @media(max-width:600px){.wpt-grid{grid-template-columns:1fr}.wpt-card:first-child{display:block}.wpt-head{gap:8px}.wpt-game-panel{padding:14px}.wpt-news{padding:14px}.wpt-head h2{font-size:1.6rem}}
  `;
  function localeKey(locale) { return copy[locale] ? locale : /^zh/i.test(locale || '') ? 'zh-Hant' : /^pt/i.test(locale || '') ? 'pt-BR' : String(locale || 'en').split('-')[0] in copy ? String(locale).split('-')[0] : 'en'; }
  function element(tag, cls, text) { const node = document.createElement(tag); if (cls) node.className = cls; if (text != null) node.textContent = text; return node; }
  function render(root, context) {
    const c = context || {}, locale = localeKey(c.locale), t = copy[locale], e = editorial[locale], owned = new Set(c.unlockedIds || []);
    const date = item => {
      const node = element('time', 'wpt-date');
      if (item.eventDate) { node.dateTime = item.eventDate; node.textContent = new Intl.DateTimeFormat(locale, {year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(`${item.eventDate}T00:00:00Z`)); }
      return node;
    };
    const picture = (item, gameName) => {
      const caption = item.cover ? e[1] : t[9];
      const figure = element('figure', 'wpt-shot'), image = element('img');
      image.src = item.image; image.alt = `${caption}: ${gameName}`; image.width = 480; image.height = 480; image.loading = 'lazy';
      figure.append(image, element('figcaption', '', caption)); return figure;
    };
    const style = element('style'); style.textContent = css;
    const shell = element('section', 'wpt-news'); shell.dir = locale === 'ar' ? 'rtl' : 'ltr'; shell.setAttribute('aria-label', t[0]);
    const head = element('header', 'wpt-head'); const headings = element('div');
    headings.append(element('h2', '', t[0]), element('p', '', e[0]));
    const close = element('button', 'wpt-close', t[2]); close.type = 'button'; close.addEventListener('click', () => c.onClose?.()); head.append(headings, close);
    const grid = element('div', 'wpt-grid'); const story = element('article', 'wpt-story'); story.hidden = true;
    items.forEach(item => {
      const article = item.news[locale];
      const game = window.WONDER_LOBBY?.games?.find(entry => entry.id === item.gameId);
      const gameName = game?.title?.[locale] || game?.title?.en || item.gameId;
      const card = element('article', 'wpt-card'); card.dataset.gameId = item.gameId; const cardBody = element('div', 'wpt-card__body');
      cardBody.append(element('span', 'wpt-tag', article[0]), date(item), element('h3', '', article[1]), element('p', '', article[2]), element('p', 'wpt-status', owned.has(item.id) ? t[3] : `${t[4]} · ${t[5]}`));
      const read = element('button', 'wpt-read', t[6]); read.type = 'button'; read.setAttribute('aria-label', `${t[6]}: ${article[1]}`); cardBody.append(read); card.append(picture(item, gameName), cardBody); grid.append(card);
      read.addEventListener('click', () => {
        const back = element('button', 'wpt-back', t[7]); back.type = 'button';
        const storyTitle = element('h3', '', article[1]); storyTitle.tabIndex = -1;
        const figure = picture(item, gameName);
        const path = `/games/${item.gameId}/`;
        const playable = game?.status === 'playable' && !game.internalOnly;
        const play = element(playable ? 'a' : 'p', playable ? 'wpt-play' : 'wpt-status', playable ? t[10] : e[2]);
        if (playable) { play.href = window.WonderI18n?.localizedPath?.(locale, path) || path; play.dataset.wpTopicGameId = item.gameId; }
        const panel = element('aside', 'wpt-game-panel');
        const gameTitle = element('p', 'wpt-game-title', gameName); gameTitle.dataset.runtimeLocalize = 'off';
        panel.append(figure, gameTitle, element('p', '', article[4]), play);
        story.replaceChildren(back, element('p', 'wpt-tag', article[0]), date(item), storyTitle, element('p', 'wpt-lead', article[2]), element('p', '', article[3]), panel);
        back.addEventListener('click', () => { story.hidden = true; grid.hidden = false; read.focus(); });
        grid.hidden = true; story.hidden = false; storyTitle.focus();
      });
    });
    root.replaceChildren(style, shell); shell.append(head, grid, story);
  }
  let registered = false;
  function register() {
    const api = window.WeightPlayCollections;
    if (registered || typeof api?.register !== 'function') return;
    // register() emits the ready event synchronously; fence re-entry first.
    registered = true;
    if (!api.register({ id: 'topics', items, render })) registered = false;
  }
  register(); window.addEventListener('WeightPlayCollectionsReady', register);
})();
