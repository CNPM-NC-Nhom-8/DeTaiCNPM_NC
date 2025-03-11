import { SearchContent } from "@/components/search/search-contents";

import { HydrateClient, api } from "@/utils/trpc/server";

import { auth } from "@clerk/nextjs/server";

type SearchParams = { searchParams: Promise<{ query?: string; hangSX: string; pageSize: number; page: number }> };

export default async function SearchPage({ searchParams }: SearchParams) {
	const resolvedSearchParams = await searchParams;
	const user = await auth();

	const hangSXPromise = api.common.getHangSX();
	await api.product.searchProduct.prefetch({
		query: { hangSX: resolvedSearchParams.hangSX, value: resolvedSearchParams.query ?? "" },
		pageIndex: resolvedSearchParams.page ?? 1,
		pageSize: resolvedSearchParams.pageSize ?? 20,
	});

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 py-4">
			<HydrateClient>
				<SearchContent hangSXPromise={hangSXPromise} isSignedIn={user.userId !== null} />
			</HydrateClient>
		</main>
	);
}
