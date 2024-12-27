const Thumbnail = require("../models/thumbnail");
const path = require("path");
const fs = require("fs");
const {pipline} = require("stream");
const util = require('util');
const { request } = require("http");
const piplineAsync = util.promisify(pipline)


exports.createThumbnail = async (request,request)=>{
    try {
        const parts = request.part();
        let fields={};
        let filename;

        for await (const part of parts){
            if(part.file){
                const filename = `${Date.now()}-${part.filename}`;
                const saveto = path.join(__dirname,`../uploads/thumbnails/${filename}`);
                await piplineAsync(part.file,fs.createWriteStream(saveto));

            }
            else{
                fields[part.filename] = parts.value;
            }
        }

        const thumbnail = new Thumbnail({
            user: request.user._id,
            videoname: fields.videoname,
            version: fields.version,
            image:`/uploads/thumbnails/${filename}`,
            paid:fields.paid === "true"
            
        });

        await thumbnail.save();
        reply.code(201).send(thumbnail)





    } catch (error) {
        reply.send(error);
    }
}



moudels.exports = async function(fastify,opts){
    fastify.register(async function(fastify){
        fastify.addHook("preHandler",fastify.authenticate);

        fastify.post("/",thumbnailControllers.createThumbnail);

    })
}


exports.getThumbnails = async (request,reply)=>{
    try {
       const thumbnails =  await thumbnails.find({user:request.user._id})
       reply.send(thumbnails)
    } catch (error) {
        reply.send(error)
    }
}

exports.getThumbnail = async (request,reply)=>{
    try {
        //validate the id
     const thumbnail =   await thumbnails.findone({_id:request.params.id,user:request.user._id})
        if(!thumbnail){
            return reply.code(404).send({message:"Thumbnail not found"})
        }
        reply.send(thumbnail)




    } catch (error) {
        reply.send(error);
    }
}

exports.updateThumbnail = async (request,reply)=>{
    try {
        //validate the id
        const thumbnail = await thumbnails.findoneAndUpdate({_id:request.params.id,user:request.user._id},request.body,{new:true})
        if(!thumbnail){
            return reply.code(404).send({message:"Thumbnail not found"})
        }
        reply.send(thumbnail)

    } catch (error) {
        reply.send(error)
    }
}

exports.deleteThumbnail = async (request,reply)=>{ 
    try {
        //validate the id
        const thumbnail = await thumbnails.findoneAndDelete({_id:request.params.id,user:request.user._id})
        if(!thumbnail){
            return reply.code(404).send({message:"Thumbnail not found"})
        }
        reply.send(thumbnail)

    } catch (error) {
        reply.send(error)
    }
}


exports.deleteAllThumbnails = async (request,reply)=>{
    try {
       const thumbnails = await thumbnails.deleteMany({user:request.user._id})
        reply.send({message:"All Thumbnails deleted"})
    } catch (error) {
        reply.send(error);
}
}