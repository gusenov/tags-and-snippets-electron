// Панель инструментов тегов:
export class TagsToolbar {
  constructor(layoutCellObject, dataProvider, snippetsView, tagsTree) {
    this._snippetsView = snippetsView

    this._toolbarObject = layoutCellObject.attachToolbar()
    this._toolbarObject.setIconsPath('resources/icons/')
    this._toolbarObject.loadStruct('lib/gui/MainWindow/MainTabBar/ContextTab/TagsView/TagsToolbar.json')
    this._toolbarObject.attachEvent('onClick', this.onClicked.bind(this))

    this._dataProvider = dataProvider
    this._tagsTree = tagsTree
  }

  get toolbarObject()       { return this._toolbarObject }
  set toolbarObject(toolbarObject) { this._toolbarObject = toolbarObject }

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

  //---------------------------------------------------------------------

  createTag() {
    let parent = -1

    const selectedTagId = this._tagsTree.gridObject.getSelectedRowId()
    console.info('Selected tag ID', selectedTagId)

    if (selectedTagId) parent = parseInt(selectedTagId)
    const newTagId = this._dataProvider.createTag("untitled", parent)

    this._tagsTree.gridObject.addRow(
        newTagId               // string|number  new row id
      , [ false, "untitled" ]  // array          an array of cell labels in a row
      , null                   // number         position of a row (set to null, for using parentId)
      , selectedTagId          // string|number  id of the parent row
      , "tag-blue-icon.png"    // string         img url for new row
      , false                  // boolean        child flag (optional)
    )

    // this._tagsTree.gridObject.expandAll()

    this._tagsTree.gridObject.selectCell(newTagId, 1, false, true, true)
  }

  deleteTag() {
    const selectedTagId = this._tagsTree.gridObject.getSelectedRowId()
    this._dataProvider.deleteTag(selectedTagId)
    this._tagsTree.gridObject.deleteRow(selectedTagId)
    this._snippetsView.reload()
  }

  clearSelectionInTagsTree() {
    this._tagsTree.gridObject.clearSelection()
  }
}
