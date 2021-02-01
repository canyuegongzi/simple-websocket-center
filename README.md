### 系统功能

基于websocket和消息队列构建即时聊天系统（个人基于node的微服务的实践项目）。
#### 基本特点
1. 普通IM系统基本功能
2. 群聊（后期迭代）
3. 消息持久化备份
4. AI智能聊天功能
5. PC、移动端统一兼容
6. 支持VUE组件、iframe方式引入
#### 系统划分
##### **后端服务**
涉及技术栈主要包括kafka(日志收集)、rabbitmq(消息推送)、mongodb|mysql|redis(数据缓存、持久化)，websocket。基本框架采用nest.js系统工程包括如下：
1. simple-user-center-server(用户中心)
2. simple-push-center-server（消息推送服务）
3. simple-chat-center-server（IM服务）
4. simple-file-center-server(文件系统服务)
##### **前端服务**
基本框架采用vue搭建，系统工程包括如下：
1. simple-chart-web
#### 效果展示
##### 整体效果
![整体效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2046bf49d4248dda7d908acaa0c8267~tplv-k3u1fbpfcp-zoom-1.image)
##### 聊天效果
![整体效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/933429aa4710486cbe5712cef9b54094~tplv-k3u1fbpfcp-zoom-1.image)
##### AI闲聊
![整体效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4513686e8d54c1690cd2dbe162354e8~tplv-k3u1fbpfcp-zoom-1.image)
#### 部署方式
1. 普通node项目方式
2. Docker构建相应的镜像并启动
3. 单机版k8s(k3s)部署(提供对应的deployment.yaml模板)
### 系统设计
#### 服务关系图
![服务关系图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dddd110c928e47558badd272c6aedead~tplv-k3u1fbpfcp-zoom-1.image)
1. 用户通过simple-user-center-serve登录后，simple-chat-senter-server根据设备类型，用户id维护socket连接。
2. simjple-push-center-server主要负责向消息队列中发布消息，并将消息缓存到离线库和实时消息库。
3. simple-chat-senter-server通过订阅消息队列，监听到消息，simple-chat-senter-server通过消息类型(目标用户|群组|系统|操作)，查询当前服务维护socket用户，判断用户是否能在线，用户在线的情况下将元数据发送到用户，并发送指令把该条消息从消息离线库中删除,实时消息库标记。
4. 客户端监听消息，进行逻辑操作。
### 功能设计
#### 离线存储|实时消息存储
系统中存储主要分为消息离线存储和实时聊天存储以及消息持久化存储。
##### 概述
离线存储主要负责在用户离线的情况下对消息进行临时缓存，实时消息主要负责会话中的消息内容存储。
消息体中含有发送人、消息id（消息去重）、消息发送时间、消息体内容、聊天类型为图片、文件等非字符串类型时先通过saimple-file-center-server进行转存并将该消息标记为文件，内容标记为文件转存地址。
![整体效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/825a91b6aa4547628e686a6795a3b7d4~tplv-k3u1fbpfcp-zoom-1.image)
```
### 实时聊天表 | 离线存储表
@Entity({name: 'friend_message'})
export class FriendMessageEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  friendId: string;

  @Column()
  content: string;

  @Column()
  type: string;

  @Column('double')
  createTime: number;

  @Column()
  hashId: string;

  @Column({default: 0})
  status: number;
}
```
##### 核心代码
```
export interface WsFriendMessageInfo {
    type?: string;
    content?: string;
    friendId?: number | string;
    userId?: number | string;
    time?: number | string;
    hashId?: string;
    status?: string;

}
/**
 * 好友消息持久化
 * @param data
 */
public async friendMessagePersistence(data: WsFriendMessageInfo) {
    try {
        return await this.friendMessageEntityRepository.insertOne({...data})
    }catch (e) {
        throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200)
    }
}
```
#### 即时感知
##### 概述
![整体效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7b6ca74df90413f94427b85f53d7113~tplv-k3u1fbpfcp-zoom-1.image)

如上图，对于一个在线客户端，每个会话都会维护一个未读消息的计数（小红点），也会有一个总未读数的计数，这个数量在本系统中是维护在本地的(减少IO请求)，也可以通过redis进行缓存。这些未读消息，指的就是消息已经进行了存储，但是还未被用户点开的消息数量。

客户端（或应用层）在拉取未读消息列表后，会遍历所有新消息并根据好友id进行分类统计，然后将新消息所对应会话的未读计数累加1，这样实现了未读消息的即时感知与更新。当用户点开会话后，触发请求由simple-chat-center-server进行消息标记，离线删除，未读计数清零。

