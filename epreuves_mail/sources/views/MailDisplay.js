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

  init ()
  {
    this.mails = [];
  }

  showMail (data)
  {
    this.$$("header").show();
    this.changeHeaderText(data.subject);

    this.showMailView(data);
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
    this.clearMails();

    this.$$("header").hide();
  }

  clearMails ()
  {
    var messages = this.$$("messages");

    var messagesViews = messages.getChildViews();

    for (var i = messagesViews.length - 1; i >= 0; i --)
    {
      messages.removeView(messagesViews[i]);
    }
  }

  showMailView (data)
  {
    var messages = this.$$("messages");

    this.clearMails();

    var mail = new MailView (data);
    mail.app = this.app;
    mail.name = "mailView";

    messages.addView(mail);
  }
}
