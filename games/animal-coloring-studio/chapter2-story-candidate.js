(function (root, factory) {
  'use strict';
  const value=factory();
  if(typeof module==='object'&&module.exports)module.exports=value;
  if(root)root.AnimalColoringStudioStoryCandidate=value;
})(typeof window==='undefined'?globalThis:window,function(){
  'use strict';
  // Design data only. No gate, progression, image or stamp is approved.
  const rows=[
    [31,'arriving-bee','A bee arrives at a garden gate','place',['flower','leaf'],'Place a flower beside the path.'],
    [32,'butterfly-garden','A butterfly visits a flower bed','place',['flower','sun'],'Choose a sunny place for a flower.'],
    [33,'rabbit-picnic','A rabbit brings a garden picnic','place',['leaf','flower'],'Add a leaf near the picnic.'],
    [34,'hedgehog-mushrooms','A hedgehog visits mushrooms','place',['leaf','sun'],'Place a leaf where it fits the scene.'],
    [35,'garden-gathering','Two friends meet at the gate','place',['flower','leaf','sun'],'Checkpoint: make a welcoming garden.'],
    [36,'turtle-shore','A turtle follows a shore path','size',['shell','cloud'],'Compare a small and a large shell.'],
    [37,'fish-reef','A fish explores a coral arch','size',['droplet','shell'],'Choose a size for a water drop.'],
    [38,'dolphin-wave','A dolphin crosses a wave','size',['droplet','sun'],'Use two sizes around the wave.'],
    [39,'seal-cove','A seal rests in a quiet cove','size',['shell','cloud'],'Choose a shell size for the cove.'],
    [40,'ocean-meeting','Two friends meet beside the sea','size',['shell','droplet','sun'],'Checkpoint: arrange large and small sea details.'],
    [41,'owl-evening','An owl watches the evening sky','flip',['star','cloud'],'Mirror a cloud while arranging the sky.'],
    [42,'fox-moonpath','A fox walks a moonlit path','flip',['leaf','star'],'Flip a leaf beside the path.'],
    [43,'deer-glade','A deer finds a clearing','flip',['leaf','cloud'],'Try a mirrored leaf in the clearing.'],
    [44,'squirrel-acorn','A squirrel carries an acorn','flip',['acorn','leaf'],'Turn a leaf toward the squirrel.'],
    [45,'woodland-night','Two friends share a woodland night','flip',['star','leaf','acorn'],'Checkpoint: choose direction and position.'],
    [46,'panda-bamboo','A panda visits a bamboo grove','layers',['leaf','sun'],'Move a leaf in front of another sticker.'],
    [47,'monkey-vines','A monkey follows a vine','layers',['leaf','flower'],'Try a flower behind a leaf.'],
    [48,'alpaca-meadow','An alpaca visits a hillside meadow','layers',['cloud','flower'],'Change which sticker is in front.'],
    [49,'sheep-hill','A sheep watches clouds over a hill','layers',['cloud','sun'],'Arrange cloud and sun in two layers.'],
    [50,'hill-friends','Two friends meet on the hillside','layers',['cloud','leaf','sun'],'Checkpoint: arrange foreground and background stickers.'],
    [51,'penguin-ice','A penguin crosses an icy shore','story',['star','cloud'],'Choose details for a quiet cold morning.'],
    [52,'polar-bear','A bear watches the northern sky','story',['star','cloud'],'Place sky details to tell a night story.'],
    [53,'arctic-fox','A fox follows a snowy path','story',['cloud','star'],'Use size and position to guide the path.'],
    [54,'narwhal-water','A narwhal swims below ice','story',['droplet','star'],'Combine a water detail and a sky detail.'],
    [55,'northern-friends','Two friends share a polar evening','story',['star','cloud','droplet'],'Checkpoint: make a scene with near and far details.'],
    [56,'koala-camp','A koala rests by a campsite','compose',['leaf','star','cloud'],'Combine direction, size and layer.'],
    [57,'kangaroo-sunset','A kangaroo watches the sunset','compose',['sun','cloud','leaf'],'Create a sunset with overlapping stickers.'],
    [58,'camel-oasis','A camel arrives at an oasis','compose',['sun','droplet','leaf'],'Balance a water detail with a sunny sky.'],
    [59,'parrot-rainforest','A parrot rests among leaves','compose',['leaf','flower','sun'],'Build a layered rainforest greeting.'],
    [60,'habitat-festival','Three friends share a habitat festival','compose',['flower','shell','star','leaf'],'Final circle: compose a festival across habitats.']
  ];
  const checkpoints=Object.freeze([35,40,45,50,55,60]);
  const stages=Object.freeze(rows.map(([number,id,scene,lesson,stickers,prompt])=>Object.freeze({number,id:`coloring-story-${id}`,scene,lesson,stickers:Object.freeze(stickers),prompt,checkpoint:checkpoints.includes(number),art:'UNMADE_OR_UNREVIEWED',mask:'UNREVIEWED',implemented:false})));
  return Object.freeze({ready:false,chapter:'Story Collage',stages,checkpoints});
});
