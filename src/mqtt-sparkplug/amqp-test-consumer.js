require("dotenv").config();

const amqpClient = require("./amqp-client");
amqpClient.consume(function (message) {
    const decodedMessage = JSON.parse(message.content.toString());
    console.log("Decoded message", decodedMessage);
    return {
        status: "success",
        message: "Message received",
    };
});
