// Game-owned runtime copy. No fallback locale and no gameplay/state mutation.
// Official names remain sourced from the same publication title catalog.
import {OPERATIONS} from './defense.mjs?v=orbit-v10-central-cannon-final';
import {publicationTitles} from './publication-copy.mjs';

const keys = `summary device desktopOnly start progress stageProgress mission cleared ready locked stageWaves stageControls stages back pauseBack pause arenaAria towerAria healthLabel towerPercent waveLabel waveProgress blastReady blastCooldown objective controls waveStart waveClearVictory waveClear bossWarning contextLost contextRestored pauseTitle pauseControls reduceMotion assist quality nextEntry qualityLow qualityMedium qualityHigh persistent memoryOnly performance diagnostics backup exportSave importSave resume returnStage upgradeOverline upgradeTitle upgradeIntro success loss settled resultStats resultWinNext resultWinAll resultLoss nextStage replay errorTitle errorMessage reload importTooLarge importSuccess importFailure saveInvalid sceneLoading help close guideAria localeAria posterAlt powerName powerDescription rapidName rapidDescription spreadName spreadDescription repairName repairDescription`.split(' ');

// Each line corresponds to exactly one key above. Tables are validated before use.
const source = {
  en: `Aim and hold to fire. Stop the zombies and protect the tower!
Phone or tablet: touch and drag · Computer: mouse aiming.
Touch and mouse controls available
Start Game
Defence missions {done} / {total}
Defended {done} / {total}
Defence mission {n}
Defended
Ready to defend
Complete the previous mission to unlock
{waves} waves · Defeat the final boss
Aim and hold to fire · Protect the tower
Missions
Back
Pause and return to missions
Pause
Zombie tower defence. Mouse: aim and hold the left button to fire. Touch: hold and drag the battlefield to aim and fire; lift to stop. Use the blast and pause buttons. Right button or Space also blasts; F fires at the reticle; Esc pauses.
Tower health remaining
Tower
Tower {percent}%
Wave
Wave {wave}/{total}
Blast
Blast {seconds}s
Protect the tower · {count} zombies
Aim and hold to fire · Blast button · Pause
Wave {wave} · Hold the tower
The tower is safe!
Wave cleared! Choose an upgrade.
Giant zombie incoming!
Graphics context lost. Saved mission progress is safe; return to missions and retry.
Graphics restored. Return to missions and enter again.
Paused
Mouse: aim and hold left to fire. Touch: hold and drag the battlefield to aim and fire; lift to stop. Use the blast and pause buttons. Right button/Space: blast; F: fire at the reticle; Esc: pause.
Reduce motion
Assist mode (next entry)
Quality
Applies next entry
Smooth
Standard
Detailed
Local saving is available. Wins save mission progress; leaving restarts this battle.
Progress is temporary in this session. Export a backup before leaving.
Performance
Local rendering measurements
Local save backup
Export JSON
Import JSON
Continue
Return to missions
Wave cleared
Prepare the defence
Choose one upgrade for the next wave. Its effect lasts for this battle.
Defence successful!
The tower fell
Defence ended
{name} · Defeated {kills} · Score {score} · Tower {hp}/{max}
The tower is safe. The next mission is unlocked.
All defence missions cleared! Replay to improve your score.
Focus on zombies nearest the tower, use blasts, and repair between waves.
Next mission
Replay
Battlefield could not start
The battlefield could not load. Please retry or return to missions.
Reload
The save exceeds 256 KB.
Import complete. Return to missions to apply progress.
Import failed. Select a valid save exported by this game.
The save file is invalid or uses an unsupported version.
Building the defence…
How to play
Close
Game guide
Language
Block-maned lion firing a blue energy cannon from a bright tower at approaching block zombies.
High-energy magazine
Shot damage +25% · Blast power +15%
Rapid barrel
Fire rate +20%
Fan barrage
Adds two side shots to widen the firing arc
Emergency repair
Restores 30% tower health and adds 5% maximum health`,
  'zh-Hant': `瞄準、按住連射！擊退殭屍，別讓主塔倒下。
手機／平板：按住拖曳 · 電腦：滑鼠瞄準。
支援觸控與滑鼠操作
開始遊戲
守塔任務 {done} / {total}
已守住 {done} / {total}
防衛任務 {n}
已守住
準備迎戰
完成前一任務開放
{waves} 波敵潮 · 擊退最終首領
瞄準並按住連射 · 保護主塔
任務
返回
暫停並返回任務
暫停
殭屍守塔戰場。滑鼠瞄準，按住左鍵連射。觸控時按住戰場並拖曳瞄準連射，放開停止。可使用畫面上的震爆與暫停按鈕；右鍵或 Space 也可震爆，F 向準星射擊，Esc 暫停。
主塔剩餘生命
主塔
主塔 {percent}%
敵潮
敵潮 {wave}/{total}
震爆
震爆 {seconds}秒
守住主塔 · 場上 {count} 隻殭屍
瞄準並按住連射 · 震爆按鈕 · 暫停
第 {wave} 波 · 守住主塔
敵潮退去，主塔安全！
敵潮清空！選擇本次強化。
巨型殭屍來襲！
繪圖環境中斷。已保存的任務進度仍在；請返回選關後重試。
繪圖環境已恢復，請返回選關後重新進入。
已暫停
滑鼠瞄準、按住左鍵連射。觸控時按住戰場並拖曳瞄準連射，放開停止；使用畫面上的震爆與暫停按鈕。右鍵／Space 震爆，F 向準星射擊，Esc 暫停。
減少動態
輔助模式（下次進入生效）
畫質
下次進入生效
流暢
標準
細緻
本機存檔可用。任務進度於勝利時保存；離開會重新開始本次戰鬥。
目前僅暫存本次遊玩；離開前請匯出備份。
效能資訊
本機繪圖觀察
本機存檔備份
匯出 JSON
匯入 JSON
繼續
返回任務
敵潮已清空
整備防線
選擇一項強化，迎戰下一波。效果只限本次戰鬥。
防衛成功！
主塔倒下了
防衛結束
{name} · 擊退 {kills} 隻 · 分數 {score} · 主塔 {hp}/{max}
主塔安全，下一個防衛任務已開放。
全部防衛任務已完成，可以重玩挑戰更高分。
優先擊退靠近主塔的殭屍，善用震爆；每波之間可以修塔。
下一任務
重玩
戰場無法啟動
無法載入戰場，請重試或返回任務。
重新載入
存檔超過 256 KB。
匯入成功，返回任務後套用進度。
匯入失敗，請選擇本作匯出的有效存檔。
存檔格式無效，或版本尚不支援。
正在建立防線…
玩法說明
關閉
遊戲說明
語言
方塊爆炸頭獅子站在明亮主塔上，以藍色能量炮迎擊方塊殭屍。
高能彈匣
每發傷害 +25% · 震爆威力 +15%
極速槍管
連射速度 +20%
扇形火網
增加兩發側彈，拓寬防線
緊急修復
恢復主塔 30% 生命，增加 5% 最大生命`,
  'zh-Hans': `瞄准、按住连射！击退僵尸，别让主塔倒下。
手机／平板：按住拖动 · 电脑：鼠标瞄准。
支持触控与鼠标操作
开始游戏
守塔任务 {done} / {total}
已守住 {done} / {total}
防卫任务 {n}
已守住
准备迎战
完成前一任务开放
{waves} 波敌潮 · 击退最终首领
瞄准并按住连射 · 保护主塔
任务
返回
暂停并返回任务
暂停
僵尸守塔战场。鼠标瞄准，按住左键连射。触控时按住战场并拖动瞄准连射，松开停止。可使用画面上的震爆与暂停按钮；右键或 Space 也可震爆，F 向准星射击，Esc 暂停。
主塔剩余生命
主塔
主塔 {percent}%
敌潮
敌潮 {wave}/{total}
震爆
震爆 {seconds}秒
守住主塔 · 场上 {count} 只僵尸
瞄准并按住连射 · 震爆按钮 · 暂停
第 {wave} 波 · 守住主塔
敌潮退去，主塔安全！
敌潮清空！选择本次强化。
巨型僵尸来袭！
绘图环境中断。已保存的任务进度仍在；请返回选关后重试。
绘图环境已恢复，请返回选关后重新进入。
已暂停
鼠标瞄准、按住左键连射。触控时按住战场并拖动瞄准连射，松开停止；使用画面上的震爆与暂停按钮。右键／Space 震爆，F 向准星射击，Esc 暂停。
减少动态
辅助模式（下次进入生效）
画质
下次进入生效
流畅
标准
精细
本地存档可用。任务进度在胜利时保存；离开会重新开始本次战斗。
目前仅暂存本次游玩；离开前请导出备份。
性能信息
本地绘图观测
本地存档备份
导出 JSON
导入 JSON
继续
返回任务
敌潮已清空
整备防线
选择一项强化，迎战下一波。效果仅限本次战斗。
防卫成功！
主塔倒下了
防卫结束
{name} · 击退 {kills} 只 · 分数 {score} · 主塔 {hp}/{max}
主塔安全，下一个防卫任务已开放。
全部防卫任务已完成，可以重玩挑战更高分。
优先击退靠近主塔的僵尸，善用震爆；每波之间可以修塔。
下一任务
重玩
战场无法启动
无法载入战场，请重试或返回任务。
重新载入
存档超过 256 KB。
导入成功，返回任务后应用进度。
导入失败，请选择本作导出的有效存档。
存档格式无效，或版本尚不支持。
正在建立防线…
玩法说明
关闭
游戏说明
语言
方块爆炸头狮子站在明亮主塔上，以蓝色能量炮迎击方块僵尸。
高能弹匣
每发伤害 +25% · 震爆威力 +15%
极速枪管
连射速度 +20%
扇形火网
增加两发侧弹，拓宽防线
紧急修复
恢复主塔 30% 生命，增加 5% 最大生命`,
  ja: `狙って長押しで連射！ゾンビを撃退して塔を守ろう。
スマホ／タブレット：長押しとドラッグ · パソコン：マウス照準。
タッチ操作とマウスに対応
ゲーム開始
防衛ミッション {done} / {total}
防衛済み {done} / {total}
防衛ミッション {n}
防衛済み
出撃準備完了
前のミッションをクリアすると開放
{waves} ウェーブ · 最後のボスを撃退
狙って長押しで連射 · 塔を守ろう
ミッション
戻る
一時停止してミッションへ
一時停止
ゾンビから塔を守る戦場。マウスで狙い、左ボタン長押しで連射。タッチ操作では戦場を長押ししてドラッグで照準し、指を離すと射撃を停止します。衝撃波と一時停止は画面のボタンを使えます。右ボタンまたは Space で衝撃波、F で照準へ射撃、Esc で一時停止。
塔の残り耐久力
塔
塔 {percent}%
ウェーブ
ウェーブ {wave}/{total}
衝撃波
衝撃波 {seconds}秒
塔を守ろう · ゾンビ {count} 体
狙って長押しで連射 · 衝撃波ボタン · 一時停止
ウェーブ {wave} · 塔を守ろう
敵を撃退！塔は無事だ！
ウェーブクリア！強化を選ぼう。
巨大ゾンビが接近！
描画機能が停止しました。保存済みの進行は無事です。ミッションに戻って再挑戦してください。
描画機能が復旧しました。ミッションに戻り、入り直してください。
一時停止中
マウスで狙い、左ボタン長押しで連射。タッチ操作は戦場を長押しし、ドラッグで照準、指を離すと停止。衝撃波と一時停止は画面のボタンで操作できます。右ボタン／Space で衝撃波、F で照準へ射撃、Esc で一時停止。
動きを減らす
アシストモード（次回入場時）
画質
次回入場時に反映
軽量
標準
高精細
ローカル保存が使えます。勝利時に進行を保存します。退出すると今回の戦闘は最初からです。
今回は一時保存のみです。退出前にバックアップを出力してください。
動作情報
この端末の描画計測
ローカル保存のバックアップ
JSON を出力
JSON を読み込む
続ける
ミッションへ戻る
ウェーブクリア
防衛線を整えよう
次のウェーブに向けて強化を一つ選ぼう。効果は今回の戦闘中のみ。
防衛成功！
塔が倒れた
防衛終了
{name} · 撃退 {kills} 体 · スコア {score} · 塔 {hp}/{max}
塔は無事だ。次の防衛ミッションが開放された。
全ミッションをクリア！再挑戦してハイスコアを目指そう。
塔に近い敵を優先し、衝撃波を活用しよう。ウェーブの合間に修理もできる。
次のミッション
再挑戦
戦場を起動できません
戦場を読み込めませんでした。再試行するか、ミッションに戻ってください。
再読み込み
保存データが 256 KB を超えています。
読み込みました。ミッションに戻ると進行が反映されます。
読み込めません。このゲームから出力した有効な保存データを選んでください。
保存形式が無効か、未対応のバージョンです。
防衛線を準備中…
遊び方
閉じる
ゲームガイド
言語
明るい塔の上で青いエネルギー砲を撃ち、迫るブロックゾンビを迎え撃つ、ブロックたてがみのライオン。
高出力マガジン
弾の威力 +25% · 衝撃波の威力 +15%
速射バレル
連射速度 +20%
扇状弾幕
左右に一発ずつ追加し、射撃範囲を広げる
緊急修理
塔の耐久力を 30% 回復し、最大値を 5% 増加`,
  ko: `조준하고 누른 채 연사하세요! 좀비를 물리치고 탑을 지키세요.
휴대전화／태블릿: 누른 채 드래그 · 컴퓨터: 마우스 조준.
터치와 마우스 조작 지원
게임 시작
방어 임무 {done} / {total}
방어 완료 {done} / {total}
방어 임무 {n}
방어 완료
출격 준비 완료
이전 임무를 완료하면 해제
{waves} 차례의 습격 · 마지막 보스 격퇴
조준하고 누른 채 연사 · 탑을 지키세요
임무
뒤로
일시 정지 후 임무로 돌아가기
일시 정지
좀비로부터 탑을 지키는 전장입니다. 마우스로 조준하고 왼쪽 버튼을 누른 채 연사합니다. 터치는 전장을 누른 채 드래그해 조준하고 사격하며, 손을 떼면 멈춥니다. 화면의 충격파와 일시 정지 버튼을 사용할 수 있습니다. 오른쪽 버튼 또는 Space로 충격파, F로 조준점에 사격, Esc로 일시 정지합니다.
탑의 남은 체력
탑
탑 {percent}%
습격
습격 {wave}/{total}
충격파
충격파 {seconds}초
탑을 지키세요 · 좀비 {count}마리
조준하고 누른 채 연사 · 충격파 버튼 · 일시 정지
습격 {wave} · 탑을 지키세요
좀비 격퇴! 탑은 안전합니다!
습격 격퇴! 강화를 선택하세요.
거대 좀비가 다가옵니다!
그래픽 연결이 끊겼습니다. 저장된 임무 진행은 안전합니다. 임무로 돌아가 다시 시도하세요.
그래픽이 복구되었습니다. 임무로 돌아간 뒤 다시 입장하세요.
일시 정지됨
마우스로 조준하고 왼쪽 버튼을 누른 채 연사합니다. 터치는 전장을 누른 채 드래그해 조준하고 사격하며 손을 떼면 멈춥니다. 충격파와 일시 정지는 화면 버튼을 사용하세요. 오른쪽 버튼／Space 충격파, F 조준점 사격, Esc 일시 정지.
움직임 줄이기
보조 모드（다음 입장부터 적용）
화질
다음 입장부터 적용
원활
표준
정밀
로컬 저장을 사용할 수 있습니다. 승리 시 임무 진행이 저장됩니다. 나가면 이번 전투가 처음부터 시작됩니다.
현재 플레이는 임시로만 저장됩니다. 나가기 전에 백업을 내보내세요.
성능 정보
이 기기의 렌더링 측정
로컬 저장 백업
JSON 내보내기
JSON 가져오기
계속
임무로 돌아가기
습격 격퇴
방어선 정비
다음 습격을 위한 강화 하나를 선택하세요. 효과는 이번 전투에만 적용됩니다.
방어 성공!
탑이 무너졌습니다
방어 종료
{name} · 격퇴 {kills}마리 · 점수 {score} · 탑 {hp}/{max}
탑은 안전합니다. 다음 방어 임무가 열렸습니다.
모든 방어 임무 완료! 다시 플레이하며 높은 점수에 도전하세요.
탑에 가까운 좀비부터 공격하고 충격파를 활용하세요. 습격 사이에는 수리할 수 있습니다.
다음 임무
다시 플레이
전장을 시작할 수 없습니다
전장을 불러오지 못했습니다. 다시 시도하거나 임무로 돌아가세요.
새로고침
저장 파일이 256 KB를 초과합니다.
가져왔습니다. 임무로 돌아가면 진행이 적용됩니다.
가져오지 못했습니다. 이 게임에서 내보낸 유효한 저장 파일을 선택하세요.
저장 형식이 올바르지 않거나 지원하지 않는 버전입니다.
방어선을 준비하는 중…
플레이 방법
닫기
게임 안내
언어
밝은 탑 위에서 파란 에너지 대포로 다가오는 블록 좀비를 막는 블록 갈기 사자.
고에너지 탄창
탄환 피해 +25% · 충격파 위력 +15%
속사 총열
연사 속도 +20%
부채꼴 탄막
양옆 탄환 두 발을 추가해 사격 범위를 넓힙니다
긴급 수리
탑 체력 30% 회복 및 최대 체력 5% 증가`,
  es: `Apunta y mantén pulsado para disparar. ¡Frena a los zombis y protege la torre!
Móvil/tableta: mantén y arrastra · Ordenador: apunta con el ratón.
Controles táctiles y de ratón disponibles
Jugar
Misiones de defensa {done} / {total}
Defendidas {done} / {total}
Misión de defensa {n}
Defendida
Listo para defender
Completa la misión anterior para desbloquear
{waves} oleadas · Derrota al jefe final
Apunta y mantén para disparar · Protege la torre
Misiones
Volver
Pausar y volver a misiones
Pausa
Defiende la torre de los zombis. Ratón: apunta y mantén el botón izquierdo para disparar. Táctil: mantén y arrastra sobre el campo para apuntar y disparar; suelta para parar. Usa los botones de explosión y pausa. Derecho o Space: explosión; F: disparar a la mira; Esc: pausa.
Salud restante de la torre
Torre
Torre {percent}%
Oleada
Oleada {wave}/{total}
Explosión
Explosión {seconds}s
Protege la torre · {count} zombis
Apunta y mantén para disparar · Botón de explosión · Pausa
Oleada {wave} · Defiende la torre
¡La torre está a salvo!
¡Oleada superada! Elige una mejora.
¡Se acerca un zombi gigante!
Se ha perdido el contexto gráfico. El progreso guardado está a salvo; vuelve a misiones e inténtalo de nuevo.
Gráficos recuperados. Vuelve a misiones y entra otra vez.
En pausa
Ratón: apunta y mantén el botón izquierdo para disparar. Táctil: mantén y arrastra sobre el campo para apuntar y disparar; suelta para parar. Usa los botones de explosión y pausa. Derecho/Space: explosión; F: disparar a la mira; Esc: pausa.
Reducir movimiento
Modo de ayuda (próxima entrada)
Calidad
Se aplica al volver a entrar
Fluida
Estándar
Detallada
Guardado local disponible. Las victorias guardan el progreso; al salir, esta batalla se reinicia.
El progreso es temporal en esta sesión. Exporta una copia antes de salir.
Rendimiento
Mediciones gráficas de este equipo
Copia del guardado local
Exportar JSON
Importar JSON
Continuar
Volver a misiones
Oleada superada
Prepara la defensa
Elige una mejora para la siguiente oleada. Su efecto dura esta batalla.
¡Defensa conseguida!
La torre ha caído
Defensa terminada
{name} · Derrotados {kills} · Puntos {score} · Torre {hp}/{max}
La torre está a salvo. La siguiente misión está desbloqueada.
¡Todas las misiones completadas! Repite para mejorar tu puntuación.
Prioriza a los zombis más cercanos a la torre, usa explosiones y repara entre oleadas.
Siguiente misión
Repetir
No se pudo iniciar la batalla
No se pudo cargar la batalla. Reinténtalo o vuelve a misiones.
Recargar
El guardado supera los 256 KB.
Importación completada. Vuelve a misiones para aplicar el progreso.
No se pudo importar. Elige un guardado válido exportado por este juego.
El formato del guardado no es válido o su versión no es compatible.
Preparando la defensa…
Cómo jugar
Cerrar
Guía del juego
Idioma
Un león de melena de bloques dispara un cañón de energía azul desde una torre luminosa contra zombis de bloques.
Cargador de alta energía
Daño por disparo +25% · Potencia de explosión +15%
Cañón rápido
Cadencia de disparo +20%
Fuego en abanico
Añade dos disparos laterales para ampliar el arco de fuego
Reparación urgente
Restaura un 30% de salud de la torre y añade un 5% a la salud máxima`,
  'pt-BR': `Mire e segure para disparar. Detenha os zumbis e proteja a torre!
Celular/tablet: segure e arraste · Computador: mire com o mouse.
Controles por toque e mouse disponíveis
Jogar
Missões de defesa {done} / {total}
Defendidas {done} / {total}
Missão de defesa {n}
Defendida
Pronto para defender
Conclua a missão anterior para desbloquear
{waves} ondas · Derrote o chefe final
Mire e segure para disparar · Proteja a torre
Missões
Voltar
Pausar e voltar às missões
Pausa
Defenda a torre dos zumbis. Mouse: mire e segure o botão esquerdo para disparar. Toque: segure e arraste no campo para mirar e disparar; solte para parar. Use os botões de explosão e pausa. Botão direito ou Space: explosão; F: disparar na mira; Esc: pausa.
Vida restante da torre
Torre
Torre {percent}%
Onda
Onda {wave}/{total}
Explosão
Explosão {seconds}s
Proteja a torre · {count} zumbis
Mire e segure para disparar · Botão de explosão · Pausa
Onda {wave} · Defenda a torre
A torre está segura!
Onda vencida! Escolha uma melhoria.
Um zumbi gigante está chegando!
O contexto gráfico foi perdido. O progresso salvo está seguro; volte às missões e tente novamente.
Gráficos restaurados. Volte às missões e entre novamente.
Em pausa
Mouse: mire e segure o botão esquerdo para disparar. Toque: segure e arraste no campo para mirar e disparar; solte para parar. Use os botões de explosão e pausa. Direito/Space: explosão; F: disparar na mira; Esc: pausa.
Reduzir movimento
Modo de ajuda (próxima entrada)
Qualidade
Aplicado na próxima entrada
Fluida
Padrão
Detalhada
Salvamento local disponível. As vitórias salvam o progresso; sair reinicia esta batalha.
O progresso é temporário nesta sessão. Exporte uma cópia antes de sair.
Desempenho
Medições gráficas deste computador
Cópia do salvamento local
Exportar JSON
Importar JSON
Continuar
Voltar às missões
Onda vencida
Prepare a defesa
Escolha uma melhoria para a próxima onda. O efeito dura esta batalha.
Defesa bem-sucedida!
A torre caiu
Defesa encerrada
{name} · Derrotados {kills} · Pontos {score} · Torre {hp}/{max}
A torre está segura. A próxima missão foi desbloqueada.
Todas as missões concluídas! Jogue novamente para melhorar sua pontuação.
Priorize os zumbis perto da torre, use explosões e faça reparos entre as ondas.
Próxima missão
Jogar novamente
Não foi possível iniciar a batalha
Não foi possível carregar a batalha. Tente novamente ou volte às missões.
Recarregar
O salvamento ultrapassa 256 KB.
Importação concluída. Volte às missões para aplicar o progresso.
Falha na importação. Escolha um salvamento válido exportado por este jogo.
O formato do salvamento é inválido ou a versão não é compatível.
Preparando a defesa…
Como jogar
Fechar
Guia do jogo
Idioma
Um leão de juba de blocos dispara um canhão de energia azul de uma torre iluminada contra zumbis de blocos.
Carregador de alta energia
Dano por disparo +25% · Potência da explosão +15%
Cano de disparo rápido
Cadência de disparo +20%
Rajada em leque
Adiciona dois disparos laterais para ampliar o arco de tiro
Reparo de emergência
Restaura 30% da vida da torre e aumenta a vida máxima em 5%`,
  fr: `Visez et maintenez pour tirer. Arrêtez les zombies et protégez la tour !
Téléphone/tablette : maintenir et glisser · Ordinateur : viser à la souris.
Commandes tactiles et souris disponibles
Jouer
Missions de défense {done} / {total}
Défendues {done} / {total}
Mission de défense {n}
Défendue
Prêt à défendre
Terminez la mission précédente pour débloquer
{waves} vagues · Battez le boss final
Visez et maintenez pour tirer · Protégez la tour
Missions
Retour
Mettre en pause et revenir aux missions
Pause
Défendez la tour contre les zombies. Souris : visez et maintenez le bouton gauche pour tirer. Tactile : maintenez et glissez sur le terrain pour viser et tirer ; relâchez pour arrêter. Utilisez les boutons d’explosion et de pause. Bouton droit ou Space : explosion ; F : tir vers le viseur ; Esc : pause.
Vie restante de la tour
Tour
Tour {percent} %
Vague
Vague {wave}/{total}
Explosion
Explosion {seconds}s
Protégez la tour · {count} zombies
Visez et maintenez pour tirer · Bouton d’explosion · Pause
Vague {wave} · Défendez la tour
La tour est en sécurité !
Vague repoussée ! Choisissez une amélioration.
Un zombie géant approche !
Le contexte graphique a été perdu. La progression sauvegardée est intacte ; revenez aux missions et réessayez.
Affichage rétabli. Revenez aux missions, puis entrez à nouveau.
En pause
Souris : visez et maintenez le bouton gauche pour tirer. Tactile : maintenez et glissez sur le terrain pour viser et tirer ; relâchez pour arrêter. Utilisez les boutons d’explosion et de pause. Bouton droit/Space : explosion ; F : tir vers le viseur ; Esc : pause.
Réduire les mouvements
Mode assistance (prochaine entrée)
Qualité
À la prochaine entrée
Fluide
Standard
Détaillée
La sauvegarde locale est disponible. Les victoires enregistrent la progression ; quitter recommence cette bataille.
La progression est temporaire pour cette session. Exportez une copie avant de quitter.
Performances
Mesures graphiques sur cet ordinateur
Copie de la sauvegarde locale
Exporter JSON
Importer JSON
Continuer
Retour aux missions
Vague repoussée
Préparez la défense
Choisissez une amélioration pour la vague suivante. Son effet dure cette bataille.
Défense réussie !
La tour est tombée
Défense terminée
{name} · Vaincus {kills} · Score {score} · Tour {hp}/{max}
La tour est en sécurité. La mission suivante est débloquée.
Toutes les missions sont terminées ! Rejouez pour améliorer votre score.
Visez d'abord les zombies près de la tour, utilisez les explosions et réparez entre les vagues.
Mission suivante
Rejouer
Impossible de lancer la bataille
Impossible de charger la bataille. Réessayez ou revenez aux missions.
Recharger
La sauvegarde dépasse 256 Ko.
Importation réussie. Revenez aux missions pour appliquer la progression.
Échec de l'importation. Choisissez une sauvegarde valide exportée par ce jeu.
Le format de sauvegarde est invalide ou sa version n'est pas prise en charge.
Préparation de la défense…
Comment jouer
Fermer
Guide du jeu
Langue
Un lion à crinière cubique tire au canon à énergie bleue depuis une tour lumineuse sur des zombies de blocs.
Chargeur à haute énergie
Dégâts par tir +25 % · Puissance d'explosion +15 %
Canon rapide
Cadence de tir +20 %
Tir en éventail
Ajoute deux tirs latéraux pour élargir l'arc de tir
Réparation d'urgence
Restaure 30 % de vie de la tour et augmente la vie maximale de 5 %`,
  de: `Ziele und halte zum Schießen gedrückt. Stoppe die Zombies und schütze den Turm!
Handy/Tablet: halten und ziehen · Computer: mit der Maus zielen.
Touch- und Maussteuerung verfügbar
Spiel starten
Verteidigungsmissionen {done} / {total}
Verteidigt {done} / {total}
Verteidigungsmission {n}
Verteidigt
Bereit zur Verteidigung
Vorherige Mission abschließen, um freizuschalten
{waves} Wellen · Besiege den letzten Boss
Zielen und zum Feuern halten · Schütze den Turm
Missionen
Zurück
Pausieren und zu Missionen zurück
Pause
Verteidige den Turm gegen Zombies. Maus: zielen und linke Taste zum Feuern halten. Touch: auf dem Schlachtfeld halten und zum Zielen ziehen; zum Stoppen loslassen. Nutze die Tasten für Druckwelle und Pause. Rechts oder Space: Druckwelle; F: Schüsse aufs Fadenkreuz; Esc: Pause.
Verbleibende Turmgesundheit
Turm
Turm {percent}%
Welle
Welle {wave}/{total}
Druckwelle
Druckwelle {seconds}s
Schütze den Turm · {count} Zombies
Zielen und zum Feuern halten · Druckwellentaste · Pause
Welle {wave} · Halte den Turm
Der Turm ist sicher!
Welle geschafft! Wähle eine Verbesserung.
Ein Riesenzombie kommt!
Die Grafikverbindung ging verloren. Gespeicherter Fortschritt bleibt erhalten. Kehre zu den Missionen zurück und versuche es erneut.
Grafik wiederhergestellt. Kehre zu den Missionen zurück und starte erneut.
Pausiert
Maus: zielen und linke Taste zum Feuern halten. Touch: auf dem Schlachtfeld halten und zum Zielen ziehen; zum Stoppen loslassen. Nutze die Tasten für Druckwelle und Pause. Rechts/Space: Druckwelle; F: aufs Fadenkreuz feuern; Esc: Pause.
Bewegung reduzieren
Hilfsmodus (beim nächsten Einstieg)
Qualität
Gilt beim nächsten Einstieg
Flüssig
Standard
Detailreich
Lokales Speichern ist verfügbar. Siege speichern den Fortschritt; Verlassen startet diesen Kampf neu.
Fortschritt wird nur für diese Sitzung gehalten. Exportiere vor dem Verlassen eine Sicherung.
Leistung
Grafikmessungen dieses Computers
Lokale Spielstandsicherung
JSON exportieren
JSON importieren
Fortsetzen
Zu den Missionen
Welle geschafft
Verteidigung vorbereiten
Wähle eine Verbesserung für die nächste Welle. Sie gilt für diesen Kampf.
Erfolgreich verteidigt!
Der Turm ist gefallen
Verteidigung beendet
{name} · Besiegt {kills} · Punkte {score} · Turm {hp}/{max}
Der Turm ist sicher. Die nächste Mission ist freigeschaltet.
Alle Missionen abgeschlossen! Spiele erneut für mehr Punkte.
Erledige zuerst Zombies nahe am Turm, nutze Druckwellen und repariere zwischen den Wellen.
Nächste Mission
Erneut spielen
Das Schlachtfeld konnte nicht starten
Das Schlachtfeld konnte nicht geladen werden. Erneut versuchen oder zu den Missionen zurückkehren.
Neu laden
Der Spielstand überschreitet 256 KB.
Import abgeschlossen. Kehre zu den Missionen zurück, um den Fortschritt anzuwenden.
Import fehlgeschlagen. Wähle einen gültigen, von diesem Spiel exportierten Spielstand.
Ungültiges Spielstandsformat oder nicht unterstützte Version.
Verteidigung wird vorbereitet…
Spielanleitung
Schließen
Spielhilfe
Sprache
Ein Löwe mit Blockmähne feuert von einem hellen Turm eine blaue Energiekanone auf herannahende Blockzombies.
Hochenergiemagazin
Schussschaden +25% · Druckwellenstärke +15%
Schnellfeuerlauf
Feuerrate +20%
Fächerfeuer
Zwei zusätzliche Seitenschüsse verbreitern den Feuerbereich
Notreparatur
Stellt 30% Turmgesundheit wieder her und erhöht das Maximum um 5%`,
  it: `Mira e tieni premuto per sparare. Ferma gli zombi e proteggi la torre!
Telefono/tablet: tieni premuto e trascina · Computer: mira con il mouse.
Comandi touch e mouse disponibili
Inizia a giocare
Missioni di difesa {done} / {total}
Difese {done} / {total}
Missione di difesa {n}
Difesa completata
Pronto a difendere
Completa la missione precedente per sbloccare
{waves} ondate · Sconfiggi il boss finale
Mira e tieni premuto per sparare · Proteggi la torre
Missioni
Indietro
Pausa e ritorno alle missioni
Pausa
Difendi la torre dagli zombi. Mouse: mira e tieni premuto il tasto sinistro per sparare. Touch: tieni premuto e trascina sul campo per mirare e sparare; solleva il dito per fermarti. Usa i pulsanti esplosione e pausa. Destro o Space: esplosione; F: fuoco sul mirino; Esc: pausa.
Salute residua della torre
Torre
Torre {percent}%
Ondata
Ondata {wave}/{total}
Esplosione
Esplosione {seconds}s
Proteggi la torre · {count} zombi
Mira e tieni premuto per sparare · Pulsante esplosione · Pausa
Ondata {wave} · Difendi la torre
La torre è al sicuro!
Ondata respinta! Scegli un potenziamento.
Sta arrivando uno zombi gigante!
Il contesto grafico è stato perso. I progressi salvati sono al sicuro; torna alle missioni e riprova.
Grafica ripristinata. Torna alle missioni ed entra di nuovo.
In pausa
Mouse: mira e tieni premuto il tasto sinistro per sparare. Touch: tieni premuto e trascina sul campo per mirare e sparare; solleva il dito per fermarti. Usa i pulsanti esplosione e pausa. Destro/Space: esplosione; F: fuoco sul mirino; Esc: pausa.
Riduci movimento
Modalità assistita (prossimo ingresso)
Qualità
Dal prossimo ingresso
Fluida
Standard
Dettagliata
Salvataggio locale disponibile. Le vittorie salvano i progressi; uscire riavvia questa battaglia.
I progressi sono temporanei in questa sessione. Esporta una copia prima di uscire.
Prestazioni
Misurazioni grafiche di questo computer
Copia del salvataggio locale
Esporta JSON
Importa JSON
Continua
Torna alle missioni
Ondata respinta
Prepara la difesa
Scegli un potenziamento per la prossima ondata. L'effetto dura questa battaglia.
Difesa riuscita!
La torre è caduta
Difesa terminata
{name} · Sconfitti {kills} · Punti {score} · Torre {hp}/{max}
La torre è al sicuro. La prossima missione è sbloccata.
Tutte le missioni completate! Rigioca per migliorare il punteggio.
Colpisci prima gli zombi vicini alla torre, usa le esplosioni e ripara tra le ondate.
Prossima missione
Rigioca
Impossibile avviare la battaglia
Impossibile caricare la battaglia. Riprova o torna alle missioni.
Ricarica
Il salvataggio supera i 256 KB.
Importazione completata. Torna alle missioni per applicare i progressi.
Importazione non riuscita. Scegli un salvataggio valido esportato da questo gioco.
Formato di salvataggio non valido o versione non supportata.
Preparazione della difesa…
Come giocare
Chiudi
Guida del gioco
Lingua
Un leone dalla criniera a blocchi spara con un cannone a energia blu da una torre luminosa contro zombi a blocchi.
Caricatore ad alta energia
Danni per colpo +25% · Potenza dell'esplosione +15%
Canna rapida
Cadenza di fuoco +20%
Fuoco a ventaglio
Aggiunge due colpi laterali per ampliare l'arco di tiro
Riparazione d'emergenza
Ripristina il 30% della salute della torre e aumenta il massimo del 5%`,
  ru: `Цельтесь и удерживайте для стрельбы. Остановите зомби и защитите башню!
Телефон/планшет: удерживайте и ведите пальцем · Компьютер: цельтесь мышью.
Доступны сенсорное управление и мышь
Начать игру
Задания обороны {done} / {total}
Защищено {done} / {total}
Задание обороны {n}
Защищено
Готово к обороне
Пройдите предыдущее задание, чтобы открыть
{waves} волн · Победите последнего босса
Цельтесь и удерживайте для стрельбы · Защитите башню
Задания
Назад
Пауза и возврат к заданиям
Пауза
Защита башни от зомби. Мышь: цельтесь и удерживайте левую кнопку для стрельбы. Сенсор: удерживайте палец на поле и двигайте для прицеливания и стрельбы; отпустите для остановки. Есть кнопки взрыва и паузы. Правая кнопка или Space — взрыв; F — огонь в прицел; Esc — пауза.
Оставшееся здоровье башни
Башня
Башня {percent}%
Волна
Волна {wave}/{total}
Взрыв
Взрыв {seconds}с
Защитите башню · Зомби: {count}
Цельтесь и удерживайте для стрельбы · Кнопка взрыва · Пауза
Волна {wave} · Удержите башню
Башня в безопасности!
Волна отбита! Выберите улучшение.
Приближается гигантский зомби!
Графическое соединение потеряно. Сохранённый прогресс не пострадал. Вернитесь к заданиям и повторите попытку.
Графика восстановлена. Вернитесь к заданиям и войдите снова.
На паузе
Мышь: цельтесь и удерживайте левую кнопку для стрельбы. Сенсор: удерживайте и двигайте палец по полю для прицеливания и стрельбы; отпустите для остановки. Используйте кнопки взрыва и паузы. Правая/Space — взрыв; F — огонь в прицел; Esc — пауза.
Уменьшить движение
Режим помощи (со следующего входа)
Качество
Со следующего входа
Плавное
Стандартное
Подробное
Локальное сохранение доступно. Победы сохраняют прогресс; выход начинает этот бой заново.
Прогресс хранится временно в этой сессии. Экспортируйте копию перед выходом.
Производительность
Замеры графики этого компьютера
Копия локального сохранения
Экспорт JSON
Импорт JSON
Продолжить
К заданиям
Волна отбита
Подготовьте оборону
Выберите одно улучшение для следующей волны. Оно действует до конца этого боя.
Оборона успешна!
Башня пала
Оборона завершена
{name} · Побеждено {kills} · Очки {score} · Башня {hp}/{max}
Башня в безопасности. Следующее задание открыто.
Все задания пройдены! Играйте снова ради лучшего счёта.
Сначала стреляйте в зомби у башни, применяйте взрывы и ремонтируйтесь между волнами.
Следующее задание
Сыграть снова
Не удалось начать бой
Не удалось загрузить поле боя. Повторите попытку или вернитесь к заданиям.
Перезагрузить
Сохранение превышает 256 КБ.
Импорт завершён. Вернитесь к заданиям, чтобы применить прогресс.
Ошибка импорта. Выберите действующее сохранение, экспортированное из этой игры.
Неверный формат сохранения или неподдерживаемая версия.
Подготовка обороны…
Как играть
Закрыть
Руководство по игре
Язык
Лев с блочной гривой стреляет из синей энергетической пушки с яркой башни по приближающимся блочным зомби.
Энергетический магазин
Урон выстрела +25% · Мощность взрыва +15%
Скорострельный ствол
Скорострельность +20%
Веерный огонь
Добавляет два боковых выстрела, расширяя сектор огня
Аварийный ремонт
Восстанавливает 30% здоровья башни и повышает максимум на 5%`,
  hi: `निशाना लगाएँ और दबाए रखकर गोली चलाएँ। ज़ॉम्बी को रोकें और मीनार बचाएँ!
फ़ोन/टैबलेट: दबाए रखें और खींचें · कंप्यूटर: माउस से निशाना।
टच और माउस नियंत्रण उपलब्ध
खेल शुरू करें
रक्षा अभियान {done} / {total}
सुरक्षित किए {done} / {total}
रक्षा अभियान {n}
रक्षा सफल
रक्षा के लिए तैयार
खोलने के लिए पिछला अभियान पूरा करें
{waves} लहरें · अंतिम सरदार को हराएँ
निशाना लगाएँ और दबाए रखकर गोली चलाएँ · मीनार बचाएँ
अभियान
वापस
रोकें और अभियान पर लौटें
विराम
ज़ॉम्बी से मीनार की रक्षा करें। माउस: निशाना लगाएँ और बायाँ बटन दबाए रखकर गोली चलाएँ। टच: मैदान पर उँगली दबाए रखें और खींचकर निशाना लगाएँ; छोड़ने पर गोलीबारी रुकती है। विस्फोट और विराम के स्क्रीन बटन इस्तेमाल करें। दायाँ बटन या Space से विस्फोट; F से निशाने पर गोली; Esc से विराम।
मीनार की बची सेहत
मीनार
मीनार {percent}%
लहर
लहर {wave}/{total}
विस्फोट
विस्फोट {seconds}से
मीनार बचाएँ · {count} ज़ॉम्बी
निशाना लगाएँ और दबाए रखकर गोली चलाएँ · विस्फोट बटन · विराम
लहर {wave} · मीनार की रक्षा करें
मीनार सुरक्षित है!
लहर खत्म! एक सुधार चुनें।
विशाल ज़ॉम्बी आ रहा है!
ग्राफ़िक्स कनेक्शन टूट गया। सहेजा अभियान सुरक्षित है; अभियान पर लौटकर फिर कोशिश करें।
ग्राफ़िक्स लौट आए हैं। अभियान पर लौटें और फिर प्रवेश करें।
खेल रुका है
माउस से निशाना लगाएँ और बायाँ बटन दबाए रखकर गोली चलाएँ। टच में मैदान पर उँगली दबाए रखकर खींचें; छोड़ने पर गोलीबारी रुकती है। विस्फोट और विराम के स्क्रीन बटन इस्तेमाल करें। दायाँ/Space विस्फोट; F निशाने पर गोली; Esc विराम।
गतिविधि कम करें
सहायता मोड (अगले प्रवेश से)
गुणवत्ता
अगले प्रवेश से लागू
सुगम
मानक
विस्तृत
स्थानीय सहेजना उपलब्ध है। जीत पर प्रगति सहेजी जाती है; बाहर जाने पर यह लड़ाई फिर शुरू होगी।
इस सत्र की प्रगति अस्थायी है। जाने से पहले बैकअप निर्यात करें।
प्रदर्शन
इस कंप्यूटर के ग्राफ़िक्स माप
स्थानीय सेव का बैकअप
JSON निर्यात
JSON आयात
जारी रखें
अभियान पर लौटें
लहर खत्म
रक्षा तैयार करें
अगली लहर के लिए एक सुधार चुनें। इसका असर केवल इस लड़ाई में रहेगा।
रक्षा सफल!
मीनार गिर गई
रक्षा समाप्त
{name} · हराए {kills} · अंक {score} · मीनार {hp}/{max}
मीनार सुरक्षित है। अगला अभियान खुल गया है।
सभी अभियान पूरे! बेहतर अंक के लिए फिर खेलें।
मीनार के पास के ज़ॉम्बी को पहले रोकें, विस्फोट इस्तेमाल करें और लहरों के बीच मरम्मत करें।
अगला अभियान
फिर खेलें
युद्धक्षेत्र शुरू नहीं हो सका
युद्धक्षेत्र लोड नहीं हुआ। फिर कोशिश करें या अभियान पर लौटें।
फिर लोड करें
सेव 256 KB से बड़ा है।
आयात पूरा। प्रगति लागू करने के लिए अभियान पर लौटें।
आयात असफल। इसी खेल से निर्यात की गई सही सेव चुनें।
सेव का प्रारूप अमान्य है या इसका संस्करण समर्थित नहीं है।
रक्षा तैयार हो रही है…
कैसे खेलें
बंद करें
खेल मार्गदर्शिका
भाषा
चमकीली मीनार से नीली ऊर्जा तोप चलाकर पास आते ब्लॉक ज़ॉम्बी को रोकता ब्लॉक अयाल वाला शेर।
ऊर्जा मैगज़ीन
गोली की क्षति +25% · विस्फोट शक्ति +15%
तेज़ नली
गोली चलाने की गति +20%
पंखाकार गोलीबारी
दो अतिरिक्त बगल की गोलियाँ जोड़कर निशाने का फैलाव बढ़ाता है
आपात मरम्मत
मीनार की 30% सेहत लौटाता है और अधिकतम सेहत 5% बढ़ाता है`,
  ar: `صوّب واضغط مطولًا لإطلاق النار. أوقف الزومبي واحمِ البرج!
هاتف/جهاز لوحي: اضغط واسحب · كمبيوتر: صوّب بالفأرة.
تتوفر أدوات تحكم باللمس والفأرة
ابدأ اللعب
مهام الدفاع {done} / {total}
تم الدفاع {done} / {total}
مهمة الدفاع {n}
تم الدفاع
جاهز للدفاع
أكمل المهمة السابقة لفتحها
{waves} موجات · اهزم الزعيم الأخير
صوّب واضغط مطولًا للإطلاق · احمِ البرج
المهام
رجوع
إيقاف مؤقت والعودة إلى المهام
إيقاف مؤقت
دافع عن البرج من الزومبي. بالفأرة: صوّب واضغط مطولًا على الزر الأيسر لإطلاق النار. باللمس: اضغط على الساحة واسحب للتصويب والإطلاق؛ ارفع إصبعك للتوقف. استخدم زري الانفجار والإيقاف المؤقت. الزر الأيمن أو Space للانفجار؛ F للإطلاق نحو المؤشر؛ Esc للإيقاف.
صحة البرج المتبقية
البرج
البرج {percent}%
الموجة
الموجة {wave}/{total}
انفجار
انفجار {seconds}ث
احمِ البرج · {count} زومبي
صوّب واضغط مطولًا للإطلاق · زر الانفجار · إيقاف مؤقت
الموجة {wave} · احمِ البرج
البرج بأمان!
انتهت الموجة! اختر ترقية.
زومبي عملاق قادم!
انقطع الاتصال بالرسومات. تقدم المهام المحفوظ آمن؛ عد إلى المهام وأعد المحاولة.
عادت الرسومات. عد إلى المهام وادخل من جديد.
اللعبة متوقفة
بالفأرة: صوّب واضغط مطولًا على الزر الأيسر للإطلاق. باللمس: اضغط على الساحة واسحب للتصويب والإطلاق؛ ارفع إصبعك للتوقف. استخدم زري الانفجار والإيقاف المؤقت. الأيمن/Space للانفجار؛ F للإطلاق نحو المؤشر؛ Esc للإيقاف.
تقليل الحركة
وضع المساعدة (عند الدخول التالي)
الجودة
يُطبّق عند الدخول التالي
سلسة
قياسية
مفصلة
الحفظ المحلي متاح. يحفظ الفوز تقدم المهام؛ المغادرة تعيد هذه المعركة من البداية.
التقدم مؤقت في هذه الجلسة. صدّر نسخة احتياطية قبل المغادرة.
الأداء
قياسات الرسومات على هذا الكمبيوتر
نسخة احتياطية للحفظ المحلي
تصدير JSON
استيراد JSON
متابعة
العودة إلى المهام
انتهت الموجة
جهّز الدفاع
اختر ترقية للموجة التالية. يستمر تأثيرها في هذه المعركة فقط.
نجح الدفاع!
سقط البرج
انتهى الدفاع
{name} · المهزومون {kills} · النقاط {score} · البرج {hp}/{max}
البرج بأمان. فُتحت المهمة التالية.
اكتملت جميع المهام! أعد اللعب لتحسين نقاطك.
ابدأ بالزومبي الأقرب إلى البرج، واستخدم الانفجارات، وأصلح البرج بين الموجات.
المهمة التالية
إعادة اللعب
تعذّر بدء المعركة
تعذّر تحميل ساحة المعركة. أعد المحاولة أو عد إلى المهام.
إعادة التحميل
يتجاوز ملف الحفظ 256 كيلوبايت.
اكتمل الاستيراد. عد إلى المهام لتطبيق التقدم.
فشل الاستيراد. اختر ملف حفظ صالحًا صدّرته هذه اللعبة.
تنسيق الحفظ غير صالح أو إصداره غير مدعوم.
جارٍ إعداد الدفاع…
طريقة اللعب
إغلاق
دليل اللعبة
اللغة
أسد ذو لبدة مكعبة يطلق مدفع طاقة أزرق من برج مضيء نحو زومبي مكعبين يقتربون.
مخزن عالي الطاقة
ضرر الطلقة +25% · قوة الانفجار +15%
سبطانة سريعة
معدل إطلاق النار +20%
وابل مروحي
يضيف طلقتين جانبيتين لتوسيع قوس إطلاق النار
إصلاح طارئ
يعيد 30% من صحة البرج ويزيد الصحة القصوى 5%`,
};

