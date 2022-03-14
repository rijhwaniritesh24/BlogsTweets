const { reject } = require('bcrypt/promises');
const tweetsSchema = require('../Schema/TweetBlog')
const {limit}=require("../private-constructor")

class Tweets {
    title;
    bodyText;
    userId;
    creationDateTime;
    tweetsId;

    constructor({ title, bodyText, userId, creationDateTime, tweetsId }) {
        this.title = title;
        this.bodyText = bodyText;
        this.userId = userId;
        this.creationDateTime = creationDateTime;
        this.tweetsId = tweetsId;
    }

    createTweet() {
        return new Promise(async (resolve, reject) => {
            this.title.trim(" ");
            this.bodyText.trim(" ");

            let storeTweetDb = new tweetsSchema({
                title: this.title,
                bodyText: this.bodyText,
                userId: this.userId,
                creationDateTime: this.creationDateTime
            })

            try {
                const dbTweetStoreResponse = await storeTweetDb.save();
                resolve(dbTweetStoreResponse)
            } catch (error) {
                reject(err)
            }
        })
    }

    static getTweets(offset) {
        return new Promise(async (resolve, reject) => {
            console.log("offset", offset);

            try {
                let tweetFromDb = await tweetsSchema.aggregate([
                    { $sort: { "creationDateTime": -1 } },
                    {
                        $facet: {
                            data: [
                                { '$skip': parseInt(offset) },
                                { '$limit': 20 }
                            ]
                        }
                    }
                ])

                console.log(JSON.stringify(tweetFromDb))
                resolve(tweetFromDb[0].data)
            }
            catch (err) {
                reject(err)
            }
        })
    }
    static getMyTweets(offset, userId) {
        return new Promise(async (resolve, reject) => {

            console.log(userId)
            try {
                let tweetFromDb = await tweetsSchema.aggregate([
                    { $match: { userId } },
                    { $sort: { "creationDateTime": -1 } },
                    {
                        $facet: {
                            data: [
                                { '$skip': parseInt(offset) },
                                { '$limit': limit }
                            ]
                        }
                    }
                ])

                console.log(JSON.stringify(tweetFromDb))
                resolve(tweetFromDb[0].data)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    static getTweetsdetailsByTweetId(tweetsId) {
        return new Promise(async (resolve, reject) => {
            console.log(tweetsId)

            try {
                let tweetsDetail = await tweetsSchema.findOne({ _id: tweetsId })
                console.log(tweetsDetail)
                resolve(tweetsDetail)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    editTweets() {
        return new Promise(async (resolve, reject) => {
            console.log(this.title, this.bodyText)
            try {
                const details = await tweetsSchema.findByIdAndUpdate({ _id: this.tweetsId }, { title: this.title, bodyText: this.bodyText })
                console.log(details)
                resolve(details)
            } catch (err) {
                reject(err)
            }
        })
    }


   static deleteTweets(tweetsId) {
        return new Promise(async (resolve, reject) => {

           let deletedetail= await tweetsSchema.findByIdAndDelete({ _id: tweetsId })
           console.log(deletedetail)
                resolve(deletedetail)
            

        })
    }


}

module.exports = Tweets