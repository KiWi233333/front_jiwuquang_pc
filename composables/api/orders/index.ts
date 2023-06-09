import { Result, Sort, isTrue } from "@/types/result";
import { IPage } from "~/types";

/**
 * 获取订单列表(参数分页)
 * @param page 
 * @param size 
 * @param dto 
 * @returns 
 */
export function getOrderPageByDTO(status: OrdersStatus, page: number, size: number, dto: OrdersPageDTO) {
  return useHttp.post<Result<IPage<OrderInfoVO>>>(`/orders/${status}/${page}/${size}`)
}

/**
 * 获取全部订单(分页)
 * @param page 
 * @param size 
 * @param dto 
 * @returns 
 */
export function getAllOrderPage(page: number, size: number, dto: OrdersPageDTO) {
  return useHttp.post<Result<IPage<OrderInfoVO>>>(`/orders/${page}/${size}`)
}
// 订单列表信息
export interface OrderInfoVO {
  id: string;
  userId: string;
  userAddress?: any;
  status: number;
  remark: string;
  spendPrice: number;
  totalPrice: number;
  paidTime: string;
  createTime: string;
  updateTime: string;
  ordersItems: OrdersItemVO[];
}
interface Good {
  id: string;
  name: string;
  description: string;
  postage: number;
}
interface GoodsSkuVO {
  id: string;
  image: string;
  size: string;
  color: string;
  combo: string;
  stock: number;
  price: number;
  costPrice: number;
}
// 订单子项
export interface OrdersItemVO {
  skuId: string;
  quantity: number;
  reducePrice: number;
  finalPrice: number;
  activityId?: any;
  shopId?: any;
  address?: any;
  goods: Good;
  goodsSku: GoodsSkuVO;
}
// 订单分页参数
export interface OrdersPageDTO {
  id: string,
  name: string,
  shopId: string,
  startTime: string,
  endTime: string
}

// 订单状态参数
export enum OrdersStatus {
  UN_PAID = 0, // "待付款"
  PAID = 1, // "已付款"
  DELIVERED = 2, // "已发货"
  RECEIVED = 3, // "已收货"
  COMMENTED = 4, // "已评价"
  CANCELED = 5, // "已取消"
  DELAY_CANCELED = 6, // "已超时取消"
  REFUND = 7, // "发起退款"
  REFUND_SUCCESS = 8, // "退款成功并取消"
}



/**
 * 获取订单详细信息
 * @param id 订单id
 * @returns 
 */
export function getOrdersInfoById(id: string) {
  return useHttp.get<Result<OrderInfoVO>>(`/orders/${id}`)
}


/**
 * 提交订单
 * @param addressId 
 * @param items 
 * @param remark 
 * @param token 
 * @returns 
 */
export function addOrdersByDto(addressId: string, items: PushOrdersItemDTO[], remark: string, token: string) {
  return useHttp.post<Result<string>>(`/orders/`, {
    addressId,
    items: [...items],
    remark
  }, {
    headers: {
      "Authorization": token
    }
  })
}
// 添加订单类型
export interface PushOrdersDTO {
  addressId: string;
  items: PushOrdersItemDTO[];
  remark: string;
}
// 添加订单子项类型
export interface PushOrdersItemDTO {
  skuId: string;
  quantity: number;
  shopId?: any;
  couponId?: any;
  activityId?: any;
}

/**
 * 修改订单
 * @param addressId 
 * @param remark 
 * @param token 
 * @returns 
 */
export function updateOrders(addressId: string, remark: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/`, {
    addressId,
    remark
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 支付订单
 * @param type 
 * @param points 
 * @param voucherId 
 * @param token 
 * @returns 
 */
export function payOrders(type: PayType, points: number, voucherId: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/pay/`, {
    type,
    points,
    voucherId
  }, {
    headers: {
      "Authorization": token
    }
  })
}

export enum PayType {
  WEALLET = 0,
}
/**
 * 取消订单
 * @param id 
 * @param token 
 * @returns 
 */
export function cancelOrders(id: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/cancel/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 申请退款
 * @param id 
 * @param token 
 * @returns 
 */
export function refundOrders(id: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/refund/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 获取发货信息
 * @param id 
 * @param token 
 * @returns 
 */
export function getDelivertOrders(id: string, token: string) {
  return useHttp.get<Result<string>>(`/orders/delivery/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}


/**
 * 确认收货
 * @param id 
 * @param token 
 * @returns 
 */
export function checkDeliveryOrders(id: string, token: string) {
  return useHttp.put<Result<string>>(`/orders/delivery/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}




export function deleteOrders(id: string, token: string) {
  return useHttp.deleted<Result<string>>(`/orders/${id}`, {
  }, {
    headers: {
      "Authorization": token
    }
  })
}

/**
 * 订单评论
 * @param dto OrderComment[]
 * @param token 
 * @returns 
 */
export function toOrdersComment(dto: OrderComment[], token: string) {
  return useHttp.post<Result<string>>(`/orders/comment`, {
    dto
  }, {
    headers: {
      "Authorization": token
    }
  })
}
export interface OrderComment {
  orderItemId: string,
  content: string,
  rate: 0,
  images: string,
  video: string,
  isRecommend: 0,
  isAnonymous: 0
}




