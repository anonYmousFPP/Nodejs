const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const app = express();
app.use(express.json());


app.post('/grpc', (req, res) => {
    const {data} = req.body;
    try{
        const packageDef = protoLoader.loadSync("../common file/todo.proto", {});
        const grpcObject = grpc.loadPackageDefinition(packageDef);
        const todoPackage = grpcObject.todoPackage;
        const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())
        client.createTodo({
            "text": data
        }, (err, response) => {
            if (err) {
                console.error("Error:", err);
                res.send({message: `Error is found ${err}`}).status(400);
            }
            console.log("Received from the server:", response);
            res.send({message: "Data sent successfully"}).status(200);
        });
    }
    catch(err){
        res.send({message: `Error is found ${err}`}).status(400);
    }
})

app.listen(3001);