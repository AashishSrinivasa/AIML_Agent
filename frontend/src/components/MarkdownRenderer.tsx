import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderMarkdown = (text: string) => {
    // Split by double newlines to handle paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      if (!paragraph.trim()) return null;
      
      // Handle bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = paragraph.split(boldRegex);
      
      const elements = parts.map((part, index) => {
        if (index % 2 === 1) {
          // This is a bold part
          return <strong key={index} className="font-semibold text-gray-900 dark:text-white">{part}</strong>;
        } else {
          // This is a regular part
          return <span key={index}>{part}</span>;
        }
      });
      
      // Check if this paragraph contains bullet points
      if (paragraph.includes('•')) {
        const lines = paragraph.split('\n');
        const listItems = lines.filter(line => line.trim().startsWith('•'));
        const nonListContent = lines.filter(line => !line.trim().startsWith('•'));
        
        return (
          <div key={paragraphIndex} className="mb-3">
            {nonListContent.length > 0 && (
              <div className="mb-2">
                {nonListContent.map((line, lineIndex) => (
                  <div key={lineIndex} className="mb-1">
                    {renderInlineMarkdown(line)}
                  </div>
                ))}
              </div>
            )}
            {listItems.length > 0 && (
              <ul className="list-none space-y-1 ml-4">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                    <span className="flex-1">{renderInlineMarkdown(item.replace('•', '').trim())}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }
      
      return (
        <div key={paragraphIndex} className="mb-3">
          {elements}
        </div>
      );
    });
  };
  
  const renderInlineMarkdown = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-gray-900 dark:text-white">{part}</strong>;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };
  
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;
