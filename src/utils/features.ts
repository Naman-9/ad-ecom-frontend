import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type ResType =
  | {
      data: MessageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
    res: ResType,
    navigate: NavigateFunction | null,
    url: string
) => {

    if("data" in res) {
        toast.success(res.data.message);
        if(navigate) navigate(url);
    } else {
        const err = res.error as FetchBaseQueryError;
        const messageResponse = err.data as MessageResponse;
        toast.error(messageResponse.message); 
    }
};

export const getLastMonths = () => {

    const currentDate = moment();

    // current month's date "1" 
    currentDate.date(1);

    const last6Month: string[] = [];
    const last12Month: string[] = [];

    for(let i = 0; i<6; i++) {
        // from current date subtract i
        const monthDate = currentDate.clone().subtract(i, "months");
        // take that in format MMMM
        const monthName = monthDate.format("MMMM");

        // push from starting
        last6Month.unshift(monthName);
    }
    for(let i = 0; i<12; i++) {
        const monthDate = currentDate.clone().subtract(i, "months");
        const monthName = monthDate.format("MMMM");

        last12Month.unshift(monthName);
    }

    return {last12Month, last6Month}
}