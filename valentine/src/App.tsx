import React, { useState, useEffect, useRef } from 'react';
import { Heart, Gift, Camera, Mail, Volume2, VolumeX, RotateCcw, X, PartyPopper, Sparkles, PenTool, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import pic1 from './assets/a.jpeg';
import pic2 from './assets/b.jpeg';
import pic3 from './assets/c.jpeg';
import pic4 from './assets/d.jpeg';
import pic5 from './assets/e.jpeg';
import pic6 from './assets/f.jpeg';
// Romantic Track URL
const ROMANTIC_MUSIC_URL = "https://cdn.pixabay.com/download/audio/2026/02/07/audio_8bc4388f1e.mp3?filename=u_3zb5voh957-be-my-valentine-480893.mp3";

// High-quality placeholder assets for memories
// 

const PHOTO_ASSETS = [
  pic1,
  pic2,
  pic3,
  pic4,
  pic5,
  pic6
];


const PHOTO_CAPTIONS = [
"The day my heart found its forever person ❤️.", 
"Even sunsets get jealous of your glow 🌅✨.",
"That smile… the reason behind my happiness😊💓." ,
"Every moment with you becomes my favorite memory📸💕.", 
"In the little moments with you, I find the biggest happiness🫶." ,
"Your eyes hold the story of my forever👀❤️." 
];

// Marathi Question List for Gift 4
const LOVE_QUESTIONS = [
  { id: 'q1', text: "तुला नक्की कोणत्या क्षणी असं वाटलं की मीच तुझ्यासाठी 'तो' खास माणूस आहे? ❤️" },
  { id: 'q2', text: "माझी अशी कोणती छोटी गोष्ट आहे जी तुझ्या चेहऱ्यावर नेहमी हसू आणते? 😊" },
  { id: 'q3', text: "जर आपण आत्ता जगात कुठेही उडून जाऊ शकलो, तर आपण कुठे जाऊ? ✈️" },
  { id: 'q4', text: "आपली अशी कोणती 'ड्रीम डेट' आहे जी अजून आपण पूर्ण केलेली नाही? 🌹" },
  { id: 'q5', text: "मी तुला प्रामाणिकपणे एक विचारू का? मी तुझ्यासाठी नक्की कोण आहे? 🥺" },
  { id: 'q6', text: "तुला माझ्याबद्दल मैत्रीपेक्षा काहीतरी जास्त कधी वाटलं आहे का? ✨" },
  { id: 'q7', text: "तुला वाटतं का की भविष्यात आपण मित्र-मैत्रिणीपेक्षा जास्त काही असू शकतो? 💍" },
  { id: 'q8', text: "तू मला खूप आवडतेस... पण मला तुझ्या मनात माझ्याबद्दल नक्की काय भावना आहेत ते जाणून घ्यायचंय? 💓" },
  { id: 'q9', text: "मी माझ्या आयुष्यात पुढे जावं की अजूनही तुझी वाट पाहत राहावं? 🏹" }
];

const WHEEL_SEGMENTS = [
  { text: "Kiss Me! 💋", color: "#FF1493", secondary: "#C71585", emoji: "💋" },
  { text: "Hug Time! 🤗", color: "#FF69B4", secondary: "#FF1493", emoji: "🤗" },
  { text: "Date Night! 🌹", color: "#FFB6C1", secondary: "#FF69B4", emoji: "🌹" },
  { text: "Sweet Treats! 🍫", color: "#DB7093", secondary: "#C71585", emoji: "🍫" },
  { text: "Love Song! 🎵", color: "#C71585", secondary: "#8E2DE2", emoji: "🎵" },
  { text: "Cuddle! 🥰", color: "#FF82AB", secondary: "#FF69B4", emoji: "🥰" },
  { text: "Forever! 💍", color: "#FF6EB4", secondary: "#C71585", emoji: "💍" },
  { text: "Adventure! 🌟", color: "#EE82EE", secondary: "#8E2DE2", emoji: "🌟" }
];

const MATCH_PAIR_ICONS = ['❤', '🌹', '💌', '🎁'];
type PairCard = { id: number; value: string; matched?: boolean };
type TttCell = 'X' | 'O' | null;

const getTicTacToeWinner = (board: TttCell[]): 'X' | 'O' | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
};

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [activeGame, setActiveGame] = useState<'menu' | 'pair' | 'ttt'>('menu');
  const [pairCards, setPairCards] = useState<PairCard[]>([]);
  const [flippedPairIndexes, setFlippedPairIndexes] = useState<number[]>([]);
  const [isPairChecking, setIsPairChecking] = useState(false);
  const [tttBoard, setTttBoard] = useState<TttCell[]>(Array(9).fill(null));
  const [tttStatus, setTttStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [showWheelResult, setShowWheelResult] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [letterStage, setLetterStage] = useState('sealed'); // sealed, opening, opened
  const [selectedImage, setSelectedImage] = useState(null);

  // Gift 4 States
  const [journalIndex, setJournalIndex] = useState(0);
  const [journalAnswers, setJournalAnswers] = useState({});
  const [isJournalComplete, setIsJournalComplete] = useState(false);
  const [isQuestionAnimating, setIsQuestionAnimating] = useState(false);

  const [musicEnabled, setMusicEnabled] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: '70%', left: '50%' });
  const [fallingHearts, setFallingHearts] = useState([]);
  const [rotation, setRotation] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '💜', '🧡'];
      const newHeart = {
        id: Date.now(),
        left: Math.random() * 95,
        duration: 5 + Math.random() * 7,
        size: 10 + Math.random() * 30,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
      };
      setFallingHearts(prev => [...prev.slice(-20), newHeart]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (musicEnabled) {
        audioRef.current.play().catch(err => console.log("Music play blocked:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicEnabled]);

  const handleNoHover = () => {
    const randomTop = Math.random() * 60 + 20;
    const randomLeft = Math.random() * 60 + 20;
    setNoButtonPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  const startPairGame = () => {
    const shuffled = [...MATCH_PAIR_ICONS, ...MATCH_PAIR_ICONS]
      .map((value, idx) => ({ id: idx + 1, value }))
      .sort(() => Math.random() - 0.5);
    setPairCards(shuffled);
    setFlippedPairIndexes([]);
    setIsPairChecking(false);
    setActiveGame('pair');
  };

  const handlePairCardClick = (index) => {
    if (isPairChecking) return;
    if (flippedPairIndexes.includes(index)) return;
    if (pairCards[index]?.matched) return;

    if (flippedPairIndexes.length === 0) {
      setFlippedPairIndexes([index]);
      return;
    }

    const firstIndex = flippedPairIndexes[0];
    const firstCard = pairCards[firstIndex];
    const secondCard = pairCards[index];
    if (!firstCard || !secondCard) return;

    const nextFlipped = [firstIndex, index];
    setFlippedPairIndexes(nextFlipped);
    setIsPairChecking(true);

    if (firstCard.value === secondCard.value) {
      const nextCards = pairCards.map((card, cardIndex) =>
        nextFlipped.includes(cardIndex) ? { ...card, matched: true } : card
      );
      setPairCards(nextCards);
      setTimeout(() => {
        setFlippedPairIndexes([]);
        setIsPairChecking(false);
        if (nextCards.every(card => card.matched)) setIsGameComplete(true);
      }, 300);
      return;
    }

    setTimeout(() => {
      setFlippedPairIndexes([]);
      setIsPairChecking(false);
    }, 650);
  };

  const startTicTacToeGame = () => {
    setTttBoard(Array(9).fill(null));
    setTttStatus('playing');
    setActiveGame('ttt');
  };

  const handleTicTacToeClick = (index) => {
    if (tttStatus !== 'playing') return;
    if (tttBoard[index]) return;

    const playerBoard = [...tttBoard];
    playerBoard[index] = 'X';

    const playerWinner = getTicTacToeWinner(playerBoard);
    if (playerWinner === 'X') {
      setTttBoard(playerBoard);
      setTttStatus('won');
      setIsGameComplete(true);
      return;
    }

    const emptyAfterPlayer = playerBoard
      .map((cell, cellIndex) => (cell ? null : cellIndex))
      .filter((cellIndex): cellIndex is number => cellIndex !== null);
    if (emptyAfterPlayer.length === 0) {
      setTttBoard(playerBoard);
      setTttStatus('draw');
      return;
    }

    const randomComputerIndex = emptyAfterPlayer[0];
    const computerBoard = [...playerBoard];
    computerBoard[randomComputerIndex] = 'O';

    const computerWinner = getTicTacToeWinner(computerBoard);
    if (computerWinner === 'O') {
      setTttBoard(computerBoard);
      setTttStatus('lost');
      return;
    }

    if (computerBoard.every(cell => cell)) {
      setTttBoard(computerBoard);
      setTttStatus('draw');
      return;
    }

    setTttBoard(computerBoard);
  };

  const spinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setShowWheelResult(false);
    const segmentCount = WHEEL_SEGMENTS.length;
    const randomIndex = Math.floor(Math.random() * segmentCount);
    const targetSegmentRotation = 360 - (randomIndex * (360 / segmentCount));
    const nextRotation = rotation + (5 * 360) + (360 - (rotation % 360)) + targetSegmentRotation;
    setRotation(nextRotation);
    setTimeout(() => {
      setWheelResult(WHEEL_SEGMENTS[randomIndex]);
      setShowWheelResult(true);
      setWheelSpinning(false);
    }, 4000);
  };

  const handleOpenLetter = () => {
    if (letterStage !== 'sealed') return;
    setLetterStage('opening');
    setTimeout(() => {
      setLetterStage('opened');
    }, 1200);
  };

  const handleNextQuestion = () => {
    const currentId = LOVE_QUESTIONS[journalIndex].id;
    if (!journalAnswers[currentId] || journalAnswers[currentId].trim() === "") return;

    setIsQuestionAnimating(true);
    setTimeout(() => {
      if (journalIndex < LOVE_QUESTIONS.length - 1) {
        setJournalIndex(journalIndex + 1);
        setIsQuestionAnimating(false);
      } else {
        setIsJournalComplete(true);
      }
    }, 400);
  };

  const shareToWhatsApp = () => {
    const myNumber = "917021944056";
    let message = "💝 *Honest Answers from My Heart* 💖\n\n";
    LOVE_QUESTIONS.forEach((q) => {
      const answer = journalAnswers[q.id] || "No answer";
      message += `❓ *${q.text}*\n✨ _${answer}_\n\n`;
    });
    message += "--- Sent with Love ---";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${myNumber}?text=${encodedMessage}`, '_blank');
  };

  const resetSelection = () => {
    setSelectedGift(null);
    setLetterStage('sealed');
    setSelectedImage(null);
    setJournalIndex(0);
    setIsJournalComplete(false);
    setIsQuestionAnimating(false);
  };

  return (
    <div className="app-container">
      <audio ref={audioRef} src={ROMANTIC_MUSIC_URL} loop />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Poppins:wght@300;400;600;800&family=Parisienne&family=Mrs+Saint+Delafield&family=Kalam:wght@300;400;700&display=swap');

        :root {
          --primary-pink: #ff4d94;
          --soft-pink: #fff0f5;
          --accent-pink: #ff1493;
          --deep-rose: #e91e63;
          --glass: rgba(255, 255, 255, 0.88);
          --no-color-text: #64748b;
          --gold-tint: #d4af37;
          --whatsapp-green: #25D366;
          --whatsapp-dark: #128C7E;
        }

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .app-container {
          min-height: 100vh;
          background: #fff;
          font-family: 'Poppins', sans-serif;
          color: #333;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        .bg-canvas {
          position: fixed;
          inset: 0;
          z-index: -2;
          background: linear-gradient(135deg, #fff5f8 0%, #ffffff 50%, #fff0f5 100%);
          overflow: hidden;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: -1;
          opacity: 0.4;
          animation: orb-move 20s infinite alternate ease-in-out;
        }

        .orb-1 { width: min(400px, 80vw); height: min(400px, 80vw); background: #ff4d94; top: -100px; left: -100px; }
        .orb-2 { width: min(500px, 90vw); height: min(500px, 90vw); background: #ffb6c1; bottom: -150px; right: -100px; }
        .orb-3 { width: 300px; height: 300px; background: #e91e63; top: 40%; left: 60%; opacity: 0.2; }

        @keyframes orb-move {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 40px) scale(1.1); }
          100% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes text-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes heartbeat { 0% { transform: scale(1); } 10% { transform: scale(1.1); } 20% { transform: scale(1); } 30% { transform: scale(1.15); } 40% { transform: scale(1); } }
        @keyframes fall { 0% { transform: translateY(-50px) rotate(0deg); opacity: 0; } 20% { opacity: 0.5; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        @keyframes border-glow { 0%, 100% { border-color: var(--primary-pink); box-shadow: 0 0 15px rgba(255, 77, 148, 0.3); } 50% { border-color: var(--accent-pink); box-shadow: 0 0 30px rgba(255, 20, 147, 0.5); } }
        @keyframes glow-spin { 0% { box-shadow: 0 0 10px var(--accent-pink); } 50% { box-shadow: 0 0 40px var(--accent-pink); } 100% { box-shadow: 0 0 10px var(--accent-pink); } }
        @keyframes floatHeader { 0%, 100% { transform: translateY(0); opacity: 0.8; } 50% { transform: translateY(-10px); opacity: 1; } }
        @keyframes whatsapp-pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); } 70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); } }

        .hearts-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .heart-particle { position: absolute; animation: fall linear infinite; }

        .content-wrapper { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          position: relative; 
          z-index: 10; 
          width: 100%; 
          min-height: 100vh; 
          padding: 20px; 
        }

        /* --- PROPOSAL CARD RESPONSIVE --- */
        .proposal-card { 
          background: var(--glass); 
          backdrop-filter: blur(30px); 
          padding: min(4.5rem, 8vw) min(2.5rem, 5vw); 
          border-radius: 3rem; 
          box-shadow: 0 20px 60px rgba(255, 77, 148, 0.2); 
          text-align: center; 
          max-width: 580px; 
          width: 95%; 
          border: 2px solid var(--primary-pink); 
          animation: border-glow 4s infinite ease-in-out; 
        }

        .btn-yes { 
          position: relative; width: 100%; max-width: 280px; margin: 0 auto; 
          padding: 1.2rem; background: linear-gradient(45deg, var(--primary-pink), var(--accent-pink)); 
          color: white; border: none; border-radius: 60px; font-size: 1.3rem; font-weight: 700; 
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; 
          box-shadow: 0 10px 25px rgba(255, 77, 148, 0.3); transition: 0.3s;
        }
        .btn-yes:active { transform: scale(0.95); }

        .btn-no { 
          position: fixed; padding: 0.6rem 1.5rem; background: rgba(255, 255, 255, 0.95); 
          border: 1px solid #e2e8f0; border-radius: 50px; color: var(--no-color-text); 
          font-weight: 600; z-index: 20; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
          transition: top 0.4s, left 0.4s;
        }

        .forever-line { 
          margin-top: 2rem; font-family: 'Parisienne', cursive; font-size: 1.3rem; 
          color: #ff6b9d; font-weight: 700; text-align: center; width: 100%;
        }

        /* --- GIFT SELECTION SCREEN RESPONSIVE --- */
        .gift-container-page { width: 100%; max-width: 1000px; display: flex; flex-direction: column; align-items: center; }
        .gift-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
          gap: 1.2rem; 
          width: 100%; 
          margin-top: 2rem; 
        }
        
        @media (max-width: 480px) {
          .gift-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .gift-tile { 
          background: white; padding: 1.5rem 1rem; border-radius: 2rem; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.05); cursor: pointer; transition: 0.3s; 
          display: flex; flex-direction: column; align-items: center; text-align: center;
          border: 1px solid #fff0f5;
        }
        .gift-tile:active { transform: scale(0.95); }
        .gift-icon-box { 
          width: 60px; height: 60px; border-radius: 1.2rem; display: flex; 
          align-items: center; justify-content: center; color: white; margin-bottom: 0.8rem; 
        }
        .gift-tile h3 { font-family: 'Great Vibes', cursive; font-size: 1.5rem; margin: 0; color: var(--accent-pink); }
        .gift-tile p { font-size: 0.85rem; color: #777; margin: 0.2rem 0; }

        /* --- GIFT 1: WHEEL RESPONSIVE --- */
        .wheel-view { 
          width: 100%; max-width: 500px; background: white; padding: 2.5rem 1.5rem; 
          border-radius: 3rem; text-align: center; box-shadow: 0 30px 80px rgba(0,0,0,0.1); 
          position: relative; animation: modalZoom 0.5s; 
        }
        .wheel-outer-ring { 
          position: relative; width: min(320px, 80vw); height: min(320px, 80vw); 
          margin: 1.5rem auto; border-radius: 50%; padding: 10px; background: var(--gold-tint); 
        }
        .wheel-outer-ring.spinning { animation: glow-spin 1s infinite alternate; }
        .wheel-svg-wrap { width: 100%; height: 100%; border-radius: 50%; border: 4px solid #fff; overflow: hidden; background: #222; position: relative; }
        .wheel-svg { width: 100%; height: 100%; transition: transform 4.5s cubic-bezier(0.15, 0, 0.15, 1); }

        /* --- GIFT 2: ENVELOPE RESPONSIVE --- */
        .envelope-view { perspective: 1000px; display: flex; flex-direction: column; align-items: center; width: 100%; }
        .envelope-wrapper { 
          position: relative; width: min(320px, 90vw); height: min(220px, 60vw); 
          background: #fdfaf0; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.1); 
          cursor: pointer; border: 2px solid #f1e9d9; 
        }
        .flap { 
          position: absolute; top: 0; left: 0; width: 0; height: 0; 
          border-left: min(160px, 45vw) solid transparent; 
          border-right: min(160px, 45vw) solid transparent; 
          border-top: min(110px, 30vw) solid #fdfaf0; 
          transform-origin: top; transition: 0.6s; z-index: 20; 
        }
        .envelope-opening .flap { transform: rotateX(180deg); }

        /* --- GIFT 3: POLAROIDS RESPONSIVE --- */
        .gallery-wrap { 
          width: 100%; display: flex; flex-wrap: wrap; justify-content: center; 
          gap: 1.5rem; padding: 1rem; 
        }
        .polaroid { 
          background: white; padding: 10px 10px 35px 10px; border-radius: 2px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: min(280px, 45vw); 
          cursor: pointer; transition: 0.3s; position: relative; 
        }
        .polaroid img { width: 100%; aspect-ratio: 1/1; object-fit: cover; }
        .polaroid-caption { font-family: 'Kalam', cursive; font-size: 0.9rem; text-align: center; margin-top: 10px; color: #555; }
        
        .modal-polaroid { 
          background: white; padding: 15px 15px 60px 15px; width: 95vw; max-width: 500px; 
          animation: modalZoom 0.5s; position: relative; text-align: center; 
        }
        .modal-polaroid img { width: 100%; max-height: 70vh; object-fit: contain; }

        .polaroid img{
  width:100%;
  height:260px;
  object-fit:cover;
  border-radius:4px;
}


        /* --- GIFT 4: JOURNAL RESPONSIVE --- */
        .journal-container { 
          background: white; padding: 2rem 1.5rem; border-radius: 2.5rem; 
          box-shadow: 0 40px 100px rgba(255, 77, 148, 0.1); width: 100%; 
          max-width: 500px; border: 1px solid #fef0f5; 
        }
        .journal-header { color: var(--accent-pink); font-family: 'Great Vibes', cursive; font-size: 2.2rem; margin-bottom: 1rem; text-align: center; }
        .journal-question-text { font-family: 'Kalam', cursive; font-size: 1.3rem; line-height: 1.4; color: #333; font-weight: 700; text-align: center; }
        .journal-input-premium { 
          width: 100%; border: 2px solid #f1f5f9; border-radius: 15px; padding: 1rem; 
          font-family: 'Kalam', cursive; font-size: 1.2rem; color: var(--primary-pink); 
          background: #f8fafc; outline: none; transition: 0.3s; text-align: center;
        }

        .btn-whatsapp-perfect { 
          width: 100%; padding: 1.1rem; background: linear-gradient(135deg, var(--whatsapp-green), var(--whatsapp-dark)); 
          color: white; border: none; border-radius: 2rem; font-weight: 800; font-size: 1.1rem; 
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; 
          animation: whatsapp-pulse 2s infinite; 
        }

        .music-btn { 
          position: fixed; bottom: 1.5rem; right: 1.5rem; width: 55px; height: 55px; 
          border-radius: 50%; background: white; border: 1px solid #eee; 
          display: flex; align-items: center; justify-content: center; z-index: 100; 
          box-shadow: 0 10px 25px rgba(255, 77, 148, 0.2); cursor: pointer; 
        }

        .modal-overlay { 
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); 
          backdrop-filter: blur(10px); z-index: 1000; display: flex; 
          align-items: center; justify-content: center; padding: 15px; 
        }

        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* BACKGROUND ELEMENTS */}
      <div className="bg-canvas">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      <div className="hearts-layer">
        {fallingHearts.map(heart => (
          <div key={heart.id} className="heart-particle" style={{ left: `${heart.left}%`, fontSize: `${heart.size}px`, animationDuration: `${heart.duration}s` }}>
            {heart.emoji}
          </div>
        ))}
      </div>

      <div className="content-wrapper">
        {!accepted ? (
          <div className="proposal-card">
            <Heart size={60} color="#ff4d94" fill="#ff4d94" style={{ marginBottom: '1.5rem', animation: 'heartbeat 1.5s infinite' }} />
            <h1 style={{ marginBottom: '2rem', animation: 'text-float 5s infinite' }}>
              <span style={{ display: 'block', fontFamily: 'Dancing Script', fontSize: '1.8rem', color: '#ff6b9d', marginBottom: '0.5rem', fontWeight: '700' }}>Someone Special...</span>
              <span style={{ display: 'block', fontFamily: 'Great Vibes', fontSize: '2.5rem', background: 'linear-gradient(135deg, var(--accent-pink), #8e2de2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Will you be my Valentine?</span>
            </h1>
            <button
              className="btn-yes"
              onClick={() => {
                setAccepted(true);
                setIsGameComplete(false);
                setActiveGame('menu');
              }}
            >
              <Sparkles size={22} /> Yes, I will!
            </button>
            <button className="btn-no" style={{ top: noButtonPosition.top, left: noButtonPosition.left }} onMouseEnter={handleNoHover} onClick={handleNoHover}>No 😢</button>
            <div className="forever-line">Forever isn't long enough with you... 💖</div>
          </div>
        ) : !isGameComplete ? (
          <div className="journal-container" style={{ maxWidth: '640px' }}>
            {activeGame === 'menu' && (
              <div style={{ textAlign: 'center' }}>
                <div className="journal-header">Play To Unlock Gifts</div>
                <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '1.2rem' }}>
                  Win any one game to open the gifts.
                </p>
                <div style={{ display: 'grid', gap: '0.9rem' }}>
                  <button
                    className="btn-yes"
                    style={{ maxWidth: '100%' }}
                    onClick={startPairGame}
                  >
                    Match the Pair
                  </button>
                  <button
                    className="btn-yes"
                    style={{ maxWidth: '100%', background: 'linear-gradient(45deg, #ff1493, #e91e63)' }}
                    onClick={startTicTacToeGame}
                  >
                    Tic Tac Toe
                  </button>
                </div>
              </div>
            )}

            {activeGame === 'pair' && (
              <div style={{ textAlign: 'center' }}>
                <div className="journal-header">Match The Pair</div>
                <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '1rem' }}>
                  Match all cards to win.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(52px, 1fr))', gap: '0.7rem' }}>
                  {pairCards.map((card, index) => {
                    const isFlipped = flippedPairIndexes.includes(index) || card.matched;
                    return (
                      <button
                        key={card.id}
                        onClick={() => handlePairCardClick(index)}
                        style={{
                          height: '64px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          background: isFlipped ? '#fff0f5' : 'linear-gradient(135deg, #ff4d94, #ff1493)',
                          color: isFlipped ? '#111' : 'white',
                          fontWeight: 700
                        }}
                      >
                        {isFlipped ? card.value : '?'}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => setActiveGame('menu')} style={{ background: 'none', border: 'none', color: '#888', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Kalam' }}>
                    Back to Games
                  </button>
                </div>
              </div>
            )}

            {activeGame === 'ttt' && (
              <div style={{ textAlign: 'center' }}>
                <div className="journal-header">Tic Tac Toe</div>
                <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '1rem' }}>
                  You are X. Win against O to unlock gifts.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(70px, 1fr))', gap: '0.7rem', maxWidth: '260px', margin: '0 auto' }}>
                  {tttBoard.map((cell, index) => (
                    <button
                      key={index}
                      onClick={() => handleTicTacToeClick(index)}
                      style={{
                        height: '76px',
                        borderRadius: '14px',
                        border: '1px solid #fecdd3',
                        background: 'white',
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: cell === 'X' ? '#ff1493' : '#6b7280',
                        cursor: tttStatus === 'playing' && !cell ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {cell || ''}
                    </button>
                  ))}
                </div>
                <p style={{ marginTop: '1rem', fontWeight: 700, color: tttStatus === 'lost' ? '#dc2626' : '#334155' }}>
                  {tttStatus === 'playing' && 'Your turn'}
                  {tttStatus === 'lost' && 'You lost. Try again.'}
                  {tttStatus === 'draw' && 'Draw. Try again.'}
                  {tttStatus === 'won' && 'You won! Gifts unlocked.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.7rem' }}>
                  <button className="btn-yes" style={{ maxWidth: '180px', padding: '0.8rem', fontSize: '1rem' }} onClick={startTicTacToeGame}>
                    Restart
                  </button>
                  <button onClick={() => setActiveGame('menu')} style={{ background: 'none', border: 'none', color: '#888', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Kalam' }}>
                    Back to Games
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : selectedGift === 1 ? (
          <div className="wheel-view">
            <button style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', color: '#ccc', cursor: 'pointer', zIndex: 120 }} onClick={resetSelection}><X size={24} /></button>
            <h2 style={{ color: '#222', fontSize: '2rem', fontWeight: '800', fontFamily: 'Great Vibes', marginBottom: '0.5rem' }}>Wheel of Love 🎡</h2>
            <div style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: '600', color: '#ff4d94', marginBottom: '1rem', padding: '0 10px' }}>Spin to unlock a romantic magic moment! ✨🎡❤️</div>
            <div className={`wheel-outer-ring ${wheelSpinning ? 'spinning' : ''}`}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderTop: '30px solid #222', zIndex: 100 }}></div>
              <div className="wheel-svg-wrap">
                <svg className="wheel-svg" viewBox="0 0 300 300" style={{ transform: `rotate(${rotation}deg)` }}>
                  <defs>{WHEEL_SEGMENTS.map((seg, i) => (<radialGradient key={`grad-${i}`} id={`grad-${i}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={seg.color} /><stop offset="100%" stopColor={seg.secondary} /></radialGradient>))}</defs>
                  {WHEEL_SEGMENTS.map((seg, i) => {
                    const angle = 360 / WHEEL_SEGMENTS.length;
                    const startAngle = i * angle;
                    const endAngle = (i + 1) * angle;
                    const x1 = 150 + 150 * Math.cos((startAngle - 90) * Math.PI / 180);
                    const y1 = 150 + 150 * Math.sin((startAngle - 90) * Math.PI / 180);
                    const x2 = 150 + 150 * Math.cos((endAngle - 90) * Math.PI / 180);
                    const y2 = 150 + 150 * Math.sin((endAngle - 90) * Math.PI / 180);
                    return (<g key={i}><path d={`M 150 150 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`} fill={`url(#grad-${i})`} stroke="#fff" strokeWidth="2" /><text x="150" y="55" transform={`rotate(${startAngle + angle / 2}, 150, 150)`} fill="white" fontSize="12" fontWeight="800" textAnchor="middle">{seg.emoji}</text></g>);
                  })}
                  <circle cx="150" cy="150" r="30" fill="#fff" stroke="var(--gold-tint)" strokeWidth="3" /><text x="150" y="156" textAnchor="middle" fontSize="20">❤️</text>
                </svg>
              </div>
            </div>
            <button className="btn-spin-premium" style={{ width: '90%', padding: '1rem', background: 'linear-gradient(45deg, #1a1a1a, #444)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', marginTop: '1rem' }} onClick={spinWheel} disabled={wheelSpinning}>{wheelSpinning ? 'Waiting...' : 'Spin My Heart! 💘'}</button>
            {showWheelResult && wheelResult && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.9)', borderRadius: '2rem', border: '2px solid var(--soft-pink)', animation: 'slideIn 0.5s' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{wheelResult.emoji}</div>
                <h3 style={{ color: 'var(--accent-pink)', fontSize: '1.8rem', fontWeight: '700', fontFamily: 'Dancing Script' }}>{wheelResult.text}</h3>
              </div>
            )}
          </div>
        ) : selectedGift === 2 ? (
          <div style={{ margin: 'auto', width: '100%', textAlign: 'center' }}>
            {letterStage !== 'opened' ? (
              <div className="envelope-view">
                <h2 style={{ color: '#ff1493', fontFamily: 'Great Vibes', fontSize: '2.2rem', marginBottom: '1.5rem' }}>A Secret Note For You... 💌</h2>
                <div className={`envelope-wrapper ${letterStage === 'opening' ? 'envelope-opening' : ''}`} onClick={handleOpenLetter}>
                  <div className="flap"></div><div className="flap-inner"></div>
                  <div className="ribbon-h" style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '30px', background: 'var(--primary-pink)', transform: 'translateY(-50%)', zIndex: 25 }}></div>
                  <div className="ribbon-v" style={{ position: 'absolute', top: 0, left: '50%', width: '30px', height: '100%', background: 'var(--primary-pink)', transform: 'translateX(-50%)', zIndex: 25 }}></div>
                  <div className="ribbon-knot"><Heart size={34} fill="white" /></div>
                  <div className="letter-preview" style={{ position: 'absolute', bottom: '10px', left: '5%', width: '90%', height: '80%', background: '#fffcf5', borderRadius: '5px', transition: 'transform 0.8s 0.4s', transform: letterStage === 'opening' ? 'translateY(-120px)' : 'none' }}></div>
                </div>
                <button onClick={resetSelection} style={{ background: 'none', border: 'none', color: '#888', marginTop: '2.5rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Kalam' }}>Back to Gifts 🎁</button>
              </div>
            ) : (
              <div style={{ background: '#fffcf5', padding: '2.5rem 1.2rem', borderRadius: '1.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', width: '95%', maxWidth: '500px', margin: 'auto', borderTop: '15px solid var(--primary-pink)', fontFamily: 'Mrs Saint Delafield', fontSize: '3rem', color: 'var(--accent-pink)', lineHeight: '1.2', animation: 'slideIn 0.8s', position: 'relative' }}>
                <button style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', color: '#ccc', cursor: 'pointer' }} onClick={resetSelection}><X size={24} /></button>
                My Dearest Love,
                <p style={{ fontSize: '1.5rem', color: '#444', fontFamily: 'Parisienne', marginTop: '1rem' }}>From the moment I met you, I knew you were someone special. Your smile lights up my world.</p>
                <div style={{ background: '#fff5f8', padding: '1.5rem', borderRadius: '1rem', color: '#c71585', margin: '1.5rem 0', fontStyle: 'italic', borderLeft: '5px solid var(--primary-pink)', fontFamily: 'sans-serif', textAlign: 'center', fontSize: '1.2rem' }}>तुझ्यासोबतचा प्रत्येक दिवस एक नवीन साहस वाटतो. तू मला एक चांगला माणूस बनण्यासाठी प्रेरणा देतेस. </div>
                <div style={{ textAlign: 'right', color: 'var(--primary-pink)', fontSize: '2.5rem' }}>With all my love 💕</div>
              </div>
            )}
          </div>
        ) : selectedGift === 3 ? (
          <div style={{ width: '100%', minHeight: '100vh', padding: '1rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ color: '#ff4d94', fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Great Vibes', marginBottom: '0.5rem' }}>Our Memories 📸</h1>
              <button onClick={resetSelection} style={{ background: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '3rem', cursor: 'pointer', color: '#ff4d94', fontWeight: 'bold', fontSize: '0.9rem' }}>Back to Gifts 🎁</button>
            </div>
            <div className="gallery-wrap">
              {PHOTO_ASSETS.map((src, i) => (
                <div key={i} className="polaroid" style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + Math.random() * 3)}deg)` }} onClick={() => setSelectedImage({ src, index: i })}>
                  <img src={src} alt="Memory" />
                  <div className="polaroid-caption">{PHOTO_CAPTIONS[i]}</div>
                </div>
              ))}
            </div>
            {selectedImage && (
              <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                <div className="modal-polaroid" onClick={e => e.stopPropagation()}>
                  <button style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'var(--primary-pink)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedImage(null)}><X size={20} /></button>
                  <img src={selectedImage.src} alt="Zoomed Memory" />
                  <div style={{ fontFamily: 'Great Vibes', fontSize: '2.5rem', color: '#333', marginTop: '1rem' }}>{PHOTO_CAPTIONS[selectedImage.index]}</div>
                </div>
              </div>
            )}
          </div>
        ) : selectedGift === 4 ? (
          <div className="journal-container">
            <button style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', color: '#ccc', cursor: 'pointer', zIndex: 100 }} onClick={resetSelection}><X size={24} /></button>
            {!isJournalComplete ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '10px', marginBottom: '2rem', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary-pink), var(--accent-pink))', transition: 'width 0.5s', width: `${((journalIndex + 1) / LOVE_QUESTIONS.length) * 100}%` }}></div>
                </div>
                <div className={isQuestionAnimating ? 'opacity-0' : 'opacity-100'} style={{ transition: '0.4s' }}>
                  <div className="journal-header">Honest Hearts ❤️</div>
                  <div className="journal-question-text" style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>{LOVE_QUESTIONS[journalIndex].text}</div>
                  <textarea autoFocus className="journal-input-premium" placeholder="तुमच्या मनातील भावना लिहा..." rows="3" value={journalAnswers[LOVE_QUESTIONS[journalIndex].id] || ''} onChange={(e) => setJournalAnswers({ ...journalAnswers, [LOVE_QUESTIONS[journalIndex].id]: e.target.value })} />
                  <button
                    style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--primary-pink), var(--accent-pink))', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '800', fontSize: '1.1rem', cursor: !(journalAnswers[LOVE_QUESTIONS[journalIndex].id]?.trim()) ? 'not-allowed' : 'pointer', transition: '0.3s', marginTop: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: !(journalAnswers[LOVE_QUESTIONS[journalIndex].id]?.trim()) ? 0.6 : 1 }}
                    onClick={handleNextQuestion}
                    disabled={!(journalAnswers[LOVE_QUESTIONS[journalIndex].id]?.trim())}
                  >
                    {journalIndex === LOVE_QUESTIONS.length - 1 ? "Finish Journal ✨" : "पुढील प्रश्न"} <ChevronRight size={18} />
                  </button>
                  <button onClick={resetSelection} style={{ background: 'none', border: 'none', color: '#888', marginTop: '1.2rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Kalam', fontSize: '0.9rem' }}>Back to Gifts 🎁</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', animation: 'modalZoom 0.8s' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--soft-pink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-pink)', margin: '0 auto 1.5rem' }}><CheckCircle2 size={40} /></div>
                <h2 style={{ fontFamily: 'Parisienne', fontSize: '2.2rem', color: 'var(--deep-rose)', marginBottom: '0.5rem' }}>Journal Complete!</h2>
                <p style={{ color: '#666', fontFamily: 'Kalam', fontSize: '1.1rem', marginBottom: '1.5rem' }}>तुमचे सुंदर विचार माझ्यासोबत शेअर करा!</p>
                <button className="btn-whatsapp-perfect" onClick={shareToWhatsApp}>
                  <Send size={20} /> Share to WhatsApp 💬
                </button>
                <div style={{ marginTop: '1.5rem' }}><button onClick={resetSelection} style={{ background: 'none', border: 'none', color: '#ff4d94', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Kalam' }}>Back to Gifts</button></div>
              </div>
            )}
          </div>
        ) : (
          <div className="gift-container-page">
            <h1 style={{ color: '#ff1493', fontSize: '2.5rem', fontWeight: '400', marginBottom: '0.2rem', fontFamily: 'Parisienne', textAlign: 'center' }}>Magical Surprises 🎁</h1>
            <p style={{ color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Pick a box to reveal a secret just for you...</p>
            <div className="gift-grid">
              <div className="gift-tile" onClick={() => setSelectedGift(1)}>
                <div className="gift-icon-box" style={{ background: 'linear-gradient(45deg, #ff4d94, #ff8fab)' }}><RotateCcw size={32} /></div>
                <h3>Gift 1</h3><p>Love Spinner</p><div className="magic-hint" style={{ fontSize: '0.6rem' }}>Tap to Unbox ✨</div>
              </div>
              <div className="gift-tile" onClick={() => setSelectedGift(2)}>
                <div className="gift-icon-box" style={{ background: 'linear-gradient(45deg, #ff1493, #ff758c)' }}><Mail size={32} /></div>
                <h3>Gift 2</h3><p>Secret Note</p><div className="magic-hint" style={{ fontSize: '0.6rem' }}>Tap to Read 💌</div>
              </div>
              <div className="gift-tile" onClick={() => setSelectedGift(3)}>
                <div className="gift-icon-box" style={{ background: 'linear-gradient(45deg, #9c27b0, #ba68c8)' }}><Camera size={32} /></div>
                <h3>Gift 3</h3><p>Memory Lane</p><div className="magic-hint" style={{ fontSize: '0.6rem' }}>Tap to View 📸</div>
              </div>
              <div className="gift-tile" onClick={() => setSelectedGift(4)}>
                <div className="gift-icon-box" style={{ background: 'linear-gradient(45deg, #f59e0b, #fbbf24)' }}><PenTool size={32} /></div>
                <h3>Gift 4</h3><p>Honest Hearts</p><div className="magic-hint" style={{ fontSize: '0.6rem' }}>Tap to Write ✍️</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="music-btn" onClick={() => setMusicEnabled(!musicEnabled)}>
        {musicEnabled ? <Volume2 size={24} color="#ff4d94" /> : <VolumeX size={24} color="#ccc" />}
      </button>
    </div>
  );
}
