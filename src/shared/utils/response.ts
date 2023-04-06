type Pagination = {
  total: number;
  current: number;
  perPage: number;
};

type Items = { items: any };

type ResponsePayload = Pagination & Items;

export type Response = {
  pagination: Pagination;
  data: Items;
};

export function createResponseWithObject({
  total,
  current,
  perPage,
  items,
}: ResponsePayload): Response {
  return {
    pagination: {
      current: Number(current),
      perPage: Number(perPage),
      total,
    },
    data: items,
  };
}
