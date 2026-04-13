import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import ChatPanel from "./components/Chat/ChatPanel.jsx";
import { createMessage, getMessagesByConversationId } from "./api/messages.js";
import { streamCompletion, DEFAULT_MODEL_ID } from "./api/llm.js";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [conversationRefreshKey, setConversationRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }

      const nextMessages =
        await getMessagesByConversationId(activeConversationId);

      if (!ignore) {
        setMessages(nextMessages);
      }
    }

    loadMessages();

    return () => {
      ignore = true;
    };
  }, [activeConversationId]);

  async function handleSendMessage(text) {
    if (!activeConversationId || isLoading) {
      return;
    }

    setErrorMessage("");

    const userMessage = await createMessage({
      conversationId: activeConversationId,
      role: "user",
      text,
    });

    const nextMessages = [...messages, userMessage];
    const temporaryAssistantId = `temp-assistant-${Date.now()}`;
    let hasStartedAssistantMessage = false;

    setMessages(nextMessages);
    setConversationRefreshKey((currentValue) => currentValue + 1);
    setIsLoading(true);
    setShowLoadingIndicator(true);

    try {
      let finalReplyText = "";

      await streamCompletion({
        messages: nextMessages,
        model: selectedModel,
        onChunk: (chunkText) => {
          finalReplyText += chunkText;

          if (!hasStartedAssistantMessage) {
            hasStartedAssistantMessage = true;
            setMessages((currentMessages) => [
              ...currentMessages,
              {
                id: temporaryAssistantId,
                conversationId: activeConversationId,
                role: "assistant",
                text: chunkText,
                createdAt: new Date().toISOString(),
              },
            ]);
            setShowLoadingIndicator(false);
            return;
          }

          setShowLoadingIndicator(false);
          setMessages((currentMessages) =>
            currentMessages.map((message) => {
              if (message.id !== temporaryAssistantId) {
                return message;
              }

              return {
                ...message,
                text: message.text + chunkText,
              };
            })
          );
        },
      });

      if (!finalReplyText.trim()) {
        throw new Error("OpenRouter returned an empty response.");
      }

      const assistantMessage = await createMessage({
        conversationId: activeConversationId,
        role: "assistant",
        text: finalReplyText,
      });

      setMessages((currentMessages) => {
        if (!hasStartedAssistantMessage) {
          return [...currentMessages, assistantMessage];
        }

        return currentMessages.map((message) => {
          if (message.id === temporaryAssistantId) {
            return assistantMessage;
          }

          return message;
        });
      });
      setConversationRefreshKey((currentValue) => currentValue + 1);
    } catch (error) {
      const fallbackText = error.message
        ? `Request failed: ${error.message}`
        : "Request failed. Please try again.";

      const fallbackMessage = await createMessage({
        conversationId: activeConversationId,
        role: "assistant",
        text: fallbackText,
      });

      setMessages((currentMessages) => {
        const messagesWithoutTemporaryAssistant = currentMessages.filter(
          (message) => {
            return message.id !== temporaryAssistantId;
          }
        );

        return [...messagesWithoutTemporaryAssistant, fallbackMessage];
      });
      setConversationRefreshKey((currentValue) => currentValue + 1);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
      setShowLoadingIndicator(false);
    }
  }

  return (
    <div className="app-container w-full max-w-6xl h-[92vh] mx-auto bg-white border border-slate-200 rounded-xl shadow-sm flex overflow-hidden">
      <Sidebar
        activeConversationId={activeConversationId}
        onConversationSelect={setActiveConversationId}
        refreshKey={conversationRefreshKey}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        showLoadingIndicator={showLoadingIndicator}
        hasActiveConversation={Boolean(activeConversationId)}
        errorMessage={errorMessage}
      />
    </div>
  );
}
