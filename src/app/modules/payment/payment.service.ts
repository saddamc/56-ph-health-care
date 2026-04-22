import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";


const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as any;

            const appointmentId = session.metadata?.appointmentId;
            // const paymentIntenId = session.payment_intent;
            // const email = session.customer_email;
            const paymentId = session.metadata?.paymentId;

            // console.log("✅ Payment successful!");
            // console.log("Appointment ID:", appointmentId);
            // console.log("Payment Intent:", paymentIntenId);
            // console.log("Customer Email:", email);

            await prisma.appointment.update({
                where: {
                    id: appointmentId
                },
                data: {
                    paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
                }
            })
            await prisma.payment.update({
                where: {
                    id: paymentId
                },
                data: {
                    status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
                }
            })

            // TODO: Update appointment record in your DB here
            // Example: 
            // await prisma.appointment.updata({
            //     where: { id: appointmentId },
            //     data: { paymentStatus: "paid" },
            // });

            break;
        }
            
        case "payment_intent.payment_failed": {
            const intent = event = event.data.object as any;
            console.log("❌ Payment failed", intent.id);
            // TODO: Update appointment as failed 
            break;
        }
            
        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
};

export const PaymentService = {
    handleStripeWebhookEvent
}