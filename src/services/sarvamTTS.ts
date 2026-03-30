export async function generateSpeech(
  text:string
):Promise<string[]>{

  try{

    if(!text) return [];

    // Split text into 400 char chunks
    const chunks =
    text.match(/.{1,400}/g) || [];

    const audioChunks:string[] = [];

    for(const chunk of chunks){

      const response =
      await fetch(
        "/api/voice/tts",
        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            text:chunk
          })

        }
      );

      const data =
      await response.json();

      if(data.audio){

        audioChunks.push(data.audio);

      }

    }

    return audioChunks;

  }
  catch(error){

    console.error(
      "TTS error:",
      error
    );

    return [];

  }

}