import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { categories, items as seedItems, seedPosts, seedPrompts, seedTips } from './data'
import { bumpClick, loadState, saveState, statOf, uid } from './store'

const client = import.meta.env.VITE_ADSENSE_CLIENT

function useYard() {
  const [state, setState] = useState(loadState)
  useEffect(() => { saveState(state) }, [state])
  const catalog = useMemo(() => [...seedItems, ...state.extras], [state.extras])
  return { state, setState, catalog }
}

function AdSlot({ label = '광고 자리' }) {
  useEffect(() => {
    if (!client) return
    const exist = document.querySelector('script[data-adsense]')
    if (!exist) {
      const s = document.createElement('script')
      s.async = true
      s.dataset.adsense = '1'
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
      s.crossOrigin = 'anonymous'
      document.head.appendChild(s)
    }
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch { /* 슬롯 준비 전 */ }
  }, [])
  if (!client) {
    return (
      <aside className="ad-slot">
        <div>{label}<small>승인 후 VITE_ADSENSE_CLIENT를 넣으면 이 칸이 광고로 바뀝니다.</small></div>
      </aside>
    )
  }
  return (
    <aside className="ad-slot">
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={client} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  )
}

function Shell({ children }) {
  return (
    <div className="shell">
      <header className="top">
        <Link to="/" className="brand">
          <img src="/mark.jpg" alt="" />
          <div>
            <strong>놀터</strong>
            <span>킬링타임 놀이터</span>
          </div>
        </Link>
        <nav className="nav">
          <NavLink to="/" end>놀이</NavLink>
          <NavLink to="/rank">랭킹</NavLink>
          <NavLink to="/board">게시판</NavLink>
          <NavLink to="/prompts">프롬프트</NavLink>
          <NavLink to="/tips">팁</NavLink>
          <NavLink to="/share">올리기</NavLink>
        </nav>
      </header>
      <main className="wrap">{children}</main>
      <footer className="site">
        <span>놀터 · 심심할 때 들어오는 링크와 짧은 놀이</span>
        <span>
          <Link to="/privacy">개인정보처리방침</Link>
          {' · '}
          <Link to="/about">광고 안내</Link>
        </span>
      </footer>
    </div>
  )
}

function Card({ item, rank, onOpen }) {
  return (
    <article className="card">
      <div className="meta">
        <span>{categories.find((c) => c.id === item.category)?.label}</span>
        {rank ? <span className="stamp">{rank}위</span> : <span>{item.kind}</span>}
      </div>
      <h3>{item.title}</h3>
      <p>{item.blurb}</p>
      <div className="tags">{(item.tags || []).map((t) => <span key={t}>{t}</span>)}</div>
      <div className="row">
        <span className="muted">오늘 {item.day.toLocaleString()}회</span>
        <button className="btn small" onClick={() => onOpen(item)}>들어가기</button>
      </div>
    </article>
  )
}

function Home() {
  const { state, setState, catalog } = useYard()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const navigate = useNavigate()
  const scored = catalog.map((item) => ({ ...item, day: statOf(item, 'day', state) }))
  const filtered = scored.filter((item) => (cat === 'all' || item.category === cat) && `${item.title} ${item.blurb}`.includes(q))
  const top = [...scored].sort((a, b) => b.day - a.day).slice(0, 3)

  function open(item) {
    setState((s) => bumpClick(s, item.id))
    if (item.href.startsWith('/')) navigate(item.href)
    else window.open(item.href, '_blank', 'noopener')
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">KILLING TIME</div>
          <h1>심심하면<br />여기로.</h1>
          <p>다른 사람이 만든 웹, 짧은 게임, 심리테스트, 낙서, 계산기를 모아 둔다. 들어간 횟수로 오늘·이번 주·이번 달 순위를 매긴다.</p>
          <div className="search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="게임, 테스트, 계산기..." />
          </div>
        </div>
        <aside className="hero-side">
          <img src="/mark.jpg" alt="놀터 마크" />
          <div>
            <b>오늘의 1위</b>
            <div>{top[0]?.title}</div>
            <div className="muted">클릭 {top[0]?.day.toLocaleString()}회</div>
          </div>
        </aside>
      </section>
      <AdSlot label="홈 상단 광고 자리" />
      <div className="chips">
        {categories.map((c) => (
          <button key={c.id} className={cat === c.id ? 'chip on' : 'chip'} onClick={() => setCat(c.id)}>{c.label}</button>
        ))}
      </div>
      <div className="grid">
        {filtered.map((item) => <Card key={item.id} item={item} onOpen={open} />)}
      </div>
      {filtered.length === 0 && <p className="note">찾는 놀이가 없다. 올리기에서 링크를 넣으면 이 브라우저 목록에 바로 붙는다.</p>}
    </>
  )
}

