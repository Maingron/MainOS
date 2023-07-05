var resultContainer, expressionContainer;

function getExpression() {
    let expression = document.getElementById("expression").value;
    return expression;
}

function calculate() {
    if(stripExpression() == 1) {
        calculate();
        console.log("we aborting");
        return;
    }

    let result = eval(getExpression());

    if(isNaN(result)) {
        result = 0;
    }

    resultContainer.value = result;
    return result;
}

function stripExpression() {
    let expression = getExpression();
    let strippedExpression = expression.replace(/[^-()\d/*+.%^]/g, '');

    expressionContainer.value = strippedExpression;

    if(expression != strippedExpression) {
        return 1;
    } else {
        return 0;
    }

}

function typeButton(value) {
    if(value == "C") {
        clear();
        return;
    } else if(value == "=") {
        calculate();
        return;
    } else if(value == "backspace") {
        expressionContainer.value = expressionContainer.value.slice(0, -1);
        calculate();
        return;
    }

    expressionContainer.value += value;
    calculate();
}



function clear() {
    expressionContainer.value = "";
    calculate();
}


function spawnCalculatorElements() {
    document.getElementsByClassName("content")[0].innerHTML = `
    <div class="calculator">
        <div class="result">
            <input type="text" id="result" placeholder="Result">
        </div>
        <div class="expression">
            <input type="text" id="expression" placeholder="0" onchange="calculate()">
        </div>
        <div class="buttons">
                <button class="n" onclick="typeButton('1')">1</button>
                <button class="n" onclick="typeButton('2')">2</button>
                <button class="n" onclick="typeButton('3')">3</button>
                <button class="backspace" title="backspace" onclick="typeButton('backspace')"><-</button>
                <button class="c" title="clear" onclick="typeButton('C')">C</button>


                <button class="n" onclick="typeButton('4')">4</button>
                <button class="n" onclick="typeButton('5')">5</button>
                <button class="n" onclick="typeButton('6')">6</button>
                <button class="b" onclick="typeButton('(')">(</button>
                <button class="b" onclick="typeButton(')')">)</button>

                <button class="n" onclick="typeButton('7')">7</button>
                <button class="n" onclick="typeButton('8')">8</button>
                <button class="n" onclick="typeButton('9')">9</button>
                <button class="o" title="Addition" onclick="typeButton('+')">+</button>
                <button class="o" title="Subtraction" onclick="typeButton('-')">-</button>

                <button class="decimal" onclick="typeButton('.')">.</button>
                <button class="n" onclick="typeButton('0')">0</button>
                <button class="e" onclick="typeButton('=')">=</button>
                <button class="o" title="Multiplication" onclick="typeButton('*')">*</button>
                <button class="o" title="Division" onclick="typeButton('/')">/</button>
        </div>
    </div>
    `;

    resultContainer = document.getElementById("result");
    expressionContainer = document.getElementById("expression");

    expressionContainer.addEventListener("keyup", function(event) {
        calculate();
    });

    calculate(); // display initial result of 0

}

spawnCalculatorElements();

// always type in the expression box when typing somewhere

document.addEventListener("keydown", function(event) {
    // if key isn't another key
    if(event.key.length > 1 || event.key == " ") {
        return;
    }
    // if target isnt the expression box
    if(event.target != expressionContainer) {
        expressionContainer.focus();
    }
});

// reset if result is changed
resultContainer.addEventListener("change", function(event) {
    calculate();
});