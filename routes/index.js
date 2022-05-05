const postAPI=require("../controller/method.js")

const router = async (req,res) =>{
    let url = req.url;
    
    let body ='';
    req.on('data',chunk =>{body+=chunk});
    const chkURl = /^\/posts$/gi;
    const chkParam = /^\/posts\//gi;
    if(req.method ==='GET'){
        switch (true){
            case chkURl.test(url):
                postAPI.findPost({req,res})
                break;
            default:
                postAPI.notFound({req,res})
                break;
        }   
    }
    else if (req.method ==='POST'){
        switch (true){
            case chkURl.test(url):
                req.on('end',async ()=>{
                    // receive request 
                    await postAPI.createPost({req,res,body})   
                });
            break;
        default:
            postAPI.notFound({req,res})
            break;
        }
    }else if (req.method ==='DELETE'){
        switch(true){
            case chkURl.test(url):
                await postAPI.deleteAll({req,res,body})   
                break;
            case chkParam.test(url):
                req.on("end",async ()=>{
                  await postAPI.deleteByID({req,res,url})  
                });
                break;
            default:
                postAPI.notFound({req,res})
                break;
        }
    }
    else if (req.method ==='PATCH'){
        switch(true){ 
            case chkParam.test(url):
                req.on("end",async ()=>{
                    await postAPI.editPost({req,res,url,body})  
                });
                break;
            default:
                postAPI.notFound({req,res})
                break;
        }
    }
}
module.exports=router;