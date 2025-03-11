"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function PhoneCardSkeleton() {
	return (
		<Card className="group flex h-[356px] flex-col rounded shadow-lg transition-colors hover:bg-card-foreground/5">
			<CardHeader className="p-3">
				<Skeleton className="aspect-square w-full rounded" />
			</CardHeader>

			<CardContent className="flex flex-1 flex-col gap-2 p-3 pt-0">
				<Skeleton className="h-4 rounded" />

				<Skeleton className="h-4 w-3/4 rounded" />

				<div className="flex flex-col gap-2">
					<Skeleton className="h-3 w-full rounded" />
					<Skeleton className="h-3 w-5/6 rounded" />
				</div>
			</CardContent>

			<CardFooter className="p-3 pt-0">
				<Skeleton className="h-9 w-full rounded" />
			</CardFooter>
		</Card>
	);
}
