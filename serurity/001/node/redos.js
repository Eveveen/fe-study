console.time('case-1');
/A(B|C+)+D/.test('ACCCCCCCCCCCCCCCCCCCCCCCCCCCCD');
console.timeEnd('case-1');

console.time('case-2');
/A(B|C+)+D/.test('ACCCCCCCCCCCCCCCCCCCCCCCCCCCCX');
console.timeEnd('case-2');

console.time('case-3');
/A(B|C+)+D/.test(`A${'C'.repeat(30)}X`);
console.timeEnd('case-3');