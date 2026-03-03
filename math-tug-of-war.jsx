import { useState, useEffect, useCallback, useRef } from "react";

const PULL_CORRECT = 10;
const PULL_WRONG = 3;
const ROUND_TIME = 15;

function generateQuestion() {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    return { a, b, answer: a * b };
}

function StickFigure({ x, bottom, color, facingLeft, lean }) {
    return (
        <svg
            style={{
                position: "absolute",
                bottom: bottom,
                left: `${x}%`,
                transform: `translateX(-50%) rotate(${lean}deg)`,
                transition: "transform 0.4s ease",
                transformOrigin: "bottom center"
            }}
            width="60" height="110" viewBox="0 0 60 110"
        >
            <line x1="30" y1="35" x2="30" y2="75" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="22" r="12" fill={color} />
            {facingLeft ? (
                <>
                    <line x1="30" y1="45" x2="8" y2="58" stroke={color} strokeWidth="4" strokeLinecap="round" />
                    <line x1="30" y1="45" x2="12" y2="38" stroke={color} strokeWidth="4" strokeLinecap="round" />
                </>
            ) : (
                <>
                    <line x1="30" y1="45" x2="52" y2="58" stroke={color} strokeWidth="4" strokeLinecap="round" />
                    <line x1="30" y1="45" x2="48" y2="38" stroke={color} strokeWidth="4" strokeLinecap="round" />
                </>
            )}
            <line x1="30" y1="75" x2="18" y2="105" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <line x1="30" y1="75" x2="42" y2="105" stroke={color} strokeWidth="4" strokeLinecap="round" />
            {facingLeft ? (
                <>
                    <line x1="18" y1="105" x2="6" y2="107" stroke={color} strokeWidth="4" strokeLinecap="round" />
                    <line x1="42" y1="105" x2="30" y2="107" stroke={color} strokeWidth="4" strokeLinecap="round" />
                </>
            ) : (
                <>
                    <line x1="18" y1="105" x2="30" y2="107" stroke={color} strokeWidth="4" strokeLinecap="round" />
                    <line x1="42" y1="105" x2="54" y2="107" stroke={color} strokeWidth="4" strokeLinecap="round" />
                </>
            )}
            <path d={`M18 20 Q18 8 30 8 Q42 8 42 20`} fill={color} opacity="0.6" />
        </svg>
    );
}

