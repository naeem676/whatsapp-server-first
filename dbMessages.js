import mongoose from 'mongoose';


const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    time: String,
    received: Boolean
})

export default mongoose.model('messages', whatsappSchema)