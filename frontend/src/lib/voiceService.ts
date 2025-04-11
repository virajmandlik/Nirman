import { toast } from '@/components/ui/use-toast';

interface VoiceMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface WorqHatResponse {
  data: {
    text: string;
    processingTime: number;
    processingId: string;
  }
}

class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private WORQHAT_API_KEY = 'wh_m98e73pyIx3lDou60pIgq6E2u6i6bMMMo4lqEe6'; // Replace with your actual API key

  async startRecording(
    onDataAvailable: (audioBlob: Blob) => Promise<void>,
    onError: (error: Error) => void
  ) {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        console.log('Audio data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        console.log('Recording stopped, processing audio...');
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        await onDataAvailable(audioBlob);
      };

      this.mediaRecorder.start(1000); // Collect data every second
      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError(error as Error);
      toast({
        title: 'Error',
        description: 'Failed to access microphone. Please check your permissions.',
        variant: 'destructive',
      });
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      console.log('Stopping recording...');
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      // Stop all tracks
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      console.log('Recording stopped and tracks cleaned up');
    }
  }

  async processAudio(audioBlob: Blob): Promise<VoiceMessage> {
    try {
      console.log('Preparing to send audio to WorqHat API...');
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('keep_fillers', 'false');
      formData.append('enable_formatting', 'true');
      formData.append('enable_profanity_filters', 'true');

      console.log('Sending request to WorqHat API...');
      const response = await fetch('https://api.worqhat.com/api/ai/speech-text', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.WORQHAT_API_KEY}`,
          'Accept': 'application/json',
        },
      });

      console.log('WorqHat API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('WorqHat API error:', errorText);
        throw new Error(`Failed to process audio: ${response.status} ${errorText}`);
      }

      const data: WorqHatResponse = await response.json();
      console.log('Received response from WorqHat API:', data);
      
      // Return the transcribed text as a user message
      return {
        role: 'user',
        content: data.data.text || 'Sorry, I couldn\'t understand that.',
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to process audio. Please try again.',
        variant: 'destructive',
      });
      return {
        role: 'user',
        content: 'Sorry, I encountered an error processing your request.',
      };
    }
  }
}

export const voiceService = new VoiceService(); 