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
import { doc, getDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const DUMMY_PARENT_CREDENTIALS = {
    admissionNumber: "STD001",
    password: "parent123",
    parentName: "John Doe",
    parentEmail: "parent@example.com",
    studentName: "Jane Doe",
};

const DUMMY_TEACHER_CREDENTIALS = {
    staffId: "TCH001",
    password: "teacher123",
    teacherName: "John Smith",
    teacherEmail: "john.smith@school.com",
};

export async function signUp(
	email: string,
	password: string,
	name: string
): Promise<User> {
	try {
		const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		await updateProfile(user, { displayName: name });
		await sendEmailVerification(user);

		// Store user data in adminUsers collection
		await setDoc(doc(db, "adminUsers", user.uid), {
			id: user.uid,
			email: user.email,
			name: name,
			role: "admin",
			isActive: true,
			createdAt: Timestamp.now(),
			lastLogin: Timestamp.now(),
			emailVerified: false,
			adminVerified: false,
		});

		return {
			id: user.uid,
			email: user.email!,
			name: name,
			role: "admin",
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
    // This is a dummy authentication for development
    if (admissionNumber === DUMMY_PARENT_CREDENTIALS.admissionNumber && 
        password === DUMMY_PARENT_CREDENTIALS.password) {
        return {
            id: "dummy-parent-id",
            email: DUMMY_PARENT_CREDENTIALS.parentEmail,
            name: DUMMY_PARENT_CREDENTIALS.parentName,
            role: "parent",
            isActive: true,
            lastLogin: new Date(),
            emailVerified: true,
            adminVerified: true,
            admissionNumber: DUMMY_PARENT_CREDENTIALS.admissionNumber,
        };
    }
    
    throw new Error("Invalid admission number or password");
}

export async function teacherSignIn(staffId: string, password: string): Promise<User> {
    // This is a dummy authentication for development
    if (staffId === DUMMY_TEACHER_CREDENTIALS.staffId && 
        password === DUMMY_TEACHER_CREDENTIALS.password) {
        return {
            id: "dummy-teacher-id",
            email: DUMMY_TEACHER_CREDENTIALS.teacherEmail,
            name: DUMMY_TEACHER_CREDENTIALS.teacherName,
            role: "teacher",
            isActive: true,
            lastLogin: new Date(),
            emailVerified: true,
            adminVerified: true,
            staffId: DUMMY_TEACHER_CREDENTIALS.staffId,
        };
    }
    
    throw new Error("Invalid staff ID or password");
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
