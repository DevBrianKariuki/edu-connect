import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
	password: string;
}

export function PasswordStrengthIndicator({
	password,
}: PasswordStrengthIndicatorProps) {
	const calculateStrength = (password: string): number => {
		let strength = 0;

		// Length check
		if (password.length >= 8) strength += 20;

		// Contains number
		if (/\d/.test(password)) strength += 20;

		// Contains lowercase letter
		if (/[a-z]/.test(password)) strength += 20;

		// Contains uppercase letter
		if (/[A-Z]/.test(password)) strength += 20;

		// Contains special character
		if (/[^A-Za-z0-9]/.test(password)) strength += 20;

		return strength;
	};

	const getStrengthText = (strength: number): string => {
		if (strength === 0) return "Very Weak";
		if (strength <= 20) return "Weak";
		if (strength <= 40) return "Fair";
		if (strength <= 60) return "Good";
		if (strength <= 80) return "Strong";
		return "Very Strong";
	};

	const getStrengthColor = (strength: number): string => {
		if (strength === 0) return "bg-destructive";
		if (strength <= 20) return "bg-destructive";
		if (strength <= 40) return "bg-yellow-500";
		if (strength <= 60) return "bg-yellow-400";
		if (strength <= 80) return "bg-green-400";
		return "bg-green-500";
	};

	const strength = calculateStrength(password);

	// Only show the indicator if the password field has some input
	if (!password) return null;

	return (
		<div className="space-y-2">
			<Progress
				value={strength}
				className={`h-2 ${getStrengthColor(strength)}`}
			/>
			<p className="text-sm text-muted-foreground">
				Password Strength: {getStrengthText(strength)}
			</p>
		</div>
	);
}
