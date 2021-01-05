// 不产生新数组，删除数组里的重复元素
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    let i = 0;
    for(let j = 1; j < nums.length; j++) {
        if(nums.indexOf(nums[j]) === j) {
            i++;
            nums[i] = nums[j];
        }
    }
    nums.splice(i+1)
    return nums;
};

console.log(removeDuplicates([1,1]))