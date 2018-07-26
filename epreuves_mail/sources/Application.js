import { JetApp, EmptyRouter, HashRouter } from "webix-jet";

export class Application extends JetApp
{
	constructor(config)
	{
		const defaults =
		{
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/mail",
			routes :
			{
				
			}
		};

		super({ ...defaults, ...config });
	}
}
