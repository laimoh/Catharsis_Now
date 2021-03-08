const postPerRequest = 100;
const maxPostsToFetch = 500;
const maxRequests = maxPostsToFetch / postPerRequest // 5 total requests
const responses = [] // stores all of em
let generatedTexts = [];
let keywords;
const handleStart = () => {
   fetchPosts()
}

const fetchPosts = async (afterParam) => {
   console.log('fetching data')
   const response = await fetch(`https://www.reddit.com/r/offmychest.json?limit=${postPerRequest}${
      afterParam ? '&after=' + afterParam : ''
   }`)
   const responseJSON = await response.json();
   responses.push(responseJSON);

   if (responseJSON.data.after && responses.length < maxRequests) {
      fetchPosts(responseJSON.data.after);
      return
   }
   parseResults(responses)
}
const parseResults = (r) => {
   // grab time the post was made here
   // limit posts to most recent - max 24 hours 
   console.log('Parsing data')
   const allPosts = []
   const oneDayEpoch = 3600
   responses.forEach(element => {
      allPosts.push(...element.data.children)
      
   })

   let dataObj = [];
   allPosts.forEach(({data : {title, created_utc, author, ups, selftext}}) => {
      dataObj.push({ title: title, text: selftext, time: created_utc, who: author, voteCount: ups })
   })
   const timeThresholdMin = (Math.floor(Date.now()/1000)) - oneDayEpoch;

   currentPosts = []

   dataObj.forEach((post) => {
      if (post.time > timeThresholdMin) {
         currentPosts.push(post)
      } else {
         return
      }
   }) 

   let texts = currentPosts.map((post) => {return post.text})

   let textsSliced = texts.map(t => {return t.substring(0, 3000)})
   textAnalysis(texts)
   // for (let i = 0; i < texts.length; i++) {
   //    textGenerate(textsSliced[i])
   // }
   // texts.forEach(t => {
   //    if (t.length > 3000) {
   //       textsSliced.push()
   //    }
   // })
   // console.log(textsSliced)

   // textsSliced.forEach(t => console.log(t.length))
   
}

const textAnalysis = async (texts) => {
   
   data = {
      "data": texts
   }
   const optionsExtract = {
      method: 'POST',
      headers: {
         "Authorization": "Token 56189bb139c774de7dd866285c14ddd65a6e00cd",
         "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
   }
   console.log('fetching extracted keywords')
   const extract = await fetch('https://api.monkeylearn.com/v3/extractors/ex_YCya9nrn/extract/', optionsExtract)
   const extractJSON = await extract.json()

   keywords = extractJSON.map((eachPost) => {
      let keywordSelect = Math.floor(Math.random() * (eachPost.extractions.length - 1 ))
      if (eachPost.extractions[keywordSelect]) {
         return eachPost.extractions[keywordSelect].parsed_value
      }
   }, [])

   new p5(sketch);
   console.log(extractJSON)
}


// function animateKeywords(keywords) {
//    console.log(keywords)
// }

// const textGenerate = async (text) => {
//   // have to limit the char to 3000  for evry text input

//   if (text.length < 3000) {
//      console.log('generating')
//    let generateBody = {
//       "prompt": {
//            "text": text,
//            "isContinuation": true,
//       },
//       "length": 1000,
//       "streamResponse": false,
//       "forceNoEnd": false,
//       "topP": 0.8,
//       "temperature": 1.1
//    }

//     const optionsGenerate = {
//          method: 'POST',
//          headers: {
//             "Authorization": 'Bearer c7ad7297-9849-47fc-bddc-24da21c7c0fd',
//             "Content-Type": "application/json"
//          },
//          body: JSON.stringify(generateBody)
//    }

//    const generate = await fetch('https://api.inferkit.com/v1/models/standard/generate', optionsGenerate)
//    const generateJSON = await generate.json()

//    generatedTexts.push(generateJSON)

//    displayResult(generatedTexts)

//   }

// }


// const displayResult = (generatedTexts) => {

   

// }

let dt = new Date();
let h =  dt.getHours(), m = dt.getMinutes();
let _time = (h > 12) ? (h-12 + ':' + m +' PM') : (h + ':' + m +' AM');

let time = document.querySelector('.time')
time.innerHTML = _time

// let from = 192;
// let mover, mew;
// let font1, font2;
// let strings = ['storage','trouser', 'native', 'get', 'deteriorate', 'crime', 'wild', 'service', 'mood', 'oh']
// let movers = [];
// let attractor;

const sketch = p => {

   let movers = [];
   let attractor;
   let font1 = p.loadFont('assets/Messapia-Regular.otf');
   let font2 = p.loadFont('assets/DotGothic16-Regular.ttf');
 
   p.setup = function() {
      let cnv = p.createCanvas(p.windowWidth, p.windowHeight)
      cnv.position(0, 0)
      cnv.style('z-index', -1);

      for (let i = 0; i < keywords.length; i++) {
         let x = p.random(p.width);
         let y = p.random(p.height);
         let m = p.random(50, 150);
         movers[i] = new Mover(x, y, m, p);
       }
       attractor = new Attractor(p.width / 2, p.height / 2, 100, p);
   };
 
   p.draw = function() {
     p.background(120) 

   for (let i=0; i < movers.length; i++) {
      movers[i].update();
      movers[i].show(keywords[i], font2);
      attractor.attract(movers[i]);
   }
   };
 };
 


// function setup() {
//    let cnv = createCanvas(windowWidth, windowHeight)
//    cnv.position(0, 0)
//    cnv.style('z-index', -1);

//    for (let i = 0; i < 10; i++) {
//       let x = random(width);
//       let y = random(height);
//       let m = random(50, 150);
//       movers[i] = new Mover(x, y, m);
//     }
//     attractor = new Attractor(width / 2, height / 2, 100);
   
// // }

// function draw() {
   
//    p.background(120) 

//    for (let i=0; i < movers.length; i++) {
//       movers[i].update();
//       movers[i].show(strings[i], font2);
//       attractor.attract(movers[i]);
//    }
   
// }

Noise3k({
   // container: '#defaultCanvas0', // (optional || default: document.body) specify where the noise is applied
   grainSize: 1, // (optional || default: 1) Multiplier for the grain size
 });
