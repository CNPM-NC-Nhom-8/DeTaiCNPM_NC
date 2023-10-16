"use client";

import { trpc } from "@/utils/trpc/client";
import { Tab, Tabs } from "@nextui-org/react";

import { PhoneCard } from "../common/PhoneCard";
import { PhoneCardSkeleton } from "../common/PhoneCardSkeletons";

export const RelatePhone = ({ maHSX }: { maHSX: string }) => {
	const { data, isLoading } = trpc.sanPham.getSanPhamTuongTu.useQuery(
		{ maHSX },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	);

	return (
		<section className="flex w-full flex-col">
			<Tabs aria-label="Options">
				<Tab key="SimiarProduct" title="Sản phẩm tương tự">
					<section className="grid grid-cols-5 gap-4">
						{isLoading && (
							<>
								<PhoneCardSkeleton />
								<PhoneCardSkeleton />
								<PhoneCardSkeleton />
								<PhoneCardSkeleton />
								<PhoneCardSkeleton />
							</>
						)}

						{!isLoading && data?.SanPhamMau.map((sanPham) => <PhoneCard key={sanPham.MaSPM} sanPhamMau={sanPham} />)}
					</section>
				</Tab>

				{/* <Tab key="SecondHands" title="Tham khảo hàng cũ">
					<section className="grid grid-cols-5 gap-4">
						{Array(4)
							.fill(0)
							.map((_, index) => {
								return <PhoneCard key={index} />;
							})}
					</section>
				</Tab> */}
			</Tabs>
		</section>
	);
};
