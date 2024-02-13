type User = {
  displayName: string | null | undefined;
  photoURL: string | null;
  email: string | null;
  uid: string;
  isOnline: boolean;
  lastSignInTime?: string;
  lastLogOutTime: string | null;
  blockedUsers?: string[];
};

type Message = {
  id: string;
  senderId: string;
  chatId: string;
  date: string;
  text: string;
  img: string[];
  read: boolean;
};

type UserChat = {
  lastMessage: Message;
} & User;

type UpdatedData = {
  displayName: string;
  email: string;
  photoURL?: string;
};

type DeleteMessage = {
  message: Message[];
  deletedBy?: {
    [key: string]: boolean;
  };
};
