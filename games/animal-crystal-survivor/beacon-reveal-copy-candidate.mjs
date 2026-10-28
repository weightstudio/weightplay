// Local practice drafts; native-language and visual review remain open.
export const revealCopy=Object.freeze({
 en:['Revealed Circuit','Carry a fragment to B. Its pulse reveals C; earn a new fragment, activate C and clear the waves. Damage loses a carried fragment.','Carry fragment to B','Collect the next fragment','Carry fragment to C'],
 'zh-Hant':['顯現迴路','帶碎片至 B，脈衝會顯示 C；再取得另一枚碎片、啟動 C 並清除波次。受傷會失去碎片。','帶碎片前往 B','取得下一枚碎片','帶碎片前往 C'],
 'zh-Hans':['显现回路','带碎片至 B，脉冲会显示 C；再取得另一枚碎片、启动 C 并清除波次。受伤会失去碎片。','带碎片前往 B','取得下一枚碎片','带碎片前往 C'],
 ja:['現れる回路','欠片を B に運ぶと C が現れる。新しい欠片を得て C を起動し、波を倒す。被弾で欠片を失う。','欠片を B に運ぶ','次の欠片を集める','欠片を C に運ぶ'],
 ko:['드러나는 회로','조각을 B로 가져가면 C가 나타납니다. 새 조각을 얻어 C를 켜고 파도를 정리하세요. 피해를 받으면 조각을 잃습니다.','조각을 B로 옮기기','다음 조각 얻기','조각을 C로 옮기기'],
 es:['Circuito revelado','Lleva un fragmento a B para revelar C; consigue otro, activa C y supera las oleadas. El daño hace perder el fragmento.','Lleva el fragmento a B','Consigue otro fragmento','Lleva el fragmento a C'],
 'pt-BR':['Circuito revelado','Leve um fragmento a B para revelar C; obtenha outro, ative C e vença as ondas. Dano faz perder o fragmento.','Leve o fragmento a B','Obtenha outro fragmento','Leve o fragmento a C'],
 fr:['Circuit révélé','Portez un fragment à B pour révéler C ; obtenez-en un autre, activez C et battez les vagues. Un coup fait perdre le fragment.','Portez le fragment à B','Obtenez un autre fragment','Portez le fragment à C'],
 de:['Enthüllter Kreis','Bringe ein Fragment zu B, um C zu enthüllen. Hol ein neues, aktiviere C und besiege die Wellen. Schaden lässt das Fragment fallen.','Fragment zu B bringen','Nächstes Fragment holen','Fragment zu C bringen'],
 it:['Circuito rivelato','Porta un frammento a B per rivelare C; ottienine un altro, attiva C e supera le ondate. I danni fanno perdere il frammento.','Porta il frammento a B','Ottieni un altro frammento','Porta il frammento a C'],
 ru:['Открытый контур','Отнесите осколок к B, чтобы открыть C; добудьте ещё один, активируйте C и отбейте волны. Урон лишает осколка.','Отнесите осколок к B','Добудьте следующий осколок','Отнесите осколок к C'],
 hi:['खुलता परिपथ','टुकड़ा B तक ले जाने से C दिखेगा। दूसरा टुकड़ा पाकर C सक्रिय करें और लहरें हराएँ। चोट से टुकड़ा खोता है।','टुकड़ा B तक ले जाएँ','अगला टुकड़ा पाएँ','टुकड़ा C तक ले जाएँ'],
 ar:['المسار المكشوف','احمل شظية إلى B لكشف C، ثم احصل على شظية أخرى وفعّل C واهزم الموجات. الإصابة تفقدك الشظية.','احمل الشظية إلى B','احصل على الشظية التالية','احمل الشظية إلى C'],
});
export function revealStatus(locale,completed,charged){const words=revealCopy[locale]||revealCopy.en;if(completed===0&&charged)return words[2];if(completed===1&&!charged)return words[3];if(completed===1&&charged)return words[4];return null}
