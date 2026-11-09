var m=Object.defineProperty;var r=(i,n)=>m(i,"name",{value:n,configurable:!0});export const ROUTES={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};const l={start:"Start",back:"Back",stages:"Shifts",looks:"Desk collection",shift:"Shift {n}",chapter:"Chapter {n}",foothills:"Valley post",deep:"Summit relay",locked:"Locked",clear:"Complete",ready:"Ready",queue:"Parcels",office:"Post office",label:"Parcel label",ledger:"Mail ledger",time:"Time",trust:"Trust",tickets:"Tickets",move:"Time {n}",ticket:"1 ticket",sent:"Sent",returned:"Returned",packed:"Sound",damaged:"Damaged",unclear:"Unreadable",station:"Station",mark:"Seal",wrap:"Wrap",tag0:"Oak",tag1:"Cove",tag2:"Peak",done:"{n}/{total} handled",due:"{n} time left",cold:"Cold chain",lead:"Receipt {n}",follow:"Needs receipt {n}",receipt:"Receipt {n} ready",select:"Select",scan:"Scan",repair:"Mend",send:"Send",express:"Express",return:"Return",scanned:"Seal read. Compare both records.",repaired:"Parcel amended. Check the new label.",dispatched:"Parcel sent on the standard route.",expedited:"Express delivery. One ticket used.",rejected:"Invalid parcel returned.",selected:"Compare the label with the ledger.",choose:"Select a parcel first.",finished:"This shift is closing.",scanUnneeded:"The seal can already be read.",repairUnneeded:"Nothing needs amending.",noTicket:"No express tickets left.",scanNeeded:"Read the blurred seal with Scan first.",validMark:"The ledger is valid. Mend or send this parcel.",voidMark:"The seals disagree. Return the parcel.",fixBox:"Mend the damaged wrap before sending.",fixLabel:"The stations disagree. Mend the label.",needReceipt:"Send the matching receipt parcel first.",coldOnly:"Cold-chain parcels need the express route.",missed:"An urgent parcel missed its deadline.",trustLost:"The shift lost all three trust marks.",timeLost:"The shift ran out of time.",won:"Shift cleared",lost:"Shift stopped",marks:"Postmarks {n}/3",saveError:"Progress could not be saved. Retry or check storage.",practice:"Practice. No campaign rewards.",recorded:"Shift recorded.",reward:"First-clear block collected.",next:"Next shift",retry:"Retry",report:"Shift report",help:"Help",leave:"Leave shift?",leaveText:"Return to the shift list. Unfinished mail will reset.",resume:"Continue",replay:"Replay tutorial",retry3d:"The 3D desk stopped. Retry the scene or return to shifts.",paused:"Paused",wrongLesson:"Try the highlighted parcel or action.",lesson:"Desk training","select-clean":"Tap parcel 1. Its station and seal match.","send-clean":"Send the matching parcel by the standard route.","select-repair":"Tap parcel 2. Its station differs from the ledger.","fix-label":"Mend the label to match the ledger.","send-repair":"Send the amended parcel.","select-void":"Tap parcel 3. The seals disagree.","return-void":"Return this parcel. A mismatched seal cannot be amended.",lessonDone:"Training finished. Your shift begins.",balance:"Diamonds: {n}",buy:"Buy",cancel:"Cancel",equip:"Use",equipped:"In use",permanent:"Permanent appearance",price:"{n} diamonds",noFunds:"Not enough diamonds.",default:"Night desk",amber:"Amber seal",jade:"Jade desk",cedar:"Cedar desk",frost:"Frost desk",unlockLook:"Clear shift {n} to unlock.",lookEffect:"Changes the desk finish and dispatch seal.",guide:"Game guide",goal:"Your goal",how:"At the desk",rules:"Routes and checks",finish:"End of the shift",related:"Related games",goalText:"Handle every parcel before the shift ends. Send parcels that match the ledger and return parcels with an invalid seal.",howText:"Choose any unfinished parcel and compare its label with the ledger. Scan an unreadable seal. Mend a wrong station or damaged wrap when the seal is valid.",rulesText:"Standard dispatch takes two units of time. Express uses one unit and one ticket. Check deadlines before acting, save tickets for cold-chain mail, and send receipt parcels before their matching partners.",finishText:"A clear earns one postmark. Keep all trust for a second, and finish with spare time or an express ticket for a third. A perfect finish also counts on shifts with zero slack. Replay any unlocked shift to improve your record.",faq1:"When should I return a parcel?",answer1:"Return it when its seal disagrees with the ledger. A matching seal with a wrong station or damaged wrap can be mended.",faq2:"Do I need diamonds to finish?",answer2:"No. All shifts can be cleared with the tools supplied at the desk. Diamonds buy permanent appearances."},c={};export function word(i,n,o={}){return(c[i]?.[n]??l[n]??n).replace(/\{(\w+)\}/g,(s,t)=>String(o[t]??""))}r(word,"word");const d=Object.keys(l);function e(i,n){const o=n.trim().split(/[|\n]/).map(a=>a.trim());if(o.length!==d.length||o.some(a=>!a))throw new Error("Incomplete Wingseal locale "+i+": "+o.length+"/"+d.length);c[i]=Object.fromEntries(d.map((a,s)=>{const t=r(u=>[...u.matchAll(/\{\w+\}/g)].map(p=>p[0]).sort().join(),"tokens");if(t(l[a])!==t(o[s]))throw new Error("Missing locale token "+i+"/"+a);return[a,o[s]]}))}if(r(e,"add"),e("zh-Hant",`
開始|返回|班次|郵檯收藏|第 {n} 班|第 {n} 章
山谷郵局|峰頂接力|未解鎖|已完成|可出勤
包裹|郵局|包裹郵籤|寄件簿
時間|信任|快線票|{n} 格|1 張票
已寄出|已退回|完好|破損|看不清
站別|郵戳|包裝|橡木站|灣岸站|山峰站
已處理 {n}/{total}|剩 {n} 格|冷鏈|收據 {n}|須有收據 {n}|收據 {n} 已備
選取|掃描|補件|寄出|快線|退回
已讀取郵戳。請比對兩份紀錄。|已補件。請查看新郵籤。
已用普通航道寄出。|已走快線，使用 1 張票。|無效包裹已退回。
比對郵籤與寄件簿。|請先選一件包裹。|本班正在結算。
郵戳已可閱讀。|這件包裹無須補件。
快線票用完了。|請先掃描模糊郵戳。
寄件簿有效。請補件或寄出。
郵戳不符。請退回包裹。|請先加固破損的包裝。
站別不符。請更正郵籤。|先寄出同組的收據件。
冷鏈包裹須走快線。|有急件逾期了。
三枚信任印記已用完。|本班時間已用完。
班次完成|班次中止|班次印記 {n}/3|無法保存進度。請重試或檢查儲存空間。
練習班次，沒有戰役獎勵。|班次紀錄已保存。|已收集首通方塊。
下一班|重試|班次報告|說明|離開本班？
返回班次列表。未完成的郵件將重置。|繼續|重玩教學
3D 郵檯已中斷。可重試場景或返回班次。|已暫停
請操作亮起的包裹或按鈕。|郵檯訓練
點第 1 件包裹。站別和郵戳都相符。|將相符的包裹從普通航道寄出。
點第 2 件包裹。站別和寄件簿不同。|補寫郵籤，讓站別符合寄件簿。
寄出已補件的包裹。|點第 3 件包裹。兩個郵戳不同。
退回這件包裹。錯誤郵戳無法補寫。|訓練完成，正式班次開始。
鑽石：{n}|購買|取消|使用|使用中|永久外觀
{n} 顆鑽石|鑽石不足。|夜間郵檯|琥珀郵戳|翡翠郵檯
雪松郵檯|霜色郵檯|完成第 {n} 班解鎖。|變更郵檯材質與寄送印記。
遊戲指南|班次目標|郵檯操作|航道與查核|班末結算|相關遊戲
在時間內處理每件包裹。寄出符合寄件簿的郵件，退回郵戳不符的包裹。
選擇任何待處理包裹，比對郵籤和寄件簿。掃描模糊郵戳；郵戳有效時，可以更正站別或加固包裝。
普通航道花兩格時間。快線花一格和一張票。先看急件期限，替冷鏈留票，同組的收據件要先寄出。
完成班次可得一枚印記。保住全部信任可得第二枚，留有時間或快線票可得第三枚。最緊班次無失誤並準時完成也可得第三枚。可重玩已解鎖的班次改善紀錄。
什麼時候該退回包裹？|郵戳與寄件簿不符時請退回。若郵戳正確，可以補寫錯誤站別或修補破損包裝。
通關需要鑽石嗎？|每班提供所需工具，可免費完成。鑽石用於永久外觀。
`),e("zh-Hans",`
开始|返回|班次|邮台收藏|第 {n} 班|第 {n} 章
山谷邮局|峰顶接力|未解锁|已完成|可出勤
包裹|邮局|包裹邮签|寄件簿
时间|信任|快线票|{n} 格|1 张票
已寄出|已退回|完好|破损|看不清
站点|邮戳|包装|橡木站|湾岸站|山峰站
已处理 {n}/{total}|剩 {n} 格|冷链|回执 {n}|需要回执 {n}|回执 {n} 已备
选择|扫描|补件|寄出|快线|退回
已读出邮戳。请比对两份记录。|已补件。请查看新邮签。
已从普通航线寄出。|已走快线，使用 1 张票。|无效包裹已退回。
比对邮签和寄件簿。|请先选一个包裹。|本班正在结算。
邮戳已经可以看清。|这件包裹无须补件。
快线票用完了。|请先扫描模糊的邮戳。
寄件簿有效。请补件或寄出。
邮戳不符。请退回包裹。|请先加固破损包装。
站点不符。请更正邮签。|先寄出同组的回执件。
冷链包裹必须走快线。|有急件逾期了。
三枚信任印记已用完。|本班时间已用完。
班次完成|班次中止|班次印记 {n}/3|无法保存进度。请重试或检查存储空间。
练习班次，没有战役奖励。|班次记录已保存。|已收集首通方块。
下一班|重试|班次报告|帮助|离开本班？
返回班次列表。未处理完的邮件会重置。|继续|重玩教程
3D 邮台已中断。可以重试场景或返回班次。|已暂停
请操作高亮的包裹或按钮。|邮台训练
点击 1 号包裹。站点和邮戳都相符。|将相符的包裹从普通航线寄出。
点击 2 号包裹。站点和寄件簿不同。|更正邮签上的站点，使它符合寄件簿。
寄出已补件的包裹。|点击 3 号包裹。两个邮戳不同。
退回这个包裹。错误的邮戳无法补写。|训练完成，正式班次开始。
钻石：{n}|购买|取消|使用|使用中|永久外观
{n} 颗钻石|钻石不足。|夜间邮台|琥珀邮戳|翡翠邮台
雪松邮台|霜色邮台|完成第 {n} 班解锁。|更换邮台材质和寄送印记。
游戏指南|班次目标|邮台操作|航线与查验|班末结算|相关游戏
在规定时间内处理每个包裹。寄出符合寄件簿的邮件，退回邮戳不符的包裹。
选择任一待处理包裹，比对邮签和寄件簿。扫描模糊邮戳。邮戳有效时，可以更正站点或加固包装。
普通航线花两格时间。快线花一格和一张票。先看急件期限，给冷链留票，同组回执件要先寄出。
完成班次可得一枚印记。保住全部信任可得第二枚，留有时间或快线票可得第三枚。最紧班次无失误并准时完成也可得第三枚。可以重玩已解锁的班次提高成绩。
什么时候应该退回包裹？|邮戳与寄件簿不符时请退回。邮戳正确时，可以补写站点或修补破损包装。
通关需要钻石吗？|每班都会提供所需工具，可以免费完成。钻石用来购买永久外观。
`),e("ja",`
スタート|戻る|勤務一覧|窓口コレクション|勤務 {n}|第 {n} 章
谷の郵便局|山頂の中継局|未解放|完了|受付中
荷物|郵便局|送り状|発送台帳
時間|信頼|速達券|時間 {n}|券1枚
発送済み|返送済み|良好|破損|判読不能
宛先|印章|包装|カシ局|入江局|山頂局
処理済み {n}/{total}|残り時間 {n}|冷蔵便|受領票 {n}|受領票 {n} が必要|受領票 {n} 発行済み
選択|読取|修正|発送|速達|返送
印章を読み取りました。台帳と照合しましょう。|修正しました。新しい送り状を確認しましょう。
普通便で発送しました。|速達券を1枚使って発送しました。|無効な荷物を返送しました。
送り状と台帳を照合しましょう。|先に荷物を選んでください。|勤務を締め切ります。
印章はすでに読めます。|修正する箇所はありません。
速達券がありません。|先にぼやけた印章を読み取ってください。
印章は有効です。修正または発送ができます。
印章が一致しません。荷物を返送してください。|発送の前に包装を修理してください。
宛先が一致しません。送り状を修正してください。|先に同じ組の受領票付き荷物を発送してください。
冷蔵便は速達で発送してください。|急ぎの荷物が締切に間に合いませんでした。
信頼の印を3個失いました。|勤務時間を使い切りました。
勤務完了|勤務中断|記念印 {n}/3|進行を保存できませんでした。再試行するか保存先を確認してください。
練習です。キャンペーン報酬はありません。|勤務を記録しました。|初回クリアのブロックを入手しました。
次の勤務|やり直す|勤務報告|ヘルプ|勤務を終了しますか？
勤務一覧に戻ります。未処理の荷物はリセットされます。|続ける|チュートリアルを再開
3D窓口が停止しました。再試行するか勤務一覧に戻ってください。|一時停止
強調された荷物か操作を選んでください。|窓口研修
荷物1を選びます。宛先と印章が一致しています。|一致した荷物を普通便で発送します。
荷物2を選びます。宛先が台帳と異なります。|送り状を台帳どおりに修正します。
修正した荷物を発送します。|荷物3を選びます。印章が一致しません。
この荷物を返送します。印章の不一致は修正できません。|研修完了。勤務を始めましょう。
ダイヤ：{n}|購入|キャンセル|使う|使用中|永続外観
ダイヤ {n} 個|ダイヤが足りません。|夜の窓口|琥珀の印|ヒスイの窓口
杉の窓口|霜の窓口|勤務 {n} をクリアすると解放。|窓口の仕上げと発送印の色が変わります。
ゲームガイド|目標|窓口での操作|便と照合|勤務の締め|関連ゲーム
勤務時間内に荷物をすべて処理しましょう。台帳と一致する荷物を発送し、印章が無効なものは返送します。
未処理の荷物を選んで送り状と台帳を照合します。読めない印章は読み取り、有効な印章なら宛先や包装を直せます。
普通便は時間を2、速達は時間を1と券を1枚使います。締切を確かめ、冷蔵便の券を残し、同じ組の受領票を先に発送してください。
勤務完了で印を1つ獲得します。信頼を全部保てば2つ目、時間か速達券を残せば3つ目です。余裕のない勤務でもミスなく完了すれば3つ目を獲得できます。解放済みの勤務は何度でも挑戦できます。
どの荷物を返送しますか？|印章が台帳と一致しない荷物を返送します。印章が有効なら誤った宛先や破損した包装は修正できます。
ダイヤは必要ですか？|全勤務は窓口の道具でクリアできます。ダイヤは永続外観の購入に使います。
`),e("ko",`
시작|뒤로|근무 목록|창구 컬렉션|근무 {n}|제 {n}장
계곡 우체국|정상 중계소|잠김|완료|준비
소포|우체국|소포 라벨|발송 장부
시간|신뢰|특급권|시간 {n}|특급권 1장
발송됨|반송됨|양호|파손|판독 불가
도착국|인장|포장|참나무국|만 입구국|봉우리국
{n}/{total} 처리|남은 시간 {n}|냉장 배송|접수증 {n}|접수증 {n} 필요|접수증 {n} 준비됨
선택|스캔|수정|발송|특급|반송
인장을 읽었습니다. 장부와 대조하세요.|수정했습니다. 새 라벨을 확인하세요.
일반편으로 발송했습니다.|특급권 1장을 사용해 발송했습니다.|무효 소포를 반송했습니다.
라벨과 장부를 대조하세요.|먼저 소포를 선택하세요.|근무를 마감합니다.
이미 읽을 수 있는 인장입니다.|수정할 부분이 없습니다.
남은 특급권이 없습니다.|먼저 흐린 인장을 스캔하세요.
인장이 유효합니다. 수정하거나 발송하세요.
인장이 다릅니다. 소포를 반송하세요.|발송 전에 파손된 포장을 보수하세요.
도착국이 다릅니다. 라벨을 수정하세요.|같은 번호의 접수증 소포를 먼저 발송하세요.
냉장 소포는 특급으로 보내야 합니다.|긴급 소포가 마감에 늦었습니다.
신뢰 표시 세 개를 모두 잃었습니다.|근무 시간이 다 되었습니다.
근무 완료|근무 중단|우편 인장 {n}/3|진행 상황을 저장하지 못했습니다. 다시 시도하거나 저장소를 확인하세요.
연습입니다. 캠페인 보상은 없습니다.|근무 기록을 저장했습니다.|첫 완료 블록을 받았습니다.
다음 근무|다시 시도|근무 보고서|도움말|근무를 나갈까요?
목록으로 돌아갑니다. 미처리 우편은 초기화됩니다.|계속|튜토리얼 다시 하기
3D 창구가 멈췄습니다. 장면을 다시 열거나 목록으로 돌아가세요.|일시 정지
강조 표시된 소포나 버튼을 누르세요.|창구 훈련
1번 소포를 누르세요. 도착국과 인장이 일치합니다.|일치하는 소포를 일반편으로 발송하세요.
2번 소포를 누르세요. 도착국이 장부와 다릅니다.|라벨을 장부에 맞게 수정하세요.
수정한 소포를 발송하세요.|3번 소포를 누르세요. 인장이 일치하지 않습니다.
이 소포를 반송하세요. 틀린 인장은 수정할 수 없습니다.|훈련 완료. 근무를 시작하세요.
다이아몬드: {n}|구매|취소|사용|사용 중|영구 외형
다이아몬드 {n}개|다이아몬드가 부족합니다.|야간 창구|호박 인장|비취 창구
삼나무 창구|서리 창구|근무 {n}을 완료하면 해제됩니다.|창구 마감과 발송 인장 색이 바뀝니다.
게임 안내|근무 목표|창구 조작|배송편과 검사|근무 마감|관련 게임
시간 안에 모든 소포를 처리하세요. 장부와 일치하는 소포는 발송하고 인장이 틀리면 반송합니다.
미처리 소포를 선택해 라벨과 장부를 대조하세요. 흐린 인장은 스캔하고, 유효한 인장이 있는 소포는 도착국이나 포장을 수정할 수 있습니다.
일반편은 시간 두 칸, 특급은 한 칸과 특급권 한 장을 씁니다. 마감 시간을 확인하고 냉장 소포용 특급권을 남기며 같은 조의 접수증 소포를 먼저 보내세요.
근무 완료로 인장 한 개를 얻습니다. 신뢰를 모두 지키면 두 번째, 시간이나 특급권을 남기면 세 번째를 받습니다. 여유가 없는 근무도 실수 없이 마치면 세 번째를 받습니다. 열린 근무는 다시 도전할 수 있습니다.
언제 소포를 반송하나요?|인장이 장부와 일치하지 않으면 반송합니다. 인장이 맞으면 잘못된 도착국이나 파손된 포장을 고칠 수 있습니다.
완료에 다이아몬드가 필요한가요?|창구에 제공된 도구로 모든 근무를 완료할 수 있습니다. 다이아몬드는 영구 외형을 구매할 때 사용합니다.
`),e("es",`
Empezar|Volver|Turnos|Colección de mostradores|Turno {n}|Capítulo {n}
Correo del valle|Relevo de la cumbre|Bloqueado|Completo|Disponible
Paquetes|Oficina postal|Etiqueta|Registro postal
Tiempo|Confianza|Billetes|Tiempo {n}|1 billete
Enviado|Devuelto|Intacto|Dañado|Ilegible
Destino|Sello|Embalaje|Roble|Cala|Cumbre
{n}/{total} tramitados|Quedan {n}|Cadena de frío|Recibo {n}|Requiere recibo {n}|Recibo {n} listo
Elegir|Escanear|Reparar|Enviar|Exprés|Devolver
Sello leído. Compara los registros.|Paquete corregido. Revisa la etiqueta nueva.
Envío por la ruta normal.|Envío exprés. Se usó un billete.|Paquete inválido devuelto.
Coteja la etiqueta con el registro.|Elige primero un paquete.|El turno está terminando.
El sello ya es legible.|No hay nada que corregir.
No quedan billetes exprés.|Escanea primero el sello borroso.
El sello es válido. Repara o envía el paquete.
Los sellos difieren. Devuelve el paquete.|Repara el embalaje antes de enviar.
Los destinos difieren. Corrige la etiqueta.|Envía antes el paquete con el recibo correspondiente.
Los paquetes refrigerados van por exprés.|Un paquete urgente no llegó a tiempo.
Se perdieron las tres marcas de confianza.|Se agotó el tiempo del turno.
Turno completado|Turno interrumpido|Matasellos {n}/3|No se guardó el progreso. Reintenta o revisa el almacenamiento.
Práctica sin premios de campaña.|Turno guardado.|Bloque de primer turno superado recogido.
Siguiente turno|Reintentar|Informe del turno|Ayuda|¿Salir del turno?
Vuelve a la lista. El correo pendiente se reiniciará.|Continuar|Repetir tutorial
Se detuvo el mostrador 3D. Reintenta la escena o vuelve a la lista.|En pausa
Usa el paquete o la acción resaltados.|Formación postal
Toca el paquete 1. El destino y el sello coinciden.|Envía el paquete por la ruta normal.
Toca el paquete 2. El destino difiere del registro.|Corrige la etiqueta para que coincida con el registro.
Envía el paquete corregido.|Toca el paquete 3. Los sellos no coinciden.
Devuelve el paquete. El sello incorrecto no se puede corregir.|Formación completa. Empieza tu turno.
Diamantes: {n}|Comprar|Cancelar|Usar|En uso|Aspecto permanente
{n} diamantes|No tienes diamantes suficientes.|Mostrador nocturno|Sello de ámbar|Mostrador de jade
Mostrador de cedro|Mostrador escarchado|Completa el turno {n} para desbloquearlo.|Cambia el acabado del mostrador y el sello de envío.
Guía del juego|Tu objetivo|En el mostrador|Rutas y comprobaciones|Cierre del turno|Juegos relacionados
Tramita todos los paquetes antes del cierre. Envía los que coinciden con el registro y devuelve los que tengan un sello inválido.
Elige un paquete pendiente y coteja su etiqueta con el registro. Escanea un sello ilegible. Con un sello válido, puedes corregir el destino o el embalaje.
El envío normal usa dos unidades de tiempo. El exprés usa una unidad y un billete. Revisa plazos, guarda billetes para el correo refrigerado y envía los recibos antes que sus paquetes asociados.
Un turno completo da un matasellos. Conserva la confianza para el segundo y termina con tiempo o un billete de sobra para el tercero. En un turno sin margen, un cierre perfecto también cuenta. Repite los turnos desbloqueados para mejorar tu marca.
¿Cuándo devuelvo un paquete?|Devuélvelo si el sello no coincide con el registro. Con un sello válido puedes reparar el embalaje o cambiar un destino incorrecto.
¿Necesito diamantes para terminar?|No. Los útiles del mostrador bastan para todos los turnos. Los diamantes compran aspectos permanentes.
`),e("pt-BR",`
Começar|Voltar|Turnos|Coleção de balcões|Turno {n}|Capítulo {n}
Correio do vale|Posto do cume|Bloqueado|Concluído|Disponível
Encomendas|Correio|Etiqueta|Registro postal
Tempo|Confiança|Bilhetes|Tempo {n}|1 bilhete
Enviado|Devolvido|Intacto|Danificado|Ilegível
Destino|Selo|Embalagem|Carvalho|Enseada|Pico
{n}/{total} processados|Restam {n}|Cadeia fria|Recibo {n}|Requer recibo {n}|Recibo {n} pronto
Selecionar|Escanear|Corrigir|Enviar|Expresso|Devolver
Selo lido. Compare os registros.|Encomenda corrigida. Confira a nova etiqueta.
Enviado pela rota comum.|Enviado por expresso com um bilhete.|Encomenda inválida devolvida.
Compare a etiqueta com o registro.|Escolha uma encomenda primeiro.|O turno está terminando.
O selo já está legível.|Nada precisa ser corrigido.
Não há bilhetes expressos.|Escaneie primeiro o selo ilegível.
O selo é válido. Corrija ou envie a encomenda.
Os selos não coincidem. Devolva a encomenda.|Repare a embalagem antes de enviar.
Os destinos não coincidem. Corrija a etiqueta.|Envie primeiro a encomenda do recibo correspondente.
Encomendas refrigeradas precisam da rota expressa.|Uma encomenda urgente perdeu o prazo.
As três marcas de confiança foram perdidas.|O tempo do turno acabou.
Turno concluído|Turno interrompido|Carimbos {n}/3|Não foi possível salvar. Tente novamente ou confira o armazenamento.
Treino sem recompensas da campanha.|Turno registrado.|Bloco de primeira conclusão recebido.
Próximo turno|Tentar de novo|Relatório do turno|Ajuda|Sair do turno?
Volte à lista de turnos. As encomendas pendentes serão reiniciadas.|Continuar|Refazer tutorial
O balcão 3D parou. Tente reabrir a cena ou volte aos turnos.|Em pausa
Use a encomenda ou ação destacada.|Treinamento no balcão
Toque na encomenda 1. O destino e o selo conferem.|Envie a encomenda pela rota comum.
Toque na encomenda 2. O destino difere do registro.|Corrija a etiqueta para corresponder ao registro.
Envie a encomenda corrigida.|Toque na encomenda 3. Os selos não conferem.
Devolva esta encomenda. O selo incorreto não pode ser corrigido.|Treinamento concluído. Seu turno começa agora.
Diamantes: {n}|Comprar|Cancelar|Usar|Em uso|Aparência permanente
{n} diamantes|Diamantes insuficientes.|Balcão noturno|Carimbo de âmbar|Balcão de jade
Balcão de cedro|Balcão de gelo|Conclua o turno {n} para liberar.|Muda o acabamento do balcão e o carimbo de envio.
Guia do jogo|Seu objetivo|No balcão|Rotas e conferências|Fim do turno|Jogos relacionados
Processe todas as encomendas antes do fim do turno. Envie as que conferem com o registro e devolva as de selo inválido.
Escolha uma encomenda pendente e compare a etiqueta com o registro. Escaneie selos ilegíveis. Com um selo válido, corrija o destino ou a embalagem danificada.
O envio comum custa duas unidades de tempo. O expresso custa uma unidade e um bilhete. Confira os prazos, reserve bilhetes para encomendas frias e envie os recibos antes das remessas associadas.
Conclua o turno para ganhar um carimbo. Mantenha a confiança para ganhar outro e termine com tempo ou um bilhete sobrando para ganhar o terceiro. Um turno sem folga também vale se for perfeito. Repita turnos disponíveis para melhorar o resultado.
Quando devo devolver uma encomenda?|Devolva quando o selo não conferir com o registro. Se ele for válido, corrija o destino ou a embalagem.
Preciso de diamantes para terminar?|Não. As ferramentas do balcão bastam em todos os turnos. Diamantes compram aparências permanentes.
`),e("fr",`
Jouer|Retour|Services|Collection du guichet|Service {n}|Chapitre {n}
Poste de la vallée|Relais du sommet|Verrouillé|Terminé|Prêt
Colis|Bureau de poste|Étiquette|Registre postal
Temps|Confiance|Tickets|Temps {n}|1 ticket
Expédié|Retourné|Intact|Abîmé|Illisible
Destination|Sceau|Emballage|Chêne|Crique|Sommet
{n}/{total} traités|Reste {n}|Chaîne du froid|Reçu {n}|Exige le reçu {n}|Reçu {n} prêt
Choisir|Scanner|Réparer|Expédier|Express|Retourner
Sceau lu. Comparez les deux documents.|Colis corrigé. Vérifiez la nouvelle étiquette.
Colis expédié par la voie ordinaire.|Expédié en express avec un ticket.|Colis invalide retourné.
Comparez l’étiquette au registre.|Choisissez d’abord un colis.|Le service se termine.
Le sceau est déjà lisible.|Il n’y a rien à corriger.
Il ne reste aucun ticket express.|Scannez d’abord le sceau flou.
Le sceau est valide. Réparez ou expédiez le colis.
Les sceaux diffèrent. Retournez le colis.|Réparez l’emballage avant l’expédition.
Les destinations diffèrent. Corrigez l’étiquette.|Expédiez d’abord le colis du reçu correspondant.
Le courrier réfrigéré doit prendre la voie express.|Un colis urgent a dépassé son délai.
Les trois marques de confiance ont été perdues.|Le temps du service est écoulé.
Service réussi|Service interrompu|Cachets {n}/3|Sauvegarde impossible. Réessayez ou vérifiez le stockage.
Entraînement sans récompense de campagne.|Service enregistré.|Bloc de première réussite obtenu.
Service suivant|Réessayer|Bilan du service|Aide|Quitter le service ?
Retour à la liste. Les colis en attente seront réinitialisés.|Continuer|Rejouer le tutoriel
Le guichet 3D s’est arrêté. Relancez la scène ou revenez à la liste.|En pause
Utilisez le colis ou le bouton en surbrillance.|Formation au guichet
Touchez le colis 1. Sa destination et son sceau concordent.|Expédiez ce colis par la voie ordinaire.
Touchez le colis 2. Sa destination diffère du registre.|Corrigez l’étiquette selon le registre.
Expédiez le colis corrigé.|Touchez le colis 3. Les sceaux diffèrent.
Retournez ce colis. On ne peut pas modifier un sceau non conforme.|Formation terminée. Le service commence.
Diamants : {n}|Acheter|Annuler|Utiliser|Utilisé|Apparence permanente
{n} diamants|Pas assez de diamants.|Guichet de nuit|Sceau d’ambre|Guichet de jade
Guichet de cèdre|Guichet givré|Réussissez le service {n} pour le débloquer.|Modifie la finition du guichet et le sceau d’expédition.
Guide du jeu|Votre objectif|Au guichet|Voies et contrôles|Fin du service|Jeux associés
Traitez tous les colis avant la fin du service. Expédiez ceux qui correspondent au registre et retournez ceux dont le sceau est invalide.
Choisissez un colis en attente et comparez son étiquette au registre. Scannez un sceau illisible. Avec un sceau valide, corrigez la destination ou réparez l’emballage.
La voie ordinaire coûte deux unités de temps. L’express coûte une unité et un ticket. Vérifiez les délais, gardez des tickets pour les colis réfrigérés et expédiez les reçus avant leurs colis associés.
Un service réussi donne un cachet. Gardez toute la confiance pour le deuxième, puis finissez avec du temps ou un ticket pour le troisième. Un service sans marge compte aussi s’il est parfait. Rejouez les services ouverts pour améliorer vos résultats.
Quand faut-il retourner un colis ?|Retournez-le si son sceau diffère du registre. Avec un sceau valide, vous pouvez corriger la destination ou réparer l’emballage.
Faut-il des diamants pour terminer ?|Non. Les outils du guichet suffisent pour tous les services. Les diamants achètent des apparences permanentes.
`),e("de",`
Spielen|Zurück|Schichten|Schalter-Sammlung|Schicht {n}|Kapitel {n}
Talpost|Gipfelstation|Gesperrt|Erledigt|Bereit
Pakete|Postamt|Paketetikett|Postbuch
Zeit|Vertrauen|Tickets|Zeit {n}|1 Ticket
Versandt|Retourniert|Intakt|Beschädigt|Unleserlich
Ziel|Siegel|Verpackung|Eiche|Bucht|Gipfel
{n}/{total} bearbeitet|Noch {n}|Kühlkette|Beleg {n}|Braucht Beleg {n}|Beleg {n} bereit
Auswählen|Scannen|Korrigieren|Versenden|Express|Retoure
Siegel gelesen. Vergleiche die Angaben.|Paket korrigiert. Prüfe das neue Etikett.
Paket per Standardweg versandt.|Expressversand mit einem Ticket.|Ungültiges Paket retourniert.
Vergleiche das Etikett mit dem Postbuch.|Wähle zuerst ein Paket.|Die Schicht endet.
Das Siegel ist bereits lesbar.|Es gibt nichts zu korrigieren.
Keine Express-Tickets übrig.|Scanne zuerst das unleserliche Siegel.
Das Siegel ist gültig. Korrigiere oder versende das Paket.
Die Siegel stimmen nicht überein. Schicke das Paket zurück.|Repariere vor dem Versand die Verpackung.
Die Ziele stimmen nicht überein. Korrigiere das Etikett.|Versende zuerst das Paket mit dem passenden Beleg.
Kühlpakete brauchen den Expressweg.|Ein Eilpaket hat die Frist verpasst.
Alle drei Vertrauensmarken sind verloren.|Die Schichtzeit ist abgelaufen.
Schicht geschafft|Schicht abgebrochen|Poststempel {n}/3|Speichern fehlgeschlagen. Versuche es erneut oder prüfe den Speicher.
Übung ohne Kampagnenbelohnung.|Schicht gespeichert.|Block für den ersten Abschluss erhalten.
Nächste Schicht|Erneut versuchen|Schichtbericht|Hilfe|Schicht verlassen?
Zurück zur Liste. Offene Sendungen werden zurückgesetzt.|Weiter|Tutorial wiederholen
Der 3D-Schalter ist stehen geblieben. Lade die Szene neu oder kehre zur Liste zurück.|Pausiert
Wähle das markierte Paket oder die markierte Aktion.|Schaltertraining
Wähle Paket 1. Ziel und Siegel stimmen überein.|Versende das passende Paket auf dem Standardweg.
Wähle Paket 2. Das Ziel weicht vom Postbuch ab.|Korrigiere das Etikett nach dem Postbuch.
Versende das korrigierte Paket.|Wähle Paket 3. Die Siegel stimmen nicht überein.
Schicke das Paket zurück. Ein falsches Siegel lässt sich nicht korrigieren.|Training abgeschlossen. Deine Schicht beginnt.
Diamanten: {n}|Kaufen|Abbrechen|Verwenden|Aktiv|Dauerhafte Optik
{n} Diamanten|Nicht genug Diamanten.|Nachtschalter|Bernsteinsiegel|Jadeschalter
Zedernschalter|Frostschalter|Schicht {n} abschließen zum Freischalten.|Ändert die Schalteroberfläche und das Versandsiegel.
Spielanleitung|Dein Ziel|Am Schalter|Versand und Kontrolle|Schichtende|Ähnliche Spiele
Bearbeite alle Pakete vor Schichtende. Versende die Pakete, die zum Postbuch passen, und schicke Sendungen mit ungültigem Siegel zurück.
Wähle ein offenes Paket und vergleiche Etikett und Postbuch. Scanne ein unleserliches Siegel. Ist das Siegel gültig, korrigiere das Ziel oder die Verpackung.
Standardversand kostet zwei Zeiteinheiten. Express kostet eine Einheit und ein Ticket. Beachte Fristen, spare Tickets für Kühlpakete und versende zuerst die zugehörigen Belege.
Eine fertige Schicht bringt einen Poststempel. Volles Vertrauen bringt den zweiten, freie Zeit oder ein restliches Ticket den dritten. Eine Schicht ohne Puffer zählt bei fehlerfreiem Abschluss ebenfalls. Wiederhole freigeschaltete Schichten für bessere Ergebnisse.
Wann soll ich ein Paket zurückschicken?|Wenn das Siegel nicht zum Postbuch passt. Mit gültigem Siegel kannst du das Ziel oder die beschädigte Verpackung korrigieren.
Brauche ich Diamanten zum Abschließen?|Nein. Die Schalterwerkzeuge reichen für alle Schichten. Diamanten kaufen dauerhafte Optik.
`),e("it",`
Inizia|Indietro|Turni|Collezione banconi|Turno {n}|Capitolo {n}
Posta della valle|Staffetta in vetta|Bloccato|Completato|Pronto
Pacchi|Ufficio postale|Etichetta|Registro postale
Tempo|Fiducia|Biglietti|Tempo {n}|1 biglietto
Spedito|Restituito|Integro|Danneggiato|Illeggibile
Destinazione|Sigillo|Imballo|Quercia|Baia|Vetta
{n}/{total} elaborati|Restano {n}|Catena del freddo|Ricevuta {n}|Serve ricevuta {n}|Ricevuta {n} pronta
Seleziona|Scansiona|Ripara|Spedisci|Espresso|Restituisci
Sigillo letto. Confronta i documenti.|Pacco corretto. Controlla la nuova etichetta.
Pacco spedito sulla rotta normale.|Spedito con un biglietto espresso.|Pacco non valido restituito.
Confronta l’etichetta con il registro.|Scegli prima un pacco.|Il turno sta finendo.
Il sigillo è già leggibile.|Non c’è nulla da correggere.
Non restano biglietti espressi.|Prima scansiona il sigillo illeggibile.
Il sigillo è valido. Ripara o spedisci il pacco.
I sigilli non coincidono. Restituisci il pacco.|Ripara l’imballo prima di spedire.
Le destinazioni non coincidono. Correggi l’etichetta.|Spedisci prima il pacco della ricevuta corrispondente.
I pacchi refrigerati viaggiano per espresso.|Un pacco urgente non è arrivato in tempo.
Hai perso tutti e tre i segni di fiducia.|Il tempo del turno è finito.
Turno completato|Turno interrotto|Timbri {n}/3|Impossibile salvare. Riprova o controlla lo spazio.
Pratica senza premi della campagna.|Turno registrato.|Blocco del primo completamento ottenuto.
Turno successivo|Riprova|Rapporto del turno|Aiuto|Lasciare il turno?
Torna all’elenco. I pacchi in attesa saranno ripristinati.|Continua|Ripeti il tutorial
Il bancone 3D si è fermato. Riprova la scena o torna ai turni.|In pausa
Usa il pacco o il pulsante evidenziato.|Addestramento al bancone
Tocca il pacco 1. Destinazione e sigillo coincidono.|Spedisci il pacco sulla rotta normale.
Tocca il pacco 2. La destinazione differisce dal registro.|Correggi l’etichetta secondo il registro.
Spedisci il pacco corretto.|Tocca il pacco 3. I sigilli non coincidono.
Restituisci il pacco. Un sigillo diverso non si può correggere.|Addestramento finito. Inizia il turno.
Diamanti: {n}|Compra|Annulla|Usa|In uso|Aspetto permanente
{n} diamanti|Diamanti insufficienti.|Bancone notturno|Sigillo d’ambra|Bancone di giada
Bancone di cedro|Bancone gelato|Completa il turno {n} per sbloccarlo.|Cambia la finitura del bancone e il sigillo di spedizione.
Guida al gioco|Il tuo obiettivo|Al bancone|Rotte e controlli|Fine del turno|Giochi correlati
Gestisci tutti i pacchi prima della fine del turno. Spedisci quelli in regola con il registro e restituisci quelli con sigillo non valido.
Scegli un pacco in attesa e confronta l’etichetta col registro. Scansiona un sigillo illeggibile. Se è valido puoi correggere la destinazione o riparare l’imballo.
La via normale usa due unità di tempo. L’espresso usa un’unità e un biglietto. Controlla le scadenze, riserva biglietti ai pacchi freddi e spedisci prima le relative ricevute.
Un turno completato vale un timbro. Conserva tutta la fiducia per il secondo e tempo o un biglietto per il terzo. Se non c’è margine, vale anche un turno perfetto. Rigioca i turni sbloccati per migliorare il risultato.
Quando devo restituire un pacco?|Quando il sigillo non coincide con il registro. Con un sigillo valido puoi correggere la destinazione o l’imballo.
Servono diamanti per finire?|No. Gli strumenti al bancone bastano per tutti i turni. I diamanti servono per gli aspetti permanenti.
`),e("ru",`
Играть|Назад|Смены|Коллекция стоек|Смена {n}|Глава {n}
Почта в долине|Перевалочный пункт|Закрыто|Пройдено|Готово
Посылки|Почта|Ярлык|Почтовый журнал
Время|Доверие|Билеты|Время {n}|1 билет
Отправлено|Возвращено|Целая|Повреждена|Не разобрать
Станция|Печать|Упаковка|Дуб|Бухта|Пик
Обработано {n}/{total}|Осталось {n}|Холодовая цепь|Квитанция {n}|Нужна квитанция {n}|Квитанция {n} готова
Выбрать|Скан|Исправить|Отправить|Экспресс|Возврат
Печать прочитана. Сверьте документы.|Посылка исправлена. Проверьте новый ярлык.
Посылка отправлена обычным путём.|Использован один билет на экспресс.|Недействительная посылка возвращена.
Сверьте ярлык с журналом.|Сначала выберите посылку.|Смена завершается.
Печать уже читается.|Исправлять нечего.
Билеты на экспресс закончились.|Сначала отсканируйте нечёткую печать.
Печать действительна. Исправьте или отправьте посылку.
Печати различаются. Верните посылку.|Почините упаковку перед отправкой.
Станции различаются. Исправьте ярлык.|Сначала отправьте посылку с нужной квитанцией.
Охлаждённым посылкам нужен экспресс.|Срочная посылка опоздала.
Все три знака доверия потеряны.|Время смены истекло.
Смена пройдена|Смена прервана|Штемпели {n}/3|Не удалось сохранить прогресс. Повторите или проверьте хранилище.
Тренировка без наград кампании.|Смена записана.|Получен блок за первое прохождение.
Следующая смена|Повторить|Отчёт о смене|Помощь|Выйти из смены?
Возврат к списку. Незавершённые посылки сбросятся.|Продолжить|Повторить обучение
Стойка 3D остановилась. Перезапустите сцену или вернитесь к списку.|Пауза
Выберите подсвеченную посылку или действие.|Обучение у стойки
Выберите посылку 1. Станция и печать совпадают.|Отправьте посылку обычным путём.
Выберите посылку 2. Станция отличается от записи в журнале.|Исправьте ярлык по журналу.
Отправьте исправленную посылку.|Выберите посылку 3. Печати не совпадают.
Верните посылку. Неверную печать исправить нельзя.|Обучение завершено. Начинается смена.
Алмазы: {n}|Купить|Отмена|Использовать|Выбрано|Постоянный облик
Алмазы: {n}|Недостаточно алмазов.|Ночная стойка|Янтарная печать|Нефритовая стойка
Кедровая стойка|Морозная стойка|Откроется после смены {n}.|Меняет отделку стойки и печать отправки.
Руководство|Ваша цель|У стойки|Маршруты и проверка|Конец смены|Похожие игры
Обработайте все посылки до конца смены. Отправляйте подходящие по журналу и возвращайте посылки с неверной печатью.
Выберите посылку и сверьте ярлык с журналом. Отсканируйте нечёткую печать. Если она действительна, можно исправить станцию или упаковку.
Обычный маршрут стоит две единицы времени, экспресс — одну и билет. Проверяйте сроки, берегите билеты для охлаждённых посылок и отправляйте квитанции раньше связанных посылок.
Успешная смена даёт штемпель. Полное доверие даёт второй, запас времени или билета — третий. В смене без запаса подойдёт и безошибочное завершение. Проходите открытые смены снова для лучшего результата.
Когда возвращать посылку?|Если печать не совпала с журналом. При верной печати можно исправить станцию или упаковку.
Нужны ли алмазы для прохождения?|Нет. Инструментов на стойке достаточно для всех смен. Алмазы нужны для покупки постоянных обликов.
`),e("hi",`
शुरू करें|वापस|पालियाँ|काउंटर संग्रह|पाली {n}|अध्याय {n}
घाटी डाकघर|शिखर रिले|बंद|पूरा|तैयार
पार्सल|डाकघर|पार्सल का लेबल|डाक रजिस्टर
समय|भरोसा|टिकट|समय {n}|1 टिकट
भेजा गया|लौटाया गया|ठीक|क्षतिग्रस्त|अपठनीय
स्टेशन|मुहर|पैकिंग|बलूत|खाड़ी|शिखर
{n}/{total} निपटाए|{n} समय बचा|शीत शृंखला|रसीद {n}|रसीद {n} चाहिए|रसीद {n} तैयार
चुनें|स्कैन|सुधारें|भेजें|त्वरित|लौटाएँ
मुहर पढ़ ली। दोनों रिकॉर्ड मिलाएँ।|पार्सल सुधरा। नया लेबल देखें।
पार्सल सामान्य मार्ग से भेजा।|त्वरित डाक भेजी। एक टिकट लगा।|अमान्य पार्सल लौटा दिया।
लेबल को रजिस्टर से मिलाएँ।|पहले पार्सल चुनें।|पाली समाप्त हो रही है।
मुहर पहले से साफ है।|कुछ सुधारने की जरूरत नहीं।
त्वरित टिकट नहीं बचे।|पहले धुँधली मुहर स्कैन करें।
मुहर सही है। पार्सल सुधारें या भेजें।
मुहरें अलग हैं। पार्सल लौटाएँ।|भेजने से पहले पैकिंग ठीक करें।
स्टेशन अलग हैं। लेबल सुधारें।|पहले संबंधित रसीद वाला पार्सल भेजें।
ठंडी डाक के लिए त्वरित मार्ग चाहिए।|ज़रूरी पार्सल का समय निकल गया।
भरोसे के तीनों निशान खो गए।|पाली का समय खत्म हो गया।
पाली पूरी|पाली रुकी|डाक मुहरें {n}/3|प्रगति सेव नहीं हुई। फिर कोशिश करें या स्टोरेज जाँचें।
अभ्यास है। अभियान का इनाम नहीं मिलेगा।|पाली दर्ज हुई।|पहली जीत का ब्लॉक मिला।
अगली पाली|फिर कोशिश|पाली की रिपोर्ट|मदद|पाली छोड़ें?
पाली की सूची पर लौटें। अधूरी डाक रीसेट होगी।|जारी रखें|प्रशिक्षण फिर करें
3D काउंटर रुक गया। दृश्य फिर खोलें या सूची पर लौटें।|रुका हुआ
चमकता पार्सल या बटन चुनें।|काउंटर प्रशिक्षण
पार्सल 1 चुनें। स्टेशन और मुहर मेल खाते हैं।|मेल खाते पार्सल को सामान्य मार्ग से भेजें।
पार्सल 2 चुनें। इसका स्टेशन रजिस्टर से अलग है।|लेबल को रजिस्टर के अनुसार सुधारें।
सुधरा हुआ पार्सल भेजें।|पार्सल 3 चुनें। मुहरें अलग हैं।
यह पार्सल लौटाएँ। गलत मुहर नहीं सुधर सकती।|प्रशिक्षण पूरा। आपकी पाली शुरू हुई।
हीरे: {n}|खरीदें|रद्द करें|लगाएँ|लगा हुआ|स्थायी रूप
{n} हीरे|हीरे कम हैं।|रात का काउंटर|अंबर की मुहर|जेड काउंटर
देवदार काउंटर|पाले का काउंटर|खोलने के लिए पाली {n} पूरी करें।|काउंटर की सजावट और भेजने की मुहर बदलती है।
खेल की मार्गदर्शिका|आपका लक्ष्य|काउंटर पर|मार्ग और जाँच|पाली का अंत|मिलते-जुलते खेल
पाली खत्म होने से पहले सभी पार्सल निपटाएँ। रजिस्टर से मेल खाने वाले पार्सल भेजें और गलत मुहर वाले लौटाएँ।
कोई लंबित पार्सल चुनें और उसका लेबल रजिस्टर से मिलाएँ। अपठनीय मुहर स्कैन करें। मुहर सही हो तो स्टेशन या क्षतिग्रस्त पैकिंग सुधारें।
सामान्य डाक में समय की दो इकाइयाँ लगती हैं। त्वरित डाक में एक इकाई और एक टिकट लगता है। समय-सीमा देखें, ठंडी डाक के लिए टिकट बचाएँ और जुड़े पार्सल से पहले रसीद भेजें।
पाली पूरी करने पर एक डाक मुहर मिलती है। पूरा भरोसा बचाने पर दूसरी और समय या टिकट बचाने पर तीसरी मिलेगी। बिना अतिरिक्त समय वाली पाली में बेदाग़ काम भी तीसरी मुहर देता है। रिकॉर्ड सुधारने के लिए खुली पालियाँ फिर खेलें।
पार्सल कब लौटाना चाहिए?|जब उसकी मुहर रजिस्टर से मेल न खाए। मुहर सही हो तो स्टेशन या पैकिंग सुधारी जा सकती है।
क्या पूरा करने के लिए हीरे चाहिए?|नहीं। काउंटर के औज़ार हर पाली के लिए काफी हैं। हीरों से स्थायी रूप खरीद सकते हैं।
`),e("ar",`
ابدأ|رجوع|المناوبات|مجموعة المناضد|المناوبة {n}|الفصل {n}
بريد الوادي|محطة القمة|مغلق|مكتمل|جاهز
الطرود|مكتب البريد|ملصق الطرد|سجل البريد
الوقت|الثقة|التذاكر|الوقت {n}|تذكرة واحدة
أُرسل|أُعيد|سليم|تالف|غير مقروء
الوجهة|الختم|الغلاف|البلوط|الخليج|القمة
عولج {n}/{total}|المتبقي {n}|سلسلة التبريد|الإيصال {n}|يتطلب الإيصال {n}|الإيصال {n} جاهز
اختر|امسح|أصلح|أرسل|عاجل|أعد
قُرئ الختم. قارن السجلين.|صُحح الطرد. افحص الملصق الجديد.
أُرسل الطرد عبر المسار العادي.|أُرسل بالعاجل. استُخدمت تذكرة واحدة.|أُعيد الطرد غير الصالح.
قارن الملصق بالسجل.|اختر طردًا أولًا.|توشك المناوبة على الانتهاء.
الختم مقروء بالفعل.|لا شيء يحتاج إلى إصلاح.
نفدت تذاكر البريد العاجل.|امسح الختم الباهت أولًا.
الختم صالح. أصلح الطرد أو أرسله.
الختمان مختلفان. أعد الطرد.|أصلح الغلاف قبل الإرسال.
الوجهتان مختلفتان. صحّح الملصق.|أرسل أولًا طرد الإيصال المطابق.
تحتاج الطرود المبردة إلى المسار العاجل.|فات موعد طرد مستعجل.
فقدت علامات الثقة الثلاث.|انتهى وقت المناوبة.
اكتملت المناوبة|توقفت المناوبة|الأختام {n}/3|تعذّر حفظ التقدم. أعد المحاولة أو افحص التخزين.
تدريب بلا مكافآت للحملة.|سُجلت المناوبة.|حصلت على مكعب الإنجاز الأول.
المناوبة التالية|أعد المحاولة|تقرير المناوبة|مساعدة|مغادرة المناوبة؟
عُد إلى القائمة. ستُعاد الطرود المعلقة إلى حالتها الأولى.|تابع|أعد التدريب
توقفت المنضدة الثلاثية الأبعاد. أعد فتح المشهد أو عُد إلى القائمة.|متوقف مؤقتًا
استخدم الطرد أو الزر المميز.|تدريب المنضدة
اضغط على الطرد 1. الوجهة والختم متطابقان.|أرسل الطرد المطابق عبر المسار العادي.
اضغط على الطرد 2. وجهته تختلف عن السجل.|صحّح الملصق ليطابق السجل.
أرسل الطرد المصحح.|اضغط على الطرد 3. الختمان غير متطابقين.
أعد هذا الطرد. لا يمكن تصحيح ختم غير مطابق.|اكتمل التدريب. تبدأ مناوبتك الآن.
الألماس: {n}|اشترِ|إلغاء|استخدم|قيد الاستخدام|مظهر دائم
{n} ألماسة|الألماس غير كافٍ.|منضدة الليل|ختم الكهرمان|منضدة اليشم
منضدة الأرز|منضدة الصقيع|أكمل المناوبة {n} لفتحه.|يغيّر لون المنضدة وختم الإرسال.
دليل اللعبة|هدفك|عند المنضدة|المسارات والفحص|نهاية المناوبة|ألعاب مشابهة
عالج كل الطرود قبل انتهاء المناوبة. أرسل الطرود المطابقة للسجل وأعد ما يحمل ختمًا غير صالح.
اختر طردًا معلقًا وقارن ملصقه بالسجل. امسح الختم غير المقروء. إن كان الختم صالحًا فأصلح الوجهة أو الغلاف التالف.
يستهلك المسار العادي وحدتين من الوقت. يستهلك العاجل وحدة وتذكرة. افحص المواعيد وادخر التذاكر للطرود المبردة وأرسل الإيصالات قبل الطرود المرتبطة.
تحصل على ختم عند إكمال المناوبة، وثانٍ إن حافظت على الثقة، وثالث إن بقي وقت أو تذكرة. المناوبة بلا هامش تمنح الختم الثالث أيضًا عند إكمالها بلا أخطاء. أعد المناوبات المفتوحة لتحسين سجلك.
متى أعيد الطرد؟|أعده إذا لم يطابق ختمه السجل. إن صح الختم يمكنك تصحيح الوجهة أو إصلاح الغلاف.
هل أحتاج إلى الألماس للإنهاء؟|لا. تكفي أدوات المنضدة لإكمال جميع المناوبات. يتيح الألماس شراء مظاهر دائمة.
`),Object.keys(c).length!==Object.keys(ROUTES).length-1)throw new Error("Missing Wingseal translations");