function Rank() {
  const { state, setState, catalog } = useYard()
  const [period, setPeriod] = useState('day')
  const navigate = useNavigate()
  const rows = catalog
    .map((item) => ({ ...item, score: statOf(item, period, state) }))
    .sort((a, b) => b.score - a.score)
  const label = { day: '오늘', week: '이번 주', month: '이번 달', all: '전체' }

  function open(item) {
    setState((s) => bumpClick(s, item.id))
    if (item.href.startsWith('/')) navigate(item.href)
    else window.open(item.href, '_blank', 'noopener')
  }

  return (
    <>
      <h1>인기 놀이</h1>
      <p className="note">기본 수치는 예시 트래픽이고, 이 브라우저에서 누른 클릭이 더해진다. 사람마다 같은 순위를 보려면 다음 단계에서 서버 카운터를 붙인다.</p>
      <div className="tabs">
        {Object.entries(label).map(([id, name]) => (
          <button key={id} className={period === id ? 'chip on' : 'chip'} onClick={() => setPeriod(id)}>{name}</button>
        ))}
      </div>
      <div className="list">
        {rows.map((item, i) => (
          <article key={item.id} className="rank">
            <b>{i + 1}</b>
            <div>
              <strong>{item.title}</strong>
              <div className="muted">{item.blurb}</div>
            </div>
            <div>
              <div>{item.score.toLocaleString()}회</div>
              <button className="btn small" onClick={() => open(item)}>들어가기</button>
            </div>
          </article>
        ))}
      </div>
      <AdSlot label="랭킹 하단 광고 자리" />
    </>
  )
}

