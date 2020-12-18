import fs from "fs-extra";
import path from "path";
import { Box, Text, useApp } from "ink";
import TextInput from "ink-text-input";
import React, { useState } from "react";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import glob from "glob";
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

const pageTemplate = ({ subPath }: { subPath: string }) => {
	return `
	import Article, { meta } from "../../content/${subPath}";
	import Layout from "../../components/pages/layout";

	const Tutorial = () => {
		return (
		  <Layout meta={meta}>
			<Article />
		  </Layout>
		);
	  };
	  
	  export default Tutorial;
	`;
};

const getMDXFiles = (src: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		glob(src + "/**/*.mdx", (err, res) => {
			if (err) {
				reject();
				return;
			}

			resolve(res);
		});
	});
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

const getPathParam = (filePath: string, directory: string) => {
	const bits = filePath
		.replace(directory, "")
		.split("/")
		.filter(Boolean)
		.reverse();
	const [last, ...all] = bits ?? [];
	//@ts-ignore
	return [path.basename(last, path.extname(last)), ...all].reverse();
};

const App = () => {
	const { exit } = useApp();
	const [title, setTitle] = useState("");
	const [folder, setFolder] = useState("tutorials");
	const [selected, setSelected] = useState("");

	const createArticle = async () => {
		const route = slugify(title);
		const mdxPath = path.join(process.cwd(), `/${route}`);
		await fs.ensureDir(mdxPath);
		await fs.outputFile(`${mdxPath}/index.mdx`, mdxTemplate({ title }));
		exit();
	};
	const syncArticles = async () => {
		const dir = path.join(process.cwd(), `/${folder}`);
		const files = await getMDXFiles(dir);
		const paths = files.map((filePath) => {
			return getPathParam(filePath, dir);
		});

		paths.forEach((pathParams) => {
			const title = pathParams[0];
			const pagePath = path.join(
				path.resolve(process.cwd(), "../pages/tutorials"),
				`${title}.tsx`
			);

			if (!fs.existsSync(pagePath)) {
				const subPath = `${folder}/${pathParams.join("/")}.mdx`;
				const contents = pageTemplate({ subPath });
				fs.writeFileSync(pagePath, contents);
			}
		});
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
		{
			label: "Sync Tutorials",
			value: "sync",
		},
	];

	return (
		<Box>
			{!selected && <SelectInput items={items} onSelect={handleSelect} />}
			{selected === "sync" && (
				<Text color="green">
					<Spinner type="dots" />
				</Text>
			)}
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
			{selected === "sync" && (
				<TextInput
					value={folder}
					onChange={setFolder}
					onSubmit={syncArticles}
				/>
			)}
		</Box>
	);
};

module.exports = App;
export default App;
