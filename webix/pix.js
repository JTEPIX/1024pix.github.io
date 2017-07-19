webix.protoUI({
  name:"pixWindow",
  $init:function(config) {
    if (typeof config.label !== "undefined") {
      var view = this;
      this.$ready.push(function() {
        var head = view.getChildViews()[0];
        var label = head.getChildViews()[0];
        label.define("label", config.label);
      });
    }
    webix.extend(config,this.getUI());
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
                this.getParentView().hide();
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
                this.getParentView().hide();
              }
            }
          }
        ]
      }
    };
  }
}, webix.ui.window);
