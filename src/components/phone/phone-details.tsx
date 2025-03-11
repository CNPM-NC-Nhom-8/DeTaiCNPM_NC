"use client";

import { ObjectTyped, ThongSoKeyVietnamese } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const PhoneDetailInfo = ({
	data,
}: {
	data: NonNullable<RouterOutputs["product"]["getSanPham"]["ThongSoKyThuat"]>;
}) => {
	return (
		<Card>
			<CardHeader className="p-3">
				<CardTitle className="text-xl">Thông tin kỹ thuật</CardTitle>
				<CardDescription className="text-sm">Thông số kỹ thuật của sản phẩm</CardDescription>
			</CardHeader>

			<CardContent className="border-t border-border p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tên</TableHead>
							<TableHead>Thông tin</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{ObjectTyped.entries(data).map(([row, info]) => {
							const key = ThongSoKeyVietnamese(row);

							return (
								<TableRow key={key}>
									<TableCell className="px-4 py-3 pr-0">
										<span className="block w-max break-words">{key}</span>
									</TableCell>

									<TableCell className="px-4 py-3">
										<div>
											{info.split(/\\n/g).map((text, i) => (
												<p key={`${key}-${i}-info`}>{text}</p>
											))}
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
