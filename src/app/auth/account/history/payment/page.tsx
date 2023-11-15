import { HistoryPaymentNav } from "@/components/history/HistoryPaymentNav";
import { HistoryPaymentTable } from "@/components/history/HistoryPaymentTable";

export default function Page() {
    return (
        <main className="container flex max-w-[80%] flex-grow flex-col gap-4 px-6 pt-4">
            <HistoryPaymentNav></HistoryPaymentNav>

            <section>
                <HistoryPaymentTable></HistoryPaymentTable>
            </section>
            
        </main>
    );
}