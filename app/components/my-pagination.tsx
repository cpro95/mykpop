import { Link } from "@remix-run/react";

type PaginationType = {
  q?: string | undefined | null;
  page: number;
  itemsPerPage: number;
  total_pages: number;
  sorting?: string | undefined | null;
  id?: string | undefined | null;
  role?: string | undefined | null;
};

export default function MyPagination({
  q,
  page,
  itemsPerPage,
  total_pages,
  sorting,
  id,
  role,
}: PaginationType) {
  const leftArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );

  const rightArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  const linkStyle =
    "px-2 sm:px-3 py-1 sm:py-2 mx-1 sm:mx-1 text-sm text-dodger-800 transition-colors duration-200 transform bg-white rounded-md sm:inline dark:bg-dodger-900 dark:text-dodger-200 hover:bg-dodger-500 dark:hover:bg-dodger-500 hover:text-white dark:hover:text-dodger-200";

  const currentLinkStyle =
    "px-2 sm:px-3 py-1 sm:py-2 mx-1 sm:mx-1 text-sm text-dodger-100 rounded-md sm:inline bg-dodger-500 text-white dark:bg-dodger-500 dark:text-dodger-200";

  // 섹션에 아무것도 없을 때 에러 처리
  if (total_pages === 0) total_pages = 1;

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 mb-8 -ml-4 flex justify-evenly py-4 sm:justify-start"
    >
      {/* <Link
        to={`?${q ? "q=" + q : ""}&page=${1}&itemsPerPage=${itemsPerPage}${sorting ? "&sorting=" + sorting : ""}${
          id ? "&id=" + id : ""
        }${role ? "&role=" + role : ""}`}
        className={linkStyle}
      >
        <span className='sr-only'>First</span>
        {leftDoubleArrow}
      </Link> */}

      <Link
        to={`?${q ? "q=" + q : ""}&page=${
          page === 1 ? 1 : page - 1
        }&itemsPerPage=${itemsPerPage}${sorting ? "&sorting=" + sorting : ""}${
          id ? "&id=" + id : ""
        }${role ? "&role=" + role : ""}`}
        className={linkStyle}
      >
        <span className="sr-only">Previous</span>
        {leftArrow}
      </Link>

      {page === 3 ? (
        <Link
          to={`?${q ? "q=" + q : ""}&page=1&itemsPerPage=${itemsPerPage}${
            sorting ? "&sorting=" + sorting : ""
          }${id ? "&id=" + id : ""}${role ? "&role=" + role : ""}`}
          className={linkStyle}
        >
          1
        </Link>
      ) : (
        <></>
      )}

      {/* 처음 ... 보여주기 */}
      {page > 3 ? (
        <>
          <Link
            to={`?${q ? "q=" + q : ""}&page=1&itemsPerPage=${itemsPerPage}${
              sorting ? "&sorting=" + sorting : ""
            }${id ? "&id=" + id : ""}${role ? "&role=" + role : ""}`}
            className={linkStyle}
          >
            1
          </Link>
          <button disabled className={linkStyle}>
            ...
          </button>
        </>
      ) : (
        <></>
      )}

      {/* 이전 페이지인데 1페이지만 스킵 */}
      {page !== 1 ? (
        <Link
          to={`?${q ? "q=" + q : ""}&page=${
            page - 1
          }&itemsPerPage=${itemsPerPage}${
            sorting ? "&sorting=" + sorting : ""
          }${id ? "&id=" + id : ""}${role ? "&role=" + role : ""}`}
          className={linkStyle}
        >
          {page - 1}
        </Link>
      ) : (
        <></>
      )}

      {/* 현재 페이지 */}
      <Link
        to={`?${q ? "q=" + q : ""}&page=${page}&itemsPerPage=${itemsPerPage}${
          sorting ? "&sorting=" + sorting : ""
        }${id ? "&id=" + id : ""}${role ? "&role=" + role : ""}`}
        className={currentLinkStyle}
      >
        {page}
      </Link>

      {/* 다음 페이지인데 끝에서 두번째만 아니면 보여준다. */}
      {page < total_pages - 1 ? (
        <Link
          to={`?${q ? "q=" + q : ""}&page=${
            page + 1
          }&itemsPerPage=${itemsPerPage}${
            sorting ? "&sorting=" + sorting : ""
          }${id ? "&id=" + id : ""}${role ? "&role=" + role : ""}`}
          className={linkStyle}
        >
          {page + 1}
        </Link>
      ) : (
        <></>
      )}

      {/* 마지막 ... 보여주기 */}
      {page < total_pages - 2 ? (
        <button disabled className={linkStyle}>
          ...
        </button>
      ) : (
        <></>
      )}

      {/* 마지막 페이지 보여주기 */}
      {page !== total_pages ? (
        <Link
          to={`?${
            q ? "q=" + q : ""
          }&page=${total_pages}&itemsPerPage=${itemsPerPage}${
            sorting ? "&sorting=" + sorting : ""
          }${id ? "&id=" + id : ""}${role ? "&role=" + role : ""}`}
          className={linkStyle}
        >
          {total_pages}
        </Link>
      ) : (
        <></>
      )}

      <Link
        to={`?${q ? "q=" + q : ""}&page=${
          page === total_pages ? total_pages : page + 1
        }&itemsPerPage=${itemsPerPage}${sorting ? "&sorting=" + sorting : ""}${
          id ? "&id=" + id : ""
        }${role ? "&role=" + role : ""}`}
        className={linkStyle}
      >
        <span className="sr-only">Next</span>
        {rightArrow}
      </Link>

      {/* <Link
        to={`?${q ? "q=" + q : ""}&page=${total_pages}&itemsPerPage=${itemsPerPage}${sorting ? "&sorting=" + sorting : ""}${
          id ? "&id=" + id : ""
        }${role ? "&role=" + role : ""}`}
        className={linkStyle}
      >
        <span className='sr-only'>Last</span>
        {rightDoubleArrow}
      </Link> */}
    </nav>
  );
}
