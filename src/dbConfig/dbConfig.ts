import mongoose, { connection } from "mongoose";

export async function connect(){
    try{
    
         mongoose.connect(process.env.DB_URL!);
         const connection = mongoose.connection;

         connection.on('connected',()=>{
            console.log('MongoDb connected successfully');
         })


         connection.on('error',(err)=>{
            console.log("MongoDb connection error. Please make sure MonogoDb is running" +  err);
            process.exit();
         })

    } catch(error){
        console.log("Something Went Wrong! ");
        console.log(error);
    }
}