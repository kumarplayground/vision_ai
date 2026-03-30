import { NextResponse } from "next/server";

export async function POST(req:Request){

  try{

    // STT must use formData
    const formData =
    await req.formData();

    const file =
    formData.get("file") as Blob;

    if(!file){

      return NextResponse.json(
        {transcript:""},
        {status:400}
      );

    }

    const sarvamForm =
    new FormData();

    sarvamForm.append(
      "file",
      file,
      "recording.wav"
    );

    sarvamForm.append(
      "model",
      "saaras:v3"
    );

    sarvamForm.append(
      "mode",
      "transcribe"
    );

    const response =
    await fetch(

      "https://api.sarvam.ai/speech-to-text",

      {

        method:"POST",

        headers:{
          "api-subscription-key":
          process.env.SARVAM_API_KEY!
        },

        body:sarvamForm

      }

    );

    const data = await response.json();
    console.log("Sarvam STT full response:", JSON.stringify(data, null, 2));
    if (!response.ok || data.error) {
      console.error("Sarvam STT error or bad response:", data);
    }
    return NextResponse.json(data);

  }
  catch(error){

    console.error("STT route error:",error);

    return NextResponse.json({

      transcript:""

    });

  }

}