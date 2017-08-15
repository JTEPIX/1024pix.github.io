if (!window.pixApps) {
  pixApps = {};
}

pixApps.load = function(types) {
  for (var i = 0; i<types.length; i++) {
    if (typeof pixApps[types[i]] === 'undefined' && pixApps["_create_"+types[i]]) {
      pixApps[types[i]] = pixApps["_create_"+types[i]].call(this);
    }
  }
};

pixApps._create_users = function() {
  var usersWindow = webix.ui({
    view:"pixWindow",
    label:"Comptes d'utilisateurs",
    icon:"cog",
    id:"users_window",
    height:500,
    width:700,
    css:"pix-apps-users",
    body: {
      type:"clean",
      padding:10,
      cols: [
        {
          view:"list",
          template:"<img src='images/user.png' width='58' height='58' class='pix-apps-icon-user'><div class='pix-apps-name-user'>#name#</div><div class='pix-apps-name-user'>#type#</div>",
          data:[
            {name:"Olivier562", type:"Administrateur", chkBoutons: 0, chkPermutation: 0, chkIndice: 0},
            {name:"Laurent Janet", type:"Standard", chkBoutons: 0, chkPermutation: 0, chkIndice: 0},
            {name:"Utilisateur 2", type:"Accès limité", chkBoutons: 0, chkPermutation: 0, chkIndice: 0}
          ],
          type:{
            height:"auto",
          },
          id:"users_list",
          select:true,
          padding:10,
          css:"pix-apps-users-list",
          ready: function() {
            this.select(this.getFirstId());
          }
        },
        {
          id:"user_form",
          view:"form",
          elements: [
            {
              type:"clean",
              cols: [
                {
                  template:"<img src='images/avatar.png' class='pix-apps-avatar'>",
                  borderless:true,
                  width:72
                },
                {
                  type:"clean",
                  rows:[
                    {view:"text", value:"a", name:"name", readonly:true, borderless:true, css:"pix-apps-users-text"},
                    {view:"text", value:"b", name:"type", readonly:true, borderless:true, css:"pix-apps-users-text"}
                  ]
                }
              ]
            },
            {
              view:"checkbox",
              labelRight:"Afficher bouton Eteindre et Redémarrer",
              labelWidth:0,
              name:"chkBoutons",
              on:{
                onItemClick:function() {
                  $$('user_form').save();
                }
              }
            },
            {
              view:"checkbox",
              labelRight:"Afficher permutation rapide utilisateur",
              labelWidth:0,
              name:"chkPermutation",
              on:{
                onItemClick:function() {
                  $$('user_form').save();
                }                
              }
            },
            {
              view:"checkbox",
              labelRight:"Afficher indice mot de passe",
              labelWidth:0,
              name:"chkIndice",
              on:{
                onItemClick:function() {
                  $$('user_form').save();
                }
              }
            }
          ]
        }
      ]
    }
  });
  $$('user_form').bind('users_list');
  return usersWindow;
};

pixApps._create_display = function() {
  var displayWindow = webix.ui({
    view:"pixWindow",
    label:"Affichage",
    icon:"cog",
    id:"display_window",
    height:500,
    width:700,
    css:"pix-apps-display",
    body: {
      type:"clean",
      padding:10,
      rows: [
        {
          cols:[
            {
              template:"<img src='images/screen.png' width='171' height='171' class='pix-apps-icon-left' />",
              width:200
            },
            {
              view:"form",
              elements:[
                {
                  view:"label",
                  label:"Ecran Plug and Play - 24 pouces"
                },
                {
                  view:"text",
                  readonly:true,
                  labelWidth:100,
                  label:"Orientation :",
                  value:"Paysage"
                },
                {
                  view:"text",
                  readonly:true,
                  labelWidth:100,
                  label:"Fréquence :",
                  value:"60 Hz"
                },
                {
                  view:"text",
                  readonly:true,
                  labelWidth:100,
                  label:"Luminosité :",
                  value:"Automatique"
                },
                {
                  view:"select",
                  value:1, 
                  width:300,
                  labelWidth:100,
                  label:"Résolution :",
                  options:[
                    { id:0, value:"1920 x 1200" },
                    { id:1, value:"1600 x 1200" },
                    { id:2, value:"1600 x 1080" },
                    { id:3, value:"1400 x 1050" },
                    { id:4, value:"1280 x 1024" },
                    { id:5, value:"1024 x 768" }
                  ]                          
                }
              ]
            }
          ]
        },
        {
          height:10
        },
        {
					view:"button",
					label:"Ok",
          width:100,
          align:"center",
          click: function() {
            $$("display_window").close();
          }      
        }
      ]
    }
  });

  return displayWindow;
};

