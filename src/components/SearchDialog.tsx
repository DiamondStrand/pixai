export function SearchDialog() {
    return (
      <div className="flex flex-col h-full">
        <div className="space-y-4 py-4">
          <div className="px-4">
            <h2 className="text-lg font-semibold mb-2">Förfina din sökning</h2>
            <textarea 
              className="w-full p-2 border rounded-md"
              placeholder="Beskriv vad du letar efter..."
            />
          </div>
          <div className="px-4">
            <h3 className="font-medium mb-2">AI-konversation</h3>
            <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
              {/* AI chat här */}
            </div>
          </div>
        </div>
      </div>
    )
  }