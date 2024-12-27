const thumbnailControllers = require("../controllers/thumbnailControllers");


module.exports = async function(fastify,opts){
    fastify.register(async function(fastify){
        fastify.addHook("preHandler",fastify.authenticate);

        fastify.post("/",thumbnailControllers.createThumbnail);
        fastify.get("/",thumbnailControllers.getThumbnails);
        fastify.get("/:id",thumbnailControllers.getThumbnail);
        fastify.put("/:id",thumbnailControllers.updateThumbnail);
        fastify.delete("/:id",thumbnailControllers.deleteThumbnail);
        
    })
}