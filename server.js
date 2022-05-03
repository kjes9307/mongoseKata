var http = require("http");
const Post = require("./model/post.js")
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const reponseHandle = require("./tool")
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
                const data = await Post.find()
                result['data']=data;
                reponseHandle(200,"TODO API (GET)",result,res);
                break;
            default:
                result['data']=[];
                reponseHandle(404,"TODO API (GET)",result,res);
                break;
        }   
    }
    else if (req.method ==='POST'){
        switch (true){
            case chkURl.test(url):
                req.on('end',async ()=>{
                    // receive request 
                    try{
                        let addPost = JSON.parse(body)? JSON.parse(body) : "failed"
                        console.log(typeof addPost.content)
                        if(addPost !== "failed"){
                            let resData = await Post.create(
                                {
                                    name: addPost.name,
                                    content: addPost.content,
                                    likes: addPost.likes
                                }
                            )// await 會把成功後的資訊丟回來
                            result['data']=resData;
                            reponseHandle(200,"TODO API (POST)",result,res);
                        }
                    }catch(error){
                        console.log(error);
                        result['data']=[];
                        reponseHandle(404,`TODO API (POST)=${error}`,result,res);
                    }
                });
            break;
        default:
            result['data']=[];
            reponseHandle(404,"TODO API (POST)= Not Found",result,res);
            break;
        }
    }else if (req.method ==='DELETE'){
        switch(true){
            case chkURl.test(url):
                const data = await Post.deleteMany();
                console.log("database=",data)
                result['data']=[];
                reponseHandle(200,"TODO API (DELETE ALL)",result,res);
                break;
            case chkParam.test(url):
                req.on("end",async ()=>{
                    try{
                        let deleteID = url.split("/").pop();
                        console.log(`${deleteID}`)
                        let data = await Post.findByIdAndDelete(deleteID);
                        result['data']=data;
                        if(data !== null){
                            reponseHandle(200,`TODO API (DELETE ONE)=${deleteID} delete ok`,result,res);
                        }else{
                            result['data']=[];
                            reponseHandle(200,`TODO API (DELETE ONE)= ID not found`,result,res);
                        }
                    }catch(err){
                        reponseHandle(404,`TODO API (DELETE)=${err}`,result,res);
                        console.log(err)
                    };
                });
                break;
            default:
                result['data']=[];
                reponseHandle(404,"TODO API (DELETE)= Not Found",result,res);
                break;
        }
    }
    else if (req.method ==='PATCH'){
        switch(true){ 
            case chkParam.test(url):
                req.on("end",async ()=>{
                    try{
                        let editItem = JSON.parse(body);
                        let obj = {
                            name: editItem.name,
                            content: editItem.content,
                            likes: editItem.likes
                        };
                        let editID = url.split("/").pop();
                        let data = await Post.findByIdAndUpdate(editID,obj,{ runValidators: true,new: true });
                        console.log("show item=",data)
                        result['data']=data;
                        if(data !== null){
                            reponseHandle(200,"TODO API (PATCH)",result,res);
                        }else{
                            result['data']=[];
                            reponseHandle(200,`TODO API (PATCH)= ID not found`,result,res);
                        }
                    
                    }catch(err){
                        reponseHandle(404,`TODO API (PATCH)=${err}`,result,res);
                    };
                });
                break;
            default:
                reponseHandle(404,"TODO API (PATCH)= Not Found",result,res);
                break;
        }
    }
   
   }

let server = http.createServer(service);
server.listen(process.env.PORT || 8080);
