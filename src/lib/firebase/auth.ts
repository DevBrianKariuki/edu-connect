import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	updateProfile,
	sendEmailVerification,
	verifyPasswordResetCode as verifyResetCode,
	confirmPasswordReset as confirmReset,
	User as FirebaseUser,
	UserCredential,
} from "firebase/auth";
import { auth } from "./config";
import { User } from "@/types/auth";

export async function signUp(
	email: string,
	password: string,
	name: string
): Promise<User> {
	try {
		const userCredential: UserCredential =
			await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		// Update the user's profile with their name
		await updateProfile(user, { displayName: name });

		// Send email verification
		await sendEmailVerification(user);

		return {
			id: user.uid,
			email: user.email!,
			name: name,
			role: "student", // Default role, can be changed by admin
			isActive: true,
			lastLogin: new Date(),
			emailVerified: user.emailVerified,
		};
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function signIn(email: string, password: string): Promise<User> {
	try {
		const userCredential: UserCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		if (!user.emailVerified) {
			throw new Error("Please verify your email before signing in.");
		}

		return {
			id: user.uid,
			email: user.email!,
			name: user.displayName || "User",
			role: "student", // This should be fetched from Firestore in a real app
			isActive: true,
			lastLogin: new Date(),
			emailVerified: user.emailVerified,
		};
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function resendVerificationEmail(): Promise<void> {
	const user = auth.currentUser;
	if (user && !user.emailVerified) {
		try {
			await sendEmailVerification(user);
		} catch (error: any) {
			throw new Error(error.message);
		}
	} else {
		throw new Error("No user found or email already verified");
	}
}

export async function logOut(): Promise<void> {
	try {
		await signOut(auth);
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function resetPassword(email: string): Promise<void> {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export function getCurrentUser(): FirebaseUser | null {
	return auth.currentUser;
}

// Function to convert Firebase user to our User type
export function mapFirebaseUser(firebaseUser: FirebaseUser): User {
	return {
		id: firebaseUser.uid,
		email: firebaseUser.email!,
		name: firebaseUser.displayName || "User",
		role: "student", // This should be fetched from Firestore in a real app
		isActive: true,
		lastLogin: new Date(),
		emailVerified: firebaseUser.emailVerified,
	};
}

export async function verifyPasswordResetCode(code: string): Promise<string> {
	try {
		return await verifyResetCode(auth, code);
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function confirmPasswordReset(
	code: string,
	newPassword: string
): Promise<void> {
	try {
		await confirmReset(auth, code, newPassword);
	} catch (error: any) {
		throw new Error(error.message);
	}
}
