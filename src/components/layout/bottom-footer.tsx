export function BottomFooter() {
	return (
		<footer className="container max-w-6xl flex-none pb-4">
			<div className="mb-4 w-full border-t-1 border-[#262626]" />

			<p className="text-center text-sm">
				Mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet. Chúng tôi không sở hữu hay chịu
				trách nhiệm bất kỳ thông tin nào trên web này.
				<br />
				Đây không phải trang web bán hàng, chúng tôi không bán hàng hay cung cấp dịch vụ gì. Nếu bạn là chủ sở
				hữu của một trong những hình ảnh hoặc thông tin này và muốn gỡ bỏ nó, vui lòng liên hệ với chúng tôi qua
				email:{" "}
				<a
					target="_blank"
					href="https://github.com/CNPM-NC-Nhom-8/DeTaiCNPM_NC/issues/new"
					className="underline"
				>
					Github Issue
				</a>
			</p>
		</footer>
	);
}
