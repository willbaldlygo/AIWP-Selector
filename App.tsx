import React, { useState, useEffect, useCallback, useRef } from 'react';
import Wheel from './components/Wheel';
import Timer from './components/Timer';
import WinnerModal from './components/WinnerModal';
import NamesPanel from './components/NamesPanel';
import { BRAND_COLORS, INITIAL_TIME } from './constants';

const wheelStartSrc = new URL('./Wheel_Start.wav', import.meta.url).href;
const countdownSrc = new URL('./Countdown.wav', import.meta.url).href;
const finishBellSrc = new URL('./Finish_Bell.wav', import.meta.url).href;

const App: React.FC = () => {
  const [namesInput, setNamesInput] = useState<string>('Alice\nBob\nCharlie\nDiana\nEve\nFrank');
  const [allNames, setAllNames] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [pendingRemovalWinner, setPendingRemovalWinner] = useState<string | null>(null);

  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);

  const [isNamesPanelOpen, setIsNamesPanelOpen] = useState<boolean>(false);
  
  const wheelStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const finishAudioRef = useRef<HTMLAudioElement | null>(null);
  const autoResetTimeoutRef = useRef<number | null>(null);

  const clearAutoResetTimeout = useCallback(() => {
    if (autoResetTimeoutRef.current !== null) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
  }, []);

  const playAudioClip = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise instanceof Promise) {
        playPromise.catch(error => {
          console.error('Failed to play audio clip', error);
        });
      }
    } catch (error) {
      console.error('Failed to play audio clip', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wheelAudio = new Audio(wheelStartSrc);
    const countdownAudio = new Audio(countdownSrc);
    const finishAudio = new Audio(finishBellSrc);

    wheelAudio.preload = 'auto';
    wheelAudio.load();
    countdownAudio.preload = 'auto';
    countdownAudio.load();
    finishAudio.preload = 'auto';
    finishAudio.load();

    wheelStartAudioRef.current = wheelAudio;
    countdownAudioRef.current = countdownAudio;
    finishAudioRef.current = finishAudio;

    return () => {
      [wheelAudio, countdownAudio, finishAudio].forEach(audio => {
        audio.pause();
      });
      wheelStartAudioRef.current = null;
      countdownAudioRef.current = null;
      finishAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isTimerActive) return;

    const intervalId = window.setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setIsTimerActive(false);
          clearAutoResetTimeout();
          playAudioClip(finishAudioRef.current);
          
          // Set up auto-close after 10 seconds
          autoResetTimeoutRef.current = window.setTimeout(() => {
            autoResetTimeoutRef.current = null;
            setTimeLeft(INITIAL_TIME);
            setIsTimerActive(false);
            setTimerStarted(false);
            
            // Remove the pending winner and close modal after 10 seconds
            if (pendingRemovalWinner) {
              setParticipants(prev => prev.filter(name => name !== pendingRemovalWinner));
              setPendingRemovalWinner(null);
            }
            setWinner(null);
          }, 10000);
          return 0;
        }
        if (prevTime === 11) {
          playAudioClip(countdownAudioRef.current);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isTimerActive, playAudioClip, clearAutoResetTimeout, pendingRemovalWinner]);

  useEffect(() => {
    return () => {
      clearAutoResetTimeout();
    };
  }, [clearAutoResetTimeout]);

  const handleUpdateNames = () => {
    const newNames = namesInput.split('\n').map(n => n.trim()).filter(Boolean);
    setAllNames(newNames);
    setParticipants(newNames);
  };
  
  useEffect(() => {
      handleUpdateNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpin = () => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    const segmentCount = participants.length;
    const anglePerSegment = 360 / segmentCount;
    const targetIndex = Math.floor(Math.random() * segmentCount);
    const halfSegment = anglePerSegment / 2;
    setSelectedIndex(targetIndex);

    const desiredRotation = 360 - (targetIndex * anglePerSegment + halfSegment);
    const currentRotation = ((rotation % 360) + 360) % 360;
    let deltaToDesired = (desiredRotation - currentRotation + 360) % 360;
    if (deltaToDesired === 0) {
      deltaToDesired += 360;
    }
    const extraTurns = 360 * (3 + Math.floor(Math.random() * 3));
    const delta = extraTurns + deltaToDesired;

    playAudioClip(wheelStartAudioRef.current);
    setRotation(prev => prev + delta);
  };
  
  const handleSpinEnd = () => {
    if (!isSpinning) return;

    const winnerIndex = selectedIndex !== null ? selectedIndex : 0;
    const selectedWinner = participants[winnerIndex];
    if (selectedWinner) {
      setWinner(selectedWinner);
      setLastWinner(selectedWinner);
      setPendingRemovalWinner(selectedWinner);
      // Don't remove from participants yet - will be removed when timer completes
    }
    setIsSpinning(false);
    setSelectedIndex(null);
  };

  const handleReAddWinner = () => {
    if (lastWinner && !participants.includes(lastWinner)) {
      setParticipants(prev => [...prev, lastWinner]);
      setLastWinner(null);
    }
    setWinner(null);
    setPendingRemovalWinner(null);
  };
  
  const handleResetWheel = () => {
    setParticipants(allNames);
    setLastWinner(null);
    setWinner(null);
    setIsSpinning(false);
    setPendingRemovalWinner(null);
  };

  const handleTimerStart = () => {
    if (timeLeft > 0) {
      clearAutoResetTimeout();
      setIsTimerActive(true);
      setTimerStarted(true);
    }
  };

  const handleTimerReset = () => {
    clearAutoResetTimeout();
    setIsTimerActive(false);
    setTimeLeft(INITIAL_TIME);
    setTimerStarted(false);
    
    // Remove the pending winner and close modal when timer is reset
    if (pendingRemovalWinner) {
      setParticipants(prev => prev.filter(name => name !== pendingRemovalWinner));
      setPendingRemovalWinner(null);
    }
    setWinner(null);
  };

  return (
    <div className="app-root bg-slate-50 text-slate-800 font-sans">
      <WinnerModal 
        winner={winner} 
        onClose={() => setWinner(null)}
        onStartTimer={handleTimerStart}
        timeLeft={timeLeft}
        isTimerActive={isTimerActive}
        timerStarted={timerStarted}
        onTimerReset={handleTimerReset}
      />
      <NamesPanel
        isOpen={isNamesPanelOpen}
        onClose={() => setIsNamesPanelOpen(false)}
        namesInput={namesInput}
        onNamesChange={setNamesInput}
        onUpdate={handleUpdateNames}
      />

      <header className="app-header text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Project Selector
        </h1>
        <p className="text-slate-600 mt-3 text-base sm:text-lg font-medium">Choose presenters fairly • 60-second updates</p>
      </header>
      
      <main className="app-layout">
        <section className="app-wheel-section app-section">
          <Wheel 
            participants={participants}
            colors={BRAND_COLORS}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpinEnd={handleSpinEnd}
            onSpin={handleSpin}
          />
        </section>

        <section className="app-timer-section app-section">
          <Timer 
            timeLeft={timeLeft}
            isActive={isTimerActive}
            onStart={handleTimerStart}
            onReset={handleTimerReset}
          />
        </section>

        <section className="app-controls-section app-section">
          <div className="app-controls-card bg-white p-5 sm:p-7 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 text-slate-800">Controls</h2>
            <div className="space-y-3">
              <button
                onClick={() => setIsNamesPanelOpen(true)}
                className="w-full py-3 px-5 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
              >
                📝 Manage Names
              </button>
              <button
                onClick={handleSpin}
                disabled={isSpinning || participants.length === 0}
                className="w-full py-4 px-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                🎯 SPIN THE WHEEL
              </button>
              {lastWinner && !participants.includes(lastWinner) && (
                <button
                  onClick={handleReAddWinner}
                  className="w-full py-2.5 px-5 bg-emerald-50 text-emerald-700 font-semibold rounded-xl border-2 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all"
                >
                  ↩️ Add "{lastWinner}" Back
                </button>
              )}
              <button
                onClick={handleResetWheel}
                className="w-full py-2.5 px-5 border-2 border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
              >
                🔄 Reset Wheel
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
