import React, { useEffect } from "react";
import { Text, useApp } from "ink";
import slugify from "slug";
import fs from "fs-extra";
import path from "path";

const App = ({ title }: { title?: string }) => {
	const { exit } = useApp();

	useEffect(() => {
		const run = async () => {
			if (title) {
				const route = slugify(title);
				const mdxPath = path.join(process.cwd(), `/${route}`);
				await fs.ensureDir(mdxPath);
				await fs.outputFile(`${mdxPath}/index.mdx`, mdxTemplate({ title }));
				exit();
			} else {
				exit();
			}
		};
		run();
	}, [title]);
	return <Text>Creating article {title}</Text>;
};

module.exports = App;
export default App;

const mdxTemplate = ({ title }: { title: string }) => {
	return `
export const meta = {
	title: "${title}",
	description: "",
	createdAt: '${new Date().toISOString()}',
	tags: [],
	technologies: []
};
`.trimStart();
};
