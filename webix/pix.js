var pixItemSelected = false;

/**
 * pixWindow
 */

webix.protoUI({
  name:"pixWindow",
  $init:function(config) {
    var view = this;
    webix.extend(config,this.getUI());
    if (config.label||this.defaults.label) {
      this.$ready.push(function() {
        var head = view.getChildViews()[0];
        var label = head.getChildViews()[0];
        label.define("label", view.config.label);
      });
    }
    this.$ready.push(function() {
      if ($$("pixTaskbar")) {
        // there is a taskbar: show minimize icon
        view.getChildViews()[0].getChildViews()[1].show();
      }
    });
  },
  defaults: {
    move:true,
    resize:true,
    hidden:true,
    height:400,
    width:400,
    position:"center",
    css:'pix-window',
    toFront:true
  },
  getUI: function() {
    return {
      head:{
        view:"toolbar",
        cols:[{
            view: "label",
            label: ""
          },
          {
            view:"icon",
            icon:"window-minimize",
            on: {
              onItemClick: function(e) {
                $$("pixTaskbar").minimizeTask(this.getTopParentView().config.id);
              }              
            },
            hidden:true
          },
          {
            view:"icon",
            icon:"window-maximize",
            on: {
              onItemClick: function(e) {
                var element = this.getTopParentView();
                element.define({
                  fullscreen:true,
                  move:false
                });
                var location = webix.html.offset(element.getNode());
                element.lastX = location.x;
                element.lastY = location.y;
                element.setPosition(0,0);
                element.resize();
                this.hide();
                var items = this.getParentView().getChildViews();
                items[1].blur();
                for (var i=1; i<items.length; i++) {
                  var icon = items[i];
                  if (icon.config.icon === "window-restore") {
                    icon.show();
                    break;
                  }
                }
              }
            }
          },
          {
            view:"icon",
            icon:"window-restore",
            on: {
              onItemClick: function(e) {
                var element = this.getTopParentView();
                element.define({
                  fullscreen:false,
                  move:true
                });
                if (typeof element.lastX !== 'undefined') {
                  element.setPosition(element.lastX, element.lastY);
                }
                element.resize();
                this.hide();
                var items = this.getParentView().getChildViews();
                items[1].blur();
                for (var i=1; i<items.length; i++) {
                  var icon = items[i];
                  if (icon.config.icon === "window-maximize") {
                    icon.show();
                    break;
                  }
                }
              }
            },
            hidden: true
          },
          {
            view:"icon",
            icon:"times-circle",
            on: {
              onItemClick: function(e) {
                this.getTopParentView().close();
              }
            }
          }
        ]
      }
    };
  },
  open: function() {
    this.show();
    var taskbar = $$("pixTaskbar");
    if (taskbar) {
      taskbar.addTask(this);
    }
  },
  close: function() {
    this.hide();
    var taskbar = $$("pixTaskbar");
    if (taskbar) {
      taskbar.removeTask(this);
    }
  },
  getBody: function() {
    return this.getChildViews()[1];
  }
}, webix.ui.window);

/**
 * pixTaskBar
 */

