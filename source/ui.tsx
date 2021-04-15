import fs from "fs-extra";
import path from "path";
import { Box, Text, useApp } from "ink";
import TextInput from "ink-text-input";
import React, { useState } from "react";
import SelectInput from "ink-select-input";

const mdxTemplate = ({ title }: { title: string }) => {
	return `
---
published: true
title: ${title}
description: >-
	This is a description
type: TUTORIAL
createdAt: ${JSON.stringify(new Date().toISOString())}
technology: REACT
tags:
	- react
images:
	- ./
code:
	- 'https://github.com/codedailyio/'
---
`.trim();
};

const slugify = (title: string = "") => {
	return (
		//@ts-ignore
		(title ?? "")
			//@ts-ignore
			.match(/\S+\s*/g)
			.map((p) => p.trim())
			.filter((p) => p !== "-")
			.join("-")
			.replace(/\//g, "-") // ehhh?
			.replace(/\,/g, "")
			.replace(/\./g, "") ?? ""
	);
};

const App = () => {
	const { exit } = useApp();
	const [title, setTitle] = useState("");
	const [selected, setSelected] = useState("");

	const createArticle = async () => {
		const route = slugify(title);
		const mdxPath = path.join(process.cwd(), `/${route}`);
		await fs.ensureDir(mdxPath);
		await fs.outputFile(`${mdxPath}/index.mdx`, mdxTemplate({ title }));
		exit();
	};

	const handleSelect = (item: { value: string }) => {
		setSelected(item.value);
	};

	const items = [
		{
			label: "Create Tutorial",
			value: "create_tutorial",
		},
	];

	return (
		<Box>
			{!selected && <SelectInput items={items} onSelect={handleSelect} />}
			{selected === "create_tutorial" && (
				<Box>
					<Box marginRight={1}>
						<Text>Enter title of tutorial:</Text>
					</Box>
					<TextInput
						value={title}
						onChange={setTitle}
						onSubmit={createArticle}
					/>
				</Box>
			)}
		</Box>
	);
};

module.exports = App;
export default App;
