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

export const httpUrl = {
  userApi: 'http://127.0.0.1:9002/simple-user-center/v1.0',
  pushApi: 'http://127.0.0.1:10001/simple-notice-center/v1.0'  ,
};
export const rabbitMQConfig = {
        url: '',
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
    botId: ''
};
export default config;
