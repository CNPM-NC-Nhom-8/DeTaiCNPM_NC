"use client";

import type { RouterOutputs } from "@/utils/trpc/react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function FAQ({ data }: { data: RouterOutputs["product"]["getSanPham"]["FAQ"] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-center text-xl">Các câu hỏi thường gặp</CardTitle>
			</CardHeader>

			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					{data.map((item) => (
						<AccordionItem key={item.MaCauHoi} value={item.MaCauHoi}>
							<AccordionTrigger>{item.CauHoi}</AccordionTrigger>
							<AccordionContent>{item.TraLoi}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</CardContent>
		</Card>
	);
}
