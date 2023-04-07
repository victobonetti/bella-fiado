export function removeAcentosEMaiusculas(inputString:string) {
    // remove os acentos
    const semAcentos = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    // remove as letras maiusculas
    const semMaiusculas = semAcentos.toLowerCase();
  
    return semMaiusculas;
  }

export function excluirLetras(inputString:string) {
    // substitui todas as letras por uma string vazia
    const semLetras = inputString.replace(/[a-zA-Z]/g, '');
  
    return semLetras;
  }