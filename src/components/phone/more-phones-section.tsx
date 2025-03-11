import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/utils/trpc/server";

import { PhoneCard } from "../common/phone-card";
import { PhonesSectionSkeletons } from "../home/phone-sections";

import { Suspense } from "react";

type ParamsType = { maHSX: string; maSPM: string; isSignedIn: boolean };

export function MorePhonesSection({ maHSX, maSPM, isSignedIn }: ParamsType) {
	return (
		<section className="flex w-full flex-col">
			<Tabs defaultValue="relate-phones">
				<TabsList>
					<TabsTrigger value="relate-phones">Sản phẩm tương tự</TabsTrigger>
					<TabsTrigger value="second-hand-phones">Tham khảo hàng cũ</TabsTrigger>
				</TabsList>

				<TabsContent value="relate-phones" className="w-full">
					<section className="grid grid-cols-5 gap-4">
						<Suspense fallback={<PhonesSectionSkeletons id="relate-phones" length={5} />}>
							<SameFactoryPhones maHSX={maHSX} maSPM={maSPM} isSignedIn={isSignedIn} />
						</Suspense>
					</section>
				</TabsContent>

				<TabsContent value="second-hand-phones">
					<section className="grid grid-cols-5 gap-4">
						<Suspense fallback={<PhonesSectionSkeletons id="second-hand-phones" length={5} />}>
							<SecondHandPhones maHSX={maHSX} maSPM={maSPM} isSignedIn={isSignedIn} />
						</Suspense>
					</section>
				</TabsContent>
			</Tabs>
		</section>
	);
}

async function SameFactoryPhones({ maHSX, maSPM, isSignedIn }: ParamsType) {
	const data = await api.product.getSanPhamTuongTu({ maHSX, maSPM });

	return (
		<>
			{data?.SanPhamMau.map((sanPham) => (
				<PhoneCard key={sanPham.MaSPM} sanPhamMau={sanPham} isSignedIn={isSignedIn} />
			))}
		</>
	);
}

async function SecondHandPhones({ maSPM, isSignedIn }: ParamsType) {
	const data = await api.product.getSanPhamCu({ maSPM });

	return (
		<>
			{data.map((sanPham) => (
				<PhoneCard key={sanPham.MaSPM} sanPhamMau={sanPham} isSignedIn={isSignedIn} />
			))}
		</>
	);
}
