import {JetView} from "webix-jet";

import {mailsData} from "models/mailsData";

export class MailView extends JetView
{
  constructor(data)
  {
    super();

    this.data = data;
  }

  config ()
  {
    var header =
    {
      rows :
      [
        {
          layout : "clean",
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
        },
        {
          localId : "receiverName",
          template : "testmail"
        }
      ]
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
      layout : "line",
      autoHeight : false,
      rows :
      [
        header,
        view
      ]
		};

		return ui;
  }

  ready (view)
  {
    console.log(this.data);

    var senderName = this.$$("senderName");

    senderName.define("template", this.data.name)
    senderName.refresh()

    var senderMail = this.$$("senderMail");

    senderMail.define("template","< " + this.data.email + " >")
    senderMail.refresh()

    var receiverName = this.$$("receiverName");

    receiverName.define("template", "receiverName");
    receiverName.refresh()

    var message = this.$$('text');

    message.define("template", this.data.message);
    message.refresh();
  }
}
