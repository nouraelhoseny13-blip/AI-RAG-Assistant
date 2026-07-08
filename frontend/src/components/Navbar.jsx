function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      
      <h1 className="text-2xl font-bold text-blue-600">
        AI RAG Assistant
      </h1>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-blue-600 transition">
          Home
        </button>

        <button className="text-gray-600 hover:text-blue-600 transition">
          Docs
        </button>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          <input
  type="file"
  className="hidden"
  id="fileUpload"
/>

<label
  htmlFor="fileUpload"
  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
>
      Upload PDF
     </label>
        
        </button>
      </div>

    </nav>
  );
}

export default Navbar;