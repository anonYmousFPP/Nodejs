const kafka = require('../common file/client');

async function init(){
    const consumer = kafka.consumer({groupId: "user-1"});
    await consumer.connect();

    await consumer.subscribe({topic: "rider-updates"});

    await consumer.run({
        eachMessage: async ({topic, partition, message, heatbeat, pause}) => {
            console.log(`[${topic}]: PART:${partition}:`, message.value.toString());
        }
    })
}

init();