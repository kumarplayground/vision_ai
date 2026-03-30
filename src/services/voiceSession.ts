import { voiceRecorder } from "./voiceRecorder";
import { transcribeAudio } from "./sarvamSTT";
import { generateSpeech } from "./sarvamTTS";
import { voicePlayer } from "./voicePlayer";

class VoiceSession{

  isActive = false;

  isProcessing = false;

  async start(){

    if(this.isProcessing) return;

    this.isActive = true;

    console.log("Voice session start");

    await voiceRecorder.start();

  }

  async stop(

    sendMessage:(text:string)=>Promise<string>,

    setInput:(text:string)=>void

  ){

    if(this.isProcessing) return;

    this.isProcessing = true;

    this.isActive = false;

    console.log("Voice session stop");

    // Stop recording
    const audioBlob =
    await voiceRecorder.stop();

    console.log(
      "Audio size:",
      audioBlob.size
    );

    if(audioBlob.size === 0){

      this.isProcessing=false;

      return;

    }

    // STT
    const text =
    await transcribeAudio(audioBlob);

    console.log("Transcript:",text);

    if(!text){

      this.isProcessing=false;

      return;

    }

    // Put text in input
    setInput(text);

    // Send to AI
    const aiResponse =
    await sendMessage(text);

    console.log(
      "AI response length:",
      aiResponse?.length
    );

    if(!aiResponse){

      this.isProcessing=false;

      return;

    }

    // TTS (now returns array)
    const audioChunks =
    await generateSpeech(aiResponse);

    console.log(
      "Audio chunks:",
      audioChunks.length
    );

    if(audioChunks.length>0){

      await voicePlayer.playQueue(
        audioChunks
      );

    }

    this.isProcessing=false;

  }

}

export const voiceSession =
new VoiceSession();