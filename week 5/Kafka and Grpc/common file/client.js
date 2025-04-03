const { Kafka } = require("kafkajs");
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['172.50.5.88:9092']
})

module.exports = kafka;