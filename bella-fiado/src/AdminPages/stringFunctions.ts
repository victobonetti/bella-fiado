export function removeAcentosEMaiusculas(inputString:string) {
    // remove os acentos
    const semAcentos = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    // remove as letras maiusculas
    const semMaiusculas = semAcentos.toLowerCase();
  
    return semMaiusculas;
  }

export function excluirLetras(inputString:string): number {
    // substitui todas as letras por uma string vazia
    const semLetras = inputString.replace(/[a-zA-Z]/g, '');
  
    return Number(semLetras);
  }

export function capitalize(inputString:string) {
    // Verifica se o primeiro caractere é um número
    if (!isNaN(Number(inputString.charAt(0)))) {
      return inputString; // Retorna a string original sem modificar
    }
  
    // Converte a string para minúsculas
    inputString = inputString.toLowerCase();
  
    // Pega o primeiro caractere e converte para maiúscula
    const firstChar = inputString.charAt(0).toUpperCase();
  
    // Concatena o primeiro caractere maiúsculo com o restante da string em minúsculas
    const restOfString = inputString.slice(1);
  
    // Retorna a string modificada
    return firstChar + restOfString;
  }
  