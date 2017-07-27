if (!window.pixApps) {
  pixApps = {};
}

pixApps.load = function(types) {
  for (var i = 0; i<types.length; i++) {
    if (typeof pixApps[types[i]] === 'undefined' && pixApps["_create_"+types[i]]) {
      pixApps[types[i]] = pixApps["_create_"+types[i]].call(this);
    }
  }
}

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
      template:"<div class='pix-apps-col-users'><div class='pix-apps-line'><img src='images/user.png' width='58' height='58' class='pix-apps-icon-user' /><p class='pix-apps-name-user'>Olivier562 </p><p class='pix-apps-type-user'>Administrateur</p></div><div class='pix-apps-line'><img src='images/user.png' width='58' height='58' class='pix-apps-icon-user' /><p class='pix-apps-name-user'>Lauren Janet</p><p class='pix-apps-type-user'>Standard</p></div><div class='pix-apps-line'><img src='images/user.png' width='58' height='58' class='pix-apps-icon-user' /><p class='pix-apps-name-user'>Utilisateur 2</p><p class='pix-apps-type-user'>Accès limité</p></div></div><div class='pix-apps-desc-user'><div class='pix-apps-head-desc-user'><img src='images/avatar.png' class='pix-apps-avatar' /><p class='pix-apps-name-user'>Laurene Janet</p><p class='pix-apps-type-user'>Administrateur (mot de passe)</p></div><p><input type='checkbox' name='password' value='' id='pix-apps-box-on' checked><label for='pix-apps-box-on'>Afficher bouton Eteindre et Redémarrer</label></p><p><input type='checkbox' name='password' value='' id='pix-apps-box-permut'><label for='pix-apps-box-permut'>Afficher permutation rapide utilisateur</label></p><p><input type='checkbox' name='password' value='' id='pix-apps-box-pass' checked><label for='pix-apps-box-pass'>Afficher indice mot de passe</label></p></div>",
    }
  });
  return usersWindow;
}

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
}


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
      view:"pixTemplate",
      activeContent: {
        selectTime: {
          view:"select",
          value:1, 
          width:300,
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
				okButton:{
					view:"button",
					label:"Ok",
          width:100,
          align:"center",
          click: function() {
            $$("date_window").close();
          }      
				},
        calendar:{
          view:"calendar",
	        timepicker:"true",
        }
      },
  		template:"<div class='pix-apps-col-date'><div id='pix-app-picker-date'>{common.calendar()}</div></div><div class='pix-apps-col2'><p>Sélection du fuseau horaire :</p>{common.selectTime()}<hr><p><input type='checkbox' name='password' value='' id='pix-apps-box-synchro' checked><label for='pix-apps-box-synchro'>Synchroniser automatiquement l'heure avec le serveur internet</label></p><p><input type='checkbox' name='password' value='' id='pix-apps-box-synchro' checked><label for='pix-apps-box-synchro'>Synchroniser l'heure d'été</label></p></div><div style='clear:both'></div>{common.okButton()}",
    }
  });
  return dateWindow;
}