webix.protoUI({
  name: "pixTaskbar",
  defaults: {
    cols:[{},{view:"template", width:80, id: "pixTaskbarTime", css:"pix-taskbar-time", borderless:true}],
    height:40,
    paddingY:0,
    css:"pix_taskbar"
  },
  tasks: [],
  addTask: function(view) {
    var id = view.config.id;
    var label = view.config.label;
    // check that task is not already in tasks
    if (this.findTask(id)) {
      return;
    }
    this.tasks.push({id: id, label: label, minimized:false});
    var buttonConfig = {
      view:"button", 
      id:"pix_task_"+id, 
      autowidth:true,
      align:"left",
      height:40,
      click: function() {
        var view = this.getParentView();
        view.selectTask(id);
        var task = view.findTask(id);
        task.minimized = false;
        // put window to front and give focus to it
        $$(id).show();
      }
    }
    if (view.config.icon) {
      buttonConfig.type = "icon";
      buttonConfig.icon = view.config.icon;
      buttonConfig.label = label;
    } else {
      buttonConfig.value = label;
    }
    this.addView(buttonConfig, this.tasks.length-1);
    // set pixTask propertie for focus management
    view.pixTask = true;
    this.selectTask(id);
    // otherwise, desktop gets a strange size..
    this.getTopParentView().adjust();
  },
  selectTask:function(id) {
    this.unselectTasks();
    webix.html.addCss($$("pix_task_"+id).getNode(), "active");
  },
  removeTask: function(view) {
    var id = view.config.id;
    for (var i = 0; i< this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        this.tasks.splice(i,1);
        this.removeView("pix_task_"+id);
        view.pixTask = true;
        // otherwise, desktop gets a strange size..
        this.getTopParentView().adjust();
        this.selectLastTask();
        return;
      }
    }
  },
  minimizeTask: function(id) {
    var task = this.findTask(id);
    task.minimized = true;
    $$(id).hide();
    this.selectLastTask();
  },
  selectLastTask: function() {
    var j = this.tasks.length-1;
    while (j>=0 && this.tasks[j].minimized) {
      j--;
    }
    if (j>=0) {
      this.selectTask(this.tasks[j].id);
    } else {
      this.unselectTasks();
    }
  },
  unselectTasks: function() {
    for (var i = 0; i< this.tasks.length; i++) {
      webix.html.removeCss($$("pix_task_"+this.tasks[i].id).getNode(), "active");
    }
  },
  findTask: function(id) {
    for (var i=0; i<this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        return this.tasks[i];
      }
    }
    return false;
  },
  findCurrentTask: function(view) {
    if (view.pixTask) {
      var task = this.findTask(view.config.id);
      if (task) {
        this.selectTask(view.config.id);
        return true;
      }
    }
    if (view.getParentView()) {
      return this.findCurrentTask(view.getParentView());
    } else {
      return false;
    }
  },
  $init: function(config) {
    var view = this;
    this.$ready.push(function() {
      webix.attachEvent("onFocusChange", function(current_view, prev_view) {
        if (current_view) {
          view.findCurrentTask(current_view);
        }
      });
      view.startTime();      
    });
  },
  updateTime: function(){
    // almost entirely from webix desktop demo
		var tm=new Date();
		var h=tm.getHours();
		var m= webix.Date.toFixed(tm.getMinutes());
		var day = tm.getDate();
		var month = webix.Date.toFixed(tm.getMonth()+1);
		var year = tm.getFullYear();
		var time = +h+":"+m;
		var date = day+"/"+month+"/"+year;
		$$("pixTaskbarTime").setHTML("<div>"+time+"</div><div>"+date+"</div>");
	},
	startTime: function(){
    this.updateTime();
		setInterval(this.updateTime, 30000);
	},
}, webix.ui.toolbar);

/**
 * pixItemList
 */

webix.protoUI({
  name:"pixItemList",
  $init: function(config) {
    //webix.extend(config,this.getUI());
  },
  defaults: {
    borderless:true,
    autowidth:false,
    autoheight:false,
    css:"pix-items",
    select:true,
    layout:"x",
    type:{
      height:"auto",
      width:"auto",
      css:"pix-item",
      template: function(obj) {
        if (obj.image) {
          return "<div class='pix-item-inner'><img class='pix-item-icon' src='"+obj.image+"'><div class='pix-item-name'> "+obj.name+"</div></div>";
        } else if (obj.icon) {
          return "<div class='pix-item-inner'><span class='pix-item-icon webix_icon "+obj.icon+"'></span><div class='pix-item-name'>"+obj.name+"</div></div>";
        }
      }
    },
    drag:true,
    open: function(name){},
    on: {
      onItemDblClick: function(id, e) {
        if (this.config.open && this.config.open[id]) {
          this.config.open[id].call(this, e);
        } else if ($$(id+"_window")) {
          $$(id+"_window").open();
        }
      },
      onItemClick: function(e) {
        pixItemSelected = true;
      }
    }
  },
  setContextMenu: function(data) {
    var element = this;
    var menu = webix.ui({
      view:"contextmenu",
      data:data.items,
      on:{
        onItemClick:function(id, e){
          if (data.click && data.click[id]) {
            data.click[id].call(this, e);
          }
        }
      },
      master:element
    });
  },
}, webix.ui.list);

/**
 * pixDesktop
 */

