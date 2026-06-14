// app/api/moderate/route.ts
import { NextResponse } from "next/server";
import ContentSafetyClient from "@azure-rest/ai-content-safety";
import { isUnexpected } from "@azure-rest/ai-content-safety";
import { getDbConnection } from "../../../lib/db";
import sql from "mssql";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        const endpoint = process.env.AZURE_CONTENT_SAFETY_ENDPOINT || "";
        const key = process.env.AZURE_CONTENT_SAFETY_KEY || "";
        const client = ContentSafetyClient(endpoint, { key });

        const analyzeResult = await client.path("/text:analyze").post({
            body: { text: text }
        });

        if (isUnexpected(analyzeResult)) {
            throw new Error("Azure AI call failed");
        }

        const categories = analyzeResult.body.categoriesAnalysis;
        const isSafe = categories.every(cat => (cat.severity ?? 0) <= 1);

        const pool = await getDbConnection();
        const request = pool.request();
        
        request.input("commentText", sql.NVarChar, text);
        request.input("isSafe", sql.Bit, isSafe ? 1 : 0);
        
        // This query creates the table if it doesn't exist, then inserts
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Comments' AND xtype='U')
            CREATE TABLE Comments (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                Content NVARCHAR(MAX),
                IsSafe BIT,
                CreatedAt DATETIME DEFAULT GETDATE()
            );
            INSERT INTO Comments (Content, IsSafe) VALUES (@commentText, @isSafe);
        `);

        return NextResponse.json({ 
            success: true, 
            isSafe, 
            details: categories 
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}