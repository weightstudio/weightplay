import {CAMPAIGN_LOCALES} from './campaign-copy.mjs';
const labels={
 en:'Start Game|Game guide|Settings|Language|Sound',
 'zh-Hant':'開始遊戲|遊戲指南|設定|語言|音效',
 'zh-Hans':'开始游戏|游戏指南|设置|语言|音效',
 ja:'ゲーム開始|ゲームガイド|設定|言語|効果音',
 ko:'게임 시작|게임 안내|설정|언어|효과음',
 es:'Iniciar juego|Guía del juego|Ajustes|Idioma|Sonido',
 'pt-BR':'Iniciar jogo|Guia do jogo|Configurações|Idioma|Som',
 fr:'Commencer le jeu|Guide du jeu|Paramètres|Langue|Son',
 de:'Spiel starten|Spielanleitung|Einstellungen|Sprache|Ton',
 it:'Inizia il gioco|Guida al gioco|Impostazioni|Lingua|Audio',
 ru:'Начать игру|Руководство|Настройки|Язык|Звук',
 hi:'खेल शुरू करें|खेल की गाइड|सेटिंग|भाषा|ध्वनि',
 ar:'ابدأ اللعبة|دليل اللعبة|الإعدادات|اللغة|الصوت',
};
const stars={
 en:'Earn three stars by clearing without hints or undo. Using either costs one star; using both earns one star. Replay to improve your best.',
 'zh-Hant':'不使用提示與撤銷完成清盤可得三星。使用其中一種扣一星，兩種都用則得一星；重玩可刷新最佳紀錄。',
 'zh-Hans':'不使用提示与撤销完成清盘可得三星。使用其中一种扣一星，两种都用则得一星；重玩可刷新最佳纪录。',
 ja:'ヒントも取り消しも使わずにクリアすると星3個です。どちらかを使うと星2個、両方使うと星1個。再挑戦で記録を更新できます。',
 ko:'힌트와 되돌리기 없이 완료하면 별 3개를 받습니다. 하나를 사용하면 별 2개, 둘 다 사용하면 별 1개입니다. 다시 도전해 기록을 높이세요.',
 es:'Consigue tres estrellas sin pistas ni deshacer. Usar una de estas ayudas resta una estrella; usar ambas deja una. Repite para mejorar tu récord.',
 'pt-BR':'Ganhe três estrelas sem dicas nem desfazer. Usar uma dessas ajudas tira uma estrela; usar ambas deixa uma. Jogue novamente para melhorar seu recorde.',
 fr:'Gagnez trois étoiles sans indice ni annulation. Une aide coûte une étoile ; les deux laissent une étoile. Rejouez pour améliorer votre record.',
 de:'Ohne Tipps und Rücknahmen erhältst du drei Sterne. Eine Hilfe kostet einen Stern, beide ergeben einen Stern. Verbessere deinen Rekord beim Wiederholen.',
 it:'Ottieni tre stelle senza indizi né annullamenti. Un aiuto costa una stella; entrambi lasciano una stella. Rigioca per migliorare il record.',
 ru:'Без подсказок и отмен вы получаете три звезды. Один вид помощи отнимает звезду, оба оставляют одну. Повторите уровень, чтобы улучшить рекорд.',
 hi:'बिना संकेत या कदम वापस लिए बोर्ड साफ़ करने पर तीन सितारे मिलते हैं। एक तरह की मदद से एक सितारा घटता है, दोनों से एक सितारा मिलता है। बेहतर रिकॉर्ड के लिए फिर खेलें।',
 ar:'احصل على ثلاث نجوم دون تلميحات أو تراجع. استخدام إحدى المساعدتين يخصم نجمة، واستخدامهما معًا يمنح نجمة واحدة. أعد اللعب لتحسين أفضل نتيجة.',
};
const progression={
 en:'Clear each board to unlock the next of 30 stages. Completed stages remain available. Progress is saved in this browser when storage is available.',
 'zh-Hant':'清空牌盤即可解鎖下一關，共 30 關。已完成關卡可重玩；瀏覽器允許儲存時會保留進度。',
 'zh-Hans':'清空牌盘即可解锁下一关，共 30 关。已完成关卡可重玩；浏览器允许存储时会保留进度。',
 ja:'盤面を空にすると次のステージが開きます。全30ステージです。クリア済みのステージは再挑戦でき、保存可能な場合はこのブラウザーに進行状況が残ります。',
 ko:'보드를 비우면 다음 단계가 열립니다. 총 30단계이며 완료한 단계는 다시 플레이할 수 있습니다. 저장이 가능하면 이 브라우저에 진행 상황이 보관됩니다.',
 es:'Vacía el tablero para desbloquear el siguiente de 30 niveles. Puedes repetir los completados. El progreso se guarda en este navegador si permite almacenamiento.',
 'pt-BR':'Limpe o tabuleiro para liberar a próxima das 30 fases. As concluídas podem ser repetidas. O progresso fica neste navegador quando o armazenamento está disponível.',
 fr:'Videz le plateau pour débloquer le suivant parmi 30 niveaux. Les niveaux terminés restent rejouables. La progression est conservée dans ce navigateur si le stockage est disponible.',
 de:'Leere das Brett, um das nächste der 30 Level freizuschalten. Geschaffte Level bleiben spielbar. Fortschritt wird in diesem Browser gespeichert, sofern möglich.',
 it:'Svuota il tavolo per sbloccare il successivo dei 30 livelli. Puoi ripetere quelli completati. I progressi vengono salvati in questo browser quando possibile.',
 ru:'Очистите поле, чтобы открыть следующий из 30 уровней. Пройденные уровни можно повторять. Прогресс сохраняется в этом браузере, если хранилище доступно.',
 hi:'अगला स्तर खोलने के लिए बोर्ड साफ़ करें। कुल 30 स्तर हैं और पूरे किए गए स्तर फिर खेल सकते हैं। उपलब्ध होने पर प्रगति इस ब्राउज़र में सहेजी जाती है।',
 ar:'أخلِ اللوح لفتح المرحلة التالية من أصل 30 مرحلة. يمكنك إعادة المراحل المكتملة. يُحفظ التقدم في هذا المتصفح عند توفر التخزين.',
};
const keys=['startGame','guide','settings','language','sound'];
export const MAHJONG_MAIN_COPY=Object.freeze(Object.fromEntries(CAMPAIGN_LOCALES.map(l=>[l,Object.freeze({...Object.fromEntries(labels[l].split('|').map((v,i)=>[keys[i],v])),starsRule:stars[l],progression:progression[l]})])));
export function mahjongMainCopy(locale){const row=MAHJONG_MAIN_COPY[locale];if(!row)throw new Error('Unsupported Main locale');return row;}
