import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Copy, Check, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Message({ role, content, darkMode }) {

  const isUser = role === "user";

  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [typingDone, setTypingDone] = useState(isUser);



  let answer = content;
  let sources = "";


  if (!isUser && content.includes("📄 Sources:")) {

    const parts = content.split("📄 Sources:");

    answer = parts[0];

    sources = parts[1];

  }




  const copyAnswer = async () => {

    await navigator.clipboard.writeText(answer);

    setCopied(true);

    toast.success("Copied!");

    setTimeout(() => {

      setCopied(false);

    }, 2000);

  };






  // 🔊 Text To Speech

  const speakAnswer = () => {


    if (!window.speechSynthesis) {

      toast.error(
        "Text To Speech is not supported"
      );

      return;

    }



    if (speaking) {

      window.speechSynthesis.cancel();

      setSpeaking(false);

      return;

    }




    const speech =
      new SpeechSynthesisUtterance(answer);



    const arabic =
      /[\u0600-\u06FF]/.test(answer);



    speech.lang =
      arabic ? "ar-EG" : "en-US";


    speech.rate = 1;

    speech.pitch = 1;




    speech.onstart = () => {

      setSpeaking(true);

    };



    speech.onend = () => {

      setSpeaking(false);

    };



    window.speechSynthesis.speak(
      speech
    );


  };






  const time = new Date().toLocaleTimeString([], {

    hour: "2-digit",

    minute: "2-digit",

  });






  return (

    <motion.div

      initial={{
        opacity:0,
        y:15
      }}

      animate={{
        opacity:1,
        y:0
      }}

      transition={{
        duration:0.3
      }}

      className={`flex mb-6 ${
        isUser
        ? "justify-end"
        : "justify-start"
      }`}

    >




      {!isUser && (

        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg mr-3">

          🤖

        </div>

      )}






      <div className="max-w-[75%]">



        <div

          className={`rounded-3xl p-5 shadow-lg border transition duration-300 ${
          
          isUser

          ?

          "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-500"

          :

          darkMode

          ?

          "bg-gray-900 border-gray-700 text-white"

          :

          "bg-white border-gray-200 text-gray-800"

          }`}

        >





          <div className="flex justify-between items-center mb-3">


            <span className="font-bold text-sm">

              {isUser
              ? "👤 You"
              : "🤖 AI Assistant"}

            </span>




            <span className="text-xs opacity-60">

              {time}

            </span>



          </div>








          <div className="leading-relaxed whitespace-pre-wrap">


            {isUser ? (

              answer

            ) : (


              <TypeAnimation

                sequence={[

                  answer,

                  () =>
                  setTypingDone(true)

                ]}

                wrapper="span"

                speed={60}

                cursor={false}

                repeat={0}

                style={{

                  whiteSpace:"pre-wrap"

                }}

              />


            )}



          </div>








          {!isUser && typingDone && (


            <div className="flex justify-end gap-2 mt-5">





              <button

                onClick={speakAnswer}

                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 transition"

              >

                {speaking ? (

                  <>

                    <VolumeX size={16}/>

                    Stop

                  </>

                ) : (

                  <>

                    <Volume2 size={16}/>

                    Speak

                  </>

                )}

              </button>







              <button

                onClick={copyAnswer}

                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 transition"

              >

                {copied ? (

                  <>

                    <Check size={16}/>

                    Copied

                  </>

                ) : (

                  <>

                    <Copy size={16}/>

                    Copy

                  </>

                )}



              </button>





            </div>


          )}



        </div>








        {!isUser && sources && (


          <div

            className={`mt-4 rounded-2xl p-4 border ${
            
            darkMode

            ?

            "bg-gray-900 border-gray-700"

            :

            "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"

            }`}

          >



            <h3 className="font-bold mb-3 text-yellow-600">

              📄 Retrieved Sources

            </h3>





            {sources

            .split("---------------------------")

            .filter(
              item =>
              item.trim() !== ""
            )

            .map((source,index)=>(


              <div

                key={index}

                className={`p-3 rounded-xl mb-3 text-sm border ${
                
                darkMode

                ?

                "bg-gray-800 border-gray-700"

                :

                "bg-white border-gray-200"

                }`}

              >


                <span className="font-bold text-blue-500">

                  Source {index+1}

                </span>



                <p className="mt-2 whitespace-pre-wrap">

                  {source.trim()}

                </p>


              </div>


            ))}



          </div>


        )}



      </div>








      {isUser && (

        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ml-3">

          👤

        </div>

      )}



    </motion.div>

  );

}