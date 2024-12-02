interface UserMessageProps {
    content: string;
  }
  
  export const UserMessage = ({ content }: UserMessageProps) => {
    return (
      <div className="flex justify-end mb-2">
        <div className="bg-blue-100 text-gray-800 px-4 py-2 rounded-lg max-w-[80%] break-words">
          <div className="font-semibold mb-1 text-sm text-gray-600">Användaren</div>
          <div>{content}</div>
        </div>
      </div>
    );
  };