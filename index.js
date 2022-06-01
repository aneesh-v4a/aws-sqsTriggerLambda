const AWSSqs = require("aws-sdk/clients/sqs");

/**
 *  A Lambda to send message to sqs
 * @param {object} event - An Http event from api gateway
 */
exports.firstHandler = async (event, context) => {
  const messageToSQS = {
    message: event.body,
    correlationId: context.awsRequestId,
  };
  try {
    const resp = await sendMessageSQS(
      process.env.queueUrl,
      JSON.stringify(messageToSQS)
    );
  } catch (error) {
    throw new Error(`Error while executing FirstHandler :: ${error.message}`);
  }
  return {
    statusCode: 200,
    body: `Successfully send msg to sqs`,
  };
};

/**
 * A lambda to get triggered when sqs get a message
 * @param {object} event - An SQS triggered event
 */
exports.secondHandler = async (event, context) => {
  const msgFromQueue = JSON.parse(event.Records[0].body);
  console.log("Event ========>>>  ", event);
  console.log(`Message Received from SQS :: `, msgFromQueue);
  try {
    const resp = await deleteMessageSQS(
      process.env.queueUrl,
      event.Records[0].receiptHandle
    );
  } catch (error) {
    console.log(`Error while executing SecondHandler :: ${error.message}`);
    throw new Error(`Error while executing SecondHandler :: ${error.message}`);
  }
  console.log("Successfully deleted message");
};

function sendMessageSQS(queueUrl, msgBody) {
  return new Promise((resolve, reject) => {
    const sqs = new AWSSqs();
    try {
      const params = {
        QueueUrl: queueUrl,
        MessageBody: msgBody,
        MessageAttributes: null,
      };

      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log(`Error occured while sending message :: ${err.message}`);
          reject(
            new Error(`Error occured while sending message :: ${err.message}`)
          );
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      console.log(`Error while executing sendmessageSQS :: ${error.message}`);
      reject(`Error while executing sendmessageSQS :: ${error.message}`);
    }
  });
}

function deleteMessageSQS(queueUrl, receiptHandle) {
  return new Promise((resolve, reject) => {
    const sqs = new AWSSqs();
    try {
      const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      };
      sqs.deleteMessage(params, function (err, data) {
        if (err) {
          console.log(`Error occured while deleting message :: ${err.message}`);
          reject(
            new Error(`Error occured while deleting message :: ${err.message}`)
          );
        } else resolve(data);
      });
    } catch (error) {
      console.log(`Error while executing deleteMessageSQS :: ${error.message}`);
      reject(`Error while executing deleteMessageSQS :: ${error.message}`);
    }
  });
}
