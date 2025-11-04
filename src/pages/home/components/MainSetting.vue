<script setup lang="ts">
import SettingSelection from './SettingSelection.vue'
import ResetModal from './ResetModal.vue'
import preset from '@/preset.json'
import router from '@/router'
import { toggleSiteSytle } from '@/composables/dark'
import { iconStyleList, searchList, themeList, siteStyleList } from '@/utils'
import type { Settings, Category } from '@/types'

const resetStore = useResetModalStore()
const settingStore = useSettingStore()
const siteStore = useSiteStore()
const renderStore = useRenderStore()

interface CacheData {
  data: Category[]
  settings: Settings
}

/* Theme Setting 渲染 */
function renderThemeLabel(option: any) {
  const currentTheme = themeList.find(item => item.enName === option.enName)!
  const buttonColor = currentTheme.value.buttonC
  const darkConfig = isDark.value ? { style: { color: '#ffffff' } } : {}
  return h('div', { class: 'flex items-center gap-x-8' }, [
    h('div', { class: 'w-16 h-16 circle border-1 border-fff', style: { backgroundColor: buttonColor } }),
    h('div', darkConfig, option.name)
  ])
}

function renderColor(option: any) {
  const darkConfig = isDark.value ? { style: { color: '#ffffff' } } : {}
  return h('div', { class: 'flex items-center gap-x-8' }, [
    h('div', darkConfig, option.name)
  ])
}

/* 导入导出数据 */
function exportData() {
  const data = {
    data: siteStore.data,
    settings: settingStore.settings
  }
  const jsonStr = JSON.stringify(data)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = `COMECOME_Data_${new Date().toLocaleString()}.json`
  a.href = url
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
}

function importData() {
  const inputElement = document.createElement('input')
  inputElement.type = 'file'
  inputElement.accept = '.json'
  inputElement.addEventListener('change', async () => {
    const file = inputElement.files?.[0]
    if (file) {
      try {
        const jsonStr = await file.text()
        const data = JSON.parse(jsonStr) as CacheData
        if (!data.data || !data.settings) {
          throw new Error('非法的数据文件')
        }
        loadData(data)
      } catch {
        window.$message.error('请导入合法的数据文件', { duration: 2000 })
      }
    }
  })
  inputElement.click()
}

/* 重置数据 */
function resetData() {
  resetStore.title = '重置确认'
  resetStore.content = '是否确认要重置所有设置?'
  resetStore.resetVisible = true
  resetStore.afterCommit = () => {
    router.back()
  }
  resetStore.finishCommit = () => {
    const clonedPreset = JSON.parse(JSON.stringify(preset))
    const data = clonedPreset as CacheData
    loadData(data)
    window.$message.success('重置成功', { duration: 2000 })
  }
}

/* 加载数据到 store */
function loadData(data: CacheData) {
  siteStore.setData(data.data)
  settingStore.setSettings(data.settings)
  toggleSiteSytle()
  siteStore.cateIndex = 0
  renderStore.refreshSiteGroupList()
}
</script>
