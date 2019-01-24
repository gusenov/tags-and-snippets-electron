export class TagsTree {
  constructor(layoutCellObject, dataProvider, contextId, snippetsView) {
    this._gridObject = layoutCellObject.attachGrid()
    this._dataProvider = dataProvider
    this._contextId = contextId
    this._snippetsView = snippetsView

    this._gridObject.setHeader("Select,Name")
    this._gridObject.setColumnIds("select,name")
    this._gridObject.setColTypes("ch,tree")
    this._gridObject.setInitWidths("64,*")
    this._gridObject.enableDragAndDrop(true)
    this._gridObject.setDragBehavior("complex")
    this._gridObject.setImagePath('https://dhtmlx.com/docs/products/visualDesigner/live/preview/codebase/imgs/')
    this._gridObject.setIconsPath('resources/icons/')
    this._gridObject.init()

    this._gridObject.attachEvent("onBeforeDrag", this.onBeforeDragged.bind(this))
    this._gridObject.attachEvent("onDrop",       this.onDropped.bind(this))
    this._gridObject.attachEvent("onEditCell",   this.onCellEdited.bind(this))
    this._gridObject.attachEvent("onCheck",      this.onChecked.bind(this))
    this._gridObject.attachEvent("onEmptyClick", this.onEmptyClicked.bind(this))
    this._gridObject.attachEvent("onRowSelect", this.onRowSelected.bind(this))
  }

  get gridObject()    { return this._gridObject }
  set gridObject(gridObject) { this._gridObject = gridObject }

  //---------------------------------------------------------------------
  // Обработчики событий дерева тегов:
  //---------------------------------------------------------------------

  onBeforeDragged(rowId) {
    // ID перетаскиваемого тега:
    this._dragTagId = parseInt(rowId)

    // ID родителя перетаскиваемого тега:
    this._dragTagParentId = parseInt(this._gridObject.getParentId(this._dragTagId))

    return true  // разрешить перетаскивание.
  }

  onDropped(sourceItemId) {
    // ID перенесённого тега:
    const dropTagId = parseInt(sourceItemId)

    // ID родителя перенесённого тега:
    let dropTagParentId = parseInt(this._gridObject.getParentId(dropTagId))

    if (dropTagParentId === 0) {
      dropTagParentId = -1
    }

    // Если ID перетаскиваемого тега соответствует ID перенесённого
    // и ID родителя перетаскиваемого тега не равен ID родителя перенесённого тега:
    if (this._dragTagId === dropTagId && this._dragTagParentId !== dropTagParentId) {
      // Значит изменился родитель перетаскиваемого тега.

      this._dataProvider.changeTagParent(this._dragTagId, dropTagParentId)
    }
  }

  onCellEdited(stage, rId, cInd, nValue, oValue) {
    switch (stage) {
      case 0:  // before start; can be canceled if return false
        break
      case 1:  // the editor is opened
        break
      case 2:  // the editor is closed
        if (cInd === 1) {  // zero-based
          this._dataProvider.updateTagName(rId, nValue)
        }
        break
      default:
    }
    return true
  }

  // Parameters:
  //     rId      string|number    the id of a row
  //     cInd     number           the index of a cell
  //     state    boolean          the state of the checkbox/radiobutton
  onChecked(rId, cInd, state) {
    this._dataProvider.selectTag(this._contextId, parseInt(rId), state)
    this._snippetsView.reload()
  }

  // Parameters
  //     ev    object    MouseEvent
  onEmptyClicked(ev) {
    this._gridObject.clearSelection()
  }

  // Parameters:
  //     id    string|number    the id of the clicked row
  //     ind   number           the index of the clicked cell
  onRowSelected(id, ind) {
    if (ind === 0) {
      const cellObj = this._gridObject.cellById(id, ind)
      const state = !cellObj.isChecked()
      cellObj.setChecked(state)
      this.onChecked(id, ind, state)
    }
  }

  //---------------------------------------------------------------------

  reload() {
    this._gridObject.clearAll()
    this._gridObject.parse(this._dataProvider.buildJsonStringForTagsTree(this._contextId), "json")
    // this._gridObject.expandAll()
  }

}
