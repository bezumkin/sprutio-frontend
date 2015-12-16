// Generated by CoffeeScript 1.9.3
Ext.define('FM.action.DownloadTar', {
  extend: 'FM.overrides.Action',
  config: {
    iconCls: "fm-action-download-tar",
    text: t("Download as TAR archive"),
    handler: function(panel, records) {
      var paths, session;
      FM.Logger.info('Run Action FM.action.DownloadTar', arguments);
      if ((records == null) || records.length === 0) {
        FM.helpers.ShowError(t("Please select file entry."));
        return;
      }
      session = Ext.ux.Util.clone(panel.session);
      paths = FM.helpers.GetAbsNames(session, records);
      return FM.backend.ajaxSubmit('/actions/files/download', {
        params: {
          session: Ext.JSON.encode(session),
          mode: 'tar',
          paths: Ext.JSON.encode(paths)
        }
      });
    }
  }
});
