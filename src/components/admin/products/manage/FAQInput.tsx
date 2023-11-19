"use client";

import { FAQ } from "@/components/phone/FAQ";

import { useProductData } from "./data";

import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";

import { useState } from "react";
import { useStore } from "zustand";

export const FAQInput = () => {
	const state = useStore(useProductData, (state) => state);

	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");

	return (
		<section className="flex flex-col gap-2">
			<Card>
				<CardBody className="gap-y-4">
					<Input
						label="Câu hỏi"
						labelPlacement="outside"
						placeholder="Nhập câu hỏi"
						value={question}
						onValueChange={setQuestion}
					/>

					<Textarea
						label="Trả lời"
						labelPlacement="outside"
						placeholder="Nhập trả lời"
						value={answer}
						onValueChange={setAnswer}
					/>

					<Button
						color="success"
						onPress={() => {
							state.setFAQ({ answer, question });
							setQuestion("");
							setAnswer("");
						}}
					>
						Thêm câu hỏi
					</Button>
				</CardBody>
			</Card>

			{state.faq.length > 0 && (
				<FAQ
					data={state.faq.map((faq, index) => ({
						CauHoi: faq.question,
						TraLoi: faq.answer,
						MaCauHoi: [index, faq.question].join("-"),
						MaSPM: "",
					}))}
				/>
			)}
		</section>
	);
};
