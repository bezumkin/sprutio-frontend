// Generated by CoffeeScript 1.9.3
Ext.define('FM.action.HomeFtp', {
  extend: 'FM.overrides.Action',
  config: {
    scale: "large",
    iconAlign: "top",
    iconCls: "fm-action-home",
    text: t("Home FTP"),
    handler: function(panel) {
      FM.Logger.info('Run Action FM.action.HomeFtp', arguments);
      FM.helpers.SetLoading(panel.body, t("Loading..."));
      return FM.backend.ajaxSend('/actions/main/init_session', {
        success: (function(_this) {
          return function(response) {
            var response_data;
            response_data = Ext.util.JSON.decode(response.responseText).data;
            return FM.getApplication().fireEvent(FM.Events.main.initSession, response_data, [panel]);
          };
        })(this),
        error: (function(_this) {
          return function() {
            return FM.helpers.UnsetLoading(panel.body);
          };
        })(this)
      });
    }
  }
});
