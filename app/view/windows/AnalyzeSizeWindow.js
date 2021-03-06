// Generated by CoffeeScript 1.11.1
Ext.define('FM.view.windows.AnalyzeSizeWindow', {
  extend: 'Ext.ux.window.Window',
  requires: ['FM.view.grids.FileSizeList', 'FM.view.charts.FileSizeChart'],
  alias: 'widget.analyze-size-window',
  cls: 'fm-analyze-size-window',
  title: t("Folder Size"),
  animate: true,
  constrain: true,
  layout: {
    type: 'vbox',
    align: 'stretch',
    pack: 'start'
  },
  bodyPadding: '0 0 20 0',
  width: 600,
  height: 600,
  resizable: {
    handles: 's n',
    minHeight: 300,
    maxHeight: 900,
    pinned: true
  },
  maximizable: true,
  modal: false,
  border: false,
  session: null,
  path: null,
  operationStatus: null,
  items: [
    {
      xtype: 'file-size-chart'
    }, {
      xtype: 'file-size-list'
    }
  ],
  initComponent: function() {
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
  setPath: function(path) {
    return this.path = path;
  },
  getPath: function() {
    return this.path;
  },
  hasPath: function() {
    if (this.path != null) {
      return true;
    } else {
      return false;
    }
  },
  setOperationStatus: function(status) {
    return this.operationStatus = status;
  },
  hasOperationStatus: function() {
    if (this.operationStatus != null) {
      return true;
    } else {
      return false;
    }
  },
  getOperationStatus: function() {
    return this.operationStatus;
  }
});