function TugScene({ ropePos }) {
    const p1Lean = ropePos > 52 ? -10 : ropePos < 48 ? 8 : 0;
    const p2Lean = ropePos < 48 ? 10 : ropePos > 52 ? -8 : 0;

    return (
        <div style={{ position: "relative", width: "100%", height: 180, overflow: "hidden" }}>
            <div style={{
                position: "absolute", bottom: 20, left: 0, right: 0,
                height: 3, background: "rgba(0,0,0,0.1)", borderRadius: 2
            }} />
            <div style={{
                position: "absolute", bottom: 90, left: "14%", right: "14%",
                height: 6, borderRadius: 3,
                background: "repeating-linear-gradient(90deg, #c9922a 0px, #e8c07d 12px, #c9922a 24px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }} />
            <div style={{
                position: "absolute", bottom: 88,
                left: `calc(14% + ${ropePos * 0.72}%)`,
                transition: "left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                display: "flex", flexDirection: "column", alignItems: "center"
            }}>
                <div style={{
                    width: 22, height: 16,
                    background: ropePos < 46 ? "#4a90d9" : ropePos > 54 ? "#e05a5a" : "#f5a623",
                    clipPath: "polygon(0 0, 100% 20%, 100% 80%, 0 100%)",
                    marginLeft: 3, transition: "background 0.3s",
                    boxShadow: "0 0 6px rgba(0,0,0,0.4)"
                }} />
                <div style={{ width: 3, height: 22, background: "#555", borderRadius: 2 }} />
            </div>
            <div style={{
                position: "absolute", bottom: 20, top: 10, left: "50%",
                width: 2,
                background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 5px, transparent 5px, transparent 10px)",
                transform: "translateX(-50%)"
            }} />
            <StickFigure x={68} bottom={23} color="#e05a5a" facingLeft={true} lean={p1Lean} />
            <StickFigure x={30} bottom={23} color="#4a90d9" facingLeft={false} lean={p2Lean} />
        </div>
    );
}

function NumPad({ value, onChange, onSubmit, onClear, disabled, accentColor }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
                width: "100%", padding: "10px 14px",
                background: "#fff", border: `2px solid ${disabled ? "#ddd" : accentColor}`,
                borderRadius: 8, fontSize: 22, fontWeight: "bold", color: "#222",
                textAlign: "center", minHeight: 46, fontFamily: "'Nunito', sans-serif",
                transition: "border-color 0.2s"
            }}>
                {value || <span style={{ color: "#ccc" }}>0</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <button key={n} disabled={disabled}
                        onClick={() => { if (String(value).length < 4) onChange(String(value === "" ? "" : value) + n); }}
                        style={{
                            padding: "13px 6px", background: disabled ? "#f5f5f5" : "#fff",
                            border: `2px solid ${disabled ? "#eee" : "#ddd"}`,
                            borderRadius: 8, fontSize: 18, fontWeight: "bold",
                            color: disabled ? "#ccc" : "#333", cursor: disabled ? "not-allowed" : "pointer",
                            fontFamily: "'Nunito', sans-serif", transition: "all 0.1s"
                        }}>
                        {n}
                    </button>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                <button disabled={disabled} onClick={onClear} style={{
                    padding: "13px 6px", background: disabled ? "#f5f5f5" : "#e05a5a",
                    border: "none", borderRadius: 8, fontSize: 18, fontWeight: "bold",
                    color: disabled ? "#ccc" : "#fff", cursor: disabled ? "not-allowed" : "pointer",
                    fontFamily: "'Nunito', sans-serif"
                }}>✕</button>
                <button disabled={disabled}
                    onClick={() => { if (String(value).length < 4) onChange(String(value === "" ? "" : value) + "0"); }}
                    style={{
                        padding: "13px 6px", background: disabled ? "#f5f5f5" : "#fff",
                        border: `2px solid ${disabled ? "#eee" : "#ddd"}`,
                        borderRadius: 8, fontSize: 18, fontWeight: "bold",
                        color: disabled ? "#ccc" : "#333", cursor: disabled ? "not-allowed" : "pointer",
                        fontFamily: "'Nunito', sans-serif"
                    }}>0</button>
                <button disabled={disabled} onClick={onSubmit} style={{
                    padding: "13px 6px", background: disabled ? "#f5f5f5" : "#4CAF50",
                    border: "none", borderRadius: 8, fontSize: 18, fontWeight: "bold",
                    color: disabled ? "#ccc" : "#fff", cursor: disabled ? "not-allowed" : "pointer",
                    fontFamily: "'Nunito', sans-serif"
                }}>✓</button>
            </div>
        </div>
    );
}

