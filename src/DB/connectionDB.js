import mongoose from "mongoose"

const checkConnectionDB = async ()=>
{
    try {
        await mongoose.connect("mongodb+srv://Mongoose_App:525252@cluster0.l21d93q.mongodb.net/Saraha_App2",
            {serverSelectionTimeoutMS:5000})
         console.log('Connected successfully to server..❤️');
    } catch (error) {
        console.error('sync to connect to the database.......', error);
    }
}

export default checkConnectionDB