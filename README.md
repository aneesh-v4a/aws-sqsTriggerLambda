# aws-sqsTriggerLambda
A sample tutorial where a lambda is triggered when a message arrives in sqs queue

## Index file overview

### firstHandler method
 This method is triggered by Api Gateway, using `POST` method. Then it will forward the event body along with awsRequestId to the `SQS Queue`.
 
### secondHandler method
 This method gets triggered whenever a message reaches `SQS Queue`. Now this handler will just log the message received and deletes it after.
 
 Thus a message can be transferred from one lambda to another lambda with the use of `SQS Queue`.
 
 The trigger rate of secondHandler can be varied by changing the `BatchSize` property in `SQSEvent` specified in `template.yaml` file. This can have a value in the range of 1 - 10.
