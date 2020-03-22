

// arr = [13,1,2,5,3,8,11]
// sum = 18
// // 找到一个就行
// // leetcode 第一题 （简单版）
// function findSum(arr, sum){

//   let obj = {}
//   // 只遍历了一次  O（n）
//   // {5:0(索引)， 17：1， 16：2}
//   arr.forEach((v,i)=>{
//     if(String(v) in obj ){
//       console.log('找到了')
//       console.log(obj[v],i)
//     }
//     obj[sum-v] = i
//   })

//   // let x = 0
//   // 两层遍历  时间复杂度O(n^2) 量级 
//   // O表示量级， 不考虑常数 低阶  
//   // 理解算法最重要的概念
//   // for (let i = 0; i < arr.length; i++) {
//   //   for (let j = 0; j < arr.length; j++) {
//   //     if(i!==j && arr[i]+arr[j]==sum){
//   //       console.log(i,j,arr[i],arr[j])
//   //     }
//   //     x++
//   //   }
//   // }
//   // 遍历的时候，我们知道缺啥
//   // console.log(x)

// }
// findSum(arr,sum)



// // 数组搜索，
// // foreach  find  for(x in xxs)

// 排序


// arr = [3,44,13,8,9,7,1,2]

// let x = 0
// while(x<100000){
//   arr.push(Math.random())
//   x++
// }
// 排序
// arr.sort((a,b)=>a-b) 封装的很好了
// 抛离开语言， 原始的能力，只有按照索引找元素，交换元素位置，对比大小
// console.
// 冒泡排序 个高到个矮 依次排序
// 依次对比，如果你的个头比右边高，和他交互位置
// 冒泡复杂度是多少 O（n^2）
// 已经冒泡3次  剩下3个位置，下次循环不用遍历了
// n^2
// function bubbleSort(arr){
//   for(let j=0;j<arr.length-1;j++){
//     for(let i=0;i<arr.length-1-j;i++){
//       if(arr[i] > arr[i+1]){
//         let temp = arr[i]
//         arr[i] = arr[i+1]
//         arr[i+1]=temp
//       }
//     }
//   }

//   console.log(arr)
// }

// console.time('bubblesort')

// bubbleSort(arr)
// console.timeEnd('bubblesort')


// // 快速排序

// // 排队的时候，随便找一个人，大圣，遍历一次，比大盛瘦的，站大盛左边，  否则站右边

// // let arr1 = [10,3,44,13,8,9,11,18,27,7,1,2]
// // let arr1 = [10,3,44,13,8]
// // 复杂度 O(n * lgn )

// // 2的4次方等yu16
// // lg16 = 4
// // function quickSort(arr){
// //   if(arr.length<1){
// //     // 队列只有一个人，或者空，是没有必要排序的
// //     return arr
// //   }
// //   let flag = arr[0]
// //   let right = []
// //   let left = []
// //   for(let i =1;i<arr.length;i++){
// //     if(arr[i]>flag){
// //       right.push(arr[i])
// //     }else{
// //       left.push(arr[i])
// //     }
// //   }
// //   // 递归
// //   // return quickSort(left).concat([flag]).concat(quickSort(right))
// //   return [...left, flag, ...right]
// // }
// // console.log(quickSort(arr1))
// let arr2 = [5,7,2,3,9,4,1,6]
// // [7,3,2,1,8,9,10,18,27,11,13,44]
// // 10 
// // 优化占用空间的算法
// function quickSort(arr){
//   // 原地快排
//   if(arr.length<=1){
//     // 递归终止条件
//     return arr
//   }
//   let flag = arr[0]
//   let i =1
//   let j = arr.length-1

//   while(i<j){
//     while(arr[j]>=flag && i<j){
//       j--
//     }
//     while(arr[i]<=flag && i<j){
//       i++
//     }  
//     // 右边找到一个比flag小的，左边一个比他大的
//     let temp = arr[i]
//     arr[i] = arr[j]
//     arr[j]=temp
//   }
//   // flag交换正确的位置上
//   let temp = arr[0]
//   arr[0] = arr[j]
//   arr[j]=temp
//   // 
//   // console.log(arr,i,j)
//   // return [...quickSort()]
//   return quickSort(arr.slice(0,i)).concat([flag]).concat(quickSort(arr.slice(j+1)))
// }
// 没有占用过多的精简
// console.log(quickSort(arr2))
// 空间占用太多

// 10,3,44,13,8

