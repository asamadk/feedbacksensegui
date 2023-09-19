import React from "react";

function CustomConnectionLine(props: any) {
	const {
		fromX,
		fromY,
		fromPosition,
		toX,
		toY,
		toPosition,
		connectionLineType,
		connectionLineStyle,
	} = props;
	return (
		<g>
			<path
				fill="#f1f1f1"
				stroke="#f1f1f1"
				strokeWidth={2}
				className="animated"
				d={`M ${fromX},${fromY} L ${toX},${toY}`}
			/>
		</g>
	);
}

export default CustomConnectionLine;
