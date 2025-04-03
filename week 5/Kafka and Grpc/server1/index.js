const express = require("express");
const kafka = require("../common file/client")

const app = express();
app.use(express.json());

async function kafkaConnection(){
    try{
        const admin = kafka.admin();
        console.log("Admin connecting");

        admin.connect();
        console.log("Admin connection success");
        console.log("Creating topic [rider-updates]");

        await admin.createTopics({
            topics: [
                {
                    topic: "rider-updates",
                    numPartitions: 2,
                }
            ]
        })
        console.log("Topic created success [rider-updates]");

        console.log("Disconnecting Admin");
        await admin.disconnect();
    } catch (error) {
        console.error("Kafka admin error:", error);
        return false;
    }
}

async function init (name, location){
    try{
        const producer = kafka.producer();
        console.log('Connecting producer');

        await producer.connect();
        console.log('Producer connected successfully');

        await producer.send({
            topic: 'rider-updates',
            messages: [
                {
                    partition: 0,
                    key: "location-update",
                    value: JSON.stringify({name: `${name}`, location: `${location}`}),
                }
            ]
        })

        await producer.disconnect();
    } catch (error) {
        console.error("Producer error:", error);
        return false;
    }
}

app.post('/producer', (req, res) => {
    const {name, location} = req.body;
    console.log(name, location);
    
    if (!name || !location) {
        return res.status(400).json({
            status: "error",
            message: "Name and location are required",
            data: null
        });
    }
    const kafkaConnected = kafkaConnection();

    if (!kafkaConnected) {
        return res.status(500).json({
            status: "error",
            message: "Failed to connect to Kafka",
            data: null
        });
    }

    const messageSent = init(name, location);
    if (!messageSent) {
        return res.status(500).json({
            status: "error",
            message: "Failed to send message",
            data: null
        });
    }

    return res.status(200).json({
        message: "Message successfully sent to Kafka",
        data: {
            name,
            location
        }
    });
})

app.listen(3000);