import { NextResponse } from "next/server";

export async function POST(req:Request){

  try{

    const body =
    await req.json();

    console.log("TTS text:",body.text);

    const response =
    await fetch(

      "https://api.sarvam.ai/text-to-speech",

      {

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          "api-subscription-key":
          process.env.SARVAM_API_KEY!
        },

        body:JSON.stringify({
          inputs:[body.text],
          target_language_code:"en-IN",
          speaker:"aditya", // changed from 'anushka' to 'aditya'
          model:"bulbul:v3"
        })

      }

    );

    const data = await response.json();
    console.log("Sarvam TTS full response:", JSON.stringify(data, null, 2));
    if (!data.audios || !data.audios[0]) {
      console.error("Sarvam TTS error or empty audio:", data);
    }
    return NextResponse.json({
      audio: data.audios?.[0] || ""
    });

  }
  catch(error){

    console.error("TTS error:",error);

    return NextResponse.json({

      audio:""

    });

  }

}