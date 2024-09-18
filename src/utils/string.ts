const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const toInstanceName = (str: string) => {
  const camelCased = toCamelCase(str);
  return camelCased.charAt(0).toLowerCase() + camelCased.slice(1);
};

const toConstantCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Adiciona _ entre letras minúsculas e maiúsculas
    .replace(/-/g, '_') // Substitui - por _
    .toUpperCase(); // Converte tudo para maiúsculas
};

export { toCamelCase, toInstanceName, toConstantCase };
