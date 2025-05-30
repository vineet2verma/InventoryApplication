import { NextResponse } from 'next/server';

import connectToDatabase from "@/app/api/models/connectDB";
import quotationOrder from "@/app/api/models/quotationOrder";

// GET all quotations
export async function GET() {
    await connectToDatabase();
    try {
        const quotations = await quotationOrder.find({});
        return NextResponse.json({ success: true, data: quotations });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// CREATE new quotation
export async function POST(req) {
    await connectToDatabase();

    try {
        const body = await req.json();
        const quotation = await quotationOrder.create(body);  // save 
        return NextResponse.json({ success: true, data: quotation }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// UPDATE a quotation by orderId
export async function PUT(req) {
    await connectToDatabase();
    try {
        const body = await req.json();
        const { orderId } = body;
        if (!orderId) return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 });

        const updated = await quotationOrder.findOneAndUpdate({ orderId }, body, { new: true });
        if (!updated) return NextResponse.json({ success: false, error: "Quotation not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// DELETE a quotation by orderId
export async function DELETE(req) {
    await connectToDatabase();
    try {
        const body = await req.json();
        const { orderId } = body;
        if (!orderId) return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 });

        const deleted = await quotationOrder.findOneAndDelete({ orderId });
        if (!deleted) return NextResponse.json({ success: false, error: "Quotation not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Quotation deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
