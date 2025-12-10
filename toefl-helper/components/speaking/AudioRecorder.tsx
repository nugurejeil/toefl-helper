'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play } from 'lucide-react';
import Button from '@/components/ui/Button';

interface AudioRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (audioBlob: Blob) => void;
  maxDuration?: number; // in seconds
  disabled?: boolean;
}

export default function AudioRecorder({
  isRecording,
  onStartRecording,
  onStopRecording,
  maxDuration = 45,
  disabled = false,
}: AudioRecorderProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const durationIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize media recorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup audio analyzer for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        onStopRecording(audioBlob);

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
        setAudioLevel(0);
        setDuration(0);
      };

      mediaRecorder.start();
      onStartRecording();
      updateAudioLevel();

      // Start duration counter
      setDuration(0);
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  // Update audio level for visualization
  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255); // Normalize to 0-1

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  // Auto-stop recording when max duration is reached
  useEffect(() => {
    if (duration >= maxDuration && isRecording) {
      stopRecording();
    }
  }, [duration, maxDuration, isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Waveform visualization */}
      {isRecording && (
        <div className="flex items-center gap-1 h-16">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-strawberry-pink to-honey-brown rounded-full"
              animate={{
                height: [
                  `${10 + audioLevel * 20}px`,
                  `${10 + audioLevel * 60}px`,
                  `${10 + audioLevel * 30}px`,
                ],
              }}
              transition={{
                duration: 0.3 + i * 0.05,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      )}

      {/* Duration display */}
      {isRecording && (
        <div className="text-2xl font-bold text-cocoa-brown font-baloo">
          {formatTime(duration)} / {formatTime(maxDuration)}
        </div>
      )}

      {/* Record button */}
      <div className="relative">
        {isRecording && (
          <motion.div
            className="absolute inset-0 -m-2 rounded-full bg-strawberry-pink/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}

        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={disabled}
            variant="primary"
            className="w-20 h-20 rounded-full flex items-center justify-center"
          >
            <Mic size={32} />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="secondary"
            className="w-20 h-20 rounded-full flex items-center justify-center bg-strawberry-pink hover:bg-strawberry-pink/80"
          >
            <Square size={32} fill="currentColor" />
          </Button>
        )}
      </div>

      <div className="text-sm text-text-secondary text-center">
        {!isRecording ? (
          <p>마이크 버튼을 눌러 녹음을 시작하세요</p>
        ) : (
          <p>녹음 중... 정지 버튼을 누르면 녹음이 종료됩니다</p>
        )}
      </div>
    </div>
  );
}
