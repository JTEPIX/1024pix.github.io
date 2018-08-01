import {JetView} from "webix-jet";

import {mailsData} from "models/mailsData";

export default class MailDisplay extends JetView
{
  config ()
  {
    var header =
    {
      localId : "header",
			type : "header",
      template : "TEST"
		};

    var view =
    {
      layout : "wide",
      localId : "view",
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

  changeMail (data)
  {
    this.changeHeaderText(data.subject);
  }

  changeHeaderText (newText)
  {
    if (newText == null)
      return;

    var header = this.$$("header");

    header.define("template", newText);

    header.refresh();
  }

  clear ()
  {
    console.log("clear");
  }
}
