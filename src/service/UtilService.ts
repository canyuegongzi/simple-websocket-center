import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
@Injectable()
export class UtilService {
    constructor() {}

    /**
     * 产生uuid标识
     * @param data
     */
    public createUuid(str: string) {
        return uuid.v1();
    }
}
