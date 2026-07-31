import {getAllTransactions, Transaction} from "@/lib/db";

export async function GET(){
    const transactions: Transaction[] = getAllTransactions()
    return Response.json({transactions})
}

export async function POST(req: Request) {
    const body = await req.json()
}