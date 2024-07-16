interface KvEntryTicket {
  timestamp: string;
  eventId: number;
  name: string;
  email: string;
  confirmed: boolean;
  token?: string;
}
