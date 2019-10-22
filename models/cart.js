module.exports = function Cart(oldCart) {
    this.item = oldCart.items || {},
    this.totalQty = oldCart.totalQty || 0,
    this.totalPrice = oldCart.totalPrice || 0

    this.add = function(item, id) {
        var storedItem = this.item(id)
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0}
        }
        storedItem.qty++
        storedItem.price = storedItem.item.price * storedItem.qty
        this.totalQty++
        this.totalPrice += storedItem.price
    }

    this.generateArray = function() {
        var arr = []
        for ( var id in this.item) {
            arr.push(this.item[id])
        }
        return arr
    }
}