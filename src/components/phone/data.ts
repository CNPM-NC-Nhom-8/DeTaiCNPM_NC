import type { Insurance } from "@prisma/client";

export const InsuranceTypeOptions: { price: number; type: Insurance; title: string; description: string }[] = [
	{
		price: 0,
		type: "None",
		title: "Không có",
		description: "Sản phảm không có bảo hành",
	},
	// {
	// 	price: 200_000,
	// 	type: "ReplacementOr3MonthsRepair",
	// 	description:
	// 		"S24 + 3 tháng: Đổi sản phẩm tương đương hoặc miễn phí chi phí sửa chữa nếu có lỗi của NSX khi hết hạn bảo hành trong 3 tháng.",
	// },
	// {
	// 	price: 300_000,
	// 	type: "OneToOneVIP3Months",
	// 	description: "1 đổi 1 VIP 3 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 3 tháng.",
	// },
	// {
	// 	price: 500_000,
	// 	type: "ReplacementOr6MonthsRepair",
	// 	description:
	// 		"S24 + 6 tháng: Đổi sản phẩm tương đương hoặc miễn phí chi phí sửa chữa nếu có lỗi của NSX khi hết hạn bảo hành trong 6 tháng.",
	// },
	{
		price: 1_100_000,
		type: "OneToOneVIP6Months",
		title: "1 đổi 1 VIP 6 tháng",
		description: "Đổi máy mới tương đương khi có lỗi từ NSX trong 6 tháng.",
	},
	{
		price: 1_600_000,
		type: "ReplacementOr12MonthsRepair",
		title: "S24 + 12 tháng",
		description:
			"Đổi sản phẩm tương đương hoặc miễn phí chi phí sửa chữa nếu có lỗi của NSX khi hết hạn bảo hành trong 12 tháng.",
	},
	{
		price: 1_800_000,
		type: "OneToOneVIP12Months",
		title: "1 đổi 1 VIP 12 tháng",
		description: "Đổi máy mới tương đương khi có lỗi từ NSX trong 12 tháng.",
	},
	{
		price: 2_400_000,
		type: "DropOrWaterDamage",
		title: "Rơi vỡ - Rớt nước",
		description: "Hỗ trợ 90% chi phí sửa chữa, đổi mới sản phẩm nếu hư hỏng nặng trong 12 tháng.",
	},
];
