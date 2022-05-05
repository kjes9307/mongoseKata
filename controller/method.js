const Post = require("../model/post.js")
const reponseHandle = require("../tool")
let result = {"msg" : "","data" : "", "status" : ""};
let postAPI = {
    findPost : async ({req,res})=>{
        const data = await Post.find()
        result['data']=data;
        reponseHandle(200,"TODO API (GET)",result,res);
    },
    createPost : async ({req,res,body})=>{
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
    },
    deleteAll : async ({req,res})=>{
        const data = await Post.deleteMany();
        console.log("database=",data)
        result['data']=[];
        reponseHandle(200,"TODO API (DELETE ALL)",result,res);
    },
    deleteByID : async ({req,res,url})=>{
        try{
            let deleteID = url.split("/").pop();
            console.log(`${deleteID}`)
            let data = await Post.findByIdAndDelete(deleteID);
            result['data']=data;
            if(data !== null){
                reponseHandle(200,`TODO API (DELETE ONE)=${deleteID} delete ok`,result,res);
            }else{
                throw "id not found"
            }
        }catch(err){
            reponseHandle(404,`TODO API (DELETE)=${err}`,result,res);
            console.log(err)
        };
    },
    editPost : async ({req,res,url,body})=>{
        try{
            if(Object.keys(JSON.parse(body)).length === 0){
                result['data']=[];
                reponseHandle(404,`TODO API (PATCH)= input error`,result,res);
                return;
            }
            let editName = JSON.parse(body).name;
            let editContent = JSON.parse(body).content;
            let editLikes = JSON.parse(body).likes;
            
            let obj = {
                name: editName,
                content: editContent,
                likes: editLikes
            };
            let editID = url.split("/").pop();
            let data = await Post.findByIdAndUpdate(editID,obj,{ runValidators: true,new: true });
            result['data']=data;
            if(data !== null){
                reponseHandle(200,"TODO API (PATCH)",result,res);
            }else{
                throw "id not found"
            }
        
        }catch(err){
            result['data']=[];
            reponseHandle(404,`TODO API (PATCH)=${err}`,result,res);
        };
    },
    notFound : ({req,res})=>{
        result['data']=[];
        reponseHandle(404,"TODO API (GET) FAILED",result,res);
    }
}
module.exports= postAPI;
