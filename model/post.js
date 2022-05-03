// 連接資料庫
const mongoose = require('mongoose');
    // 建立collection 
    const postSchema = new mongoose.Schema( {
        name: {
            type: String,
            required: [true, '貼文姓名未填寫'],
            cast: false
          },
        content:{
            type: String,
            required: [true,"內容必填"],
            cast: false
        },
        likes: {
            type: Number,
            default : 0,
            select :true,
            cast: false
        }
    },{
        versionKey: false,
        timestamps: true
    }
    );
    const Post = mongoose.model('post', postSchema);
    
    module.exports = Post;