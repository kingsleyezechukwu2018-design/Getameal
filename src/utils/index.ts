import { PaginateParams, PaginateResult, PaginateResultMeta } from "./types";

export const handlePaginate = ({
  page,
  per_page,
  sort,
}: PaginateParams): PaginateResult => {
  let Page: number = page ? Number(page) : 1;
  let perPage: number = per_page ? Number(per_page) : 20;

  const meta = (count: number): PaginateResultMeta => {
    const totalPages: number = Math.ceil(count / perPage);
    const nextPage = Page + 1 <= totalPages ? Page + 1 : null;
    const prevPage = Page > 1 ? Page - 1 : null;

    return {
      totalPages,
      prevPage,
      currentPage: Page,
      nextPage,
      totalData: count,
    };
  };

  return {
    sort,
    skip: Page >= 1 ? (Page - 1) * perPage : 0,
    limit: perPage,
    meta,
  };
};
