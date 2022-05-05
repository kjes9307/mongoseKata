require("./connect");
const router = require("./routes");
const service = async function(req,res){
    await router(req,res);
   
   }

module.exports = service;