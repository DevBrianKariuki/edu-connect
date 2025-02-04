```typescript
import React, {
	createContext,
	useContext,
	useReducer,
	useCallback,
	useEffect,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { signIn, signUp, logOut, mapFirebaseUser } from "@/lib/firebase/auth";
import { AuthState, LoginCredentials, User } from "@/types/auth";
import {
	doc,
	setDoc,
	getDoc,
	collection,
	writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { sendAdminVerificationEmail } from "@/lib/services/email";
import { Timestamp } from "firebase/firestore";

type AuthAction =
	| { type: "AUTH_STATE_CHANGED"; payload: User | null }
	| { type: "LOGIN_START" }
	| { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
	| { type: "LOGIN_FAILURE"; payload: string }
	| { type: "LOGOUT" }
	| { type: "ADMIN_VERIFIED" };

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
	isAdminVerified: false,
};

const AuthContext = createContext<{
	state: AuthState;
	login: (credentials: LoginCredentials) => Promise<void>;
	signup: (credentials: LoginCredentials & { name: string }) => Promise<void>;
	logout: () => Promise<void>;
	verifyAdminCode: (code: string) => Promise<void>;
	generateAdminVerificationCode: (user: User) => Promise<void>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case "AUTH_STATE_CHANGED":
			return {
				...state,
				user: action.payload,
				isAuthenticated: !!action.payload,
				isLoading: false,
			};
		case "LOGIN_START":
			return { ...state, isLoading: true, error: null };
		case "LOGIN_SUCCESS":
			return {
				...state,
				isLoading: false,
				isAuthenticated: true,
				user: action.payload.user,
				token: action.payload.token,
				error: null,
			};
		case "LOGIN_FAILURE":
			return {
				...state,
				isLoading: false,
				error: action.payload,
				isAuthenticated: false,
				user: null,
				token: null,
			};
		case "LOGOUT":
			return { ...initialState, isLoading: false };
		case "ADMIN_VERIFIED":
			return { ...state, isAdminVerified: true };
		default:
			return state;
	}
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const generateAdminVerificationCode = useCallback(async (user: User) => {
		try {
			// Generate a random 6-digit code
			const code = Math.floor(100000 + Math.random() * 900000).toString();

			// Calculate expiration time (30 minutes from now)
			const expiresAt = new Date();
			expiresAt.setMinutes(expiresAt.getMinutes() + 30);

			// Create initial user document
			await setDoc(
				doc(db, "users", user.id),
				{
					email: user.email,
					name: user.name,
					role: user.role,
					isActive: true,
					adminVerified: false,
					createdAt: Timestamp.now(),
				},
				{ merge: true }
			);

			// Save the verification code
			await setDoc(doc(db, "adminVerificationCodes", user.id), {
				code,
				userId: user.id,
				userEmail: user.email,
				userName: user.name,
				createdAt: Timestamp.now(),
				expiresAt: Timestamp.fromDate(expiresAt),
				used: false,
			});

			// Send email to admin
			await sendAdminVerificationEmail(user, code);
		} catch (error: any) {
			console.error("Error generating admin verification code:", error);
			throw new Error(
				"Failed to set up verification. Please try again later."
			);
		}
	}, []);

	const login = useCallback(async (credentials: LoginCredentials) => {
		try {
			dispatch({ type: "LOGIN_START" });
			const user = await signIn(credentials.email, credentials.password);
			const token = await auth.currentUser?.getIdToken();

			dispatch({
				type: "LOGIN_SUCCESS",
				payload: { user, token: token || "" },
			});
		} catch (error: any) {
			dispatch({
				type: "LOGIN_FAILURE",
				payload: error.message,
			});
			throw error;
		}
	}, []);

	const signup = useCallback(
		async (credentials: LoginCredentials & { name: string }) => {
			try {
				dispatch({ type: "LOGIN_START" });
				const user = await signUp(
					credentials.email,
					credentials.password,
					credentials.name
				);

				// Generate admin verification code
				await generateAdminVerificationCode(user);

				dispatch({
					type: "LOGIN_SUCCESS",
					payload: { user, token: "" },
				});
			} catch (error: any) {
				dispatch({
					type: "LOGIN_FAILURE",
					payload: error.message,
				});
				throw error;
			}
		},
		[generateAdminVerificationCode]
	);

	const logout = useCallback(async () => {
		try {
			await logOut();
			dispatch({ type: "LOGOUT" });
		} catch (error: any) {
			dispatch({
				type: "LOGIN_FAILURE",
				payload: error.message,
			});
			throw error;
		}
	}, []);

	const verifyAdminCode = useCallback(async (code: string) => {
		try {
			const user = auth.currentUser;
			if (!user) {
				throw new Error("No user found");
			}

			// Get the verification code document
			const verificationRef = doc(db, "adminVerificationCodes", user.uid);
			const verificationDoc = await getDoc(verificationRef);

			if (!verificationDoc.exists()) {
				throw new Error("No verification code found for this user");
			}

			const verificationData = verificationDoc.data();

			// Check if code is expired
			const expiresAt = verificationData.expiresAt.toDate();
			if (expiresAt < new Date()) {
				throw new Error(
					"Verification code has expired. Please request a new code."
				);
			}

			if (verificationData.code !== code) {
				throw new Error("Invalid verification code");
			}

			if (verificationData.used) {
				throw new Error("This code has already been used");
			}

			// Use a batch to update both documents atomically
			const batch = writeBatch(db);

			// Mark the code as used
			batch.update(verificationRef, { used: true });

			// Update user's admin verification status
			const userRef = doc(db, "users", user.uid);
			batch.update(userRef, {
				adminVerified: true,
				updatedAt: Timestamp.now(),
			});

			// Commit the batch
			await batch.commit();

			dispatch({ type: "ADMIN_VERIFIED" });
		} catch (error: any) {
			console.error("Error verifying admin code:", error);
			throw new Error(error.message || "Failed to verify code");
		}
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				const user = await mapFirebaseUser(firebaseUser);
				dispatch({ type: "AUTH_STATE_CHANGED", payload: user });
			} else {
				dispatch({ type: "AUTH_STATE_CHANGED", payload: null });
			}
		});

		return () => unsubscribe();
	}, []);

	const value = {
		state,
		login,
		signup,
		logout,
		verifyAdminCode,
		generateAdminVerificationCode,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
```
