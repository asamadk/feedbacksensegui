import { DefaultEdgeOptions, MarkerType, Position } from "reactflow";
import { colorPalette } from "./Constants";

export const defaultEdgeOptions: DefaultEdgeOptions = {
	type: "straight",
	labelStyle: { color: colorPalette.background, fill: colorPalette.background, fontWeight: 800, fontSize: 12 },
	labelShowBg: true,
	labelBgStyle: {
		fill: colorPalette.primary,
		background: colorPalette.primary,
	},
	labelBgPadding: [10, 10],
	labelBgBorderRadius: 15,
	style: {
		strokeWidth: 1,
		stroke: colorPalette.darkBackground,
	},
	animated: false,
	markerEnd: {
		type: MarkerType.ArrowClosed,
		width: 25,
		height: 25,
		color: colorPalette.darkBackground,
	},
};

export const getEdgePathMap = (edges: any[]) => {
	let edgeMap: any = {};
	edges.forEach(edge => {
		const key = `${edge.source}-${edge.label}`;
		edgeMap[key] = false;
	});
	return edgeMap;
}

export const getEdgeKey = (sourceId: string, targetId: string) => {
	return sourceId + "_" + targetId;
};

export const getEdgesLabelMap = (edges: any) => {
	const edgesLabelMap: { [key: string]: any } = {};
	edges.forEach((edge: any) => {
		edgesLabelMap[getEdgeKey(edge.source, edge.target)] = edge.label;
	});
	return edgesLabelMap;
};

export const getConnectionMap = (edges: any) => {
	const connectionsMap: { [key: string]: any[] } = {};
	edges.forEach((edge: any) => {
		if (!(connectionsMap[edge.source]?.length > 0)) {
			connectionsMap[edge.source] = [];
		}
		connectionsMap[edge.source].push(edge.target);
	});
	return connectionsMap;
};

export const getEdgesFromJson = (draftJson: any) => {
	const edges: any[] = draftJson?.edges;
	if (edges?.length > 0) {
		edges.forEach((edge) => {
			edge.source = edge.source || edge.uiSourceId;
			edge.target = edge.target || edge.uiTargetId;
			edge.id =
				"reactflow__edge-" +
				edge.source +
				"bottom-handle-" +
				edge.target +
				"top-handle";
			edge.sourceHandle = Position.Bottom + "-handle";
			edge.targetHandle = Position.Top + "-handle";

			delete edge.uiSourceId;
			delete edge.uiTargetId;
		});
		return edges;
	}
	return [];
};