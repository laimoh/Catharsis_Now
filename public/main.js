let generatedTexts = [];
let keys;

const handleStart = async () => {
   let response = await fetch('/keyword')
   let keywordsJSON = await response.json()
   keys = Array.from(keywordsJSON.list)
   console.log(keys)
   new p5(sketch);
}

let dt = new Date();
let h =  dt.getHours(), m = dt.getMinutes();
let _time = (h > 12) ? (h-12 + ':' + m +' PM') : (h + ':' + m +' AM');

let time = document.querySelector('.time')
time.innerHTML = _time

const sketch = p => {
   console.log('sketch start')
   let movers = [];
   let attractor,cnv;
   let font2 = p.loadFont('assets/DotGothic16-Regular.ttf');
 
   p.setup = function() {
      cnv = p.createCanvas(p.windowWidth, p.windowHeight)
      cnv.position(0, 0)
      cnv.style('z-index', -1);
      
      for (let i = 0; i < keys.length; i++) {
         let x = p.random(p.width);
         let y = p.random(p.height);
         let m = p.random(50, 150);
         movers[i] = new Mover(x, y, m, p);
      }
      attractor = new Attractor(p.width / 2, p.height / 2, 100, p);
   };

   // anytime my mouse comes in contact with a specific mover, we want to stop the mover from moving

   p.draw = function() {
     p.background(120) 
    for (let i = 0; i < movers.length; i++) {
      if (keys[i]) {
      movers[i].update();
      movers[i].show(keys[i], font2);
      movers[i].mouseOnText(p.mouseX, p.mouseY)
      attractor.attract(movers[i]);
    }}
   };
 };


Noise3k({
   // container: '#defaultCanvas0', // (optional || default: document.body) specify where the noise is applied
   grainSize: 1, // (optional || default: 1) Multiplier for the grain size
 });
