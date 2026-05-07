const mongoose = require('mongoose')


const permissionSchema =  new mongoose.Schema({
    name :{
        type: String,
        required : [true, 'Permission name is required'],
        unique  : true,
        trim : true,
        lowecase: true 
    },
    description :{
        type : String,
        required : [true, 'Permission desc is required']
    },
    
}, {timestamps : true});

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;