function Board() {
  const { state, setState } = useYard()
  const posts = [...state.posts, ...seedPosts].sort((a, b) => new Date(b.created) - new Date(a.created))
  const [form, setForm] = useState({ nick: '', tag: '잡담', title: '', body: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    const post = { ...form, nick: form.nick || '익명', id: uid('p'), created: new Date().toISOString(), comments: [] }
    setState((s) => ({ ...s, posts: [post, ...s.posts] }))
    setForm({ nick: '', tag: '잡담', title: '', body: '' })
  }

  return (
    <div className="split">
      <section>
        <h1>익명 게시판</h1>
        <p className="note">로그인 없다. 글은 이 브라우저에 남고, 예시 글은 모두에게 같다.</p>
        {posts.map((post) => (
          <Link key={post.id} to={`/board/${post.id}`} className="post">
            <div className="muted">{post.tag} · {post.nick}</div>
            <h3>{post.title}</h3>
            <p>{post.body.slice(0, 90)}</p>
            <div className="muted">댓글 {post.comments.length}</div>
          </Link>
        ))}
      </section>
      <form className="panel form" onSubmit={submit}>
        <h2>글쓰기</h2>
        <label className="field"><span>별명</span><input value={form.nick} onChange={(e) => setForm({ ...form, nick: e.target.value })} placeholder="비우면 익명" /></label>
        <label className="field"><span>분류</span>
          <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
            {['잡담', '홍보', '리뷰', '질문', '팁'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="field"><span>제목</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label className="field"><span>내용</span><textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
        <button className="btn" type="submit">올리기</button>
      </form>
    </div>
  )
}

function Post() {
  const { id } = useParams()
  const { state, setState } = useYard()
  const posts = [...state.posts, ...seedPosts]
  const post = posts.find((p) => p.id === id)
  const [nick, setNick] = useState('')
  const [body, setBody] = useState('')
  if (!post) return <p>글이 없다.</p>

  function comment(e) {
    e.preventDefault()
    if (!body.trim()) return
    const next = { id: uid('c'), nick: nick || '익명', body, created: new Date().toISOString() }
    if (String(id).startsWith('p-')) {
      setState((s) => ({
        ...s,
        posts: s.posts.map((p) => p.id === id ? { ...p, comments: [...p.comments, next] } : p),
      }))
    } else {
      const cloned = { ...post, id: uid('p'), comments: [...post.comments, next] }
      setState((s) => ({ ...s, posts: [cloned, ...s.posts] }))
    }
    setBody('')
  }

  return (
    <article className="panel">
      <Link to="/board" className="muted">게시판으로</Link>
      <div className="muted">{post.tag} · {post.nick}</div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <h3>의견 {post.comments.length}</h3>
      {post.comments.map((c) => (
        <div key={c.id} className="post"><b>{c.nick}</b><p>{c.body}</p></div>
      ))}
      <form className="form" onSubmit={comment}>
        <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="별명" />
        <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="한 줄 리뷰" />
        <button className="btn" type="submit">달기</button>
      </form>
    </article>
  )
}

function ItemPage() {
  const { id } = useParams()
  const { state, setState, catalog } = useYard()
  const item = catalog.find((x) => x.id === id)
  const [nick, setNick] = useState('')
  const [text, setText] = useState('')
  const [score, setScore] = useState(5)
  if (!item) return <p>없는 놀이다.</p>
  const reviews = state.reviews[id] || []

  function add(e) {
    e.preventDefault()
    if (!text.trim()) return
    const review = { id: uid('r'), nick: nick || '익명', text, score, created: new Date().toISOString() }
    setState((s) => ({ ...s, reviews: { ...s.reviews, [id]: [review, ...(s.reviews[id] || [])] } }))
    setText('')
  }

  return (
    <article className="panel">
      <div className="muted">{item.kind} · 오늘 {statOf(item, 'day', state).toLocaleString()}회</div>
      <h1>{item.title}</h1>
      <p>{item.blurb}</p>
      <p><a className="btn" href={item.href} target="_blank" rel="noreferrer" onClick={() => setState((s) => bumpClick(s, item.id))}>사이트로 이동</a></p>
      <h3>리뷰</h3>
      {reviews.length === 0 && <p className="note">아직 이 브라우저에 리뷰가 없다.</p>}
      {reviews.map((r) => <div key={r.id} className="post"><b>{r.nick} · {r.score}점</b><p>{r.text}</p></div>)}
      <form className="form" onSubmit={add}>
        <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="별명" />
        <select value={score} onChange={(e) => setScore(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}점</option>)}
        </select>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="해본 느낌" />
        <button className="btn" type="submit">리뷰 남기기</button>
      </form>
    </article>
  )
}

function Share() {
  const { setState } = useYard()
  const [form, setForm] = useState({ title: '', href: '', blurb: '', category: 'made', github: '' })
  const [done, setDone] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.href.trim()) return
    const item = {
      id: uid('mine'),
      title: form.title,
      href: form.href,
      blurb: form.blurb || '직접 올린 놀이',
      category: 'made',
      kind: '외부',
      tags: ['내가 만든 것', form.github ? '깃허브' : '링크'].filter(Boolean),
      github: form.github,
      stats: { day: 0, week: 0, month: 0, all: 0 },
    }
    setState((s) => ({ ...s, extras: [item, ...s.extras] }))
    setDone(true)
  }

  return (
    <form className="panel form" onSubmit={submit}>
      <h1>만든 것 올리기</h1>
      <p className="note">앱, 웹, 테스트, 도구 링크를 올린다. 지금은 이 브라우저 목록과 랭킹에 바로 붙는다.</p>
      <label className="field"><span>이름</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
      <label className="field"><span>주소</span><input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="https://" /></label>
      <label className="field"><span>한 줄</span><input value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} /></label>
      <label className="field"><span>깃허브</span><input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="없으면 비워 둠" /></label>
      <button className="btn" type="submit">목록에 넣기</button>
      {done && <p>넣었다. 홈의 ‘내가 만든 것’에서 보인다.</p>}
    </form>
  )
}

