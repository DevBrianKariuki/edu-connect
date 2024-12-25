import emailjs from "@emailjs/browser";
import { User } from "@/types/auth";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendAdminVerificationEmail = async (
	userDetails: User,
	code: string
) => {
	try {
		// Validate environment variables
		if (
			!EMAILJS_SERVICE_ID ||
			!EMAILJS_TEMPLATE_ID ||
			!EMAILJS_PUBLIC_KEY
		) {
			throw new Error("EmailJS configuration is missing");
		}

		const templateParams = {
			to_email: "devbriankariuki@gmail.com",
			user_name: userDetails.name,
			user_email: userDetails.email,
			verification_code: code,
			expiry_time: "30 minutes",
		};

		console.log("Sending email with params:", {
			...templateParams,
			serviceId: EMAILJS_SERVICE_ID,
			templateId: EMAILJS_TEMPLATE_ID,
		});

		const response = await emailjs.send(
			EMAILJS_SERVICE_ID,
			EMAILJS_TEMPLATE_ID,
			templateParams,
			EMAILJS_PUBLIC_KEY
		);

		if (response.status !== 200) {
			throw new Error(
				`Failed to send verification email: ${response.text}`
			);
		}

		console.log("Email sent successfully:", response);
		return response;
	} catch (error: any) {
		console.error("Error sending email:", error);
		throw new Error(
			`Failed to send verification email: ${
				error.message || "Unknown error"
			}`
		);
	}
};
