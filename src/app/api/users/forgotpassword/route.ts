import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mail";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        console.log(reqBody);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User with this email does not exist" },
                { status: 400 }
            );
        }

        console.log("User exists, sending reset email");

        // Send password reset email
        await sendEmail({
            email,
            emailType: "RESET",
            userId: user._id
        });

        return NextResponse.json({
            message: "Password reset email sent successfully",
            success: true,
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}