import { ContextTab } from './MainTabBar/ContextTab.js'

const TAB_ADD_ID = 0
const TAB_ADD_TITLE = '+'

export class MainTabbar {
  constructor(layoutCellObject, dataProvider) {
    this._tabbarObject = layoutCellObject.attachTabbar()
    this._dataProvider = dataProvider

    // Контекстные вкладки:
    this._contextTabs = {}

    // Вкладка для добавления новых контекстных вкладок:
    this._tabAdd = this.createTab(TAB_ADD_ID, TAB_ADD_TITLE, null, false, false)
    this._tabAdd.disable()

    this._tabbarObject.attachEvent('onTabClick', this.onTabClicked.bind(this))
    this._tabbarObject.attachEvent('onSelect',   this.onSelected.bind(this))
    this._tabbarObject.attachEvent("onTabClose", this.onTabClosed.bind(this))
  }

  get tabbarObject()      { return this._tabbarObject }
  set tabbarObject(tabbarObject) { this._tabbarObject = tabbarObject }

  removeAllContextTabs() {
    this._tabbarObject.forEachTab(function (tab) {
      if (tab.getId() !== TAB_ADD_ID) {
        tab.close()
      }
    })
  }

  //---------------------------------------------------------------------
  // Обработчики событий главной панели вкладок:
  //---------------------------------------------------------------------

  // Parameters:
  //     id        string|number    id of the clicked tab
  //     lastId    string|number    id of the previously active tab, if any
  onTabClicked(id, lastId) {
    switch (id) {
      case TAB_ADD_ID:
        const newContextTab = this.createContextTab()
        newContextTab.tabbarCellObject.setActive()
        break
      default:
        this._dataProvider.setSelectedContextId(id)
    }
  }

  // Parameters:
  //     id        string|number    clicked tab id
  //     lastId    string|number    id of the previously active tab, if any
  // Returns:
  //               boolean          true|false to allow/cancel selection
  onSelected(id) {
    switch (id) {
      case TAB_ADD_ID:
        return false
      default:
        console.info('You selected tab with id:', id)
        const selectedContextTab = this.getContextTabById(id)
        selectedContextTab.reload()
        return true
    }
  }

  // Parameters:
  //     id    string|number    the tab id
  // Returns:
  //           boolean          true|false to allow/cancel closing
  onTabClosed(id) {
    this.closeContextTab(id)
    return true
  }

  //---------------------------------------------------------------------

  // Создать вкладку:
  createTab(id, name, pos, isActive, isClosable) {
    this._tabbarObject.addTab(id, name, null, pos, isActive, isClosable)
    return this._tabbarObject.cells(id)
  }

  // Создать контекстную вкладку:
  createContextTab(contextId) {
    if (typeof contextId === 'undefined') {
      contextId = this._dataProvider.createContext()
    }
    const context = this._dataProvider.getContextById(contextId)

    const tabsCnt = this._tabbarObject.getAllTabs().length
    const newTab = this.createTab(contextId, context.name, tabsCnt - 1, false, true)

    const newContextTab = new ContextTab(newTab, this._dataProvider)
    this._contextTabs[contextId] = newContextTab

    return newContextTab
  }

  // Закрыть контекстную вкладку:
  closeContextTab(tabId) {
    this._tabbarObject.forEachTab(function (tab) {
      if (this._tabbarObject.tabs(tabId).getIndex() - tab.getIndex() === 1) {
        tab.setActive()
      }
    }.bind(this))
    this._tabbarObject.cells(tabId).close(false)
    this._dataProvider.deleteContext(tabId)
  }

  getContextTabById(contextId) {
    return this._contextTabs[contextId]
  }

}
