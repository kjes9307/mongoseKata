var http = require("http");
const Post = require("./model/rooms.js")
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
const service = async function(req,res){
    let url = req.url;
    let result = {"msg" : "","data" : "", "status" : ""};
    let body ='';
    req.on('data',chunk =>{body+=chunk});
    const chkURl = /^\/posts$/gi;
    const chkParam = /^\/posts\//gi;
    if(req.method ==='GET'){
        switch (true){
            case chkURl.test(url):
                const data = await Room.find();
                console.log("database=",data)
                result['data']=data;
                reponseHandle(200,"TODO API (GET)","200",result,res);
                break;
            default:
                reponseHandle(400,"TODO API (GET)","404",result,res);
                break;
        }   
    }
    else if (req.method ==='POST'){
        switch (true){
            case chkURl.test(url):
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
                        reponseHandle(400,`TODO API (POST)=${error}`,"404",result,res);
                    }
                });
            break;
        default:
            reponseHandle(400,"TODO API (POST)","Failed,Not Found",result,res);
            break;
        }
    }else if (req.method ==='DELETE'){
        switch(true){
            case chkURl.test(url):
                const data = await Room.deleteMany();
                console.log("database=",data)
                result['data']=[];
                reponseHandle(200,"TODO API (DELETE ALL)","Good",result,res);
                break;
            case chkParam.test(url):
                req.on("end",async ()=>{
                    try{
                        let deleteID = url.split("/").pop();
                        console.log(`${deleteID}`)
                        let data = await Room.findByIdAndDelete(`${deleteID}`);
                        result['data']=data;
                        if(data !== null){
                            reponseHandle(200,`TODO API (DELETE ONE)=${deleteID} delete ok`,"Good",result,res);
                        }else{
                            reponseHandle(200,`TODO API (DELETE ONE)= id not match any result`,"Good",result,res);
                        }
                    }catch(err){
                        reponseHandle(400,`TODO API (DELETE)=${err}`,"Input Error",result,res);
                        console.log(err)
                    };
                });
                break;
            default:
                reponseHandle(400,"TODO API (DELETE)","Failed,Not Found",result,res);
                break;
        }
    }
    else if (req.method ==='PATCH'){
        switch(true){ //123
            case chkParam.test(url): //test123
                req.on("end",async ()=>{
                    try{
                        let editItem = JSON.parse(body).name;
                        let editID = url.split("/").pop();
                        let data = await Room.findByIdAndUpdate(`${editID}`,{"name":`${editItem}`});
                        result['data']=data;
                        if(data !== null){
                            reponseHandle(200,"TODO API (PATCH)","Good",result,res);
                        }else{
                            reponseHandle(200,`TODO API (PATCH)= ID not match any result`,"Good",result,res);
                        }
                    
                    }catch(err){
                        reponseHandle(400,`TODO API (PATCH)=${err}`,"Todo Intput Error",result,res);
                    };
                });
                break;
            default:
                reponseHandle(400,"TODO API (PATCH)","Failed,Not Found",result,res);
                break;
        }
    }
   
   }

let server = http.createServer(service);
server.listen(process.env.PORT || 8080);
