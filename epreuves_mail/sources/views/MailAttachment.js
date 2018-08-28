import {JetView} from "webix-jet";

import {mailsData} from "models/mailsData";

export class MailAttachment extends JetView
{
  constructor (attachmentData)
  {
    super();
    
    this.data = attachmentData;
  }

  ready (view)
  {
    this.changeIcon(this.data.icon);
  }

  changeIcon (iconName)
  {
    var icon = this.$$("icon");
    icon.template = "<span class='webix_icon fa-" + iconName + " info'></span>";
  }

  config ()
  {
    var footer =
    {
      template : "footer"
		};

		var ui =
    {
      layout : "line",
      padding : 10,
      margin : 10,
      rows :
      [
        {
          cols :
          [
            {},
            {
              localId : "icon",
              template : ""
            },
            {}
          ]
        },
        {
          footer
        }
      ]
		};

		return ui;
  }

  ready (view)
  {

  }
}
