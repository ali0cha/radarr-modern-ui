import React from 'react';
import useTags from 'Tags/useTags';
import TagList from './TagList';

interface MovieTagListProps {
  tags: number[];
}

function MovieTagList({ tags }: MovieTagListProps) {
  const tagList = useTags();

  return <TagList tags={tags} tagList={tagList} />;
}

export default MovieTagList;
