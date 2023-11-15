import { HistoryPaymentDetails } from "@/components/history/paymentdetails/HistoryPaymentDetails";
import { HistoryPaymentDetailsNav } from "@/components/history/paymentdetails/HistoryPaymentDetailsNav";

export default function Page() {
    return (
        <main className="container flex max-w-[50%] flex-grow flex-col gap-4 px-6 pt-4">
            <HistoryPaymentDetailsNav></HistoryPaymentDetailsNav>

            <div>
                <HistoryPaymentDetails></HistoryPaymentDetails>
            </div>
        </main>
    );
}