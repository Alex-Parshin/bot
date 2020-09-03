#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', async function(error0, connection) {
  if (error0) {
    throw error0;
  }
  
  	await connection.createChannel(async function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'news';

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
	
	await channel.consume(queue, function(msg) {
		console.log(" [x] Received %s", msg.content.toString());

		setTimeout(function() {
			console.log("[X] Done")
			channel.sendToQueue(queue, Buffer.from("Received"))
            console.log("Message was sent")
		}, 10000);
	}, 
	{
	    noAck: false
	});

	await connection.createChannel(async function(error1, channel) {
        if (error1) throw error1

        channel.assertQueue('queue_conf', {
            durable: false
        })

        await channel.sendToQueue('queue_conf', Buffer.from("Received"))
        console.log("Message was sent")
    })


  });
});