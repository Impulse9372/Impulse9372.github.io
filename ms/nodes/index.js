var findButton = document.getElementById("find");

findButton.addEventListener("click", function () {
  const nodeCount = parseInt(document.getElementById('nodeCount').value);
  const boostTwice = document.getElementById('boostTwice').checked;
  const need = document
    .getElementById('need')
    .value
    .split(',')
    .map(n => n.trim());
  console.log(`Need: ${need}`);

  const nodes = document
    .getElementById('have')
    .value
    .split('\n')
    .map(node => node.trim())
    .filter(node => node);
  const uniqueNodes = [...new Set(nodes)];
  console.log(`Unique nodes: ${uniqueNodes}`);

  const combinations = generateCombinations(uniqueNodes, nodeCount);
  console.log(`Combinations: ${JSON.stringify(combinations)}`);

  var output = "";

  for (const combination of combinations) {
    const combinationString = combination.join('');
    const counter = {};
    for (const c of combinationString) {
      counter[c] = (counter[c] || 0) + 1;
    }

    // Validate that each needed node is only present twice
    var hasValidCount = true;
    for (const node in counter) {
      if (counter[node] != 2 && (need.includes(node) || boostTwice)) {
        console.log(`Discarding ${JSON.stringify(combination)}`);
        hasValidCount = false
      }
    }
    if (!hasValidCount) {
      continue;
    }

    const needSet = new Set(need);
    const haveSet = new Set(Object.getOwnPropertyNames(counter));
    const hasUniqueStartingNodes = (new Set(combination.map(n => n[0]))).size == nodeCount;
    if (isSuperset(haveSet, needSet) && hasUniqueStartingNodes) {
      console.log(`Found ${JSON.stringify(combination)}`);
      output += combination.join(', ') + '\n';
    }
  }

  const outputDiv = document.getElementById('output');
  if (output == "") {
    output = "No combinations found.";
  }
  outputDiv.innerText = output;
});


function isSuperset(set, subset) {
  for (let elem of subset) {
      if (!set.has(elem)) {
          return false;
      }
  }
  return true;
}

/**
 * Generate all combinations of an array.
 * @param {Array} sourceArray - Array of input elements.
 * @param {number} comboLength - Desired length of combinations.
 * @return {Array} Array of combination arrays.
 */
function generateCombinations(sourceArray, comboLength) {
  const sourceLength = sourceArray.length;
  if (comboLength > sourceLength) return [];

  const combos = []; // Stores valid combinations as they are generated.

  // Accepts a partial combination, an index into sourceArray,
  // and the number of elements required to be added to create a full-length combination.
  // Called recursively to build combinations, adding subsequent elements at each call depth.
  const makeNextCombos = (workingCombo, currentIndex, remainingCount) => {
    const oneAwayFromComboLength = remainingCount == 1;

    // For each element that remaines to be added to the working combination.
    for (let sourceIndex = currentIndex; sourceIndex < sourceLength; sourceIndex++) {
      // Get next (possibly partial) combination.
      const next = [...workingCombo, sourceArray[sourceIndex]];

      if (oneAwayFromComboLength) {
        // Combo of right length found, save it.
        combos.push(next);
      }
      else {
        // Otherwise go deeper to add more elements to the current partial combination.
        makeNextCombos(next, sourceIndex + 1, remainingCount - 1);
      }
    }
  }

  makeNextCombos([], 0, comboLength);
  return combos;
}