function PlayerPanel({ name, score, question, accentColor, onSubmit, disabled, flash }) {
    const [input, setInput] = useState("");
    useEffect(() => { setInput(""); }, [question]);

    const handleSubmit = () => {
        if (!input || disabled) return;
        onSubmit(parseInt(input, 10));
        setInput("");
    };

    return (
        <div style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            boxShadow: flash ? `0 0 0 4px ${accentColor}88, 0 4px 24px rgba(0,0,0,0.15)` : "0 4px 20px rgba(0,0,0,0.10)",
            transition: "box-shadow 0.2s",
            display: "flex", flexDirection: "column",
            width: 240, minWidth: 220, position: "relative",
        }}>
            <div style={{
                background: accentColor, padding: "10px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'Nunito', sans-serif" }}>{name}</span>
                <span style={{
                    background: "rgba(255,255,255,0.25)", color: "#fff",
                    borderRadius: 20, padding: "2px 14px", fontWeight: 800, fontSize: 15,
                    fontFamily: "'Nunito', sans-serif"
                }}>{score}</span>
            </div>
            <div style={{ padding: "16px 16px 18px" }}>
                <div style={{
                    fontSize: 28, fontWeight: 900, color: accentColor,
                    fontFamily: "'Nunito', sans-serif", textAlign: "center",
                    marginBottom: 14, letterSpacing: 1,
                    background: accentColor + "12", borderRadius: 10, padding: "10px 0"
                }}>
                    {question ? `${question.a} × ${question.b} = ?` : "—"}
                </div>
                <NumPad
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    onClear={() => setInput("")}
                    disabled={disabled || !question}
                    accentColor={accentColor}
                />
            </div>
            {flash && (
                <div style={{
                    position: "absolute", inset: 0,
                    background: flash === "correct" ? "rgba(76,175,80,0.2)" : "rgba(224,90,90,0.2)",
                    pointerEvents: "none", animation: "flashFade 0.6s ease forwards", borderRadius: 16
                }} />
            )}
            {flash && (
                <div style={{
                    position: "absolute", top: "40%", left: 0, right: 0,
                    textAlign: "center", fontSize: 36,
                    animation: "floatUp 0.7s ease forwards", pointerEvents: "none"
                }}>
                    {flash === "correct" ? "✅" : "❌"}
                </div>
            )}
        </div>
    );
}

