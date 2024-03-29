import { useCallback, useState } from "react";
import { Handle, NodeProps, Position, getIncomers } from "reactflow";
import useStore, { EditorState, Content, NodeData } from "./store";
import { HumanMessage } from "langchain/schema";
import chatgpt from "./cgpt";

export default function LLMNode({ id, data }: NodeProps<NodeData>) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Added loading state
  const {
    llm,
    llm_config,
    setLLMConfig,
    retrieveContentById,
    updateNodeContent,
    getSourcesById,
  } = useStore((state: EditorState) => ({
    llm: state.llm,
    llm_config: state.llm_config,
    retrieveContentById: state.retrieveContentById,
    updateNodeContent: state.updateNodeContent,
    getSourcesById: state.getSourcesById,
    setLLMConfig: state.setLLMConfig,
  }));

  const refreshContent = useCallback(async () => {
    setIsLoading(true); // Set loading state to true when refreshing
    console.log("refreshing content");
    const sourceIds = getSourcesById(id);
    if (sourceIds) {
      const sourcesContent = sourceIds
        .map((sourceId) => {
          const sourceContent = retrieveContentById(sourceId);
          return sourceContent
            ? `${sourceContent.type}: ${sourceContent.content}`
            : "";
        })
        .join("\n---\n");

      if (sourcesContent) {
        let cur_lm = llm;
        if (cur_lm === null) {
          cur_lm = setLLMConfig({
            api_base: prompt("API Base", "https://api.openai.com/v1"),
            api_key: prompt("Enter API KEY"),
            model: prompt("Enter Model ID", "gpt-3.5-turbo-1106"),
          });
        }
        const api_key = useStore.getState().llm_config.api_key;
        const base_url = useStore.getState().llm_config.api_base;
        const result = await chatgpt(
          {
            messages: [{ role: "user", content: sourcesContent }],
            model: useStore.getState().llm_config.model,
          },
          api_key,
          base_url
        );
        const text = result.choices[0].message.content || "";
        setContent(text);
        updateNodeContent(id, { type: "text", content: text });
      }
    }
    setIsLoading(false); // Set loading state to false after refreshing
  }, [id, llm, getSourcesById, retrieveContentById, updateNodeContent]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(
      () => {},
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  return (
    <div className="react-flow__node-default w-56 min-h-48 bg-white rounded shadow nowheel">
      <Handle type="target" position={Position.Left} />
      <button
        className="nodrag bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={refreshContent}
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? "Loading..." : "GPT!"}
      </button>
      <button
        className="nodrag bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        onClick={copyToClipboard}
      >
        Copy
      </button>
      <div className="overflow-y-scroll mt-4 mx-2 border-t bg-gray-100 rounded-lg border-gray-200 pt-2 min-h-36 max-h-60 nodrag no-scrollbar text-left p-2">
        {content}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
