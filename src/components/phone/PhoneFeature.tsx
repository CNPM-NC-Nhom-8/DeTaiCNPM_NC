"use client";

import NextLink from "next/link";

import { Card, Image, Link } from "@nextui-org/react";

import ReactMarkdown from "react-markdown";

export const PhoneFeatures = ({ children }: { children: string }) => {
	const data = children
		.split(/\\r\\n/g)
		.map((i) => i.trim())
		.join("\n\n");

	return (
		<Card className="px-6 py-4">
			<h3 className="text-center text-2xl font-semibold">ĐẶC ĐIỂM NỔI BẬT</h3>

			<ReactMarkdown
				className="flex flex-col gap-2"
				components={{
					h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
					h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
					h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
					h4: ({ children }) => <h4 className="text-lg font-semibold">{children}</h4>,
					a: ({ children, href }) => (
						<Link as={NextLink} underline="hover" href={href} target={"_blank"}>
							{children}
						</Link>
					),
					blockquote: ({ children }) => (
						<blockquote className="border-l-2 border-white pl-4">{children}</blockquote>
					),
					img: ({ node: _node, alt, src, ..._prop }) => (
						<span className="flex flex-col gap-y-2">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<Image removeWrapper src={src} alt={alt} />
							<span className="text-sm text-gray-600 dark:text-gray-300">{alt}</span>
						</span>
					),
				}}
			>
				{data}
			</ReactMarkdown>
		</Card>
	);
};
