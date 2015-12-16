// Generated by CoffeeScript 1.9.3
Ext.define('FM.view.windows.ErrorWindow', {
  extend: 'Ext.window.Window',
  alias: 'widget.error-window',
  cls: 'fm-error-window',
  layout: {
    type: 'vbox',
    align: 'center'
  },
  width: 300,
  resizable: false,
  title: t('Error'),
  buttonsPreset: 'OK',
  listeners: {
    show: {
      fn: function() {
        if (this.keymap != null) {
          this.keymap.destroy();
        }
        return this.keymap = new Ext.util.KeyMap({
          target: this.getEl(),
          binding: [
            {
              key: Ext.event.Event.ENTER,
              fn: FM.HotKeys.HotKeyDecorator((function(_this) {
                return function(key, e) {
                  var button, i, len, ref;
                  ref = _this.preset;
                  for (i = 0, len = ref.length; i < len; i++) {
                    button = ref[i];
                    if ((button.enter != null) && button.enter && !button.isDisabled()) {
                      if (button.handler != null) {
                        button.handler(button);
                      }
                    }
                  }
                  return e.stopEvent();
                };
              })(this))
            }
          ]
        });
      }
    }
  },
  initComponent: function(config) {
    var bottomTb, buttons, ok;
    FM.Logger.log('FM.view.windows.ErrorWindow init');
    this.items = [];
    buttons = {};
    ok = Ext.create('Ext.button.Button', {
      handler: (function(_this) {
        return function(button, e) {
          if (_this.ok != null) {
            return _this.ok(button, _this, _this.textField, e);
          } else {
            return _this.close();
          }
        };
      })(this),
      scope: this,
      text: t("OK"),
      minWidth: 75,
      enter: true
    });
    buttons.OK = [ok];
    this.preset = buttons[this.buttonsPreset];
    this.items.push({
      xtype: 'container',
      cls: 'fm-msg-error',
      height: 42,
      width: 42,
      margin: '15 0 10 0'
    });
    if (this.msg != null) {
      this.items.push({
        xtype: 'container',
        margin: 0,
        padding: '0 15',
        layout: {
          type: 'vbox',
          align: 'center'
        },
        items: [
          {
            xtype: 'displayfield',
            fieldLabel: this.msg,
            labelSeparator: '',
            labelStyle: 'text-align: center; padding-bottom: 10px;',
            labelWidth: 260
          }
        ]
      });
    }
    bottomTb = new Ext.toolbar.Toolbar({
      ui: 'footer',
      dock: 'bottom',
      layout: {
        pack: 'center'
      },
      padding: '0 8 10 16',
      items: this.preset
    });
    this.dockedItems = [bottomTb];
    return this.callParent(arguments);
  }
});
