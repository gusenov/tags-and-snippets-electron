// Панель инструментов редактора:
export class CodeToolbar {
  constructor(layoutCellObject, dataProvider, contextId, codeEditor) {
    this._dataProvider = dataProvider
    this._contextId = contextId
    this._codeEditor = codeEditor

    this._toolbarObject = layoutCellObject.attachToolbar()
    this._toolbarObject.setIconsPath('https://dhtmlx.com/docs/products/visualDesigner/live/preview/codebase/imgs/')
    this._toolbarObject.loadStruct('lib/gui/MainWindow/MainTabBar/ContextTab/CodeView/CodeToolbar.json')
    this._toolbarObject.attachEvent('onClick', this.onClicked.bind(this))
    this._toolbarObject.attachEvent('onEnter', this.onEntered.bind(this))
  }

  get toolbarObject()       { return this._toolbarObject }
  set toolbarObject(toolbarObject) { this._toolbarObject = toolbarObject }

  setEnabled(state) {
    this._toolbarObject.forEachItem(function (itemId) {
      if (state) {
        this._toolbarObject.enableItem(itemId)
      } else {
        this._toolbarObject.disableItem(itemId)
      }
    }.bind(this))
  }

  reload() {
    const selectedSnippetId = this._dataProvider.getSelectedSnippetId(this._contextId)
    const highlightName = this._dataProvider.getSnippetHighlight(selectedSnippetId)
    this._toolbarObject.setValue('highlight', highlightName)
  }

  //---------------------------------------------------------------------
  // Обработчики событий панели инструментов дерева тегов:
  //---------------------------------------------------------------------

  // Parameters:
  //     id        string|number    id of the clicked/hovered menu item
  //     zoneId    string           context menu zone, if a menu rendered in the context menu mode
  //     cas       object           state of CTRL/ALT/SHIFT keys during the click (pressed/not pressed)
  onClicked(id, zoneId, cas) {
    this[id]()
  }

  // Parameters:
  //     id        string|number    the id of an item
  //     zoneId    number           the text that the user types in an input item
  onEntered(id, value) {
    if (id === 'highlight') {
      this._codeEditor.editorObject.session.setMode('ace/mode/' + value)

      const selectedSnippetId = this._dataProvider.getSelectedSnippetId(this._contextId)
      this._dataProvider.setSnippetHighlight(selectedSnippetId, value)
    }
  }

  //---------------------------------------------------------------------

  undo() {
    this._codeEditor.editorObject.undo()
    if (!this._codeEditor.editorObject.session.getUndoManager().hasUndo()) {
      this._toolbarObject.disableItem('undo')
    }
  }

  redo() {
    this._codeEditor.editorObject.redo()
    if (!this._codeEditor.editorObject.session.getUndoManager().hasRedo()) {
      this._toolbarObject.disableItem('redo')
    }
  }

  cut() {
    document.execCommand("cut")
  }

  copy() {
    document.execCommand("copy")
  }

  paste() {
    document.execCommand("paste")
  }

}
