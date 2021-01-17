/**
 * 单项缓存
 */
export class ItemCache {
    public data: any = null;
    public timeout: number = 60 * 24;
    public cacheTime: any = null;
    constructor(data, timeout) {
        this.data = data;
        this.timeout = timeout;
        this.cacheTime = new Date().getTime;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ExpriesMemoryCacheService {
    static cacheMap = new Map();

    /**
     * 设置是否过期
     * @param name
     * @returns {boolean}
     */
    static isOverTime(name) {
        const data = ExpriesMemoryCacheService.cacheMap.get(name);
        if (!data) { return true; }
        const currentTime = new Date().getTime();
        const overTime = (currentTime - data.cacheTime) / 1000;
        if (Math.abs(overTime) > data.timeout) {
            ExpriesMemoryCacheService.cacheMap.delete(name);
            return true;
        }
        return false;
    }

    /**
     * 数据是否存在缓存
     * @param name
     * @returns {boolean}
     */
    static has(name) {
        return !ExpriesMemoryCacheService.isOverTime(name);
    }

    /**
     * 删除缓存
     * @param name
     * @returns {boolean}
     */
    static delete(name) {
        return ExpriesMemoryCacheService.cacheMap.delete(name);
    }

    /**
     * 获取缓存数据
     * @param name
     * @returns {null}
     */
    static get(name) {
        const isDataOverTime = ExpriesMemoryCacheService.isOverTime(name);
        return isDataOverTime ? null : ExpriesMemoryCacheService.cacheMap.get(name).data;
    }

    /**
     * 设置缓存
     * @param name
     * @param data
     * @param timeout
     */
    static set(name, data, timeout = 1200) {
        const itemCache = new ItemCache(data, timeout);
        ExpriesMemoryCacheService.cacheMap.set(name, itemCache);
    }

}
