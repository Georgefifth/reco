"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  UserProfile,
  SymptomCheckIn,
  JournalEntry,
  ProtocolStageLog,
  RedFlagEvent,
} from "./types";

interface ReCoDB extends DBSchema {
  profile: { key: string; value: UserProfile };
  checkins: { key: string; value: SymptomCheckIn; indexes: { date: string } };
  journal: { key: string; value: JournalEntry };
  protocol: { key: string; value: ProtocolStageLog };
  redflags: { key: string; value: RedFlagEvent };
}

let dbPromise: Promise<IDBPDatabase<ReCoDB>> | null = null;

function getDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB only available in browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<ReCoDB>("reco-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("profile")) {
          db.createObjectStore("profile", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("checkins")) {
          const s = db.createObjectStore("checkins", { keyPath: "id" });
          s.createIndex("date", "date");
        }
        if (!db.objectStoreNames.contains("journal")) {
          db.createObjectStore("journal", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("protocol")) {
          db.createObjectStore("protocol", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("redflags")) {
          db.createObjectStore("redflags", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

// Profile
export async function getProfile(): Promise<UserProfile | undefined> {
  const db = await getDB();
  return db.get("profile", "profile");
}

export async function saveProfile(p: UserProfile): Promise<void> {
  const db = await getDB();
  await db.put("profile", p);
}

export async function deleteProfile(): Promise<void> {
  const db = await getDB();
  await db.delete("profile", "profile");
}

// Check-ins
export async function getAllCheckIns(): Promise<SymptomCheckIn[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("checkins", "date");
  return all.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getCheckInByDate(date: string): Promise<SymptomCheckIn | undefined> {
  const db = await getDB();
  const all = await db.getAllFromIndex("checkins", "date", date);
  return all[0];
}

export async function saveCheckIn(c: SymptomCheckIn): Promise<void> {
  const db = await getDB();
  await db.put("checkins", c);
}

export async function deleteCheckIn(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("checkins", id);
}

// Journal
export async function getAllJournal(): Promise<JournalEntry[]> {
  const db = await getDB();
  const all = await db.getAll("journal");
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveJournal(j: JournalEntry): Promise<void> {
  const db = await getDB();
  await db.put("journal", j);
}

export async function deleteJournal(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("journal", id);
}

// Protocol logs
export async function getAllProtocolLogs(): Promise<ProtocolStageLog[]> {
  const db = await getDB();
  const all = await db.getAll("protocol");
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function saveProtocolLog(l: ProtocolStageLog): Promise<void> {
  const db = await getDB();
  await db.put("protocol", l);
}

// Red flags
export async function getAllRedFlags(): Promise<RedFlagEvent[]> {
  const db = await getDB();
  const all = await db.getAll("redflags");
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveRedFlag(r: RedFlagEvent): Promise<void> {
  const db = await getDB();
  await db.put("redflags", r);
}

// Wipe everything
export async function wipeAllData(): Promise<void> {
  const db = await getDB();
  await db.clear("profile");
  await db.clear("checkins");
  await db.clear("journal");
  await db.clear("protocol");
  await db.clear("redflags");
}

// Export everything as JSON
export async function exportAllData() {
  const [profile, checkins, journal, protocol, redflags] = await Promise.all([
    getProfile(),
    getAllCheckIns(),
    getAllJournal(),
    getAllProtocolLogs(),
    getAllRedFlags(),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    appVersion: "1.0.0",
    profile: profile ?? null,
    checkins,
    journal,
    protocol,
    redflags,
  };
}
