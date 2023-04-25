import { reactive, ref } from 'vue';

const chartStatus = {
  targetGate: reactive({
    type: 'polygon',
    gateId: '',
    movedPoints: [],
    status: 'stop',
    editGateId: '',
  }),
  mode: 'readOnly',
  canExportData: ref(false),
  dragStart: ref(false),
  showRotateButton: '',
  canMoveRotateButton: false,
};
export default chartStatus;
