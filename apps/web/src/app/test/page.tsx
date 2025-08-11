export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          UI Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Basic Styling Test
            </h2>
            <p className="text-gray-600 mb-4">
              This is a test to check if Tailwind CSS is working properly.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
              Test Button
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Component Test
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Working correctly</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Not working</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Color Palette Test
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Blue
            </div>
            <div className="bg-green-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Green
            </div>
            <div className="bg-red-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Red
            </div>
            <div className="bg-yellow-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">
              Yellow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 