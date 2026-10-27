// Game-owned runtime copy. No fallback locale and no gameplay/state mutation.
// Official names remain sourced from the same publication title catalog.
import {publicationTitles} from './publication-copy.mjs';

const keys = `summary device desktopOnly start progress stageProgress mission cleared ready locked stageWaves stageControls stages back pauseBack pause arenaAria towerAria healthLabel towerPercent waveLabel waveProgress blastReady blastCooldown objective controls waveStart waveClearVictory waveClear bossWarning contextLost contextRestored pauseTitle pauseControls reduceMotion assist quality nextEntry qualityLow qualityMedium qualityHigh persistent memoryOnly performance diagnostics backup exportSave importSave resume returnStage upgradeOverline upgradeTitle upgradeIntro success loss settled resultStats resultWinNext resultWinAll resultLoss nextStage replay errorTitle errorMessage reload importTooLarge importSuccess importFailure saveInvalid sceneLoading help close guideAria localeAria posterAlt powerName powerDescription rapidName rapidDescription spreadName spreadDescription repairName repairDescription`.split(' ');

// Each line corresponds to exactly one key above. Tables are validated before use.
const source = {
  en: `Aim with the mouse and hold to fire. Stop the zombies and protect the tower!
Play with a computer mouse · Fixed camera, easy aiming.
Please open on a computer
Start Game
Defence missions {done} / {total}
Defended {done} / {total}
Defence mission {n}
Defended
Ready to defend
Complete the previous mission to unlock
{waves} waves · Defeat the final boss
Hold to fire · Protect the tower
Missions
Back
Pause and return to missions
Pause
Zombie tower defence. Mouse to aim; hold left button to fire; right button or Space to blast; F to fire at the reticle; Esc to pause.
Tower health remaining
Tower
Tower {percent}%
Wave
Wave {wave}/{total}
Blast · Space
Blast {seconds}s
Protect the tower · {count} zombies
Hold left button to fire · Right button/Space to blast · Esc to pause
Wave {wave} · Hold the tower
The tower is safe!
Wave cleared! Choose an upgrade.
Giant zombie incoming!
Graphics context lost. Saved mission progress is safe; return to missions and retry.
Graphics restored. Return to missions and enter again.
Paused
Mouse to aim · Hold left button to fire · Right button/Space to blast · F to fire at the reticle
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
  'zh-Hant': `滑鼠瞄準、按住連射！擊退殭屍，別讓主塔倒下。
電腦滑鼠遊玩 · 固定鏡頭，輕鬆瞄準。
請使用電腦開啟
開始遊戲
守塔任務 {done} / {total}
已守住 {done} / {total}
防衛任務 {n}
已守住
準備迎戰
完成前一任務開放
{waves} 波敵潮 · 擊退最終首領
按住滑鼠連射 · 保護主塔
任務
返回
暫停並返回任務
暫停
殭屍守塔戰場；滑鼠瞄準，左鍵連射，右鍵或 Space 震爆，F 向準星射擊，Esc 暫停。
主塔剩餘生命
主塔
主塔 {percent}%
敵潮
敵潮 {wave}/{total}
震爆 · Space
震爆 {seconds}秒
守住主塔 · 場上 {count} 隻殭屍
按住左鍵連射 · 右鍵／Space 震爆 · Esc 暫停
第 {wave} 波 · 守住主塔
敵潮退去，主塔安全！
敵潮清空！選擇本次強化。
巨型殭屍來襲！
繪圖環境中斷。已保存的任務進度仍在；請返回選關後重試。
繪圖環境已恢復，請返回選關後重新進入。
已暫停
滑鼠瞄準 · 按住左鍵連射 · 右鍵／Space 震爆 · F 向準星射擊
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
  'zh-Hans': `鼠标瞄准、按住连射！击退僵尸，别让主塔倒下。
电脑鼠标游玩 · 固定镜头，轻松瞄准。
请使用电脑打开
开始游戏
守塔任务 {done} / {total}
已守住 {done} / {total}
防卫任务 {n}
已守住
准备迎战
完成前一任务开放
{waves} 波敌潮 · 击退最终首领
按住鼠标连射 · 保护主塔
任务
返回
暂停并返回任务
暂停
僵尸守塔战场；鼠标瞄准，左键连射，右键或 Space 震爆，F 向准星射击，Esc 暂停。
主塔剩余生命
主塔
主塔 {percent}%
敌潮
敌潮 {wave}/{total}
震爆 · Space
震爆 {seconds}秒
守住主塔 · 场上 {count} 只僵尸
按住左键连射 · 右键／Space 震爆 · Esc 暂停
第 {wave} 波 · 守住主塔
敌潮退去，主塔安全！
敌潮清空！选择本次强化。
巨型僵尸来袭！
绘图环境中断。已保存的任务进度仍在；请返回选关后重试。
绘图环境已恢复，请返回选关后重新进入。
已暂停
鼠标瞄准 · 按住左键连射 · 右键／Space 震爆 · F 向准星射击
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
  ja: `マウスで狙い、押し続けて連射！ゾンビを撃退して塔を守ろう。
パソコンのマウスでプレイ · 固定カメラで簡単照準。
パソコンで開いてください
ゲーム開始
防衛ミッション {done} / {total}
防衛済み {done} / {total}
防衛ミッション {n}
防衛済み
出撃準備完了
前のミッションをクリアすると開放
{waves} ウェーブ · 最後のボスを撃退
押し続けて連射 · 塔を守ろう
ミッション
戻る
一時停止してミッションへ
一時停止
ゾンビから塔を守る戦場。マウスで照準、左ボタン長押しで連射、右ボタンまたは Space で衝撃波、F で照準へ射撃、Esc で一時停止。
塔の残り耐久力
塔
塔 {percent}%
ウェーブ
ウェーブ {wave}/{total}
衝撃波 · Space
衝撃波 {seconds}秒
塔を守ろう · ゾンビ {count} 体
左ボタン長押しで連射 · 右ボタン／Space で衝撃波 · Esc で一時停止
ウェーブ {wave} · 塔を守ろう
敵を撃退！塔は無事だ！
ウェーブクリア！強化を選ぼう。
巨大ゾンビが接近！
描画機能が停止しました。保存済みの進行は無事です。ミッションに戻って再挑戦してください。
描画機能が復旧しました。ミッションに戻り、入り直してください。
一時停止中
マウスで照準 · 左長押しで連射 · 右／Space で衝撃波 · F で照準へ射撃
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
  ko: `마우스로 조준하고 누른 채 연사하세요! 좀비를 물리치고 탑을 지키세요.
컴퓨터 마우스로 플레이 · 고정 시점으로 편하게 조준하세요.
컴퓨터에서 열어 주세요
게임 시작
방어 임무 {done} / {total}
방어 완료 {done} / {total}
방어 임무 {n}
방어 완료
출격 준비 완료
이전 임무를 완료하면 해제
{waves} 차례의 습격 · 마지막 보스 격퇴
누른 채 연사 · 탑 보호
임무
뒤로
일시 정지 후 임무로 돌아가기
일시 정지
좀비로부터 탑을 지키는 전장입니다. 마우스로 조준, 왼쪽 버튼을 누른 채 연사, 오른쪽 버튼 또는 Space로 충격파, F로 조준점에 사격, Esc로 일시 정지합니다.
탑의 남은 체력
탑
탑 {percent}%
습격
습격 {wave}/{total}
충격파 · Space
충격파 {seconds}초
탑을 지키세요 · 좀비 {count}마리
왼쪽 버튼을 누른 채 연사 · 오른쪽 버튼／Space 충격파 · Esc 일시 정지
습격 {wave} · 탑을 지키세요
좀비 격퇴! 탑은 안전합니다!
습격 격퇴! 강화를 선택하세요.
거대 좀비가 다가옵니다!
그래픽 연결이 끊겼습니다. 저장된 임무 진행은 안전합니다. 임무로 돌아가 다시 시도하세요.
그래픽이 복구되었습니다. 임무로 돌아간 뒤 다시 입장하세요.
일시 정지됨
마우스로 조준 · 왼쪽 누른 채 연사 · 오른쪽／Space 충격파 · F 조준점 사격
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
  es: `Apunta con el ratón y mantén pulsado para disparar. ¡Frena a los zombis y protege la torre!
Juega con el ratón de un ordenador · Cámara fija y puntería sencilla.
Abre el juego en un ordenador
Jugar
Misiones de defensa {done} / {total}
Defendidas {done} / {total}
Misión de defensa {n}
Defendida
Listo para defender
Completa la misión anterior para desbloquear
{waves} oleadas · Derrota al jefe final
Mantén pulsado para disparar · Protege la torre
Misiones
Volver
Pausar y volver a misiones
Pausa
Defiende la torre de los zombis. Ratón para apuntar; botón izquierdo mantenido para disparar; botón derecho o Space para la explosión; F para disparar a la mira; Esc para pausar.
Salud restante de la torre
Torre
Torre {percent}%
Oleada
Oleada {wave}/{total}
Explosión · Space
Explosión {seconds}s
Protege la torre · {count} zombis
Mantén el botón izquierdo para disparar · Derecho/Space para explosión · Esc para pausa
Oleada {wave} · Defiende la torre
¡La torre está a salvo!
¡Oleada superada! Elige una mejora.
¡Se acerca un zombi gigante!
Se ha perdido el contexto gráfico. El progreso guardado está a salvo; vuelve a misiones e inténtalo de nuevo.
Gráficos recuperados. Vuelve a misiones y entra otra vez.
En pausa
Ratón para apuntar · Izquierdo mantenido para disparar · Derecho/Space para explosión · F para disparar a la mira
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
  'pt-BR': `Mire com o mouse e segure para disparar. Detenha os zumbis e proteja a torre!
Jogue com o mouse de um computador · Câmera fixa e mira fácil.
Abra em um computador
Jogar
Missões de defesa {done} / {total}
Defendidas {done} / {total}
Missão de defesa {n}
Defendida
Pronto para defender
Conclua a missão anterior para desbloquear
{waves} ondas · Derrote o chefe final
Segure para disparar · Proteja a torre
Missões
Voltar
Pausar e voltar às missões
Pausa
Defesa da torre contra zumbis. Mouse para mirar; segure o botão esquerdo para disparar; botão direito ou Space para explosão; F para disparar na mira; Esc para pausar.
Vida restante da torre
Torre
Torre {percent}%
Onda
Onda {wave}/{total}
Explosão · Space
Explosão {seconds}s
Proteja a torre · {count} zumbis
Segure o botão esquerdo para disparar · Direito/Space para explosão · Esc para pausar
Onda {wave} · Defenda a torre
A torre está segura!
Onda vencida! Escolha uma melhoria.
Um zumbi gigante está chegando!
O contexto gráfico foi perdido. O progresso salvo está seguro; volte às missões e tente novamente.
Gráficos restaurados. Volte às missões e entre novamente.
Em pausa
Mouse para mirar · Segure o esquerdo para disparar · Direito/Space para explosão · F para disparar na mira
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
  fr: `Visez à la souris et maintenez le bouton pour tirer. Repoussez les zombies et protégez la tour !
Jouez avec une souris sur ordinateur · Caméra fixe, visée facile.
Ouvrez le jeu sur un ordinateur
Jouer
Missions de défense {done} / {total}
Défendues {done} / {total}
Mission de défense {n}
Défendue
Prêt à défendre
Terminez la mission précédente pour débloquer
{waves} vagues · Battez le boss final
Maintenez pour tirer · Protégez la tour
Missions
Retour
Mettre en pause et revenir aux missions
Pause
Défendez la tour contre les zombies. Souris pour viser ; bouton gauche maintenu pour tirer ; bouton droit ou Space pour l'explosion ; F pour tirer vers le réticule ; Esc pour mettre en pause.
Vie restante de la tour
Tour
Tour {percent} %
Vague
Vague {wave}/{total}
Explosion · Space
Explosion {seconds}s
Protégez la tour · {count} zombies
Maintenez le bouton gauche pour tirer · Droit/Space pour l'explosion · Esc pour la pause
Vague {wave} · Défendez la tour
La tour est en sécurité !
Vague repoussée ! Choisissez une amélioration.
Un zombie géant approche !
Le contexte graphique a été perdu. La progression sauvegardée est intacte ; revenez aux missions et réessayez.
Affichage rétabli. Revenez aux missions, puis entrez à nouveau.
En pause
Souris pour viser · Gauche maintenu pour tirer · Droit/Space pour l'explosion · F pour tirer au réticule
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
  de: `Mit der Maus zielen und zum Feuern gedrückt halten. Stoppe die Zombies und schütze den Turm!
Mit Computermaus spielen · Feste Kamera, einfaches Zielen.
Bitte auf einem Computer öffnen
Spiel starten
Verteidigungsmissionen {done} / {total}
Verteidigt {done} / {total}
Verteidigungsmission {n}
Verteidigt
Bereit zur Verteidigung
Vorherige Mission abschließen, um freizuschalten
{waves} Wellen · Besiege den letzten Boss
Zum Feuern gedrückt halten · Turm schützen
Missionen
Zurück
Pausieren und zu Missionen zurück
Pause
Verteidige den Turm gegen Zombies. Maus zum Zielen; linke Taste zum Dauerfeuer halten; rechte Taste oder Space für Druckwelle; F zum Feuern aufs Fadenkreuz; Esc für Pause.
Verbleibende Turmgesundheit
Turm
Turm {percent}%
Welle
Welle {wave}/{total}
Druckwelle · Space
Druckwelle {seconds}s
Schütze den Turm · {count} Zombies
Links halten zum Feuern · Rechts/Space für Druckwelle · Esc für Pause
Welle {wave} · Halte den Turm
Der Turm ist sicher!
Welle geschafft! Wähle eine Verbesserung.
Ein Riesenzombie kommt!
Die Grafikverbindung ging verloren. Gespeicherter Fortschritt bleibt erhalten. Kehre zu den Missionen zurück und versuche es erneut.
Grafik wiederhergestellt. Kehre zu den Missionen zurück und starte erneut.
Pausiert
Maus zum Zielen · Links halten zum Feuern · Rechts/Space für Druckwelle · F feuert aufs Fadenkreuz
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
  it: `Mira con il mouse e tieni premuto per sparare. Ferma gli zombi e proteggi la torre!
Gioca con il mouse di un computer · Visuale fissa, mira semplice.
Apri il gioco su un computer
Inizia a giocare
Missioni di difesa {done} / {total}
Difese {done} / {total}
Missione di difesa {n}
Difesa completata
Pronto a difendere
Completa la missione precedente per sbloccare
{waves} ondate · Sconfiggi il boss finale
Tieni premuto per sparare · Proteggi la torre
Missioni
Indietro
Pausa e ritorno alle missioni
Pausa
Difendi la torre dagli zombi. Mouse per mirare; tieni premuto il sinistro per sparare; destro o Space per l'esplosione; F per sparare al mirino; Esc per la pausa.
Salute residua della torre
Torre
Torre {percent}%
Ondata
Ondata {wave}/{total}
Esplosione · Space
Esplosione {seconds}s
Proteggi la torre · {count} zombi
Tieni premuto il sinistro per sparare · Destro/Space per l'esplosione · Esc per la pausa
Ondata {wave} · Difendi la torre
La torre è al sicuro!
Ondata respinta! Scegli un potenziamento.
Sta arrivando uno zombi gigante!
Il contesto grafico è stato perso. I progressi salvati sono al sicuro; torna alle missioni e riprova.
Grafica ripristinata. Torna alle missioni ed entra di nuovo.
In pausa
Mouse per mirare · Sinistro premuto per sparare · Destro/Space per l'esplosione · F per sparare al mirino
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
  ru: `Цельтесь мышью и удерживайте кнопку для стрельбы. Остановите зомби и защитите башню!
Играйте мышью на компьютере · Неподвижная камера, удобный прицел.
Откройте игру на компьютере
Начать игру
Задания обороны {done} / {total}
Защищено {done} / {total}
Задание обороны {n}
Защищено
Готово к обороне
Пройдите предыдущее задание, чтобы открыть
{waves} волн · Победите последнего босса
Удерживайте для стрельбы · Защищайте башню
Задания
Назад
Пауза и возврат к заданиям
Пауза
Защита башни от зомби. Мышь — прицел; удерживайте левую кнопку для стрельбы; правая кнопка или Space — взрыв; F — стрельба в прицел; Esc — пауза.
Оставшееся здоровье башни
Башня
Башня {percent}%
Волна
Волна {wave}/{total}
Взрыв · Space
Взрыв {seconds}с
Защитите башню · Зомби: {count}
Левая кнопка — стрельба · Правая/Space — взрыв · Esc — пауза
Волна {wave} · Удержите башню
Башня в безопасности!
Волна отбита! Выберите улучшение.
Приближается гигантский зомби!
Графическое соединение потеряно. Сохранённый прогресс не пострадал. Вернитесь к заданиям и повторите попытку.
Графика восстановлена. Вернитесь к заданиям и войдите снова.
На паузе
Мышь — прицел · Левая кнопка — стрельба · Правая/Space — взрыв · F — огонь в прицел
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
  hi: `माउस से निशाना लगाएँ और दबाए रखकर गोली चलाएँ। ज़ॉम्बी को रोकें और मीनार बचाएँ!
कंप्यूटर के माउस से खेलें · स्थिर कैमरा, आसान निशाना।
कृपया कंप्यूटर पर खोलें
खेल शुरू करें
रक्षा अभियान {done} / {total}
सुरक्षित किए {done} / {total}
रक्षा अभियान {n}
रक्षा सफल
रक्षा के लिए तैयार
खोलने के लिए पिछला अभियान पूरा करें
{waves} लहरें · अंतिम सरदार को हराएँ
दबाए रखकर गोली चलाएँ · मीनार बचाएँ
अभियान
वापस
रोकें और अभियान पर लौटें
विराम
ज़ॉम्बी से मीनार की रक्षा करें। माउस से निशाना; बायाँ बटन दबाए रखकर गोली चलाएँ; दायाँ बटन या Space से विस्फोट; F से निशाने पर गोली; Esc से विराम।
मीनार की बची सेहत
मीनार
मीनार {percent}%
लहर
लहर {wave}/{total}
विस्फोट · Space
विस्फोट {seconds}से
मीनार बचाएँ · {count} ज़ॉम्बी
बायाँ बटन दबाए रखकर गोली चलाएँ · दायाँ/Space से विस्फोट · Esc से विराम
लहर {wave} · मीनार की रक्षा करें
मीनार सुरक्षित है!
लहर खत्म! एक सुधार चुनें।
विशाल ज़ॉम्बी आ रहा है!
ग्राफ़िक्स कनेक्शन टूट गया। सहेजा अभियान सुरक्षित है; अभियान पर लौटकर फिर कोशिश करें।
ग्राफ़िक्स लौट आए हैं। अभियान पर लौटें और फिर प्रवेश करें।
खेल रुका है
माउस से निशाना · बायाँ दबाए रखकर गोली · दायाँ/Space से विस्फोट · F से निशाने पर गोली
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
  ar: `صوّب بالفأرة واضغط مطولًا لإطلاق النار. أوقف الزومبي واحمِ البرج!
العب بفأرة الكمبيوتر · كاميرا ثابتة وتصويب سهل.
يرجى فتح اللعبة على كمبيوتر
ابدأ اللعب
مهام الدفاع {done} / {total}
تم الدفاع {done} / {total}
مهمة الدفاع {n}
تم الدفاع
جاهز للدفاع
أكمل المهمة السابقة لفتحها
{waves} موجات · اهزم الزعيم الأخير
اضغط مطولًا لإطلاق النار · احمِ البرج
المهام
رجوع
إيقاف مؤقت والعودة إلى المهام
إيقاف مؤقت
دافع عن البرج من الزومبي. الفأرة للتصويب؛ اضغط مطولًا على الزر الأيسر لإطلاق النار؛ الزر الأيمن أو Space للانفجار؛ F لإطلاق النار نحو المؤشر؛ Esc للإيقاف المؤقت.
صحة البرج المتبقية
البرج
البرج {percent}%
الموجة
الموجة {wave}/{total}
انفجار · Space
انفجار {seconds}ث
احمِ البرج · {count} زومبي
اضغط مطولًا على الأيسر لإطلاق النار · الأيمن/Space للانفجار · Esc للإيقاف
الموجة {wave} · احمِ البرج
البرج بأمان!
انتهت الموجة! اختر ترقية.
زومبي عملاق قادم!
انقطع الاتصال بالرسومات. تقدم المهام المحفوظ آمن؛ عد إلى المهام وأعد المحاولة.
عادت الرسومات. عد إلى المهام وادخل من جديد.
اللعبة متوقفة
الفأرة للتصويب · الأيسر مطولًا لإطلاق النار · الأيمن/Space للانفجار · F لإطلاق النار نحو المؤشر
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

export const uiLocales = Object.freeze(['en', 'zh-Hant', 'zh-Hans', 'ja', 'ko', 'es', 'pt-BR', 'fr', 'de', 'it', 'ru', 'hi', 'ar']);
const placeholders = text => [...text.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map(match => match[1]).sort().join(',');
const extraKeys = ['pauseConsequence', 'stageAria', 'diagnosticStats', 'recoveredBackup'];
export const uiCatalogs = Object.freeze(Object.fromEntries(uiLocales.map(locale => {
  const lines = source[locale]?.split('\n');
  if (!lines || lines.length !== keys.length || lines.some(line => !line.trim())) throw new Error(`Invalid runtime catalog: ${locale}`);
  if (!publicationTitles[locale] || operations[locale]?.length !== 6 || extras[locale]?.length !== extraKeys.length) throw new Error(`Incomplete runtime catalog: ${locale}`);
  const values = Object.fromEntries(keys.map((key, index) => [key, lines[index]]));
  extraKeys.forEach((key, index) => { values[key] = extras[locale][index]; });
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
      if (!Number.isInteger(index) || index < 0 || index >= operations[locale].length) throw new RangeError('Invalid operation copy index');
      const [name, subtitle] = operations[locale][index];
      return Object.freeze({name, subtitle});
    },
  });
  instances.set(locale, copy);
  return copy;
}
