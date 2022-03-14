const FollowSchema = require("../Schema/Follow")
const UserSchema = require('../Schema/User')
const ObjectId = require("mongoose").Types.ObjectId
const { limit } = require("../private-constructor")


function followUserProccess({ followerUserId, followingUserId }) {
    return new Promise(async (resolve, reject) => {
        try {
            let FollowEntry = await FollowSchema({
                followerUserId,
                followingUserId,
                creationDateTime: new Date()
            })
            const FollowDbresponse = await FollowEntry.save()
            resolve(FollowDbresponse)
        }
        catch (err) {
            reject(err)
        }
    })

}
function followingListofUserIdDetails(offset, userId) {
    return new Promise(async (resolve, reject) => {

        try {
            let followinglist = await FollowSchema.aggregate([

                { $match: { followerUserId: new ObjectId(userId) } },
                { $sort: { creationDateTime: -1 } },
                { $project: { followingUserId: 1 } },
                {
                    $facet:
                    {
                        data: [
                            { "$skip": parseInt(offset) },
                            { "$limit": limit }
                        ]
                    }


                }
            ])

            let followingList2=[]
             followinglist[0].data.forEach((items)=>{
                 followingList2.push(ObjectId(items.followingUserId))

             })

             const followingUserDetails= await UserSchema.aggregate([
                 {$match: {_id: {$in:followingList2}}},
                 {$project:{
                     username:1,
                     name:1,
                     _id:1
                 }}
             ])

             console.log(followingUserDetails)
            resolve(followingUserDetails)
        }
        catch (err) {
            reject(err)
        }

    })


}




////////////-----------THIS FUNCTION IS NEVER USED-----------///////////////////
function followingListofUserId(offset, userId) {
    return new Promise(async (resolve, reject) => {

        try {
            let followinglist = await FollowSchema.aggregate([

                { $match: { followerUserId: new ObjectId(userId) } },
                { $sort: { creationDateTime: -1 } },
                { $project: { followingUserId: 1 } },
                {
                    $facet:
                    {
                        data: [
                            { "$skip": parseInt(offset) },
                            { "$limit": limit }
                        ]
                    }


                }
            ])


            resolve(followinglist[0].data)
        }
        catch (err) {
            reject(err)
        }

    })

}
////////////-----------THIS FUNCTION IS NEVER USED-----------///////////////////




function followerListofUserId(offset, userId) {
    return new Promise(async (resolve, reject) => {

        try {
            let followerlist = await FollowSchema.aggregate([

                { $match: { followingUserId: new ObjectId(userId) } },
                { $sort: { creationDateTime: -1 } },
                { $project: { followerUserId: 1 } },
                {
                    $facet:
                    {
                        data: [
                            { "$skip": parseInt(offset) },
                            { "$limit": limit }
                        ]
                    }


                }
            ])


            resolve(followerlist[0].data)
        }
        catch (err) {
            reject(err)
        }

    })

}

function unfollowerUser({ followerUserId, followingUserId }) {
    return new Promise(async(resolve, reject) => {
        console.log( ObjectId(followerUserId), ObjectId(followingUserId) )

        try{
            let unfolloResponse= await FollowSchema.findOneAndDelete({ followerUserId:  ObjectId(followerUserId), followingUserId: ObjectId(followingUserId)})
            if(!unfolloResponse){
                reject("No User Found")
            }
            resolve(unfolloResponse)
        }
        catch(err){
            reject(err)

        }

    })
}

module.exports = { followUserProccess, followingListofUserIdDetails, followerListofUserId, unfollowerUser}