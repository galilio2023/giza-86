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

export class NotFoundError extends DomainError {
  constructor(message: string = "العنصر المطلوب غير موجود") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class OutOfStockError extends DomainError {
  constructor(message: string = "الكمية المطلوبة غير متوفرة في المخزن") {
    super(message, 400, "OUT_OF_STOCK");
    this.name = "OutOfStockError";
  }
}

export class StoreClosedError extends DomainError {
  constructor(message: string = "نعتذر، المتجر لا يستقبل طلبات جديدة حالياً") {
    super(message, 400, "STORE_CLOSED");
    this.name = "StoreClosedError";
  }
}

export class CouponError extends DomainError {
  constructor(message: string = "كوبون الخصم غير صالح أو منتهي الصلاحية") {
    super(message, 400, "COUPON_INVALID");
    this.name = "CouponError";
  }
}

export class ConflictError extends DomainError {
  constructor(message: string = "البيانات المدخلة مستخدمة بالفعل") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class InvalidStatusTransitionError extends DomainError {
  constructor(message: string = "تغيير حالة الطلب غير مسموح به") {
    super(message, 400, "INVALID_STATUS_TRANSITION");
    this.name = "InvalidStatusTransitionError";
  }
}
