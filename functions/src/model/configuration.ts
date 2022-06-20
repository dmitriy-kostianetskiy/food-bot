export interface Configuration {
  readonly bot?: {
    readonly token?: string;
  };
  readonly function?: {
    readonly region?: string;
  };
  readonly menu?: {
    readonly path?: string;
  };
  readonly subscriptions?: {
    readonly path?: string;
  };
}