const operations = {
  en: [
    ['Dawn Watch', 'Aim first, then fire! Defend three waves in Dawn Square.'],
    ['Twin-Flank Rush', 'Fast zombies cross from both sides. Stop those nearest the tower first.'],
    ['Armoured Bridgehead', 'Break the armoured advance with blasts and stronger firepower.'],
    ['Acid Canal', 'Spitters stop to charge. Do not leave these ranged threats unchecked.'],
    ['Barrel Night Market', 'Barrel carriers explode near the tower. Destroy them early to trigger a chain reaction.'],
    ['The Last Dawn', 'Survive six mixed waves and defeat the giant zombie that summons reinforcements.'],
  ],
  'zh-Hant': [
    ['晨光守望', '先瞄準，再開火！守住三波晨光廣場。'],
    ['雙翼突襲', '左右快跑殭屍交錯，先處理最靠近主塔的敵人。'],
    ['鐵甲橋頭', '重甲擋在前方，利用震爆和強化火力拆解防線。'],
    ['酸霧水道', '噴吐者會停下蓄力，遠方威脅也不能放著不管。'],
    ['爆桶夜市', '爆桶手靠近主塔會引爆；提早擊破可以連鎖清場。'],
    ['最後的曙光', '六波混合攻勢，最後擊破會召喚援軍的巨型殭屍。'],
  ],
  'zh-Hans': [
    ['晨光守望', '先瞄准，再开火！守住三波晨光广场。'],
    ['双翼突袭', '左右快跑僵尸交错，先处理最靠近主塔的敌人。'],
    ['铁甲桥头', '重甲挡在前方，利用震爆和强化火力拆解防线。'],
    ['酸雾水道', '喷吐者会停下蓄力，远方威胁也不能放着不管。'],
    ['爆桶夜市', '爆桶手靠近主塔会引爆；提早击破可以连锁清场。'],
    ['最后的曙光', '六波混合攻势，最后击破会召唤援军的巨型僵尸。'],
  ],
  ja: [
    ['夜明けの見張り', '狙ってから撃とう！朝の広場で三つのウェーブを防ぐ。'],
    ['両翼からの急襲', '左右から走るゾンビが交差。塔に近い敵から倒そう。'],
    ['重装の橋頭堡', '衝撃波と強化した火力で重装部隊を突破しよう。'],
    ['酸霧の水路', '吐き出す敵は止まって力をためる。遠くの脅威も放置しないで。'],
    ['爆発樽の夜市', '樽持ちは塔に近づくと爆発。早めに倒して連鎖を起こそう。'],
    ['最後の夜明け', '混成部隊の六ウェーブを防ぎ、援軍を呼ぶ巨大ゾンビを倒そう。'],
  ],
  ko: [
    ['새벽의 파수꾼', '먼저 조준하고 사격하세요! 새벽 광장에서 세 차례 습격을 막으세요.'],
    ['양쪽 날개의 기습', '양쪽의 빠른 좀비가 교차합니다. 탑에 가장 가까운 적부터 막으세요.'],
    ['철갑 교두보', '충격파와 강화된 화력으로 중장갑 부대를 저지하세요.'],
    ['산성 안개 수로', '침 뱉는 적은 멈춰서 힘을 모읍니다. 먼 거리의 위협도 방치하지 마세요.'],
    ['폭발통 야시장', '폭발통을 든 적은 탑 근처에서 폭발합니다. 미리 격파해 연쇄 폭발을 일으키세요.'],
    ['마지막 새벽', '여섯 차례의 혼합 습격을 막고 지원군을 부르는 거대 좀비를 쓰러뜨리세요.'],
  ],
  es: [
    ['Guardia del alba', '¡Apunta antes de disparar! Defiende tres oleadas en la Plaza del Alba.'],
    ['Asalto por los flancos', 'Los zombis rápidos cruzan desde ambos lados. Frena primero a los más cercanos.'],
    ['Cabeza de puente blindada', 'Detén el avance blindado con explosiones y mayor potencia de fuego.'],
    ['Canal ácido', 'Los escupidores se detienen para cargar. No ignores las amenazas a distancia.'],
    ['Mercado de barriles', 'Los portabarriles explotan cerca de la torre. Destrúyelos antes para causar una reacción en cadena.'],
    ['La última aurora', 'Resiste seis oleadas mixtas y derrota al gigante que invoca refuerzos.'],
  ],
  'pt-BR': [
    ['Vigília da aurora', 'Mire antes de atirar! Defenda três ondas na Praça da Aurora.'],
    ['Ataque pelos flancos', 'Zumbis rápidos cruzam dos dois lados. Pare primeiro os mais próximos.'],
    ['Cabeceira blindada', 'Detenha o avanço blindado com explosões e mais poder de fogo.'],
    ['Canal ácido', 'Os cuspidores param para carregar. Não ignore as ameaças à distância.'],
    ['Mercado dos barris', 'Carregadores de barris explodem perto da torre. Destrua-os cedo para iniciar uma reação em cadeia.'],
    ['A última aurora', 'Resista a seis ondas mistas e derrote o gigante que invoca reforços.'],
  ],
  fr: [
    ["Veille de l'aube", "Visez avant de tirer ! Repoussez trois vagues sur la place de l'Aube."],
    ['Assaut sur deux flancs', 'Les zombies rapides arrivent des deux côtés. Arrêtez les plus proches en premier.'],
    ['Tête de pont blindée', "Brisez l'avancée blindée avec des explosions et une puissance de feu renforcée."],
    ['Canal acide', 'Les cracheurs s’arrêtent pour charger. Ne négligez pas les menaces lointaines.'],
    ['Marché des tonneaux', 'Les porteurs de tonneaux explosent près de la tour. Abattez-les tôt pour provoquer une réaction en chaîne.'],
    ['La dernière aube', 'Résistez à six vagues mixtes et battez le géant qui appelle des renforts.'],
  ],
  de: [
    ['Morgenwache', 'Erst zielen, dann feuern! Verteidige den Morgenplatz gegen drei Wellen.'],
    ['Doppelter Flankenangriff', 'Schnelle Zombies kreuzen von beiden Seiten. Stoppe zuerst die nächsten.'],
    ['Gepanzerter Brückenkopf', 'Brich den gepanzerten Vormarsch mit Druckwellen und stärkerem Feuer.'],
    ['Säurekanal', 'Spucker halten zum Aufladen an. Ignoriere entfernte Bedrohungen nicht.'],
    ['Fass-Nachtmarkt', 'Fassträger explodieren am Turm. Erledige sie früh und löse eine Kettenreaktion aus.'],
    ['Die letzte Morgenröte', 'Überstehe sechs gemischte Wellen und besiege den Riesen, der Verstärkung ruft.'],
  ],
  it: [
    ["Guardia all'alba", "Mira prima di sparare! Difendi tre ondate nella Piazza dell'Alba."],
    ['Assalto ai fianchi', 'Gli zombi rapidi arrivano dai due lati. Ferma prima quelli più vicini.'],
    ['Testa di ponte corazzata', 'Spezza l’avanzata corazzata con esplosioni e maggiore potenza di fuoco.'],
    ['Canale acido', 'Gli sputatori si fermano per caricare. Non ignorare le minacce lontane.'],
    ['Mercato dei barili', 'I portabarili esplodono vicino alla torre. Abbattili in anticipo per innescare una reazione a catena.'],
    ["L'ultima alba", 'Resisti a sei ondate miste e sconfiggi il gigante che chiama rinforzi.'],
  ],
  ru: [
    ['Рассветный дозор', 'Сначала прицел, потом огонь! Отбейте три волны на Рассветной площади.'],
    ['Удар с двух флангов', 'Быстрые зомби бегут с обеих сторон. Первыми остановите ближайших.'],
    ['Бронированный плацдарм', 'Остановите броню взрывами и усиленной огневой мощью.'],
    ['Кислотный канал', 'Плевуны останавливаются для зарядки. Не оставляйте дальние угрозы без внимания.'],
    ['Ночной рынок бочек', 'Носители бочек взрываются у башни. Уничтожайте их заранее ради цепной реакции.'],
    ['Последний рассвет', 'Отбейте шесть смешанных волн и победите гиганта, призывающего подкрепления.'],
  ],
  hi: [
    ['भोर का पहरा', 'पहले निशाना, फिर गोली! भोर चौक में तीन लहरों को रोकें।'],
    ['दो तरफ़ा हमला', 'दोनों ओर से तेज़ ज़ॉम्बी आते हैं। पहले सबसे पास वालों को रोकें।'],
    ['बख़्तरबंद पुल', 'विस्फोट और बढ़ी हुई मारक शक्ति से बख़्तरबंद दुश्मन रोकें।'],
    ['तेज़ाबी नहर', 'थूकने वाले दुश्मन शक्ति जमा करने को रुकते हैं। दूर के ख़तरों को अनदेखा न करें।'],
    ['पीपों का रात बाज़ार', 'पीपे ढोने वाले मीनार के पास फटते हैं। उन्हें जल्दी तोड़कर सिलसिलेवार धमाका करें।'],
    ['आख़िरी भोर', 'छह मिली-जुली लहरें रोकें और सहायता बुलाने वाले विशाल ज़ॉम्बी को हराएँ।'],
  ],
  ar: [
    ['حراسة الفجر', 'صوّب أولًا ثم أطلق النار! دافع عن ساحة الفجر خلال ثلاث موجات.'],
    ['هجوم الجناحين', 'يتقاطع الزومبي السريع من الجانبين. أوقف الأقرب إلى البرج أولًا.'],
    ['رأس الجسر المدرّع', 'أوقف التقدم المدرّع بالانفجارات وقوة نيران أكبر.'],
    ['القناة الحمضية', 'يتوقف البصّاقون للشحن. لا تتجاهل التهديدات البعيدة.'],
    ['سوق البراميل الليلي', 'ينفجر حاملو البراميل قرب البرج. دمّرهم مبكرًا لإحداث سلسلة انفجارات.'],
    ['الفجر الأخير', 'اصمد أمام ست موجات مختلطة واهزم العملاق الذي يستدعي التعزيزات.'],
  ],
};

