import { Button, Card, CardBody } from "@nextui-org/react"
import {Image} from "@nextui-org/react";
import Link from "next/link";

export const HistoryPaymentTable = () => {
    return (
        <Card>
            <CardBody className="max-h-screen px-[20px] scroll-smooth overflow-auto overscroll-y-contain">
                <section className="w-full py-4 border-solid border-b-2">
                    <div className="flex">
                        <Image
                            width={300}
                            alt="Hình ảnh sản phẩm"
                            src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                        ></Image>


                        <div className="w-full px-5">
                            <h2 className="mb-5 text-lg font-semibold">Tên sản phẩm</h2>
                            
                            <div className="flex justify-between">
                                <div>
                                    <span>x1</span>
                                </div>
                                <div>
                                    <span>100.000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="mb-5 flex justify-end items-end">
                            <p className="mr-2">Tổng số tiền:</p>
                            <p className="text-3xl">1.000.000đ</p>
                        </div>

                        <div className="flex justify-end">
                            <Button as={Link} href="/auth/account/history/paymentdetails" color="primary">Xem chi tiết</Button>
                        </div>
                    </div>
                </section>
            </CardBody>
        </Card>
    );
}