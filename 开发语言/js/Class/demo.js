// 案例1-完整的购物车系统
class ShoppingCart {
    constructor() {
        this.items = [];
        this.discount = 0;
    }
    get subtotal() {
        return this.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
    }
    get total() {
        const subtotal = this.subtotal;
        const discountAmount = subtotal * (this.discount / 100);
        return subtotal - discountAmount;
    }
    get itemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(
            (item) => item.product.id === product.id,
        );
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                product,
                quantity,
                addedAt: new Date(),
            });
        }
        return this;
    }
    removeItem(productId, quantity = 1) {
        const itemIndex = this.items.findIndex(
            (item) => item.product.id === productId,
        );
        if (itemIndex !== -1) {
            if (this.items[itemIndex].quantity <= quantity) {
                this.items.splice(itemIndex, 1);
            } else {
                this.items[itemIndex].quantity -= quantity;
            }
        }
        return this;
    }
    applyDiscount(percentage) {
        this.discount = Math.min(100, Math.max(0, percentage));
        return this;
    }
    clear() {
        this.items = [];
        this.discount = 0;
        return this;
    }
    checkout() {
        const receipt = {
            items: this.items.map((item) => ({
                product: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                total: item.product.price * item.quantity,
            })),
            subtotal: this.subtotal,
            discount: this.discount,
            total: this.total,
            checkoutTime: new Date(),
        };
        this.clear();
        return receipt;
    }
}

class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

const cart = new ShoppingCart();
const product1 = new Product(1, "笔记本电脑", 5000);
const product2 = new Product(2, "鼠标", 100);

cart.addItem(product1, 1).addItem(product2, 2).applyDiscount(10);

console.log(`商品数量: ${cart.itemCount}`); // 商品数量: 3
console.log(`总金额: ${cart.total}`); // 总金额: 4680

const receipt = cart.checkout(); // 结账小票
console.log(receipt);

// 案例2-事件系统实现
class EventEmitter {
    constructor() {
        // 使用 Map 存储事件名与回调数组的映射
        this._events = new Map();
    }

    /**
     * 监听事件
     * @param {string} event 事件名
     * @param {Function} callback 回调函数
     */
    on(event, callback) {
        if (!this._events.has(event)) {
            this._events.set(event, []);
        }
        this._events.get(event).push(callback);
    }

    /**
     * 取消监听事件
     * @param {string} event 事件名
     * @param {Function} callback 要移除的回调（不传则移除该事件全部回调）
     */
    off(event, callback) {
        if (!this._events.has(event)) return;

        if (!callback) {
            // 移除该事件的所有监听
            this._events.delete(event);
        } else {
            const callbacks = this._events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
            if (callbacks.length === 0) this._events.delete(event);
        }
    }

    /**
     * 触发事件
     * @param {string} event 事件名
     * @param {...any} args 传递给回调的参数
     */
    emit(event, ...args) {
        if (!this._events.has(event)) return;

        // 拷贝一份回调数组，防止在回调中修改原数组导致问题
        const callbacks = [...this._events.get(event)];
        for (const callback of callbacks) {
            callback.apply(this, args);
        }
    }

    /**
     * 一次性监听事件
     * @param {string} event 事件名
     * @param {Function} callback 回调函数
     */
    once(event, callback) {
        const onceWrapper = (...args) => {
            callback.apply(this, args);
            this.off(event, onceWrapper);
        };
        // 保留原始回调的引用，方便在需要时通过 off 移除
        onceWrapper._originalCallback = callback;
        this.on(event, onceWrapper);
    }
}

class User extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }

    login() {
        // 模拟登录成功，触发 'login' 事件，并传递用户名
        this.emit("login", this.name);
    }

    logout() {
        this.emit("logout", this.name);
    }
}

// 使用
const user = new User("Alice");

// 监听登录事件
user.on("login", (name) => {
    console.log(`${name} 登录了`);
});

// 一次性监听登出事件
user.once("logout", (name) => {
    console.log(`${name} 登出，仅触发一次`);
});

user.login(); // 输出：Alice 登录了
user.logout(); // 输出：Alice 登出，仅触发一次
user.logout(); // 无输出，因为 once 绑定的回调已移除
