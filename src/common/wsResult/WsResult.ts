interface ReturnData {
    [type: string]: any;
}
export enum WsMessageType {
    GETLIST,
    DELETE,
    GETINFO,
    CREATE,
    UPDATE,
    FILEERROR,
    OPERATE,
    WSCONNECTSUCCESS,
    WSCONNECTFAILE,
}
const WsMessageMap = {
    0: '查询成功',
    1: '删除成功',
    2: '查询成功',
    3: '添加成功',
    4: '更新成功',
    5: 'EXCEL失败',
    6: '操作成功',
    7: '连接成功',
    8: '连接失败',
};
export class WsResult {
    public code: number;
    public message: string;
    public data: ReturnData;
    public success: boolean;
    constructor(messageType: WsMessageType, data = null, success = true) {
        this.code = 200;
        this.message = WsMessageMap[messageType];
        this.data = data;
        this.success = success;
    }
}
