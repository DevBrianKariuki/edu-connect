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
import { auth, db } from "./config";
import { User } from "@/types/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export async function signUp(
	email: string,
	password: string,
	name: string
): Promise<User> {
	try {
		const userCredential: UserCredential =
			await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		await updateProfile(user, { displayName: name });
		await sendEmailVerification(user);

		return {
			id: user.uid,
			email: user.email!,
			name: name,
			role: "student",
			isActive: true,
			lastLogin: new Date(),
			emailVerified: user.emailVerified,
			adminVerified: false,
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

		const userDoc = await getDoc(doc(db, "users", user.uid));
		const userData = userDoc.data();

		return {
			id: user.uid,
			email: user.email!,
			name: user.displayName || "User",
			role: userData?.role || "student",
			isActive: true,
			lastLogin: new Date(),
			emailVerified: user.emailVerified,
			adminVerified: userData?.adminVerified || false,
			admissionNumber: userData?.admissionNumber,
		};
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function parentSignIn(admissionNumber: string, password: string): Promise<User> {
	try {
		const studentsRef = collection(db, "students");
		const q = query(studentsRef, where("admissionNumber", "==", admissionNumber));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("Invalid admission number");
		}

		const studentData = querySnapshot.docs[0].data();
		const parentEmail = studentData.parentEmail;

		if (!parentEmail) {
			throw new Error("No parent email associated with this admission number");
		}

		const userCredential = await signInWithEmailAndPassword(
			auth,
			parentEmail,
			password
		);
		const user = userCredential.user;

		const userDoc = await getDoc(doc(db, "users", user.uid));
		const userData = userDoc.data();

		if (userData?.role !== "parent") {
			throw new Error("Invalid parent credentials");
		}

		return {
			id: user.uid,
			email: user.email!,
			name: user.displayName || studentData.parentName || "Parent",
			role: "parent",
			isActive: true,
			lastLogin: new Date(),
			emailVerified: true,
			adminVerified: true,
			admissionNumber: admissionNumber,
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

export async function mapFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
	const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
	const userData = userDoc.data();

	return {
		id: firebaseUser.uid,
		email: firebaseUser.email!,
		name: firebaseUser.displayName || "User",
		role: userData?.role || "student",
		isActive: true,
		lastLogin: new Date(),
		emailVerified: firebaseUser.emailVerified,
		adminVerified: userData?.adminVerified || false,
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
