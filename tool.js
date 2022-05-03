const headers = require("./define.js")

const reponseHandle = (headerStatus,newMsg,data,res)=>{
    res.writeHead(headerStatus,headers)
    data["msg"] = newMsg;
    data["status"] = headerStatus;
    res.write(JSON.stringify(data));
    res.end()
}

module.exports = reponseHandle;