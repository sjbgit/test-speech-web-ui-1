// SpeechRecognition.js
import React, { useState, useEffect } from 'react';

const SpeechRecognition = () => {
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    let recognitionInstance = null;

    const setupRecognition = () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognitionInstance.lang = 'en-US';
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;

        recognitionInstance.onstart = () => {
          setListening(true);
        };

        recognitionInstance.onend = () => {
          setListening(false);
        };

        recognitionInstance.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript + ' ';
            }
          }

          setTranscript(finalTranscript + interimTranscript);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
        };

        setRecognition(recognitionInstance);
      } else {
        console.error('SpeechRecognition is not supported in this browser');
      }
    };

    setupRecognition();

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div>
      <h1>Speech Recognition</h1>
      <button onClick={startListening} disabled={listening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!listening}>
        Stop Listening
      </button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechRecognition;