pixApps._create_display_old = function() {
  var displayWindow = webix.ui({
    view:"pixWindow",
    label:"Affichage",
    icon:"cog",
    id:"display_window",
    height:500,
    width:700,
    css:"pix-apps-display",
    body: {
      view:"pixTemplate",
      activeContent: {
        selectResolution: {
          view:"select",
          value:1, 
          width:300,
          labelWidth:100,
          label:"Résolution :",
          options:[
            { id:0, value:"1920 x 1200" },
            { id:1, value:"1600 x 1200" },
            { id:2, value:"1600 x 1080" },
            { id:3, value:"1400 x 1050" },
            { id:4, value:"1280 x 1024" },
            { id:5, value:"1024 x 768" }
          ]
        },
				okButton:{
					view:"button",
					label:"Ok",
          width:100,
          align:"center",
          click: function() {
            $$("display_window").close();
          }      
				},
        
      },
      template:"<div class='pix-apps-screen-display'><img src='images/screen.png' width='171' height='171' class='pix-apps-icon-left' /><p><strong>Ecran Plug and Play - 24 pouces </strong></p><p><strong>Orientation :</strong> Paysage</p><p><strong>Fréquence rafraichissement :</strong> 60 Hz</p><p><strong>Luminosité :</strong> Automatique</p><div class='pix-apps-p-resolution'>{common.selectResolution()}</div></div>{common.okButton()}",
    }
  });

  return displayWindow;
};


pixApps._create_date = function() {
  var dateWindow = webix.ui({
    view:"pixWindow",
    label:"Date et Heure",
    icon:"cog",
    id:"date_window",
    height:500,
    width:700,
    css:"pix-apps-date",
    body: {
      type:"clean",
      padding:10,
      rows:[
        {
          cols:[
            {
              view:"calendar",
              timepicker:true
            },
            {
              view:"form",
              elements:[
                {
                  view:"select",
                  value:1, 
                  width:300,
                  label:"Sélection du fuseau horaire :",
                  labelPosition:"top",
                  options:[
                    { "id":0, "value":"(UTC +01:00) Bruxelle, Copenhague, Madrid, Paris" },
                    { "id":1, "value":"(UTC +01:00) Sarajevo, Skopje, Varsovie, Zagreb" },
                    { "id":2, "value":"(UTC +01:00) Windhoek" },
                    { "id":3, "value":"UTC +02:00) Europe de l'Est" },
                    { "id":4, "value":"UTC +02:00) Jérusalem" },
                    { "id":5, "value":"UTC +02:00) Téhéran" },
                    { "id":6, "value":"UTC +02:00) Le Caire" },
                    { "id":7, "value":"UTC +02:00) Erevan" },
                    { "id":8, "value":"UTC +09:00) PixCity" },
                    { "id":9, "value":"UTC +02:00) Le Caire" },
                    { "id":10, "value":"UTC +02:00) Erevan" },
                    { "id":11, "value":"UTC +09:00) PixCity" },
                    { "id":12, "value":"UTC +02:00) Tachkent" },
                    { "id":13, "value":"UTC +09:00) PixCity" },
                    { "id":14, "value":"UTC +02:00) Le Caire" },
                    { "id":15, "value":"UTC +02:00) Erevan" },
                    { "id":16, "value":"UTC +09:00) PixCity" },
                    { "id":17, "value":"UTC +02:00) Tachkent" }
                  ]
                },
                {
                  view:"checkbox",
                  labelRight:"Synchroniser automatiquement l'heure avec le serveur internet",
                  labelWidth:0,
                  height:50,
                  css:"pix-apps-date-sync"
                },
                {
                  view:"checkbox",
                  labelRight:"Synchroniser l'heure d'été",
                  labelWidth:0
                }
              ]
            }
          ]
        },
        {
          height:10
        },
        {
          view:"button",
          label:"Ok",
          width:100,
          align:"center",
          click: function() {
            $$("date_window").close();
          }
        }          
      ]
    }
  });
  return dateWindow;
};
  


