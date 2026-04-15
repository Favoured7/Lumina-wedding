import express from "express";
import sequelize from "./database/db.js";

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({msg:"welcome to Lumina; we make your event memorable"})
})
// const PORT = process.env.PORT || 3000;

// Import routes
import userRoutes from "./routes/features.js";
app.use("/users", userRoutes);
// app.use("/student", studentRoutes);

const PORT = process.env.PORT || 3000


async function start(){
    try {
        await sequelize.authenticate();
        console.log("Database connected .... successfully");

        app.listen(3000, () => {
          console.log(`Server running on :http://localhost:${PORT}`);
        });
        
    } catch (e) {
        console.log("DB connection failed;", e.msg)
    }
}

await start();