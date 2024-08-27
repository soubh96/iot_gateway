const mongoose=require('mongoose');

const dataSchema= new mongoose.Schema({
    temperature:{type:Number,default:0},
    moisture:{type:Number,default:0},
    electricalConductivity: { type: Number, default: 102 },
    nitrogen: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 }     


});

const Data = mongoose.model('Data',dataSchema)

module.exports=Data;
