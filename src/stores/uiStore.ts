import $socket from "@/socket"
import { lookupTokens, TokenPiles } from "@/types/gamestate"
import { defineStore } from "pinia"

export enum SelectDevelopmentMode {
  Purchase,
  Reserve,
  None,
}

export const useUiStore = defineStore("ui", () => {
  const selectedTokens: Ref<Set<String> | null> = ref(null)
  const selectAmount: Ref<number> = ref(0)

  // (deckIndex, developmentId)
  const selectedDevelopmentId: Ref<number> = ref(-1)
  const selectDevelopmentMode: Ref<SelectDevelopmentMode> = ref(
    SelectDevelopmentMode.None,
  )
  const _canAffordSelectedDevelopment = ref(false)
  const _selectedDevelopmentCost: Ref<TokenPiles | null> = ref(null)
  const goldAllocation: Ref<TokenPiles | null> = ref(null)

  //Getters
  const isSelectingTokens = computed(() => {
    return selectedTokens.value != null
  })

  const getSelectedTokens = computed(() => {
    let tokens = selectedTokens.value ?? new Set()
    return tokens
  })

  const remainingTokens = computed(() => {
    if (selectedTokens.value) {
      return selectAmount.value - selectedTokens.value.size
    } else {
      return -1
    }
  })

  const getSelectDevelopmentMode = computed(() => {
    return selectDevelopmentMode.value
  })

  const isDevelopmentSelected = computed(() => {
    return (devId: number) => {
      return selectedDevelopmentId.value == devId
    }
  })

  const doneSelectingDevelopment = computed(() => {
    return selectedDevelopmentId.value != -1
  })

  const selectedDevelopmentCost = computed(() => {
    return _selectedDevelopmentCost.value ?? []
  })

  const canAffordSelectedDevelopment = computed(() => {
    return _canAffordSelectedDevelopment.value
  })

  const isAllocatingGold = computed(() => {
    return goldAllocation.value != null
  })

  const getAllocatedGold = computed(() => {
    return (color: string) => {
      if (goldAllocation.value) {
        return lookupTokens(goldAllocation.value, color)
      } else {
        return 0
      }
    }
  })

  function cancelAction() {
    selectedTokens.value = null
    selectAmount.value = 0
    selectedDevelopmentId.value = -1
    selectedDevelopmentId.value = -1
    selectDevelopmentMode.value = SelectDevelopmentMode.None
    goldAllocation.value = null
  }

  function beginTokenSelect(amount: number) {
    if (amount == 1 || amount == 3) {
      selectedTokens.value = new Set()
      selectAmount.value = amount
    }
  }

  function toggleTokenSelected(color: string) {
    if (selectedTokens.value) {
      if (selectedTokens.value.has(color)) {
        selectedTokens.value.delete(color)
      } else if (selectedTokens.value.size < selectAmount.value) {
        // Only add selection if less than the desired amount are selected
        selectedTokens.value.add(color)
      }
    }
  }

  function submitAcquireTokens() {
    if (selectedTokens.value) {
      $socket.sendAction("AcquireTokens", Array.from(selectedTokens.value))
      selectedTokens.value = null
      selectAmount.value = 0
    }
    cancelAction()
  }

  function beginDevelopmentSelect(mode: SelectDevelopmentMode) {
    selectDevelopmentMode.value = mode
    selectedDevelopmentId.value = -1
  }

  function toggleDevelopmentSelected(devId: number) {
    if (selectedDevelopmentId.value == devId) {
      selectedDevelopmentId.value = -1
    } else {
      selectedDevelopmentId.value = devId
    }
  }

  function submitPurchaseAction() {
    if (
      doneSelectingDevelopment.value &&
      selectDevelopmentMode.value == SelectDevelopmentMode.Purchase
    ) {
      $socket.sendAction("PurchaseDevelopment", [
        selectedDevelopmentId.value,
        goldAllocation.value,
      ])
    }
    cancelAction()
  }

  function submitReserveAction() {
    if (
      doneSelectingDevelopment.value &&
      selectDevelopmentMode.value == SelectDevelopmentMode.Reserve
    ) {
      $socket.sendAction("ReserveDevelopment", selectedDevelopmentId.value)
    }
    cancelAction()
  }

  function beginAllocatingGold() {
    goldAllocation.value = [
      ["Black", 0],
      ["White", 0],
      ["Blue", 0],
      ["Red", 0],
      ["Green", 0],
    ]
  }

  function allocateGold(color: string, deallocate = false) {
    if (goldAllocation.value) {
      for (let i = 0; i < goldAllocation.value.length; i++) {
        if (goldAllocation.value[i][0] == color) {
          let delta = deallocate ? -1 : 1
          console.log(delta)
          goldAllocation.value[i][1] += delta
        }
      }
    }
  }

  // Watchers
  watch(selectedDevelopmentId, async (newSelection, _) => {
    if (newSelection != -1) {
      console.log("new selection: ", newSelection)
      const selectedId = newSelection

      // We have the server do all the calculations for this
      $socket
        .query("CanAfford", [$socket.getGuid(), selectedId])
        .then((response) => {
          _canAffordSelectedDevelopment.value = response as boolean
        })

      $socket.query("DevelopmentCost", selectedId).then(
        (response) => {
          console.log("Cost response: ", response)
          let cost = response as TokenPiles
          _selectedDevelopmentCost.value = 
            cost.filter(([_, amt]) => {return amt > 0})
          
        },
        (err) => {console.log("Response error: ", err)},
      )
    }
  })

  return {
    //Getters
    isSelectingTokens,
    getSelectedTokens,
    remainingTokens,

    getSelectDevelopmentMode,
    isDevelopmentSelected,
    doneSelectingDevelopment,
    selectedDevelopmentCost,
    canAffordSelectedDevelopment,

    isAllocatingGold,
    getAllocatedGold,

    // Actions
    cancelAction,
    beginTokenSelect,
    toggleTokenSelected,
    submitAcquireTokens,

    beginDevelopmentSelect,
    toggleDevelopmentSelected,
    submitPurchaseAction,
    submitReserveAction,

    beginAllocatingGold,
    allocateGold,
  }
})
