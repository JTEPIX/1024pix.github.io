import {JetView} from "webix-jet";

import {mailsData} from "models/mailsData";

export default class Mailbox extends JetView
{
  config ()
  {
    var header =
    {
			type:"header",
      template: "Messagerie",
      css : "mailAppHeader"
		};

		var menu =
    {
      localId : "mailtree",
			view:"tree",
			css: "mailOptionsList",
			select: true,
			type:
      {
				folder:function(obj)
        {
					return "<span class='webix_icon fa-" + obj.icon + "' style='position:relative'></span>";
				}
			},
			data:
      [
				{
          id:"1",
          value:"Inbox",
          icon:"inbox"
        },
				{
          id:"2",
          value:"Sent",
          icon:"paper-plane"
        },
				{
          id:"3",
          value:"Drafts",
          icon:"edit"
        },
				{
          id:"4",
          value:"Trash",
          icon:"trash"
        },
				{
          id:"5",
          value:"Contact Groups",
          open:true,
          icon:"folder",
          data:
          [
  					{
              id:"5-1",
              value:"Friends",
              icon:"users"
            },
  					{
              id:"5-2",
              value:"Blocked",
              icon:"ban"
            }
  				]
				}
			]
		};

    var mailHeader =
    {
			type:"header",
      template: "Mails"
		};

    var mailOptions =
    {
      height: 45,
      cols:
      [
        {
          view:"button",
          localId : "create",
          type: "iconButton",
          label:"Create",
          icon:"envelope",
          width: 95,
          click : function ()
          {
            console.log("create");
          }
        },
				{},
				{
          view:"button",
          localId : "delete",
          type: "iconButton",
          label:"Delete",
          icon:"times",
          width: 95,
          click : function ()
          {
            const CORBEILLE_FOLDER = 4;

            var maillist = this.$scope.$$("maillist");

            if (maillist.getSelectedId() != null)
            {
              var mailtree = this.$scope.$$("mailtree");
              var initalFolder = maillist.getSelectedItem(true)[0].folder;

              for (var selectedId of maillist.getSelectedId(true))
              {
                var item = maillist.getItem(selectedId);
                item.folder = CORBEILLE_FOLDER;

                maillist.updateItem(selectedId, item);
              }

              mailtree.select(CORBEILLE_FOLDER);

              mailtree.select(initalFolder);

              this.$scope.clearFocus();
            }
          }
        }
			]
    }

    var maillist =
    {
      localId : "maillist",
      view:"datatable",
      css: "mailList",
      scrollX:false,
      columns:
      [
				/*{
          id:"checked",
          header:{ content:"masterCheckbox" },
          template:"{common.checkbox()}",
          width: 40
        },*/
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
		};

		var ui =
    {
      id : "mail",
			type:"wide",
      cols:
			[
        {
          rows :
          [
            {
              type:"wide",
              width : 180,
    					padding:2,
              margin:10,
              rows:
              [
                header,
                menu,
              ]
            },
            {}
          ]
        },
				{
          type:"clean",
          gravity : 7,
					padding:2,
          margin:10,
          borderless:true,
          rows:
          [
            //mailHeader,
            maillist/*,
            mailOptions*/
          ]
        },
        {
           name : "mailPreview",
           $subview:"MailDisplay"
        }
      ]
		 };

		return ui;
  }

  ready (view)
  {
    const CORBEILLE_FOLDER = 4;
    const BASE_FOLDER = 1;

    var jetView = this;

    var maillist = jetView.$$("maillist");
    var mailtree = jetView.$$("mailtree");

    this.applyReadCss();

    maillist.bind(
      mailtree,
      function (obj, filter)
      {
        return obj.folder == filter.id;
      }
    );

    maillist.attachEvent("onAfterSelect",function()
    {
      var selectedMail = maillist.getSelectedItem();

      if (selectedMail.read == false)
      {
        selectedMail.read = true;

        maillist.updateItem(selectedMail.id, selectedMail);
      }

      jetView.applyReadCss();

      jetView.getSubView("mailPreview").showMail(selectedMail);
    });

    mailtree.attachEvent("onAfterSelect", function (id)
    {
      /*if (mailtree.getSelectedId() == CORBEILLE_FOLDER)
      {
        this.$scope.$$("delete").hide();
        this.$scope.$$("create").hide();
      }
      else
      {
        this.$scope.$$("delete").show();
        this.$scope.$$("create").show();
      }*/

      var mailPreview = jetView.getSubView("mailPreview");

      mailPreview.clear();
    });

    mailtree.select(BASE_FOLDER);
  }

  clearFocus ()
  {
    this.getSubView("mailPreview").clear();
  }

  applyReadCss ()
  {
    var maillist = this.$$("maillist");

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
