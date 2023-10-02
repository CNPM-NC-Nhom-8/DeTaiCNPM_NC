"use client";
import { FormEvent, useMemo, useState, useTransition } from "react";

import { useSignIn } from "@clerk/nextjs";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link } from "@nextui-org/react";

import toast from "react-hot-toast";

import NextLink from "next/link";
import { useRouter } from "next/navigation";

export default function Page({ searchParams: { redirect_url } }: { searchParams: { redirect_url?: string } }) {
	const { isLoaded, signIn, setActive } = useSignIn();
	const [isPending, startTransition] = useTransition();

	const [emailAddresses, setEmail] = useState("");
	const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

	const [password, setPassword] = useState("");
	const validatePassword = (value: string) => value.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,50}$/g);

	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isLoaded) return;
		try {
			const result = await signIn.create({ identifier: emailAddresses, password });

			if (result.status === "complete") {
				console.log(result);
				await setActive({ session: result.createdSessionId });
				router.push(redirect_url || "/");
			} else {
				/*Investigate why the login hasn't completed */
				console.log(result);
			}
		} catch (err: any) {
			toast.error("Error: " + err.errors[0].longMessage);
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

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-4 px-6 py-4">
			<form action="" className="flex flex-grow items-center justify-center" onSubmit={(e) => startTransition(() => handleSubmit(e))}>
				<Card className="p-4">
					<CardHeader className="flex-col items-start">
						<h3 className="text-xl font-bold">Đăng nhập</h3>
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
							errorMessage={isEmailInvalid && "Please enter a valid email"}
							onValueChange={setEmail}
							className="w-80"
						/>

						<Input
							value={password}
							type="password"
							label="Password"
							variant="bordered"
							isInvalid={isPasswordInvalid}
							color={isPasswordInvalid ? "danger" : "default"}
							errorMessage={isPasswordInvalid && "Please enter a valid password"}
							onValueChange={setPassword}
						/>

						<Button type="submit" color="primary" isLoading={isPending}>
							Đăng Nhập
						</Button>
					</CardBody>

					<CardFooter>
						<div className="flex gap-2">
							<span>Chưa có tài khoản?</span>
							<Link as={NextLink} href="/auth/register" underline="hover">
								Đăng Kí
							</Link>
						</div>
					</CardFooter>
				</Card>
			</form>
		</main>
	);
}
