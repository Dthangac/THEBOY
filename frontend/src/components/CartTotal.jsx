import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"TỔNG"} text2={"GIỎ HÀNG"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Tổng phụ</p>
          <p>
            {getCartAmount()} {currency}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Phí vận chuyển</p>
          <p>
            {delivery_fee} {currency}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Tổng cộng</b>
          <b>
            {" "}
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}{" "}
            {currency}
          </b>
        </div>
      </div>
    </div>
  );
}

export default CartTotal
