class VoicePlayer{

  private currentAudio:HTMLAudioElement | null = null;

  async playQueue(
    base64List:string[]
  ){

    for(const base64 of base64List){
      const audioUrl =
      "data:audio/wav;base64," + base64;
      // Debug: log base64 and audioUrl
      console.log("Base64 audio string:", base64);
      console.log("Audio URL:", audioUrl);

      this.currentAudio =
      new Audio(audioUrl);

      await new Promise<void>((resolve)=>{

        if(!this.currentAudio){

          resolve();

          return;

        }

        this.currentAudio.onended =
        ()=>resolve();

        this.currentAudio.play()
        .catch(()=>{
          resolve();
        });

      });

    }

  }

  stop(){

    if(this.currentAudio){

      this.currentAudio.pause();

      this.currentAudio.currentTime = 0;

    }

  }

}

export const voicePlayer =
new VoicePlayer();