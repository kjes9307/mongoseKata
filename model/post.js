// 連接資料庫
const mongoose = require('mongoose');
    // 建立collection 
    const postSchema = new mongoose.Schema( {
        name: {
            type: String,
            required: [true, '貼文姓名未填寫']
          },
        content:{
            type: String,
            required: [true,"價格必填"],
            default : "write something here.."
        },
        likes: {
            type: Number,
            default : 0
        }
    },{
        versionKey: false,
        timestamps: true
    }
    );
    const post = mongoose.model('post', postSchema);
    
    module.exports = post;