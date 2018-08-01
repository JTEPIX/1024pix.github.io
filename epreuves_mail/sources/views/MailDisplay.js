import {JetView} from "webix-jet";
import {MailView} from "views/MailView";

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
          localId : "messages",
          layout : "line",
          rows :
          [

          ]
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

    var messages = this.$$("messages");

    var messagesViews = messages.getChildViews();

    for (var i = messagesViews.length - 1; i >= 0; i --)
    {
      messages.removeView(messagesViews[i]);
    }

    var mail = new MailView (data);
    mail.app = this.app;

    messages.addView(mail);
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

  addMail (data)
  {
    var mail = new MailView ();
  }
}
