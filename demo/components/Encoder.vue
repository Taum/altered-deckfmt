<script setup lang="ts">
import { ref } from 'vue'
import { encodeList } from '../../src'

defineProps<{ }>()

const textList = ref("")
const encodedList = ref("")

function doEncode() {
  try {
    encodedList.value = encodeList(textList.value)
  } catch (error) {
    console.error("encodeList error", error)
  }
}

function testYzmir() {
  textList.value = `1 ALT_CORE_B_YZ_03_C
3 ALT_CORE_B_BR_16_R2
2 ALT_CORE_B_YZ_04_C
3 ALT_CORE_B_YZ_07_R1
1 ALT_CORE_B_BR_10_R2
1 ALT_CORE_B_MU_08_R2
3 ALT_CORE_B_YZ_06_C
2 ALT_CORE_B_YZ_11_C
1 ALT_CORE_B_YZ_12_C
3 ALT_CORE_B_YZ_14_C
3 ALT_CORE_B_BR_25_R2
3 ALT_CORE_B_YZ_19_C
1 ALT_CORE_B_BR_28_R2
3 ALT_CORE_B_MU_25_R2
3 ALT_CORE_B_YZ_21_C
3 ALT_CORE_B_YZ_22_C
2 ALT_CORE_B_YZ_24_C
1 ALT_CORE_B_YZ_26_C
1 ALT_CORE_B_YZ_25_C`
}
</script>

<template>
  <h1>Encode a deck list</h1>

  <div class="">
    <div class="">
      <textarea v-model="textList" id="encodeDecklist" rows="30" cols="40"></textarea>
    </div>
    <button type="button" @click="doEncode">encode</button>
    - tests:
    <button type="button" @click="testYzmir">Yzmir</button>
    <p class="result mono">
      {{ encodedList }}
    </p>
  </div>
</template>

<style scoped>

</style>
