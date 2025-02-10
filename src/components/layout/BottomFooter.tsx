"use client";

import { Divider, Link, User } from "@nextui-org/react";

import { Github } from "lucide-react";

export function BottomFooter() {
	return (
		<footer className="container max-w-6xl flex-none py-4">
			<Divider orientation="horizontal" />

			<div className="grid grid-cols-[1fr_max-content_max-content_max-content_1fr] py-4">
				<div className="flex flex-col items-center justify-center">
					<h3 className="font-bold">CellPhoneX</h3>
					<span>Nơi Bán Điện Thoại 0 Ai Mua</span>
					<p>Thuộc Khoa Công nghệ phần mềm</p>
				</div>

				<Divider orientation="vertical" className="mx-4" />

				<div className="flex flex-col gap-2 text-center">
					<h3>Danh sách Devs</h3>
					<div className="grid grid-cols-[1fr,max-content,1fr] place-items-start gap-x-4 gap-y-2">
						<User
							name="Phùng Tấn Phát"
							description={
								<>
									<span>Main Dev - </span>
									<Link underline="hover" href="https://github.com/Noki-Asakuri" size="sm" isExternal>
										@Noki-Asakuri
									</Link>
								</>
							}
							avatarProps={{ src: "https://avatars.githubusercontent.com/u/41738319?s=400&v=4" }}
						/>

						<Divider orientation="vertical" />

						<User
							name="Trang Sĩ Bân"
							description={
								<>
									<span>Dev 2 - </span>
									<Link underline="hover" href="https://github.com/Trangsiban27" size="sm" isExternal>
										@Trangsiban27
									</Link>
								</>
							}
							avatarProps={{ src: "https://avatars.githubusercontent.com/u/96864485?v=4" }}
						/>
					</div>
				</div>

				<Divider orientation="vertical" className="mx-4" />

				<div className="flex flex-col gap-2 text-center">
					<h3>Link</h3>

					<div className="flex items-center justify-center gap-2">
						<Link
							underline="hover"
							href="https://github.com/CNPM-NC-Nhom-8/DeTaiCNPM_NC"
							size="sm"
							isExternal
						>
							<Github /> Github
						</Link>
					</div>
				</div>
			</div>

			<Divider orientation="horizontal" />

			<p className="w-full pt-4 text-center text-sm">
				Mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet. Chúng tôi không sở hữu hay chịu
				trách nhiệm bất kỳ thông tin nào trên web này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi được
				yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.{" "}
				<Link underline="hover" isExternal href="mailto:phungtanphat23@gmail.com" className="text-sm">
					Email
				</Link>
			</p>
		</footer>
	);
}
