const config = {
    connectMicroservice: 3001, // 微服务端口
    port: 8884,
    tokenSetTimeOut: 7200,
};
export const redisConfig = {
    name: 'user_token',
    url: 'redis://127.0.0.1:6379/4',
};

export const mongoDbConfig = {
    name: 'simple-chart-center',
    url: 'mongodb://127.0.0.1/simple_message_center',
};

export const mysqlConfig = {
    name: 'simple-chart-center',
    url: 'mongodb://127.0.0.1/simple_message_center',
};

export const httpUrl = {
  userApi: 'http://127.0.0.1:8881',
};
export default config;
