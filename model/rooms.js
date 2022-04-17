// 連接資料庫
const mongoose = require('mongoose');
    // 建立collection 
    const roomSchema = new mongoose.Schema( {
        name: String,
        price:{
            type: Number,
            required: [true,"價格必填"]
        },
        rating: Number
        // ,create_time:{ 自訂義時間& query 要不要秀
        //     type: Date,
        //     default: Date.now,
        //     select: false
        // }
    },{
        versionKey: false,
        timestamps: true
        //, collection : "寫你要的name"
    }
    );
    // 預設加上"s"
    const Room = mongoose.model('Room', roomSchema);
    
    module.exports = Room;