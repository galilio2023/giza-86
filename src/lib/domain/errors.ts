/** Base domain error with HTTP status code and machine-readable error code. */
export class DomainError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code: string = "DOMAIN_ERROR"
  ) {
    super(message);
    this.name = "DomainError";
  }
}

/** Error thrown when a requested domain entity (product, order, category) does not exist. */
export class NotFoundError extends DomainError {
  constructor(message: string = "العنصر المطلوب غير موجود") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/** Error thrown when requested item quantity exceeds available inventory stock. */
export class OutOfStockError extends DomainError {
  constructor(message: string = "الكمية المطلوبة غير متوفرة في المخزن") {
    super(message, 400, "OUT_OF_STOCK");
    this.name = "OutOfStockError";
  }
}

/** Error thrown when checkout is attempted while store is closed or in maintenance mode. */
export class StoreClosedError extends DomainError {
  constructor(message: string = "نعتذر، المتجر لا يستقبل طلبات جديدة حالياً") {
    super(message, 400, "STORE_CLOSED");
    this.name = "StoreClosedError";
  }
}

/** Error thrown when a coupon code is expired, invalid, or fails minimum order threshold. */
export class CouponError extends DomainError {
  constructor(message: string = "كوبون الخصم غير صالح أو منتهي الصلاحية") {
    super(message, 400, "COUPON_INVALID");
    this.name = "CouponError";
  }
}

/** Error thrown when an entity creation conflicts with unique database constraints. */
export class ConflictError extends DomainError {
  constructor(message: string = "البيانات المدخلة مستخدمة بالفعل") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

/** Error thrown when an illegal status change is attempted on an order lifecycle. */
export class InvalidStatusTransitionError extends DomainError {
  constructor(message: string = "تغيير حالة الطلب غير مسموح به") {
    super(message, 400, "INVALID_STATUS_TRANSITION");
    this.name = "InvalidStatusTransitionError";
  }
}

