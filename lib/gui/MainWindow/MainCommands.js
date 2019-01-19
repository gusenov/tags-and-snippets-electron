const { remote } = require('electron')

export class MainCommands {
  constructor(dataProvider, mainTabbar) {
    this._dataProvider = dataProvider
    this._mainTabbar = mainTabbar
  }

  new() {
    this._mainTabbar.removeAllContextTabs()
    this._dataProvider.reset()
  }

  open() {
    if (this._dataProvider.load()) {
      const selectedContextId = this._dataProvider.getSelectedContextId()
      this._dataProvider.forEachContext(function (contextId, context) {
        const contextTab = this._mainTabbar.createContextTab(contextId)
        if (selectedContextId === contextTab.tabbarCellObject.getId()) {
          setTimeout(function () { contextTab.tabbarCellObject.setActive() }, 1000)
        }
        return true
      }.bind(this))
    }
  }

  save() {
    this._dataProvider.save()
  }

  saveAs() {
    this._dataProvider.saveAs()
  }

  quit() {
    remote.getCurrentWindow().close()
  }

  closeInactiveContexts() {
    const activeTabId = this._mainTabbar.tabbarObject.getActiveTab()
    this._mainTabbar.tabbarObject.forEachTab(function (tab) {
        const tabId = tab.getId()
        if (tabId !== 0 && tabId !== activeTabId) {
            tab.close(false)
        }
    }.bind(this))
  }
}
