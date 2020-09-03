var amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'puppeteer_bot';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      var n = msg.content.toString();

      console.log(" [.] получен ответ(%s)", n);

      var r="Запрос успешно отправлен";
      setTimeout(function(){
        channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId
        });
      }, 5000);

      channel.ack(msg);
    });
  });
});