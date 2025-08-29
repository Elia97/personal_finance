import { Resend } from "resend";
import logger from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, text: string) {
  await resend.emails
    .send({
      from: "onboarding@resend.dev", // Configura un dominio verificato su Resend
      to,
      subject,
      text,
    })
    .catch((error: Error) => {
      logger.error(`Error sending email: ${error.message}`);
      throw new Error("Failed to send email");
    });
}
