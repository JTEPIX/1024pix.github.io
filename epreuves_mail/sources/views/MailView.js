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

    var view =
    {
      layout : "wide",
      localId:"view",
      paddingY : 10,
      rows :
      [
        {
          localId : "text",
          template : "no message selected"
        },
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
