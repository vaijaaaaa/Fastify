require("dotenv").config();
const { request } = require("http");
const { default: mongoose } = require("mongoose");
const path = require("path");
const fastify = require("fastify")({logger: true});


//register a plugin
fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/sensible"));
fastify.register(require("@fastify/env"),{
    dotenv: true,
    schema:{
        type:"object",
        required:["PORT","MONGODB_URI","JWT_TOKEN"],
        properties:{
            PORT:{
                type:"string",
                default:3000
            },
            MONGODB_URI:{
                type:"string"
            },
            JWT_TOKEN:{
                type:"string"
            }
        }
    }
})

//register a plugin
fastify.register(require("./plugins/mongodb"));


//Declare a route
fastify.get("/",function(request,reply){
    reply.send({hello: "world"});
}
);

//test database connection

fastify.get("/test-db",async(request,reply)=>{
    try {
       const mongoose = fastify.mongoose;
       const connectionState = mongoose.connection.readyState;

       let status =""
       switch(connectionState){
        case 0:
            status = "diconnected";
            break;
        case 1:
            status = "connected";
            break;
        case 2:
            status = "connecting";
            break;
        case 3:status = "disconnecting";
            break;

        default:
            status = "unknown";
            break;
       }

    reply.send({database:status});
    } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({error: "Failed to test database"});
        process.exit(1);
    }
})


//Start the server

const start = async () => {
    try {
        await fastify.listen({port: process.env.PORT});
        fastify.log.info(
            `server is running at http://localhost:${process.env.PORT}`
        )
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

start();