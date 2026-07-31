import {DatabaseSync} from "node:sqlite";

import path from "node:path";
import fs from "node:fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "app.db");

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, {recursive: true});
}

const db = new DatabaseSync(DB_PATH);

db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL, 
        status TEXT NOT NULL
    );
`);

export type TxType = "income" | "expense";
export type TxStatus = "paid" | "unpaid";

export interface Transaction {
    id: number;
    date: string;
    name: string;
    amount: number;
    type: TxType;
    status: TxStatus;
}

export function getAllTransactions(): Transaction[] {
    const rows = db.prepare("SELECT * FROM transactions ORDER BY date").all();
    return rows as unknown as Transaction[];
}

export function createTransaction(data: {
    date: string;
    name: string;
    amount: number;
    type: TxType;
    status: TxStatus;
}): Transaction {
    const result = db
        .prepare(
            `INSERT INTO transactions (date, name, amount, type, status) VALUES (?, ?, ?, ?, ?)`
        )
        .run(data.date, data.name, data.amount, data.type, data.status);

    const newId = result.lastInsertRowid as number;

    const row = db.prepare(`SELECT * FROM transactions WHERE id = ?`).get(newId);
    return row as unknown as Transaction;
}

export function deleteTransaction(id: number): void {
    db.prepare(`DELETE FROM transactions WHERE id = ?`).run(id);
}