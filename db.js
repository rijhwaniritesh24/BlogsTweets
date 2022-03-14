const mongoose=require('mongoose')
const SensitiveKeys=require('./private-constructor')


mongoose.connect(SensitiveKeys.uri,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then((res) => {
        console.log('Connected to database')
    }).catch(err=>{
            console.log("Error in connecting Database")
    })
