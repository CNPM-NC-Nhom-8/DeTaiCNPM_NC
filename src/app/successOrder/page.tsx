import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { LucideBadgeCheck } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <main  className="container flex max-w-2xl flex-grow flex-col gap-4 px-6 pt-4">
            <Card>
                <CardBody className="py-20">
                    <div className="flex flex-col gap-4 items-center justify-center text-lime-400 text-lg font-semibold">
                        <LucideBadgeCheck size={100}></LucideBadgeCheck>
                        <p>Thanh toán thành công!</p>
                    </div>
                </CardBody>

                <CardFooter className="flex flex-wrap gap-4 items-center justify-center pb-10">
                    <Button as={Link} href="/" color="primary" variant="shadow">Mua tiếp</Button>
                </CardFooter>
            </Card>
        </main>
    );
}