// 1.     
  // quickSort([3,8])  ([3,8])  10  quickSort([44,13])
  
  // quickSort([]) 3 quickSort([8])
  // [3,8]

  // let obj = {
  //   name:'kaikeba',
  //   age:12
  // }

class HashTable{
  constructor(){
    // 松散的
    this.table=[]
  }
  calcuteHash(key){
    let hash = 0
    for(let s of key){
      hash += s.charCodeAt()
    }
    // 0~9的是一个数字
    return hash*17 % 100
  }
  get(key){
    let hash = this.calcuteHash(key)
    return this.table[hash]
  }
  put(key,val){
    let hash = this.calcuteHash(key)
    this.table[hash] = val
  }
  // remove(){
}
// let hash = new HashTable()
// hash.put('kaikeba',10)
// hash.put('javascript',6)

// console.log(hash.get('kaikeba'))
// let h = hash.calcuteHash('kaikeba')
// let h1 = hash.calcuteHash('javascript')
// console.log(h,h1)
// // 两个key算hash的结果，是一样的，发生了碰撞
// 1. 扩容
// 2. 存储链表
// 特点：
//   查找元素 O（1）
//   新增元素
//   删除元素

//   1. 存储空间大
//   2. 碰撞后 扩容


// 二分搜索
// let arr5 = [1,2,3,5,7,10,11,13,15,18,20,23]
// function search(arr, item){
//   let low = 0
//   let high = arr.length-1
//   let mid
//   let element
//   while(low<=high){
//      mid = Math.floor((low+high)/2)
//      element = arr[mid]
//      if(element<item){
//        low = mid+1
//      }else if(element>item){
//        high = mid -1
//      }else{
//        return mid
//      }
//   }
//   return -1
// }
// console.log(search(arr5, 20))


// [1,1,2,3,5,8,13,21]
function fib(n){
  if(n==1 || n==2){
    return 1
  }
  return fib(n-1) + fib(n-2)
}
function fib1(n){
  let arr = []
  return fibCache(arr, n)
  // 带临时存储的
}
function fibCache(arr, n){
  if(n==1 || n==2){
    return 1
  }
  if(arr[n]) return arr[n]
  arr[n] = fibCache(arr, n-1) + fibCache(arr, n-2)
  return arr[n]
}

function fib3(n){
  // 递归是从上到下
  // 动态规划，从下到上
  let dp = [1,1]
  for(let i=3;i<=n;i++){
    dp[i] = dp[i-1] + dp[i-2]
  }
  return dp[n]
}
// console.time('fib')
// console.log(fib1(145))
// console.timeEnd('fib')
// console.log(fib(10))
// fib(7)

//       f5 +       f6
//   f3+f4        f5+f4



function pack(w,val,capacity,n){
	let T = []
	for(let i = 0;i < n;i++){
		T[i] = [];
		for(let j=0;j <= capacity;j++){
			if(j === 0){ //容量为0
				T[i][j] = 0;
				continue;
			}	
			if(j < w[i]){ //容量小于物品重量，本行hold不住
				if(i === 0){
					T[i][j] = 0; // i = 0时，不存在i-1，所以T[i][j]取0

				}else{
					T[i][j] = T[i-1][j]; //容量小于物品重量，参照上一行
				}
				continue;
			}
			if(i === 0){
				T[i][j] = val[i]; //第0行，不存在 i-1, 最多只能放这一行的那一个物品
			}else{
				T[i][j] = Math.max(val[i] + T[i-1][j-w[i]],T[i-1][j]);
			}
		}

    }
    console.log(123,T)
	findValue(w,val,capacity,n,T);
	return T;
}

//找到需要的物品
function findValue(w,val,capacity,n,T){
	var i = n-1, j = capacity;
	while ( i > 0 && j > 0 ){
		if(T[i][j] != T[i-1][j]){
			console.log('选择物品'+i+',重量：'+ w[i] +',价值：' + values[i]);
			j = j- w[i];
			i--;
		}else{
			i--;  //如果相等，那么就到 i-1 行
		}
	}
	if(i == 0 ){
		if(T[i][j] != 0){ //那么第一行的物品也可以取
			console.log('选择物品'+i+',重量：'+ w[i] +',价值：' + values[i]);
		}
	}
}

var values = [3,4,5],
	weights = [2,3,4],
	capacity = 5,
	n = values.length;

console.log(pack(weights,values,capacity,n));