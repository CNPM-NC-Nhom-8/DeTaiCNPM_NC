"use client";

import { useSignUp } from "@clerk/nextjs";
import { Card, CardHeader, CardBody, Input, Button, CardFooter, Link } from "@nextui-org/react";
import NextLink from "next/link";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function Page({ searchParams: { redirect_url } }: { searchParams: { redirect_url?: string } }) {
	const { isLoaded, signUp, setActive } = useSignUp();

	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState("");

	const [isPending, startTransition] = useTransition();

	const [emailAddresses, setEmail] = useState("");
	const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

	const [password, setPassword] = useState("");
	const validatePassword = (value: string) => value.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,50}$/g);

	const [confirmPassword, setConfirmPassword] = useState("");
	const validateConfirmPassword = (value: string) => value === password;

	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isLoaded) return;
		try {
			await signUp.create({
				emailAddress: emailAddresses,
				password,
			});

			// send the email.
			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

			// change the UI to our pending section.
			setPendingVerification(true);
		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2));
			toast.error("Error: " + err.errors[0].longMessage);
		}
	};

	const onPressVerify = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isLoaded) {
			return;
		}

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			});
			if (completeSignUp.status !== "complete") {
				/*  investigate the response, to see if there was an error
			 or if the user needs to complete more steps.*/
				console.log(JSON.stringify(completeSignUp, null, 2));
			}
			if (completeSignUp.status === "complete") {
				await setActive({ session: completeSignUp.createdSessionId });
				router.push("/");
			}
		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2));
		}
	};

	const isEmailInvalid = useMemo(() => {
		if (emailAddresses === "") return false;
		return validateEmail(emailAddresses) ? false : true;
	}, [emailAddresses]);

	const isPasswordInvalid = useMemo(() => {
		if (password === "") return false;
		return validatePassword(password) ? false : true;
	}, [password]);

	const isConfirmInvalid = useMemo(() => {
		if (confirmPassword === "") return false;
		return validateConfirmPassword(confirmPassword) ? false : true;
	}, [confirmPassword]);

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-4 px-6 py-4">
			{!pendingVerification && (
				<form className="flex flex-grow items-center justify-center" onSubmit={(e) => startTransition(() => handleSubmit(e))}>
					<Card className="p-4">
						<CardHeader className="flex-col items-start">
							<h3 className="text-xl font-bold">Đăng kí</h3>
							<span>để tiếp tục ở CellPhoneX</span>
						</CardHeader>

						<CardBody className="gap-2">
							<Input
								value={emailAddresses}
								type="email"
								label="Email"
								variant="bordered"
								isInvalid={isEmailInvalid}
								color={isEmailInvalid ? "danger" : "default"}
								errorMessage={isEmailInvalid && "Vui lòng nhập 1 email."}
								onValueChange={setEmail}
								className="w-80"
							/>

							<Input
								value={password}
								type="password"
								label="Mật khẩu"
								variant="bordered"
								isInvalid={isPasswordInvalid}
								color={isPasswordInvalid ? "danger" : "default"}
								errorMessage={isPasswordInvalid && "Vui lòng nhập mật khẩu dài hơn 8 kí tự."}
								onValueChange={setPassword}
							/>

							<Input
								value={confirmPassword}
								type="password"
								label="Nhập lại mật khẩu"
								variant="bordered"
								isInvalid={isConfirmInvalid}
								color={isConfirmInvalid ? "danger" : "default"}
								errorMessage={isConfirmInvalid && "Mật khẩu không đồng nhất"}
								onValueChange={setConfirmPassword}
							/>

							<Button type="submit" color="primary" isLoading={isPending}>
								Đăng Kí
							</Button>
						</CardBody>

						<CardFooter>
							<div className="flex gap-2">
								<span>Đã tài khoản?</span>
								<Link as={NextLink} href="/auth/login" underline="hover">
									Đăng Nhập
								</Link>
							</div>
						</CardFooter>
					</Card>
				</form>
			)}

			{pendingVerification && (
				<form className="flex flex-grow items-center justify-center" onSubmit={(e) => startTransition(() => handleSubmit(e))}>
					<Card className="p-4">
						<CardHeader className="flex-col items-start">
							<h3 className="text-xl font-bold">Đăng kí</h3>
							<span>để tiếp tục ở CellPhoneX</span>
						</CardHeader>

						<CardBody className="gap-2">
							<Input value={code} type="text" label="Mã xác nhận" variant="bordered" onValueChange={setCode} />

							<Button type="submit" color="primary" isLoading={isPending}>
								Verify Email
							</Button>
						</CardBody>
					</Card>
				</form>
			)}
		</main>
	);
}