const extras = {
  en: ['Leaving {name} resets this battle’s waves and upgrades. Saved completions are kept.', 'Defence missions', 'Rendering {median}ms · p95 {p95}ms · {draws} draws · {triangles}k triangles · Geometry {geometries} · Textures {textures} · Effects {effects}/{capacity} · Shots {shots} · Hits {hits} · Setup {init}ms', 'The last valid backup was restored.'],
  'zh-Hant': ['返回任務會重置「{name}」本次波數與強化，已保存的通關紀錄會保留。', '防衛任務', '繪圖 {median}ms · p95 {p95}ms · {draws} 次繪製 · {triangles}千三角形 · 幾何 {geometries} · 貼圖 {textures} · 特效 {effects}/{capacity} · 射擊 {shots} · 命中 {hits} · 建立 {init}ms', '已從最後有效備份復原進度。'],
  'zh-Hans': ['返回任务会重置“{name}”本次波数与强化，已保存的通关记录会保留。', '防卫任务', '绘图 {median}ms · p95 {p95}ms · {draws} 次绘制 · {triangles}千三角形 · 几何 {geometries} · 贴图 {textures} · 特效 {effects}/{capacity} · 射击 {shots} · 命中 {hits} · 建立 {init}ms', '已从最后有效备份恢复进度。'],
  ja: ['「{name}」から戻ると今回のウェーブと強化がリセットされます。保存済みのクリア記録は残ります。', '防衛ミッション', '描画 {median}ms · p95 {p95}ms · 描画回数 {draws} · 三角形 {triangles}千 · 形状 {geometries} · テクスチャ {textures} · 効果 {effects}/{capacity} · 発射 {shots} · 命中 {hits} · 準備 {init}ms', '最後の有効なバックアップから復元しました。'],
  ko: ['「{name}」에서 나가면 이번 전투의 습격 진행과 강화가 초기화됩니다. 저장된 완료 기록은 유지됩니다.', '방어 임무', '렌더링 {median}ms · p95 {p95}ms · 그리기 {draws}회 · 삼각형 {triangles}천 · 도형 {geometries} · 텍스처 {textures} · 효과 {effects}/{capacity} · 사격 {shots} · 명중 {hits} · 준비 {init}ms', '마지막 유효한 백업에서 복구했습니다.'],
  es: ['Salir de {name} reinicia sus oleadas y mejoras. Se conservan las misiones completadas guardadas.', 'Misiones de defensa', 'Gráficos {median}ms · p95 {p95}ms · {draws} dibujos · {triangles}mil triángulos · Geometrías {geometries} · Texturas {textures} · Efectos {effects}/{capacity} · Disparos {shots} · Aciertos {hits} · Inicio {init}ms', 'Se restauró la última copia válida.'],
  'pt-BR': ['Sair de {name} reinicia as ondas e melhorias desta batalha. As conclusões salvas são mantidas.', 'Missões de defesa', 'Gráficos {median}ms · p95 {p95}ms · {draws} desenhos · {triangles}mil triângulos · Geometrias {geometries} · Texturas {textures} · Efeitos {effects}/{capacity} · Tiros {shots} · Acertos {hits} · Início {init}ms', 'O último backup válido foi restaurado.'],
  fr: ['Quitter {name} réinitialise les vagues et améliorations de cette bataille. Les missions terminées sauvegardées sont conservées.', 'Missions de défense', 'Rendu {median}ms · p95 {p95}ms · {draws} tracés · {triangles}mille triangles · Géométries {geometries} · Textures {textures} · Effets {effects}/{capacity} · Tirs {shots} · Touches {hits} · Début {init}ms', 'La dernière copie valide a été restaurée.'],
  de: ['Wenn du {name} verlässt, werden Wellen und Verbesserungen dieses Kampfes zurückgesetzt. Gespeicherte Abschlüsse bleiben erhalten.', 'Verteidigungsmissionen', 'Grafik {median}ms · p95 {p95}ms · {draws} Zeichnungen · {triangles}Tsd. Dreiecke · Geometrien {geometries} · Texturen {textures} · Effekte {effects}/{capacity} · Schüsse {shots} · Treffer {hits} · Aufbau {init}ms', 'Die letzte gültige Sicherung wurde wiederhergestellt.'],
  it: ['Uscire da {name} azzera ondate e potenziamenti di questa battaglia. Le missioni completate salvate vengono mantenute.', 'Missioni di difesa', 'Grafica {median}ms · p95 {p95}ms · {draws} disegni · {triangles}mila triangoli · Geometrie {geometries} · Texture {textures} · Effetti {effects}/{capacity} · Colpi {shots} · A segno {hits} · Avvio {init}ms', 'È stata ripristinata l’ultima copia valida.'],
  ru: ['Выход из «{name}» сбрасывает волны и улучшения этого боя. Сохранённые прохождения останутся.', 'Задания обороны', 'Графика {median}мс · p95 {p95}мс · Отрисовки {draws} · Треугольники {triangles}тыс. · Геометрии {geometries} · Текстуры {textures} · Эффекты {effects}/{capacity} · Выстрелы {shots} · Попадания {hits} · Запуск {init}мс', 'Восстановлена последняя исправная резервная копия.'],
  hi: ['{name} छोड़ने पर इस लड़ाई की लहरें और सुधार रीसेट होंगे। सहेजे गए पूरे अभियान बने रहेंगे।', 'रक्षा अभियान', 'ग्राफ़िक्स {median}मिसे · p95 {p95}मिसे · रेखांकन {draws} · त्रिकोण {triangles}हज़ार · आकृतियाँ {geometries} · टेक्सचर {textures} · प्रभाव {effects}/{capacity} · गोलियाँ {shots} · निशाने {hits} · तैयारी {init}मिसे', 'अंतिम सही बैकअप से प्रगति लौटाई गई।'],
  ar: ['مغادرة {name} تعيد موجات هذه المعركة وترقياتها من البداية. تبقى المهام المكتملة المحفوظة.', 'مهام الدفاع', 'الرسم {median}ملث · p95 {p95}ملث · عمليات الرسم {draws} · المثلثات {triangles}ألف · الأشكال {geometries} · الخامات {textures} · المؤثرات {effects}/{capacity} · الطلقات {shots} · الإصابات {hits} · الإعداد {init}ملث', 'تمت استعادة آخر نسخة احتياطية صالحة.'],
};

