"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ink_1 = require("ink");
const ink_text_input_1 = __importDefault(require("ink-text-input"));
const react_1 = __importStar(require("react"));
const ink_select_input_1 = __importDefault(require("ink-select-input"));
const ink_spinner_1 = __importDefault(require("ink-spinner"));
const glob_1 = __importDefault(require("glob"));
const mdxTemplate = ({ title }) => {
    return `
export const meta = {
	title: "${title}",
	description: "",
	createdAt: '${new Date().toISOString()}',
	tags: [],
	technology: ''
};
`.trimStart();
};
const pageTemplate = ({ subPath }) => {
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
const getMDXFiles = (src) => {
    return new Promise((resolve, reject) => {
        glob_1.default(src + "/**/*.mdx", (err, res) => {
            if (err) {
                reject();
                return;
            }
            resolve(res);
        });
    });
};
const slugify = (title = "") => {
    var _a, _b;
    const pieces = (_a = (title || "").match(/\S+\s*/g)) !== null && _a !== void 0 ? _a : [];
    return ((_b = pieces
        .map((p) => p.trim())
        .filter((p) => p !== "-")
        .join("-")
        .replace(/\,/g, "")
        .replace(/\./g, "")) !== null && _b !== void 0 ? _b : "");
};
const getPathParam = (filePath, directory) => {
    const bits = filePath
        .replace(directory, "")
        .split("/")
        .filter(Boolean)
        .reverse();
    const [last, ...all] = bits !== null && bits !== void 0 ? bits : [];
    //@ts-ignore
    return [path_1.default.basename(last, path_1.default.extname(last)), ...all].reverse();
};
const App = () => {
    const { exit } = ink_1.useApp();
    const [title, setTitle] = react_1.useState("");
    const [folder, setFolder] = react_1.useState("tutorials");
    const [selected, setSelected] = react_1.useState("");
    const createArticle = async () => {
        const route = slugify(title);
        const mdxPath = path_1.default.join(process.cwd(), `/${route}`);
        await fs_extra_1.default.ensureDir(mdxPath);
        await fs_extra_1.default.outputFile(`${mdxPath}/index.mdx`, mdxTemplate({ title }));
        exit();
    };
    const syncArticles = async () => {
        const dir = path_1.default.join(process.cwd(), `/${folder}`);
        const files = await getMDXFiles(dir);
        const paths = files.map((filePath) => {
            return getPathParam(filePath, dir);
        });
        paths.forEach((pathParams) => {
            const title = pathParams[0];
            const pagePath = path_1.default.join(path_1.default.resolve(process.cwd(), "../pages/tutorials"), `${title}.tsx`);
            if (!fs_extra_1.default.existsSync(pagePath)) {
                const subPath = `${folder}/${pathParams.join("/")}.mdx`;
                const contents = pageTemplate({ subPath });
                fs_extra_1.default.writeFileSync(pagePath, contents);
            }
        });
        exit();
    };
    const handleSelect = (item) => {
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
    return (react_1.default.createElement(ink_1.Box, null,
        !selected && react_1.default.createElement(ink_select_input_1.default, { items: items, onSelect: handleSelect }),
        selected === "sync" && (react_1.default.createElement(ink_1.Text, { color: "green" },
            react_1.default.createElement(ink_spinner_1.default, { type: "dots" }))),
        selected === "create_tutorial" && (react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Box, { marginRight: 1 },
                react_1.default.createElement(ink_1.Text, null, "Enter title of tutorial:")),
            react_1.default.createElement(ink_text_input_1.default, { value: title, onChange: setTitle, onSubmit: createArticle }))),
        selected === "sync" && (react_1.default.createElement(ink_text_input_1.default, { value: folder, onChange: setFolder, onSubmit: syncArticles }))));
};
module.exports = App;
exports.default = App;
