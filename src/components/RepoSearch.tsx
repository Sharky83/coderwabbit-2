import React from "react";
import { Repo } from "../types/resultsTypes";
import styles from "./RepoSearch.module.css";

export interface RepoSearchProps {
  search: string;
  setSearch: (val: string) => void;
  selected: string;
  setSelected: (val: string) => void;
  filteredRepos: Repo[];
}

export const RepoSearch: React.FC<RepoSearchProps> = ({ search, setSearch, selected, setSelected, filteredRepos }) => (
  <div className={styles.container}>
    <input
      type="text"
      placeholder="Search repositories..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={styles.input}
    />
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      size={Math.min(filteredRepos.length, 10)}
      className={styles.select}
    >
      <option value="">Select a repository</option>
      {filteredRepos.map((repo) => (
        <option key={repo.id} value={repo.full_name}>
          {repo.name}
        </option>
      ))}
    </select>
    {/* All repos are loaded automatically, no Load more button needed */}
  </div>
);
