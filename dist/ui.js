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
const mdxTemplate = ({ title }) => {
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
const App = () => {
    const { exit } = ink_1.useApp();
    const [title, setTitle] = react_1.useState("");
    const [selected, setSelected] = react_1.useState("");
    const createArticle = async () => {
        const route = slugify(title);
        const mdxPath = path_1.default.join(process.cwd(), `/${route}`);
        await fs_extra_1.default.ensureDir(mdxPath);
        await fs_extra_1.default.outputFile(`${mdxPath}/index.mdx`, mdxTemplate({ title }));
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
    ];
    return (react_1.default.createElement(ink_1.Box, null,
        !selected && react_1.default.createElement(ink_select_input_1.default, { items: items, onSelect: handleSelect }),
        selected === "create_tutorial" && (react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Box, { marginRight: 1 },
                react_1.default.createElement(ink_1.Text, null, "Enter title of tutorial:")),
            react_1.default.createElement(ink_text_input_1.default, { value: title, onChange: setTitle, onSubmit: createArticle })))));
};
module.exports = App;
exports.default = App;
