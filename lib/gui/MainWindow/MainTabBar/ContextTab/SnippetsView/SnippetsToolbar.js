export class SnippetsToolbar {
  constructor(layoutCellObject, dataProvider, contextId, snippetsList) {
    this._dataProvider = dataProvider
    this._contextId = contextId
    this._snippetsList = snippetsList

    this._toolbarObject = layoutCellObject.attachToolbar()
    this._toolbarObject.setIconsPath('https://dhtmlx.com/docs/products/visualDesigner/live/preview/codebase/imgs/')
    this._toolbarObject.loadStruct('lib/gui/MainWindow/MainTabBar/ContextTab/SnippetsView/SnippetsToolbar.json')
    this._toolbarObject.attachEvent('onClick', this.onClicked.bind(this))
  }

  get toolbarObject()       { return this._toolbarObject }
  set toolbarObject(toolbarObject) { this._toolbarObject = toolbarObject }

  //---------------------------------------------------------------------
  // Обработчики событий панели инструментов списка сниппетов:
  //---------------------------------------------------------------------

  // Parameters:
  //     id        string|number    id of the clicked/hovered menu item
  //     zoneId    string           context menu zone, if a menu rendered in the context menu mode
  //     cas       object           state of CTRL/ALT/SHIFT keys during the click (pressed/not pressed)
  onClicked(id, zoneId, cas) {
    this[id]()
  }

  //---------------------------------------------------------------------

  newSnippet() {
    const newSnippetId = this._dataProvider.createSnippetForSelectedTags(this._contextId)

    if (this._snippetsList.listObject.isEdit()) {
      this._snippetsList.listObject.stopEdit()
    }

    this._snippetsList.listObject.add(
        this._dataProvider.buildItemForSnippetsList(newSnippetId)
      , this._snippetsList.listObject.dataCount()
    )

    this._dataProvider.setSelectedSnippetId(this._contextId, newSnippetId)
    this._snippetsList.listObject.select(newSnippetId)
  }

  deleteSnippet() {
    if (this._snippetsList.listObject.dataCount() > 0) {
      const selectedSnippetId = this._dataProvider.getSelectedSnippetId(this._contextId)
      if (selectedSnippetId !== -1) {
        this._snippetsList.listObject.remove(selectedSnippetId)
        this._dataProvider.deleteSnippet(selectedSnippetId)
      }
    }
  }

}
