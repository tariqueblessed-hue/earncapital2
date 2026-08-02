import {
  getBalance,
  setBalance,
  getTransactions,
  saveTransactions,
  getNotifications,
  saveNotifications,
} from "./storage";

export function deposit(
  username: string,
  amount: number
) {
  const balance = getBalance(username);

  setBalance(username, balance + amount);

  const transactions = getTransactions(username);

  transactions.unshift({
    type: "Deposit",
    amount,
    status: "Completed",
    date: new Date().toLocaleString(),
  });

  saveTransactions(username, transactions);

  const notifications = getNotifications(username);

  notifications.unshift({
    title: "💳 Deposit Successful",
    message: `Your account has been credited with KES ${amount}.`,
    date: new Date().toLocaleString(),
  });

  saveNotifications(username, notifications);
}

export function withdraw(
  username: string,
  amount: number
) {
  const balance = getBalance(username);

  if (balance < amount) {
    return false;
  }

  setBalance(username, balance - amount);

  const transactions = getTransactions(username);

  transactions.unshift({
    type: "Withdrawal",
    amount,
    status: "Pending",
    date: new Date().toLocaleString(),
  });

  saveTransactions(username, transactions);

  const notifications = getNotifications(username);

  notifications.unshift({
    title: "💸 Withdrawal Requested",
    message: `Your withdrawal request of KES ${amount} has been received.`,
    date: new Date().toLocaleString(),
  });

  saveNotifications(username, notifications);

  return true;
}