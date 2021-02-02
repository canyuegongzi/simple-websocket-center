export class AffirmChatMessageDto {
    messageType: string; // ['FRIEND' | 'GROUP' | 'SYSTEM', 'OTHER'];

    messageId: string;

    hashId: string;

    status: string;

    userId: string;

    groupCode: string;
}
