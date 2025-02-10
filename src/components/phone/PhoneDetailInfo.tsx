"use client";

import { ThongSoKeyVietnamese } from "@/utils/common";
import { ObjectKeys } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export const PhoneDetailInfo = ({
	data,
}: {
	data: NonNullable<RouterOutputs["product"]["getSanPham"]["ThongSoKyThuat"]>;
}) => {
	return (
		<div>
			<Card className="flex max-h-max flex-grow flex-col gap-2 p-3">
				<h3 className="px-2 text-xl font-semibold">Thông tin kỹ thuật</h3>

				<Table isStriped>
					<TableHeader>
						<TableColumn key="Ten">Tên</TableColumn>
						<TableColumn key="ThongTin">Thông tin</TableColumn>
					</TableHeader>
					<TableBody>
						{ObjectKeys(data).map((row) => {
							const key = ThongSoKeyVietnamese(row);
							const info = data[row];

							return (
								<TableRow key={key}>
									<TableCell>
										<span className="block w-[10ch] break-words">{key}</span>
									</TableCell>
									<TableCell>
										<div>
											{info.split(/\\n/g).map((text, i) => {
												return <p key={`${key}-${i}-info`}>{text}</p>;
											})}
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};
