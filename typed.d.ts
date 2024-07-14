interface KvEntryTicket {
  timestamp: string;
  id: number;
  name: string;
  email: string;
  token?: string;
  confirmed: boolean;
}

interface KvEntryToken {
  eventId: number;
  email: string;
}
