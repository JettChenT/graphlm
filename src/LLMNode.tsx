import { useCallback, useState } from "react";
import { Handle, NodeProps, Position, getIncomers } from "reactflow";
import useStore, { EditorState, Content, NodeData } from "./store";
import { HumanMessage } from "langchain/schema";

const handleStyle = { left: 10 };

export default function LLMNode({ id, data }: NodeProps<NodeData>) {
  const [content, setContent] = useState<string>("");
  const {
    llm,
    setLLMConfig,
    retrieveContentById,
    updateNodeContent,
    getSourcesById,
  } = useStore((state: EditorState) => ({
    llm: state.llm,
    retrieveContentById: state.retrieveContentById,
    updateNodeContent: state.updateNodeContent,
    getSourcesById: state.getSourcesById,
    setLLMConfig: state.setLLMConfig,
  }));

  const refreshContent = useCallback(async () => {
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
        const message = new HumanMessage(sourcesContent);
        let cur_lm = llm;
        if (cur_lm === null) {
          cur_lm = setLLMConfig({
            api_base:
              prompt("API Base", "https://api.openai.com/v1") ||
              "https://api.openai.com/v1",
            api_key: prompt("Enter API KEY"),
          });
        }
        const result = await cur_lm.invoke([message]);
        const text = result[0]?.text || "";
        setContent(text);
        updateNodeContent(id, { type: "text", content: text });
      }
    }
  }, [id, llm, getSourcesById, retrieveContentById, updateNodeContent]);

  return (
    <div className="react-flow__node-default w-48 p-2 min-h-48 bg-white rounded shadow">
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <button
        className="nodrag bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={refreshContent}
      >
        Refresh
      </button>
      <div className="overflow-scroll mt-4 border-t border-gray-200 pt-4">
        {content}
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
}
