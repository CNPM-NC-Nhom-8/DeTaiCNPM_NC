"use client";

import { Button as NextButton } from "@nextui-org/react";
import { ComponentProps, forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ComponentProps<typeof NextButton>>(function Button({ children, ...rest }, ref) {
	return (
		<NextButton {...rest} ref={ref}>
			{children}
		</NextButton>
	);
});
