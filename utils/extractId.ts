type ExtractParams<T extends string> =
  T extends `${infer Prefix}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : T extends `${infer Prefix}:${infer Param}`
    ? { [K in Param]: string }
    : {};

function nextjsExtractor<Pattern extends string>(
  urlPattern: Pattern,
  url: string
): ExtractParams<Pattern> | null {
  const paramNames = urlPattern.match(/:[a-zA-Z0-9_]+/g) || [];
  const regexPattern = urlPattern.replace(
    /:[a-zA-Z0-9_]+/g,
    "([a-zA-Z0-9_.]+)"
  );
  const regex = new RegExp(regexPattern);
  const match = url.match(regex);

  if (match) {
    const extractedValues = match.slice(1);

    if (extractedValues.length !== paramNames.length) {
      throw new Error(
        "Mismatch in the number of extracted values and placeholders."
      );
    }

    const result = {} as any;
    paramNames.forEach((paramName: string, index: number) => {
      const paramNameKey = paramName.slice(1) as keyof ExtractParams<Pattern>;
      const extractedValue = extractedValues[index];
      result[paramNameKey] = extractedValue;
    });

    return result as ExtractParams<Pattern>;
  }

  return null;
}

export default nextjsExtractor;
