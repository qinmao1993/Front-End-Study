// class 应用案例-完整的购物车系统
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
            (item) => item.product.id === product.id
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
            (item) => item.product.id === productId
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
