function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let swapIndex = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[swapIndex];
        array[swapIndex] = temp
    }
    return array
}

function getIntegerFromInput(input) {
    const value = input.value

    if (value === "") throw "Заполните все поля"

    const number = +value

    if (isNaN(number)) throw "Некорректное число"

    return number
}

function requirePositive(number) {
    if (number >= 0) return number

    throw "Введите положительное число"
}