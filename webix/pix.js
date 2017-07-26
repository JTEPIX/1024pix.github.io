var pixFileSelected = false;

webix.protoUI({
  name:"pixWindow",
  $init:function(config) {
    var view = this;
    if (typeof config.label !== "undefined") {
      this.$ready.push(function() {
        var head = view.getChildViews()[0];
        var label = head.getChildViews()[0];
        label.define("label", config.label);
      });
    }
    webix.extend(config,this.getUI());
    this.$ready.push(function() {
      if ($$("pixTaskbar")) {
        // there is a taskbar: show minimize icon
        view.getChildViews()[0].getChildViews()[1].show();
      }
    })
  },
  getUI: function() {
    return {
      label:"",
      move:true,
      resize:true,
      hidden:true,
      height:400,
      width:400,
      position:"center",
      css:'pix-window',
      toFront:true,
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
  }
}, webix.ui.window);

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
    })
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

webix.protoUI({
  name:"pixDesktop",
  id:"pixDesktop",
  $init:function(config) {
    var view = this;
    var node = this.$view;
    if (typeof config.data !== "undefined") {
      this.$ready.push(function() {
        var list = view.getChildViews()[0];
        list.define("data", config.data);
        if (typeof config.open !== "undefined") {
          list.define("open", config.open);
        }
      });
      webix.attachEvent("onClick", function(mode){
        if (!pixFileSelected) {
          $$('pixDesktopItems').unselectAll();
        }
        pixFileSelected = false;
      });
    }
    if (typeof config.background !== "undefined") {
      this.$ready.push(function() {
        node.style.backgroundImage = "url('"+config.background+"')";
      });
    }
    if (typeof config.taskbar !== "undefined" && config.taskbar) {
      this.$ready.push(function() {
        view.addView({view: "pixTaskbar", id: "pixTaskbar"});
      });
    }
  },
  defaults:{
    css:"pix-desktop",  
    rows:[{
      view:"list",
      borderless:true,
      autowidth:false,        
      id:"pixDesktopItems",
      width:80,
      css:"pix-desktop-items",
      select:true,
      type:{
        height:120,
        width:100,
        template: "<div class='pix-desktop-item-inner'><img class='pix-desktop-item-icon' src='#img#'><div class='pix-desktop-item-name'> #name#</div></div>",
        css:"pix-file",
      },
      onContext:{},
      drag:true,
      data:[],
      open: function(name){},
      on: {
        onItemDblClick: function(id, e) {
          this.config.open(id);
        },
        onItemClick: function(e) {
          pixFileSelected = true;
        }
      }
    }],
    taskbar:false
   }  
}, webix.ui.layout);

