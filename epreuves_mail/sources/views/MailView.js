import {JetView} from "webix-jet";

import {mailsData} from "models/mailsData";

export default class MailView extends JetView
{
  config ()
  {
    var header =
    {
      localId : "header",
			type:"header",
      template: "TEST"
		};

    var view =
    {
      layout : "wide",
      localId:"view",
      rows :
      [
        {
          localId : "text",
          template : "no message selected"
        }
      ]
    };

		var ui =
    {
      gravity : 10,
      layout : "wide",
      rows :
      [
        header,
        view
      ]
		};

		return ui;
  }
}
