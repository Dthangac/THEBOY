import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req, res) => {
    try {
      const { itemId, size, color } = req.body;
      const userId = req.user._id; 
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      const itemIndex = cart.items.findIndex(
        (item) => item.itemId.toString() === itemId && item.size === size && item.color === color
      );
  
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ itemId, size, color, quantity: 1 });
      }
  
      await cart.save();
      res.json({ success: true, message: "Added to cart", cartData: cart.items });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  
  // Cập nhật số lượng
  const updateCart = async (req, res) => {
    try {
      const { itemId, size, color, quantity } = req.body;
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId });
  
      if (cart) {
        const itemIndex = cart.items.findIndex(
          (item) => item.itemId.toString() === itemId && item.size === size && item.color === color
        );
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
          await cart.save();
          res.json({ success: true, cartData: cart.items });
        }
      }
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }