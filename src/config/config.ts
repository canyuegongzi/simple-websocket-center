const config = {
    connectMicroservice: 3001, // 微服务端口
    port: 8884,
    tokenSetTimeOut: 7200,
    globalPrefix: 'simple-chat-center/v1.0',
};
export const redisConfig = {
    name: 'user_token',
    url: 'redis://47.106.104.22:6379/4',
};

export const mongoDbConfig = {
    name: 'simple-chart-center',
    url: 'mongodb://47.106.104.22/simple_message_center',
    // url: 'mongodb://127.0.0.1/simple_message_center',
};

export const mysqlConfig = {
    name: 'simple-chart-center',
    url: 'mongodb://47.106.104.22/simple_message_center',
    // url: 'mongodb://127.0.0.1/simple_message_center',
};

export const httpUrl = {
  userApi: 'http://47.106.104.22:8881/simple-user-center/v1.0',
  // userApi: 'http://127.0.0.1:8881',
};
export const rabbitMQConfig = {
        url: 'amqp://root:123ADD123ADD@148.70.150.131:5179',
        name: 'MESSAGE_SERVICE',
        queue: 'message_queue',
        websocketFriendMessageQueue: 'websocket-friend-message-queue',
        websocketFriendMessageExchange: 'friend-message',
        websocketGroupMessageExchange: 'group-message',
        websocketGroupMessageSubscribe: 'subscribe-gm',
        websocketFriendMessageSubscribe: 'subscribe-fm',
        websocketGroupMessageQueue: 'websocket-group-message-queue',
};
export default config;
