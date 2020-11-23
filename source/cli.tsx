#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

const cli = meow(
	`
	Usage
	  $ mdxcli

	Options
		--title  Article title

	Examples
	  $ mdxcli --title=Jane
	  Hello, Jane
`,
	{
		flags: {
			title: {
				type: "string",
			},
		},
	}
);

render(<App title={cli.flags.title} />);
