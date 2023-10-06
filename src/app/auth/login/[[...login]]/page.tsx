import { SignIn } from "@clerk/nextjs";

export default function signInPage() {
	return (
		<div className="container mx-auto flex flex-1 items-center justify-center py-5">
			<SignIn />
		</div>
	);
}
