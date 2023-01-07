const { db } = require("./firebase");
import { AccountType, UserDataTarget, UTCString, Deadlines } from "./types";

/* Returns the current UTC time as a string in the format
    YYYY-MM-DD HH:MM:SS UTC
    2022-12-25 08:01:10 UTC
*/
const getUTCTimestamp = (offsetDays?: number): UTCString => {
  const date = new Date();
  date.setDate(date.getDate() + (offsetDays || 0));

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // January is 0
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
};

const writeToUser = (uid: string, target: UserDataTarget, content: any) => {
  if (
    [
      "delegations",
      "form",
      "pendings",
      "processed",
      "notes",
      "settings",
    ].includes(target)
  ) {
    const ref = db.ref(`appdata/${uid}/livedata/${target}`);
    ref.set(content);
  }
};

const updateAccountType = (uid: string, type: AccountType, email?: string) => {
  const accountsRef = db.ref(`adminData/accounts/${uid}`);
  const deadlinesRef = db.ref(`adminData/deadlines`);
  accountsRef.child("type").set(type);

  if (type === "Premium") {
    // Add account entry
    const threeMonthsFuture = getUTCTimestamp(90);
    accountsRef.child("expiration").set(threeMonthsFuture);

    // Add deadline entry
    deadlinesRef.child(threeMonthsFuture.slice(0, 10)).push(uid);
  } else {
    accountsRef.child("expiration").set(null);
    if (email) accountsRef.child("email").set(email);
  }
};

const expireAccounts = () => {
  const timestamp = getUTCTimestamp();
  const deadlinesRef = db.ref(`adminData/deadlines/${timestamp.slice(0, 10)}`);
  deadlinesRef.once("value", (snapshot: any) => {
    const data: Deadlines = snapshot.val() || {};
    const targets = Object.values(data);

    targets.forEach((uid: string) => {
      updateAccountType(uid, "Starter");
    });

    deadlinesRef.set(null);
    console.log(`[${timestamp}]: Expired ${JSON.stringify(targets)}`);
  });
};

module.exports = {
  getUTCTimestamp,
  writeToUser,
  updateAccountType,
  expireAccounts,
};
