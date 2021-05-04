const express = require('express');
const request = require('request');
const fetch = require("node-fetch");
var sentiment = require('wink-sentiment');
const {} = require('wink-sentiment/src/afinn-en-165');

let texts;
let titles;
let app = express()
app.use(express.static('public'))
app.use(express.json())
let port = 3000

app.listen(port, () => {
   console.log(`Listening on port ${port}.`)
})

const postPerRequest = 100;
const maxPostsToFetch = 500;
const maxRequests = maxPostsToFetch / postPerRequest
const responsesReddit = [] // stores all of em
const responseKeywords = []



const fetchPosts = async (afterParam) => {
   console.log('fetching data')
   const response = await fetch(`https://www.reddit.com/r/offmychest.json?limit=${postPerRequest}${
      afterParam ? '&after=' + afterParam : ''
   }`)
   // console.log(response)
   const responseJSON = await response.json();
   responsesReddit.push(responseJSON);

   if (responseJSON.data.after && responsesReddit.length < maxRequests) {
      fetchPosts(responseJSON.data.after);
      return
   }
   parseResults(responsesReddit)
}
let dataObj = [];
const parseResults = (r) => {

   console.log('Parsing data')
   const allPosts = []
   const oneHourEpoch = 3600

   responsesReddit.forEach(element => {
      allPosts.push(...element.data.children)
   })



   allPosts.forEach(({
      data: {
         title,
         created_utc,
         author,
         ups,
         selftext
      }
   }) => {
      dataObj.push({
         title: title,
         text: selftext,
         time: created_utc,
         who: author,
         voteCount: ups
      })
   })

   
   // const timeThresholdMin = (Math.floor(Date.now()/1000)) - oneHourEpoch;
   // console.log(dataObj)
   // let currentPosts = []

   // dataObj.forEach((post) => {
   //    if (post.time > timeThresholdMin) {
   //       currentPosts.push(post)
   //    } else {
   //       return
   //    }
   // }) 
   // texts = currentPosts.map((post) => {return post.text})
   // titles = currentPosts.map((post) => {return post.title});

   for (let i = 0; i < dataObj.length; i++) {
      let current = dataObj[i]
      if (current.text) {
         // sentimentAnalyze(current.text)
         sentimentAnalyze(current)
      }

   }
   // for (let i = 0; i < dataObj.length; i++) {
   //    textAnalysis(dataObj[i].text)
   // }

}

let sentArr = []
const sentimentAnalyze = async (obj) => {

   let object = sentiment(obj.text)

   obj.score = object.score;
   obj.averagedScore = object.normalizedScore

} // push as a key value pair into existing object (dataObj)


const textAnalysis = async (text) => {

   const options = {
      method: 'POST',
      url: 'https://textanalysis-keyword-extraction-v1.p.rapidapi.com/keyword-extractor-text',
      headers: {
         'content-type': 'application/x-www-form-urlencoded',
         'x-rapidapi-key': '7252babc03mshb05a34ae2b8d83dp13f69cjsna192a80483b2',
         'x-rapidapi-host': 'textanalysis-keyword-extraction-v1.p.rapidapi.com',
         useQueryString: true
      },
      form: {
         text: text,
         wordnum: '5'
      }
   };

   request(options, function (error, response, body) {
      if (error) throw new Error(error);
      let parsed = JSON.parse(body)
      dataObj.push({
         keywords: parsed.keywords
      })
   });

}

app.get('/keyword', (request, response) => {
   response.json({
      list: dataObj
   })
});


fetchPosts()