webix.protoUI({
  name:"pixDesktop",
  $init:function(config) {
    var view = this;
    var node = this.$view;
    this.$ready.push(function() {
      webix.attachEvent("onClick", function(mode){
        if (!pixItemSelected) {
          $$('pixDesktopItems').unselectAll();
        }
        pixFileSelected = false;
      });
    });
    if (config.background) {
      this.$ready.push(function() {
        node.style.backgroundImage = "url('"+config.background+"')";
      });
    }
    if (typeof config.taskbar !== "undefined" && config.taskbar) {
      this.$ready.push(function() {
        view.addView({view: "pixTaskbar", id: "pixTaskbar"});
      });
    }
    if (config.items) {
      this.$ready.push(function() {
        var items = $$("pixDesktopItems");
        items.define("data", config.items);
        if (config.open) {
          items.define("open", config.open);
        }
        if (config.contextMenu) {
          items.setContextMenu(config.contextMenu);
        }
      });
    }
    config.id = "pixDesktop";
  },
  defaults:{
    css:"pix-desktop",
    rows:[{
      view:"pixItemList",
      id:"pixDesktopItems",
      // mandatory here, otherwise list is not correctly initialized regarding
      // context menu
      onContext:{}
    },{}],
    taskbar:false
   },
   getBackground: function() {
    return this.config.background;
   },
   setBackground: function(image) {
     this.config.background = image;
     this.getNode().style.backgroundImage = "url('"+image+"')";
   }
}, webix.ui.layout);

/**
 * pixFolder
 */

webix.protoUI({
  name:"pixFolder",
  $init: function(config) {
    var view = this;
    if (config.items) {
      this.$ready.push(function() {
        var list = view.getBody();
        list.define("data", config.items);
        if (config.open) {
          list.define("open", config.open);
        }
        if (config.contextMenu) {
          list.setContextMenu(config.contextMenu);
        }
      });
    }
  },
  defaults: {
    css:"pix-folder",
    width:400,
    height:300,
    body: {
      view:"pixItemList",
      // mandatory here, otherwise list is not correctly initialized regarding
      // context menu
      onContext:{}
    }
  }
}, webix.ui.pixWindow);


webix.protoUI({
  name:"pixList"
},webix.ui.list, webix.ActiveContent);

webix.protoUI({
  name:"pixTemplate"
}, webix.ui.template, webix.ActiveContent);


/**
 * i18n
 */

webix.i18n.locales["fr-FR"]= {
  filemanager: {
    actions: "Actions",
    back: "Retour",
    forward: "Forward",
    levelUp: "Dossier parent",
    name: "Nom",
    size: "Taille",
    type: "Type",
    date: "Date",
    copy: "Copier",
    cut: "Couper",
    paste: "Coller",
    upload: "Upload",
    remove: "Supprimer",
    create: "Nouveau dossier",
    rename: "Renommer",
    location: "Emplacement",
    select: "Selectionner Fichiers",
    sizeLabels: ["o","Ko","Mo","Go"],
    iconsView: "Icônes",
    tableView: "Grille",
    hideTree: "Arbre",
    showTree: "Afficher arbre",
    collapseTree: "Fermer",
    expandTree: "Ouvrir",
    saving: "Enregistrement...",
    errorResponse: "Erreur: modifications non enregistrées !",
    replaceConfirmation: "Voulez-vous remplacer les fichiers existants ?",
    createConfirmation: "Le dossier existe déjà. Voulez-vous le remplacer ?",
    renameConfirmation: "Le fichier existe déjà. Voulez-vous le remplacer ?",
    yes: "Oui",
    no: "non",
    newFolder: "Nouveau dossier",
    types:{
        folder: "Dossier",
        doc: "Document",
        excel: "Excel",
        pdf: "PDF",
        pp: "PowerPoint",
        text: "Fichier texte",
        video: "Vidéo",
        image: "Image",
        code: "Code",
        audio: "Audio",
        archive: "Archive",
        file: "Fichier"
    }
  },
  calendar:{
    monthFull:["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthShort:["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aôu", "Sep", "Oct", "Nov", "Déc"],	
    dayFull:["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      dayShort:["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    hours: "Heures",
    minutes: "Minutes",
    done:"Valider",
    clear: "Effacer",
    today: "Aujourd'hui"
  }
};
webix.Date.startOnMonday = true;
webix.i18n.setLocale("fr-FR");

