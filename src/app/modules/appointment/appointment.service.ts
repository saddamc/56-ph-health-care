import { stripe } from "../../helper/stripe";
import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";
import { v4 as uuidv4 } from "uuid";

// const createAppointment = async (user: IJWTPayload, payload: { doctorId: string, scheduleId: string }) => {
//     const patientData = await prisma.patient.findUniqueOrThrow({
//         where: {
//             email: user.email
//         }
//     });

//     const doctorData = await prisma.doctor.findUniqueOrThrow({
//         where: {
//             id: payload.doctorId,
//             isDeleted: false
//         }
//     });

//     const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
//         where: {
//             doctorId: payload.doctorId,
//             scheduleId: payload.scheduleId,
//             isBooked: false
//         }
//     })

//     const videoCallingId = uuidv4();

//     const result = await prisma.$transaction(async (tnx) => {
//         const appointmentData = await tnx.appointment.create({
//             data: {
//                 patientId: patientData.id,
//                 doctorId: doctorData.id,
//                 scheduleId: payload.scheduleId,
//                 videoCallingId
//             }
//         })

//         await tnx.doctorSchedules.update({
//             where: {
//                 doctorId_scheduleId: {
//                     doctorId: doctorData.id,
//                     scheduleId: payload.scheduleId
//                 }
//             },
//             data: {
//                 isBooked: true
//             }
//         })

//         const transactionId = uuidv4();

//         await tnx.payment.create({
//             data: {
//                 appointmentId: appointmentData.id,
//                 amount: doctorData.appointmentFee,
//                 transactionId
//             }
//         })

//         return appointmentData;
//     })

//     return result;
// };

const createAppointment = async (
  user: IJWTPayload,
  payload: { doctorId: string; scheduleId: string },
) => {
  // console.log({user, payload})
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const isBookedOrNot = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await prisma.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
    });

    
    await tnx.doctorSchedule.update({  
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
        },
        data: {
            isBooked: true
        }
    });
      
      const transactionId = uuidv4();

    // const paymentData = 62-04
      const paymentData = await tnx.payment.create({
          data: {
              appointmentId: appointmentData.id,
              amount: doctorData.appointmentFee,
              transactionId
          }
      })
    
    // 62-01
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'bdt',
            product_data: {
              name: `Appointment with ${doctorData.name}`
            },
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      // 62-04
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id
      },
      // success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `https://cabro.vercel.app/`,
      // cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
      cancel_url: `https://saddambd.vercel.app/`,
    })

    console.log(session)
      
      return appointmentData;
  });
    
    return result;

  // console.log({patientId: patientData.id, doctorId: doctorData.id, scheduleId: payload.scheduleId, videoCallingId})
};

export const AppointmentService = {
  createAppointment,
};
