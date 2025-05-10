//泛型: 不预先设定类型，在使用的时候确定
// 好处：1. 增强程序的拓展性 2. 不必写多条函数重载，联合类型声明 3. 灵活控制类型之间的约束

// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);

// 泛型接口
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identityFn<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identityFn;

// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

// 泛型约束
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingIdentity({ length: 10, value: 3 });