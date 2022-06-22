export interface SubscriptionTopicMessage {
  readonly id: string;
  readonly action: 'add' | 'remove';
}
