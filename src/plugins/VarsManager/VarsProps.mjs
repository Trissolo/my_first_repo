import VarsIds from "./VarsIds.mjs"

// export default {
//     BOOLS: 1,
//     TWOBIT: 3,
//     NIBBLE: 0xF,
//     BYTE: 0xFF
// }


export default new Map([
    [VarsIds.BOOLS, {
        bitmask: 1,
        size: 1
    }],
    [
        VarsIds.TWOBIT, {
            bitmask: 0b11,
            size: 2
        }
    ],
    [
        VarsIds.NIBBLE, {
            bitmask: 0b1111,
            size:4
        }
    ],
    [
        VarsIds.BYTE, {
            bitmask: 0xff,
            size: 8
        }
    ]
]);
