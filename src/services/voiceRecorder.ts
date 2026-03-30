class VoiceRecorder {

  private mediaRecorder: MediaRecorder | null = null;

  private audioChunks: Blob[] = [];

  private stream: MediaStream | null = null;

  isRecording = false;


  async start(){

    if(this.isRecording) return;

    try{

      console.log("Requesting mic access");

      this.stream =
      await navigator.mediaDevices.getUserMedia({
        audio:true
      });

      console.log("Mic granted");

      this.mediaRecorder =
      new MediaRecorder(this.stream);

      this.audioChunks=[];

      this.mediaRecorder.ondataavailable=
      (event)=>{

        if(event.data.size>0){

          this.audioChunks.push(event.data);

        }

      };

      this.mediaRecorder.start();

      this.isRecording=true;

      console.log("Recording started");

    }
    catch(error){

      console.error(
        "Recorder error:",
        error
      );

    }

  }


  stop():Promise<Blob>{

    return new Promise((resolve)=>{

      if(!this.mediaRecorder){

        resolve(new Blob());

        return;

      }

      this.mediaRecorder.onstop=()=>{

        const audioBlob=
        new Blob(
          this.audioChunks,
          {type:'audio/wav'}
        );

        if(this.stream){

          this.stream
          .getTracks()
          .forEach(track=>track.stop());

        }

        this.stream=null;

        this.isRecording=false;

        console.log("Recording stopped");

        resolve(audioBlob);

      };

      this.mediaRecorder.stop();

    });

  }

}

export const voiceRecorder =
new VoiceRecorder();