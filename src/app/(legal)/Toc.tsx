"use client";

import Link from "next/link";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentProps {
  sections: Section[];
}

const TableOfContent = ({ sections }: TableOfContentProps) => {
  return (
    <div className="w-64 p-6 bg-gray-100 dark:bg-gray-800 text-white shadow-lg rounded-lg border-border border-2">
      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">Table of Contents</h3>
      <ul className="space-y-4 sticky top-24">
        {sections.map((section) => (
          <li key={section.id}>
            <Link href={`#${section.id}`} className="text-gray-800 dark:text-gray-300 hover:text-blue-400">
              {`${sections.indexOf(section) + 1}. ${section.title}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContent;
