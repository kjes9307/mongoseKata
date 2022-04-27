var http = require("http");
const Room = require("./model/rooms.js")
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path :"./config.env"});
const db = process.env.DATABASE_URL.replace('<password>',process.env.DATABASE_Pass)

mongoose.connect(db) // 連到你要的db
    .then(()=>{
        console.log('資料庫連線成功')
    })
    .catch((error)=>{
        console.log(error);
    });
// model 新增法1
// const testRoom = new Room(
//     {
//         name: "總統超級單人房",
//         price: 200,
//         rating: 4.5
//     }
// )

// testRoom.save()
//     .then(()=>{
//         console.log("新增資料成功")
//     })
//     .catch(error=>{
//         console.log(error)
//         // 價格未填
//         // console.log(error.errors.price.properties.message)
//     })
// model 新增法2
// Room.create(
//     {
//         name: "總統超級單人房2",
//         price: 200,
//         rating: 4.5
//     }
// ).then(()=>{
//     console.log("資料寫入成功");
// }).catch(error=>{
//     console.log(error.errors);
// })
const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
}
const errorHandle = (headerStatus,newMsg,newStatus,data,res)=>{
    res.writeHead(headerStatus,headers);
    data["msg"] = newMsg;
    data["status"] = newStatus;
    res.write(JSON.stringify(data));
    res.end();
}
const reponseHandle = (headerStatus,newMsg,newStatus,data,res)=>{
    res.writeHead(headerStatus,headers)
    data["msg"] = newMsg;
    data["status"] = newStatus;
    res.write(JSON.stringify(data));
    res.end()
}
const service = async function(req,res){
    let url = req.url;
    let result = {"msg" : "","data" : "", "status" : ""};
    let body ='';
    req.on('data',chunk =>{body+=chunk});
    
    if(req.method ==='GET'){
        let regex = /^\/posts$/gi;
        switch (true){
            case regex.test(url):
                const data = await Room.find();
                console.log("database=",data)
                result['data']=data;
                reponseHandle(200,"TODO API (GET)","200",result,res);
                break;
            default:
                errorHandle(400,"TODO API (GET)","404",result,res);
                break;
        }   
    }
    else if (req.method ==='POST'){
        let regex = /^\/posts$/gi;
        switch (true){
            case regex.test(url):
                req.on('end',async ()=>{
                    // receive request 
                    try{
                        let addRoom = JSON.parse(body)? JSON.parse(body) : "failed"
                        if(addRoom !== "failed"){
                            let resData = await Room.create(
                                {
                                    name: addRoom.name,
                                    price: addRoom.price,
                                    rating: addRoom.rating
                                }
                            )// await 會把成功後的資訊丟回來
                            result['data']=resData;
                            reponseHandle(200,"TODO API (POST)","200",result,res);
                        }
                    }catch(error){
                        console.log(error)
                        errorHandle(400,`TODO API (POST)=${error}`,"404",result,res);
                    }
                });
            break;
        default:
            errorHandle(400,"TODO API (POST)","Failed,Not Found",result,res);
            break;
        }
    }else if (req.method ==='DELETE'){
        let regex = /^\/posts$/gi;
        let regex2 = /^\/posts\//gi;
        switch(true){
            case regex.test(url):
                const data = await Room.deleteMany();
                console.log("database=",data)
                result['data']=[];
                reponseHandle(200,"TODO API (DELETE ALL)","Good",result,res);
                break;
            case regex2.test(url):
                req.on("end",async ()=>{
                    try{
                        let deleteID = url.split("/").pop();
                        console.log(`${deleteID}`)
                        let data = await Room.findByIdAndDelete(`${deleteID}`);
                        result['data']=data;
                        reponseHandle(200,`TODO API (DELETE ONE)=${deleteID} delete ok`,"Good",result,res);
                    }catch(err){
                        errorHandle(400,`TODO API (DELETE)=${err}`,"Input Error",result,res);
                        console.log(err)
                    };
                });
                break;
            default:
                errorHandle(400,"TODO API (DELETE)","Failed,Not Found",result,res);
                break;
        }
    }
    else if (req.method ==='PATCH'){
        let regex2 = /^\/posts\//gi;
        switch(true){ //123
            case regex2.test(url): //test123
                req.on("end",async ()=>{
                    try{
                        let editItem = JSON.parse(body).name;
                        let editID = url.split("/").pop();
                        let data = await Room.findByIdAndUpdate(`${editID}`,{"name":`${editItem}`});
                        result['data']=data;
                        reponseHandle(200,"TODO API (PATCH)","Good",result,res);
                    }catch(err){
                        errorHandle(400,`TODO API (PATCH)=${err}`,"Todo Intput Error",result,res);
                    };
                });
                break;
            default:
                errorHandle(400,"TODO API (PATCH)","Failed,Not Found",result,res);
                break;
        }
    }
   
   }

let server = http.createServer(service);
server.listen(process.env.PORT || 8080);
