export type Account = {
  id: string;
  name: string;
  maxClaims: number;
  defaultTimeoutInMinutes: number;
  url?: string;
  claims: Array<AccountClaim>;
};

export type AccountClaim = {
  id: string;
  name: string;
  endTime: string;
};

export type Context = {
  accounts: KVNamespace;
};
