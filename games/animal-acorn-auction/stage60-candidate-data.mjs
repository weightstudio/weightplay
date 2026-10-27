// ISOLATED DESIGN DRAFT. Not imported by Acorn Auction and not a save format.
// 31–60 are candidate contracts; the original 1–30 runtime remains untouched.
// A ticket costs one market coin, may protect one visibly marked lot immediately
// before its rival bell, and preserves that lot for exactly that one bell.
// Once purchased it is non-refundable and its lot must be in the final bid.
const L=(count,gold,origin,prices,rival=0)=>({count,gold,origin,prices,rival});
const S=(id,name,goal,budget,slots,gold,bells,lots,extra={})=>({id,name,goal,budget,slots,gold,bells,lots,checkpoint:id%5===0,fee:1,...extra});
export const CHAPTER2=[
 // 31–35: observe the reserve timing and its real fee.
 S(31,'First holding ticket',7,14,2,3,1,[L(4,2,'grove',[8,6],1),L(3,1,'hill',[6,5]),L(7,2,'river',[13,11])],{decision:'Reserve A before the bell for a cheaper qualifying pair; compare the immediate purchase.',difference:'First ticket teaches cost and one-bell protection.'}),
 S(32,'Choose one rival',5,9,1,0,1,[L(5,0,'grove',[9,5],1),L(5,0,'hill',[8,6],1),L(3,0,'river',[3,2])],{decision:'Only one departing matching crate may be held.',difference:'Two rivals leave together; compare which protection pays.'}),
 S(33,'Fee at the limit',5,8,1,0,1,[L(5,0,'grove',[9,8],1),L(5,0,'hill',[7,7]),L(3,0,'river',[3,3])],{decision:'Notice that ticket plus the first crate exceeds the budget.',difference:'The ticket is a tempting but invalid expense.'}),
 S(34,'A later rival',4,9,1,0,2,[L(4,0,'grove',[6,4,2],1),L(4,0,'hill',[9,6,3],2),L(2,0,'river',[3,2,1])],{decision:'Compare protecting the first-bell lot with reserving the second-bell lot later.',difference:'The single ticket cannot protect both departure times.'}),
 S(35,'Twin crate inspection',6,12,2,0,1,[L(6,3,'grove',[10,9],1),L(4,2,'hill',[7,3],1),L(2,1,'river',[5,4])],{decision:'Choose which of two different qualifying rival lots to protect.',difference:'Checkpoint compares a single crate with a qualifying pair when both have rivals.'}),
 // 36–40: choose when to spend the one ticket across two rival bells.
 S(36,'Two departures',7,10,2,3,2,[L(7,1,'grove',[9,8,7]),L(3,2,'hill',[5,3,2],1),L(4,1,'river',[6,5,4],2)],{decision:'Protect the first departing half and buy before its protection expires.',difference:'The immediate qualifying pair is over budget, and the halves leave at different bells.'}),
 S(37,'Ticket or basket',6,12,2,2,2,[L(6,1,'grove',[9,8,7]),L(2,1,'hill',[5,3,2],1),L(4,1,'river',[6,4,3],2)],{decision:'Compare an immediate pair against protecting its first half.',difference:'Gold excludes the tempting single crate.'}),
 S(38,'Late marked crate',8,14,2,2,2,[L(8,1,'grove',[10,9,8],1),L(5,1,'hill',[7,6,3],2),L(3,1,'river',[5,4,3])],{decision:'Decide whether to save the ticket for the second bell.',difference:'A late rival controls the cheaper qualifying pair.'}),
 S(39,'Early seal',6,11,2,3,2,[L(6,2,'grove',[9,8,7],2),L(2,2,'hill',[4,3,2],1),L(4,1,'river',[6,5,4])],{decision:'The gold seal requires the departing small crate.',difference:'A single large crate has insufficient quality.'}),
 S(40,'Closing rival pair',9,14,2,3,2,[L(9,2,'grove',[11,10,8]),L(5,2,'hill',[7,4,3],1),L(4,1,'river',[6,3,2],1)],{decision:'One ticket cannot save both marked halves; buy their pair before the first bell.',difference:'Checkpoint tests simultaneous departures and prevents double protection.'}),
 // 41–45: tied lots must travel together or not at all.
 S(41,'The twine pair',4,10,2,0,1,[L(2,0,'grove',[2,2]),L(2,0,'hill',[4,2],1),L(2,0,'river',[4,3])],{pair:[1,2],decision:'Reject cheaper count-matching combinations that split the tied pair.',difference:'Introduces a binding both-or-neither condition.'}),
 S(42,'First two tied',4,11,2,0,2,[L(2,0,'grove',[5,3,2],1),L(2,0,'hill',[5,4,3]),L(2,0,'river',[2,2,2])],{pair:[0,1],decision:'Protect the first marked half; a cheaper pair with the decoy splits the knot.',difference:'The tied positions change and the rival leaves at the first bell.'}),
 S(43,'A different knot',6,14,2,0,2,[L(3,0,'grove',[7,5,3],2),L(3,0,'hill',[2,2,2]),L(3,0,'river',[5,4,2])],{pair:[0,2],decision:'Save the ticket for the tied half’s second-bell departure, not the low-price decoy.',difference:'Nonadjacent tied lots and a later rival.'}),
 S(44,'A ticket with the knot',4,12,2,0,1,[L(2,0,'grove',[3,3]),L(2,0,'hill',[6,3],1),L(2,0,'river',[5,4])],{pair:[1,2],decision:'Compare the tied pair now against paying a ticket to buy it later.',difference:'Protecting one tied half creates a genuine timing alternative.'}),
 S(45,'The knot inspector',6,15,2,0,2,[L(3,0,'grove',[7,4,3],1),L(3,0,'hill',[2,2,2]),L(3,0,'river',[7,4,3],1)],{pair:[0,2],decision:'Both tied lots leave at the same bell; one ticket cannot save the pair.',difference:'Checkpoint requires buying the pair early rather than splitting it or waiting.'}),
 // 46–50: orders explicitly require produce from two distinct origins.
 S(46,'Two orchards',4,10,2,0,1,[L(2,0,'grove',[4,3]),L(2,0,'grove',[3,4]),L(2,0,'hill',[5,2],1)],{origins:2,decision:'Reject the same-origin pair even though its quantity and price match.',difference:'Introduces a binding origin requirement.'}),
 S(47,'Same-source decoy',4,12,2,2,2,[L(2,2,'grove',[5,3,2],1),L(2,0,'grove',[3,3,2]),L(2,0,'hill',[6,4,3])],{origins:2,decision:'Meet gold and source separately: one decoy misses provenance, another misses quality.',difference:'Both new provenance and existing gold condition exclude distinct pairs.'}),
 S(48,'Source and gold',4,13,2,2,2,[L(2,2,'grove',[6,4,3],2),L(2,1,'hill',[6,5,3]),L(2,0,'grove',[3,2,2])],{origins:2,decision:'The cheap same-origin pair meets gold but not the source requirement.',difference:'A late rival marks the qualifying gold crate.'}),
 S(49,'Short basket route',6,14,2,3,1,[L(3,1,'grove',[4,5]),L(3,2,'grove',[6,4]),L(3,1,'hill',[7,4],1)],{origins:2,decision:'Use the gold crate and a different-source crate; the cheaper same-source pair is invalid.',difference:'A rising alternative changes whether waiting with a ticket pays.'}),
 S(50,'Market delegation',6,15,2,3,2,[L(3,2,'grove',[7,5,3],1),L(3,1,'grove',[4,4,3]),L(3,1,'hill',[7,6,4],2)],{origins:2,decision:'Only one pair satisfies both gold and distinct-source constraints.',difference:'Checkpoint separates a same-source gold decoy from a low-gold mixed pair.'}),
 // 51–55: each future price is explicit and may rise rather than fall.
 S(51,'A rising crate',5,10,1,0,2,[L(5,0,'grove',[6,8,10],1),L(5,0,'hill',[9,6,4],2),L(3,0,'river',[4,3,2])],{decision:'Buy the rising crate now or preserve the falling late crate.',difference:'Introduces a visible rising price beside a falling one.'}),
 S(52,'The price crossing',6,12,2,0,2,[L(6,0,'grove',[9,8,7],1),L(2,0,'hill',[3,4,5]),L(4,0,'river',[8,5,2],2)],{decision:'Balance a rising filler against a falling matching crate.',difference:'Prices cross over the two bells.'}),
 S(53,'Pay for protection',7,13,2,2,1,[L(7,1,'grove',[9,8]),L(3,1,'hill',[5,5],1),L(4,1,'river',[6,7])],{decision:'Recognize that the ticket and rising price can outweigh waiting.',difference:'Protection is legal but not necessarily economical.'}),
 S(54,'Late tied shipment',4,15,2,0,2,[L(2,0,'grove',[8,6,3],2),L(2,0,'hill',[2,2,2]),L(2,0,'river',[4,5,6])],{pair:[0,2],decision:'Compare falling and rising tied halves while rejecting a cheaper split pair.',difference:'A binding nonadjacent knot interacts with opposite forecasts.'}),
 S(55,'Forecast inspection',6,16,2,3,2,[L(3,2,'grove',[8,7,4],2),L(3,1,'grove',[4,4,3]),L(3,1,'hill',[6,7,8])],{origins:2,decision:'Protect the later gold crate while paying a rising price on its different-source partner.',difference:'Checkpoint excludes one same-source and one low-quality pair.'}),
 // 56–60: mastery and a multi-rule festival finale.
 S(56,'One ticket, two bells',4,14,2,2,2,[L(2,2,'grove',[7,5,3],2),L(2,0,'grove',[3,3,2],1),L(2,0,'hill',[7,6,4])],{origins:2,decision:'Protect the qualifying late gold crate; cheaper pairs miss origin or quality.',difference:'An early rival is a decoy for the one available ticket.'}),
 S(57,'Pairs under pressure',6,15,2,0,2,[L(3,0,'grove',[8,6,3],1),L(3,0,'hill',[2,2,2],2),L(3,0,'river',[6,4,3])],{pair:[0,2],decision:'Time the tied pair before its protected half expires.',difference:'An alternative rival competes for the ticket but cannot split the knot.'}),
 S(58,'Two-origin seal',7,14,2,0,2,[L(3,1,'grove',[5,3,2],1),L(4,1,'hill',[7,5,3],2),L(7,2,'river',[9,8,7])],{origins:2,decision:'Reject the matching single-origin crate and hold the correct half of a mixed pair.',difference:'A one-crate quantity match fails the explicit provenance condition.'}),
 S(59,'Pair at the turning price',6,14,2,0,2,[L(3,0,'grove',[7,5,3],2),L(3,0,'hill',[2,2,2],1),L(3,0,'river',[5,6,7])],{pair:[0,2],decision:'Balance the late discount against the tied partner’s rising price and fee.',difference:'A cheap split pair is invalid; the permitted pair has opposite forecasts.'}),
 S(60,'Festival of shared harvest',4,13,2,2,2,[L(2,2,'grove',[7,5,3],2),L(2,0,'hill',[6,4,2],1),L(2,1,'grove',[6,6,5])],{origins:2,decision:'Compare buying the qualifying pair now with protecting the first rival for a cheaper deal.',difference:'Finale rejects one same-source gold pair and one low-gold mixed pair before comparing two buying times.'})
];

// Candidate is immutable data only; no game entry imports this module.
const freezeData = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeData);
    Object.freeze(value);
  }
  return value;
};
freezeData(CHAPTER2);
