<template>
  <charts
    mode="edit"
    type="scatter"
    id="ellipseGate"
    editGateId="0_2"
    :gates="gates"
    @move-end="test"
    @select-target="test1"
    @drag-start="test2"
  >
  </charts>
</template>

<script setup>
import { ref } from 'vue';
// const gates = ref([
//   {
//     id: '0_1',
//     name: 'CD45+',
//     params: '[[77,173],[101,154],[122,151],[136,164],[134,187],[117,197],[83,194]]',
//     type: 'polygonsGate',
//     targetType: '',
//     subs: [
//       {
//         color: '#000000',
//         name: 'CD45+',
//         value: '26.32',
//       },
//     ],
//   },
// ]);
const gates = ref([
  {
    id: '0_2',
    name: 'Tru',
    params: '[[165,137],[194,137],[194,78],[165,78]]',
    type: 'rectGate',
    targetType: '',
    subs: [
      {
        color: '#000000',
        name: 'Tru',
        value: '11.41',
      },
    ],
  },
]);

// const gates = ref([
//   {
//     id: '3_1',
//     name: 'Q2UL CD8+ Q2LL Q2LR',
//     params: '[110,68]',
//     type: 'crossGate',
//     targetType: '',
//     subs: [
//       {
//         color: '#000000',
//         name: 'Q2UL',
//         value: '0.72',
//       },
//       {
//         color: '#000000',
//         name: 'CD8+',
//         value: '20.43',
//       },
//       {
//         color: '#000000',
//         name: 'Q2LL',
//         value: '47.84',
//       },
//       {
//         color: '#000000',
//         name: 'Q2LR',
//         value: '31.08',
//       },
//     ],
//   },
// ]);

// const gates = ref([
//   {
//     id: '0_1',
//     name: 'line1',
//     params: '[150,0]',
//     type: 'verticalLineGate',
//     subs: [
//       {
//         color: '#000000',
//         name: 'E3',
//         value: '',
//       },
//       {
//         color: '#000000',
//         name: 'E2',
//         value: '',
//       },
//     ],
//   },
// ]);

// const gates = ref([
//   {
//     id: '0_1',
//     name: 'E3',
//     params: '[[71,129],[123,129]]',
//     type: 'lineSegmentGate',
//     targetType: '',
//     subs: [
//       {
//         color: '#000000',
//         name: 'E3',
//         value: '',
//       },
//     ],
//   },
// ]);

// const gates = ref([
//   {
//     id: '0_1',
//     name: 'E3',
//     params: '{"x":134,"y":99,"r":20,"sx":2,"sy":1,"angle":150}',
//     type: 'ellipseGate',
//     targetType: '',
//     subs: [
//       {
//         color: '#000000',
//         name: 'E3',
//         value: '',
//       },
//     ],
//   },
// ]);

const test = (e) => {
  gates.value[0].params = e.movedPoints;
  console.log(e);
};

const test1 = (e) => {
  console.log(e);
};

const test2 = (e) => {
  console.log(e);
};
</script>
