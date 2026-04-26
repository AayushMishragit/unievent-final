const app = require("./app");  


const connectDB = require("./config/db");



const PORT = process.env.PORT || 5000; // main porting



const startServer = async () => {


  await connectDB();


  app.listen(PORT, () => {


    console.log(`🚀 UniEvent server running on http://localhost:${PORT}`);


  });

  
};

startServer();