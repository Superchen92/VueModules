import chartStatus from "./private/status";

export function checkDragable(gate) {
	if (chartStatus.mode == "readOnly") {
		return false;
	} else if (chartStatus.mode == "edit") {
		return true;
	} else {
		if (gate.id == chartStatus.targetGate.editGateId) {
			return true;
		} else {
			return false;
		}
	}
}
