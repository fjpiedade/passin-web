import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import days from "dayjs";
//import "dayjs/locale/pt";
import relativeTime from "dayjs/plugin/relativeTime";

import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";
//import { attendees } from "../data/attendees";

days.extend(relativeTime);
//days.locale("pt");

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}
export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());
    if (url.searchParams.has("search")) {
      return url.searchParams.get("search") ?? "";
    }
    return "";
  });

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());
    if (url.searchParams.has("page")) {
      return Number(url.searchParams.get("page"));
    }
    return 1;
  });

  const [total, setTotal] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const totalPages = Math.ceil(total / 10);

  //url state

  useEffect(() => {
    const url = new URL(
      "http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees"
    );

    url.searchParams.set("pageIndex", String(page - 1));

    if (search.length > 1) {
      url.searchParams.set("query", search);
    }

    //   `http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees?pageIndex=${
    //     page - 1
    //   }`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data.attendees);
        setAttendees(data.attendees);
        setTotal(data.total);
      });
  }, [page, search]);

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    //console.log(event.target.value);
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());
    url.searchParams.set("page", String(page));
    //window.location.search = searchParams.toString();
    window.history.pushState({}, "", url);
    setPage(page);
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());
    url.searchParams.set("search", search);
    window.history.pushState({}, "", url);
    setSearch(search);
  }

  function gotToNextPage() {
    // // setPage(page + 1);
    // const url = new URL(window.location.toString());
    // url.searchParams.set("page", String(page + 1));
    // //window.location.search = searchParams.toString();
    // window.history.pushState({}, "", url);
    setCurrentPage(page + 1);
  }

  function gotToPreviousPage() {
    // setPage(page - 1);
    setCurrentPage(page - 1);
  }

  function gotToFirstPage() {
    //setPage(1);
    setCurrentPage(1);
  }

  function gotToLastPage() {
    // setPage(totalPages);
    setCurrentPage(totalPages);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Attendee</h1>
        <div className="flex items-center gap-3 px-3 w-72 py-1.5 rounded-lg text-sm border border-white">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChanged}
            value={search}
            className="flex-1 bg-transparent/10 outline-none text-sm h-auto border-0 p-0 focus:ring-0"
            placeholder="Search the Attendees ..."
          />
        </div>
        {/* {search} */}
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                name="item"
                className="size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400"
              />
            </TableHeader>
            <TableHeader>Code</TableHeader>
            <TableHeader>Attendee</TableHeader>
            <TableHeader>Date of Insertion</TableHeader>
            <TableHeader>Date of CheckIn</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>

        <tbody>
          {/* .slice((page - 1) * 10, page * 10) */}
          {attendees.map((attendee) => {
            return (
              <TableRow
                key={attendee.id}
                // className="border-b border-white/10  hover:bg-white/5"
              >
                <TableCell>
                  <input
                    type="checkbox"
                    // name="item"
                    className="size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{days().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-500">Not founded CheckIn</span>
                  ) : (
                    days().to(attendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell /*className="py-3 px-4 text-sm text-zinc-300"*/>
                  {/* <button className="bg-black/20 border border-white/10 rounded-md p-1.5">
                      <MoreHorizontal className="size-4" />
                    </button> */}
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>
        <tfoot>
          <TableRow>
            <TableCell colSpan={3}>
              Show {attendees.length} from {total} items
            </TableCell>
            <TableCell colSpan={3} className="text-right">
              <div className="inline-flex items-center gap-8">
                <span>
                  Page {page} from {totalPages}
                </span>

                <div className="flex gap-1.5">
                  <IconButton onClick={gotToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>

                  <IconButton onClick={gotToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>

                  <IconButton
                    onClick={gotToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={gotToLastPage}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  );
}
