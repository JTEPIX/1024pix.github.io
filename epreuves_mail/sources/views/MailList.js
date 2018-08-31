import {JetView} from "webix-jet";

import {mailsData} from "models/mailsData";

export default class MailList extends JetView
{
  config ()
  {
    var maillist =
    {
      localId : "maillist",
      view:"datatable",
      css: "mailList",
      scrollX:false,
      columns:
      [
        {
          id:"new",
          width: 35,
          header : "",
          template : function (data)
          {
            return !data.read ? "<span class='webix_icon fa-certificate info'></span>" : "";
          }
        },
        {
          id:"name",
          width: 160,
          header:"De :"
        },
        {
          id:"subject",
          header:"Sujet",
          fillspace:true
        },
        {
          id:"date",
          header:"Date",
          width: 160
        },
        {
          id : "attachment",
          header : "",
          width : 30,
          template : function (data)
          {
            return data.attachment != null && data.attachment.length != 0 ? "<span class='webix_icon fa-paperclip info'></span>" : "";
          }
        }
      ],
      select:"row",
      data: mailsData
    }

		return maillist;
  }

  ready (view)
  {
    var app = this;

    app.applyReadCss();

    view.attachEvent("onAfterSelect",function()
    {
      var selectedMail = view.getSelectedItem();

      if (selectedMail.read == false)
      {
        selectedMail.read = true;

        view.updateItem(selectedMail.id, selectedMail);
      }

      app.applyReadCss();

      var mailDisplay = app.getParentView().getSubView("mailDisplay");

      mailDisplay.getRoot().show();
      mailDisplay.showMail(selectedMail);

      view.hide();
    });
  }

  applyReadCss ()
  {
    var maillist = this.getRoot();

    maillist.eachRow(function (row)
    {
      if (maillist.hasCss(row, "read"))
      {
        maillist.removeRowCss(row, "read");
      }
      else if (maillist.hasCss(row, "notRead"))
      {
        maillist.removeRowCss(row, "notRead");
      }

      var styleToApply = maillist.getItem(row).read ? "read" : "notRead";

      maillist.addRowCss(row, styleToApply);
    });
  }
}
