import {JetView} from "webix-jet";
import {MailAttachment} from "views/MailAttachment";

import {mailsData} from "models/mailsData";

export class MailView extends JetView
{
  constructor(data)
  {
    super();

    this.data = data;
  }

  initAttachment (data)
  {
    var attachment = this.$$("attachment");

    if (data == null || data.length == 0)
    {
      attachment.hide();
      return;
    }

    attachment.show();

    console.log(data);

    var mailAttachment = new MailAttachment (data);
    mailAttachment.app = this.app;
    mailAttachment.name = "mailAttachment";

    attachment.addView(mailAttachment, 0);

    console.log(attachment);

    attachment.reconstruct();
  }

  config ()
  {
    var header =
    {
      type : "form",
      rows :
      [
        {
          height : 30,
          cols :
          [
            {
              localId : "senderName",
              template: "TEST"
            },
            {
              localId : "senderMail",
              template : "testsenderMail"
            },
            {}
          ]
        },
        {
          cols :
          [
            {
              height : 30,
              width : 150,
              localId : "receiverName",
              template : "testmail"
            },
            {

            }
          ]
        }
      ]
		};

    var text =
    {
      localId : "text",
      gravity : 5,
      template : "no message selected"
    }

    var attachments =
    {
      localId : "attachment",
      gravity : 1,
      cols :
      [
        {}
      ]
		};

    var reply =
    {
      layout : "wide",
      localId : "view",
      paddingY : 10,
      rows :
      [
        {
          cols :
          [
            {},
            {
              view:"button",
              type: "iconButton",
              label:"Reply",
              icon:"reply",
              width: 95,
              click : function ()
              {
                console.log("reply");
              }
            }
          ]
        }
      ]
    };

		var ui =
    {
      layout : "line",
      padding : 10,
      margin : 10,
      rows :
      [
        header,
        text,
        attachments/*,
        reply*/
      ]
		};

		return ui;
  }

  ready (view)
  {
    var senderName = this.$$("senderName");

    senderName.define("template", this.data.name);
    senderName.refresh();

    var senderMail = this.$$("senderMail");

    senderMail.define("template","< " + this.data.email + " >");
    senderMail.refresh();

    var receiverName = this.$$("receiverName");

    receiverName.define("template", "receiverName");
    receiverName.refresh();

    var message = this.$$('text');

    message.define("template", this.data.message);
    message.refresh();

    this.initAttachment(this.data.attachment);
  }
}
