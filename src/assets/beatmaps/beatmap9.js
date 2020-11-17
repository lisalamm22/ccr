

//{ pos: [850, 200], time: 3000, type: "DRAG", length: 100, dir: 30 }
//60 length = 1000 milliseconds
//100 length = 1.6 seconds
//30 is 2
//0 is 3
//270 is 6
//180 is 9
//90 is 12

//9 sunflower
const Beatmap = [
    { pos: [0.8, 0.55], time: 1153},
    { pos: [0.70, 0.70], time: 1737},
    { pos: [0.6, 0.55], time: 2404},
    { pos: [0.5, 0.7], time: 3038},
    { pos: [0.51, 0.39], time: 3666},
    { pos: [0.59, 0.48], time: 4350},
    { pos: [0.71, 0.41], time: 5034},
    { pos: [0.79, 0.53], time: 5668},
    { pos: [0.78, 0.33], time: 6351},
    { pos: [0.66, 0.42], time: 7019},
    { pos: [0.57, 0.50], time: 7719},
    { pos: [0.44, 0.56], time: 8420},
    { pos: [0.46, 0.82], time: 9043},
    { pos: [0.37, 0.72], time: 9677},
    { pos: [0.38, 0.50], time: 10328},
    { pos: [0.28, 0.39], time: 10995},
    { pos: [0.34, 0.18], time: 11674, type: "DRAG", length: 230,dir:0},
    { pos: [0.65, 0.28], time: 14357},
    { pos: [0.79, 0.41], time: 15049},
    { pos: [0.86, 0.60], time: 15666},
    { pos: [0.75, 0.80], time: 16359},
    { pos: [0.54, 0.7], time: 17027},
    { pos: [0.49, 0.6], time: 17719},
    { pos: [0.5, 0.44], time: 18336},
    { pos: [0.45, 0.34], time: 19003},
    { pos: [0.34, 0.32], time: 19671},
    { pos: [0.28, 0.4], time: 20355},
    { pos: [0.24, 0.49], time: 21022},
    { pos: [0.18, 0.6], time: 21623},
    { pos: [0.11, 0.38], time: 22383, type: "DRAG", length: 230,dir:30},

    
    { pos: [0.36, 0.14], time: 25057},
    { pos: [0.50, 0.14], time: 25724},
    { pos: [0.62, 0.14], time: 26375},
    { pos: [0.72, 0.14], time: 27043},

    { pos: [0.62, 0.28], time: 27660, type: "DRAG", length: 70,dir:270},

    { pos: [0.72, 0.43], time: 29095},
    { pos: [0.74, 0.57], time: 29729},

//

    { pos: [0.66, 0.72], time: 30322},
    { pos: [0.6, 0.86], time: 31006},
    { pos: [0.58, 0.67], time: 31707},
    { pos: [0.52, 0.78], time: 32374},
    { pos: [0.46, 0.85], time: 33058, type: "DRAG", length: 70,dir:90},
    { pos: [0.31, 0.63], time: 34359},
    { pos: [0.23, 0.49], time: 34977},

    // stopping point 1:53am

    { pos: [0.27, 0.63], time: 35764},
    { pos: [0.40, 0.59], time: 36481},
    { pos: [0.48, 0.8], time: 37132},
    { pos: [0.40, 0.59], time: 37766},
    { pos: [0.33, 0.43], time: 38302, type: "DRAG", length: 70,dir:20},
    { pos: [0.55, 0.28], time: 39654},
    { pos: [0.68, 0.19], time: 40388},
    
    

    { pos: [0.59, 0.25], time: 41040},
    { pos: [0.65, 0.41], time: 41757},
    { pos: [0.53, 0.55], time: 42408},
    { pos: [0.65, 0.41], time: 43109},
    //
    { pos: [0.71, 0.56], time: 43719, type: "DRAG", length: 70,dir:110},
    { pos: [0.65, 0.32], time: 45008},
    { pos: [0.57, 0.23], time: 45642},

//stopping point 12:23pm
    { pos: [0.65, 0.17], time: 46356},
    { pos: [0.81, 0.20], time: 47023},
    { pos: [0.90, 0.30], time: 47757},
    { pos: [0.81, 0.20], time: 48358},

    { pos: [0.64, 0.36], time: 49087, type: "DRAG", length: 70,dir:280},

    { pos: [0.74, 0.44], time: 50400},
    { pos: [0.74, 0.58], time: 51050},

    { pos: [0.69, 0.60], time: 51732, type: "DRAG", length: 70,dir:190},

    { pos: [0.57, 0.57], time: 53036},
    { pos: [0.53, 0.49], time: 53703},


    { pos: [0.61, 0.39], time: 54368},
    { pos: [0.45, 0.35], time: 54986},
    { pos: [0.35, 0.49], time: 55653},
    { pos: [0.28, 0.42], time: 56337},
    { pos: [0.27, 0.29], time: 57004},
    { pos: [0.36, 0.27], time: 57689},
    { pos: [0.27, 0.29], time: 58373},
    { pos: [0.14, 0.28], time: 59073},
    { pos: [0.15, 0.15], time: 59714, type: "DRAG", length: 400,dir:330},
    { pos: [0.79, 0.69], time: 65058, type: "DRAG", length: 400,dir:150},

    //
    { pos: [0.36, 0.11], time: 70443},
    { pos: [0.27, 0.27], time: 71077},
    { pos: [0.19, 0.39], time: 71727},
    { pos: [0.13, 0.54], time: 72445},
    { pos: [0.27, 0.55], time: 73045},
    { pos: [0.39, 0.55], time: 73763},
    { pos: [0.30, 0.43], time: 74380},
    { pos: [0.20, 0.31], time: 75048},
    { pos: [0.11, 0.18], time: 75698},
    { pos: [0.18, 0.33], time: 76449},
    { pos: [0.31, 0.22], time: 77067},
    { pos: [0.19, 0.33], time: 77801},
    { pos: [0.26, 0.44], time: 78401},
    { pos: [0.36, 0.32], time: 79085},
    { pos: [0.46, 0.20], time: 79703},
    { pos: [0.52, 0.35], time: 80404},
    { pos: [0.52, 0.51], time: 81054},
    { pos: [0.65, 0.51], time: 81755},
    { pos: [0.63, 0.41], time: 82439},
    { pos: [0.75, 0.31], time: 83123},
    { pos: [0.68, 0.20], time: 83791},
    { pos: [0.54, 0.21], time: 84370},

    { pos: [0.58, 0.39], time: 85004, type: "DRAG", length: 70,dir:90},
    { pos: [0.45, 0.35], time: 86339},
    { pos: [0.36, 0.48], time: 87106},

    { pos: [0.49, 0.47], time: 87740, type: "DRAG", length: 70,dir:180},
    { pos: [0.37, 0.62], time: 89042},
    { pos: [0.50, 0.62], time: 89759},

    { pos: [0.50, 0.72], time: 96400},
    { pos: [0.60, 0.62], time: 97712},
    { pos: [0.70, 0.52], time: 98997},
    { pos: [0.80, 0.42], time: 100348},
    { pos: [0.90, 0.32], time: 101649},


    { pos: [0.89, 0.19], time: 103069, type: "DRAG", length: 70,dir:270},
    { pos: [0.79, 0.35], time: 104387, type: "DRAG", length: 70,dir:90},
    { pos: [0.68, 0.19], time: 105722, type: "DRAG", length: 70,dir:270},
    { pos: [0.60, 0.35], time: 107090, type: "DRAG", length: 70,dir:90},
    { pos: [0.51, 0.19], time: 108375, type: "DRAG", length: 70,dir:270},
    { pos: [0.41, 0.35], time: 109760, type: "DRAG", length: 70,dir:90},
    { pos: [0.34, 0.19], time: 111078, type: "DRAG", length: 70,dir:270},
    { pos: [0.26, 0.30], time: 112379, type: "DRAG", length: 70,dir:90},

    { pos: [0.15, 0.31], time: 113623, type: "DRAG", length: 230,dir:315},
    { pos: [0.33, 0.71], time: 116309, type: "DRAG", length: 230,dir:0},
    { pos: [0.67, 0.71], time: 118928, type: "DRAG", length: 230,dir:0},
    { pos: [0.85, 0.39], time: 121732, type: "DRAG", length: 230,dir:45},





    { pos: [0.40, 0.27], time: 125760},
    { pos: [0.27, 0.44], time: 127078},
    { pos: [0.37, 0.60], time: 128296},
    { pos: [0.48, 0.46], time: 129698},
    { pos: [0.36, 0.26], time: 131049},
    { pos: [0.52, 0.26], time: 132401},
    { pos: [0.51, 0.44], time: 133735},
    { pos: [0.62, 0.42], time: 135070},
    { pos: [0.61, 0.24], time: 136405},
    { pos: [0.78, 0.23], time: 137723},
    { pos: [0.62, 0.41], time: 139008},
    { pos: [0.76, 0.39], time: 140409},
    { pos: [0.77, 0.58], time: 141661},
    { pos: [0.60, 0.58], time: 143096},
    { pos: [0.59, 0.42], time: 144414},   

];
module.exports = Beatmap