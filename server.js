const express = require('express')
const fetch = require("node-fetch");

let app = express()
app.use(express.static('public'))
app.use(express.json())
let port = 3000

app.listen(port, () => {
   console.log(`Listening on port ${port}.`)
})

const postPerRequest = 100;
const maxPostsToFetch = 500;
const maxRequests = maxPostsToFetch / postPerRequest // 5 total requests
const responses = [] // stores all of em
let generatedTexts = [];


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
   // const oneHourEpoch = 3600
   const thirtyMin = 1800
   responses.forEach(element => {
      allPosts.push(...element.data.children)
      
   })

   let dataObj = [];
   allPosts.forEach(({data : {title, created_utc, author, ups, selftext}}) => {
      dataObj.push({ title: title, text: selftext, time: created_utc, who: author, voteCount: ups })
   })
   const timeThresholdMin = (Math.floor(Date.now()/1000)) - fifteenMin;

   let currentPosts = []

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

   let keywords = extractJSON.map((eachPost) => {
      let keywordSelect = Math.floor(Math.random() * (eachPost.extractions.length - 1 ))
      if (eachPost.extractions[keywordSelect]) {
         return eachPost.extractions[keywordSelect].parsed_value
      }
   }, [])


   console.log(keywords)

   app.get('/keyword', (request, response) => {
      response.json({
         list: keywords
      })
   });
}

fetchPosts()

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