// Ordered by companions.js and campaign.js; abilities describe actual combat.
const rows={
 'zh-Hant':[
 '一次帶一隻。打怪 40% 掉落夥伴；首領必掉。重複收集碎片升階。',
 '群體破盾|治療護罩|冰霜緩速|烈焰灼燒',
 '削除全體 35 護盾，造成 90% 斧傷。|恢復 14% 生命，獲得 22 護罩並淨化。|全體 65% 斧傷，敵人行動減速 50%，持續 3.5 秒。|全體 115% 斧傷，再灼燒 4 秒。',
 '第八斧 220% 重擊，掃中其他敵人。|每斧造成 160% 盾傷；重擊延後敵人出招 1.2 秒。|每第三斧連鎖閃電，追擊另一敵人。|擊敗敵人時清除灼燒、裂痕與冰緩。|爆擊額外回復 18 能量。|每第五次敵人攻擊閃避並免疫附帶狀態。|將所受傷害的 35% 反彈給攻擊者。|重擊後的下一斧額外回復 5 能量。|夥伴施法時獲得 12 護罩。|擊敗後自動揮斧加速 25%，持續 2 秒。|免疫荊棘與樹根的裂痕。|栗栗技能額外削除 8 護盾。|任何夥伴施法時淨化並恢復 6% 生命。|擊敗非召喚敵人回復 12 能量。|每第三斧造成 150% 傷害。',
 '護罩|灼燒|冰緩|緩速|閃避！|護罩吸收',
 '栗栗|苔苔|霜羽|燼燼'],
 en:[
 'Bring one ally. Monsters drop allies at 40%; bosses always drop one. Duplicates become upgrade shards.',
 'Shatter|Shelter|Frost|Flame',
 'Strip 35 shield from all foes; deal 90% axe damage.|Heal 14% HP, gain 22 barrier and cleanse.|Deal 65% axe damage to all; slow actions 50% for 3.5s.|Deal 115% axe damage to all, then burn for 4s.',
 'Every eighth swing: 220% heavy hit and a sweep.|160% shield damage; heavy hits delay attacks 1.2s.|Every third swing chains lightning to another foe.|Kills cleanse burn, cracks and chill.|Critical hits restore 18 extra energy.|Dodge every fifth enemy attack and its status.|Return 35% of damage taken to the attacker.|After a heavy hit, the next swing gains 5 energy.|Ally skills grant 12 barrier.|Kills speed up auto attacks 25% for 2s.|Immune to thorn and root cracks.|Nibs strips 8 extra shield.|Any ally skill cleanses and heals 6% HP.|Non-summon kills restore 12 energy.|Every third swing deals 150% damage.',
 'Barrier|Burn|Chill|Slowed|Dodge!|Absorbed',
 'Nibs|Moss|Frostwing|Ember'],
 'zh-Hans':[
 '一次带一只。打怪 40% 掉落伙伴；首领必掉。重复收集碎片升阶。',
 '群体破盾|治疗护罩|冰霜缓速|烈焰灼烧',
 '削除全体 35 护盾，造成 90% 斧伤。|恢复 14% 生命，获得 22 护罩并净化。|全体 65% 斧伤，敌人行动减速 50%，持续 3.5 秒。|全体 115% 斧伤，再灼烧 4 秒。',
 '第八斧 220% 重击，扫中其他敌人。|每斧 160% 盾伤；重击延后敌人出招 1.2 秒。|每第三斧连锁闪电，追击另一敌人。|击败敌人时清除灼烧、裂痕与冰缓。|暴击额外恢复 18 能量。|每第五次敌人攻击闪避并免疫附带状态。|将所受伤害的 35% 反弹给攻击者。|重击后的下一斧额外恢复 5 能量。|伙伴施法时获得 12 护罩。|击败后自动挥斧加速 25%，持续 2 秒。|免疫荆棘与树根的裂痕。|栗栗技能额外削除 8 护盾。|任意伙伴施法时净化并恢复 6% 生命。|击败非召唤敌人恢复 12 能量。|每第三斧造成 150% 伤害。',
 '护罩|灼烧|冰缓|缓速|闪避！|护罩吸收','栗栗|苔苔|霜羽|烬烬'],
 ja:[
 '同行は1匹。敵は40%、ボスは必ず仲間をドロップ。重複は強化のかけらになります。','盾破壊|守り|氷霜|炎',
 '全敵の盾を35削り、斧の90%ダメージ。|HP14%回復、バリア22と状態浄化。|全敵に斧の65%。行動を3.5秒間50%減速。|全敵に斧の115%、さらに4秒間燃焼。',
 '8撃ごとに220%の強打と薙ぎ払い。|盾ダメージ160%。強打で敵の攻撃を1.2秒遅延。|3撃ごとに別の敵へ連鎖雷撃。|撃破時に燃焼・亀裂・冷気を解除。|会心でエネルギーを追加18回復。|敵の5回目の攻撃と状態付与を回避。|受けたダメージの35%を反射。|強打後の次の一撃でエネルギー+5。|仲間の技でバリア12を獲得。|撃破後2秒間、自動攻撃が25%加速。|棘と根の亀裂を無効化。|ニブスの盾削り+8。|仲間の技で状態解除とHP6%回復。|召喚以外の敵を倒すとエネルギー12回復。|3撃ごとに150%ダメージ。',
 'バリア|燃焼|冷気|減速|回避！|吸収','ニブス|モス|フロスト|エンバー'],
 ko:[
 '한 마리만 동행합니다. 일반 적 40%, 보스 100% 확률로 획득합니다. 중복은 강화 조각이 됩니다.','방패 파괴|보호|서리|불꽃',
 '모든 적 방패 35 제거, 도끼 피해 90%.|체력 14% 회복, 보호막 22와 정화.|모든 적에 도끼 피해 65%, 3.5초간 행동 50% 감속.|모든 적에 도끼 피해 115%, 4초간 화상.',
 '8번째 공격은 220% 강타와 휩쓸기.|방패 피해 160%. 강타는 적 공격을 1.2초 지연.|3번째 공격마다 다른 적에 연쇄 번개.|처치 시 화상, 균열, 냉기 해제.|치명타 시 에너지 추가 18 회복.|적의 5번째 공격과 상태 효과 회피.|받은 피해의 35%를 공격자에게 반사.|강타 다음 공격은 에너지 5 추가.|동료 기술 사용 시 보호막 12.|처치 후 2초간 자동 공격 25% 가속.|가시와 뿌리의 균열에 면역.|닙스의 방패 제거량 +8.|모든 동료 기술에 정화와 체력 6% 회복.|소환수 외 적 처치 시 에너지 12 회복.|3번째 공격마다 피해 150%.',
 '보호막|화상|냉기|감속|회피!|흡수','닙스|모스|프로스트|엠버'],
 es:[
 'Lleva un aliado. Probabilidad: enemigos 40%, jefes 100%. Los duplicados dan fragmentos de mejora.','Ruptura|Refugio|Escarcha|Llama',
 'Quita 35 de escudo a todos; daño de hacha del 90%.|Cura 14% de vida, barrera de 22 y purifica.|Daño del 65% a todos; ralentiza acciones 50% durante 3,5 s.|Daño del 115% a todos y quemadura de 4 s.',
 'Cada octavo golpe: ataque del 220% y barrido.|Daño a escudos del 160%; golpe fuerte retrasa ataques 1,2 s.|Cada tercer golpe lanza un rayo a otro enemigo.|Las bajas eliminan quemadura, grietas y frío.|Los críticos recuperan 18 de energía adicional.|Esquiva cada quinto ataque enemigo y su estado.|Devuelve al atacante 35% del daño recibido.|Tras un golpe fuerte, el siguiente da 5 de energía extra.|Las habilidades del aliado dan 12 de barrera.|Las bajas aceleran el autoataque 25% durante 2 s.|Inmune a grietas de espinas y raíces.|Nibs quita 8 de escudo adicionales.|Todo aliado purifica y cura 6% de vida al actuar.|Las bajas no invocadas dan 12 de energía.|Cada tercer golpe causa 150% de daño.',
 'Barrera|Quemadura|Frío|Lento|¡Esquiva!|Absorbido','Nibs|Musgo|Escarcha|Ascua'],
 'pt-BR':[
 'Leve um aliado. Chance de obter: monstros 40%, chefes 100%. Repetidos viram fragmentos de melhoria.','Ruptura|Abrigo|Geada|Chama',
 'Remove 35 de escudo de todos; dano do machado de 90%.|Cura 14% de vida, barreira de 22 e purifica.|Dano de 65% em todos; ações 50% mais lentas por 3,5 s.|Dano de 115% em todos e queimadura por 4 s.',
 'Cada oitavo golpe: ataque de 220% e varredura.|Dano aos escudos de 160%; golpe forte atrasa ataques em 1,2 s.|Cada terceiro golpe encadeia raio em outro inimigo.|Abates removem queimadura, rachaduras e frio.|Críticos recuperam 18 de energia extra.|Esquiva cada quinto ataque inimigo e seu efeito.|Devolve 35% do dano recebido ao atacante.|Após um golpe forte, o próximo dá 5 de energia extra.|Habilidades do aliado dão 12 de barreira.|Abates aceleram ataques automáticos 25% por 2 s.|Imune a rachaduras de espinhos e raízes.|Nibs remove mais 8 de escudo.|Toda habilidade aliada purifica e cura 6% de vida.|Abates não invocados dão 12 de energia.|Cada terceiro golpe causa 150% de dano.',
 'Barreira|Queimadura|Frio|Lento|Esquiva!|Absorvido','Nibs|Musgo|Geada|Brasa'],
 fr:[
 'Un seul allié. Butin : monstres 40 %, boss 100 %. Les doublons donnent des fragments d’amélioration.','Fracture|Abri|Givre|Flamme',
 'Retire 35 de bouclier à tous ; dégâts de hache à 90 %.|Soigne 14 % de vie, donne 22 de barrière et purifie.|65 % de dégâts à tous ; actions ralenties de 50 % pendant 3,5 s.|115 % de dégâts à tous, puis brûlure pendant 4 s.',
 'Tous les 8 coups : frappe à 220 % et balayage.|160 % de dégâts aux boucliers ; coup fort retarde de 1,2 s.|Chaque 3e coup lance un éclair sur un autre ennemi.|Les éliminations dissipent brûlure, fissures et froid.|Les critiques rendent 18 d’énergie de plus.|Esquive chaque 5e attaque ennemie et son effet.|Renvoie 35 % des dégâts reçus à l’attaquant.|Après un coup fort, le suivant donne 5 d’énergie de plus.|Les talents alliés donnent 12 de barrière.|Les éliminations accélèrent l’auto de 25 % pendant 2 s.|Immunité aux fissures des épines et racines.|Nibs retire 8 de bouclier de plus.|Chaque talent allié purifie et soigne 6 % de vie.|Éliminer un ennemi non invoqué rend 12 d’énergie.|Chaque 3e coup inflige 150 % de dégâts.',
 'Barrière|Brûlure|Froid|Ralenti|Esquive !|Absorbé','Nibs|Mousse|Givre|Braise'],
 de:[
 'Ein Begleiter. Fundchance: Monster 40 %, Bosse 100 %. Doppelte Funde geben Aufwertungssplitter.','Schildbruch|Schutz|Frost|Flamme',
 'Entfernt 35 Schild bei allen; 90 % Axtschaden.|Heilt 14 % LP, gibt 22 Barriere und reinigt.|65 % Schaden an allen; Aktionen 3,5 s lang 50 % langsamer.|115 % Schaden an allen, danach 4 s Brennen.',
 'Jeder achte Hieb: 220 % Schwerschlag und Rundschlag.|160 % Schildschaden; Schwerschlag verzögert Angriffe 1,2 s.|Jeder dritte Hieb leitet Blitz zu einem anderen Gegner.|Siege reinigen Brennen, Risse und Kälte.|Kritische Treffer geben 18 zusätzliche Energie.|Jedem fünften Feindangriff samt Zustand ausweichen.|35 % des erlittenen Schadens zurückwerfen.|Nach Schwerschlag gibt der nächste Hieb 5 Extraenergie.|Begleitertalente geben 12 Barriere.|Siege beschleunigen Autoangriffe 2 s lang um 25 %.|Immun gegen Dornen- und Wurzelrisse.|Nibs entfernt 8 zusätzliche Schildpunkte.|Jedes Begleitertalent reinigt und heilt 6 % LP.|Nicht beschworene Gegner geben bei Sieg 12 Energie.|Jeder dritte Hieb verursacht 150 % Schaden.',
 'Barriere|Brennen|Kälte|Verlangsamt|Ausgewichen!|Absorbiert','Nibs|Moos|Frostflügel|Glut'],
 it:[
 'Porta un alleato. Probabilità: mostri 40%, boss 100%. I duplicati danno frammenti per migliorare.','Frattura|Riparo|Gelo|Fiamma',
 'Rimuove 35 scudo a tutti; danni ascia al 90%.|Cura 14% vita, barriera 22 e purifica.|Danni al 65% a tutti; azioni rallentate del 50% per 3,5 s.|Danni al 115% a tutti e bruciatura per 4 s.',
 'Ogni ottavo colpo: attacco al 220% e spazzata.|Danni agli scudi al 160%; colpo forte ritarda attacchi di 1,2 s.|Ogni terzo colpo lancia un fulmine a un altro nemico.|Le uccisioni rimuovono bruciature, crepe e gelo.|I critici danno 18 energia extra.|Schiva ogni quinto attacco nemico e il suo stato.|Riflette il 35% dei danni subiti sull’attaccante.|Dopo un colpo forte, il successivo dà 5 energia extra.|Le abilità alleate danno 12 barriera.|Le uccisioni accelerano l’auto del 25% per 2 s.|Immune a crepe da spine e radici.|Nibs rimuove 8 scudo extra.|Ogni abilità alleata purifica e cura 6% vita.|Nemici non evocati danno 12 energia alla morte.|Ogni terzo colpo infligge 150% danni.',
 'Barriera|Bruciatura|Gelo|Rallentato|Schivata!|Assorbito','Nibs|Muschio|Alagelo|Brace'],
 ru:[
 'Берите одного спутника. Шанс выпадения: монстры 40%, боссы 100%. Повторы дают осколки улучшения.','Раскол|Укрытие|Мороз|Пламя',
 'Снимает 35 щита у всех; 90% урона топора.|Лечит 14% здоровья, даёт барьер 22 и очищение.|65% урона всем; действия медленнее на 50% на 3,5 с.|115% урона всем, затем горение 4 с.',
 'Каждый восьмой удар: 220% урона и взмах по всем.|160% урона щитам; сильный удар задерживает атаку на 1,2 с.|Каждый третий удар бьёт молнией другого врага.|Победы снимают горение, трещины и холод.|Критические удары дают ещё 18 энергии.|Уклонение от каждой пятой атаки и её эффекта.|Возвращает нападающему 35% полученного урона.|После сильного удара следующий даёт ещё 5 энергии.|Умение спутника даёт 12 барьера.|Победы ускоряют автоатаки на 25% на 2 с.|Иммунитет к трещинам от шипов и корней.|Нибс снимает ещё 8 щита.|Любое умение спутника очищает и лечит 6% здоровья.|Победы над непризванными врагами дают 12 энергии.|Каждый третий удар наносит 150% урона.',
 'Барьер|Горение|Холод|Замедлен|Уклонение!|Поглощено','Нибс|Мох|Иней|Уголёк'],
 hi:[
 'एक साथी साथ लें। राक्षसों से 40%, बॉस से 100% संभावना। दोबारा मिलने पर उन्नयन के टुकड़े मिलते हैं।','ढाल तोड़|आश्रय|पाला|ज्वाला',
 'सबकी ढाल 35 घटाए; कुल्हाड़ी का 90% नुकसान।|14% जीवन बहाल, 22 सुरक्षा और शुद्धि।|सबको 65% नुकसान; 3.5 सेकंड तक चाल 50% धीमी।|सबको 115% नुकसान, फिर 4 सेकंड जलन।',
 'हर आठवाँ वार: 220% भारी प्रहार और व्यापक वार।|ढाल पर 160% नुकसान; भारी वार से हमला 1.2 सेकंड देर।|हर तीसरा वार दूसरे शत्रु पर बिजली भेजता है।|वध से जलन, दरार और ठंड हटती है।|घातक वार से 18 अतिरिक्त ऊर्जा।|हर पाँचवाँ शत्रु हमला और उसका प्रभाव चकमा।|मिले नुकसान का 35% हमलावर को वापस।|भारी वार के बाद अगला वार 5 अतिरिक्त ऊर्जा देता है।|साथी कौशल से 12 सुरक्षा।|वध के बाद 2 सेकंड ऑटो वार 25% तेज।|काँटों और जड़ों की दरार से प्रतिरक्षा।|निब्स 8 अतिरिक्त ढाल हटाता है।|हर साथी कौशल शुद्धि और 6% जीवन देता है।|गैर-बुलाए शत्रु के वध से 12 ऊर्जा।|हर तीसरे वार पर 150% नुकसान।',
 'सुरक्षा|जलन|ठंड|धीमा|चकमा!|अवशोषित','निब्स|मॉस|फ्रॉस्ट|एम्बर'],
 ar:[
 'اصطحب رفيقًا واحدًا. فرصة الحصول: الوحوش 40% والزعماء 100%. النسخ المكررة تمنح شظايا للترقية.','تحطيم|مأوى|صقيع|لهب',
 'يزيل 35 من درع الجميع ويسبب 90% من ضرر الفأس.|يشفي 14% من الصحة ويمنح حاجزًا 22 ويطهر.|ضرر 65% للجميع ويبطئ الأفعال 50% لمدة 3.5 ثوانٍ.|ضرر 115% للجميع ثم حرق لمدة 4 ثوانٍ.',
 'كل ضربة ثامنة: ضربة قوية 220% ومسح جماعي.|ضرر الدروع 160%؛ الضربة القوية تؤخر الهجوم 1.2 ثانية.|كل ضربة ثالثة ترسل برقًا إلى عدو آخر.|القضاء يزيل الحرق والتشققات والبرد.|الضربات الحرجة تعيد 18 طاقة إضافية.|تفادَ كل هجوم خامس وتأثيره.|يعكس 35% من الضرر المتلقى إلى المهاجم.|بعد ضربة قوية يمنح الهجوم التالي 5 طاقة إضافية.|مهارات الرفيق تمنح حاجزًا 12.|القضاء يسرع الهجوم التلقائي 25% لثانيتين.|مناعة لتشققات الأشواك والجذور.|نيبس يزيل 8 درع إضافية.|كل مهارة رفيق تطهر وتشفي 6% من الصحة.|القضاء على عدو غير مستدعى يعيد 12 طاقة.|كل ضربة ثالثة تسبب ضررًا 150%.',
 'حاجز|حرق|برد|بطيء|تفادٍ!|امتصاص','نيبس|موس|فروست|إمبر']
};
export const collectionCopy=Object.fromEntries(Object.entries(rows).map(([locale,[rosterHint,skills,descriptions,abilities,status,names]])=>[locale,{rosterHint,skills:skills.split('|'),descriptions:descriptions.split('|'),abilities:abilities.split('|'),status:status.split('|'),names:names.split('|')} ]));
