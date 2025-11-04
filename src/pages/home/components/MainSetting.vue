<script setup lang="ts">
import { h, reactive, ref, computed, watch, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import SettingSelection from './SettingSelection.vue'
import ResetModal from './ResetModal.vue'
import { useSettingStore } from '@/stores/setting'
import { useSiteStore } from '@/stores/site'
import { useRenderStore } from '@/stores/render'
import { useResetModalStore } from '@/stores/resetModal'
import { iconStyleList, searchList, themeList, siteStyleList } from '@/utils'
import preset from '@/preset.json'
import router from '@/router'
import { toggleTheme, toggleSiteSytle } from '@/composables/dark'
import type { Settings, Category } from '@/types'

interface CacheData {
  data: Category[]
  settings: Settings
}

const siteStore = useSiteStore()
const settingStore = useSettingStore()
const renderStore = useRenderStore()
const resetStore = useResetModalStore()
const route = useRoute()

// 修复按钮消失问题：生产环境下 route.name 可能 undefined，改为 path 判断
const isSettingRoute = computed(() => route.path.includes('setting'))
watch(isSettingRoute, val => settingStore.isSetting = val, { immediate: true })

/* Theme label 渲染 */
function renderThemeLabel(option: any) {
  const currentTheme = themeList.find(item => item.enName === option.enName)!
  const buttonColor = currentTheme.value.buttonC
  const darkConfig = toggleTheme.value ? { style: { color: '#ffffff' } } : {}
  return h('div', { class: 'flex items-center gap-x-8' }, [
    h('div', { class: 'w-16 h-16 circle border-1 border-fff', style: { backgroundColor: buttonColor } }),
    h('div', darkConfig, option.name)
  ])
}

/* Color label 渲染 */
function renderColor(option: any) {
  const darkConfig = toggleTheme.value ? { style: { color: '#ffffff' } } : {}
  return h('div', { class: 'flex items-center gap-x-8' }, [
    h('div', darkConfig, option.name)
  ])
}

/* 数据操作：导入 / 导出 / 重置 */
function exportData() {
  const data = {
    data: siteStore.data,
    settings: settingStore.settings,
  }
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `COMECOME_Data_${new Date().toLocaleString()}.json`
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
}

function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text) as CacheData
      if (!data.data || !data.settings) throw new Error('非法的数据文件')
      loadData(data)
    } catch {
      window.$message.error('请导入合法的数据文件', { duration: 2000 })
    }
  }
  input.click()
}

function resetData() {
  resetStore.title = '重置确认'
  resetStore.content = '是否确认要重置所有设置?'
  resetStore.resetVisible = true
  resetStore.afterCommit = () => router.back()
  resetStore.finishCommit = () => {
    const data = JSON.parse(JSON.stringify(preset)) as CacheData
    loadData(data)
    window.$message.success('重置成功', { duration: 2000 })
  }
}

function loadData(data: CacheData) {
  siteStore.setData(data.data)
  settingStore.setSettings(data.settings)
  toggleTheme(data.settings.theme)
  toggleSiteSytle()
  siteStore.cateIndex = 0
  renderStore.refreshSiteGroupList()
}
</script>
