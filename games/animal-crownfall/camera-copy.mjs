const keys='left|right|up|down|follow|overview|floors|guide'.split('|');
const rows={
  "en": "Look left|Look right|Look up|Look down|Follow hero|View whole map|Floors|Drag the map or use arrows to look around. ◎ follows the hero; ▦ shows the whole map. These controls move the camera, not the hero. The camera follows movement and pauses at each fight.",
  "zh-Hant": "查看左方|查看右方|查看上層|查看下層|跟隨角色|查看全圖|樓層|拖曳地圖或使用箭頭查看四周；◎ 回到角色，▦ 查看全圖。這些操作只移動鏡頭，不移動角色。鏡頭隨角色前進，打鬥時停留讓你看清楚。",
  "zh-Hans": "查看左方|查看右方|查看上层|查看下层|跟随角色|查看全图|楼层|拖动地图或使用箭头查看四周；◎ 回到角色，▦ 查看全图。这些操作只移动镜头，不移动角色。镜头随角色前进，战斗时停留让你看清楚。",
  "ja": "左を見る|右を見る|上を見る|下を見る|主人公を追う|全体マップ|階|ドラッグや矢印で周囲を確認。◎で主人公へ、▦で全体図へ。操作で動くのはカメラだけです。移動に追従し、戦闘を見やすく映します。",
  "ko": "왼쪽 보기|오른쪽 보기|위층 보기|아래층 보기|주인공 따라가기|전체 지도|층|지도를 끌거나 화살표로 둘러보세요. ◎는 주인공으로, ▦는 전체 지도로 이동해요. 캐릭터가 아닌 카메라만 움직여요. 이동을 따라가며 전투를 보여 줘요.",
  "es": "Mirar izquierda|Mirar derecha|Mirar arriba|Mirar abajo|Seguir al héroe|Ver mapa completo|Pisos|Arrastra o usa flechas para explorar. ◎ sigue al héroe; ▦ muestra todo el mapa. Solo mueves la cámara, no al héroe. La cámara sigue el movimiento y muestra cada combate.",
  "pt-BR": "Olhar à esquerda|Olhar à direita|Olhar acima|Olhar abaixo|Seguir o herói|Ver mapa inteiro|Andares|Arraste ou use setas para explorar. ◎ segue o herói; ▦ mostra o mapa inteiro. Você move apenas a câmera, não o herói. A câmera acompanha o movimento e mostra cada combate.",
  "fr": "Voir à gauche|Voir à droite|Voir en haut|Voir en bas|Suivre le héros|Voir toute la carte|Étages|Glissez ou utilisez les flèches pour explorer. ◎ suit le héros ; ▦ montre toute la carte. Seule la caméra bouge. Elle accompagne les déplacements et montre chaque combat.",
  "de": "Nach links sehen|Nach rechts sehen|Nach oben sehen|Nach unten sehen|Helden folgen|Gesamte Karte|Etagen|Ziehe die Karte oder nutze die Pfeile. ◎ folgt dem Helden; ▦ zeigt die ganze Karte. Du bewegst nur die Kamera. Sie folgt der Bewegung und zeigt jeden Kampf.",
  "it": "Guarda a sinistra|Guarda a destra|Guarda sopra|Guarda sotto|Segui l’eroe|Vedi tutta la mappa|Piani|Trascina o usa le frecce per esplorare. ◎ segue l’eroe; ▦ mostra tutta la mappa. Muovi solo la telecamera. Segue i movimenti e mostra ogni combattimento.",
  "ru": "Смотреть влево|Смотреть вправо|Смотреть вверх|Смотреть вниз|Следовать за героем|Вся карта|Этажи|Перетаскивайте карту или нажимайте стрелки. ◎ возвращает к герою; ▦ показывает всю карту. Двигается только камера. Она следует за героем и показывает каждый бой.",
  "hi": "बाएँ देखें|दाएँ देखें|ऊपर देखें|नीचे देखें|नायक का पीछा करें|पूरा नक्शा देखें|मंज़िलें|नक्शा खींचें या तीर दबाएँ। ◎ नायक को दिखाता है; ▦ पूरा नक्शा दिखाता है। केवल कैमरा चलता है, नायक नहीं। कैमरा नायक के साथ चलता है और हर लड़ाई दिखाता है।",
  "ar": "انظر يسارًا|انظر يمينًا|انظر للأعلى|انظر للأسفل|اتبع البطل|اعرض الخريطة كاملة|الطوابق|اسحب الخريطة أو استخدم الأسهم للاستكشاف. ◎ يتبع البطل و▦ يعرض الخريطة كاملة. تتحرك الكاميرا فقط وليس البطل. تتبع الحركة وتعرض كل قتال."
};
export const CAMERA_COPY=Object.fromEntries(Object.entries(rows).map(([locale,row])=>[locale,Object.fromEntries(row.split('|').map((value,i)=>[keys[i],value]))]));
export const cameraText=(locale,key)=>CAMERA_COPY[locale]?.[key]||CAMERA_COPY.en[key];
