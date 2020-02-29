import {Message} from '../model/mongoEntity/message.entity';

export namespace MessageList {
    export function dealMessageByToUser(data) {
        const map = {};
        const dest = [];
        const froms = [];
        for (let i = 0; i < data.length; i++) {
            const ai = data[i];
            if (!froms.includes(ai.from)) {
                froms.push(ai.from);
            }
            if (!map[ai.from]) {
                dest.push({
                    from: ai.from,
                    data: [ai],
                });
                map[ai.from] = ai;
            } else {
                for (let j = 0; j < dest.length; j++) {
                    const dj = dest[j];
                    if (dj.from == ai.from) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        console.log(froms)
        return  { dest, froms };
    }
}
