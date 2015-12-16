// Generated by CoffeeScript 1.9.3
Ext.define('FM.action.Rename', {
  extend: 'FM.overrides.Action',
  config: {
    iconCls: "fm-action-rename",
    text: t("Rename"),
    buttonText: t("Rename [ Ctrl + 6 ]"),
    handler: function(panel, record) {
      var promt, session, source_path;
      FM.Logger.info('Run Action FM.action.Rename', arguments);
      if (record == null) {
        FM.helpers.ShowError(t("Please select file entry."));
        return;
      } else if (record.get('name') === '..') {
        FM.helpers.ShowError(t("Please select file entry."));
        return;
      }
      session = Ext.ux.Util.clone(panel.session);
      source_path = FM.helpers.GetAbsName(session, record);
      promt = Ext.create('FM.view.windows.PromtWindow', {
        title: t("Rename"),
        msg: t("Enter new name for the element:"),
        fieldValue: record.get('name'),
        ok: function(button, promt_window, field) {
          var name, renamed_record, target_path;
          FM.Logger.debug('ok handler()', arguments);
          button.disable();
          name = field.getValue();
          if (panel.filelist.store.find("name", name, 0, false, false, true) > -1) {
            FM.helpers.ShowError(t("File with this name already exists in the current folder."));
            button.enable();
            return;
          }
          renamed_record = FM.model.File.create({
            name: name
          });
          target_path = FM.helpers.GetAbsName(session, renamed_record);
          if (session.type === FM.Session.LOCAL_APPLET) {
            try {
              return panel.applet.rename(source_path, target_path, session, promt_window);
            } catch (_error) {
              button.enable();
              FM.helpers.ShowError(t("Error during operation. <br/>Please contact Support."));
              return FM.Logger.error("Applet error");
            }
          } else {
            return FM.backend.ajaxSend('/actions/files/rename', {
              params: {
                session: session,
                source_path: source_path,
                target_path: target_path
              },
              success: (function(_this) {
                return function(response) {
                  var response_data;
                  response_data = Ext.util.JSON.decode(response.responseText).data;
                  FM.getApplication().fireEvent(FM.Events.file.renameFile, response_data.source, response_data.target, session);
                  return promt_window.close();
                };
              })(this),
              failure: (function(_this) {
                return function(response) {
                  button.enable();
                  FM.helpers.ShowError(t("Error during operation. <br/>Please contact Support."));
                  return FM.Logger.error(response);
                };
              })(this)
            });
          }
        }
      });
      return promt.show();
    }
  }
});
