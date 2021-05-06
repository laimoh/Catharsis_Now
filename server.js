const express = require('express');
const request = require('request');
const fetch = require("node-fetch");
var sentiment = require('wink-sentiment');
const {} = require('wink-sentiment/src/afinn-en-165');

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

   for (let i = 0; i < dataObj.length; i++) {
      let current = dataObj[i]
      if (current.text) {
         sentimentAnalyze(current)
      }

   }

}

let sentArr = []
const sentimentAnalyze = async (obj) => {

   let object = sentiment(obj.text)

   obj.score = object.score;
   obj.averagedScore = object.normalizedScore

} // push as a key value pair into existing object (dataObj)


app.get('/keyword', (request, response) => {
   response.json({
      list: dataObj
   })
});


fetchPosts()