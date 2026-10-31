import React, { useCallback, useMemo } from 'react';
import useTags, { useAddTag } from 'Tags/useTags';
import { InputChanged } from 'typings/inputs';
import sortByProp from 'Utilities/Array/sortByProp';
import TagInput, { TagBase } from './TagInput';

interface MovieTag extends TagBase {
  id: number;
  name: string;
}

export interface MovieTagInputProps<V> {
  name: string;
  value: V;
  onChange: (change: InputChanged<V>) => void;
}

const VALID_TAG_REGEX = new RegExp('[^-_a-z0-9]', 'i');

function isValidTag(tagName: string) {
  try {
    return !VALID_TAG_REGEX.test(tagName);
  } catch {
    return false;
  }
}

function useMovieTags(tags: number[]) {
  const tagList = useTags();

  return useMemo(() => {
    const sortedTags = [...tagList].sort(sortByProp('label'));
    const filteredTagList = sortedTags.filter((tag) => !tags.includes(tag.id));

    return {
      tags: tags.reduce((acc: MovieTag[], tag) => {
        const matchingTag = tagList.find((t) => t.id === tag);

        if (matchingTag) {
          acc.push({
            id: tag,
            name: matchingTag.label,
          });
        }

        return acc;
      }, []),

      tagList: filteredTagList.map(({ id, label: name }) => {
        return {
          id,
          name,
        };
      }),

      allTags: sortedTags,
    };
  }, [tagList, tags]);
}

export default function MovieTagInput<V>({
  name,
  value,
  onChange,
}: MovieTagInputProps<V>) {
  const { mutate: addTag } = useAddTag();
  const isArray = Array.isArray(value);

  const arrayValue = useMemo(() => {
    if (isArray) {
      return value as number[];
    }

    return value === 0 ? [] : [value as number];
  }, [isArray, value]);

  const { tags, tagList, allTags } = useMovieTags(arrayValue);

  const handleTagCreated = useCallback(
    (tag: { id: number }) => {
      if (isArray) {
        onChange({ name, value: [...value, tag.id] as V });
      } else {
        onChange({
          name,
          value: tag.id as V,
        });
      }
    },
    [name, value, isArray, onChange]
  );

  const handleTagAdd = useCallback(
    (newTag: MovieTag) => {
      if (newTag.id) {
        if (isArray) {
          onChange({ name, value: [...value, newTag.id] as V });
        } else {
          onChange({ name, value: newTag.id as V });
        }

        return;
      }

      const existingTag = allTags.some((t) => t.label === newTag.name);

      if (isValidTag(newTag.name) && !existingTag) {
        addTag({ label: newTag.name }, { onSuccess: handleTagCreated });
      }
    },
    [name, value, isArray, allTags, handleTagCreated, onChange, addTag]
  );

  const handleTagDelete = useCallback(
    ({ index }: { index: number }) => {
      if (isArray) {
        const newValue = value.slice();
        newValue.splice(index, 1);

        onChange({ name, value: newValue as V });
      } else {
        onChange({ name, value: 0 as V });
      }
    },
    [name, value, isArray, onChange]
  );

  return (
    <TagInput
      name={name}
      tags={tags}
      tagList={tagList}
      onTagAdd={handleTagAdd}
      onTagDelete={handleTagDelete}
    />
  );
}
