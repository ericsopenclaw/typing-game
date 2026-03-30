import { useState, useEffect, useRef } from 'react'

const WORDS = [
  'algorithm', 'database', 'interface', 'framework', 'compiler',
  'debugging', 'function', 'variable', 'recursive', 'asynchronous',
  'javascript', 'react', 'typescript', 'nodejs', 'deployment',
  'cloudflare', 'vercel', 'github', 'docker', 'kubernetes'
]

function App() {
  const [word, setWord] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [wpm, setWpm] = useState(0)
  const inputRef = useRef(null)

  const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)]

  const startGame = () => {
    setWord(pickWord())
    setScore(0)
    setLives(3)
    setGameOver(false)
    setStarted(true)
    setTimeLeft(30)
    setWpm(0)
    setInput('')
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!started || gameOver) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setGameOver(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [started, gameOver])

  useEffect(() => {
    if (started && !gameOver && timeLeft > 0) {
      setWpm(Math.round(score / ((30 - timeLeft) / 60) || 0))
    }
  }, [score, timeLeft, started, gameOver])

  const handleInput = (e) => {
    const val = e.target.value
    setInput(val)
    if (val === word) {
      setScore(s => s + 1)
      setWord(pickWord())
      setInput('')
    } else if (!word.startsWith(val)) {
      setLives(l => { const nl = l - 1; if (nl <= 0) setGameOver(true); return Math.max(0, nl) })
      setInput('')
    }
  }

  if (!started) return (
    <div className="app typing-game">
      <div className="card">
        <h1>⌨️ 打字遊戲</h1>
        <p className="subtitle">測試你的打字速度！</p>
        <ul className="rules">
          <li>⏱️ 30 秒限時挑戰</li>
          <li>🎯 正確輸入單字得分</li>
          <li>❌ 輸入錯誤扣生命</li>
          <li>💀 三條命，用完遊戲結束</li>
        </ul>
        <button className="btn" onClick={startGame}>開始遊戲</button>
      </div>
    </div>
  )

  return (
    <div className="app typing-game">
      <div className="stats">
        <span>❤️ {lives}</span>
        <span>⏱️ {timeLeft}s</span>
        <span>🏆 {score} 分</span>
        <span>⚡ {wpm} WPM</span>
      </div>
      <div className="card">
        {gameOver ? (
          <div className="gameover">
            <h2>遊戲結束！</h2>
            <p>最終得分：<strong>{score}</strong></p>
            <p>最高速度：<strong>{wpm} WPM</strong></p>
            <button className="btn" onClick={startGame}>再玩一次</button>
          </div>
        ) : (
          <>
            <div className="word-display">
              {word.split('').map((ch, i) => (
                <span key={i} className={i < input.length ? (input[i] === ch ? 'correct' : 'wrong') : ''}>{ch}</span>
              ))}
            </div>
            <input
              ref={inputRef}
              className="type-input"
              value={input}
              onChange={handleInput}
              autoFocus
              placeholder="開始打字..."
            />
            <p className="hint">輸入上方的單字然後按 Enter 或自動匹配</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
