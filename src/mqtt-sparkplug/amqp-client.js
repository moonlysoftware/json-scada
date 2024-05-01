require("dotenv").config();
var amqp = require("amqplib/callback_api");

// Config
let amqpURL = process.env.AMQP_URL || "amqp://localhost";
let exchange = "local.v1.data";
let key = "json-scada";

let publishChannel = null;

// Consume messages from the AMQP queue
// TODO: currently only CMD messages from backoffice
// TODO: Check auto recovery
exports.consume = function (callback, queueName = null) {
    amqp.connect(amqpURL, function (error0, connection) {
        if (error0) {
            throw error0;
        }

        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            // Create the queue name
            var queue = queueName ?? process.env.APP_ENV + ".v1.cmd_queue";

            channel.assertQueue(queue, {
                durable: false,
            });

            console.log(" [x] Awaiting RPC requests");
            channel.consume(queue, function reply(msg) {
                let response = callback(msg);

                // Send response to replyTo queue
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(response)),
                    {
                        correlationId: msg.properties.correlationId,
                    }
                );

                // Acknowledge the message
                channel.ack(msg);
            });
        });
    });
};

// Init publish channel
// This resolves the issue of a new channel being created with each publish
exports.init = function () {
    console.log("Initializing AMQP client");
    amqp.connect(amqpURL, function (error0, connection) {
        if (error0) {
            throw error0;
        }

        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertExchange(exchange, "fanout");
            publishChannel = channel;
            console.log("Channel created");
        });
    });
};

// Publish a message to the AMQP exchange
exports.produce = function (payload) {
    publishChannel.publish(exchange, key, Buffer.from(payload));
};
