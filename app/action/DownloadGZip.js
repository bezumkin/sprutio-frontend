// Generated by CoffeeScript 1.9.3
Ext.define('FM.action.DownloadGZip', {
  extend: 'FM.overrides.Action',
  config: {
    iconCls: "fm-action-download-gzip",
    text: t("Download as TAR.GZ archive"),
    handler: function(panel, records) {
      var paths, session;
      FM.Logger.info('handler DownloadGZip action()', arguments);
      if ((records == null) || records.length === 0) {
        FM.helpers.ShowError(t("Please select file entry."));
        return;
      }
      session = Ext.ux.Util.clone(panel.session);
      paths = FM.helpers.GetAbsNames(session, records);
      return FM.backend.ajaxSubmit('/actions/files/download', {
        params: {
          session: Ext.JSON.encode(session),
          mode: 'gzip',
          paths: Ext.JSON.encode(paths)
        }
      });
    }
  }
});
