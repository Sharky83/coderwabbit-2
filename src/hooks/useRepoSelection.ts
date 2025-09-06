// Example: custom hook for repo selection
import { useState } from "react";
import { Repo } from "../types/resultsTypes";

export function useRepoSelection(initialRepos: Repo[] = []) {
  const [selected, setSelected] = useState<string>("");
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>(initialRepos);

  return {
    selected,
    setSelected,
    filteredRepos,
    setFilteredRepos
  };
}
