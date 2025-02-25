
import emailjs from "@emailjs/browser";
import { User } from "@/types/auth";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_LOGIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_LOGIN_TEMPLATE_ID;
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

export const sendLoginNotificationEmail = async (userDetails: User) => {
    try {
        if (!EMAILJS_SERVICE_ID || !EMAILJS_LOGIN_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            throw new Error("EmailJS configuration is missing");
        }

        // Get device and browser information
        const browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
        };

        // Format login time
        const loginTime = new Date().toLocaleString();

        // Get approximate location (if available)
        let location = "Unknown";
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            location = `${data.city}, ${data.country_name}`;
        } catch (error) {
            console.error("Could not fetch location:", error);
        }

        const templateParams = {
            to_email: userDetails.email,
            user_name: userDetails.name,
            login_time: loginTime,
            device_info: `${browserInfo.platform} - ${browserInfo.userAgent.split(') ')[0]})`,
            location: location,
            browser_language: browserInfo.language,
        };

        console.log("Sending login notification email with params:", {
            ...templateParams,
            serviceId: EMAILJS_SERVICE_ID,
            templateId: EMAILJS_LOGIN_TEMPLATE_ID,
        });

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_LOGIN_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        if (response.status !== 200) {
            throw new Error(`Failed to send login notification: ${response.text}`);
        }

        console.log("Login notification email sent successfully:", response);
        return response;
    } catch (error: any) {
        console.error("Error sending login notification:", error);
        // We don't throw the error here as this is a non-critical feature
        // Instead, we log it and continue with the login process
    }
};
