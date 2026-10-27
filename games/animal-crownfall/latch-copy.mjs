// Draft chapter copy; requires native-speaker and child/accessibility review.
export const LATCH_COPY={
 en:['Paired landing','Remove the key-marked support before its paired lock.','Remove the key support first.','Key support','Locked support'],
 'zh-Hant':['成對支撐','先移除鑰匙標記的支撐，再移除配對的鎖。','請先移除鑰匙支撐。','鑰匙支撐','鎖定支撐'],
 'zh-Hans':['成对支撑','先移除钥匙标记的支撑，再移除配对的锁。','请先移除钥匙支撑。','钥匙支撑','锁定支撑'],
 ja:['対の足場','鍵の印の足場を先に消すと、対の錠を消せます。','先に鍵の足場を消しましょう。','鍵の足場','錠の足場'],
 ko:['짝이 된 발판','열쇠 표시 발판을 먼저 없애야 짝인 잠금을 없앨 수 있어요.','열쇠 발판을 먼저 없애세요.','열쇠 발판','잠긴 발판'],
 es:['Apoyos emparejados','Quita primero el apoyo con la llave y luego su cerradura.','Quita primero el apoyo de la llave.','Apoyo de llave','Apoyo bloqueado'],
 'pt-BR':['Apoios pareados','Remova primeiro o apoio com a chave e depois a trava correspondente.','Remova primeiro o apoio da chave.','Apoio da chave','Apoio bloqueado'],
 fr:['Supports liés','Retirez le support marqué de la clé avant son verrou associé.','Retirez d’abord le support de la clé.','Support de clé','Support verrouillé'],
 de:['Gekoppelte Stützen','Entferne erst die Schlüsselstütze, dann die zugehörige Sperre.','Entferne zuerst die Schlüsselstütze.','Schlüsselstütze','Gesperrte Stütze'],
 it:['Supporti abbinati','Rimuovi prima il supporto con la chiave, poi il blocco abbinato.','Rimuovi prima il supporto della chiave.','Supporto chiave','Supporto bloccato'],
 ru:['Парные опоры','Сначала уберите опору с ключом, затем связанную с ней запертую опору.','Сначала уберите опору с ключом.','Опора с ключом','Запертая опора'],
 hi:['जुड़े सहारे','पहले चाबी वाला सहारा हटाएँ, फिर उससे जुड़ा ताला हटाएँ।','पहले चाबी वाला सहारा हटाएँ।','चाबी वाला सहारा','बंद सहारा'],
 ar:['دعامتان متصلتان','أزل دعامة المفتاح أولاً، ثم أزل القفل المرتبط بها.','أزل دعامة المفتاح أولاً.','دعامة المفتاح','دعامة مقفلة']
};
const UNLOCKED={en:'Unlocked support','zh-Hant':'已解鎖支撐','zh-Hans':'已解锁支撑',ja:'解錠された足場',ko:'잠금이 풀린 발판',es:'Apoyo desbloqueado','pt-BR':'Apoio desbloqueado',fr:'Support déverrouillé',de:'Entsperrte Stütze',it:'Supporto sbloccato',ru:'Открытая опора',hi:'खुला सहारा',ar:'دعامة مفتوحة'};
for(const [locale,value] of Object.entries(UNLOCKED))LATCH_COPY[locale].push(value);
