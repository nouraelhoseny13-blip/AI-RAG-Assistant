export default function Loading({ darkMode }) {

  return (

    <div className="flex justify-start w-full max-w-4xl mt-4">


      <div
        className={`flex items-center gap-3 rounded-2xl px-5 py-3 shadow-md border ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >


        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
          🤖
        </div>



        <div>

          <p className="text-sm font-semibold">
            AI Assistant is thinking
          </p>


          <div className="flex gap-1 mt-1">

            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>

            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>

            <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>

          </div>

        </div>


      </div>


    </div>

  );
}