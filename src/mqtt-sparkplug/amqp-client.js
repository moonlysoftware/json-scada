require("dotenv").config();
var amqp = require("amqplib/callback_api");

let amqpURL = process.env.AMQP_URL || "amqp://localhost";
let exchange = "local.v1.data";
let key = "json-scada";

let publishChannel = null;

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

exports.produce = function (payload) {
    publishChannel.publish(exchange, key, Buffer.from(payload));
};

exports.consume = function (callback, queueName = null) {
    amqp.connect(amqpURL, function (error0, connection) {
        if (error0) {
            throw error0;
        }

        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = queueName ?? process.env.APP_ENV + ".v1.cmd_queue";

            channel.assertQueue(queue, {
                durable: false,
            });
            channel.prefetch(1);

            console.log(" [x] Awaiting RPC requests");
            channel.consume(queue, function reply(msg) {
                let response = callback(msg);
                
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(response)),
                    {
                        correlationId: msg.properties.correlationId,
                    }
                );

                channel.ack(msg);
            });
        });
    });
};
