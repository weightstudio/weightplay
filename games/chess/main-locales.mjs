const rows={
 en:['Start Game','Challenges cleared','Back to lobby','Move your pieces to checkmate the king. Choose a tactical challenge or a full match.'],
 'zh-Hant':['開始遊戲','已完成挑戰','返回大廳','移動棋子，將死對方國王。選擇戰術挑戰或完整對局。'],
 'zh-Hans':['开始游戏','已完成挑战','返回大厅','移动棋子，将死对方国王。选择战术挑战或完整对局。'],
 ja:['ゲーム開始','クリアした課題','ロビーに戻る','駒を動かしてチェックメイト。戦術課題か通常対局を選びましょう。'],
 ko:['게임 시작','완료한 도전','로비로 돌아가기','기물을 움직여 체크메이트하세요. 전술 도전이나 전체 대국을 선택하세요.'],
 es:['Iniciar juego','Retos completados','Volver al vestíbulo','Mueve tus piezas para dar jaque mate. Elige un reto táctico o una partida completa.'],
 'pt-BR':['Iniciar jogo','Desafios concluídos','Voltar ao saguão','Mova as peças para dar xeque-mate. Escolha um desafio tático ou uma partida completa.'],
 fr:['Commencer','Défis terminés','Retour au hall','Déplacez vos pièces pour faire échec et mat. Choisissez un défi tactique ou une partie complète.'],
 de:['Spiel starten','Gelöste Aufgaben','Zur Lobby','Ziehe deine Figuren und setze den König matt. Wähle eine Taktikaufgabe oder eine vollständige Partie.'],
 it:['Inizia gioco','Sfide completate','Torna alla sala','Muovi i pezzi per dare scacco matto. Scegli una sfida tattica o una partita completa.'],
 ru:['Начать игру','Пройдено задач','Вернуться в лобби','Ходите фигурами и поставьте мат королю. Выберите тактическую задачу или полную партию.'],
 hi:['खेल शुरू करें','पूरी की गई चुनौतियाँ','लॉबी में लौटें','मोहरे चलाकर राजा को मात दें। रणनीतिक चुनौती या पूरी बाज़ी चुनें।'],
 ar:['ابدأ اللعب','التحديات المكتملة','العودة إلى الردهة','حرّك قطعك لكش مات الملك. اختر تحديًا تكتيكيًا أو مباراة كاملة.']
};
export const mainLocales=Object.fromEntries(Object.entries(rows).map(([locale,[start,progress,back,intro]])=>[locale,{start,progress,back,intro}]));
