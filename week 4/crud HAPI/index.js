const hapi =  require('@hapi/hapi')
const {User} = require('./db');

const init = async () => {
    const server = hapi.server({
        port: 3000,
        host: 'localhost'
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: async(request, h) => {
            try{
                const data = await User.find();
                return h.response({data}).code(200);
            }
            catch(err){
                console.log(`Error saving to mongodb ${err}`);
                return h.response({error : err.message}).code(400);
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/',
        handler: async (request, h) => {
            try{
                const user = new User(request.payload);
                const savedUser = await user.save();
                console.log(`Data saved to mongodb ${savedUser}`);
                return h.response(savedUser).code(200);
            }
            catch(err){
                console.log(`Error saving to mongodb ${err}`);
                return h.response({error : err.message}).code(400);
            }
        }
    })

    server.route({
        method: 'PATCH',
        path: '/{id}',
        handler: async (request, h) => {
            try{
                const updates = request.payload;
                const updatedUser = await User.findByIdAndUpdate(request.params.id, updates, {new: true});

                if(updatedUser === -1){
                    return h.response({error: "User not found"}).code(404);
                }

                return h.response(updatedUser).code(200);
            }
            catch(err){
                console.log(`Error saving to mongodb ${err}`);
                return h.response({error : err.message}).code(400);
            }
        }
    })

    server.route({
        method: 'DELETE',
        path: '/{id}',
        handler: async(request, h) => {
            try{
                const deleteUser = await User.findByIdAndDelete(request.params.id);
                if(deleteUser === -1){
                    return h.response({error: "user not found"}).code(400);
                }

                return h.response({message: "user deleted"}).code(200);
            }
            catch(e){
                console.log(e.error);
                h.response({error: err.message}).code(400);
            }
        }
    })


    await server.start();
    console.log(`Server running on %s ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();