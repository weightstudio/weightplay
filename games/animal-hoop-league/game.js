/* Hoop League: deterministic rules and a game-owned hold/release basketball loop. */
(() => {
  'use strict';
  const courts = Object.freeze([
    { shots:8, speed:.38, tolerance:.15, pattern:[.58], rival:[0,1,0,1,1,1,1,1], color:'#64e6c0' },
    { shots:8, speed:.43, tolerance:.13, pattern:[.42,.68], rival:[1,1,0,1,1,1,1,1], color:'#63caff' },
    { shots:7, speed:.40, tolerance:.11, pattern:[.38,.72,.55], rival:[1,1,1,1,1,1,2], color:'#ffbd73', perfect:3 },
    { shots:8, speed:.57, tolerance:.105, pattern:[.5,.7,.4], rival:[1,1,1,1,1,1,1,1], color:'#c2a0ff' },
    { shots:8, speed:.48, tolerance:.105, pattern:[.67,.46,.6,.36], rival:[1,2,1,1,1,1,1,1], color:'#ff87a5' },
    { shots:10, speed:.53, tolerance:.095, pattern:[.4,.68,.5,.75,.55], rival:[1,1,1,2,1,1,1,1,2,1], color:'#ffe399' },
    // Backboard Circuit courts 7–30 and Relay Skyline courts 31–60.
    {"id":7,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.5,0.8,0.5,0.8,0.5,0.8],"rival":[0,1,1,1,1,1,1,1],"color":"#71d8e2","defenses":["R","O","O","O","O","O","O","O"],"focus":1,"goals":{"bank":1},"intent":"Read the first rim shutter and choose Bank; the remaining open attempts let the player compare the two truthful arcs."},
    {"id":8,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.4,0.7,0.5,0.6,0.4,0.7,0.5],"rival":[1,0,1,1,1,1,1,1],"color":"#71d8e2","defenses":["B","R","B","R","O","O","O","O"],"focus":1,"goals":{"bank":2,"direct":2},"intent":"Backboard shutters teach Direct; alternate the two routes before returning to open scoring attempts."},
    {"id":9,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.3,0.5,0.6,0.4,0.7,0.3,0.5],"rival":[1,1,0,1,1,1,1,1],"color":"#71d8e2","defenses":["O","O","R","B","O","O","R","B"],"focus":2,"goals":{"bank":2,"direct":2},"intent":"Open shots precede paired shutters; use the preview to prepare the next route while retaining a focus charge."},
    {"id":10,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.6,0.4,0.7,0.3,0.6,0.5],"rival":[1,1,1,1,0,1,1,1],"color":"#71d8e2","defenses":["R","B","O","O","R","B","O","R"],"focus":2,"goals":{"bank":3,"direct":2},"intent":"Route checkpoint: distinguish both shutters and finish with a bank instead of repeating the previous direct shot."},
    {"id":11,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.3,0.7,0.5,0.8,0.6,0.4,0.7,0.5],"rival":[1,1,1,0,1,1,1,1],"color":"#71d8e2","defenses":["O","B","O","O","R","O","O","O"],"focus":2,"goals":{"bank":2,"perfect":2},"intent":"Choose an open attempt for a second bank and use Focus for two central releases; correct route alone is insufficient."},
    {"id":12,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.4,0.8,0.5,0.3,0.6,0.4,0.7],"rival":[1,0,1,2,1,1,1,1],"color":"#71d8e2","defenses":["O","R","B","O","R","B","O","O"],"focus":1,"goals":{"direct":3,"bank":2},"intent":"Three direct baskets require reserving an open slot; one Focus charge makes choosing the difficult target meaningful."},
    {"id":13,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.4,0.6,0.3,0.8,0.7,0.5,0.6,0.4],"rival":[1,1,1,1,1,0,1,2],"color":"#71d8e2","defenses":["B","R","O","B","O","R","O","O"],"focus":2,"goals":{"bank":3,"perfect":2},"intent":"A late open pair completes the bank quota, while the high/low sequence encourages deliberate focus timing."},
    {"id":14,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.3,0.7,0.5,0.4,0.8,0.6,0.3],"rival":[1,2,1,0,1,1,1,1],"color":"#71d8e2","defenses":["O","O","R","B","B","O","R","O"],"focus":1,"goals":{"bank":2,"direct":3,"streak":3},"intent":"Build a three-basket sequence through adjacent board shutters rather than alternating routes by habit."},
    {"id":15,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.6,0.3,0.7,0.4,0.6,0.5,0.8],"rival":[1,1,1,1,2,1,0,1,1],"color":"#71d8e2","defenses":["R","B","O","O","R","B","O","R","O"],"focus":2,"goals":{"bank":3,"direct":3,"perfect":2},"intent":"Focus checkpoint: two limited slow charges support exact releases across both shutters and both route quotas."},
    {"id":16,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.3,0.6,0.4,0.5,0.8,0.3,0.7],"rival":[1,1,1,2,1,1,1,1],"color":"#71d8e2","defenses":["R","R","B","O","O","B","O","O"],"focus":1,"goals":{"bank":3,"direct":3},"intent":"Consecutive rim shutters start a bank run; choose the open attempts needed to balance three direct baskets."},
    {"id":17,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.5,0.8,0.3,0.7,0.4,0.6,0.5],"rival":[1,1,1,1,1,2,1,1],"color":"#71d8e2","defenses":["O","B","R","R","O","B","O","O"],"focus":2,"goals":{"bank":3,"streak":4},"intent":"Prepare a four-basket route sequence through the double rim section; open shots can repair the bank requirement."},
    {"id":18,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.4,0.7,0.5,0.6,0.3,0.8,0.7,0.4],"rival":[2,1,1,1,1,1,1,1],"color":"#71d8e2","defenses":["B","R","B","O","O","R","O","O"],"focus":1,"goals":{"direct":3,"bank":3,"perfect":2},"intent":"The opening direct-bank-direct pattern leads into a bank quota that must be completed on open ground."},
    {"id":19,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.8,0.6,0.4,0.7,0.5,0.3,0.6,0.8],"rival":[1,1,2,1,1,1,1,1],"color":"#71d8e2","defenses":["O","O","B","B","R","O","R","O"],"focus":2,"goals":{"direct":3,"streak":4,"last":"bank"},"intent":"Plan a safe four-shot scoring run, then reserve the final open shot for the required bank finish."},
    {"id":20,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.8,0.3,0.7,0.5,0.4,0.6,0.3,0.8],"rival":[1,1,1,2,1,1,2,1,1],"color":"#71d8e2","defenses":["R","B","O","B","R","O","R","B","O"],"focus":2,"goals":{"direct":3,"bank":3,"streak":4},"intent":"Route-chain checkpoint: three of each route and a four-basket run across a mixed sequence."},
    {"id":21,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.3,0.5,0.7,0.8,0.6,0.4,0.7,0.5],"rival":[1,1,1,2,1,1,1,1],"color":"#71d8e2","defenses":["B","O","R","O","O","B","R","O"],"focus":2,"goals":{"bank":3,"perfect":3,"last":"direct"},"intent":"Three precise releases share two Focus charges; preserve the direct finish while placing optional banks earlier."},
    {"id":22,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.8,0.4,0.6,0.3,0.5,0.7,0.4],"rival":[1,1,1,1,1,2,1,1],"color":"#71d8e2","defenses":["R","R","O","B","B","O","R","O"],"focus":1,"goals":{"bank":3,"direct":3,"last":"bank"},"intent":"Paired shutters demand route persistence, but the final open shot must return to Bank."},
    {"id":23,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.3,0.8,0.5,0.4,0.7,0.3,0.6],"rival":[1,2,1,1,1,1,1,1],"color":"#71d8e2","defenses":["O","B","R","O","R","B","O","O"],"focus":2,"goals":{"direct":4,"bank":2,"streak":4},"intent":"Direct quota occupies most open attempts; the rim baskets remain essential inside a continuous scoring run."},
    {"id":24,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.4,0.7,0.6,0.8,0.5,0.3,0.6,0.4],"rival":[2,1,1,1,1,1,1,1],"color":"#71d8e2","defenses":["B","R","O","O","B","R","O","R"],"focus":2,"goals":{"bank":4,"direct":2,"perfect":3},"intent":"Four bank baskets require deliberate open-shot choices, with three precise releases beyond available Focus."},
    {"id":25,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.8,0.6,0.4,0.5,0.3,0.7,0.4,0.6,0.8],"rival":[1,1,2,1,1,1,2,1,1],"color":"#71d8e2","defenses":["O","R","B","B","O","R","O","B","O"],"focus":2,"goals":{"bank":3,"direct":4,"streak":4,"last":"bank"},"intent":"Quota checkpoint: four direct shots leave a tight bank allocation and an explicit bank finish."},
    {"id":26,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.3,0.7,0.6,0.4,0.8,0.5,0.6,0.3],"rival":[1,1,1,2,1,1,1,1,1,2],"color":"#71d8e2","defenses":["R","B","O","O","R","B","B","R","O","O"],"focus":2,"goals":{"bank":4,"direct":4,"perfect":3},"intent":"Long-form route planning: paired board shutters consume direct slots while four banks need open-shot allocation."},
    {"id":27,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.4,0.6,0.3,0.5,0.8,0.6,0.4,0.7,0.5],"rival":[2,1,1,1,1,1,2,1,1,1],"color":"#71d8e2","defenses":["B","B","O","R","R","O","O","B","R","O"],"focus":2,"goals":{"bank":4,"direct":3,"streak":5},"intent":"A five-basket chain spans consecutive opposite shutters; the score lead must survive the rival opening burst."},
    {"id":28,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.3,0.8,0.4,0.7,0.5,0.3,0.8,0.6,0.4],"rival":[1,1,2,1,1,1,1,2,1,1],"color":"#71d8e2","defenses":["O","R","B","O","B","R","R","O","B","O"],"focus":1,"goals":{"bank":4,"direct":4,"last":"direct"},"intent":"Only one Focus supports a long mixed sequence; preserve the last open shot for the direct finish."},
    {"id":29,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.8,0.5,0.7,0.3,0.6,0.4,0.7,0.5,0.3,0.6],"rival":[1,1,1,2,1,1,2,1,1,1],"color":"#71d8e2","defenses":["R","R","O","B","B","O","R","B","O","O"],"focus":2,"goals":{"bank":4,"direct":4,"perfect":4},"intent":"Four precise releases cannot all use Focus; choose the target positions that best suit the normal charge cadence."},
    {"id":30,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.8,0.4,0.7,0.5,0.3,0.8,0.6,0.4,0.7],"rival":[1,1,1,2,1,1,1,2,1,1],"color":"#71d8e2","defenses":["R","B","O","B","R","O","R","B","O","O"],"focus":2,"goals":{"bank":4,"direct":4,"perfect":3,"streak":5,"last":"bank"},"intent":"Backboard Circuit finale: both route quotas, precise releases, an uninterrupted run and the bank finish in one court."},
    {"id":31,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.5,0.8,0.5,0.8,0.5,0.8],"rival":[0,1,1,1,1,1,1,1],"color":"#e5b575","defenses":["O","A","O","O","O","O","O","O"],"focus":2,"goals":{"assist":1},"intent":"A pass spends an attempt to store two relay charges; use an Assist shot to cross the first relay gate."},
    {"id":32,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.4,0.7,0.5,0.6,0.4,0.7,0.5],"rival":[1,0,1,1,1,1,1,1],"color":"#e5b575","defenses":["O","R","A","O","O","B","O","O"],"focus":2,"goals":{"assist":2,"bank":1},"intent":"Two charged relay baskets justify one pass; bank the rim shutter instead of spending a scarce charge automatically."},
    {"id":33,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.3,0.5,0.6,0.4,0.7,0.3,0.5],"rival":[1,1,0,1,1,1,1,1],"color":"#e5b575","defenses":["O","A","B","O","A","R","O","O"],"focus":2,"goals":{"assist":2,"direct":2},"intent":"Two separated relay gates reward conserving the pair of charges while direct shots handle the board shutter."},
    {"id":34,"shots":8,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.6,0.4,0.7,0.3,0.6,0.5],"rival":[1,1,1,0,1,1,1,1],"color":"#e5b575","defenses":["B","O","A","R","O","O","A","O"],"focus":2,"goals":{"assist":2,"bank":2},"intent":"The initial open/direct choices supply a passing window before two relay gates and a bank quota."},
    {"id":35,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.4,0.8,0.5,0.3,0.6,0.4,0.7,0.5],"rival":[1,0,1,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","R","A","O","B","R","A","O","O"],"focus":2,"goals":{"assist":2,"bank":2,"direct":2},"intent":"Relay introduction checkpoint: one pass, two charged baskets and both ordinary routes must produce a lead."},
    {"id":36,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.4,0.6,0.3,0.8,0.7,0.5,0.6,0.4,0.7],"rival":[1,1,1,0,1,1,1,1,1],"color":"#e5b575","defenses":["O","A","O","B","A","O","R","A","O"],"focus":2,"goals":{"assist":3},"intent":"Three relay gates exceed one pass capacity; schedule a second pass after spending at least one stored charge."},
    {"id":37,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.3,0.7,0.5,0.4,0.8,0.6,0.3,0.7],"rival":[1,1,1,1,0,1,1,1,1],"color":"#e5b575","defenses":["B","O","R","A","O","A","B","A","O"],"focus":2,"goals":{"assist":3,"direct":2},"intent":"Passing early can waste full-capacity energy; weave two direct baskets between three charged attempts."},
    {"id":38,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.6,0.3,0.7,0.4,0.6,0.5,0.8],"rival":[0,1,1,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","A","R","B","O","A","O","A","R"],"focus":2,"goals":{"assist":3,"bank":2},"intent":"Keep relay charges for three gates while rim shutters offer bank opportunities and open attempts fund passes."},
    {"id":39,"shots":9,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.3,0.6,0.4,0.5,0.8,0.3,0.7,0.6],"rival":[1,0,1,1,1,1,1,1,1],"color":"#e5b575","defenses":["R","O","A","B","O","A","R","O","A"],"focus":2,"goals":{"assist":3,"last":"assist"},"intent":"The final gate needs a reserved charge; a late pass must happen before the last attempt."},
    {"id":40,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.5,0.8,0.3,0.7,0.4,0.6,0.5,0.8,0.3],"rival":[1,1,1,0,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","B","A","R","O","A","O","B","R","A"],"focus":2,"goals":{"assist":3,"bank":2,"direct":2},"intent":"Capacity checkpoint: two passing windows, three relay baskets and complementary ordinary routes."},
    {"id":41,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.4,0.7,0.5,0.6,0.3,0.8,0.7,0.4,0.6,0.5],"rival":[1,1,1,1,0,1,1,1,1,1],"color":"#e5b575","defenses":["O","A","R","B","O","O","A","B","O","A"],"focus":2,"goals":{"assist":3,"streak":3,"last":"assist"},"intent":"Passes break scoring streaks; arrange the final three-basket run so the last relay charge survives."},
    {"id":42,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.8,0.6,0.4,0.7,0.5,0.3,0.6,0.8,0.4,0.7],"rival":[0,1,1,1,1,1,1,2,1,1],"color":"#e5b575","defenses":["B","R","O","A","O","B","A","R","O","A"],"focus":2,"goals":{"assist":3,"bank":2,"last":"assist"},"intent":"Early bank/direct play creates passing opportunities; do not consume the final relay charge on an open shot."},
    {"id":43,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.8,0.3,0.7,0.5,0.4,0.6,0.3,0.8,0.5],"rival":[1,0,1,1,1,1,1,1,1,2],"color":"#e5b575","defenses":["O","A","B","R","O","A","O","B","O","A"],"focus":1,"goals":{"assist":3,"direct":3,"last":"assist"},"intent":"A direct quota competes with two passes; one Focus charge is best saved for the decisive relay release."},
    {"id":44,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.3,0.5,0.7,0.8,0.6,0.4,0.7,0.5,0.3,0.8],"rival":[1,1,1,0,1,1,1,1,1,1],"color":"#e5b575","defenses":["R","O","B","A","O","A","R","B","O","A"],"focus":2,"goals":{"assist":3,"bank":3,"last":"assist"},"intent":"Three bank baskets and the final assist fill most attacks, making pass placement a constrained route choice."},
    {"id":45,"shots":11,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.8,0.4,0.6,0.3,0.5,0.7,0.4,0.8,0.3,0.6],"rival":[1,1,1,1,0,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","B","A","R","O","O","A","B","R","O","A"],"focus":2,"goals":{"assist":3,"bank":2,"direct":2,"streak":4,"last":"assist"},"intent":"Finale-reserve checkpoint: retain one charge for the last gate while placing passes outside a four-basket sequence."},
    {"id":46,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.3,0.8,0.5,0.4,0.7,0.3,0.6,0.8,0.5],"rival":[0,1,1,1,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","A","O","R","B","A","O","B","O","A"],"focus":2,"goals":{"assist":3,"perfect":3,"streak":3},"intent":"Three perfect releases and relay preparation share two Focus charges; plan which attacks need slowing."},
    {"id":47,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.4,0.7,0.6,0.8,0.5,0.3,0.6,0.4,0.7,0.5],"rival":[1,0,1,1,1,1,1,1,1,2],"color":"#e5b575","defenses":["B","R","O","A","O","A","R","B","O","A"],"focus":1,"goals":{"assist":3,"bank":2,"perfect":3},"intent":"A single Focus increases the value of selecting comfortable open targets for the required precise releases."},
    {"id":48,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.8,0.6,0.4,0.5,0.3,0.7,0.4,0.6,0.8,0.5],"rival":[1,1,1,0,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","A","B","R","O","A","O","A","B","O"],"focus":2,"goals":{"assist":3,"direct":3,"perfect":3},"intent":"Direct baskets and relay gates compete for the same finite shot budget; overpassing sacrifices the goal."},
    {"id":49,"shots":10,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.3,0.7,0.6,0.4,0.8,0.5,0.6,0.3],"rival":[1,1,1,1,0,1,1,1,1,1],"color":"#e5b575","defenses":["R","O","A","B","O","A","R","A","O","A"],"focus":2,"goals":{"assist":4,"bank":2},"intent":"Four relay baskets consume exactly two full pass bundles; bank both rim shutters without wasting charges."},
    {"id":50,"shots":11,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.4,0.6,0.3,0.5,0.8,0.6,0.4,0.7,0.5,0.8],"rival":[0,1,1,1,1,1,2,1,1,1,1],"color":"#e5b575","defenses":["O","B","A","R","O","A","B","O","R","A","O"],"focus":2,"goals":{"assist":3,"bank":3,"direct":2,"perfect":3},"intent":"Precision-relay checkpoint: two passes leave enough shots for all three attack styles and exact-release mastery."},
    {"id":51,"shots":11,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.3,0.8,0.4,0.7,0.5,0.3,0.8,0.6,0.4,0.7],"rival":[1,0,1,1,1,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","A","R","B","O","A","B","R","O","A","O"],"focus":2,"goals":{"assist":3,"bank":2,"direct":3,"streak":4},"intent":"A four-basket attack sequence must fit between pass resets while direct shots satisfy the larger ordinary quota."},
    {"id":52,"shots":11,"speed":0.44,"tolerance":0.13,"pattern":[0.8,0.5,0.7,0.3,0.6,0.4,0.7,0.5,0.3,0.6,0.8],"rival":[1,1,1,0,1,1,1,2,1,1,1],"color":"#e5b575","defenses":["B","R","O","A","O","A","B","R","O","A","O"],"focus":1,"goals":{"assist":3,"bank":3,"direct":2,"last":"direct"},"intent":"Unlike prior finishes, the last open shot must be Direct; spend all required relay attacks before it."},
    {"id":53,"shots":11,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.8,0.4,0.7,0.5,0.3,0.8,0.6,0.4,0.7,0.5],"rival":[1,1,1,1,0,1,1,1,2,1,1],"color":"#e5b575","defenses":["O","A","B","R","O","A","R","B","O","A","O"],"focus":2,"goals":{"assist":3,"bank":2,"direct":3,"perfect":4},"intent":"Four precise releases exceed Focus supply; prepare relay charges early enough to choose easier targets."},
    {"id":54,"shots":11,"speed":0.44,"tolerance":0.13,"pattern":[0.3,0.7,0.5,0.8,0.6,0.4,0.7,0.5,0.3,0.8,0.6],"rival":[0,1,1,1,1,1,2,1,1,1,1],"color":"#e5b575","defenses":["R","O","A","B","O","A","R","B","O","A","O"],"focus":2,"goals":{"assist":3,"bank":3,"direct":2,"last":"bank"},"intent":"Close with a bank on the final open attempt while three earlier gates consume the relay allocation."},
    {"id":55,"shots":12,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.4,0.8,0.5,0.3,0.6,0.4,0.7,0.5,0.8,0.3,0.6],"rival":[1,0,1,1,1,1,1,1,2,1,1,1],"color":"#e5b575","defenses":["O","B","A","R","O","A","B","O","R","A","O","A"],"focus":2,"goals":{"assist":4,"bank":2,"direct":2,"streak":4,"last":"assist"},"intent":"Relay mastery checkpoint: four charged baskets, both ordinary routes and a final four-shot scoring run."},
    {"id":56,"shots":12,"speed":0.44,"tolerance":0.13,"pattern":[0.4,0.6,0.3,0.8,0.7,0.5,0.6,0.4,0.7,0.5,0.8,0.3],"rival":[1,1,1,0,1,1,1,2,1,1,1,1],"color":"#e5b575","defenses":["R","O","A","B","O","A","R","B","O","A","O","A"],"focus":2,"goals":{"assist":4,"bank":3,"perfect":3},"intent":"Bank three times without spending the two relay bundles needed for four gates; preserve accuracy under the route mix."},
    {"id":57,"shots":12,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.3,0.7,0.5,0.4,0.8,0.6,0.3,0.7,0.4,0.8,0.5],"rival":[1,1,1,1,0,1,1,1,2,1,1,1],"color":"#e5b575","defenses":["B","O","A","R","O","A","O","B","R","A","O","A"],"focus":1,"goals":{"assist":4,"direct":3,"streak":4},"intent":"A larger direct quota and one Focus demand a planned final attack run after the last useful pass."},
    {"id":58,"shots":12,"speed":0.44,"tolerance":0.13,"pattern":[0.5,0.8,0.6,0.3,0.7,0.4,0.6,0.5,0.8,0.3,0.7,0.4],"rival":[0,1,1,1,1,1,2,1,1,1,1,1],"color":"#e5b575","defenses":["O","A","B","R","O","A","O","A","B","R","O","A"],"focus":2,"goals":{"assist":4,"bank":2,"direct":2,"perfect":4},"intent":"Four relay gates alternate with both shutters; choose two Focus uses while still achieving four precise baskets."},
    {"id":59,"shots":12,"speed":0.44,"tolerance":0.13,"pattern":[0.7,0.3,0.6,0.4,0.5,0.8,0.3,0.7,0.6,0.4,0.5,0.8],"rival":[1,0,1,1,1,1,1,1,2,1,1,1],"color":"#e5b575","defenses":["R","O","A","B","O","A","R","B","O","A","O","A"],"focus":2,"goals":{"assist":4,"bank":3,"streak":5,"last":"assist"},"intent":"The penultimate court asks for a five-basket finish; pass early enough to preserve both the run and last charge."},
    {"id":60,"shots":12,"speed":0.44,"tolerance":0.13,"pattern":[0.6,0.5,0.8,0.3,0.7,0.4,0.6,0.5,0.8,0.3,0.7,0.4],"rival":[1,1,1,0,1,1,1,2,1,1,1,1],"color":"#e5b575","defenses":["O","B","A","R","O","A","B","O","R","A","O","A"],"focus":2,"goals":{"assist":4,"bank":2,"direct":2,"perfect":4,"streak":5,"last":"assist"},"intent":"Relay Skyline finale: two exact pass bundles, four relay baskets, both ordinary paths, four perfect releases and a five-shot finishing run."}
  ].map(Object.freeze));
  const courtFor = stage => Number.isInteger(stage) && stage >= 1 && stage <= courts.length ? courts[stage - 1] : null;
  const validRoute = (stage, route) => route === 'direct' || (stage >= 7 && route === 'bank') || (stage >= 31 && route === 'assist');
  const challenge = (stage, shot, route='direct', focused=false) => {
    const c=courtFor(stage);if(!c||!validRoute(stage,route)||!Number.isInteger(shot)||shot<0)return null;
    const i=Math.min(c.shots-1,shot),base=c.pattern[i%c.pattern.length];
    const target=route==='bank'?1-base:route==='assist'?.5+(base-.5)*.6:base;
    const result={target,tolerance:c.tolerance,speed:c.speed*(focused&&stage>=7?.62:1)};
    return stage<=6?result:{...result,defense:c.defenses[i],route,open:c.defenses[i]==='O'||route==='assist'||(c.defenses[i]==='R'&&route==='bank')||(c.defenses[i]==='B'&&route==='direct')};
  };
  const newRound = stage => {
    if(!courtFor(stage))return null;
    const r={stage,shots:0,score:0,rival:0,made:0,perfect:0,streak:0,finished:false,last:null};
    return stage<=6?r:{...r,assists:0,focus:courts[stage-1].focus,bankMade:0,directMade:0,assistMade:0,bestStreak:0,lastRoute:null};
  };
  function settle(round,power,route='direct',focused=false) {
    if(!round||round.finished||!courtFor(round.stage)||!validRoute(round.stage,route)||!Number.isFinite(power)||power<0||power>1)return round;
    const c=courts[round.stage-1],ch=challenge(round.stage,round.shots,route,focused);
    if(round.stage<=6){
      const delta=power-ch.target,perfect=Math.abs(delta)<=ch.tolerance*.3,made=Math.abs(delta)<=ch.tolerance,points=made?(perfect?(c.perfect||2):1):0;
      return {...round,shots:round.shots+1,score:round.score+points,rival:round.rival+c.rival[round.shots],made:round.made+Number(made),perfect:round.perfect+Number(perfect),streak:made?round.streak+1:0,finished:round.shots+1>=c.shots,last:{kind:perfect?'perfect':made?'made':delta<0?'early':'late',points,delta,power,target:ch.target}};
    }
    if(route==='assist'&&round.assists<1)return round;
    const delta=power-ch.target,made=ch.open&&Math.abs(delta)<=ch.tolerance,perfect=made&&Math.abs(delta)<=ch.tolerance*.3,points=made?(route==='assist'?(perfect?3:2):(perfect?2:1)):0,streak=made?round.streak+1:0;
    return {...round,shots:round.shots+1,score:round.score+points,rival:round.rival+c.rival[round.shots],made:round.made+Number(made),perfect:round.perfect+Number(perfect),streak,finished:round.shots+1>=c.shots,assists:round.assists-Number(route==='assist'),focus:round.focus-Number(focused&&round.focus>0),bankMade:round.bankMade+Number(made&&route==='bank'),directMade:round.directMade+Number(made&&route==='direct'),assistMade:round.assistMade+Number(made&&route==='assist'),bestStreak:Math.max(round.bestStreak,streak),lastRoute:route,last:{kind:!ch.open?'blocked':perfect?'perfect':made?'made':delta<0?'early':'late',points,delta,power,target:ch.target,route,defense:ch.defense,focused:Boolean(focused&&round.focus>0)}};
  }
  function pass(round){
    if(!round||round.finished||round.stage<31||!courtFor(round.stage)||round.assists>=2)return round;
    const c=courts[round.stage-1];return {...round,shots:round.shots+1,rival:round.rival+c.rival[round.shots],assists:2,streak:0,lastRoute:'pass',finished:round.shots+1>=c.shots,last:{kind:'pass',points:0,route:'pass'}};
  }
  function goalsMet(round){
    const c=courtFor(round?.stage);if(!c)return false;const g=c.goals||{};
    return (!g.bank||round.bankMade>=g.bank)&&(!g.direct||round.directMade>=g.direct)&&(!g.assist||round.assistMade>=g.assist)&&(!g.perfect||round.perfect>=g.perfect)&&(!g.streak||round.bestStreak>=g.streak)&&(!g.last||round.lastRoute===g.last);
  }
  const won=round=>Boolean(round?.finished&&round.score>round.rival&&goalsMet(round));
  const progressKey='weightplay-hoop-league-best-stage',progressRecordKey='weightplay-hoop-league-records-v2';
  function normalizeProgress(best,records={}){
    const n=Number(best),clean={};if(records&&typeof records==='object'&&!Array.isArray(records))for(const [k,v]of Object.entries(records)){const stage=Number(k);if(Number.isInteger(stage)&&stage>=1&&stage<=courts.length&&typeof v==='number'&&Number.isFinite(v)&&v>=0)clean[stage]=Math.floor(v);}
    return {best:Number.isFinite(n)?Math.max(0,Math.min(courts.length,Math.floor(n))):0,records:clean};
  }
  function mergeProgress(a,b){a=normalizeProgress(a?.best,a?.records);b=normalizeProgress(b?.best,b?.records);const records={...a.records};for(const [k,v]of Object.entries(b.records))records[k]=Math.max(records[k]||0,v);return {best:Math.max(a.best,b.best),records};}
  function readProgress(storage){let best=0,records={};try{best=storage.getItem(progressKey)||0;}catch{}try{records=JSON.parse(storage.getItem(progressRecordKey)||'{}');}catch{}return normalizeProgress(best,records);}
  function writeProgress(storage,value){
    // Both keys must be readable and confirmed before a clear can grant a
    // shared reward. Preserve unknown record fields instead of replacing an
    // unreadable or newer store with an empty fallback.
    const fallback=normalizeProgress(value?.best,value?.records);
    try{
      const rawBest=storage.getItem(progressKey),rawRecords=storage.getItem(progressRecordKey);
      if(rawBest!==null&&(!/^\d+$/.test(rawBest)||!Number.isSafeInteger(Number(rawBest))))throw Error('invalid progress');
      const oldRecords=rawRecords===null?{}:JSON.parse(rawRecords);
      if(!oldRecords||typeof oldRecords!=='object'||Array.isArray(oldRecords))throw Error('invalid records');
      for(const [key,score] of Object.entries(oldRecords))if(/^\d+$/.test(key)&&Number(key)>=1&&Number(key)<=courts.length&&(typeof score!=='number'||!Number.isFinite(score)||score<0))throw Error('invalid score');
      const next=mergeProgress(normalizeProgress(rawBest??0,oldRecords),value);
      const bestBytes=String(Math.max(Number(rawBest??0),next.best)),recordBytes=JSON.stringify({...oldRecords,...next.records});
      if(storage.getItem(progressKey)!==rawBest||storage.getItem(progressRecordKey)!==rawRecords)throw Error('stale progress');
      storage.setItem(progressKey,bestBytes);storage.setItem(progressRecordKey,recordBytes);
      if(storage.getItem(progressKey)!==bestBytes||storage.getItem(progressRecordKey)!==recordBytes)throw Error('unconfirmed progress');
      return {...next,saved:true};
    }catch{return {...fallback,saved:false};}
  }
  // Session-only pending state, kept source-equivalent to the reviewed model.
  function createHoopSaveReconciliation(writeChecked) {
    if (typeof writeChecked !== 'function') throw new TypeError('CHECKED_WRITER_REQUIRED');
    const pending = new Map();
    const receiptReview = new Set();
    const bestKey = 'weightplay-hoop-league-best-stage';
    const recordsKey = 'weightplay-hoop-league-records-v2';
    const validStage = stage => Number.isInteger(stage) && stage >= 1 && stage <= 60;
    const validScore = score => Number.isSafeInteger(score) && score >= 0;
    const validBest = best => Number.isSafeInteger(best) && best >= 0 && best <= 60;
    function snapshot() {
      return Object.freeze({saveUnconfirmed: pending.size > 0,
        pending: Object.freeze([...pending].sort(([a],[b]) => a-b).map(([stage,score]) => Object.freeze({stage,score}))),
        receiptUnverified: Object.freeze([...receiptReview].sort((a,b) => a-b))});
    }
    function recordWonSave(storage, stage, score, progress) {
      if (!validStage(stage) || !validScore(score)) throw new TypeError('INVALID_STAGE_OR_SCORE');
      if (!progress || !validBest(progress.best) || !progress.records || typeof progress.records !== 'object' || Array.isArray(progress.records)) throw new TypeError('INVALID_SESSION_PROGRESS');
      pending.set(stage, Math.max(pending.get(stage) ?? 0, score));
      receiptReview.add(stage);
      let result;
      const fallback = {best:progress.best,records:{...progress.records},saved:false};
      try { result = writeChecked(storage, progress); } catch { result = fallback; }
      if (!result || !validBest(result.best) || !result.records || typeof result.records !== 'object' || Array.isArray(result.records)) result = fallback;
      if (result?.saved === true && validBest(result.best) && result.records && typeof result.records === 'object' && !Array.isArray(result.records)) {
        try {
          const bestRaw = storage.getItem(bestKey), recordsRaw = storage.getItem(recordsKey);
          if (storage.getItem(bestKey) !== bestRaw || storage.getItem(recordsKey) !== recordsRaw) throw Error('READBACK_CHANGED');
          if (typeof bestRaw !== 'string' || !/^\d+$/.test(bestRaw)) throw Error('INVALID_BEST');
          const best = Number(bestRaw), records = JSON.parse(recordsRaw);
          if (!validBest(best) || !records || typeof records !== 'object' || Array.isArray(records)) throw Error('INVALID_READBACK');
          for (const [id, target] of pending) {
            const stored = records[id], returned = result.records[id];
            if (best >= id && result.best >= id && validScore(stored) && stored >= target && validScore(returned) && returned >= target) pending.delete(id);
          }
        } catch { /* Keep pending when a readback cannot be validated. */ }
      }
      return Object.freeze({saveResult:result,session:snapshot()});
    }
    function warningVisible(screen) { return pending.size > 0 && ['main','stage','battle','result'].includes(screen); }
    return Object.freeze({recordWonSave,snapshot,warningVisible});
  }
  globalThis.WeightPlayHoopRules=Object.freeze({courts,challenge,newRound,settle,pass,goalsMet,won,normalizeProgress,mergeProgress,readProgress,writeProgress,createHoopSaveReconciliation});
  if (typeof document === 'undefined') return;
  const $ = id => document.getElementById(id), locale = window.WeightPlayMarketFiveLocale;
  const common = i => window.wpMarketCommon(i);
  // All action/teaching copy is owned here so the guide never describes the old aim controls.
  const copy = {
    en:['Hold. Find the green zone. Release.','Finish ahead after the final shot. A basket earns 1; a perfect release earns 2 (3 on Bank Court).','HOLD','GREEN ZONE','RELEASE','Hold to shoot','Charging… release in green','Your next shot','PERFECT','BASKET','Too short — hold a little longer','Too strong — release a little earlier','Ball in flight…','COURT CLEARED','SO CLOSE','SHOTS','BEST','YOU','RIVAL','Keep the marker inside the green zone. The thin gold line is perfect.','Space / Enter also work. Leaving the tab cancels your charge.'],
    'zh-Hant':['按住蓄力，進入綠區，放開投籃。','最後一球後，分數比對手高就贏。進球 1 分，完美出手 2 分（擦板球場 3 分）。','按住','進入綠區','放開','按住投籃','蓄力中…進入綠區就放開','準備下一球','完美空心！','進球！','太短了：下次多按住一下','太大力：下次提早放開','籃球飛行中…','球場制霸','再來一場','球數','最佳','你','對手','讓游標落在綠色區域；中央金線就是完美出手。','鍵盤空白鍵／Enter 也能投籃，切換分頁會取消蓄力。'],
    'zh-Hans':['按住蓄力，进入绿区，松开投篮。','最后一球后，分数比对手高就赢。进球 1 分，完美出手 2 分（擦板球场 3 分）。','按住','进入绿区','松开','按住投篮','蓄力中…进入绿区就松开','准备下一球','完美空心！','进球！','太短了：下次多按住一下','太大力：下次提早松开','篮球飞行中…','球场称霸','再来一场','球数','最佳','你','对手','让游标落在绿色区域；中央金线就是完美出手。','键盘空格键／Enter 也能投篮，切换分页会取消蓄力。'],
    ja:['長押し。緑に合わせて離す。','最後のシュート後に相手を上回れば勝利。通常1点、完璧2点（バンクは3点）。','長押し','緑のゾーン','離す','長押しでシュート','緑で離そう','次のシュート','パーフェクト','ゴール','弱すぎ：もう少し長く','強すぎ：もう少し早く離す','ボール飛行中…','コートクリア','もう一度','シュート','ベスト','あなた','相手','緑の中で離す。中央の金線が完璧。','スペース／Enterでも操作。タブを離れるとチャージ取消。'],
    ko:['누르고, 초록 구간에서 놓으세요.','마지막 슛 후 상대보다 높으면 승리. 득점 1, 완벽 2(뱅크 3).','누르기','초록 구간','놓기','눌러서 슛','초록에서 놓으세요','다음 슛','완벽!','골!','짧아요 — 더 오래 누르세요','강해요 — 더 일찍 놓으세요','공이 날아갑니다…','코트 클리어','다시 도전','슛','최고','나','상대','초록 구간에서 놓으세요. 금색 선은 완벽한 슛입니다.','스페이스/Enter 지원. 탭을 떠나면 충전이 취소됩니다.'],
    es:['Mantén. Llega al verde. Suelta.','Acaba por delante. Canasta: 1; perfecta: 2 (3 en Tablero).','MANTÉN','ZONA VERDE','SUELTA','Mantén para tirar','Suelta en verde','Siguiente tiro','PERFECTO','CANASTA','Corto: mantén más tiempo','Fuerte: suelta antes','Balón en vuelo…','CANCHA SUPERADA','OTRO INTENTO','TIROS','MEJOR','TÚ','RIVAL','Suelta dentro del verde. La línea dorada es perfecta.','También Espacio/Enter. Cambiar de pestaña cancela la carga.'],
    'pt-BR':['Segure. Encontre o verde. Solte.','Termine à frente. Cesta: 1; perfeita: 2 (3 na Tabela).','SEGURE','ZONA VERDE','SOLTE','Segure para arremessar','Solte no verde','Próximo arremesso','PERFEITO','CESTA','Curto: segure mais','Forte: solte antes','Bola no ar…','QUADRA VENCIDA','TENTE DE NOVO','ARREMESSOS','MELHOR','VOCÊ','RIVAL','Solte no verde. A linha dourada é perfeita.','Espaço/Enter também funcionam. Sair da aba cancela a carga.'],
    fr:['Maintenez. Visez le vert. Relâchez.','Finissez devant. Panier : 1 ; parfait : 2 (3 au Panneau).','MAINTENEZ','ZONE VERTE','RELÂCHEZ','Maintenir pour tirer','Relâchez dans le vert','Prochain tir','PARFAIT','PANIER','Trop court : maintenez plus','Trop fort : relâchez plus tôt','Ballon en vol…','TERRAIN TERMINÉ','RÉESSAYEZ','TIRS','RECORD','VOUS','RIVAL','Relâchez dans le vert. La ligne dorée est parfaite.','Espace/Entrée aussi. Quitter l’onglet annule la charge.'],
    de:['Halten. Grün treffen. Loslassen.','Am Ende vorne liegen. Korb: 1; perfekt: 2 (Brett: 3).','HALTEN','GRÜNE ZONE','LOSLASSEN','Zum Werfen halten','Im Grünen loslassen','Nächster Wurf','PERFEKT','KORB','Zu kurz: länger halten','Zu stark: früher loslassen','Ball unterwegs…','PLATZ GESCHAFFT','NOCH EINMAL','WÜRFE','REKORD','DU','GEGNER','Im Grünen loslassen. Die goldene Linie ist perfekt.','Auch Leertaste/Enter. Tabwechsel bricht das Laden ab.'],
    it:['Tieni. Trova il verde. Rilascia.','Finisci in vantaggio. Canestro: 1; perfetto: 2 (Tabellone: 3).','TIENI','ZONA VERDE','RILASCIA','Tieni per tirare','Rilascia nel verde','Prossimo tiro','PERFETTO','CANESTRO','Corto: tieni più a lungo','Forte: rilascia prima','Palla in volo…','CAMPO SUPERATO','RIPROVA','TIRI','RECORD','TU','RIVALE','Rilascia nel verde. La linea dorata è perfetta.','Anche Spazio/Invio. Cambiare scheda annulla la carica.'],
    ru:['Удерживай. Попади в зелёное. Отпусти.','Закончи впереди. Корзина: 1; идеально: 2 (Щит: 3).','ДЕРЖИ','ЗЕЛЁНАЯ ЗОНА','ОТПУСТИ','Удерживай для броска','Отпусти в зелёном','Следующий бросок','ИДЕАЛЬНО','ПОПАДАНИЕ','Слабо: держи дольше','Сильно: отпускай раньше','Мяч в полёте…','ПЛОЩАДКА ПРОЙДЕНА','ЕЩЁ РАЗ','БРОСКИ','РЕКОРД','ТЫ','СОПЕРНИК','Отпусти в зелёной зоне. Золотая линия — идеал.','Пробел/Enter тоже работают. Смена вкладки отменяет заряд.'],
    hi:['दबाएँ। हरे में आएँ। छोड़ें।','अंत में प्रतिद्वंद्वी से आगे रहें। बास्केट: 1; सटीक: 2 (बैंक: 3)।','दबाएँ','हरा क्षेत्र','छोड़ें','शॉट के लिए दबाएँ','हरे में छोड़ें','अगला शॉट','सटीक!','बास्केट','कमज़ोर: थोड़ा और दबाएँ','तेज़: पहले छोड़ें','गेंद हवा में…','कोर्ट पूरा','फिर कोशिश','शॉट','सर्वश्रेष्ठ','आप','प्रतिद्वंद्वी','हरे क्षेत्र में छोड़ें। सुनहरी रेखा सटीक शॉट है।','स्पेस/Enter भी। टैब बदलने पर चार्ज रद्द होता है।'],
    ar:['اضغط. انتظر الأخضر. أفلت.','تقدّم بعد آخر رمية. السلة: 1؛ المثالية: 2 (اللوحة: 3).','اضغط','المنطقة الخضراء','أفلت','اضغط للتسديد','أفلت في الأخضر','الرمية التالية','مثالية!','سلة!','قصيرة: اضغط مدة أطول','قوية: أفلت أبكر','الكرة في الهواء…','اكتمل الملعب','حاول مجددًا','الرميات','الأفضل','أنت','المنافس','أفلت داخل الأخضر. الخط الذهبي مثالي.','المسافة/Enter أيضًا. مغادرة التبويب تلغي الشحن.']
  };
  const text = () => copy[locale.locale] || copy.en;
  const xp=()=>globalThis.HoopCampaignCopy[locale.locale]||globalThis.HoopCampaignCopy.en;
  const courtName=index=>index<6?locale.game().courts[index]:`${index<30?xp().chapter1:xp().chapter2} · ${index+1}`;
  let storage;try{storage=window.localStorage;}catch{};
  let {best,records}=readProgress(storage),storageOK=true;
  const saveSession=createHoopSaveReconciliation(writeProgress);
  let saveWarningViews={},saveWarningRevision=0;
  let selectedStageIndex=Math.min(courts.length-1,best),stageController=null;
  const state={screen:'main', round:newRound(1), charging:false, power:0, direction:1, flight:null, paused:false, raf:0, last:0, feedback:'', feedbackUntil:0, pointer:null};
  state.route='direct';state.focusArmed=false;
  let roundKey=null,restart=false,ended=false,outcome='complete',saveSucceeded=false;
  const readMeasurement=()=>({screen:state.screen==='battle'&&!ended?'battle':state.screen==='result'?null:state.screen,roundKey,started:Boolean(roundKey),ended,outcome,restart,stageId:roundKey?state.round.stage:null,stageIdAuthoritative:true,rewardEligible:true,saveSucceeded,paused:state.paused||document.hidden,node:document.body,activityMode:'input',idleSeconds:300,keyboardKeys:[' ','Enter']});
  const notify=()=>{try{const game=window.WonderAnalytics?.game;if(game?.supportsRewardEligibility===true&&game?.supportsSavedCompletionGate===true)game.observeState(readMeasurement);}catch{/* Older cached collectors cannot safely award saved stage clears. */}};
  window.addEventListener('weightplay:analytics-ready',notify);
  const canvas=$('arena'), ctx=canvas.getContext('2d'), hero=new Image(); hero.src='/assets/weightplay-character-boom-mane-lion-block-v1.webp';
  const teammate=new Image();teammate.src='/assets/weightplay-character-bubble-fin-otter-block-v1.webp';
  const result=$('result-screen'); result.classList.remove('screen'); result.removeAttribute('data-screen'); result.dataset.wpBattleSubstate='result';
  $('stage-screen').style.backgroundImage='none';
  $('battle-controls').innerHTML='<div class="hoop-meter-heading"><b id="hoop-meter-label"></b><span id="hoop-shot-count"></span></div><div id="hoop-release-track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="hoop-zone"></i><i id="hoop-perfect"></i><i id="hoop-marker"></i></div><div class="hoop-meter-legend"><span>0</span><strong id="hoop-zone-label"></strong><span>100</span></div><button type="button" data-action="shoot" data-wp-primary-action class="primary-control" id="hoop-shoot"></button>';
  const shoot=$('hoop-shoot'), meter=$('hoop-release-track'), marker=$('hoop-marker');
  const tactics=document.createElement('div');tactics.id='hoop-tactics';tactics.innerHTML='<div id="hoop-routes" role="group"><button type="button" data-route="direct"></button><button type="button" data-route="bank"></button><button type="button" data-route="assist"></button></div><div id="hoop-tools"><button type="button" id="hoop-pass"></button><button type="button" id="hoop-focus" aria-pressed="false"></button></div>';$('battle-controls').prepend(tactics);
  const objectives=document.createElement('div');objectives.id='hoop-objectives';objectives.innerHTML='<b id="hoop-defense"></b><span id="hoop-goals"></span>';$('battle-status').after(objectives);
  const focusButton=$('hoop-focus'),passButton=$('hoop-pass');
  function goalSummary(r){const g=courts[r.stage-1].goals||{},x=xp(),parts=[];for(const [key,field,label]of [['direct','directMade',x.direct],['bank','bankMade',x.bank],['assist','assistMade',x.assist],['perfect','perfect',text()[8]],['streak','bestStreak',x.streak]])if(g[key])parts.push(label+' '+Math.min(r[field]||0,g[key])+'/'+g[key]);if(g.last)parts.push(x.last+' '+x[g.last]);return parts.join(' · ');}
  function tacticsHud(){const r=state.round,ch=challenge(r.stage,Math.min(r.shots,courts[r.stage-1].shots-1),state.route,state.focusArmed),x=xp(),locked=Boolean(state.charging||state.flight||state.paused||r.finished);tactics.hidden=r.stage<=6;objectives.hidden=r.stage<=6;document.body.dataset.hoopChapter=r.stage<=6?'original':r.stage<=30?'routes':'relay';
    for(const b of tactics.querySelectorAll('[data-route]')){const route=b.dataset.route;b.hidden=route==='assist'&&r.stage<31;b.textContent=x[route]+(route==='assist'?' '+r.assists:'');b.setAttribute('aria-pressed',String(route===state.route));b.disabled=locked||(route==='assist'&&!r.assists);}
    $('hoop-routes').setAttribute('aria-label',x.goals);passButton.hidden=r.stage<31;passButton.textContent=x.pass+' +2';passButton.disabled=locked||r.assists>=2;focusButton.textContent=x.focus+' '+r.focus;focusButton.setAttribute('aria-pressed',String(state.focusArmed));focusButton.disabled=locked||!r.focus;
    const defenseText=x[{O:'open',R:'rim',B:'board',A:'relay'}[ch.defense]||'open'];$('hoop-defense').textContent=(r.stage<=30&&['R','B'].includes(ch.defense)?defenseText.split(/[：:]/)[0]+' · '+x[ch.defense==='R'?'bank':'direct']:defenseText)+(r.stage>=31?' · '+x.charges+' '+r.assists+'/2':'');$('hoop-goals').textContent=goalSummary(r);
  }
  tactics.querySelectorAll('[data-route]').forEach(button=>button.onclick=()=>{if(button.disabled||state.screen!=='battle')return;state.route=button.dataset.route;state.feedback='';hud();sound('ui.click');});
  focusButton.onclick=()=>{if(focusButton.disabled||state.screen!=='battle')return;state.focusArmed=!state.focusArmed;hud();sound('ui.click');};
  passButton.onclick=()=>{if(passButton.disabled||state.screen!=='battle')return;const next=pass(state.round);if(next===state.round)return;state.focusArmed=false;state.flight={t:0,power:.5,kind:'pass',route:'pass',delta:0,pending:next};state.feedback='';sound('projectile.launch');hud();};
  const score=document.createElement('div'); score.className='hoop-scoreboard'; score.innerHTML='<div><span id="hoop-you"></span><b id="hoop-score">0</b></div><span class="hoop-score-divider">:</span><div><span id="hoop-rival"></span><b id="hoop-opponent">0</b></div>'; canvas.parentElement.append(score);
  const steps=document.createElement('div'); steps.className='hoop-steps'; steps.innerHTML='<span><b>01</b><i></i></span><span><b>02</b><i></i></span><span><b>03</b><i></i></span>'; document.querySelector('.m5-copy').prepend(steps);
  const help=document.createElement('div'); help.className='hoop-help'; help.hidden=true;help.setAttribute('role','dialog');help.setAttribute('aria-modal','true'); help.innerHTML='<p></p><button type="button">×</button>'; $('battle-screen').append(help);
  help.querySelector('button').onclick=()=>{help.hidden=true;state.paused=false;state.last=performance.now();hud();shoot.focus();};
  const leave=document.createElement('section'); leave.className='hoop-leave-dialog'; leave.hidden=true; leave.setAttribute('role','dialog');leave.setAttribute('aria-modal','true');leave.innerHTML='<div class="hoop-leave-card"><p></p><div class="hoop-leave-actions"><button type="button" id="hoop-continue">▶</button><button type="button" id="hoop-exit">←</button></div></div>'; $('battle-screen').append(leave);
  const sound=id=>window.WeightPlayAudio?.play(id);
  window.WeightPlayAudio?.preload(['game.start','projectile.launch','sport.goal','sport.bounce','result.win','result.lose','ui.click','feedback.success']);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function swap(node,value){
    const next=String(value);if(node.textContent===next)return;node.textContent=next;
    node.getAnimations().forEach(a=>a.cancel());node.animate([{opacity:.45},{opacity:1}],{duration:reduced.matches?70:150});
  }
  const save=()=>{const settled=saveSession.recordWonSave(storage,state.round.stage,state.round.score,{best,records}),merged=settled.saveResult;best=merged.best;records=merged.records;saveSucceeded=merged.saved&&!settled.session.pending.some(item=>item.stage===state.round.stage);storageOK=saveSucceeded;};
  function syncSaveWarning(){
    const revision=++saveWarningRevision;
    const pending=saveSession.snapshot().pending.map(item=>item.stage);
    for(const [scene,view] of Object.entries(saveWarningViews)){view.update({pending,locale:locale.locale,active:state.screen===scene});if(revision!==saveWarningRevision)return;}
    result.setAttribute('aria-describedby',pending.length?'result-copy hoop-result-pending-status':'result-copy');
  }
  window.addEventListener('storage',e=>{if(e.key!==null&&e.key!==progressKey&&e.key!==progressRecordKey)return;const merged=mergeProgress({best,records},readProgress(storage));best=merged.best;records=merged.records;progress();refreshStage();});
  function progress(){ $('main-progress').textContent=`${text()[16]} · ${best} / ${courts.length}`; }
  function refreshStage(){stageController?.refresh(selectedStageIndex);}
  function selectStage(index){selectedStageIndex=Math.max(0,Math.min(courts.length-1,Math.round(index)));}
  function openRecommendedStage(){selectedStageIndex=Math.min(courts.length-1,best);show('stage');}
  function cancel(){state.charging=false;state.power=0;state.pointer=null;state.input=null;shoot.classList.remove('charging');}
  function show(scene){
    if(scene==='result'){ended=true;outcome=won(state.round)?'win':'lose';}
    else if(state.screen==='battle'&&scene!=='battle'&&!ended){ended=true;outcome='abandon';}
    cancel();state.screen=scene;state.paused=false;help.hidden=true;leave.hidden=true;
    document.body.dataset.screen=scene==='result'?'battle':scene;
    for(const id of ['main','stage','battle']){const node=$(id+'-screen'),on=id===scene||(id==='battle'&&scene==='result');node.hidden=!on;node.classList.toggle('active',on);}
    result.hidden=scene!=='result';
    $('battle-controls').inert=scene==='result';
    if(result.parentElement){for(const node of result.parentElement.children)if(node!==result&&node!==help&&node!==leave)node.inert=scene==='result';}
    $('battle-screen').querySelector(':scope > header')?.toggleAttribute('inert',scene==='result');
    if(scene==='stage')refreshStage();
    window.dispatchEvent(new CustomEvent(scene==='battle'?'weightplay:battle-open':'weightplay:shell-sync'));
    window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
    state.last=performance.now();
    syncSaveWarning();notify();
  }
  function start(stage){if(!courtFor(stage)||stage>best+1)return;selectedStageIndex=stage-1;roundKey={};ended=false;outcome='complete';restart=false;saveSucceeded=false;state.round=newRound(stage);state.route='direct';state.focusArmed=false;state.flight=null;state.feedback='';show('battle');$('stage-label').textContent=(stage<=6?courtName(stage-1):stage+' / '+courts.length);hud();sound('game.start');shoot.focus({preventScroll:true});}
  function hud(){
    const t=text(),r=state.round,c=courts[r.stage-1],ch=challenge(r.stage,Math.min(r.shots,c.shots-1),state.route,state.focusArmed);
    $('score-label').textContent=`${r.shots} / ${c.shots}`;swap($('hoop-score'),r.score);swap($('hoop-opponent'),r.rival);
    $('hoop-shot-count').textContent=`${t[15]} \u2066${Math.min(r.shots+1,c.shots)} / ${c.shots}\u2069`;
    $('hoop-zone').style.left=`${(ch.target-ch.tolerance)*100}%`;$('hoop-zone').style.width=`${ch.tolerance*200}%`;
    $('hoop-perfect').style.left=`${ch.target*100}%`;
    shoot.disabled=Boolean(state.flight)||r.finished;shoot.textContent=state.flight?t[12]:state.charging?t[6]:t[5];
    $('hoop-meter-label').textContent=state.charging?t[6]:t[7];
    tacticsHud();
    const status=state.feedback||(r.stage>=7?xp()[state.route]+' · '+t[19]:t[19]);swap($('battle-status'),status);canvas.setAttribute('aria-label',`${locale.game().title}. ${status}. ${r.score} : ${r.rival}`);
  }
  function begin(input){if(state.screen!=='battle'||state.paused||state.flight||state.round.finished||state.charging)return;window.WeightPlayAudio?.unlock();state.charging=true;state.input=input;state.power=0;state.direction=1;shoot.classList.add('charging');hud();}
  function release(){
    if(!state.charging||state.screen!=='battle'||state.paused)return;
    const power=state.power;cancel();
    const next=settle(state.round,power,state.route,state.focusArmed);if(next===state.round)return;state.focusArmed=false;
    state.flight={t:0,power,kind:next.last.kind,route:state.route,delta:next.last.delta,pending:next};
    state.feedback='';sound('projectile.launch');hud();
  }
  function renderResult(){
    const r=state.round,win=won(r);
    $('result-title').textContent=text()[win?13:14];
    const pending=saveSession.snapshot().saveUnconfirmed;
    $('result-copy').textContent=`${text()[17]} ${r.score} : ${r.rival} ${text()[18]} · ${r.made}/${courts[r.stage-1].shots} · ${text()[8]} ×${r.perfect}${r.stage>=7?' · '+goalSummary(r):''}${win?(pending?'':` · ${xp().saveConfirmed}`):r.score>r.rival?' · '+xp().needGoals:` · ${state.feedback}`}`;
  }
  function land(now){
    const f=state.flight;state.round=f.pending;state.flight=null;
    const r=state.round,index={perfect:8,made:9,early:10,late:11}[r.last.kind];if(state.route==='assist'&&!r.assists)state.route='direct';state.feedback=`${r.last.kind==='pass'?xp().passDone:r.last.kind==='blocked'?xp().blocked:text()[index]}${r.last.points?` +${r.last.points}`:''}`;state.feedbackUntil=now+1400;
    sound(r.last.kind==='pass'?'feedback.success':r.last.points?'sport.goal':'sport.bounce');
    if(r.finished){
      const win=won(r);if(win){best=Math.max(best,r.stage);records[r.stage]=Math.max(Number(records[r.stage])||0,r.score);save();}
      renderResult();
      $('next').disabled=!win||r.stage===courts.length;$('next').setAttribute('aria-disabled',String($('next').disabled));show('result');progress();sound(win?'result.win':'result.lose');$('retry').focus({preventScroll:true});
    }
    hud();
  }
  shoot.addEventListener('pointerdown',e=>{if(e.button!==0||state.pointer!==null||state.charging)return;e.preventDefault();begin('pointer');if(state.charging){state.pointer=e.pointerId;shoot.setPointerCapture(e.pointerId);}});
  shoot.addEventListener('pointerup',e=>{if(state.pointer!==e.pointerId)return;e.preventDefault();release();});
  for(const type of ['pointercancel','lostpointercapture'])shoot.addEventListener(type,()=>{if(state.charging){cancel();hud();}});
  window.addEventListener('keydown',e=>{if(![' ','Enter'].includes(e.key)||state.screen!=='battle'||state.paused||document.activeElement?.closest('.hoop-leave-dialog,.hoop-help')||document.activeElement?.tagName==='INPUT')return;if(document.activeElement!==shoot&&document.activeElement!==canvas&&document.activeElement!==document.body)return;e.preventDefault();if(!e.repeat)begin('keyboard');});
  window.addEventListener('keyup',e=>{if([' ','Enter'].includes(e.key)&&state.charging&&state.input==='keyboard'){e.preventDefault();release();}});
  window.addEventListener('blur',()=>{cancel();if(state.screen==='battle')state.paused=true;hud();});
  document.addEventListener('visibilitychange',()=>{cancel();if(document.hidden)state.paused=true;else if(help.hidden&&leave.hidden){state.paused=false;state.last=performance.now();}hud();});
  window.addEventListener('focus',()=>{if(help.hidden&&leave.hidden){state.paused=false;state.last=performance.now();hud();}});
  $('start-game').onclick=openRecommendedStage;$('stage-back').onclick=()=>show('main');
  $('battle-back').onclick=()=>{if(state.screen==='result'){selectedStageIndex=state.round.stage-1;show('stage');return;}cancel();state.paused=true;leave.querySelector('p').textContent=`${common(4)}? ${text()[1]}`;leave.hidden=false;hud();$('hoop-continue').textContent=common(1);$('hoop-exit').textContent=common(4);$('hoop-continue').focus();};
  $('hoop-continue').onclick=()=>{leave.hidden=true;state.paused=false;state.last=performance.now();hud();shoot.focus();};
  $('hoop-exit').onclick=()=>{selectedStageIndex=state.round.stage-1;show('stage');};
  leave.addEventListener('keydown',e=>{if(e.key==='Escape')$('hoop-continue').click();if(e.key==='Tab'){e.preventDefault();(document.activeElement===$('hoop-continue')?$('hoop-exit'):$('hoop-continue')).focus();}});
  $('battle-utility').onclick=()=>{cancel();state.paused=true;help.querySelector('p').textContent=`${text()[0]} ${text()[1]} ${text()[20]} ${state.round.stage>=7?xp().routeGuide+' '+xp().focusGuide+' '+xp().goalsGuide:''} ${state.round.stage>=31?xp().relayGuide:''}`;help.hidden=false;hud();help.querySelector('button').setAttribute('aria-label',common(3));help.querySelector('button').focus();};
  help.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();help.querySelector('button').click();}if(e.key==='Tab'){e.preventDefault();help.querySelector('button').focus();}});
  const overlayObserver=new MutationObserver(()=>{
    const blocked=!help.hidden||!leave.hidden, parent=help.parentElement;
    if(parent)for(const node of parent.children)if(node!==help&&node!==leave)node.inert=blocked||(state.screen==='result'&&node!==result);
    $('battle-screen').querySelector(':scope > header')?.toggleAttribute('inert',blocked||state.screen==='result');
    if(!blocked)$('battle-controls').inert=state.screen==='result';
    window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
  });
  overlayObserver.observe(help,{attributes:true,attributeFilter:['hidden']});overlayObserver.observe(leave,{attributes:true,attributeFilter:['hidden']});
  $('to-stages').onclick=()=>{selectedStageIndex=state.round.stage-1;show('stage');};$('retry').onclick=()=>{start(state.round.stage);restart=true;notify();};$('next').onclick=()=>{if(won(state.round)&&state.round.stage<courts.length)start(state.round.stage+1);};
  function localize(){
    const t=text();document.querySelectorAll('[data-m5-lede]').forEach(n=>n.textContent=xp().intro);document.querySelectorAll('[data-m5-guide]').forEach(n=>n.textContent=n.closest('#battle-screen')?t[0]:`${t[1]} ${t[19]} ${t[20]} ${xp().routeGuide} ${xp().focusGuide} ${xp().relayGuide} ${xp().goalsGuide}`);
    steps.querySelectorAll('i').forEach((n,i)=>n.textContent=t[i+2]);$('hoop-zone-label').textContent=t[3];$('hoop-you').textContent=t[17];$('hoop-rival').textContent=t[18];meter.setAttribute('aria-label',t[3]);progress();refreshStage();hud();
    document.querySelectorAll('.game-info-tags > span').forEach((n,i)=>n.textContent=t[i+2]);syncSaveWarning();if(state.screen==='result')renderResult();
  }
  window.addEventListener('weightplay:market-locale-change',localize);
  window.addEventListener('weightplay:interaction-state',()=>{
    const settingsOpen=[...document.querySelectorAll('.wp-frame-popover')].some(n=>!n.hidden);
    if(settingsOpen){cancel();state.paused=true;}
    else if(help.hidden&&leave.hidden){state.paused=false;state.last=performance.now();}
    hud();
  });
  function ball(x,y,r,spin=0){ctx.save();ctx.translate(x,y);ctx.rotate(spin);ctx.fillStyle='#ff9c47';ctx.strokeStyle='#512c26';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.moveTo(0,-r);ctx.lineTo(0,r);ctx.ellipse(0,0,r*.48,r,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
  function draw(now){
    const w=canvas.parentElement.clientWidth,h=canvas.parentElement.clientHeight;if(!w||!h)return;
    const dpr=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#102941');bg.addColorStop(1,'#081b2c');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    const scale=Math.min(w/860,h/460),ox=w/2-480*scale,oy=0;
    const worldH=h/scale, rimY=Math.max(175,worldH*.33), handY=worldH-155, floorY=worldH-25;
    ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
    const c=courts[state.round.stage-1];
    // Faceted skyline and full-width court use the same projection at every viewport.
    for(let i=0;i<14;i++){const x=i*76-30,hh=50+(i*37%90);ctx.fillStyle=i%2?'#193c52':'#20485b';ctx.fillRect(x,rimY+55-hh,62,hh);ctx.fillStyle='#315d69';ctx.fillRect(x,rimY+55-hh,12,hh);}
    ctx.fillStyle='#39706b';ctx.beginPath();ctx.moveTo(120,rimY+55);ctx.lineTo(840,rimY+55);ctx.lineTo(1040,worldH);ctx.lineTo(-80,worldH);ctx.fill();
    ctx.strokeStyle='#b4e9cc80';ctx.lineWidth=3;ctx.strokeRect(100,rimY+100,760,Math.max(80,floorY-rimY-100));ctx.beginPath();ctx.ellipse(480,(floorY+rimY+100)/2,120,60,0,0,Math.PI*2);ctx.moveTo(480,rimY+100);ctx.lineTo(480,floorY);ctx.stroke();
    ctx.save();ctx.translate(0,rimY-238);
    ctx.fillStyle='#152b40';ctx.fillRect(761,157,18,252);ctx.fillStyle='#8db5c4';ctx.fillRect(670,120,170,116);ctx.fillStyle='#edf2db';ctx.fillRect(678,128,154,100);ctx.strokeStyle='#ff795c';ctx.lineWidth=5;ctx.strokeRect(724,168,62,49);
    ctx.strokeStyle=c.color;ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(727,238,48,10,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#eff6e2b0';ctx.lineWidth=2;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(681+i*15,240);ctx.lineTo(699+i*9,288);ctx.stroke();}ctx.beginPath();ctx.moveTo(700,288);ctx.lineTo(753,288);ctx.stroke();
    ctx.restore();
    const jump=state.flight?Math.sin(Math.min(1,state.flight.t)*Math.PI)*14:state.charging?-state.power*9:0;
    ctx.fillStyle='#07152265';ctx.beginPath();ctx.ellipse(242,floorY-9,90,17,0,0,Math.PI*2);ctx.fill();
    if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,105,floorY-250-jump,250,250);else{ctx.fillStyle='#ffc35b';ctx.fillRect(170,floorY-185-jump,110,160);}
    const ch=challenge(state.round.stage,state.round.shots,state.route,state.focusArmed);
    if(state.round.stage>=7){ctx.save();ctx.fillStyle=ch.defense==='A'?'#bf8af0':'#dc7a6a';ctx.strokeStyle='#ffe9bd';ctx.lineWidth=3;if(ch.defense==='R'){ctx.fillRect(678,rimY-12,98,16);ctx.strokeRect(678,rimY-12,98,16);}if(ch.defense==='B'){ctx.fillRect(722,rimY-90,68,54);ctx.strokeRect(722,rimY-90,68,54);}if(ch.defense==='A'){ctx.fillRect(665,rimY-28,125,15);ctx.fillRect(665,rimY-75,15,62);ctx.fillRect(775,rimY-75,15,62);}ctx.restore();}
    if(state.round.stage>=31&&teammate.complete&&teammate.naturalWidth){ctx.drawImage(teammate,445,floorY-195,180,180);for(let i=0;i<2;i++){ctx.fillStyle=i<state.round.assists?'#f3d47f':'#18384b';ctx.strokeStyle='#f3d47f';ctx.lineWidth=3;ctx.fillRect(491+i*35,floorY-210,24,24);ctx.strokeRect(491+i*35,floorY-210,24,24);}}
    function point(route,t,power,delta=0,made=true){const ex=made?727:727+delta*420,ey=made?rimY:rimY+54+Math.abs(delta)*65;if(route==='pass')return {x:310+230*t,y:handY-50*t-55*Math.sin(Math.PI*t)};if(route==='bank'){if(t<=.72){const q=t/.72;return {x:310+484*q,y:handY+(rimY-66-handY)*q-(165+power*80)*Math.sin(Math.PI*q)};}const q=(t-.72)/.28;return {x:794+(ex-794)*q,y:rimY-66+(ey-rimY+66)*q-12*Math.sin(Math.PI*q)};}const sx=route==='assist'?540:310,sy=route==='assist'?handY-50:handY;return {x:sx+(ex-sx)*t,y:sy+(ey-sy)*t-(route==='assist'?140+power*80:170+power*130)*Math.sin(Math.PI*t)};}
    ctx.save();ctx.setLineDash([5,13]);ctx.strokeStyle=ch.open===false?'#ff8e85b0':state.charging?'#b0f4d0b0':'#b0f4d03c';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=40;i++){const p=point(state.route,i/40,ch.target);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.stroke();ctx.restore();
    if(state.flight){const f=state.flight,t=Math.min(1,f.t),p=point(f.route,t,f.power,f.delta,['perfect','made','pass'].includes(f.kind));ball(p.x,p.y,21,t*8);if(f.route==='bank'&&t>=.72&&t<.84){ctx.save();ctx.globalAlpha=reduced.matches?.35:(.84-t)/.12;ctx.strokeStyle='#ffe298';ctx.lineWidth=5;ctx.strokeRect(775,rimY-85,38,38);ctx.restore();}}
    else {const p=point(state.route,0,ch.target);ball(p.x,p.y-jump,21,state.power*.4);}
    ctx.restore();
  }
  function frame(now){
    const dt=Math.min(.05,Math.max(0,(now-state.last)/1000));state.last=now;
    if(state.screen==='battle'&&!state.paused){
      if(state.charging){state.power+=dt*challenge(state.round.stage,state.round.shots,state.route,state.focusArmed).speed*state.direction;if(state.power>=1){state.power=1;state.direction=-1;}if(state.power<=0){state.power=0;state.direction=1;}}
      if(state.flight){const f=state.flight;f.t+=dt/(f.route==='pass'?.65:1.05);if(f.route==='bank'&&f.t>=.72&&!f.bounced){f.bounced=true;sound('sport.bounce');}if(f.t>=1)land(now);}
      if(state.feedback&&now>state.feedbackUntil&&!state.round.finished){state.feedback='';hud();}
    }
    marker.style.left=`${state.power*100}%`;meter.setAttribute('aria-valuenow',String(Math.round(state.power*100)));
    const ch=challenge(state.round.stage,state.round.shots,state.route,state.focusArmed);meter.classList.toggle('in-zone',state.charging&&ch.open!==false&&Math.abs(state.power-ch.target)<=ch.tolerance);
    if(state.screen==='battle'||state.screen==='result')draw(now);state.raf=requestAnimationFrame(frame);
  }
  document.body.dataset.wpGameVersion='v10';document.body.dataset.wpInterfaceVersion='9';
  window.WeightPlayHoopLeagueI9=Object.freeze({
    courts,
    selectedStage:()=>selectedStageIndex,
    currentScreen:()=>state.screen==='result'?'battle':state.screen,
    isCovered:()=>state.screen==='result'||!help.hidden||!leave.hidden,
    getCopy:()=>text(),
    getBest:()=>best,
    getRecords:()=>records,
    getCourtName:courtName,
    getChapterName:index=>index<30?xp().chapter1:xp().chapter2,
    getStageGoals:index=>index<6?text()[1]:goalSummary(newRound(index+1)),
    getStageGuide:index=>index<6?[text()[1],text()[19],text()[20]]:[xp().routeGuide,xp().focusGuide,...(index>=30?[xp().relayGuide]:[]),xp().goalsGuide],
    selectStage,
    startStage:index=>{const stage=index+1;if(stage<=Math.min(courts.length,best+1))start(stage);},
    attachStageController(controller){stageController=controller;refreshStage();},
    attachSaveWarningViews(views){saveWarningViews=views;syncSaveWarning();},
    refreshStage,
  });
  window.HoopLeagueDiagnostics=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({screen:state.screen,round:state.round,charging:state.charging,power:state.power,route:state.route,focusArmed:state.focusArmed,flight:state.flight,paused:state.paused,best,records,storageOK,total:courts.length}))});
  const ready=()=>{localize();show('main');$('loadingPanel').hidden=true;$('loadingPanel').classList.add('hidden');};
  Promise.all([hero.decode(),teammate.decode()]).then(ready).catch(()=>{const panel=$('loadingPanel');panel.classList.add('has-error');panel.textContent='Unable to load court. Please reload.';});
  state.last=performance.now();state.raf=requestAnimationFrame(frame);
  window.addEventListener('pagehide',()=>{cancel();cancelAnimationFrame(state.raf);},{once:true});
  window.addEventListener('pageshow',e=>{if(e.persisted){state.last=performance.now();state.raf=requestAnimationFrame(frame);}});
})();
