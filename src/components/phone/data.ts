import type { Insurance } from "@prisma/client";

export const InsuranceTypeOptions: { price: number; type: Insurance; description: string }[] = [
	{
		price: 1_100_000,
		type: "OneToOneVIP6Months",
		description: "1 đổi 1 VIP 6 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 6 tháng.",
	},
	{
		price: 1_600_000,
		type: "ReplacementOr12MonthsRepair",
		description:
			"S24 + 12 tháng: Đổi sản phẩm tương đương hoặc miễn phí chi phí sửa chữa nếu có lỗi của NSX khi hết hạn bảo hành trong 12 tháng.",
	},
	{
		price: 1_800_000,
		type: "OneToOneVIP12Months",
		description: "1 đổi 1 VIP 12 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 12 tháng.",
	},
	{
		price: 2_400_000,
		type: "DropOrWaterDamage",
		description:
			"Rơi vỡ - Rớt nước: Hỗ trợ 90% chi phí sửa chữa, đổi mới sản phẩm nếu hư hỏng nặng trong 12 tháng.",
	},
];
