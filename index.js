
///importing 
import express from 'express';
import mongoose from 'mongoose'
import Pusher from 'pusher';
import Message from './dbMessages.js';
import cors from 'cors';



///app config
const app = express();

const port = process.env.PORT || 1996

const pusher = new Pusher({
    appId: "1198945",
    key: "ce7cab24ca7bee42b392",
    secret: "5b1d3beb79582ff02c82",
    cluster: "mt1",
    useTLS: true
  });

//middle wear
app.use(express.json())
app.use(cors())
//DB config
const connectURL = 'mongodb+srv://naeem:naeem321@cluster0.rg1nk.mongodb.net/whatsapp?retryWrites=true&w=majority'
mongoose.connect(connectURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
})

const db = mongoose.connection
db.once('open', () => {
    
    const msgCollection = db.collection
    ("messages");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change)=>{
        
        if(change.operationType === 'insert') {
            const messagesDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', 
            {
                name:messagesDetails.name,
                message: messagesDetails.message
            });
        } else{
            console.log('error triggering Pusher')
        }
    })
})


//?????

///api routing
app.get('/', (req, res)=>res.status(200).send('hello world'));

app.post('/messages/new', (req, res)=>{
    const dbMessages = req.body;
    

    Message.create(dbMessages, (err, data)=>{
        if (err) {
            res.status(500).send(err)
        } else {
             res.status(200).send(data);
        }
    })
})

app.get('/messages/sync', (req, res)=>{
    

    Message.find( (err, data)=>{
        if (err) {
            res.status(500).send(err)
        } else {
             res.status(200).send(data);
        }
    })
})

//listener
app.listen(port);