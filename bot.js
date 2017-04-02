const twit = require('twit')
const sentiment = require('sentiment')

const Twitter = new twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})
let lastTweet

const tweet = function () {
  const params = {
    screen_name: 'realdonaldtrump',
    count: 1,
    include_rts: false
  }

  Twitter.get('statuses/user_timeline', params, (err, data) => {
    if (!err) {
      const tweet = data[0]

      // ignore duplicates
      if (lastTweet === tweet.id) {
        return
      } else {
        lastTweet = tweet.id
      }

      const sentimentInfo = sentiment(tweet.text.toLowerCase())

      const post = {}

      if (sentimentInfo.score > 0) {
        post.status = 'Trump is happy.'
      } else if (sentimentInfo.score < 0) {
        post.status = 'Trump is sad.'
      } else {
        post.status = 'Trump is okay.'
      }

      post.status = post.status + ' http://twitter.com/realdonaldtrump/status/' + tweet.id_str

      Twitter.post('statuses/update', post, (err, response) => {
        if (err) {
          console.error(err)
        }
      })

    } else {
      console.error(err.twitterReply)
    }
  })
}

tweet()
setInterval(tweet, 900000)