const growthCatalogs={"en": {"talentsTab": "Talents", "equipmentTab": "Workshop", "trainingTitle": "Permanent research", "trainingEarn": "Earn gears from kills and cleared waves, even in defeat. Research applies next battle.", "gearsLabel": "Gears", "rank": "Rank {rank}/{max}", "upgradeAction": "Research", "cost": "{n} gears", "maxRank": "Maximum rank", "reset": "Reset research", "resetConfirm": "Refund {n} spent gears and reset research? Earned progress stays.", "stanceTitle": "Combat stance", "stanceDesc": "Choose one permanent starting effect. Switch freely between battles.", "stanceActive": "Active", "stanceChoose": "Equip", "resultGears": "Earned {n} gears", "researchpower": "Cannon power · +8% per rank", "researchrapid": "Feed mechanism · +5.5% fire rate per rank", "researchhull": "Tower hull · +8% health per rank", "researchblast": "Blast · +12% damage and −0.45s cooldown per rank", "researchcontrol": "Cryo control · +0.18s slow per rank", "researchsupport": "Drone · +10% damage per rank; rank 3 starts with a drone", "pierceName": "Piercing rounds", "pierceDescription": "Pass through one more target. Later hits deal less damage.", "frostName": "Cryo rounds", "frostDescription": "Hits slow enemies. Repeated upgrades increase the slow.", "chainName": "Chain current", "chainDescription": "Energy jumps to nearby targets with decreasing damage.", "explosiveName": "Impact shells", "explosiveDescription": "Hits explode in a small radius; direct fire still matters.", "droneName": "Guardian drone", "droneDescription": "Automatically fires at the nearest threat; supports manual aim.", "shieldName": "Tower shield", "shieldDescription": "Gain 180 shield; fully recharges between waves.", "layoutfront": "Front approach", "layoutpincer": "Two-flank assault", "layoutcross": "Crossfire gates", "layoutfan": "Fan formation", "layoutorbit": "Spiralling encirclement", "focuswalker": "Hold off the crowd", "focusrunner": "Prioritize fast runners", "focusbrute": "Blast heavy armour", "focusbomber": "Detonate clustered barrels", "focusspitter": "Interrupt distant spitters", "focusshield": "Blast to break shields", "focushealer": "Eliminate healers first", "focussplitter": "Splitters release two runners", "bossrally": "Rally captain · stop summoned runners", "bossbulwark": "Iron lord · break renewed shields", "bossmedic": "Revival chief · remove healers to stop recovery", "bossartillery": "Acid artillery · blast away projectiles", "bossbrood": "Brood titan · control splitting reinforcements", "bosscommander": "Dawn commander · shield, summons, then barrage", "auroraTitle": "Aurora cannon", "auroraDesc": "Permanent cosmetic: violet muzzle light. No combat advantage.", "diamonds": "Diamonds: {n}", "costDiamonds": "10 diamonds · permanent", "buy": "Purchase", "owned": "Owned", "purchaseFailed": "Purchase could not be confirmed. Reopen Workshop to check ownership.", "notEnough": "Not enough resources", "confirm": "Confirm", "cancel": "Cancel"}, "zh-Hant": {"talentsTab": "天賦", "equipmentTab": "工坊", "trainingTitle": "永久研究", "trainingEarn": "擊倒敵人與完成敵潮可得齒輪，失敗也保留收益。研究於下次戰鬥生效。", "gearsLabel": "齒輪", "rank": "等級 {rank}/{max}", "upgradeAction": "研究升級", "cost": "{n} 齒輪", "maxRank": "已達上限", "reset": "重設研究", "resetConfirm": "退回已投入的 {n} 齒輪並重設研究？已賺取的進度會保留。", "stanceTitle": "戰鬥天賦", "stanceDesc": "選一種開局效果，戰鬥外可免費切換，永久保存。", "stanceActive": "已啟用", "stanceChoose": "裝配", "resultGears": "取得 {n} 齒輪", "researchpower": "砲彈威力 · 每級傷害 +8%", "researchrapid": "連射機構 · 每級射速 +5.5%", "researchhull": "主塔外殼 · 每級生命 +8%", "researchblast": "震爆科技 · 每級傷害 +12%、冷卻 −0.45秒", "researchcontrol": "冰緩控制 · 每級緩速延長 0.18秒", "researchsupport": "無人機 · 每級傷害 +10%；3級開局帶無人機", "pierceName": "穿透彈", "pierceDescription": "多穿透一名敵人，後續命中傷害遞減。", "frostName": "冰緩彈", "frostDescription": "命中使敵人減速，多次強化可加強減速。", "chainName": "連鎖電流", "chainDescription": "跳向鄰近敵人，每次跳躍傷害遞減。", "explosiveName": "震盪榴彈", "explosiveDescription": "命中產生小範圍爆破，仍須瞄準敵人。", "droneName": "守護無人機", "droneDescription": "自動射擊最近的威脅，輔助手動瞄準。", "shieldName": "主塔護盾", "shieldDescription": "獲得180護盾，每波之間充滿。", "layoutfront": "正面推進", "layoutpincer": "雙翼包抄", "layoutcross": "多門交叉進攻", "layoutfan": "扇形梯隊", "layoutorbit": "環道包圍", "focuswalker": "守住密集敵群", "focusrunner": "先處理快跑者", "focusbrute": "用震爆拆解厚甲", "focusbomber": "引爆聚集的爆桶", "focusspitter": "處理遠方噴吐者", "focusshield": "用震爆打破護盾", "focushealer": "優先擊倒治療者", "focussplitter": "裂殼會放出兩隻快跑者", "bossrally": "集結隊長 · 攔截召喚的快跑者", "bossbulwark": "鐵壁領主 · 打破反覆生成的護盾", "bossmedic": "回春司令 · 清除治療者阻止回復", "bossartillery": "酸雨炮王 · 用震爆清除酸彈", "bossbrood": "裂巢巨獸 · 控制分裂援軍", "bosscommander": "破曉統帥 · 依序破盾、攔援軍、清彈幕", "auroraTitle": "極光砲管", "auroraDesc": "永久外觀：紫色砲口光，不增加戰鬥能力。", "diamonds": "鑽石：{n}", "costDiamonds": "10 鑽石 · 永久", "buy": "購買", "owned": "已擁有", "purchaseFailed": "尚未確認購買結果，請重開工坊查看擁有狀態。", "notEnough": "資源不足", "confirm": "確認", "cancel": "取消"}, "zh-Hans": {"talentsTab": "天赋", "equipmentTab": "工坊", "trainingTitle": "永久研究", "trainingEarn": "击倒敌人与完成敌潮可得齿轮，失败也保留收益。研究于下次战斗生效。", "gearsLabel": "齿轮", "rank": "等级 {rank}/{max}", "upgradeAction": "研究升级", "cost": "{n} 齿轮", "maxRank": "已达上限", "reset": "重置研究", "resetConfirm": "退回已投入的 {n} 齿轮并重置研究？已赚取的进度会保留。", "stanceTitle": "战斗天赋", "stanceDesc": "选择一种开局效果，战斗外可免费切换，永久保存。", "stanceActive": "已启用", "stanceChoose": "装配", "resultGears": "获得 {n} 齿轮", "researchpower": "炮弹威力 · 每级伤害 +8%", "researchrapid": "连射机构 · 每级射速 +5.5%", "researchhull": "主塔外壳 · 每级生命 +8%", "researchblast": "震爆科技 · 每级伤害 +12%、冷却 −0.45秒", "researchcontrol": "冰缓控制 · 每级减速延长 0.18秒", "researchsupport": "无人机 · 每级伤害 +10%；3级开局带无人机", "pierceName": "穿透弹", "pierceDescription": "多穿透一名敌人，后续命中伤害递减。", "frostName": "冰缓弹", "frostDescription": "命中使敌人减速，多次强化可加强减速。", "chainName": "连锁电流", "chainDescription": "跳向邻近敌人，每次跳跃伤害递减。", "explosiveName": "震荡榴弹", "explosiveDescription": "命中产生小范围爆破，仍须瞄准敌人。", "droneName": "守护无人机", "droneDescription": "自动射击最近的威胁，辅助手动瞄准。", "shieldName": "主塔护盾", "shieldDescription": "获得180护盾，每波之间充满。", "layoutfront": "正面推进", "layoutpincer": "双翼包抄", "layoutcross": "多门交叉进攻", "layoutfan": "扇形梯队", "layoutorbit": "环道包围", "focuswalker": "守住密集敌群", "focusrunner": "先处理快跑者", "focusbrute": "用震爆拆解厚甲", "focusbomber": "引爆聚集的爆桶", "focusspitter": "处理远方喷吐者", "focusshield": "用震爆打破护盾", "focushealer": "优先击倒治疗者", "focussplitter": "裂壳会放出两只快跑者", "bossrally": "集结队长 · 拦截召唤的快跑者", "bossbulwark": "铁壁领主 · 打破反复生成的护盾", "bossmedic": "回春司令 · 清除治疗者阻止回复", "bossartillery": "酸雨炮王 · 用震爆清除酸弹", "bossbrood": "裂巢巨兽 · 控制分裂援军", "bosscommander": "破晓统帅 · 依次破盾、拦援军、清弹幕", "auroraTitle": "极光炮管", "auroraDesc": "永久外观：紫色炮口光，不增加战斗能力。", "diamonds": "钻石：{n}", "costDiamonds": "10 钻石 · 永久", "buy": "购买", "owned": "已拥有", "purchaseFailed": "尚未确认购买结果，请重开工坊查看拥有状态。", "notEnough": "资源不足", "confirm": "确认", "cancel": "取消"}, "ja": {"talentsTab": "才能", "equipmentTab": "工房", "trainingTitle": "永続研究", "trainingEarn": "敵撃破とウェーブ突破で歯車を獲得。敗北時も保持し、研究は次の戦闘から有効。", "gearsLabel": "歯車", "rank": "ランク {rank}/{max}", "upgradeAction": "研究する", "cost": "歯車 {n}個", "maxRank": "最大ランク", "reset": "研究をリセット", "resetConfirm": "使用した歯車{n}個を返却して研究をリセットしますか？獲得進行は保持されます。", "stanceTitle": "戦闘才能", "stanceDesc": "開始時の効果を一つ選択。戦闘外で無料変更でき、保存されます。", "stanceActive": "使用中", "stanceChoose": "装備", "resultGears": "歯車を{n}個獲得", "researchpower": "砲弾威力 · 各ランク+8%", "researchrapid": "給弾装置 · 連射速度+5.5%", "researchhull": "塔の外殻 · 各ランク体力+8%", "researchblast": "衝撃波 · 威力+12%、待機−0.45秒", "researchcontrol": "冷却制御 · 減速時間+0.18秒", "researchsupport": "ドローン · 威力+10%、ランク3で最初から配備", "pierceName": "貫通弾", "pierceDescription": "さらに一体を貫通。後続の命中は威力が低下。", "frostName": "冷却弾", "frostDescription": "命中で敵を減速。重ねて強化すると減速が増加。", "chainName": "連鎖電流", "chainDescription": "近くの敵へ飛び、連鎖ごとに威力低下。", "explosiveName": "衝撃榴弾", "explosiveDescription": "命中地点で小範囲爆発。正確な照準も必要。", "droneName": "守護ドローン", "droneDescription": "最も近い脅威を自動射撃し、手動照準を支援。", "shieldName": "塔のシールド", "shieldDescription": "シールド180を獲得。各ウェーブ間に全回復。", "layoutfront": "正面進軍", "layoutpincer": "両翼包囲", "layoutcross": "交差する進入口", "layoutfan": "扇形隊列", "layoutorbit": "らせん包囲", "focuswalker": "密集した群れを防ぐ", "focusrunner": "速い敵を優先", "focusbrute": "衝撃波で重装甲を崩す", "focusbomber": "密集した樽を爆破", "focusspitter": "遠くの吐き出し敵に対処", "focusshield": "衝撃波で盾を壊す", "focushealer": "回復役を優先", "focussplitter": "分裂すると走る敵が二体出現", "bossrally": "集結隊長 · 召喚された走者を止める", "bossbulwark": "鉄壁領主 · 再生する盾を壊す", "bossmedic": "回復司令 · 回復役を倒して再生阻止", "bossartillery": "酸雨砲王 · 衝撃波で酸弾を消す", "bossbrood": "群巣巨獣 · 分裂する援軍を抑える", "bosscommander": "暁の司令 · 盾、援軍、弾幕に順番に対処", "auroraTitle": "オーロラ砲身", "auroraDesc": "永続外観：紫の砲口光。戦闘能力は変わりません。", "diamonds": "ダイヤ：{n}", "costDiamonds": "10ダイヤ · 永続", "buy": "購入", "owned": "所有済み", "purchaseFailed": "購入結果を確認できません。工房を開き直して所有状況を確認してください。", "notEnough": "資源が不足しています", "confirm": "確定", "cancel": "キャンセル"}, "ko": {"talentsTab": "특성", "equipmentTab": "공방", "trainingTitle": "영구 연구", "trainingEarn": "처치와 웨이브 돌파로 톱니를 획득하며 패배해도 보존됩니다. 연구는 다음 전투에 적용됩니다.", "gearsLabel": "톱니", "rank": "등급 {rank}/{max}", "upgradeAction": "연구", "cost": "톱니 {n}개", "maxRank": "최대 등급", "reset": "연구 초기화", "resetConfirm": "사용한 톱니 {n}개를 돌려받고 연구를 초기화할까요? 획득한 진행은 유지됩니다.", "stanceTitle": "전투 특성", "stanceDesc": "시작 효과 하나를 선택하세요. 전투 밖에서 무료 변경하며 영구 저장됩니다.", "stanceActive": "활성화", "stanceChoose": "장착", "resultGears": "톱니 {n}개 획득", "researchpower": "포탄 위력 · 등급마다 피해 +8%", "researchrapid": "급탄 장치 · 연사 속도 +5.5%", "researchhull": "탑 외벽 · 등급마다 체력 +8%", "researchblast": "충격파 · 피해 +12%, 재사용 −0.45초", "researchcontrol": "냉각 제어 · 둔화 시간 +0.18초", "researchsupport": "드론 · 피해 +10%, 3등급부터 시작 시 드론 배치", "pierceName": "관통탄", "pierceDescription": "적 하나를 더 관통하며 후속 피해는 감소합니다.", "frostName": "냉각탄", "frostDescription": "명중한 적을 둔화하며 추가 강화로 둔화가 강해집니다.", "chainName": "연쇄 전류", "chainDescription": "주변 적으로 튀며 연쇄마다 피해가 감소합니다.", "explosiveName": "충격 유탄", "explosiveDescription": "명중 지점에 작은 폭발을 일으킵니다. 조준은 필요합니다.", "droneName": "수호 드론", "droneDescription": "가장 가까운 위협을 자동 사격하여 수동 조준을 돕습니다.", "shieldName": "탑 보호막", "shieldDescription": "보호막 180을 얻고 웨이브 사이에 완충합니다.", "layoutfront": "정면 진군", "layoutpincer": "양쪽 포위", "layoutcross": "교차 진입", "layoutfan": "부채꼴 대형", "layoutorbit": "나선 포위", "focuswalker": "밀집한 무리를 막으세요", "focusrunner": "빠른 적부터 처리하세요", "focusbrute": "충격파로 중장갑을 무너뜨리세요", "focusbomber": "모인 폭발통을 터뜨리세요", "focusspitter": "멀리 있는 산성 적을 처리하세요", "focusshield": "충격파로 보호막을 깨세요", "focushealer": "치유자를 먼저 처치하세요", "focussplitter": "분열 시 빠른 적 둘이 나옵니다", "bossrally": "집결 대장 · 소환된 질주자를 막으세요", "bossbulwark": "철벽 군주 · 재생하는 보호막을 깨세요", "bossmedic": "회복 사령관 · 치유자를 제거하세요", "bossartillery": "산성 포왕 · 충격파로 투사체를 지우세요", "bossbrood": "군집 거수 · 분열하는 지원군을 통제하세요", "bosscommander": "새벽 사령관 · 보호막, 지원군, 탄막을 차례로 대응", "auroraTitle": "오로라 포신", "auroraDesc": "영구 외형: 보라색 포구 빛. 전투 능력은 바뀌지 않습니다.", "diamonds": "다이아: {n}", "costDiamonds": "다이아 10개 · 영구", "buy": "구매", "owned": "보유 중", "purchaseFailed": "구매 결과를 확인하지 못했습니다. 공방을 다시 열어 보유 상태를 확인하세요.", "notEnough": "자원이 부족합니다", "confirm": "확인", "cancel": "취소"}, "es": {"talentsTab": "Talentos", "equipmentTab": "Taller", "trainingTitle": "Investigación permanente", "trainingEarn": "Gana engranajes por bajas y oleadas, incluso al perder. La investigación se aplica en la próxima batalla.", "gearsLabel": "Engranajes", "rank": "Rango {rank}/{max}", "upgradeAction": "Investigar", "cost": "{n} engranajes", "maxRank": "Rango máximo", "reset": "Reiniciar investigación", "resetConfirm": "¿Devolver {n} engranajes invertidos y reiniciar? Conservas el progreso ganado.", "stanceTitle": "Talento de combate", "stanceDesc": "Elige un efecto inicial guardado. Cámbialo gratis fuera del combate.", "stanceActive": "Activo", "stanceChoose": "Equipar", "resultGears": "Ganaste {n} engranajes", "researchpower": "Potencia · +8% de daño por rango", "researchrapid": "Alimentación · +5.5% de cadencia por rango", "researchhull": "Casco · +8% de salud por rango", "researchblast": "Explosión · +12% de daño y −0.45s de recarga", "researchcontrol": "Criocontrol · +0.18s de ralentización", "researchsupport": "Dron · +10% de daño; empieza con uno al rango 3", "pierceName": "Balas perforantes", "pierceDescription": "Atraviesan un objetivo más; el daño posterior disminuye.", "frostName": "Balas criogénicas", "frostDescription": "Ralentizan al impactar. Mejorarlas aumenta la ralentización.", "chainName": "Corriente encadenada", "chainDescription": "Salta a enemigos cercanos con daño decreciente.", "explosiveName": "Proyectiles explosivos", "explosiveDescription": "El impacto provoca una pequeña explosión. Sigue siendo necesario apuntar.", "droneName": "Dron guardián", "droneDescription": "Dispara automáticamente a la amenaza más cercana y apoya tu puntería.", "shieldName": "Escudo de torre", "shieldDescription": "Obtén 180 de escudo; se recarga entre oleadas.", "layoutfront": "Avance frontal", "layoutpincer": "Asalto por dos flancos", "layoutcross": "Entradas cruzadas", "layoutfan": "Formación en abanico", "layoutorbit": "Cerco en espiral", "focuswalker": "Detén la multitud", "focusrunner": "Prioriza a los corredores", "focusbrute": "Rompe la armadura con explosiones", "focusbomber": "Detona los barriles agrupados", "focusspitter": "Ataca a los escupidores lejanos", "focusshield": "Rompe los escudos con explosiones", "focushealer": "Elimina primero a los sanadores", "focussplitter": "Los divisores liberan dos corredores", "bossrally": "Capitán · detén los corredores invocados", "bossbulwark": "Señor de hierro · rompe sus escudos renovados", "bossmedic": "Jefe sanador · elimina a los sanadores", "bossartillery": "Artillería ácida · elimina proyectiles con explosiones", "bossbrood": "Titán del nido · controla los refuerzos divididos", "bosscommander": "Comandante del alba · escudo, refuerzos y bombardeo", "auroraTitle": "Cañón aurora", "auroraDesc": "Aspecto permanente: destello violeta. Sin ventaja de combate.", "diamonds": "Diamantes: {n}", "costDiamonds": "10 diamantes · permanente", "buy": "Comprar", "owned": "En propiedad", "purchaseFailed": "No se pudo confirmar la compra. Abre Taller de nuevo para comprobar la propiedad.", "notEnough": "Recursos insuficientes", "confirm": "Confirmar", "cancel": "Cancelar"}, "pt-BR": {"talentsTab": "Talentos", "equipmentTab": "Oficina", "trainingTitle": "Pesquisa permanente", "trainingEarn": "Ganhe engrenagens por abates e ondas, mesmo na derrota. A pesquisa vale na próxima batalha.", "gearsLabel": "Engrenagens", "rank": "Nível {rank}/{max}", "upgradeAction": "Pesquisar", "cost": "{n} engrenagens", "maxRank": "Nível máximo", "reset": "Reiniciar pesquisa", "resetConfirm": "Devolver {n} engrenagens gastas e reiniciar? O progresso conquistado permanece.", "stanceTitle": "Talento de combate", "stanceDesc": "Escolha um efeito inicial salvo. Troque grátis fora da batalha.", "stanceActive": "Ativo", "stanceChoose": "Equipar", "resultGears": "Ganhou {n} engrenagens", "researchpower": "Potência · +8% de dano por nível", "researchrapid": "Alimentação · +5.5% de cadência por nível", "researchhull": "Casco · +8% de vida por nível", "researchblast": "Explosão · +12% de dano e −0.45s de recarga", "researchcontrol": "Criocontrole · +0.18s de lentidão", "researchsupport": "Drone · +10% de dano; começa com um no nível 3", "pierceName": "Tiros perfurantes", "pierceDescription": "Atravessam mais um alvo; o dano seguinte diminui.", "frostName": "Tiros criogênicos", "frostDescription": "Acertos deixam inimigos lentos. Melhorias aumentam a lentidão.", "chainName": "Corrente em cadeia", "chainDescription": "Salta entre inimigos próximos com dano decrescente.", "explosiveName": "Projéteis explosivos", "explosiveDescription": "O impacto causa uma pequena explosão. Ainda é preciso mirar.", "droneName": "Drone guardião", "droneDescription": "Atira na ameaça mais próxima e apoia a mira manual.", "shieldName": "Escudo da torre", "shieldDescription": "Receba 180 de escudo; recarrega entre ondas.", "layoutfront": "Avanço frontal", "layoutpincer": "Ataque por dois flancos", "layoutcross": "Entradas cruzadas", "layoutfan": "Formação em leque", "layoutorbit": "Cerco em espiral", "focuswalker": "Contenha a multidão", "focusrunner": "Priorize corredores", "focusbrute": "Quebre armaduras com explosões", "focusbomber": "Detone barris agrupados", "focusspitter": "Ataque cuspidores distantes", "focusshield": "Quebre escudos com explosões", "focushealer": "Elimine curandeiros primeiro", "focussplitter": "Divisores soltam dois corredores", "bossrally": "Capitão · detenha corredores invocados", "bossbulwark": "Senhor de ferro · quebre escudos renovados", "bossmedic": "Chefe curandeiro · elimine os curandeiros", "bossartillery": "Artilharia ácida · limpe projéteis com explosões", "bossbrood": "Titã do ninho · controle reforços divididos", "bosscommander": "Comandante da aurora · escudo, reforços e barragem", "auroraTitle": "Canhão aurora", "auroraDesc": "Visual permanente: clarão violeta. Sem vantagem de combate.", "diamonds": "Diamantes: {n}", "costDiamonds": "10 diamantes · permanente", "buy": "Comprar", "owned": "Adquirido", "purchaseFailed": "Não foi possível confirmar a compra. Reabra a Oficina para conferir a posse.", "notEnough": "Recursos insuficientes", "confirm": "Confirmar", "cancel": "Cancelar"}, "fr": {"talentsTab": "Talents", "equipmentTab": "Atelier", "trainingTitle": "Recherche permanente", "trainingEarn": "Les éliminations et vagues rapportent des rouages, même en cas de défaite. La recherche s’applique au combat suivant.", "gearsLabel": "Rouages", "rank": "Rang {rank}/{max}", "upgradeAction": "Rechercher", "cost": "{n} rouages", "maxRank": "Rang maximal", "reset": "Réinitialiser", "resetConfirm": "Récupérer les {n} rouages investis et réinitialiser ? La progression acquise reste.", "stanceTitle": "Talent de combat", "stanceDesc": "Choisissez un effet initial sauvegardé. Changez gratuitement hors combat.", "stanceActive": "Actif", "stanceChoose": "Équiper", "resultGears": "{n} rouages obtenus", "researchpower": "Puissance · dégâts +8% par rang", "researchrapid": "Alimentation · cadence +5.5% par rang", "researchhull": "Coque · santé +8% par rang", "researchblast": "Explosion · dégâts +12%, recharge −0.45s", "researchcontrol": "Cryocontrôle · ralentissement +0.18s", "researchsupport": "Drone · dégâts +10%, disponible au départ au rang 3", "pierceName": "Balles perforantes", "pierceDescription": "Traversent une cible supplémentaire, avec dégâts réduits ensuite.", "frostName": "Balles cryogéniques", "frostDescription": "Les impacts ralentissent. Les améliorations renforcent cet effet.", "chainName": "Courant en chaîne", "chainDescription": "Saute entre ennemis proches avec des dégâts décroissants.", "explosiveName": "Obus explosifs", "explosiveDescription": "L’impact produit une petite explosion. Il faut toujours viser.", "droneName": "Drone gardien", "droneDescription": "Tire sur la menace la plus proche pour soutenir votre visée.", "shieldName": "Bouclier de tour", "shieldDescription": "Ajoute 180 de bouclier, rechargé entre les vagues.", "layoutfront": "Avancée frontale", "layoutpincer": "Assaut des deux flancs", "layoutcross": "Entrées croisées", "layoutfan": "Formation en éventail", "layoutorbit": "Encerclement en spirale", "focuswalker": "Repoussez la foule", "focusrunner": "Visez les coureurs en priorité", "focusbrute": "Brisez l’armure avec une explosion", "focusbomber": "Faites exploser les barils groupés", "focusspitter": "Éliminez les cracheurs éloignés", "focusshield": "Brisez les boucliers par explosion", "focushealer": "Éliminez d’abord les soigneurs", "focussplitter": "Les diviseurs libèrent deux coureurs", "bossrally": "Capitaine · arrêtez les coureurs invoqués", "bossbulwark": "Seigneur de fer · brisez ses boucliers renouvelés", "bossmedic": "Chef soigneur · éliminez les soigneurs", "bossartillery": "Artillerie acide · détruisez les projectiles par explosion", "bossbrood": "Titan du nid · contrôlez les renforts divisés", "bosscommander": "Commandant de l’aube · bouclier, renforts puis barrage", "auroraTitle": "Canon aurore", "auroraDesc": "Apparence permanente : lueur violette. Aucun avantage au combat.", "diamonds": "Diamants : {n}", "costDiamonds": "10 diamants · permanent", "buy": "Acheter", "owned": "Possédé", "purchaseFailed": "Achat non confirmé. Rouvrez Atelier pour vérifier la possession.", "notEnough": "Ressources insuffisantes", "confirm": "Confirmer", "cancel": "Annuler"}, "de": {"talentsTab": "Talente", "equipmentTab": "Werkstatt", "trainingTitle": "Dauerhafte Forschung", "trainingEarn": "Abschüsse und Wellen bringen Zahnräder, auch bei Niederlagen. Forschung gilt ab dem nächsten Kampf.", "gearsLabel": "Zahnräder", "rank": "Rang {rank}/{max}", "upgradeAction": "Erforschen", "cost": "{n} Zahnräder", "maxRank": "Höchster Rang", "reset": "Forschung zurücksetzen", "resetConfirm": "{n} investierte Zahnräder zurückerhalten und zurücksetzen? Erspielter Fortschritt bleibt.", "stanceTitle": "Kampftalent", "stanceDesc": "Wähle einen gespeicherten Starteffekt. Außerhalb des Kampfes kostenlos wechseln.", "stanceActive": "Aktiv", "stanceChoose": "Ausrüsten", "resultGears": "{n} Zahnräder erhalten", "researchpower": "Geschosskraft · Schaden +8% je Rang", "researchrapid": "Zuführung · Feuerrate +5.5% je Rang", "researchhull": "Turmhülle · Leben +8% je Rang", "researchblast": "Explosion · Schaden +12%, Abklingzeit −0.45s", "researchcontrol": "Kryosteuerung · Verlangsamung +0.18s", "researchsupport": "Drohne · Schaden +10%; ab Rang 3 zum Start verfügbar", "pierceName": "Durchschlaggeschosse", "pierceDescription": "Durchdringen ein weiteres Ziel, Folgetreffer sind schwächer.", "frostName": "Kryogeschosse", "frostDescription": "Treffer verlangsamen. Weitere Upgrades verstärken die Wirkung.", "chainName": "Kettenstrom", "chainDescription": "Springt mit abnehmendem Schaden auf nahe Gegner.", "explosiveName": "Explosivgeschosse", "explosiveDescription": "Treffer lösen kleine Explosionen aus. Zielen bleibt erforderlich.", "droneName": "Wächterdrohne", "droneDescription": "Beschießt automatisch die nächste Bedrohung und unterstützt dein Zielen.", "shieldName": "Turmschild", "shieldDescription": "Gewährt 180 Schild, lädt zwischen Wellen auf.", "layoutfront": "Frontalangriff", "layoutpincer": "Angriff auf beide Flanken", "layoutcross": "Gekreuzte Zugänge", "layoutfan": "Fächerformation", "layoutorbit": "Spiralförmiger Ring", "focuswalker": "Halte die Menge auf", "focusrunner": "Schnelle Läufer zuerst", "focusbrute": "Rüstung mit Explosionen brechen", "focusbomber": "Gruppierte Fässer sprengen", "focusspitter": "Entfernte Spucker bekämpfen", "focusshield": "Schilde mit Explosionen brechen", "focushealer": "Heiler zuerst ausschalten", "focussplitter": "Teiler setzen zwei Läufer frei", "bossrally": "Hauptmann · beschworene Läufer stoppen", "bossbulwark": "Eisenfürst · erneuerte Schilde brechen", "bossmedic": "Heilkommandant · Heiler ausschalten", "bossartillery": "Säureartillerie · Geschosse mit Explosionen entfernen", "bossbrood": "Bruttitan · geteilte Verstärkung kontrollieren", "bosscommander": "Morgenkommandant · Schild, Verstärkung, Sperrfeuer", "auroraTitle": "Aurorakanone", "auroraDesc": "Dauerhafte Optik: violettes Mündungslicht. Kein Kampfvorteil.", "diamonds": "Diamanten: {n}", "costDiamonds": "10 Diamanten · dauerhaft", "buy": "Kaufen", "owned": "Im Besitz", "purchaseFailed": "Kauf nicht bestätigt. Öffne die Werkstatt erneut und prüfe den Besitz.", "notEnough": "Nicht genügend Ressourcen", "confirm": "Bestätigen", "cancel": "Abbrechen"}, "it": {"talentsTab": "Talenti", "equipmentTab": "Officina", "trainingTitle": "Ricerca permanente", "trainingEarn": "Ottieni ingranaggi da nemici e ondate, anche perdendo. La ricerca vale dal prossimo scontro.", "gearsLabel": "Ingranaggi", "rank": "Grado {rank}/{max}", "upgradeAction": "Ricerca", "cost": "{n} ingranaggi", "maxRank": "Grado massimo", "reset": "Azzera ricerca", "resetConfirm": "Restituire {n} ingranaggi investiti e azzerare? I progressi ottenuti restano.", "stanceTitle": "Talento di combattimento", "stanceDesc": "Scegli un effetto iniziale salvato. Cambialo gratis fuori dal combattimento.", "stanceActive": "Attivo", "stanceChoose": "Equipaggia", "resultGears": "Ottenuti {n} ingranaggi", "researchpower": "Potenza · danni +8% per grado", "researchrapid": "Alimentazione · cadenza +5.5% per grado", "researchhull": "Scafo · salute +8% per grado", "researchblast": "Esplosione · danni +12%, ricarica −0.45s", "researchcontrol": "Criocontrollo · rallentamento +0.18s", "researchsupport": "Drone · danni +10%; disponibile dall’inizio al grado 3", "pierceName": "Proiettili perforanti", "pierceDescription": "Attraversano un bersaglio in più con danni successivi ridotti.", "frostName": "Proiettili criogenici", "frostDescription": "I colpi rallentano i nemici. I potenziamenti aumentano l’effetto.", "chainName": "Corrente a catena", "chainDescription": "Salta sui nemici vicini con danni decrescenti.", "explosiveName": "Proiettili esplosivi", "explosiveDescription": "L’impatto causa una piccola esplosione. Serve ancora mirare.", "droneName": "Drone guardiano", "droneDescription": "Spara alla minaccia più vicina e supporta la mira manuale.", "shieldName": "Scudo della torre", "shieldDescription": "Ottieni 180 di scudo; si ricarica tra le ondate.", "layoutfront": "Avanzata frontale", "layoutpincer": "Assalto sui due fianchi", "layoutcross": "Ingressi incrociati", "layoutfan": "Formazione a ventaglio", "layoutorbit": "Accerchiamento a spirale", "focuswalker": "Ferma la folla", "focusrunner": "Dai priorità ai corridori", "focusbrute": "Rompi l’armatura con esplosioni", "focusbomber": "Fai esplodere i barili raggruppati", "focusspitter": "Colpisci gli sputatori lontani", "focusshield": "Rompi gli scudi con esplosioni", "focushealer": "Elimina prima i guaritori", "focussplitter": "I divisori rilasciano due corridori", "bossrally": "Capitano · ferma i corridori evocati", "bossbulwark": "Signore di ferro · rompi gli scudi rinnovati", "bossmedic": "Capo guaritore · elimina i guaritori", "bossartillery": "Artiglieria acida · cancella proiettili con esplosioni", "bossbrood": "Titano del nido · controlla i rinforzi divisi", "bosscommander": "Comandante dell’alba · scudo, rinforzi, poi raffica", "auroraTitle": "Cannone aurora", "auroraDesc": "Aspetto permanente: luce viola alla bocca. Nessun vantaggio in battaglia.", "diamonds": "Diamanti: {n}", "costDiamonds": "10 diamanti · permanente", "buy": "Acquista", "owned": "Posseduto", "purchaseFailed": "Acquisto non confermato. Riapri Officina per verificare il possesso.", "notEnough": "Risorse insufficienti", "confirm": "Conferma", "cancel": "Annulla"}, "ru": {"talentsTab": "Таланты", "equipmentTab": "Мастерская", "trainingTitle": "Постоянные исследования", "trainingEarn": "Шестерёнки даются за врагов и волны даже при поражении. Исследования действуют со следующего боя.", "gearsLabel": "Шестерёнки", "rank": "Ранг {rank}/{max}", "upgradeAction": "Исследовать", "cost": "Шестерёнки: {n}", "maxRank": "Максимальный ранг", "reset": "Сбросить исследования", "resetConfirm": "Вернуть {n} потраченных шестерёнок и сбросить исследования? Полученный прогресс сохранится.", "stanceTitle": "Боевой талант", "stanceDesc": "Выберите сохраняемый начальный эффект. Вне боя его можно менять бесплатно.", "stanceActive": "Активно", "stanceChoose": "Выбрать", "resultGears": "Получено шестерёнок: {n}", "researchpower": "Мощность · урон +8% за ранг", "researchrapid": "Подача · скорострельность +5.5% за ранг", "researchhull": "Корпус · здоровье +8% за ранг", "researchblast": "Взрыв · урон +12%, перезарядка −0.45с", "researchcontrol": "Криоконтроль · замедление дольше на 0.18с", "researchsupport": "Дрон · урон +10%; с ранга 3 доступен в начале", "pierceName": "Пробивающие пули", "pierceDescription": "Пробивают ещё одну цель, последующий урон снижается.", "frostName": "Криопули", "frostDescription": "Попадания замедляют врагов. Улучшения усиливают замедление.", "chainName": "Цепной ток", "chainDescription": "Переходит на соседних врагов с убывающим уроном.", "explosiveName": "Разрывные снаряды", "explosiveDescription": "Попадание вызывает небольшой взрыв. Прицеливание всё ещё нужно.", "droneName": "Дрон-страж", "droneDescription": "Автоматически стреляет по ближайшей угрозе, помогая ручному огню.", "shieldName": "Щит башни", "shieldDescription": "Даёт 180 щита с полной зарядкой между волнами.", "layoutfront": "Фронтальный подход", "layoutpincer": "Атака с двух флангов", "layoutcross": "Перекрёстные ворота", "layoutfan": "Веерное построение", "layoutorbit": "Спиральное окружение", "focuswalker": "Остановите толпу", "focusrunner": "Быстрые бегуны в приоритете", "focusbrute": "Разрушайте броню взрывом", "focusbomber": "Взрывайте сгруппированные бочки", "focusspitter": "Устраняйте дальних плевунов", "focusshield": "Разрушайте щиты взрывом", "focushealer": "Сначала устраняйте лекарей", "focussplitter": "Делители выпускают двух бегунов", "bossrally": "Капитан · остановите призванных бегунов", "bossbulwark": "Железный лорд · разрушайте новые щиты", "bossmedic": "Лекарь-командир · устраните лекарей", "bossartillery": "Кислотная артиллерия · взрывайте снаряды", "bossbrood": "Титан гнезда · контролируйте разделяющееся подкрепление", "bosscommander": "Командир рассвета · щит, подкрепление, затем залп", "auroraTitle": "Пушка «Аврора»", "auroraDesc": "Постоянный облик: фиолетовое свечение дула. Не даёт боевых преимуществ.", "diamonds": "Алмазы: {n}", "costDiamonds": "10 алмазов · навсегда", "buy": "Купить", "owned": "Куплено", "purchaseFailed": "Покупка не подтверждена. Откройте Мастерскую снова и проверьте владение.", "notEnough": "Недостаточно ресурсов", "confirm": "Подтвердить", "cancel": "Отмена"}, "hi": {"talentsTab": "प्रतिभाएँ", "equipmentTab": "कार्यशाला", "trainingTitle": "स्थायी अनुसंधान", "trainingEarn": "दुश्मनों और लहरों से गियर पाएँ, हारने पर भी बचेंगे। अनुसंधान अगले युद्ध से लागू होगा।", "gearsLabel": "गियर", "rank": "स्तर {rank}/{max}", "upgradeAction": "अनुसंधान", "cost": "{n} गियर", "maxRank": "अधिकतम स्तर", "reset": "अनुसंधान रीसेट", "resetConfirm": "खर्च किए {n} गियर वापस लेकर अनुसंधान रीसेट करें? अर्जित प्रगति बनी रहेगी।", "stanceTitle": "युद्ध प्रतिभा", "stanceDesc": "एक स्थायी शुरुआती प्रभाव चुनें। युद्ध के बाहर मुफ़्त बदलें।", "stanceActive": "सक्रिय", "stanceChoose": "लगाएँ", "resultGears": "{n} गियर मिले", "researchpower": "गोला शक्ति · हर स्तर पर क्षति +8%", "researchrapid": "फीड तंत्र · हर स्तर पर गति +5.5%", "researchhull": "मीनार कवच · हर स्तर पर जीवन +8%", "researchblast": "विस्फोट · क्षति +12%, कूलडाउन −0.45सेकंड", "researchcontrol": "शीत नियंत्रण · मंदी समय +0.18सेकंड", "researchsupport": "ड्रोन · क्षति +10%; स्तर 3 पर शुरुआत से ड्रोन", "pierceName": "भेदी गोलियाँ", "pierceDescription": "एक और लक्ष्य भेदती हैं; आगे की क्षति घटती है।", "frostName": "शीत गोलियाँ", "frostDescription": "लगे हुए दुश्मन धीमे होते हैं। सुधार से मंदी बढ़ती है।", "chainName": "श्रृंखला धारा", "chainDescription": "पास के दुश्मनों पर छलाँग लगाती है, क्षति घटती जाती है।", "explosiveName": "विस्फोटक गोले", "explosiveDescription": "लगने पर छोटा विस्फोट होता है। निशाना लगाना फिर भी ज़रूरी है।", "droneName": "रक्षक ड्रोन", "droneDescription": "निकटतम खतरे पर खुद गोली चलाता है और आपकी मदद करता है।", "shieldName": "मीनार ढाल", "shieldDescription": "180 ढाल मिलेगी; लहरों के बीच पूरी भरती है।", "layoutfront": "सामने से हमला", "layoutpincer": "दोनों ओर से हमला", "layoutcross": "कई द्वारों से हमला", "layoutfan": "पंखे जैसी पंक्ति", "layoutorbit": "घुमावदार घेराबंदी", "focuswalker": "भीड़ को रोकें", "focusrunner": "तेज़ धावकों को पहले रोकें", "focusbrute": "विस्फोट से भारी कवच तोड़ें", "focusbomber": "इकट्ठे बैरल विस्फोटित करें", "focusspitter": "दूर के थूकने वालों को रोकें", "focusshield": "विस्फोट से ढाल तोड़ें", "focushealer": "उपचारकों को पहले हराएँ", "focussplitter": "विभाजक से दो धावक निकलते हैं", "bossrally": "कप्तान · बुलाए धावकों को रोकें", "bossbulwark": "लौह स्वामी · नई ढालें तोड़ें", "bossmedic": "उपचार सेनापति · उपचारक हटाएँ", "bossartillery": "अम्ल तोप · विस्फोट से प्रक्षेप्य हटाएँ", "bossbrood": "घोंसला दैत्य · विभाजित सेना रोकें", "bosscommander": "भोर सेनापति · ढाल, सेना, फिर गोलाबारी", "auroraTitle": "अरोरा तोप", "auroraDesc": "स्थायी रूप: बैंगनी नाल चमक। युद्ध लाभ नहीं।", "diamonds": "हीरे: {n}", "costDiamonds": "10 हीरे · स्थायी", "buy": "खरीदें", "owned": "स्वामित्व में", "purchaseFailed": "खरीद की पुष्टि नहीं हुई। स्वामित्व जाँचने के लिए कार्यशाला फिर खोलें।", "notEnough": "संसाधन कम हैं", "confirm": "पुष्टि", "cancel": "रद्द"}, "ar": {"talentsTab": "المواهب", "equipmentTab": "الورشة", "trainingTitle": "بحث دائم", "trainingEarn": "اكسب التروس من الأعداء والموجات حتى عند الهزيمة. يطبق البحث في المعركة التالية.", "gearsLabel": "التروس", "rank": "الرتبة {rank}/{max}", "upgradeAction": "بحث", "cost": "{n} تروس", "maxRank": "الرتبة القصوى", "reset": "إعادة ضبط البحث", "resetConfirm": "استعادة {n} من التروس المصروفة وإعادة الضبط؟ يبقى التقدم المكتسب.", "stanceTitle": "موهبة قتالية", "stanceDesc": "اختر تأثير بداية محفوظًا. بدله مجانًا خارج المعركة.", "stanceActive": "نشط", "stanceChoose": "تجهيز", "resultGears": "حصلت على {n} تروس", "researchpower": "قوة القذيفة · ضرر +8% لكل رتبة", "researchrapid": "التغذية · سرعة إطلاق +5.5% لكل رتبة", "researchhull": "هيكل البرج · صحة +8% لكل رتبة", "researchblast": "الانفجار · ضرر +12% وانتظار أقل 0.45ث", "researchcontrol": "تحكم جليدي · إبطاء أطول 0.18ث", "researchsupport": "المسيّرة · ضرر +10%، متاحة منذ البداية في الرتبة 3", "pierceName": "طلقات خارقة", "pierceDescription": "تخترق هدفًا إضافيًا مع انخفاض الضرر اللاحق.", "frostName": "طلقات جليدية", "frostDescription": "تبطئ الأعداء عند الإصابة. الترقيات تزيد الإبطاء.", "chainName": "تيار متسلسل", "chainDescription": "يقفز بين الأعداء القريبين بضرر متناقص.", "explosiveName": "قذائف متفجرة", "explosiveDescription": "تحدث الإصابة انفجارًا صغيرًا، ويبقى التصويب ضروريًا.", "droneName": "مسيّرة حارسة", "droneDescription": "تطلق تلقائيًا على أقرب تهديد وتساعد التصويب اليدوي.", "shieldName": "درع البرج", "shieldDescription": "يمنح 180 درعًا يتجدد بين الموجات.", "layoutfront": "تقدم أمامي", "layoutpincer": "هجوم من الجناحين", "layoutcross": "بوابات متقاطعة", "layoutfan": "تشكيل مروحي", "layoutorbit": "حصار حلزوني", "focuswalker": "أوقف الحشد", "focusrunner": "استهدف العدائين أولًا", "focusbrute": "حطم التدريع بالانفجار", "focusbomber": "فجر البراميل المتجمعة", "focusspitter": "هاجم الباصقين البعيدين", "focusshield": "حطم الدروع بالانفجار", "focushealer": "اهزم المعالجين أولًا", "focussplitter": "المنشطر يطلق عداءين", "bossrally": "القائد · أوقف العدائين المستدعين", "bossbulwark": "سيد الحديد · حطم الدروع المتجددة", "bossmedic": "قائد العلاج · أزل المعالجين", "bossartillery": "مدفع الحمض · أزل المقذوفات بالانفجار", "bossbrood": "عملاق العش · اضبط التعزيزات المنشطرة", "bosscommander": "قائد الفجر · درع ثم تعزيزات ثم وابل", "auroraTitle": "مدفع الشفق", "auroraDesc": "مظهر دائم: وهج فوهة بنفسجي دون أفضلية قتالية.", "diamonds": "الماس: {n}", "costDiamonds": "10 ماسات · دائم", "buy": "شراء", "owned": "مملوك", "purchaseFailed": "لم يتأكد الشراء. افتح الورشة مجددًا للتحقق من الملكية.", "notEnough": "الموارد غير كافية", "confirm": "تأكيد", "cancel": "إلغاء"}};
const campaignNames={"en": ["Dawn Watch", "Twin Flanks", "Iron Bridgehead", "Acid Canal", "Barrel Night Market", "Last Sunrise", "Corner Defence", "Split Shell Squad", "Shield Flanks", "Iron Lord", "Greenlight Infirmary", "Twin Rescue Lines", "Ignore the Giant", "Brood Escort", "Revival Chief", "Crossed Acid Lines", "Barrel Acid Chain", "Ring Patrol", "Before the Barrage", "Acid Artillery", "Ring Blockade", "Break then Blast", "Split Shell Spiral", "Emergency Repairs", "Brood Titan", "Four Gates Open", "Medic Shield Wall", "Detonation Hour", "Before Daybreak", "Dawn Siege"], "zh-Hant": ["晨光守望", "雙翼突襲", "鐵甲橋頭", "酸霧水道", "爆桶夜市", "最後的曙光", "折角防線", "裂殼小隊", "盾牆側翼", "鐵壁領主", "綠光救護站", "兩側救援線", "不能先打大隻", "裂殼護送隊", "回春司令", "遠程交叉火網", "酸桶連鎖", "環道游擊", "彈幕前的寧靜", "酸雨炮王", "環形封鎖", "先破盾再引爆", "裂殼迴旋", "緊急維修線", "裂巢巨獸", "四門齊開", "救護盾陣", "引爆時刻", "破曉前線", "黎明守城戰"], "zh-Hans": ["晨光守望", "双翼突袭", "铁甲桥头", "酸雾水道", "爆桶夜市", "最后的曙光", "折角防线", "裂壳小队", "盾墙侧翼", "铁壁领主", "绿光救护站", "两侧救援线", "不能先打大只", "裂壳护送队", "回春司令", "远程交叉火网", "酸桶连锁", "环道游击", "弹幕前的宁静", "酸雨炮王", "环形封锁", "先破盾再引爆", "裂壳回旋", "紧急维修线", "裂巢巨兽", "四门齐开", "救护盾阵", "引爆时刻", "破晓前线", "黎明守城战"], "ja": ["夜明けの見張り", "両翼からの急襲", "重装の橋頭堡", "酸霧の水路", "爆発樽の夜市", "最後の夜明け", "折れ角の防線", "分裂殻の小隊", "盾壁の側面", "鉄壁領主", "緑光の救護所", "両側の救援路", "巨人は後回し", "分裂殻の護送隊", "回復司令", "遠距離交差射撃", "酸樽の連鎖", "環道遊撃", "弾幕前の静けさ", "酸雨砲王", "環状封鎖", "盾を割って爆破", "分裂殻の旋回", "緊急修理路", "群巣巨獣", "四門開放", "救護の盾陣", "起爆の時", "暁の前線", "夜明けの籠城戦"], "ko": ["새벽의 파수꾼", "양쪽 날개의 기습", "철갑 교두보", "산성 안개 수로", "폭발통 야시장", "마지막 새벽", "꺾인 방어선", "분열 껍질 분대", "방패벽 측면", "철벽 군주", "초록빛 치료소", "양쪽 구조선", "거인은 나중에", "분열 호위대", "회복 사령관", "장거리 교차 사격", "산성 폭발통 연쇄", "순환로 유격", "탄막 전의 고요", "산성 포왕", "원형 봉쇄", "방패를 깨고 폭발", "분열 회전", "긴급 수리선", "군집 거수", "네 문 개방", "치료 방패 진형", "폭발의 시간", "새벽 전선", "여명의 수성전"], "es": ["Guardia del alba", "Asalto por los flancos", "Puente blindado", "Canal ácido", "Mercado de barriles", "La última aurora", "Defensa en esquina", "Escuadra divisora", "Flancos del escudo", "Señor de hierro", "Enfermería verde", "Rescate bilateral", "El gigante puede esperar", "Escolta divisora", "Jefe sanador", "Fuego ácido cruzado", "Cadena de barriles", "Patrulla circular", "Antes del bombardeo", "Artillería ácida", "Bloqueo circular", "Romper y detonar", "Espiral divisora", "Reparación urgente", "Titán del nido", "Cuatro puertas", "Muro médico", "Hora de detonar", "Antes del amanecer", "Asedio del alba"], "pt-BR": ["Vigília da aurora", "Ataque pelos flancos", "Ponte blindada", "Canal ácido", "Mercado de barris", "A última aurora", "Defesa na esquina", "Esquadrão divisor", "Flancos do escudo", "Senhor de ferro", "Enfermaria verde", "Resgate bilateral", "O gigante pode esperar", "Escolta divisora", "Chefe curandeiro", "Fogo ácido cruzado", "Corrente de barris", "Patrulha circular", "Antes da barragem", "Artilharia ácida", "Bloqueio circular", "Quebrar e detonar", "Espiral divisora", "Reparo urgente", "Titã do ninho", "Quatro portões", "Muralha médica", "Hora de detonar", "Antes do amanhecer", "Cerco da aurora"], "fr": ["Garde de l’aube", "Assaut des flancs", "Pont blindé", "Canal acide", "Marché des barils", "La dernière aurore", "Défense en angle", "Escouade divisée", "Flancs du bouclier", "Seigneur de fer", "Infirmerie verte", "Secours bilatéral", "Le géant attendra", "Escorte divisée", "Chef soigneur", "Tirs acides croisés", "Chaîne de barils", "Patrouille circulaire", "Avant le barrage", "Artillerie acide", "Blocus circulaire", "Briser puis exploser", "Spirale divisée", "Réparation urgente", "Titan du nid", "Quatre portes", "Rempart soigneur", "Heure d’explosion", "Avant le jour", "Siège de l’aube"], "de": ["Morgenwache", "Zwei Flanken", "Eiserner Brückenkopf", "Säurekanal", "Fassnachtmarkt", "Letzter Sonnenaufgang", "Eckverteidigung", "Splittertrupp", "Schildflanken", "Eisenfürst", "Grünes Lazarett", "Zwei Rettungswege", "Der Riese wartet", "Splittereskorte", "Heilkommandant", "Säurekreuzfeuer", "Fasskette", "Ringpatrouille", "Vor dem Sperrfeuer", "Säureartillerie", "Ringblockade", "Brechen und sprengen", "Splitterspirale", "Notreparaturen", "Bruttitan", "Vier offene Tore", "Heilerschildwall", "Stunde der Zündung", "Vor Tagesanbruch", "Morgenbelagerung"], "it": ["Guardia dell’alba", "Assalto ai fianchi", "Ponte corazzato", "Canale acido", "Mercato dei barili", "L’ultima aurora", "Difesa d’angolo", "Squadra divisoria", "Fianchi dello scudo", "Signore di ferro", "Infermeria verde", "Soccorso bilaterale", "Il gigante può aspettare", "Scorta divisoria", "Capo guaritore", "Fuoco acido incrociato", "Catena di barili", "Pattuglia circolare", "Prima della raffica", "Artiglieria acida", "Blocco circolare", "Rompere ed esplodere", "Spirale divisoria", "Riparazione urgente", "Titano del nido", "Quattro porte", "Muro dei guaritori", "Ora di esplodere", "Prima del giorno", "Assedio dell’alba"], "ru": ["Рассветный дозор", "Два фланга", "Железный плацдарм", "Кислотный канал", "Рынок бочек", "Последний рассвет", "Угловая оборона", "Отряд делителей", "Щитовые фланги", "Железный лорд", "Зелёный лазарет", "Два пути спасения", "Великан подождёт", "Эскорт делителей", "Лекарь-командир", "Кислотный перекрёстный огонь", "Цепь бочек", "Кольцевой патруль", "Перед залпом", "Кислотная артиллерия", "Кольцевая блокада", "Разбей и взорви", "Спираль делителей", "Срочный ремонт", "Титан гнезда", "Четыре ворот", "Стена лекарей", "Час взрыва", "Перед рассветом", "Рассветная осада"], "hi": ["भोर का पहरा", "दोनों ओर हमला", "लोहे का पुल", "अम्ल नहर", "बैरल बाज़ार", "अंतिम सूर्योदय", "कोने की रक्षा", "विभाजक दल", "ढाल के किनारे", "लौह स्वामी", "हरी उपचारशाला", "दो राहत मार्ग", "दैत्य बाद में", "विभाजक सुरक्षा", "उपचार सेनापति", "अम्ल की क्रॉसफायर", "बैरल श्रृंखला", "गोल मार्ग गश्त", "गोलाबारी से पहले", "अम्ल तोप", "गोल घेराबंदी", "तोड़ो फिर फोड़ो", "विभाजक चक्कर", "आपात मरम्मत", "घोंसला दैत्य", "चार खुले द्वार", "उपचार ढाल पंक्ति", "विस्फोट का समय", "भोर से पहले", "भोर की घेराबंदी"], "ar": ["حراسة الفجر", "هجوم الجناحين", "رأس جسر مدرع", "قناة الحمض", "سوق البراميل", "الشروق الأخير", "دفاع الزاوية", "فرقة المنشطرين", "جناحا الدرع", "سيد الحديد", "المشفى الأخضر", "طريقا الإنقاذ", "العملاق ينتظر", "حراسة المنشطرين", "قائد العلاج", "نيران حمض متقاطعة", "سلسلة البراميل", "دورية دائرية", "قبل الوابل", "مدفع الحمض", "حصار دائري", "حطم ثم فجر", "دوامة المنشطرين", "إصلاح عاجل", "عملاق العش", "أربع بوابات", "جدار المعالجين", "ساعة التفجير", "قبل الصباح", "حصار الفجر"]};
export const uiLocales = Object.freeze(['en', 'zh-Hant', 'zh-Hans', 'ja', 'ko', 'es', 'pt-BR', 'fr', 'de', 'it', 'ru', 'hi', 'ar']);
const placeholders = text => [...text.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map(match => match[1]).sort().join(',');
const extraKeys = ['pauseConsequence', 'stageAria', 'diagnosticStats', 'recoveredBackup'];
export const uiCatalogs = Object.freeze(Object.fromEntries(uiLocales.map(locale => {
  const lines = source[locale]?.split('\n');
  if (!lines || lines.length !== keys.length || lines.some(line => !line.trim())) throw new Error(`Invalid runtime catalog: ${locale}`);
  if (!publicationTitles[locale] || operations[locale]?.length !== 6 || extras[locale]?.length !== extraKeys.length) throw new Error(`Incomplete runtime catalog: ${locale}`);
  const values = Object.fromEntries(keys.map((key, index) => [key, lines[index]]));
  extraKeys.forEach((key, index) => { values[key] = extras[locale][index]; });
  Object.assign(values,growthCatalogs[locale]);
  values.towerValue = '{percent}%';
  return [locale, Object.freeze(values)];
})));
for (const locale of uiLocales) {
  for (const [key, text] of Object.entries(uiCatalogs.en)) {
    if (placeholders(text) !== placeholders(uiCatalogs[locale][key])) throw new Error(`Runtime parameter mismatch: ${locale}/${key}`);
  }
  operations[locale].forEach((item, index) => {
    if (item.length !== 2 || item.some(text => typeof text !== 'string' || !text.trim())) throw new Error(`Invalid operation copy: ${locale}/${index}`);
    Object.freeze(item);
  });
  Object.freeze(operations[locale]);
}
Object.freeze(operations);

const instances = new Map();
export function getUICopy(locale) {
  if (!uiLocales.includes(locale)) throw new RangeError(`Unsupported runtime locale: ${locale}`);
  if (instances.has(locale)) return instances.get(locale);
  const catalog = uiCatalogs[locale];
  const copy = Object.freeze({
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    title: publicationTitles[locale],
    t(key, params = {}) {
      if (!Object.hasOwn(catalog, key)) throw new RangeError(`Unknown runtime copy key: ${key}`);
      return catalog[key].replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (_, name) => {
        if (!Object.hasOwn(params, name) || params[name] == null) throw new TypeError(`Missing runtime copy parameter: ${key}/${name}`);
        return String(params[name]);
      });
    },
    operation(index) {
      const op=OPERATIONS[index];if(!op)throw new RangeError('Invalid operation copy index');
      const types=new Set(op.waves.flatMap(w=>w.spawns.map(e=>e.type)));
      const focus=['healer','shield','splitter','spitter','bomber','brute','runner','walker'].find(id=>types.has(id));
      return Object.freeze({name:campaignNames[locale][index],subtitle:catalog['layout'+op.layout]+' · '+catalog[op.boss?'boss'+op.boss:'focus'+focus]});
    },
  });
  instances.set(locale, copy);
  return copy;
}
