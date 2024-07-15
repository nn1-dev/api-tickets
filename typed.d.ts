interface KvEntryTicket {
  timestamp: string;
  name: string;
  email: string;
  confirmed: boolean;
  token?: string;
}
