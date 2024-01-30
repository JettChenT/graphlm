import { Handle, NodeProps, Position } from "reactflow";
import useStore from "./store";
import React, { useState, useEffect } from "react";

const InputNode = (props: NodeProps) => {
  const { id, data } = props;
  const { updateNodeContent } = useStore();
  const [textAreaValue, setTextAreaValue] = useState(data.content.content);

  useEffect(() => {
    setTextAreaValue(data.content.content);
  }, [data.content.content]);

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    setTextAreaValue(newValue);
    updateNodeContent(id, { ...data.content, content: newValue });
  };

  return (
    <div className="react-flow__node-default node-input text-left w-48">
      <Handle type="target" position={Position.Left} />
      <span className="text-blue-900 block text-xs mb-1">Input Node</span>
      <textarea
        value={textAreaValue}
        onChange={handleTextAreaChange}
        className="nodrag border-2 border-gray-300 rounded-md p-2"
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default InputNode;
