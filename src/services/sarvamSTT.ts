export async function transcribeAudio(
  audioBlob:Blob
):Promise<string>{

  try{

    const formData =
    new FormData();

    formData.append(
      "file",
      audioBlob,
      "recording.wav"
    );

    formData.append(
      "model",
      "saaras:v3"
    );

    formData.append(
      "mode",
      "transcribe"
    );

    const response =
    await fetch(
      "/api/voice/stt",
      {
        method:"POST",
        body:formData
      }
    );

    if(!response.ok){

      throw new Error(
        "STT request failed"
      );

    }

    const data =
    await response.json();

    if(data.error){

      console.error(
        data.error
      );

      return "";

    }

    return data.transcript || "";

  }
  catch(error){

    console.error(
      "STT error:",
      error
    );

    return "";

  }

}