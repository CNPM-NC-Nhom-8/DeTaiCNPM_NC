"use client";

import { Card, CardBody, CardFooter, CardHeader, Skeleton } from "@nextui-org/react";

export const PhoneCardSkeleton = () => {
	return (
		<Card shadow="lg" className="relative px-2 py-4">
			<CardHeader className="aspect-square overflow-visible p-0">
				<Skeleton className="aspect-square w-full rounded-large" />
			</CardHeader>

			<CardBody className="px-2 pb-0 pt-2">
				<Skeleton className="h-4 rounded-lg" />
			</CardBody>

			<CardFooter className="flex-col items-start gap-2 px-2 pt-1">
				<Skeleton />
				<Skeleton className="h-3 w-full rounded-lg" />
				<Skeleton className="h-3 w-3/4 rounded-lg" />
			</CardFooter>

			<Skeleton className="h-8 w-full rounded-large" />
		</Card>
	);
};
