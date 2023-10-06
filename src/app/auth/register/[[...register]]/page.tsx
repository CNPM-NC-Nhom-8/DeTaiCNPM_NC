import { SignUp } from "@clerk/nextjs";

export default function signUpPage() {
	return (
		<div className="container mx-auto flex flex-1 items-center justify-center py-5">
			<SignUp />
		</div>
	);
}
