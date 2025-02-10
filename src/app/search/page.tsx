import { SearchContent } from "@/components/search/SearchContent";
import { api } from "@/utils/trpc/server";

type SearchParams = { searchParams: { query?: string; author?: string } };

export default async function SearchPage({ searchParams }: SearchParams) {
	const [product, hangSX] = await Promise.all([
		api.product.searchProduct({ pageNum: 1, perPage: 20, query: { value: searchParams.query } }),
		api.common.getHangSX(),
	]);

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 py-4">
			<SearchContent initialData={product} hangSX={hangSX} />
		</main>
	);
}
