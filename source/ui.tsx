import fs from "fs-extra";
import path from "path";
import { Box, Text, useApp } from "ink";
import TextInput from "ink-text-input";
import React, { useState } from "react";
import SelectInput from "ink-select-input";

const mdxTemplate = ({ title }: { title: string }) => {
	return `
import { REACT } from "../../../technologies";

export const meta = {
	published: false,
	title: ${JSON.stringify(title)},
	description: "",
	type: "TUTORIAL",
	createdAt: ${JSON.stringify(new Date().toISOString())},
	technology: REACT,
	tags: [],
	images: []
};
`.trimStart();
};

const slugify = (title: string = "") => {
	const pieces = (title || "").match(/\S+\s*/g) ?? [];

	return (
		pieces
			.map((p) => p.trim())
			.filter((p) => p !== "-")
			.join("-")
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
