interface AssistantMessageProps {
  content: string;
}

interface QueryContent {
  query: string;
  orientation: string;
  size: string;
  color: string;
  isInappropriate: boolean;
  isIrrelevant: boolean;
}

export const AssistantMessage = ({ content }: AssistantMessageProps) => {
  const parseContent = (content: string): QueryContent | null => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  const parsedContent = parseContent(content);

  if (parsedContent) {
    return (
      <div className="flex justify-start mb-2">
        <div className="bg-gray-100 text-gray-800 p-4 rounded-lg max-w-[80%] shadow-sm">
          <div className="font-semibold mb-2 text-sm text-blue-600 flex items-center gap-2">
            <span>🤖 PixAi</span>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Sökfras:</span> {parsedContent.query}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-purple-100 px-2 py-1 rounded">
                Färger: {parsedContent.color}
              </span>
            </div>
            {(parsedContent.isInappropriate || parsedContent.isIrrelevant) && (
              <div className="text-red-500 text-xs mt-2">
                ⚠️ Detta innehåll kan vara olämpligt eller irrelevant
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for non-JSON content
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%] break-words">
        <div className="font-semibold mb-1 text-sm text-blue-600">🤖 PixAi</div>
        <div>{content}</div>
      </div>
    </div>
  );
};