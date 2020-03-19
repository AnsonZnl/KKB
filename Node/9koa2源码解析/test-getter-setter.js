const obj = {
    info: {
        name: 'znl',
        age: '18'
    },
    get name(){
        // 挂载到obj上
        return this.info.name;
    },
    set age(val){
        //加如自己的业务逻辑
        this.info.age = val + '岁';
    }
}
console.log(obj.name)// "znl"
obj.age = 20;
console.log(obj.info.age);// 20岁
