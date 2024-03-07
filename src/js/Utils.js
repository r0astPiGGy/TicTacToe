function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let swapIndex = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[swapIndex];
        array[swapIndex] = temp
    }
    return array
}