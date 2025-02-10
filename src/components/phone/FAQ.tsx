"use client";

import type { RouterOutputs } from "@/utils/trpc/react";

import { Accordion, AccordionItem, Card, CardHeader } from "@nextui-org/react";

export const FAQ = ({ data }: { data: RouterOutputs["product"]["getSanPham"]["FAQ"] }) => {
	return (
		<Card className="px-2">
			<CardHeader className="items-center justify-center text-xl">Các câu hỏi thường gặp</CardHeader>

			<Accordion>
				{data.map((item) => (
					<AccordionItem key={item.MaCauHoi} title={item.CauHoi}>
						{item.TraLoi}
					</AccordionItem>
				))}
			</Accordion>
		</Card>
	);
};
