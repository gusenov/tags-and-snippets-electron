import { TagsView } from './ContextTab/TagsView.js'
import { SnippetsView } from './ContextTab/SnippetsView.js'
import { CodeView } from './ContextTab/CodeView.js'

// Контекстная вкладка:
export class ContextTab {
  constructor(tabbarCellObject, dataProvider) {
    this._tabbarCellObject = tabbarCellObject
    this._layoutObject = this._tabbarCellObject.attachLayout('3L')

    this._codeView = new CodeView(
        this._layoutObject.cells('c')
      , dataProvider
      , this._tabbarCellObject.getId()
    )

    this._snippetsView = new SnippetsView(
        this._layoutObject.cells('b')
      , dataProvider
      , this._tabbarCellObject.getId()
      , this._codeView
    )

    this._tagsView = new TagsView(
        this._layoutObject.cells('a')
      , dataProvider
      , this._tabbarCellObject.getId()
      , this._snippetsView
    )

    this._layoutObject.attachEvent("onCollapse", this.onCollapsed.bind(this))
    this._layoutObject.attachEvent("onExpand", this.onExpanded.bind(this))
    this._layoutObject.attachEvent("onResizeFinish", this.onResizeFinished.bind(this))
  }

  get tabbarCellObject()          { return this._tabbarCellObject }
  set tabbarCellObject(tabbarCellObject) { this._tabbarCellObject = tabbarCellObject }

  // Раскладка:
  get layoutObject()      { return this._layoutObject }
  set layoutObject(layoutObject) { this._layoutObject = layoutObject }

  // Представление тегов:
  get tagsView()  { return this._tagsView }
  set tagsView(tagsView) { this._tagsView = tagsView }

  // Представление сниппетов:
  get snippetsView()      { return this._snippetsView }
  set snippetsView(snippetsView) { this._snippetsView = snippetsView }

  reload() {
    this._tagsView.reload()
    this._snippetsView.reload()
    this._codeView.reload()
  }

  //---------------------------------------------------------------------
  // Обработчики событий контекстной вкладки:
  //---------------------------------------------------------------------

  // Parameters:
  //     name    string    cell name
  onCollapsed(name) {
    this._codeView.codeEditor.editorObject.resize()
  }

  // Parameters:
  //     name    string    cell name
  onExpanded(name) {
    this._codeView.codeEditor.editorObject.resize()
  }

  onResizeFinished() {
    this._codeView.codeEditor.editorObject.resize()
  }

  //---------------------------------------------------------------------

}
