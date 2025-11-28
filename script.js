// === STATE VARIABLES ===
let currentOperand = ""; // The number currently being built/displayed (as a string)
let previousOperand = null; // The first number in the operation
let operation = null; // Stores the pending operator (+, -, x, ÷)
let isNewInput = true; // Flag to clear the display when a new number starts

// === DOM ELEMENTS ===
const outputDisplay = document.getElementById("output");
const numberButtons = document.querySelectorAll(
  ".number-btn, .footer .button:not(#decimalBtn, #equalBtn)"
); // Selects 1-9 and 0
// This targets the IDs and the 'x' button by its position (you can add an ID if you prefer)
const operatorButtons = document.querySelectorAll(
  "#addBtn, #minusBtn, #divideBtn, #multiplyBtn"
);

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let op = button.textContent;

    // Map the HTML symbols to standard internal operators
    if (op === "x") op = "*";
    if (op === "÷") op = "/";

    // Call the core function that saves the first number and the operator
    setOperator(op);
  });
});
const equalsButton = document.getElementById("equalBtn");
const clearButton = document.getElementById("btnAC");
const decimalButton = document.getElementById("decimalBtn");
const negativeBtn = document.getElementById("negativeBtn");
const percentBtn = document.getElementById("percentBtn");

// === CORE FUNCTIONS ===

// 1. Update the Display
function updateDisplay() {
  // If output is completely empty, set it to '0' to look cleaner
  outputDisplay.textContent =
    currentOperand === "" && previousOperand === null ? "0" : currentOperand;
}

// 2. Append Number
function appendNumber(number) {
  if (isNewInput) {
    // Clear previous number if starting a new calculation or after pressing an operator
    currentOperand = number;
    isNewInput = false;
  } else {
    // Prevent leading zero unless it's a decimal
    if (currentOperand === "0" && number !== ".") {
      currentOperand = number;
    } else {
      currentOperand += number;
    }
  }
  updateDisplay();
}

// 3. Set Operator (The logic for '+', '-', 'x', '÷')
function setOperator(op) {
  // Ignore if the display is empty
  if (currentOperand === "") return;

  // If an operation is already pending (previousOperand is set), calculate the result first
  if (previousOperand !== null && operation !== null) {
    calculate();
  }

  // Capture the number currently on screen as the first operand
  previousOperand = parseFloat(currentOperand);
  operation = op; // Store the new operator
  currentOperand = ""; // Clear current operand to prepare for the second number
  isNewInput = true; // Set flag to clear display when the next number is pressed
}

// 4. Calculate Result (The logic for '=')
// 4. Calculate Result (The logic for '=')
function calculate() {
  // 1. Get the second number from the display
  const secondOperand = parseFloat(currentOperand);

  // Safety check: don't proceed if state is not ready
  if (isNaN(previousOperand) || isNaN(secondOperand) || operation === null)
    return;

  let computation;
  const prev = previousOperand;
  const current = secondOperand;

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-": // <-- Subtraction
      computation = prev - current;
      break;
    case "*": // <-- Multiplication (uses the '*' stored from the 'x' button)
      computation = prev * current;
      break;
    case "/": // <-- Division (uses the '/' stored from the '÷' button)
      // Critical: Prevent division by zero
      if (current === 0) {
        currentOperand = "Toog 0-t huvaaj bolku mal mini"; // Or "Divide by zero"
        operation = null;
        previousOperand = null;
        isNewInput = true;
        updateDisplay();
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }

  // 2. Display the result and reset for the next calculation
  currentOperand = computation.toString();
  operation = null;
  previousOperand = null;
  isNewInput = true;
  // Inside your calculate() function, just before updating the display:

  // ... after calculating the result:
  // let computation; // ... calculation happens here

  // Step 1: Round the result to a manageable number of decimal places (e.g., 10)
  const roundedResult = parseFloat(computation.toFixed(10));

  // Step 2: Display the rounded result (which is now a normal-looking number)
  currentOperand = roundedResult.toString();

  // ... rest of the calculate function
  updateDisplay();
}

// 5. Clear All (The logic for 'AC')
function clearAll() {
  currentOperand = "";
  previousOperand = null;
  operation = null;
  isNewInput = true;
  updateDisplay();
}

// 6. Handle Decimal ('.')
function appendDecimal() {
  // If starting a new input, ensure we start with "0."
  if (isNewInput) {
    currentOperand = "0.";
    isNewInput = false;
  }
  // Only allow one decimal point
  else if (!currentOperand.includes(".")) {
    currentOperand += ".";
  }
  updateDisplay();
}
function toggleNegative() {
  // 1. Check if there is anything to toggle (not empty and not "Error")
  if (currentOperand === "" || currentOperand === "Error") {
    return;
  }

  // 2. Convert the current string number to an actual number
  let numberValue = parseFloat(currentOperand);

  // 3. Multiply by -1 to flip the sign (4 becomes -4, -4 becomes 4)
  numberValue *= -1;

  // 4. Update the state variable with the new number (converted back to a string)
  currentOperand = numberValue.toString();

  // 5. Update the display for the user
  updateDisplay();
}
function percent() {
  if (currentOperand === "" || currentOperand === "Error") {
    return;
  }
  let numberValue = parseFloat(currentOperand);
  numberValue /= 100;
  currentOperand = numberValue.toString();
  updateDisplay();
}
// === EVENT LISTENERS ===

// 1. Number Buttons (including '0' using its class/position)
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.textContent);
  });
});

// 2. Operator Buttons (+, -, x, ÷)
// This targets the IDs and the 'x' button by its position (you can add an ID if you prefer)
// const operatorButtons = document.querySelectorAll("#addBtn, #minusBtn, #divideBtn, .button:nth-child(8)");

// operatorButtons.forEach(button => {
//     button.addEventListener("click", () => {
//         let op = button.textContent;

//         // Map the HTML symbols to standard internal operators
//         if (op === 'x') op = '*';
//         if (op === '÷') op = '/';

//         // Call the core function that saves the first number and the operator
//         setOperator(op);
//     });
// });

// 3. Equals Button (=)
equalsButton.addEventListener("click", calculate);

// 4. AC Button (All Clear)
clearButton.addEventListener("click", clearAll);
percentBtn.addEventListener("click", percent);

// 5. Decimal Button (.)
decimalButton.addEventListener("click", appendDecimal);
negativeBtn.addEventListener("click", toggleNegative);
// Initialize the display to '0'
updateDisplay();