function Prompts() {
  const { state, setState } = useYard()
  const prompts = [...state.prompts, ...seedPrompts]
  const [form, setForm] = useState({ title: '', model: '범용', body: '', nick: '' })
  const [copied, setCopied] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    setState((s) => ({ ...s, prompts: [{ ...form, nick: form.nick || '익명', id: uid('pr') }, ...s.prompts] }))
    setForm({ title: '', model: '범용', body: '', nick: '' })
  }

  return (
    <div className="split">
      <section>
        <h1>AI 프롬프트</h1>
        {prompts.map((p) => (
          <article key={p.id} className="post">
            <div className="muted">{p.model} · {p.nick}</div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <button className="btn-ghost small" onClick={() => { navigator.clipboard.writeText(p.body); setCopied(p.id) }}>{copied === p.id ? '복사됨' : '복사'}</button>
          </article>
        ))}
      </section>
      <form className="panel form" onSubmit={submit}>
        <h2>프롬프트 붙이기</h2>
        <input value={form.nick} onChange={(e) => setForm({ ...form, nick: e.target.value })} placeholder="별명" />
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="제목" />
        <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="모델" />
        <textarea rows={7} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="프롬프트" />
        <button className="btn" type="submit">공유</button>
      </form>
    </div>
  )
}

function Tips() {
  const { state, setState } = useYard()
  const tips = [...state.tips, ...seedTips]
  const [form, setForm] = useState({ title: '', body: '', github: '', nick: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    setState((s) => ({ ...s, tips: [{ ...form, nick: form.nick || '익명', id: uid('t') }, ...s.tips] }))
    setForm({ title: '', body: '', github: '', nick: '' })
  }

  return (
    <div className="split">
      <section>
        <h1>개발 팁 · 깃허브</h1>
        {tips.map((t) => (
          <article key={t.id} className="post">
            <div className="muted">{t.nick}</div>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            {t.github && <a href={t.github} target="_blank" rel="noreferrer">저장소 열기</a>}
          </article>
        ))}
      </section>
      <form className="panel form" onSubmit={submit}>
        <h2>팁 남기기</h2>
        <input value={form.nick} onChange={(e) => setForm({ ...form, nick: e.target.value })} placeholder="별명" />
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="제목" />
        <textarea rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="깃허브 주소" />
        <button className="btn" type="submit">공유</button>
      </form>
    </div>
  )
}

function ReactPlay() {
  const [phase, setPhase] = useState('idle')
  const [ms, setMs] = useState(null)
  const start = useRef(0)
  const timer = useRef(0)

  function begin() {
    setPhase('wait')
    setMs(null)
    const delay = 800 + Math.random() * 2200
    timer.current = setTimeout(() => { start.current = performance.now(); setPhase('go') }, delay)
  }
  function hit() {
    if (phase === 'wait') {
      clearTimeout(timer.current)
      setPhase('early')
      return
    }
    if (phase === 'go') {
      setMs(Math.round(performance.now() - start.current))
      setPhase('done')
    }
  }
  return (
    <section>
      <h1>반응속도</h1>
      <div className="play">
        {phase === 'idle' && <button className="wait" onClick={begin}>시작</button>}
        {phase === 'wait' && <button className="wait" onClick={hit}>기다리기</button>}
        {phase === 'go' && <button className="go" onClick={hit}>지금</button>}
        {phase === 'early' && <div><p>너무 빨랐다.</p><button className="btn" onClick={begin}>다시</button></div>}
        {phase === 'done' && <div><p style={{ fontSize: 56, margin: 0 }}>{ms}ms</p><button className="btn" onClick={begin}>한 판 더</button></div>}
      </div>
    </section>
  )
}

function DrawPlay() {
  const ref = useRef(null)
  const drawing = useRef(false)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2
      ctx.scale(2, 2)
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#16130f'
    }
    resize()
  }, [])
  function pos(e) {
    const r = ref.current.getBoundingClientRect()
    const p = e.touches ? e.touches[0] : e
    return { x: p.clientX - r.left, y: p.clientY - r.top }
  }
  function down(e) { drawing.current = true; const ctx = ref.current.getContext('2d'); const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y) }
  function move(e) { if (!drawing.current) return; const ctx = ref.current.getContext('2d'); const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke() }
  return (
    <section>
      <h1>낙서장</h1>
      <canvas ref={ref} className="board" onPointerDown={down} onPointerMove={move} onPointerUp={() => { drawing.current = false }} />
      <p className="note">이 탭을 벗어나면 그림은 지워진다.</p>
    </section>
  )
}

