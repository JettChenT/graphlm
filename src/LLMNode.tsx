import { useCallback } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
 
const handleStyle = { left: 10 };

export type LLMSource = {
    type: string,
    content: string
}

export type LLMNodeData = {
    sources: LLMSource[]
}
 
export default function TextUpdaterNode({ id, data }: NodeProps<LLMNodeData>) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}