const KEY = 'nolteo-v1'

const empty = () => ({
  clicks: {},
  posts: [],
  reviews: {},
  extras: [],
  prompts: [],
  tips: [],
})

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    return { ...empty(), ...JSON.parse(raw) }
  } catch {
    return empty()
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function bumpClick(state, id) {
  const prev = state.clicks[id] || { day: 0, week: 0, month: 0, all: 0 }
  const next = {
    day: prev.day + 1,
    week: prev.week + 1,
    month: prev.month + 1,
    all: prev.all + 1,
  }
  return { ...state, clicks: { ...state.clicks, [id]: next } }
}

export function statOf(item, period, state) {
  const extra = state.clicks[item.id]?.[period] || 0
  return (item.stats?.[period] || 0) + extra
}

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}
