import { Link } from "react-router-dom";

export default function NotFound() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100">

      <div className="text-center bg-white/70 backdrop-blur rounded-3xl shadow-xl p-10">


        <div className="text-7xl mb-5">
          🤖
        </div>


        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>


        <h2 className="text-2xl font-bold mt-4">
          Page Not Found
        </h2>


        <p className="text-gray-600 mt-3">
          The page you are looking for does not exist.
        </p>



        <Link

          to="/"

          className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition"

        >

          🏠 Back Home

        </Link>



      </div>


    </div>

  );
}