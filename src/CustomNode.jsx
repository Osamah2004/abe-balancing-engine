import { useInternalNode } from '@xyflow/react';

const CustomNode = ({data = {},id}) => {
    const internalNode = useInternalNode(id);
    const absolutePosition = internalNode?.internals.positionAbsolute;
    const displayPosition = true

    const {label,children} = data
    const bg = data.bg || ''
    return (
        <div className="bg-gray-900 rounded-xl">

            <header className={`main ${bg}`}>{label}
                {displayPosition &&
                    <>
                        <span> </span>
                        x: {absolutePosition?.x?.toFixed?.(0) ?? '—'}, 
                        y: {absolutePosition?.y?.toFixed?.(0) ?? '—'}
                    </>
                }
            </header>
            {children}
        </div>
    )
}

export default CustomNode;