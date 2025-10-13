"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  isClientSide?: boolean;
  onPageChange?: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  basePath,
  isClientSide = false,
  onPageChange,
}: PaginationProps) {
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const getPageLink = (page: number): string => {
    if (page < 1 || page > totalPages) return "#";
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  };

  const handleClientClick = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;
      if (onPageChange) {
        onPageChange(page);
      }
    },
    [onPageChange, totalPages, currentPage]
  );

  if (totalPages <= 1) return null;

  const renderPageButton = (page: number) => {
    const isDisabled = page === currentPage;

    const className = `px-4 py-2 rounded-lg font-semibold transition-colors ${
      isDisabled
        ? "bg-yellow-500 text-gray-900 cursor-default"
        : "bg-gray-800 hover:bg-gray-700"
    }`;

    if (isClientSide) {
      return (
        <button
          key={page}
          onClick={() => handleClientClick(page)}
          disabled={isDisabled}
          className={className}
          aria-current={isDisabled ? "page" : undefined}
        >
          {page}
        </button>
      );
    }
    if (isDisabled) {
      return (
        <span
          key={page}
          className={`${className} cursor-default`}
          aria-current="page"
        >
          {page}
        </span>
      );
    }

    return (
      <Link
        key={page}
        href={getPageLink(page)}
        scroll={false}
        className={className}
        aria-current={isDisabled ? "page" : undefined}
      >
        {page}
      </Link>
    );
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-10 text-white">
      {isClientSide ? (
        <button
          onClick={() => handleClientClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
            currentPage === 1
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 hover:bg-yellow-500 hover:text-gray-900"
          }`}
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>
      ) : (
        <Link
          href={getPageLink(currentPage - 1)}
          scroll={false}
          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
            currentPage === 1
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 hover:bg-yellow-500 hover:text-gray-900"
          }`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : 0}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      )}

      {pages.map(renderPageButton)}

      {isClientSide ? (
        <button
          onClick={() => handleClientClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
            currentPage === totalPages
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 hover:bg-yellow-500 hover:text-gray-900"
          }`}
          aria-disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <Link
          href={getPageLink(currentPage + 1)}
          scroll={false}
          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
            currentPage === totalPages
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 hover:bg-yellow-500 hover:text-gray-900"
          }`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : 0}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
