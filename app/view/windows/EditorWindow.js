// Generated by CoffeeScript 1.9.3
Ext.define('FM.view.windows.EditorWindow', {
  extend: 'Ext.ux.window.Window',
  requires: ['Ext.ux.aceeditor.Panel', 'FM.view.toolbars.EditorTopToolbar', 'FM.view.toolbars.EditorBottomToolbar'],
  alias: 'widget.editor-window',
  cls: 'fm-editor-window',
  layout: "fit",
  constrain: true,
  animate: true,
  maximizable: true,
  border: false,
  width: 700,
  height: 400,
  margin: 0,
  editorMode: "text",
  editorModified: false,
  tbar: {
    xtype: 'editor-top-toolbar'
  },
  bbar: {
    xtype: 'editor-bottom-toolbar'
  },
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
              key: 's',
              ctrl: true,
              fn: FM.HotKeys.HotKeyDecorator((function(_this) {
                return function(key, e) {
                  FM.Logger.debug('ctrl + s', arguments, _this);
                  _this.save();
                  return e.stopEvent();
                };
              })(this))
            }
          ]
        });
      }
    },
    beforeshow: {
      fn: function() {
        return FM.Logger.debug('FM.view.windows.EditorWindow beforeshow() called', this, arguments);
      }
    },
    beforeclose: {
      fn: function(editor_window) {
        var question;
        FM.Logger.debug('FM.view.windows.EditorWindow beforeclose() called', this, arguments);
        if (!this.editorModified) {
          return true;
        }
        question = Ext.create('FM.view.windows.QuestionWindow', {
          title: t("File Modified"),
          msg: t("File was modified.<br/>Save changes?"),
          buttonsPreset: 'YES_NO_CANCEL',
          cancel: function() {
            return false;
          },
          no: function() {
            FM.Logger.debug("no() handler");
            editor_window.editorModified = false;
            editor_window.close();
            return true;
          },
          yes: function() {
            return editor_window.save(editor_window.fileEncoding, function() {
              return editor_window.close();
            });
          }
        });
        question.show();
        return false;
      }
    }
  },
  initComponent: function() {
    var editor;
    FM.Logger.debug('FM.view.windows.EditorWindow initComponent() called', arguments);
    this.editorMode = FM.Editor.getMode(this.fileRecord);
    editor = Ext.create("Ext.ux.aceeditor.Panel", {
      sourceCode: this.fileContent,
      parser: this.editorMode,
      listeners: {
        editorcreated: (function(_this) {
          return function(editor_panel) {
            _this.initEditor(editor_panel.editor);
            return _this.updateSettings();
          };
        })(this)
      }
    });
    this.items = [editor];
    return this.callParent(arguments);
  },
  setSession: function(session) {
    return this.session = session;
  },
  getSession: function() {
    return this.session;
  },
  hasSession: function() {
    if (this.session != null) {
      return true;
    } else {
      return false;
    }
  },
  save: function(encoding, callback) {
    FM.Logger.debug('FM.view.windows.EditorWindow save() called', arguments);
    FM.helpers.SetLoading(this.body, t("Saving file..."));
    return FM.backend.ajaxSend('/actions/files/write', {
      params: {
        session: this.getSession(),
        path: FM.helpers.GetAbsName(this.getSession(), this.fileRecord),
        content: this.editor.getValue(),
        encoding: (encoding != null ? encoding : this.fileEncoding)
      },
      success: (function(_this) {
        return function(response) {
          var response_data;
          response_data = Ext.util.JSON.decode(response.responseText).data;
          _this.fileEncoding = response_data.encoding;
          _this.fileRecord.set("size", response_data.item.size, {
            dirty: false
          });
          FM.helpers.UnsetLoading(_this.body);
          _this.editorModified = false;
          _this.editor_status.setText(t("READ"));
          _this.updateToolbar();
          if (callback != null) {
            return callback(_this);
          }
        };
      })(this),
      failure: (function(_this) {
        return function(response) {
          FM.helpers.UnsetLoading(_this.body);
          FM.helpers.ShowError(t("Error during saving file.<br/> Please contact Support."));
          return FM.Logger.error(response);
        };
      })(this)
    });
  },
  exit: function() {
    FM.Logger.debug('FM.view.windows.EditorWindow exit() called', arguments);
    return this.close();
  },
  changeEncoding: function(encoding) {
    FM.Logger.debug('FM.view.windows.EditorWindow changeEncoding() called', arguments);
    this.fileEncoding = encoding;
    this.updateToolbar();
    return this.updateSettings();
  },
  changeSyntax: function(syntax) {
    FM.Logger.debug('FM.view.windows.EditorWindow changeSyntax() called', arguments);
    this.editorMode = syntax;
    this.updateToolbar();
    return this.updateSettings();
  },
  initEditor: function(ace_editor) {
    FM.Logger.debug('FM.view.windows.EditorWindow initEditor() called', arguments);
    this.editor = ace_editor;
    this.editor_mode = Ext.ComponentQuery.query('tbtext[cls=fm-editor-mode]', this)[0];
    this.editor_encoding = Ext.ComponentQuery.query('tbtext[cls=fm-editor-encoding]', this)[0];
    this.editor_size = Ext.ComponentQuery.query('tbtext[cls=fm-editor-size]', this)[0];
    this.editor_status = Ext.ComponentQuery.query('tbtext[cls=fm-editor-status]', this)[0];
    this.editor_position = Ext.ComponentQuery.query('tbtext[cls=fm-editor-position]', this)[0];
    this.editor_mode.setText(Ext.util.Format.format(t("Mode: {0}"), this.editorMode));
    this.editor_encoding.setText(this.fileEncoding);
    this.editor_size.setText(Ext.util.Format.format(t("Loaded {0} bytes"), this.fileRecord.get("size")));
    this.editor.on("change", (function(_this) {
      return function() {
        if (!_this.editorModified) {
          _this.editorModified = true;
          return _this.editor_status.setText(t("MODIFIED"));
        }
      };
    })(this));
    return this.editor.selection.on("changeCursor", (function(_this) {
      return function() {
        var c;
        c = _this.editor.selection.getCursor();
        return _this.editor_position.setText((c.row + 1) + " : " + c.column);
      };
    })(this));
  },
  updateToolbar: function() {
    var c, encoding_menu, syntax_menu;
    FM.Logger.debug('FM.view.windows.EditorWindow updateToolbar() called', arguments);
    this.editor_mode.setText(Ext.util.Format.format(t("Mode: {0}"), this.editorMode));
    this.editor_encoding.setText(this.fileEncoding);
    this.editor_size.setText(Ext.util.Format.format(t("Loaded {0} bytes"), this.fileRecord.get("size")));
    this.editor_status.setText(this.editorModified ? t("MODIFIED") : t("READ"));
    c = this.editor.selection.getCursor();
    this.editor_position.setText((c.row + 1) + " : " + c.column);
    encoding_menu = Ext.ComponentQuery.query('button[cls=button-menu-encoding]', this)[0].getMenu();
    syntax_menu = Ext.ComponentQuery.query('button[cls=button-menu-syntax]', this)[0].getMenu();
    encoding_menu.items.each(function(item) {
      if (item.text !== this.fileEncoding) {
        return item.setChecked(false);
      } else {
        return item.setChecked(true);
      }
    }, this);
    return syntax_menu.items.each(function(item) {
      if (item.text !== this.editorMode) {
        return item.setChecked(false);
      } else {
        return item.setChecked(true);
      }
    }, this);
  },
  updateSettings: function() {
    FM.helpers.SetLoading(this.body, t("Applying settings..."));
    if (FM.Editor.settings.print_margin_size != null) {
      this.editor.setPrintMarginColumn(FM.Editor.settings.print_margin_size);
    }
    if (FM.Editor.settings.font_size != null) {
      this.editor.setFontSize(FM.Editor.settings.font_size + "px");
    }
    if (FM.Editor.settings.tab_size != null) {
      this.editor.getSession().setTabSize(FM.Editor.settings.tab_size);
    }
    if (FM.Editor.settings.full_line_selection != null) {
      this.editor.setSelectionStyle(FM.Editor.settings.full_line_selection ? "line" : "text");
    }
    if (FM.Editor.settings.highlight_active_line != null) {
      this.editor.setHighlightActiveLine(FM.Editor.settings.highlight_active_line);
    }
    if (FM.Editor.settings.show_invisible != null) {
      this.editor.setShowInvisibles(FM.Editor.settings.show_invisible);
    }
    if (FM.Editor.settings.wrap_lines != null) {
      this.editor.getSession().setUseWrapMode(FM.Editor.settings.wrap_lines);
    }
    if (FM.Editor.settings.use_soft_tabs != null) {
      this.editor.getSession().setUseSoftTabs(FM.Editor.settings.use_soft_tabs);
    }
    if (FM.Editor.settings.show_line_numbers != null) {
      this.editor.renderer.setShowGutter(FM.Editor.settings.show_line_numbers);
    }
    if (FM.Editor.settings.highlight_selected_word != null) {
      this.editor.setHighlightSelectedWord(FM.Editor.settings.highlight_selected_word);
    }
    if (FM.Editor.settings.show_print_margin != null) {
      this.editor.renderer.setShowPrintMargin(FM.Editor.settings.show_print_margin);
    }
    if (FM.Editor.settings.code_folding_type != null) {
      this.editor.getSession().setFoldStyle(FM.Editor.settings.code_folding_type);
    }
    if (FM.Editor.settings.theme != null) {
      this.editor.setTheme("ace/theme/" + FM.Editor.settings.theme);
    }
    this.editor.getSession().setMode("ace/mode/" + this.editorMode);
    if (FM.Editor.settings.use_autocompletion != null) {
      this.editor.setOptions({
        enableBasicAutocompletion: FM.Editor.settings.use_autocompletion,
        enableSnippets: FM.Editor.settings.use_autocompletion
      });
    }
    if (FM.Editor.settings.enable_emmet != null) {
      this.editor.setOptions({
        enableEmmet: FM.Editor.settings.enable_emmet
      });
    }
    return FM.helpers.UnsetLoading(this.body);
  }
});
