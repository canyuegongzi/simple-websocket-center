const config = {
    connectMicroservice: 3001, // 微服务端口
    port: 8884,
    tokenSetTimeOut: 7200,
    globalPrefix: 'simple-chat-center/v1.0',
};
export const redisConfig = {
    name: 'user_websocket',
    url: 'redis://127.0.0.1',
};

export const mongoDbConfig = {
    name: 'simple-chart-center',
    url: 'mongodb://127.0.0.1/simple_message_center',
    // url: 'mongodb://127.0.0.1/simple_message_center',
};

export const httpUrl = {
  userApi: 'http://127.0.0.1:9002/simple-user-center/v1.0',
  pushApi: 'http://127.0.0.1:10002/simple-im-push-center/v1.0'  ,
  // userApi: 'http://127.0.0.1:8881',
};
export const rabbitMQConfig = {
        url: 'amqp://root:123ADD123ADD@127.0.0.1:5179',
        name: 'MESSAGE_SERVICE',
        queue: 'message_queue',
        websocketFriendMessageQueue: 'websocket-friend-message-queue',
        websocketRequestQueue: 'request-queue',
        websocketFriendMessageExchange: 'friend-message',
        websocketAffirmMessage: 'affirm-message',
        websocketRequestExchange: 'request',
        websocketGroupMessageExchange: 'group-message',
        websocketGroupMessageSubscribe: 'subscribe-gm',
        websocketFriendMessageSubscribe: 'subscribe-fm',
        websocketGroupMessageQueue: 'websocket-group-message-queue',
        websocketAffirmQueue: 'affirm-message-queue',
};

export const robotConfig = {
    appKey: '',
    SecretKey: '',
    userId: '',
    botId: '',
};
export default config;
