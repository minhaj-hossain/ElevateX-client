import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // 1. Authenticate the user via Better Auth
    const sessionData = await auth.api.getSession({
      headers: headersList,
    });

    if (!sessionData || !sessionData.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const authenticatedUser = sessionData.user;

    // 2. Parse payload sent from the client-side button click

   
    const body = await req.json();
    const { classId, sessionId, className, price } = body;

    console.log("Received booking request:", { classId, sessionId, className, price });

    if (!classId || !className || !price) {
      return NextResponse.json(
        { error: "Missing required booking metrics" },
        { status: 400 },
      );
    }

    // Convert string price (e.g., "45.00") to integer cents for Stripe (e.g., 4500)
    const unitAmountCents = Math.round(parseFloat(price) * 100);

    // 3. Create the Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: authenticatedUser.email, // Automatically use authenticated email

      // Pass custom identifiers to track and handle when processing webhooks
      metadata: {
        userId: authenticatedUser.id,
        userEmail: authenticatedUser.email,
        classId: classId,
        sessionId: sessionId || "",
      },

      // Construct a dynamic inline product line item instead of a hardcoded Price ID
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: className,
              description: `Session Booking ID: ${sessionId || "General Admission"}`,
            },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/classes/${classId}`,
    });

    // Return the URL JSON structure to let your client-side router navigate seamlessly
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe session creation error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
