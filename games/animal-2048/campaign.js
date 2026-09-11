/* Authored v25 campaign. Stable IDs; deterministic retries. Checkpoints add
 * spatial / simultaneous-merge decisions without changing classic 2048 rules. */
(() => {
  "use strict";
  window.ForestCampaign = [
    {"type":"tile","target":8,"limit":18,"blocked":[],"start":[2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],"seed":8}, // 1
    {"type":"tile","target":16,"limit":20,"blocked":[],"start":[4,2,2,0,4,0,0,0,0,0,0,0,0,0,0,0],"seed":2723777243}, // 2
    {"type":"merges","target":6,"limit":22,"blocked":[],"start":[2,2,0,0,4,2,0,0,2,0,2,0,0,0,0,0],"seed":1150358698}, // 3
    {"type":"tile","target":32,"limit":24,"blocked":[],"start":[8,4,2,2,8,0,0,0,4,0,0,0,0,0,0,0],"seed":3874135933}, // 4
    {"type":"score","target":180,"limit":29,"blocked":[],"start":[2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,2],"seed":2300713420,"checkpoint":{"kind":"space","target":3}}, // 5
    {"type":"tile","target":32,"limit":24,"blocked":[],"start":[8,4,2,0,0,4,2,0,8,0,0,0,0,0,0,0],"seed":729523103}, // 6
    {"type":"merges","target":9,"limit":26,"blocked":[],"start":[0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0],"seed":3451071086}, // 7
    {"type":"score","target":220,"limit":34,"blocked":[],"start":[0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0],"seed":1871492145}, // 8
    {"type":"tile","target":64,"limit":28,"blocked":[],"start":[0,0,0,0,0,0,0,0,16,16,8,8,4,4,4,4],"seed":298073728}, // 9
    {"type":"merges","target":12,"limit":34,"blocked":[],"start":[2,2,4,4,0,2,0,2,0,0,0,0,0,0,0,0],"seed":2954738003,"checkpoint":{"kind":"pairs","target":2}}, // 10
    {"type":"tile","target":32,"limit":24,"blocked":[5],"start":[8,8,4,4,2,0,2,2,2,0,0,0,0,0,0,0],"seed":1381319458}, // 11
    {"type":"score","target":300,"limit":31,"blocked":[10],"start":[0,0,0,4,4,4,4,4,4,4,0,4,0,0,0,0],"seed":4105096693}, // 12
    {"type":"tile","target":64,"limit":29,"blocked":[5,10],"start":[4,4,0,0,0,0,0,0,0,16,0,16,8,8,4,4],"seed":2531677252}, // 13
    {"type":"merges","target":12,"limit":30,"blocked":[6,9],"start":[2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2],"seed":960486935}, // 14
    {"type":"tile","target":128,"limit":36,"blocked":[1,14],"start":[32,0,32,16,16,8,8,8,8,0,0,0,0,0,0,0],"seed":3682031846,"checkpoint":{"kind":"space","target":4}}, // 15
    {"type":"score","target":380,"limit":34,"blocked":[5],"start":[8,8,8,8,8,0,8,8,8,0,0,0,0,0,0,0],"seed":2101404329}, // 16
    {"type":"tile","target":128,"limit":32,"blocked":[10],"start":[0,0,0,32,32,16,16,8,8,8,0,8,0,0,0,0],"seed":530083192}, // 17
    {"type":"merges","target":15,"limit":38,"blocked":[5,10],"start":[2,2,2,0,0,0,0,0,0,0,0,2,2,2,2,2],"seed":2178021323}, // 18
    {"type":"score","target":640,"limit":39,"blocked":[6,9],"start":[8,8,8,8,8,8,0,0,0,0,0,0,0,0,8,8],"seed":539586970}, // 19
    {"type":"tile","target":256,"limit":42,"blocked":[1,14],"start":[8,0,64,64,16,16,16,16,8,8,8,8,8,8,0,8],"seed":3261266029,"checkpoint":{"kind":"pairs","target":3}}, // 20
    {"type":"tile","target":256,"limit":40,"blocked":[5,10],"start":[8,8,8,8,64,0,64,16,16,16,0,16,8,8,8,8],"seed":1690010172}, // 21
    {"type":"merges","target":18,"limit":42,"blocked":[1,14],"start":[2,0,0,0,0,0,0,0,2,2,2,2,2,2,0,2],"seed":116591759}, // 22
    {"type":"score","target":700,"limit":44,"blocked":[4,11],"start":[16,16,16,16,0,0,0,0,0,0,0,0,16,16,16,16],"seed":2831980382}, // 23
    {"type":"tile","target":512,"limit":46,"blocked":[6,9],"start":[128,32,32,32,32,16,0,16,16,0,16,16,16,16,16,128],"seed":1258557729}, // 24
    {"type":"score","target":760,"limit":48,"blocked":[5,10],"start":[0,0,16,16,16,0,16,16,16,16,0,16,0,0,0,0],"seed":3982334960,"checkpoint":{"kind":"space","target":4}}, // 25
    {"type":"tile","target":512,"limit":46,"blocked":[1,14],"start":[16,0,16,16,16,16,128,128,32,32,32,32,16,16,0,16],"seed":2408915523}, // 26
    {"type":"merges","target":22,"limit":48,"blocked":[4,11],"start":[2,2,0,0,0,0,0,0,0,2,2,0,2,2,2,2],"seed":837725202}, // 27
    {"type":"tile","target":1024,"limit":52,"blocked":[5,10],"start":[64,64,64,32,32,0,32,32,32,32,0,32,32,256,256,64],"seed":3492165349}, // 28
    {"type":"score","target":1200,"limit":54,"blocked":[6,9],"start":[32,32,32,32,32,32,0,32,32,0,0,0,0,0,0,0],"seed":1920970932}, // 29
    {"type":"tile","target":2048,"limit":60,"blocked":[1,14],"start":[64,0,64,64,512,512,128,128,128,128,64,64,64,64,0,64],"seed":347552519,"checkpoint":{"kind":"pairs","target":3}} // 30
  ];
})();