function CalcPlay() {
  const [expr, setExpr] = useState('0')
  function press(key) {
    if (key === 'C') return setExpr('0')
    if (key === '=') {
      try { setExpr(String(Function(`"use strict"; return (${expr})`)())) } catch { setExpr('오류') }
      return
    }
    setExpr((v) => v === '0' || v === '오류' ? key : v + key)
  }
  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+', '=']
  return (
    <section>
      <h1>주머니 계산기</h1>
      <div className="calc-grid">
        <div className="calc-screen">{expr}</div>
        {keys.map((k) => <button key={k} onClick={() => press(k)} style={k === '=' ? { gridColumn: 'span 4', background: '#f0c423' } : undefined}>{k}</button>)}
      </div>
    </section>
  )
}

function MinutePlay() {
  const [left, setLeft] = useState(60)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on) return undefined
    const id = setInterval(() => setLeft((n) => (n <= 1 ? 0 : n - 1)), 1000)
    return () => clearInterval(id)
  }, [on])
  return (
    <section>
      <h1>1분 숨고르기</h1>
      <div className="play">
        <div>
          <div style={{ fontSize: 72, fontFamily: 'Black Han Sans, sans-serif' }}>{left}</div>
          <button className="btn" onClick={() => { setLeft(60); setOn(true) }}>{on && left > 0 ? '다시' : '시작'}</button>
        </div>
      </div>
    </section>
  )
}

function Privacy() {
  return (
    <article className="panel">
      <h1>개인정보처리방침</h1>
      <p>놀터는 회원 가입을 받지 않는다. 글, 리뷰, 클릭 수는 이용자 브라우저의 localStorage에 저장되며 서버로 전송하지 않는다.</p>
      <p>외부 사이트로 이동하면 그 사이트의 정책이 적용된다. 광고를 켜면 구글 등 광고 사업자가 쿠키와 광고 식별자를 사용할 수 있다. 광고 개인화는 구글 광고 설정에서 끌 수 있다.</p>
      <p>문의가 필요하면 사이트 운영자 연락처를 이 문단에 추가한다.</p>
    </article>
  )
}

function About() {
  return (
    <article className="panel">
      <h1>광고 안내</h1>
      <p>광고 칸은 비어 있다. Vercel 환경변수 <b>VITE_ADSENSE_CLIENT</b>에 퍼블리셔 ID(ca-pub-...)를 넣고 다시 배포하면 홈과 랭킹의 슬롯이 애드센스 코드로 바뀐다.</p>
      <p>public/ads.txt의 예시 줄을 본인 퍼블리셔 줄로 교체한다. 개인 도메인을 연결한 뒤 심사에 넣는 편이 안전하다.</p>
      <AdSlot label="안내 페이지 광고 자리" />
    </article>
  )
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/:id" element={<Post />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/share" element={<Share />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/play/react" element={<ReactPlay />} />
        <Route path="/play/draw" element={<DrawPlay />} />
        <Route path="/play/calc" element={<CalcPlay />} />
        <Route path="/play/minute" element={<MinutePlay />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Shell>
  )
}
