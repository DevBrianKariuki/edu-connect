
import React, { useState, useEffect } from "react";
import { getWeek, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const InfoStrip = () => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [quote, setQuote] = useState("Success is not final, failure is not fatal: it is the courage to continue that counts.");

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const getNairobiTime = () => {
		const nairobiTime = utcToZonedTime(currentTime, "Africa/Nairobi");
		return format(nairobiTime, "hh:mm:ss aa");
	};

	const getWeekOfYear = () => {
		return getWeek(currentTime);
	};

	const getCurrentTerm = () => {
		const month = currentTime.getMonth() + 1;
		if (month >= 1 && month <= 4) return "Term 1";
		if (month >= 5 && month <= 8) return "Term 2";
		return "Term 3";
	};

	return (
		<div className="bg-primary/5 py-2 px-4 flex items-center justify-between text-sm border-b">
			<div className="flex items-center space-x-8">
				<div className="flex items-center space-x-2">
					<span className="font-medium">Week:</span>
					<span>{getWeekOfYear()}</span>
				</div>
				<div className="flex items-center space-x-2">
					<span className="font-medium">Time:</span>
					<span>{getNairobiTime()}</span>
				</div>
				<div className="flex items-center space-x-2">
					<span className="font-medium">Term:</span>
					<span>{getCurrentTerm()}</span>
				</div>
			</div>
			<div className="flex items-center max-w-xl">
				<span className="font-medium mr-2">Theme:</span>
				<span className="italic">{quote}</span>
			</div>
		</div>
	);
};

export default InfoStrip;
