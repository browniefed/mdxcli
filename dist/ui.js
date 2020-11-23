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
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const slug_1 = __importDefault(require("slug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const App = ({ title }) => {
    const { exit } = ink_1.useApp();
    react_1.useEffect(() => {
        const run = async () => {
            if (title) {
                const route = slug_1.default(title);
                const mdxPath = path_1.default.join(process.cwd(), `/${route}`);
                await fs_extra_1.default.ensureDir(mdxPath);
                await fs_extra_1.default.outputFile(`${mdxPath}/index.mdx`, mdxTemplate({ title }));
                exit();
            }
            else {
                exit();
            }
        };
        run();
    }, [title]);
    return react_1.default.createElement(ink_1.Text, null,
        "Creating article ",
        title);
};
module.exports = App;
exports.default = App;
const mdxTemplate = ({ title }) => {
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
