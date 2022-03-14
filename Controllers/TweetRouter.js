const express = require('express')
const tweetRouter = express.Router()

const Tweets = require('../Models/Tweet')
const { isAuth } = require('../Utils/AuthUtils')

tweetRouter.post('/create-tweet', isAuth ,async (req, res) => {

    const { title, bodyText } = req.body
    const { userId } = req.session.user;
    if (!userId) {
        return res.send({
            status: 500,
            Message: "UserId is Not Define for current Session"
        })
    }
    if (!title || !bodyText) {
        return res.send({
            status: 500,
            Message: "Either Title or Body Missing"
        })
    }
    if (typeof (title) !== 'string' || typeof (bodyText) !== 'string') {
        return res.send({
            status: 500,
            Message: "Title or BodyText Must be String"
        })
    }

    if (title.length > 50 || bodyText.length > 200) {
        return res.send({
            status: 400,
            Message: "Title length must be less than 50 & Body Length must be less than 200"
        })
    }
    let creationDateTime = new Date()
    const tweet = new Tweets({ title, bodyText, userId, creationDateTime })

    try {
        let TweetCreation = await tweet.createTweet();
        console.log(TweetCreation);
        return res.send({
            status: 200,
            Message: "Tweet Created SuccessFully",
            Data: TweetCreation
        })
    }
    catch (err) {
        return res.send({
            status: 400,
            Message: "Error Occur in Tweet Creation",
            Data: err
        })
    }


})

tweetRouter.get('/getTweets',isAuth, async (req, res) => {

    const offset = req.query.offset

    console.log(offset)
    try {
        let tweetsDisplay = await Tweets.getTweets(offset)
        return res.send({
            status: 200,
            Message: "Get tweet ",
            Data: tweetsDisplay
        })
    } catch (err) {
        return res.send({
            status: 400,
            Message: "Error in Reading Tweets ",
            Error: err
        })
    }
})



tweetRouter.get('/get-my-tweet', isAuth,async (req, res) => {
    const offset = req.query.offset
    let { userId } = req.session.user
    console.log(offset, userId)

    try {
        let tweetsmyDisplay = await Tweets.getMyTweets(offset, userId)
        console.log(tweetsmyDisplay)
        return res.send({
            status: 200,
            Message: "Get My Tweet Successfully ",
            Data: tweetsmyDisplay
        })
    }
    catch (err) {
        return res.send({
            status: 400,
            Message: "Something Went Wrong Get My Tweet  ",
            Error: err
        })
    }


})




tweetRouter.post('/edit-my-tweet', isAuth,async (req, res) => {
    const { tweetsId, title, bodyText } = req.body;

    const { userId } = req.session.user;

    if (!title || !bodyText) {
        return res.send({
            status: 500,
            Message: "Paramaeter Missing"
        })
    }

    try {
        const tweetsDetailFromTweetsId = await Tweets.getTweetsdetailsByTweetId(tweetsId)
        console.log(tweetsDetailFromTweetsId);

        if (tweetsDetailFromTweetsId.userId.toString() !== userId.toString()) {
            return res.send({
                status: 400,
                Message: "This Tweet Doesn't belong to u"
            })
        }

        let creationDateTime = new Date(tweetsDetailFromTweetsId.creationDateTime)
        let currentDateTime = Date.now()

        if ((currentDateTime - creationDateTime.getTime()) / (1000 * 60) > 30) {
            return res.send({
                status: 400,
                Message: " Time Limit Exceed. You can Edit it before 30 min of Creation of Tweet"
            })
        }
        const tweets = new Tweets({ title, bodyText, tweetsId, userId })
        const dataUpdate = await tweets.editTweets()

        return res.send({
            status: 200,
            Message: "Update Successfully",

        })

    }
    catch (err) {
        return res.send({
            status: 500,
            Message: "Something Went Wrong in Reading Tweets from Id ",
            Error: err
        })
    }


})


tweetRouter.post('/delete-my-tweet',isAuth, async (req, res) => {
    const { tweetsId } = req.body;
    const userId = req.session.user.userId;

    try {
        let tweetsDetailFromTweetsId = await Tweets.getTweetsdetailsByTweetId(tweetsId);
        if (tweetsDetailFromTweetsId.userId.toString() != userId.toString()) {
            return res.send({
                status: 400,
                Message: "Delete Operation not Allowed. Tweets Doesn't belong to u"
            })

        }

        try {
           let deletedetail= await Tweets.deleteTweets(tweetsId)
            return res.send({
                Status: 200,
                Message: "Tweet Delete Successfully",
                Data:deletedetail
            })
        }
        catch (err) {
            return res.send({
                Status: 400,
                Message: "Tweet not Deleted. Someting went wrong",
                Error: err
            })
        }
    }
    catch (err) {
        return res.send({
            Status: 400,
            Message: "Something went Wrong",
            Error: err
        })
    }
})



module.exports = tweetRouter