export default function App() {
    const [phase, setPhase] = useState("lobby");
    const [ropePos, setRopePos] = useState(50);
    const [scores, setScores] = useState({ p1: 0, p2: 0 });
    const [questions, setQuestions] = useState({ p1: null, p2: null });
    const [answered, setAnswered] = useState({ p1: false, p2: false });
    const [flash, setFlash] = useState({ p1: null, p2: null });
    const [timer, setTimer] = useState(ROUND_TIME);
    const [winner, setWinner] = useState(null);
    const [names, setNames] = useState({ p1: "1st Team", p2: "2nd Team" });
    const timerRef = useRef(null);
    const gameOverRef = useRef(false);

    const triggerFlash = (player, type) => {
        setFlash(f => ({ ...f, [player]: type }));
        setTimeout(() => setFlash(f => ({ ...f, [player]: null })), 800);
    };

    const newRound = useCallback(() => {
        const q1 = generateQuestion();
        const q2 = generateQuestion();
        setQuestions({ p1: q1, p2: q2 });
        setAnswered({ p1: false, p2: false });
        setTimer(ROUND_TIME);
    }, []);

    const handleAnswer = (player, val) => {
        if (gameOverRef.current) return;
        setAnswered(prev => {
            if (prev[player]) return prev;
            return { ...prev, [player]: true };
        });

        const q = player === "p1" ? questions.p1 : questions.p2;
        if (!q) return;
        const correct = val === q.answer;
        triggerFlash(player, correct ? "correct" : "wrong");
        if (correct) setScores(s => ({ ...s, [player]: s[player] + 1 }));

        setRopePos(rp => {
            const delta = correct
                ? (player === "p1" ? PULL_CORRECT : -PULL_CORRECT)
                : (player === "p1" ? -PULL_WRONG : PULL_WRONG);
            const next = Math.max(5, Math.min(95, rp + delta));
            if (next >= 88 && !gameOverRef.current) {
                gameOverRef.current = true;
                setTimeout(() => { setWinner("p1"); setPhase("gameover"); }, 500);
            } else if (next <= 12 && !gameOverRef.current) {
                gameOverRef.current = true;
                setTimeout(() => { setWinner("p2"); setPhase("gameover"); }, 500);
            }
            return next;
        });
    };

    useEffect(() => {
        if (phase !== "playing") return;
        timerRef.current = setInterval(() => {
            setTimer(t => {
                if (t <= 1) { newRound(); return ROUND_TIME; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase, newRound]);

    useEffect(() => {
        if (answered.p1 && answered.p2 && phase === "playing") {
            const t = setTimeout(newRound, 900);
            return () => clearTimeout(t);
        }
    }, [answered, newRound, phase]);

    const startGame = () => {
        gameOverRef.current = false;
        setScores({ p1: 0, p2: 0 });
        setRopePos(50);
        setWinner(null);
        setPhase("playing");
        newRound();
    };

    const timerColor = timer <= 5 ? "#e05a5a" : timer <= 9 ? "#f5a623" : "#4a90d9";

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #daeeff 0%, #b8d9f5 100%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "20px 12px",
            fontFamily: "'Nunito', sans-serif",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
        @keyframes flashFade { 0%{opacity:1} 100%{opacity:0} }
        @keyframes floatUp { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-50px) scale(1.4)} }
        @keyframes popIn { 0%{transform:scale(0.6);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes timerPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        * { box-sizing: border-box; }
        button:hover:not(:disabled) { filter: brightness(1.06); }
        button:active:not(:disabled) { transform: scale(0.97) !important; }
      `}</style>

            <div style={{
                fontSize: 24, fontWeight: 900, color: "#1a5fa8",
                letterSpacing: 1, marginBottom: 18, textAlign: "center",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                TUG: A MATHEMATICAL GAME
            </div>

            {phase === "lobby" && (
                <div style={{
                    background: "#fff", borderRadius: 20, padding: "36px 44px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
                    maxWidth: 400, width: "100%"
                }}>
                    <div style={{ display: "flex", gap: 14, width: "100%" }}>
                        {[{ key: "p1", label: "1st Team", color: "#e05a5a" }, { key: "p2", label: "2nd Team", color: "#4a90d9" }].map(p => (
                            <div key={p.key} style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: p.color, marginBottom: 6 }}>{p.label}</div>
                                <input value={names[p.key]}
                                    onChange={e => setNames(n => ({ ...n, [p.key]: e.target.value.slice(0, 14) }))}
                                    style={{
                                        width: "100%", padding: "9px 10px",
                                        border: `2px solid ${p.color}66`, borderRadius: 9,
                                        fontSize: 13, fontWeight: 700, color: p.color,
                                        fontFamily: "'Nunito', sans-serif", outline: "none",
                                        background: p.color + "0f"
                                    }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: 13, color: "#999", textAlign: "center", lineHeight: 1.9 }}>
                        Two players compete side by side.<br />
                        Answer correctly to pull the rope! 🏆
                    </div>
                    <button onClick={startGame} style={{
                        background: "linear-gradient(135deg, #1a73e8, #1a5fa8)",
                        color: "#fff", border: "none", borderRadius: 12,
                        padding: "15px 44px", fontSize: 17, fontWeight: 900,
                        cursor: "pointer", boxShadow: "0 4px 16px rgba(26,115,232,0.35)",
                        fontFamily: "'Nunito', sans-serif",
                    }}>▶ START GAME</button>
                </div>
            )}

            {phase === "playing" && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, width: "100%", maxWidth: 860, justifyContent: "center" }}>
                    {/* P2 left */}
                    <PlayerPanel
                        name={names.p2} score={scores.p2} question={questions.p2}
                        accentColor="#4a90d9"
                        onSubmit={(v) => handleAnswer("p2", v)}
                        disabled={answered.p2} flash={flash.p2}
                    />

                    {/* Center */}
                    <div style={{
                        flex: 1, minWidth: 240, maxWidth: 340,
                        background: "#fff", borderRadius: 16,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.10)", padding: "14px 12px",
                        display: "flex", flexDirection: "column", alignItems: "center"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 6, fontSize: 13, fontWeight: 800 }}>
                            <span style={{ color: "#4a90d9" }}>
                                {names.p2} <span style={{
                                    background: "#4a90d9", color: "#fff",
                                    borderRadius: 20, padding: "1px 11px", fontSize: 13, marginLeft: 4
                                }}>{scores.p2}</span>
                            </span>
                            <span style={{ color: "#e05a5a" }}>
                                <span style={{
                                    background: "#e05a5a", color: "#fff",
                                    borderRadius: 20, padding: "1px 11px", fontSize: 13, marginRight: 4
                                }}>{scores.p1}</span>
                                {names.p1}
                            </span>
                        </div>

                        <div style={{
                            fontSize: 20, fontWeight: 900, color: timerColor,
                            background: timerColor + "18", borderRadius: 30, padding: "4px 20px",
                            marginBottom: 2, fontFamily: "'Nunito', sans-serif",
                            animation: timer <= 5 ? "timerPulse 0.5s ease infinite" : "none",
                            transition: "color 0.3s"
                        }}>
                            {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                        </div>

                        <TugScene ropePos={ropePos} />

                        {/* Progress bar */}
                        <div style={{
                            width: "92%", height: 12, background: "#eee",
                            borderRadius: 10, overflow: "hidden", marginTop: 4, position: "relative"
                        }}>
                            <div style={{
                                position: "absolute", left: 0, top: 0, bottom: 0,
                                width: `${ropePos}%`,
                                background: `linear-gradient(90deg, #4a90d9 0%, #4a90d9 ${50 / ropePos * 100}%, #e05a5a 100%)`,
                                transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)", borderRadius: 10,
                            }} />
                            <div style={{
                                position: "absolute", left: "50%", top: 0, bottom: 0,
                                width: 3, background: "#fff", transform: "translateX(-50%)"
                            }} />
                        </div>
                        <div style={{
                            display: "flex", justifyContent: "space-between", width: "92%",
                            marginTop: 5, fontSize: 10, color: "#aaa", fontWeight: 700
                        }}>
                            <span>◀ {names.p2}</span><span>{names.p1} ▶</span>
                        </div>
                    </div>

                    {/* P1 right */}
                    <PlayerPanel
                        name={names.p1} score={scores.p1} question={questions.p1}
                        accentColor="#e05a5a"
                        onSubmit={(v) => handleAnswer("p1", v)}
                        disabled={answered.p1} flash={flash.p1}
                    />
                </div>
            )}

            {phase === "gameover" && (
                <div style={{
                    background: "#fff", borderRadius: 24, padding: "44px 60px",
                    boxShadow: "0 12px 48px rgba(0,0,0,0.14)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
                    animation: "popIn 0.4s ease", textAlign: "center", maxWidth: 400
                }}>
                    <div style={{ fontSize: 52 }}>🏆</div>
                    <div style={{
                        fontSize: 28, fontWeight: 900,
                        color: winner === "p1" ? "#e05a5a" : "#4a90d9",
                    }}>
                        {winner === "p1" ? names.p1 : names.p2}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#aaa", marginTop: -10 }}>WINS THE TUG!</div>

                    <div style={{
                        display: "flex", gap: 32, padding: "14px 28px",
                        background: "#f7f7f7", borderRadius: 14, margin: "4px 0"
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#4a90d9", marginBottom: 4 }}>{names.p2}</div>
                            <div style={{ fontSize: 30, fontWeight: 900 }}>{scores.p2}</div>
                        </div>
                        <div style={{ fontSize: 20, color: "#ddd", alignSelf: "center" }}>vs</div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#e05a5a", marginBottom: 4 }}>{names.p1}</div>
                            <div style={{ fontSize: 30, fontWeight: 900 }}>{scores.p1}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={startGame} style={{
                            background: "linear-gradient(135deg, #1a73e8, #1a5fa8)",
                            color: "#fff", border: "none", borderRadius: 11,
                            padding: "13px 30px", fontSize: 15, fontWeight: 900,
                            cursor: "pointer", fontFamily: "'Nunito', sans-serif"
                        }}>▶ PLAY AGAIN</button>
                        <button onClick={() => setPhase("lobby")} style={{
                            background: "#f0f0f0", color: "#999", border: "none",
                            borderRadius: 11, padding: "13px 22px", fontSize: 13, fontWeight: 700,
                            cursor: "pointer", fontFamily: "'Nunito', sans-serif"
                        }}>MENU</button>
                    </div>
                </div>
            )}
        </div>
    );
}
