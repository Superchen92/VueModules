import { reactive } from 'vue';
export const useCrossPointerType = ['crossGate', 'verticalLineGate'];
export const useAxisPointerX = ['crossGate'];
export const useAxisPointerY = ['crossGate'];

export const commonConfig = reactive({
  gridWidth: 208,
  gridHeight: 184,
  offsetLeftPixel: 45,
  offsetTopPixel: 20,
  offsetRightPixel: 10,
  chartAddWidth: 60,
  chartAddHeight: 60,
});
