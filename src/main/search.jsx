import React from 'react';

export const Search = ({ handleChange, submit, searchState }) => {
  return (
    <form onSubmit={submit}>
      <input
        onChange={handleChange}
        value={searchState}
        placeholder='Type an artist name'
        />
    </form>
  )
};
