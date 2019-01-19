import { TagsToolbar } from './TagsView/TagsToolbar.js'
import { TagsTree } from './TagsView/TagsTree.js'

export class TagsView {
  constructor(layoutCellObject, dataProvider, contextId, snippetsView) {
    layoutCellObject.setText('Tags')
    this._tagsTree = new TagsTree(layoutCellObject, dataProvider, contextId, snippetsView)
    this._tagsToolbar = new TagsToolbar(layoutCellObject, dataProvider, snippetsView, this.tagsTree)
  }

  get tagsToolbar()     { return this._tagsToolbar }
  set tagsToolbar(tagsToolbar) { this._tagsToolbar = tagsToolbar }

  get tagsTree()  { return this._tagsTree }
  set tagsTree(tagsTree) { this._tagsTree = tagsTree }

  reload() {
    this._tagsTree.reload()
  }
}
