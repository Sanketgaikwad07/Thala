import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(req: Request): PaginationParams {
  const page = Math.max(parseInt(String(req.query.page ?? '1'), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '20'), 10) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

export function paginate<T>(items: T[], { page, limit, skip }: PaginationParams) {
  const total = items.length;
  const data = items.slice(skip, skip + limit);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      hasNextPage: skip + limit < total,
    },
  };
}
