import { __ } from '../../../helpers/functions';
import { RecipientUserCredentialInput } from './input.dto';

export class GiftCardQueueData {
  uid: string;
  recipient_user_credential?: RecipientUserCredentialInput;
  note?: string;
}
export class GiftCardRedeemQueueData {
  uid: string;
  user_id: bigint;
}
