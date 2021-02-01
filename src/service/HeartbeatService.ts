import {HttpService, Injectable} from '@nestjs/common';
@Injectable()
export class HeartbeatService {
    constructor(
        private readonly httpService: HttpService,
    ) {}

}
