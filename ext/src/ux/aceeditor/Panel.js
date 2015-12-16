/**
 * @class Ext.ux.aceeditor.Panel
 * @extends Ext.panel.Panel
 * 
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('Ext.ux.aceeditor.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.AceEditor',
    mixins: {
        editor: 'Ext.ux.aceeditor.Editor'
    },
    layout: 'fit',
    autofocus: true,
    border: false,
    margin: 0,
    items: [
        {
            xtype: 'component',
            cls: 'pre-editor',
            autoEl: 'pre',
            layout: 'fit',
            margin: '0 0 0 0',
            style: {
                top: '0',
                borderTop: '1px solid #e3e3e3',
                borderBottom: '1px solid #e3e3e3'
            }
        }
    ],
    listeners: {
        resize: function()
        {
            if(this.editor)
            {
                this.editor.resize();
            }
        },
        activate: function()
        {
            if(this.editor && this.autofocus)
            {
                this.editor.focus();
            }
        }
    },
    
    initComponent: function()
    {
        this.callParent(arguments);
    },
    
    onRender: function()
    {
        var me = this;

        if(me.sourceEl != null)
        {
            //me.sourceCode = Ext.get(me.sourceEl).getHTML();
            //me.sourceCode = Ext.get(me.sourceEl).dom.innerHTML; 
            me.sourceCode = Ext.get(me.sourceEl).dom.outerText; 
            //me.sourceCode = Ext.get(me.sourceEl).dom.value;
        }

        me.editorId = me.items.keys[0];
        me.oldSourceCode = me.sourceCode;
        
        me.callParent(arguments);

        // init editor on afterlayout
        me.on('afterlayout', function()
        {
            if(me.url)
            {
                Ext.Ajax.request({
                    url: me.url,
                    success: function(response)
                    {
                        me.sourceCode = response.responseText;
                        me.initEditor();
                    }
                });
            }
            else
            {
                me.initEditor();
            }
            
        }, me, {
            single: true
        });
    }
});