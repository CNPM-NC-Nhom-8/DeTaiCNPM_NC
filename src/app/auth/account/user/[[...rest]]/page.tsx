"use client";

import "@/styles/user-profile.css";

import { UserProfile } from "@clerk/nextjs";

import { CreditCardIcon } from "lucide-react";

export default function Page() {
	return (
		<main className="container flex max-w-6xl flex-grow px-6 py-4">
			<UserProfile path="/auth/account/user" routing="path">
				<UserProfile.Page label="Plans & Billings" labelIcon={<CreditCardIcon size="16" />} url="billings">
					<div>
						<h1>Custom Terms Page</h1>
						<p>This is the custom terms page</p>
					</div>
				</UserProfile.Page>
			</UserProfile>
		</main>
	);
}
