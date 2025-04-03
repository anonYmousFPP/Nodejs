const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("../common file/todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

const todos = [];

function createTodo(call, callback) {
    console.log("[SERVER] Received Todo:", call.request); 
    const todoItem = {
        id: todos.length + 1,
        text: call.request.text,
    };
    todos.push(todoItem);
    callback(null, todoItem); // Send back the created todo
}

function readTodos(call, callback) {
    callback(null, { items: todos }); 
}

server.addService(todoPackage.Todo.service, {
    createTodo,
    readTodos,
});

// Start the server
server.bindAsync(
    "0.0.0.0:40000",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error("Server bind error:", err);
            return;
        }
        console.log(`Server running on port ${port}`);
    }
);