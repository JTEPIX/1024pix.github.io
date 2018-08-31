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
          value:"Mails",
          icon:"inbox"
        },
				{
          id:"2",
          value:"Envoyés",
          icon:"paper-plane"
        },
				{
          id:"3",
          value:"Brouillons",
          icon:"edit"
        },
				{
          id:"4",
          value:"Corbeille",
          icon:"trash"
        },
				{
          id:"5",
          value:"Contacts",
          open:true,
          icon:"folder",
          data:
          [
  					{
              id:"5-1",
              value:"Amis",
              icon:"users"
            },
  					{
              id:"5-2",
              value:"Blockés",
              icon:"ban"
            }
  				]
				}
			]
		};

    var mailToolBar =
    {
      view : "toolbar",
      id : "mailToolbar",
      css : "mailToolbar",
      cols :
      [
        {
          view : "button",
          id : "returnButton",
          type : "icon",
          icon : "arrow-left",
          align : "center",
          css : "mailToolbarButton",
          width : 30,
          click : function ()
          {
            var maillist = this.$scope.getSubView("mailList");
            var mailDisplay = this.$scope.getSubView("mailDisplay");

            maillist.getRoot().show();
            mailDisplay.getRoot().hide();
          }
        }
      ]
    }

    var mailOptions =
    {
      height : 45,
      cols :
      [
        {
          view : "button",
          localId : "create",
          type : "iconButton",
          label :"Create",
          icon :"envelope",
          width : 95,
          click : function ()
          {
            console.log("create");
          }
        },
				{},
				{
          view : "button",
          localId : "delete",
          type : "iconButton",
          label : "Delete",
          icon : "times",
          width : 95,
          click : function ()
          {
            const CORBEILLE_FOLDER = 4;

            var maillist = this.getSubView("mailList");

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
            }
          }
        }
			]
    }

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
            }
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
            mailToolBar,
            {
              name : "mailList",
              $subview : "MailList"
            },
            {
              name : "mailDisplay",
              $subview : "MailDisplay"
            }
          ]
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

    var mailDisplay = this.getSubView("mailDisplay").getRoot();
    mailDisplay.hide();

    var maillist = this.getSubView("mailList").getRoot();

    var mailtree = jetView.$$("mailtree");

    maillist.bind(
      mailtree,
      function (obj, filter)
      {
        return obj.folder == filter.id;
      }
    );

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
    });

    mailtree.select(BASE_FOLDER);
  }
}
