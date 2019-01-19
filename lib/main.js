import { MainWindow } from './gui/MainWindow.js'

const Skins = Object.freeze({
  MATERIAL: 'material',
  SKYBLUE:  'skyblue',
  WEB:      'web',
  TERRACE:  'terrace'
})

const mainWindow = new MainWindow(Skins.WEB)
