const express = require('express')
const FollowRoute = express.Router();
const { followUserProccess,  followerListofUserId, unfollowerUser, followingListofUserIdDetails } = require('../Models/Follow')
const { isValidateObjectId } = require('../Utils/FollowUtils')
const User = require('../Models/User');
const { isAuth } = require('../Utils/AuthUtils');


// ---1. Post Api :user Follow 
//    2. Post Api :user Unfollow
//    3. Get All follower (Follo)




FollowRoute.post('/follow-user',isAuth, async (req, res) => {
    const { followerUserId, followingUserId } = req.body;

    if (!isValidateObjectId(followingUserId)) {
        return res.send({
            Status: 500,
            Message: "Plz Enter Correct Following UserID .Error in ObjectId Format"
        })
    }

    try {
        let followUserDb = await User.verifyUserIdExist(followingUserId)
        if (!followUserDb) {
            return res.send({
                status: 401,
                Message: "No User Exists. Plz Enter Valid followingUserId"
            })
        }


        try {
            let FollowerEntryInDb = await followUserProccess({ followerUserId, followingUserId })
            return res.send({
                status: 200,
                Message: "Followed Successfully",
                Data: FollowerEntryInDb
            })
        }
        catch (err) {
            return res.send({
                status: 400,
                Message: "Something Went wrong",
                Error: err
            })
        }

    }
    catch (err) {
        return res.send({
            status: 400,
            Error: err
        })
    }



})



FollowRoute.get('/get-following-List/:id/:offset/', isAuth, async (req, res) => {
    const userID = req.params.id
    const offset = req.params.offset

    try {
        let verifyUserId = await User.verifyUserIdExist(userID)
        // console.log(verifyUserId)
        if (!verifyUserId) {
            return res.send({
                status: 404,
                Message: "No User found with this UserId"
            })
        }

        try {
            let followingList = await followingListofUserIdDetails(offset, userID)
            return res.send({
                status: 200,
                Message: "Following List Successfully",
                Data: followingList
            })

        }
        catch (err) {
            console.log(err)
            return res.send({
                status: 400,
                Error: err
            })
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            Message: "Spmething went wrong",
            Error: err
        })
    }
})



FollowRoute.get('/get-follower-List/:id/:offset/',isAuth, async (req, res) => {
    const userID = req.params.id
    const offset = req.params.offset

    try {
        let verifyUserId = await User.verifyUserIdExist(userID)
        // console.log(verifyUserId)
        if (!verifyUserId) {
            return res.send({
                status: 404,
                Message: "No User found with this UserId"
            })
        }

        try {
            let followingList = await followerListofUserId(offset, userID)
            return res.send({
                status: 200,
                Message: "Followed Successfully",
                Data: followingList
            })

        }
        catch (err) {
            console.log(err)
            return res.send({
                status: 400,
                Error: err
            })
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            Message: "Something went wrong",
            Error: err
        })
    }
})



FollowRoute.post('/unfollow',isAuth, async (req, res) => {

    const {followingUserId, followerUserId}= req.body
    
    try{
        let unfollowdetail =await unfollowerUser({followingUserId, followerUserId})
        return res.send({
            Status: 200,
            Message: "Unfollow User Successfully",
            Data: unfollowdetail
        })
    }
    catch(err){
        return res.send({
            status: 400,
            Error: err
        })
        

    }

})




module.exports = FollowRoute