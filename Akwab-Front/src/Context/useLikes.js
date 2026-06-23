import { useContext } from "react";
import { LikesContext } from "./LikesContext";

export function useLikes() {
    return useContext(LikesContext);
}