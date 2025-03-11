"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import Link from "next/link";

import ReactMarkdown from "react-markdown";

export function PhoneFeatures({ text }: { text: string }) {
	const data = text
		.split(/\\r\\n/g)
		.map((i) => i.trim())
		.join("\n\n");

	return (
		<Card className="rounded">
			<CardHeader>
				<CardTitle className="text-center text-2xl">ĐẶC ĐIỂM NỔI BẬT</CardTitle>
			</CardHeader>

			<CardContent>
				<ReactMarkdown
					className="flex flex-col gap-2"
					components={{
						h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
						h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
						h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
						h4: ({ children }) => <h4 className="text-lg font-semibold">{children}</h4>,
						strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
						a: ({ children, href }) => (
							<Link href={href!} target="_blank" className="text-blue-500 underline">
								{children}
							</Link>
						),
						blockquote: ({ children }) => (
							<blockquote className="border-l border-white pl-4">{children}</blockquote>
						),
						img: ({ node: _node, alt, src }) => (
							<span className="flex flex-col gap-y-2">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={src} alt={alt} className="rounded" />
								<span className="text-gray-600 dark:text-gray-300 text-sm">{alt}</span>
							</span>
						),
					}}
				>
					{data}
				</ReactMarkdown>
			</CardContent>
		</Card>
	);
}