在更新未读数的同时，会话列表中还会有最新消息的简短摘要信息以及最新消息的发送时间等。这些可以在遍历新消息列表时不断更新。
##### 核心代码
**实时未读消息维护**
```
/**
 * 对首页消息进行分页
 * @param messageList
 * @param friendList
 */
public async getFriendMessageGroupList(messageList: FriendMessageEntity[], friendList: any[], userList: any[], userId: string) {
    const friendMessageMap = {};
    for (let i: number = 0; i < friendList.length; i ++) {
        const includeUserIds: any[] = [friendList[i]].concat(userList);
        const messageArr: FriendMessageEntity[] = messageList.filter((item: FriendMessageEntity) => {
            return includeUserIds.includes(item.friendId) && includeUserIds.includes(item.userId);
        });
        const unreadHashIds = [];
        const unreadMessageArr = messageArr.filter((item1: FriendMessageEntity) => {
            if (item1.status + '' === '0' && item1.friendId + '' === userId + '') {
                unreadHashIds.push(item1.hashId);
            }
            return item1.status + '' === '0' && item1.friendId + '' === userId + '';
        });
        if (messageArr.length) {
            friendMessageMap[friendList[i]] = [{...messageArr[0], messageTotal: messageArr.length, unreadMessageTotal: unreadMessageArr.length, unreadHashIds}];
        }
    }
    return {data: friendMessageMap, total: messageList.length, friendList};
}
```
**客户端消息维护**
```
async getHomeList() {
    if (!this.friendList.length){
        return
    }
    let data = null;
    const messageList = [];
    try {
        const res = await this.$get(IMCenterApi.homeMessageList.url, {
            userId: this.currentInfo.userId,
            pageSize: 100,
            page: 1,
            time: dayjs().subtract(3, 'days').valueOf()
        }, IMCenterApi.homeMessageList.server)
        data = res.data.data.data
        for (let key in data) {
            const friendInfo = this.friendList.find((item) =>{
                return item.friendId + '' === key + '';
            })
            const newMessage = {friendId: key, message: {...data[key][0], time: dayjs(data[key][0].createTime).format('YYYY-MM-DD HH:mm:ss')}, friendInfo: friendInfo}
            messageList.push(newMessage)
        }
        this.setHomeMessageList(messageList);
        this.loading = false;
        this.finished = true;
    }catch (e) {
        data = null
        this.loading = false;
        this.finished = true;
    }
    return messageList;
},
```
#### 关系维护
##### 概述
系统中关系维护依托于simple-user-center-server,主要包括关系维护包含：人与人的关系、人与群的关系以及人与会话的关系。

**用户关系维护**

用户关系维护通过userId和friendId字段标识用户的好友关系，例如李四的好友包括userId为李四的列表。其他字段为好友的附属信息。

frienfName和friendIcon字段涉及user-center-server和该表的信息同步。
这个设计的好处在于用户可以直接通过自己的ID与好友的ID快速获取会话信息。只要用户在写入两行时做好一致性维护。

如果好友关系一旦解除，可以直接拼出关系表中两行主键对用户关系，通过做物理删除（删除行）或逻辑删除（属性列状态修改）结束两两个人的好友关系即可；

![整体效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5b22c532ed74ee0ad697722c862fa20~tplv-k3u1fbpfcp-zoom-1.image)
```
@Entity()
export class UserMap {
  @ObjectIdColumn({ name: 'id' })
  id: ObjectID;

  @Column()
  friendId: string;

  @Column()
  friendName: string;

  @Column()
  friendIcon: string;

  @Column()
  userId: string;
}
```

**请求关系维护**

该表中主要维护添加好友，添加群组的关系维护。
![整体效果图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74256094080143a781236dc4a1e1e269~tplv-k3u1fbpfcp-zoom-1.image)

```
@Entity()
export class ImAddRequestEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  targetId: string;

  @Column()
  targetName: string;

  @Column()
  userName: string;

  @Column()
  targetIcon: string;

  @Column()
  formId: string;

  @Column()
  type: string;

  @Column()
  note: string;

  @Column()
  state: boolean;

  @Column()
  createTime: number;

  @Column()
  updateTime: number;

  @Column()
  callBackType: number; // 1 未应答 2： 同意  3： 不同意
}
```
##### 核心代码
代码见simple-chat-center-server/serveice/FriendService.ts
```
/**
 * 请求添加
 * @param params
 */
public async requestAddFriend(params: RequestAddFriendDto) {
    try {
        await this.httpService.post(`${httpUrl.pushApi}/amqpMessage/newFriendRequest`, params).toPromise();
        return await this.imAddRequestEntityRepository.insertOne({
            targetId: params.targetId.toString(),
            targetName: params.targetName,
            targetIcon: params.targetIcon,
            formId: params.formId.toString(),
            type: params.type,
            note: params.note,
            state: false,
            callBackType: 1,
            createTime: new Date().getTime(),
            updateTime: new Date().getTime(),
        });
    } catch (e) {
        throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
    }
}

/**
 * 好友请求反馈
 * @param params
 */
public async callbackRequest(params: RequestCallBackDto) {
    try {
        // 1 未应答 2： 同意  3： 不同意
        const requestInfo: ImAddRequestEntity = await this.imAddRequestEntityRepository.findOne(params.id);
        await this.imAddRequestEntityRepository.updateOne({
            _id: new ObjectID(params.id),
        },  { $set: {
            callBackType: params.callBackType, state: true, updateTime: new Date().getTime(),
        } });
        if (params.callBackType === 2) {
            if (requestInfo.type === 'FRIEND') {
                await this.createFriend(requestInfo);
            }
            if (requestInfo.type === 'GROUP') {
                await this.userMapRepository.insertOne({friendId: requestInfo.targetId.toString(), userId: requestInfo.formId.toString()});
            }
        }
        if (params.callBackType === 3) {
            await this.imAddRequestEntityRepository.updateOne({_id: new ObjectID(params.id)}, {callBackType: 3, state: false});
        }
    } catch (e) {
        console.log(e);
        throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
    }
}
```


