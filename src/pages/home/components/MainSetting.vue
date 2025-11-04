<script setup lang="ts">
import SettingSelection from './SettingSelection.vue'
import ResetModal from './ResetModal.vue'

import type { Settings, Category } from '@/types'
import type { ThemeSetting } from '@/utils'
import { iconStyleList, searchList, themeList, siteStyleList } from '@/utils'
import preset from '@/preset.json'
import router from '@/router'
import { toggleSiteSytle } from '@/composables/dark'

// 引入 Pinia stores
const resetStore = useResetModalStore()
const settingStore = useSettingStore()
const renderStore = useRenderStore()
const siteStore = useSiteStore()

// ✅ 修复：确保 GitHub Pages 上也能正确检测 “设置页”
const route = useRoute()
watch(
  route,
  () => {
    const path = route.path || ''
    settingStore.isSetting = path.includes('setting')
  },
  { immediate: true }
)

/* -----------------------------
   渲染主题选项标签
-------------------------------- */
function renderThemeLabel(option: ThemeSetting): VNode {
  const currentTheme = themeList.find(item => item.enName === option.enName)!
  const buttonColor = currentTheme.value.buttonC
  const darkConfig = isDark.value ? { style: { color: '#ffffff' } } : {}

  return h('div', { class: 'flex items-center gap-x-8' }, [
    h('div', { class: 'w-16 h-16 circle border-1 border-fff', style: { backgroundColor: buttonColor } }),
    h('div', darkConfig, option.name)
  ])
}

/* -----------------------------
   通用选项渲染（颜色风格类）
-------------------------------- */
function renderColor(option: any): VNode {
  const darkConfig = isDark.value ? { style: { color: '#ffffff' } } : {}
  return h('div', { class: 'flex items-center gap-x-8' }, [
    h('div', darkConfig, option.name)
  ])
}

/* -----------------------------
   导入 / 导出 / 重置 数据逻辑
-------------------------------- */
interface CacheData {
  data: Category[]
  settings: Settings
}

// 导出本地数据
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

// 导入本地数据
function importData() {
  const inputElement = document.createElement('input')
  inputElement.type = 'file'
  inputElement.accept = '.json'
  inputElement.addEventListener('change', async () => {
    const file = inputElement.files?.[0]
    if (!file) return

    try {
      const jsonStr = await file.text()
      const data = JSON.parse(jsonStr) as CacheData
      if (!data.data || !data.settings) throw new Error('非法的数据文件')
      loadData(data)
      window.$message.success('导入成功', { duration: 2000 })
    } catch (error) {
      window.$message.error('请导入合法的数据文件', { duration: 2000 })
    }
  })
  inputElement.click()
}

// 重置为默认 preset
function resetData() {
  resetStore.title = '重置确认'
  resetStore.content = '是否确认要重置所有设置?'
  resetStore.resetVisible = true
  resetStore.afterCommit = () => router.back()
  resetStore.finishCommit = () => {
    const clonedPreset = JSON.parse(JSON.stringify(preset))
    loadData(clonedPreset as CacheData)
    window.$message.success('重置成功', { duration: 2000 })
  }
}

// 加载数据到 stores
function loadData(data: CacheData) {
  siteStore.setData(data.data)
  settingStore.setSettings(data.settings)
  toggleTheme(data.settings.theme)
  toggleSiteSytle()
  siteStore.cateIndex = 0
  renderStore.refreshSiteGroupList()
}
</script>
