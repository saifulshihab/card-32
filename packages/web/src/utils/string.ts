// engaze => Engaze
export const getCapitalizedText = (text?: string) => {
  return text
    ? text[0].toUpperCase() + text.substring(1).toLowerCase()
    : undefined;
};

// "" => undefined
export const getValueOrUndefined = (value?: string | number) =>
  value === "" ? undefined : value;

// snake_case_text => snake case text
export const getSentenceFromSnakeCaseText = (text: string) =>
  text.replace(/_/g, " ");
