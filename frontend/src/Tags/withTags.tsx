import React, { ComponentType } from 'react';
import { Tag } from './Tag';
import useTags from './useTags';

interface WithTagsProps {
  tagList: Tag[];
}

// For components that are not function components, such as the connected
// class components that still read the tags through props.
function withTags<P extends object>(
  WrappedComponent: ComponentType<P & WithTagsProps>
) {
  function WithTags(props: P) {
    const tagList = useTags();

    return <WrappedComponent {...props} tagList={tagList} />;
  }

  return WithTags;
}

export default withTags;
