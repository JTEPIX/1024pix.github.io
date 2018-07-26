import {JetView} from "webix-jet";

import {mailsData} from "models/mailsData";

export default class Mail extends JetView
{
  config ()
  {
    var placeholderMessage = "Proin id sapien quis tortor condimentum ornare nec ac ligula. " +
		"Vestibulum varius euismod lacus sit amet eleifend. " +
		"Quisque in faucibus nulla. Pellentesque a egestas ipsum. " +
		"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;" +
		" Quisque massa lectus, rutrum vitae risus sit amet, porttitor tempus libero."

    var header =
    {
			type:"header",
      template: "Messagerie"
		};

		var menu =
    {
			view:"tree",
			css: "rounded_top",
			select: true,
      height : 215,
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
          icon:"inbox" // besoin de png
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
          id: "reply",
          type: "iconButton",
          label:"Reply",
          icon:"reply",
          width: 95,
          hidden: true
        },
				{
          view:"button",
          type: "iconButton",
          label:"Create",
          icon:"envelope",
          width: 95
        },
				{},
				{
          view:"button",
          type: "iconButton",
          label:"Delete",
          icon:"times",
          width: 95
        }
			]
    }

    var mailList =
    {
      id : "mailList",
      view:"datatable",
      css: "rounded_top",
      scrollX:false,
      columns:
      [
				{
          id:"checked",
          header:{ content:"masterCheckbox" },
          template:"{common.checkbox()}",
          width: 40
        },
				{
          id:"name",
          width: 180,
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
          width: 150
        }
			],
      select:"row",
      data: mailsData,
      ready:function()
      {
				this.select(1);
			}
		};

    var mailPreviewHeader =
    {
			type:"header",
      template: "Preview"
		};

    var mailPreview =
    {
      id:"mailPreview",
      template:"No message selected"
    }

		var ui =
    {
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
                menu
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
            mailList,
            mailOptions
          ]
        },
        {
          type : "clean",
          gravity : 10,
          padding : 2,
          margin : 10,
          borderless:true,
          rows :
          [
            //mailPreviewHeader,
            mailPreview
          ]
        }
			 ]
		 };

     /* SELECTION IMPLEMENTER LA DEDANS, MAINTENANT IL FAUT CHERCHER */
     /*$$("$datatable1").bind(
       $$("$tree1"),
       function(obj,filter)
       {
			      return obj.folder == filter.id;
		   }
     );

		$$("$datatable1").attachEvent("onAfterSelect",function()
    {
			$$("reply").show();
			$$("details").define("template", placeholderMessage);
			$$("details").render();
		});
		$$("$tree1").select(1);*/

		return ui;
  }
}
